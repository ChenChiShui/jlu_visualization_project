document.addEventListener('DOMContentLoaded', () => {
    // 获取数据
    fetch('http://localhost:3000/api/data/changchun/avg-year')
        .then((response) => response.json())
        .then((data) => {
            const years = data.map((entry) => entry.year);
            const avgTemperatures = data.map((entry) => parseFloat(entry.avg_temperature));
            const avgUncertainties = data.map((entry) => parseFloat(entry.avg_uncertainty));

            const chartContainer = document.getElementById('chart-container');
            const chart = echarts.init(chartContainer);

            const option = {
                title: {
                    text: '长春温度按年份的平均值',
                    left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    backgroundColor: 'rgba(50, 50, 50, 0.8)',
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
                    left: '8%',
                    right: '8%',
                    bottom: '10%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    data: years,
                    name: '年份',
                    nameTextStyle: {
                        fontSize: 14,
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
                    axisLabel: {
                        fontSize: 12,
                        color: '#555',
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '温度 (°C)',
                    nameTextStyle: {
                        fontSize: 14,
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
                        type: 'bar',
                        data: avgTemperatures,
                        barWidth: '40%',
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#5470C6' }, // 渐变起点
                                { offset: 1, color: '#91CC75' }, // 渐变终点
                            ]),
                            barBorderRadius: [6, 6, 0, 0], // 圆角柱状
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#91CC75', // 鼠标悬停高亮颜色
                            },
                        },
                        animationDelay: (idx) => idx * 20, // 动态加载动画
                    },
                    {
                        name: '平均不确定性',
                        type: 'bar',
                        data: avgUncertainties,
                        barWidth: '40%',
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#EE6666' }, // 渐变起点
                                { offset: 1, color: '#FFB199' }, // 渐变终点
                            ]),
                            barBorderRadius: [6, 6, 0, 0], // 圆角柱状
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#FFB199', // 鼠标悬停高亮颜色
                            },
                        },
                        animationDelay: (idx) => idx * 20 + 50, // 动态加载动画
                    },
                ],
                animationEasing: 'elasticOut', // 动画缓冲效果
                animationDelayUpdate: (idx) => idx * 50,
            };

            chart.setOption(option);
            window.addEventListener('resize', () => chart.resize());
        })
        .catch((error) => {
            console.error('数据加载失败:', error);
        });

    // 月份数据图表
    fetch('http://localhost:3000/api/data/changchun/avg-month')
        .then((response) => response.json())
        .then((data) => {
            const months = data.map((entry) => `${entry.month}月`);
            const avgTemperatures = data.map((entry) => parseFloat(entry.avg_temperature));

            const chartContainer = document.getElementById('chart-container-mouth');
            const chart = echarts.init(chartContainer);

            const option = {
                title: {
                    text: '长春温度按月份的平均值',
                    left: 'center',
                    textStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    backgroundColor: 'rgba(50, 50, 50, 0.8)',
                    textStyle: {
                        color: '#fff',
                    },
                },
                grid: {
                    top: '20%',
                    left: '8%',
                    right: '8%',
                    bottom: '10%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    data: months,
                    name: '月份',
                    nameTextStyle: {
                        fontSize: 14,
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
                    axisLabel: {
                        fontSize: 12,
                        color: '#555',
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '温度 (°C)',
                    nameTextStyle: {
                        fontSize: 14,
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
                        type: 'bar',
                        data: avgTemperatures,
                        barWidth: '40%',
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#5470C6' },
                                { offset: 1, color: '#91CC75' },
                            ]),
                            barBorderRadius: [6, 6, 0, 0],
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#91CC75',
                            },
                        },
                        animationDelay: (idx) => idx * 100,
                    },
                ],
                animationEasing: 'elasticOut',
                animationDelayUpdate: (idx) => idx * 50,
            };

            chart.setOption(option);
            window.addEventListener('resize', () => chart.resize());
        })
        .catch((error) => {
            console.error('数据加载失败:', error);
        });
});