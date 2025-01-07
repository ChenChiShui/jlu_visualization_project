document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart-container');
    const loadingElement = document.getElementById('loading');
    const chart = echarts.init(chartContainer);
// 获取数据并更新热力图
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
                // 转换数据为热力图格式
                const heatmapData = data.map(item => [item.month - 1, item.latitude, item.avg_temp]);
                // 提取纬度值并排序（从南到北）
                const latitudeLabels = [...new Set(data.map(item => item.latitude))];

                // 更新图表
                const option = {
                    title: {
                        text: `纬度-月份温度分布`,
                        left: 'center',
                        textStyle: {
                            fontSize: 24,
                            color: '#333',
                        },
                    },
                    tooltip: {
                        position: 'top',
                        formatter: params => {
                            const [month, latitude, temp] = params.data;
                            return `月份: ${month + 1}<br>纬度: ${latitude}<br>平均温度: ${temp.toFixed(2)}°C`;
                        },
                    },
                    xAxis: {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        splitArea: { show: true },
                    },
                    yAxis: {
                        type: 'category',
                        data: latitudeLabels, // 直接使用后端返回的纬度标签
                        splitArea: { show: true },
                    },
                    visualMap: {
                        min: -10,
                        max: 40,
                        calculable: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        inRange: {
                            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                        },
                    },
                    series: [
                        {
                            name: '温度分布',
                            type: 'heatmap',
                            data: heatmapData,
                            label: { show: false },
                            emphasis: {
                                itemStyle: {
                                    borderColor: '#333',
                                    borderWidth: 1,
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