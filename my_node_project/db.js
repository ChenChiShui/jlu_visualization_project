// db.js
const mysql = require('mysql2');

// 配置数据库连接池
const db = mysql.createPool({
    host: 'localhost',     // 数据库地址
    user: 'root',          // 数据库用户名
    password: '123456',    // 数据库密码
    database: 'experiment',// 数据库名称
    port: 3306             // 数据库端口号
});


db.getConnection((err, connection) => {
    if (err) {
        console.error('数据库连接失败:', err);
    } else {
        console.log('数据库连接成功!');
        connection.release(); // 释放连接
    }
});

module.exports = db;