# 吉林大学 - 可视化项目
## 项目背景

本项目为吉林大学实训-数据可视化项目，该项目及其文档要求在三天之内完成。

完成了全球气候变化数据的可视化分析网页。

具体实验报告、项目需求、答辩PPT、演示视频在./doc文件夹。项目代码在./my_node_project。

## 项目说明

本项目旨在通过对全球气候变化数据的分析，呈现主要城市温度的变化趋势及相关地理因素。

项目利用 **Node.js** 构建后端服务，结合 **HTML**、**CSS**、**JavaScript** 开发前端界面，配合 **ECharts** 实现数据的动态可视化展示。
数据存储采用 **MySQL 数据库**，分析数据来源于 Kaggle 上的 *Climate Change: Earth Surface Temperature Data* 数据集。

通过构建 **十二张精美的交互式图表**，项目从多个角度深入分析气候变化趋势，揭示全球气候变化的特征和规律。

## 技术栈

- **后端**：Node.js、Express.js
- **前端**：HTML5、CSS3、JavaScript（ECharts 可视化库）
- **数据库**：MySQL
- **数据来源**：Kaggle 数据集 - Climate Change: Earth Surface Temperature Data

## 打开方法

- 安装 npm 环境。
- 在 MySql 数据库中导入上述数据集。
- 在 db.js 中配置数据库。
- 为保证仓库整洁，我已经删除临时文件，因此需要手动下载 npm 依赖包（大部分idea都可以自动下）。
- 运行 server.js 后，在http://localhost:3000打开即可

## 页面预览（详细在 ./doc 的 PPT 中）

