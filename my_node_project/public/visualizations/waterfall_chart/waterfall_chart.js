document.addEventListener('DOMContentLoaded', () => {
    // 获取年度数据
    fetch('http://localhost:3000/api/data/changchun/avg-year')
        .then(response => response.json())
        .then(yearData => {
            // 按时间顺序整理年度数据
            const years = yearData.map(entry => entry.year); // 提取年份
            const avgTemperatures = yearData.map(entry => parseFloat(entry.avg_temperature)); // 平均温度

            // 瀑布图数据准备：计算每年的变化值
            const waterfallData = [];
            waterfallData.push(0); // 第一个数据的变化值为 0，表示起点
            for (let i = 1; i < avgTemperatures.length; i++) {
                const change = avgTemperatures[i] - avgTemperatures[i - 1]; // 变化值
                waterfallData.push(change.toFixed(2)); // 保留两位小数
            }

            // 初始化年度图表
            const yearChartContainer = document.getElementById('chart-container');
            const yearChart = echarts.init(yearChartContainer);

            // 年度瀑布图选项
            const yearOption = {
                title: {
                    text: '长春温度按年份的变化',
                    left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(50, 50, 50, 0.8)',
                    textStyle: {
                        color: '#fff',
                    },
                    formatter: params => {
                        let tooltip = `${params[0].axisValue}<br>`;
                        params.forEach(item => {
                            tooltip += `${item.seriesName}: ${item.data}°C<br>`;
                        });
                        return tooltip;
                    },
                },
                grid: {
                    top: '15%',
                    left: '10%',
                    right: '10%',
                    bottom: '15%',
                },
                xAxis: {
                    type: 'category',
                    data: years,
                    name: '年份',
                    nameTextStyle: {
                        fontSize: 14,
                        color: '#555',
                    },
                    axisLabel: {
                        interval: 10, // 每隔10年显示一个标签
                        rotate: 45, // 标签倾斜45度
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
                    name: '温度变化 (°C)',
                    nameTextStyle: {
                        fontSize: 14,
                        color: '#555',
                    },
                    axisLabel: {
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
                        name: '温度变化',
                        type: 'bar',
                        data: waterfallData,
                        itemStyle: {
                            color: params => {
                                if (params.data >= 0) {
                                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#74b9ff' },
                                        { offset: 1, color: '#0984e3' },
                                    ]);
                                } else {
                                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#ff7675' },
                                        { offset: 1, color: '#d63031' },
                                    ]);
                                }
                            },
                            shadowColor: 'rgba(0, 0, 0, 0.2)',
                            shadowBlur: 5,
                        },
                        label: {
                            show: false,
                            position: 'top',
                            formatter: params => {
                                const value = params.data;
                                return Math.abs(value) > 0.5 ? `${value}°C` : ''; // 显示较大变化值
                            },
                            fontSize: 12,
                            color: '#333',
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

            // 瀑布图数据准备：计算每月的变化值
            const waterfallData = [];
            waterfallData.push(0); // 第一个数据的变化值为 0，表示起点
            for (let i = 1; i < avgTemperatures.length; i++) {
                const change = avgTemperatures[i] - avgTemperatures[i - 1]; // 变化值
                waterfallData.push(change.toFixed(2)); // 保留两位小数
            }

            // 初始化月份图表
            const monthChartContainer = document.getElementById('month-chart-container');
            const monthChart = echarts.init(monthChartContainer);

            const monthOption = {
                title: {
                    text: '长春温度按月份的变化',
                    left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(50, 50, 50, 0.8)',
                    textStyle: {
                        color: '#fff',
                    },
                    formatter: params => {
                        let tooltip = `${params[0].axisValue}<br>`;
                        params.forEach(item => {
                            tooltip += `${item.seriesName}: ${item.data}°C<br>`;
                        });
                        return tooltip;
                    },
                },
                grid: {
                    top: '15%',
                    left: '10%',
                    right: '10%',
                    bottom: '15%',
                },
                xAxis: {
                    type: 'category',
                    data: months.map(m => `${m}月`), // 格式化月份
                    name: '月份',
                    nameTextStyle: {
                        fontSize: 14,
                        color: '#555',
                    },
                    axisLabel: {
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
                    name: '温度变化 (°C)',
                    nameTextStyle: {
                        fontSize: 14,
                        color: '#555',
                    },
                    axisLabel: {
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
                        name: '温度变化',
                        type: 'bar',
                        data: waterfallData,
                        itemStyle: {
                            color: params => {
                                if (params.data >= 0) {
                                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#74b9ff' },
                                        { offset: 1, color: '#0984e3' },
                                    ]);
                                } else {
                                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#ff7675' },
                                        { offset: 1, color: '#d63031' },
                                    ]);
                                }
                            },
                            shadowColor: 'rgba(0, 0, 0, 0.2)',
                            shadowBlur: 5,
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: params => {
                                const value = params.data;
                                return Math.abs(value) > 0.5 ? `${value}°C` : ''; // 显示较大变化值
                            },
                            fontSize: 12,
                            color: '#333',
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