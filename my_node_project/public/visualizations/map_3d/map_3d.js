let isAutoRotating = false; // 默认自动旋转
document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart-container');
    const yearInput = document.getElementById('year-input');
    const updateButton = document.getElementById('update-button');
    const loadingElement = document.getElementById('loading');
    const chart = echarts.init(chartContainer);

    // 检查地图数据是否已加载成功
    if (!echarts.getMap('world')) {
        console.error('地图数据未正确加载，请检查世界地图资源的引入。');
        loadingElement.textContent = '地图加载失败，请检查资源文件。';
        return;
    }

    // 加载数据并渲染 3D 地图
    const fetchData = (year) => {
        loadingElement.style.display = 'block';

        // 模拟从 API 获取数据（替换为实际 API 地址）
        fetch(`http://localhost:3000/api/data/${year}`)
            .then(response => response.json())
            .then(data => {
                // 检查返回数据是否有效
                if (!data || data.length === 0) {
                    console.error('API 返回的数据为空或格式不正确:', data);
                    loadingElement.textContent = '加载数据失败，请检查 API';
                    return;
                }

                // 解析数据
                const scatterData = data.map(entry => {
                    const latitude = entry.Latitude.includes('N')
                        ? parseFloat(entry.Latitude.replace('N', ''))
                        : -parseFloat(entry.Latitude.replace('S', ''));

                    const longitude = entry.Longitude.includes('E')
                        ? parseFloat(entry.Longitude.replace('E', ''))
                        : -parseFloat(entry.Longitude.replace('W', ''));

                    const temperature = parseFloat(entry.AverageTemperature);

                    return {
                        name: entry.City,
                        value: [longitude, latitude, temperature],
                        country: entry.Country,
                    };
                });

                // 隐藏加载提示
                loadingElement.style.display = 'none';

                // 渲染地图
                const option = {
                    title: {
                        text: `3D 世界温度地图 (${year})`,
                        left: 'center',
                        textStyle: {
                            color: '#fff',
                            fontSize: 24,
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: params => {
                            if (params.data) {
                                return `
                                    <b>${params.data.name}</b><br>
                                    Country: ${params.data.country}<br>
                                    Temperature: ${params.data.value[2].toFixed(2)}°C
                                `;
                            }
                            return '';
                        },
                    },
                    geo3D: {
                        map: 'world',
                        roam: true,
                        environment: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#001f3f' }, // 深蓝色（顶部）
                            { offset: 1, color: '#005f73' }, // 蓝绿色（底部）
                        ]),
                        itemStyle: {
                            areaColor: '#3aaf85', // 地图区域的基础颜色（蓝绿色）
                            borderColor: '#111111', // 边界颜色（浅灰）
                            borderWidth: 0.5,
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: '#a1d6e2', // 鼠标悬停时的高亮颜色（亮蓝）
                            },
                        },
                        regionHeight: 0.5,
                        viewControl: {
                            autoRotate: false,
                            autoRotateSpeed: 3,
                            distance: 150,
                            minDistance: 50,
                            maxDistance: 200,
                            zoomSensitivity: 2,
                            rotateSensitivity: 1,
                        },
                    },
                    visualMap: {
                        min: -10,
                        max: 40,
                        calculable: true,
                        orient: 'vertical',
                        right: 20,
                        top: 'middle',
                        inRange: {
                            color: ['#1E90FF', '#00BFFF', '#FFD700', '#FF8C00', '#FF4500'], // 冷到暖的渐变
                        },
                        text: ['High', 'Low'],
                        textStyle: {
                            color: '#ffffff', // 白色字体，清晰可见
                        },
                    },
                    visualMap: {
                        min: -10,
                        max: 40,
                        calculable: true,
                        orient: 'vertical',
                        right: 20,
                        top: 'middle',
                        inRange: {
                            color: ['#1E90FF', '#00BFFF', '#FFD700', '#FF8C00', '#FF4500'],
                        },
                        text: ['High', 'Low'],
                        textStyle: {
                            color: '#fff',
                        },
                    },
                    series: [
                        {
                            name: '温度点',
                            type: 'scatter3D',
                            coordinateSystem: 'geo3D',
                            data: scatterData,
                            symbolSize: 8,
                            itemStyle: {
                                color: '#00BFFF',
                                opacity: 1,
                            },
                        },
                        {
                            name: '温度柱状图',
                            type: 'bar3D',
                            coordinateSystem: 'geo3D',
                            data: scatterData.map(d => ({
                                value: [...d.value, d.value[2] / 1.5],
                                name: d.name,
                            })),
                            barSize: 0.5,
                            shading: 'realistic',
                            realisticMaterial: {
                                detailTexture: 'metal',
                            },
                            itemStyle: {
                                opacity: 0.8,
                            },
                        },
                    ],
                };

                chart.setOption(option);
            })
            .catch(error => {
                console.error('加载数据失败:', error);
                loadingElement.textContent = '加载数据失败，请检查网络连接';
            });
    };

    // 初次加载默认年份数据
    fetchData(yearInput.value);

    // 点击按钮更新地图
    updateButton.addEventListener('click', () => {
        const year = yearInput.value;
        fetchData(year);
    });

    // 响应式图表
    window.addEventListener('resize', () => {
        chart.resize();
    });
});

document.getElementById('reset-view-button').addEventListener('click', () => {
    chart.setOption({
        geo3D: {
            viewControl: {
                autoRotate: false,
                distance: 150,
                center: [0, 0, 0],
            },
        },
    });
});
