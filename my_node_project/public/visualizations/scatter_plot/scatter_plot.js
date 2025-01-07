document.addEventListener('DOMContentLoaded', () => {
    const scatterChartContainer = document.getElementById('scatter-chart-container');
    const scatterChart = echarts.init(scatterChartContainer); // 初始化散点图

    // 更新散点图
    const updateScatterChart = (data) => {
        const cities = [...new Set(data.map(item => item.City))]; // 获取所有城市
        const scatterData = cities.map(city => {
            return data
                .filter(item => item.City === city)
                .map(item => [item.month, item.avg_temperature]);
        });

        // 定义城市的颜色数组
        const cityColors = [
            '#FF6F61', // 红色
            '#6B5B95', // 紫色
            '#88B04B', // 绿色
            '#F7CAC9', // 粉色
            '#92A8D1', // 蓝色
            '#955251', // 棕色
            '#B565A7', // 浅紫色
            '#009B77', // 青绿色
            '#DD4124', // 深红色
            '#45B8AC', // 淡青色
        ];

        const option = {
            backgroundColor: '#f4f4f9', // 图表背景颜色
            title: {
                text: '国际城市的月平均温度散点图',
                left: 'center',
                textStyle: {
                    color: '#333',
                    fontSize: 18,
                    fontWeight: 'bold',
                },
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(50, 50, 50, 0.8)', // 提示框背景色
                borderColor: '#777',
                borderWidth: 1,
                textStyle: {
                    color: '#fff',
                },
                formatter: (params) => {
                    return `
                        <strong>城市:</strong> ${params.seriesName}<br>
                        <strong>月份:</strong> ${params.data[0]}月<br>
                        <strong>平均温度:</strong> ${params.data[1]}°C
                    `;
                },
            },
            legend: {
                data: cities,
                bottom: 10,
                textStyle: {
                    color: '#333',
                    fontSize: 12,
                },
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                name: '月份',
                nameLocation: 'middle',
                nameGap: 25,
                nameTextStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#888',
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#555',
                },
            },
            yAxis: {
                type: 'value',
                name: '平均温度 (°C)',
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
                nameGap: 40,
                min: -10,
                max: 40,
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#ccc',
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#888',
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#555',
                },
            },
            series: scatterData.map((data, index) => ({
                name: cities[index],
                type: 'scatter',
                data: data,
                symbolSize: (val) => val[1] > 30 ? 15 : 10, // 根据温度动态调整点大小
                itemStyle: {
                    color: cityColors[index % cityColors.length], // 使用不同颜色
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#333',
                        borderWidth: 2,
                        shadowBlur: 15,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                    },
                },
            })),
        };

        scatterChart.setOption(option);
    };

    // 获取数据并加载图表
    const fetchData = () => {
        fetch('http://localhost:3000/api/data/five-intl-cities/monthly-avg')
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    scatterChartContainer.innerHTML = '没有数据生成散点图';
                    return;
                }
                updateScatterChart(data); // 加载散点图
            })
            .catch(error => {
                console.error('数据加载失败:', error);
                scatterChartContainer.innerHTML = '无法加载散点图';
            });
    };

    // 初次加载数据
    fetchData();
});