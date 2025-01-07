document.addEventListener('DOMContentLoaded', () => {
    const loadingElement = document.getElementById('loading');
    const tableBody = document.querySelector('#data-table tbody');
    const paginationContainer = document.getElementById('pagination-container');

    let currentPage = 1; // 当前页码
    const rowsPerPage = 50; // 每页显示数据条数
    let totalData = []; // 存储所有数据

    // 更新表格内容
    const updateTable = (data) => {
        tableBody.innerHTML = ''; // 清空表格内容

        // 计算当前页的数据范围
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, data.length);

        // 填充当前页数据
        for (let i = startIndex; i < endIndex; i++) {
            const item = data[i];
            const row = document.createElement('tr');

            // 判断字段是否为空或缺失，如果是则设置默认值
            const dt = item.dt || '未知日期'; // 默认值为 "未知日期"
            const averageTemperature = item.AverageTemperature !== undefined ? Number(item.AverageTemperature).toFixed(2) : 'N/A'; // 默认值为 "N/A"
            const averageTemperatureUncertainty = item.AverageTemperatureUncertainty !== undefined ? Number(item.AverageTemperatureUncertainty).toFixed(2) : 'N/A'; // 默认值为 "N/A"
            const city = item.City || '未知城市'; // 默认值为 "未知城市"
            const country = item.Country || '未知国家'; // 默认值为 "未知国家"
            const latitude = item.Latitude || '未知纬度'; // 默认值为 "未知纬度"
            const longitude = item.Longitude || '未知经度'; // 默认值为 "未知经度"

            row.innerHTML = `
                <td>${dt}</td>
                <td>${averageTemperature}</td>
                <td>${averageTemperatureUncertainty}</td>
                <td>${city}</td>
                <td>${country}</td>
                <td>${latitude}</td>
                <td>${longitude}</td>
            `;
            tableBody.appendChild(row);
        }
    };

    // 更新分页控件
    const updatePagination = (data) => {
        paginationContainer.innerHTML = ''; // 清空分页控件

        const totalPages = Math.ceil(data.length / rowsPerPage);

        // 创建“上一页”按钮
        const prevButton = document.createElement('button');
        prevButton.textContent = '上一页';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateTable(data);
                updatePagination(data);
            }
        });
        paginationContainer.appendChild(prevButton);

        // 创建“下一页”按钮
        const nextButton = document.createElement('button');
        nextButton.textContent = '下一页';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateTable(data);
                updatePagination(data);
            }
        });
        paginationContainer.appendChild(nextButton);

        // 显示当前页和总页数信息
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
        pageInfo.style.margin = '0 15px';
        paginationContainer.appendChild(pageInfo);
    };

    // 获取数据并加载表格和分页
    const fetchData = () => {
        tableBody.innerHTML = ''; // 清空表格内容
        loadingElement.style.display = 'block'; // 显示加载提示

        fetch('http://localhost:3000/api/data')
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="7">没有相关数据。</td></tr>';
                    paginationContainer.innerHTML = '';
                    return;
                }

                loadingElement.style.display = 'none'; // 隐藏加载提示
                totalData = data; // 保存数据
                currentPage = 1; // 重置为第一页
                updateTable(totalData); // 加载表格
                updatePagination(totalData); // 加载分页
            })
            .catch(error => {
                console.error('数据加载失败:', error);
                tableBody.innerHTML = '<tr><td colspan="7">数据加载失败。</td></tr>';
                paginationContainer.innerHTML = '';
            });
    };

    // 初次加载数据
    fetchData();
});