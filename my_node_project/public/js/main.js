document.addEventListener('DOMContentLoaded', () => {
  console.log('页面加载完成！');

  loadVisualizationCards();

  injectHomeButton();
});

function loadVisualizationCards() {
  const cardsContainer = document.querySelector('.cards');

  if (!cardsContainer) {
    console.error('未找到 .cards 容器');
    return;
  }

  const visualizations = [
    {
      title: '可视化表格',
      description: '以表格形式展示气温数据的详细信息，提供数据的精确值，为其他图表提供基础数据支持。',
      link: './visualizations/table/table.html'
    },
    {
      title: '折线图',
      description: '通过折线图展示长春气温的长期变化趋势，通过时间轴直观体现气温随月份或年份的整体波动情况。',
      link: './visualizations/line_chart/line_chart.html'
    },
    {
      title: '柱状图',
      description: '通过柱状图展示长春气温的长期变化趋势，展示不同月份和不同年份的气温平均值。',
      link: './visualizations/bar_chart/bar_chart.html'
    },
    {
      title: '瀑布图',
      description: '通过瀑布图逐步展示长春市气温的变化过程，用于分析增量和变化趋势。',
      link: './visualizations/waterfall_chart/waterfall_chart.html'
    },
    {
      title: '散点图',
      description: '通过散点图展示主要城市气温的长期变化趋势，用于分析不同数据点之间的关系和分布特征。',
      link: './visualizations/scatter_plot/scatter_plot.html'
    },
    {
      title: '世界地图',
      description: '展示全球范围内的气温变化，用于分析全球气候的地理空间分布特征。',
      link: './visualizations/map/map.html'
    },
    {
      title: '中国地图',
      description: '展示中国范围内的气温变化，用于分析全球气候的地理空间分布特征。',
      link: './visualizations/china_map/china_map.html'
    },
    {
      title: '3D世界地图',
      description: '通过3D可视化展示全球气温变化，增强数据的空间层次感，使气温分布更加直观和立体化。',
      link: './visualizations/map_3d/map_3d.html'
    },
    {
      title: '纬度热力图',
      description: '通过纬度热力图展示气温随纬度的变化情况，用于分析纬度与气温之间的关系及规律性。',
      link: './visualizations/heat_map/heat_map.html'
    },
    {
      title: '气泡图',
      description: '通过气泡的大小、颜色等维度对温度和维度的关系进行直观的表达。',
      link: './visualizations/bubble_chart/bubble_chart.html'
    },
    {
      title: '饼图（环图、玫瑰图）',
      description: '通过饼图（环图、玫瑰图）展示不同分类气温分组的占比情况。',
      link: './visualizations/pie_chart/pie_chart.html'
    },
    {
      title: '雷达图',
      description: '展示多维度气温数据的对比情况，不同城市在不同月份的气温特征。',
      link: './visualizations/radar_chart/radar_chart.html'
    },
  ];

  cardsContainer.innerHTML = '';

  visualizations.forEach((viz, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${viz.title}</h3>
      <p>${viz.description}</p>
      <a href="${viz.link}" target="_blank">查看详情</a>
    `;
    cardsContainer.appendChild(card);

    // 延迟加载动画
    setTimeout(() => {
      card.classList.add('loaded'); // 添加动画结束的类
    }, index * 200); // 每个卡片延迟 200ms 加载
  });

  console.log('卡片已生成');
}

// 动态添加返回主页按钮的函数
function injectHomeButton() {
  const button = document.createElement('button');
  button.textContent = '返回主页';

  // 添加基础样式
  button.style.position = 'fixed';
  button.style.top = '5px'; // 向下调整些距离
  button.style.left = '10px'; // 向右调整些距离
  button.style.zIndex = '1000';
  button.style.padding = '16px 30px'; // 增加按钮的内边距
  button.style.fontSize = '19px'; // 放大字体
  button.style.fontWeight = 'bold';
  button.style.color = '#ffffff';
  button.style.background = 'linear-gradient(135deg, #6a11cb, #2575fc)'; // 渐变背景
  button.style.border = 'none';
  button.style.borderRadius = '12px'; // 增大圆角
  button.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)'; // 加强阴影效果
  button.style.transition = 'all 0.3s ease'; // 平滑过渡
  button.style.cursor = 'pointer';

  // 鼠标悬浮时的样式
  button.addEventListener('mouseover', () => {
    button.style.transform = 'translateY(-3px)'; // 悬浮时漂浮
    button.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)'; // 增强阴影
  });

  // 鼠标移开时恢复样式
  button.addEventListener('mouseout', () => {
    button.style.transform = 'translateY(0)'; // 恢复原位
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // 恢复原阴影
  });

  // 点击时的样式
  button.addEventListener('mousedown', () => {
    button.style.transform = 'translateY(1px)'; // 按下时稍微下沉
    button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // 弱化阴影
  });

  // 鼠标释放时恢复样式
  button.addEventListener('mouseup', () => {
    button.style.transform = 'translateY(0)'; // 恢复原位
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // 恢复原阴影
  });

  // 点击按钮时跳转到主页
  button.onclick = () => {
    window.location.href = '/'; // 假设主页是 index.html
  };

  // 将按钮添加到页面中
  document.body.appendChild(button);
}