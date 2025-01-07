document.addEventListener('DOMContentLoaded', () => {
    // 获取年度数据
    fetch('http://localhost:3000/api/data/changchun/avg-year')
        .then(response => response.json())
        .then(yearData => {
            // 按时间顺序整理年度数据
            const years = yearData.map(entry => entry.year); // 提取年份
            const avgTemperatures = yearData.map(entry => parseFloat(entry.avg_temperature)); // 平均温度
            const avgUncertainties = yearData.map(entry => parseFloat(entry.avg_uncertainty)); // 平均不确定性

            // 初始化年度图表
            const yearChartContainer = document.getElementById('chart-container');
            const yearChart = echarts.init(yearChartContainer);

            // 年度折线图选项
            const yearOption = {
                title: {
                    text: '长春温度按年份的平均值',
                    left: 'center',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(50, 50, 50, 0.7)',
                    borderWidth: 0,
                    textStyle: {
                        color: '#fff',
                    },
                },
                legend: {
                    data: ['平均温度', '平均不确定性'],
                    top: '10%',
                    textStyle: {
                        color: '#333',
                    },
                },
                grid: {
                    top: '20%',
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                },
                xAxis: {
                    type: 'category',
                    data: years,
                    name: '年份',
                    nameTextStyle: {
                        fontSize: 12,
                        color: '#555',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#aaa',
                        },
                    },
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '温度 (°C)',
                    nameTextStyle: {
                        fontSize: 12,
                        color: '#555',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#aaa',
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#ddd',
                        },
                    },
                },
                series: [
                    {
                        name: '平均温度',
                        type: 'line',
                        data: avgTemperatures,
                        smooth: true,
                        lineStyle: {
                            width: 3,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: '#5470C6' },
                                    { offset: 1, color: '#91CC75' },
                                ],
                            },
                        },
                        itemStyle: {
                            color: '#5470C6',
                        },
                        areaStyle: {
                            color: 'rgba(84, 112, 198, 0.2)',
                        },
                    },
                    {
                        name: '平均不确定性',
                        type: 'line',
                        data: avgUncertainties,
                        smooth: true,
                        lineStyle: {
                            width: 3,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 1,
                                colorStops: [
                                    {offset: 0, color: '#dc7c96'},
                                    {offset: 1, color: '#7169ae'},
                                ],
                            },
                        },
                        itemStyle: {
                            color: '#EE6666',
                        },
                    },
                ],
            };

            // 渲染年度图表
            yearChart.setOption(yearOption);

            // 响应式图表
            window.addEventListener('resize', () => {
                yearChart.resize();
            });
        })
        .catch(error => {
            console.error('年度数据加载失败:', error);
        });

    // 获取月份数据
    fetch('http://localhost:3000/api/data/changchun/avg-month')
        .then(response => response.json())
        .then(monthData => {
            // 整理月份数据
            const months = monthData.map(entry => entry.month); // 提取月份
            const avgTemperatures = monthData.map(entry => parseFloat(entry.avg_temperature)); // 平均温度

            // 初始化月份图表
            const monthChartContainer = document.getElementById('month-chart-container');
            const monthChart = echarts.init(monthChartContainer);

            const monthOption = {
                title: {
                    text: '长春温度按月份的平均值',
                    left: 'center',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(50, 50, 50, 0.7)',
                    borderWidth: 0,
                    textStyle: {
                        color: '#fff',
                    },
                },
                grid: {
                    top: '20%',
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                },
                xAxis: {
                    type: 'category',
                    data: months.map(m => `${m}月`), // 格式化月份
                    name: '月份',
                    nameTextStyle: {
                        fontSize: 12,
                        color: '#555',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#aaa',
                        },
                    },
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '温度 (°C)',
                    nameTextStyle: {
                        fontSize: 12,
                        color: '#555',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#aaa',
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#ddd',
                        },
                    },
                },
                series: [
                    {
                        name: '平均温度',
                        type: 'line',
                        data: avgTemperatures,
                        smooth: true,
                        lineStyle: {
                            width: 3,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 1,
                                colorStops: [
                                    {offset: 0, color: '#5470C6'},
                                    {offset: 1, color: '#91CC75'},
                                ],
                            },
                        },
                        itemStyle: {
                            color: '#5470C6',
                        },
                        areaStyle: {
                            color: 'rgba(84, 112, 198, 0.2)',
                        },
                    },
                ],
            };

            // 渲染月份图表
            monthChart.setOption(monthOption);

            // 响应式图表
            window.addEventListener('resize', () => {
                monthChart.resize();
            });
        })
        .catch(error => {
            console.error('月份数据加载失败:', error);
        });
});