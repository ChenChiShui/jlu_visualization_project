document.addEventListener('DOMContentLoaded', () => {
    const radarChartContainer = document.getElementById('radar-chart-container');
    const chart = echarts.init(radarChartContainer); // 初始化雷达图

    // 更新雷达图
    const updateRadarChart = (data) => {
        // 准备雷达图的维度（12个月份）
        const months = [
            '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
        ];

        // 按城市分组数据
        const citiesData = {};
        data.forEach(item => {
            if (!citiesData[item.City]) {
                citiesData[item.City] = new Array(12).fill(null); // 初始化12个月的数据
            }
            // 如果温度为负数，舍弃（设置为 null）
            citiesData[item.City][item.month - 1] = item.avg_temperature >= 0 ? item.avg_temperature : null;
        });

        // 准备雷达图数据
        const radarData = [];
        Object.keys(citiesData).forEach(city => {
            radarData.push({
                name: city,
                value: citiesData[city]
            });
        });

        // 雷达图配置
        const option = {
            title: {
                text: '国际城市的月平均温度雷达图',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                data: Object.keys(citiesData),
                bottom: 10,
            },
            radar: {
                indicator: months.map(month => ({ name: month, max: 40 })), // 假设最大温度为 40°C
                shape: 'circle',
                splitLine: {
                    lineStyle: {
                        color: ['#ddd', '#bbb', '#999', '#777', '#555'],
                    },
                },
                splitArea: {
                    areaStyle: {
                        color: ['#f4f4f9', '#e0e7ff'],
                    },
                },
            },
            series: [
                {
                    name: '城市月平均温度',
                    type: 'radar',
                    data: radarData.map(data => ({
                        value: data.value,
                        name: data.name,
                    })),
                    areaStyle: {
                        opacity: 0.2,
                    },
                    lineStyle: {
                        width: 2,
                    },
                },
            ],
        };

        chart.setOption(option);
    };

    // 获取数据并加载雷达图
    const fetchData = () => {
        fetch('http://localhost:3000/api/data/five-intl-cities/monthly-avg')
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    radarChartContainer.innerHTML = '没有数据生成雷达图';
                    return;
                }
                updateRadarChart(data); // 加载雷达图
            })
            .catch(error => {
                console.error('数据加载失败:', error);
                radarChartContainer.innerHTML = '无法加载雷达图';
            });
    };

    // 初次加载数据
    fetchData();
});