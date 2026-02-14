# RA Architects 网站重构计划（归档）

> 状态说明：本文件为早期重构计划归档，部分结构/技术描述已不再与当前代码完全一致。  
> 以当前仓库实现为准：`src/` + React Router + Vite 构建（`npm run build`）。

## 项目概述
完全重写 RA Architects 网站，使用 React + Tailwind CSS，参考现有设计和用户需求。

## 技术栈
- **前端**: React 18.3 + React DOM
- **路由**: React Router v6（已使用）
- **状态管理**: React Hooks（useState, useEffect, useContext）
- **样式**: Tailwind CSS 3.4（通过 CDN）
- **构建**: Vite（`npm run build` 输出到 `dist/`）
- **字体**: Google Inter（300, 400, 500, 600）

## 项目结构

```
ra-architects/
├── src/
│   ├── components/
│   │   ├── HeroCarousel.jsx          # 轮播图组件
│   │   ├── ProjectGrid.jsx          # 项目网格展示
│   │   ├── ProjectGallery.jsx        # 项目画廊（大图切换）
│   │   ├── ProjectInfo.jsx          # 项目详情
│   │   ├── PageLayout.jsx          # 页面布局容器
│   │   ├── Navigation.jsx          # 导航组件
│   │   ├── AboutPage.jsx            # 关于页面
│   │   ├── ContactPage.jsx           # 联系页面
│   │   └── pages/
│   │       ├── HomePage.jsx
│   │       ├── ProjectsPage.jsx
│   │       ├── ProjectDetailPage.jsx
│   │       ├── AboutPage.jsx          # 公司介绍
│   │       ├── AboutPartnersPage.jsx    # 合作伙伴
│   │       ├── AboutAwardsPage.jsx       # 奖项
│   │       ├── ContactPage.jsx
│   │   └── App.jsx                 # 根组件
│   ├── App.css                 # 全局样式
│   ├── index.html              # 入口HTML
│   └── content.js             # 项目数据和翻译
│   └── utils/
│   │       └── api.js                # API 层
└   └── images/               # 图片资源
└── scripts/
│       └── build.js              # 构建脚本
└── package.json
└       └── tailwind.config.js   # Tailwind 配置
└── terser.config.js        # Terser 配置
└── .gitignore
└── public/
```

## 页面详细设计

### 1. 首页
**组件**: HeroCarousel.jsx
**布局**: 全屏高度
**功能**:
- 6 张轮播图自动切换（5秒）
- 鼠标悬停暂停
- 左右导航箭头
- 底部圆点指示器
- 点击跳转到项目详情

### 2. 项目页面
**组件**: ProjectsPage.jsx
**布局**: 网格 + 筛选按钮
**功能**:
- 状态筛选：已完成 / 建设中 / 提案
- 分类筛选：建筑 / 景观 / 室内 / 其他
- 响应式：移动 2 列，平板 3 列，桌面 4 列

### 3. 项目详情页
**组件**: ProjectDetailPage.jsx
**布局**:
- 顶部：大图区域（16:9 比例，自动计算高度）
  - 左右箭头切换项目
- 底部：项目信息表格
  - 信息卡：客户、年份、面积、奖项等

### 4. 关于页面
**组件**: AboutPage.jsx
**子页面**:
- 公司介绍
- 合作伙伴
- 奖项

## 开发步骤

### 第一阶段：项目初始化
1. 创建项目结构
2. 配置 Tailwind CSS
3. 设置 Terser
4. 创建基础组件框架

### 第二阶段：核心组件
5. HeroCarousel 组件
6. ProjectGrid 组件
7. ProjectGallery 组件
8. ProjectInfo 组件
9. PageLayout 组件

### 第三阶段：页面实现
10. HomePage 组装
11. ProjectsPage 实现
12. ProjectDetailPage 实现
13. AboutPage 组装（3个子页面）
14. ContactPage 实现

### 第四阶段：样式优化
15. 响应式设计
16. 图片懒加载
17. 动画和过渡效果
18. 最终打包和优化

## 预计细节

### 轮播图交互
- 自动播放，可暂停
- 左右箭头导航
- 底部圆点导航

### 项目详情页画廊
- 大图浏览：支持触摸滑动切换
- 箭头：项目信息展示，16:9 比例

### 响应式设计
- 移动端：1 列
- 平板：2 列
- 桌面：3 列
- 大屏：4 列

### 图片处理
- 多格式支持：AVIF、WebP、JPG
- 懐进式加载：AVIF → WebP → JPG
- 自动回退机制：已实现
