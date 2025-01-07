document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('chart-container');
    const loadingElement = document.getElementById('loading');
    const yearInput = document.getElementById('year-input');
    const updateButton = document.getElementById('update-button');
    const chart = echarts.init(chartContainer);

    // 初始化年份
    let currentYear = yearInput.value;

    // 获取数据并更新饼图
    const fetchData = (year) => {
        loadingElement.style.display = 'block'; // 显示加载提示

        fetch(`http://localhost:3000/api/data/avg-year-classification?year=${year}`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    loadingElement.textContent = '没有相关数据。';
                    return;
                }

                // 隐藏加载提示
                loadingElement.style.display = 'none';

                // 构造饼图数据
                const pieData = data.map(item => ({
                    name: item.temp_range,
                    value: item.city_count,
                }));

                // 更新图表
                const option = {
                    title: {
                        text: `温度分类统计 (${year})`,
                        subtext: '不同温度范围内城市的数量',
                        left: 'center',
                        textStyle: {
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#333',
                        },
                        subtextStyle: {
                            fontSize: 14,
                            color: '#666',
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)',
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: '10%',
                        data: pieData.map(item => item.name),
                        textStyle: {
                            fontSize: 14,
                            color: '#333',
                        },
                    },
                    series: [
                        {
                            name: '城市数量',
                            type: 'pie',
                            radius: ['40%', '65%'], // 环形饼图
                            center: ['50%', '50%'],
                            data: pieData,
                            roseType: 'radius', // 玫瑰图效果
                            label: {
                                formatter: '{b}\n{c} ({d}%)',
                                fontSize: 12,
                            },
                            labelLine: {
                                length: 20,
                                length2: 10,
                            },
                            itemStyle: {
                                borderRadius: 8,
                                borderColor: '#fff',
                                borderWidth: 2,
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 20,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                },
                            },
                        },
                    ],
                    color: [
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#A6CEE3' }, // 柔和浅蓝色
                                { offset: 1, color: '#1F78B4' }, // 深蓝色
                            ],
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#B2DF8A' }, // 浅绿色
                                { offset: 1, color: '#33A02C' }, // 深绿色
                            ],
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#FB9A99' }, // 柔和粉色
                                { offset: 1, color: '#E31A1C' }, // 深红色
                            ],
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#FDBF6F' }, // 柔和橙色
                                { offset: 1, color: '#FF7F00' }, // 深橙色
                            ],
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#CAB2D6' }, // 浅紫色
                                { offset: 1, color: '#6A3D9A' }, // 深紫色
                            ],
                        },
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#FFFF99' }, // 柔和黄色
                                { offset: 1, color: '#B15928' }, // 棕黄色
                            ],
                        },
                    ],
                    animationDuration: 1000, // 动画时间
                    animationEasing: 'cubicOut', // 动画效果
                };

                chart.setOption(option);

                // 更新表格
                updateTable(data);
            })

            .catch(error => {
                console.error('数据加载失败:', error);
                loadingElement.textContent = '数据加载失败。';
            });
    };

    // 更新表格逻辑
    const updateTable = (data) => {
        const tableBody = document.querySelector('#data-table tbody');
        tableBody.innerHTML = ''; // 清空表格内容

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.temp_range}</td>
                <td>${item.city_count}</td>
            `;
            tableBody.appendChild(row);
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