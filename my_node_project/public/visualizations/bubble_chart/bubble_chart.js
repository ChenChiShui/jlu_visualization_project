document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart-container');
    const loadingElement = document.getElementById('loading');
    const chart = echarts.init(chartContainer);

    // 获取数据并更新气泡图
    const fetchData = () => {
        loadingElement.style.display = 'block'; // 显示加载提示

        fetch(`http://localhost:3000/api/data/monthly-latitude-temperature`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    loadingElement.textContent = '没有相关数据。';
                    return;
                }

                // 隐藏加载提示
                loadingElement.style.display = 'none';

                // 转换数据为气泡图格式
                const bubbleData = data.map(item => ({
                    value: [item.month - 1, item.latitude, item.avg_temp],
                    symbolSize: Math.abs(item.avg_temp) * 2, // 气泡大小与温度绝对值相关
                }));

                // 提取纬度值并排序（从南到北）
                const latitudeLabels = [...new Set(data.map(item => item.latitude))].sort((a, b) => a - b);

                // 配置气泡图选项
                const option = {
                    backgroundColor: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
                        { offset: 0, color: '#f4f4f9' },
                        { offset: 1, color: '#e0e7ff' },
                    ]), // 使用渐变背景
                    title: {
                        text: `纬度-月份温度分布气泡图`,
                        left: 'center',
                        textStyle: {
                            fontSize: 26,
                            fontWeight: 'bold',
                            color: '#333',
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        borderColor: '#ccc',
                        borderWidth: 1,
                        backgroundColor: 'rgba(50, 50, 50, 0.8)', // 提示框背景色
                        textStyle: {
                            color: '#fff',
                        },
                        formatter: params => {
                            const [month, latitude, temp] = params.data.value;
                            return `
                                <strong>月份:</strong> ${month + 1}月<br>
                                <strong>纬度:</strong> ${latitude}<br>
                                <strong>平均温度:</strong> ${temp.toFixed(2)}°C
                            `;
                        },
                    },
                    xAxis: {
                        type: 'category',
                        name: '月份',
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#555',
                        },
                        nameGap: 25,
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        axisLine: {
                            lineStyle: {
                                color: '#aaa',
                            },
                        },
                        axisLabel: {
                            color: '#555',
                        },
                    },
                    yAxis: {
                        type: 'category',
                        name: '纬度',
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#555',
                        },
                        nameGap: 40,
                        data: latitudeLabels,
                        axisLine: {
                            lineStyle: {
                                color: '#aaa',
                            },
                        },
                        axisLabel: {
                            color: '#555',
                        },
                    },
                    visualMap: {
                        min: -10,
                        max: 40,
                        calculable: true,
                        orient: 'vertical',
                        right: '5%',
                        top: 'center',
                        text: ['高温', '低温'], // 显示的文本
                        inRange: {
                            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                        },
                    },
                    series: [
                        {
                            name: '温度分布',
                            type: 'scatter',
                            data: bubbleData,
                            symbol: 'circle', // 气泡形状
                            itemStyle: {
                                opacity: 0.8, // 气泡透明度
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.3)', // 气泡阴影
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    formatter: param => `温度: ${param.data.value[2].toFixed(1)}°C`,
                                    position: 'top',
                                    color: '#000',
                                    fontWeight: 'bold',
                                },
                                itemStyle: {
                                    borderColor: '#333',
                                    borderWidth: 2,
                                    shadowBlur: 15,
                                    shadowColor: 'rgba(0, 0, 0, 0.6)', // 高亮阴影
                                },
                            },
                        },
                    ],
                };

                chart.setOption(option);
            })
            .catch(error => {
                console.error('数据加载失败:', error);
                loadingElement.textContent = '数据加载失败。';
            });
    };

    // 初次加载数据
    fetchData();
});