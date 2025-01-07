// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 示例 API：查询数据
router.get('/data', (req, res) => {
    const query = 'SELECT * FROM globallandtemperaturesbymajorcity';
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).json({ error: '数据库查询失败' });
        } else {
            res.json(results);
        }
    });
});

// 获取长春的全部信息
router.get('/data/changchun', (req, res) => {
    const query = 'SELECT * FROM globallandtemperaturesbymajorcity WHERE City = "Changchun" ORDER BY dt';
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).json({ error: '数据库查询失败' });
        } else {
            res.json(results);
        }
    });
});
// 长春温度按年平均
router.get('/data/changchun/avg-year', (req, res) => {
    const query = `
        SELECT 
            YEAR(dt) AS year,                              -- 提取年份
            AVG(AverageTemperature) AS avg_temperature,   -- 计算平均温度
            AVG(AverageTemperatureUncertainty) AS avg_uncertainty -- 计算平均不确定性
        FROM 
            globallandtemperaturesbymajorcity
        WHERE 
            City = "Changchun"                            -- 筛选城市为长春
        GROUP BY 
            YEAR(dt)                                      -- 按年份分组
        ORDER BY 
            YEAR(dt) ASC;                                 -- 按年份升序排序
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).json({ error: '数据库查询失败' });
        } else {
            res.json(results); // 返回按年平均的结果
        }
    });
});

// 路由：获取长春月份平均温度数据
router.get('/data/changchun/avg-month', (req, res) => {
    const query = `
        SELECT 
            MONTH(dt) AS month,                           -- 提取月份
            AVG(AverageTemperature) AS avg_temperature,   -- 计算平均温度
            AVG(AverageTemperatureUncertainty) AS avg_uncertainty -- 计算平均不确定性
        FROM 
            globallandtemperaturesbymajorcity
        WHERE 
            City = "Changchun"                            -- 筛选城市为长春
        GROUP BY 
            MONTH(dt)                                     -- 按月份分组
        ORDER BY 
            MONTH(dt) ASC;                                -- 按月份升序排序
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err); // 打印错误日志
            res.status(500).json({ error: '数据库查询失败' }); // 返回错误信息
        } else {
            res.json(results); // 成功则返回查询结果
        }
    });
});
// 查询五个城市的月平均温度
router.get('/data/five-intl-cities/monthly-avg', (req, res) => {
    const query = `
        SELECT 
            City,                                         -- 城市名称
            MONTH(dt) AS month,                          -- 提取月份
            AVG(AverageTemperature) AS avg_temperature   -- 计算月平均温度
        FROM 
            globallandtemperaturesbymajorcity
        WHERE 
            City IN ("Moscow", "Changchun", "Cairo", "Sydney", "New York", "Singapore") -- 筛选五个城市
        GROUP BY 
            City, MONTH(dt)                              -- 按城市和月份分组
        ORDER BY 
            City ASC, MONTH(dt) ASC;                     -- 按城市和月份升序排序
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).json({ error: '数据库查询失败' });
        } else {
            res.json(results); // 返回查询结果
        }
    });
});

router.get('/data/avg-year-classification', (req, res) => {
    const { year } = req.query; // 从请求中读取年份参数

    // 动态构建查询条件
    const yearCondition = year ? `WHERE year = ${db.escape(year)}` : '';

    const query = `
        SELECT
            CASE
                WHEN avg_temp < 0 THEN '<0°'
                WHEN avg_temp >= 0 AND avg_temp < 5 THEN '0°-5°'
                WHEN avg_temp >= 5 AND avg_temp < 10 THEN '5°-10°'
                WHEN avg_temp >= 10 AND avg_temp < 15 THEN '10°-15°'
                WHEN avg_temp >= 15 AND avg_temp < 20 THEN '15°-20°'
                WHEN avg_temp >= 20 AND avg_temp < 25 THEN '20°-25°'
                WHEN avg_temp >= 25 AND avg_temp < 30 THEN '25°-30°'
                ELSE '30°以上'
            END AS temp_range,
            COUNT(DISTINCT City) AS city_count
        FROM (
            SELECT 
                YEAR(dt) AS year, 
                City,
                AVG(AverageTemperature) AS avg_temp
            FROM 
                globallandtemperaturesbymajorcity
            WHERE 
                AverageTemperature IS NOT NULL
            GROUP BY 
                year, City
        ) AS yearly_avg
        ${yearCondition} -- 按年份过滤
        GROUP BY 
            temp_range
        ORDER BY 
            temp_range ASC;
    `;

    // 执行查询
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err); // 打印错误日志
            res.status(500).json({ error: '数据库查询失败', detail: err.message }); // 返回错误信息
        } else {
            res.json(results); // 成功则返回查询结果
        }
    });
});

router.get('/data/monthly-latitude-temperature', (req, res) => {
    const query = `
        SELECT
            Latitude AS latitude, -- 纬度直接使用数据库中的原始格式（如 10N, 10S）
            MONTH(dt) AS month, -- 提取月份
            AVG(AverageTemperature) AS avg_temp -- 计算平均温度
        FROM
            globallandtemperaturesbymajorcity
        WHERE
            AverageTemperature IS NOT NULL
        GROUP BY
            Latitude, MONTH(dt)
        ORDER BY
            CASE
            WHEN RIGHT(Latitude, 1) = 'N' THEN CAST(LEFT(Latitude, LENGTH(Latitude) - 1) AS SIGNED) -- 北纬正序
            WHEN RIGHT(Latitude, 1) = 'S' THEN -CAST(LEFT(Latitude, LENGTH(Latitude) - 1) AS SIGNED) -- 南纬倒序
        END ASC,
            month ASC; -- 按纬度和月份排序
    `;

    // 执行查询
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err); // 打印错误日志
            res.status(500).json({ error: '数据库查询失败', detail: err.message }); // 返回错误信息
        } else {
            res.json(results); // 返回查询结果
        }
    });
});
// 获取某年各城市的平均气温数据
router.get('/data/:year', (req, res) => {
    const year = req.params.year;
    const query = `
    SELECT 
      City, Country, Latitude, Longitude,
      ROUND(AVG(AverageTemperature), 2) AS AverageTemperature
    FROM globallandtemperaturesbymajorcity
    WHERE YEAR(dt) = ?
    GROUP BY City, Country, Latitude, Longitude;
  `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).json({ error: '数据库查询失败' });
        } else {
            res.json(results);
        }
    });
});
router.get('/flow', (req, res) => {
    const query = 'SELECT \n' +
        '  src.City AS SourceCity,\n' +
        '  src.Country AS SourceCountry,\n' +
        '  dest.City AS TargetCity,\n' +
        '  dest.Country AS TargetCountry,\n' +
        '  ROUND(ABS(src.AverageTemperature - dest.AverageTemperature), 2) AS TemperatureDifference\n' +
        'FROM (\n' +
        '  SELECT City, Country, Latitude, Longitude, ROUND(AVG(AverageTemperature), 2) AS AverageTemperature\n' +
        '  FROM globallandtemperaturesbymajorcity\n' +
        '  WHERE YEAR(dt) = 1900\n' +
        '  GROUP BY City, Country, Latitude, Longitude\n' +
        ') src\n' +
        'CROSS JOIN (\n' +
        '  SELECT City, Country, Latitude, Longitude, ROUND(AVG(AverageTemperature), 2) AS AverageTemperature\n' +
        '  FROM globallandtemperaturesbymajorcity\n' +
        '  WHERE YEAR(dt) = 1900\n' +
        '  GROUP BY City, Country, Latitude, Longitude\n' +
        ') dest\n' +
        'LIMIT 100;';
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).json({ error: '数据库查询失败' });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;