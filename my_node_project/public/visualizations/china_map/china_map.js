document.addEventListener('DOMContentLoaded', () => {
    // 获取 DOM 元素
    const chartContainer = document.getElementById('chart-container');
    const loadingElement = document.getElementById('loading');
    const yearInput = document.getElementById('year-input');
    const updateButton = document.getElementById('update-button');
    const chart = echarts.init(chartContainer);

    // 初始化年份
    let currentYear = yearInput.value;

    // 检查地图是否正确加载
    if (!echarts.getMap('china')) {
        console.error('China map data is not loaded correctly.');
        loadingElement.textContent = 'Failed to load China map data.';
        return;
    }

    // 获取数据并更新图表
    const fetchData = (year) => {
        loadingElement.style.display = 'block'; // 显示加载提示

        // 示例数据请求地址（替换为你的真实 API 地址）
        fetch(`http://localhost:3000/api/data/${year}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 处理数据
                const scatterData = data
                    .filter(entry => entry.Country === 'China') // 确保只处理中国的数据
                    .map(entry => {
                        const latitude = parseFloat(entry.Latitude.replace('N', '').replace('S', '-'));
                        const longitude = parseFloat(entry.Longitude.replace('E', '').replace('W', '-'));
                        const temperature = parseFloat(entry.AverageTemperature);
                        return {
                            name: entry.City,
                            value: [longitude, latitude, temperature],
                        };
                    });

                // 隐藏加载提示
                loadingElement.style.display = 'none';

                // 更新图表
                const option = {
                    title: {
                        text: `中国温度地图 (${year})`,
                        left: 'center',
                        textStyle: {
                            color: '#333',
                            fontSize: 18,
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: params => {
                            if (params.data) {
                                return `
                                    <b>${params.data.name}</b><br>
                                    Temperature: ${params.data.value[2].toFixed(2)}°C
                                `;
                            }
                            return '';
                        },
                    },
                    geo: {
                        map: 'china',
                        roam: true,
                        itemStyle: {
                            areaColor: '#e0e7ff',
                            borderColor: '#111',
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: '#a5d8ff',
                            },
                        },
                    },
                    visualMap: {
                        min: -30, // 根据中国的气温范围调整
                        max: 50,
                        calculable: true,
                        orient: 'horizontal',
                        left: 'center',
                        bottom: 10,
                        inRange: {
                            color: ['#1E90FF', '#00BFFF', '#FFD700', '#FF8C00', '#FF4500'],
                        },
                        text: ['High', 'Low'],
                    },
                    series: [
                        {
                            name: 'Temperature',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: scatterData,
                            symbolSize: 8,
                        },
                    ],
                };

                chart.setOption(option);
            })
            .catch(error => {
                console.error('数据加载失败:', error);
                loadingElement.textContent = 'Failed to load data.';
            });
    };

    // 初次加载数据
    fetchData(currentYear);

    // 点击按钮更新数据
    updateButton.addEventListener('click', () => {
        currentYear = yearInput.value;
        fetchData(currentYear);
    });
});