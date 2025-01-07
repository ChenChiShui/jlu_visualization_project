document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart-container');
    const loadingElement = document.getElementById('loading');
    const yearInput = document.getElementById('year-input');
    const updateButton = document.getElementById('update-button');
    const chart = echarts.init(chartContainer);

    // 初始化年份
    let currentYear = yearInput.value;

    // 检查地图是否正确加载
    if (!echarts.getMap('world')) {
        console.error('World map data is not loaded correctly.');
        loadingElement.textContent = 'Failed to load world map data.';
        return;
    }

    // 获取数据并更新图表
    const fetchData = (year) => {
        loadingElement.style.display = 'block'; // 显示加载提示

        fetch(`http://localhost:3000/api/data/${year}`)
            .then(response => response.json())
            .then(data => {
                // 处理数据并区分东西南北半球
                const scatterData = {
                    northernHemisphere: [],
                    southernHemisphere: [],
                    easternHemisphere: [],
                    westernHemisphere: [],
                };

                data.forEach(entry => {
                    // 解析纬度
                    const latitude = entry.Latitude.includes('N')
                        ? parseFloat(entry.Latitude.replace('N', '')) // 北纬为正
                        : -parseFloat(entry.Latitude.replace('S', '')); // 南纬为负

                    // 解析经度
                    const longitude = entry.Longitude.includes('E')
                        ? parseFloat(entry.Longitude.replace('E', '')) // 东经为正
                        : -parseFloat(entry.Longitude.replace('W', '')); // 西经为负

                    const temperature = parseFloat(entry.AverageTemperature);

                    const point = {
                        name: entry.City,
                        value: [longitude, latitude, temperature],
                        country: entry.Country,
                    };

                    // 分类数据
                    if (latitude >= 0) {
                        scatterData.northernHemisphere.push(point);
                    } else {
                        scatterData.southernHemisphere.push(point);
                    }

                    if (longitude >= 0) {
                        scatterData.easternHemisphere.push(point);
                    } else {
                        scatterData.westernHemisphere.push(point);
                    }
                });

                // 隐藏加载提示
                loadingElement.style.display = 'none';

                // 更新图表
                const option = {
                    title: {
                        text: `世界温度地图 (${year}) - 东西南北半球`,
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
                                    <b>${params.data.name}, ${params.data.country}</b><br>
                                    Temperature: ${params.data.value[2].toFixed(2)}°C
                                `;
                            }
                            return '';
                        },
                    },
                    geo: {
                        map: 'world',
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
                        min: -10,
                        max: 40,
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
                            name: '北半球',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: scatterData.northernHemisphere,
                            symbolSize: 8,
                            itemStyle: {
                                color: '#1E90FF',
                            },
                        },
                        {
                            name: '南半球',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: scatterData.southernHemisphere,
                            symbolSize: 8,
                            itemStyle: {
                                color: '#FF4500',
                            },
                        },
                        {
                            name: '东半球',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: scatterData.easternHemisphere,
                            symbolSize: 8,
                            itemStyle: {
                                color: '#32CD32',
                            },
                        },
                        {
                            name: '西半球',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: scatterData.westernHemisphere,
                            symbolSize: 8,
                            itemStyle: {
                                color: '#FFD700',
                            },
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

    // 输入框更新事件
    updateButton.addEventListener('click', () => {
        currentYear = yearInput.value;
        fetchData(currentYear);
    });
});