# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 RA Architects（上海锐点建筑设计有限公司）的静态网站快照。网站采用现代图片格式（AVIF/WebP）和渐进式回退机制优化图片加载。

### 目录结构

```
├── index.html              # 应用入口，加载打包的 CSS/JS
├── assets/                 # 编译后的前端打包文件
│   ├── index-*.js         # 主应用代码
│   ├── vendor-*.js        # 第三方库
│   ├── i18n-*.js          # 国际化文本数据
│   └── index-*.css        # 样式文件
├── images/                 # 运行时图片资源
│   ├── home/              # 首页轮播图
│   ├── projects/          # 项目缩略图
│   ├── about/             # 关于页面图片
│   └── original/          # 原始图片存档
├── 20260212-网站资料整理/  # 源参考材料（文档、截图等）
└── scripts/                # 工具脚本
```

## 开发命令

### 本地服务器
```bash
# Python HTTP 服务器
python -m http.server 8080

# 或使用 npx serve
npx serve .
```

访问 `http://localhost:8080` 验证网站。

### 图片变体生成
```bash
# 生成 AVIF/WebP 变体（需要 ffmpeg）
pwsh -File scripts/generate-image-variants.ps1

# 强制重新生成所有变体
pwsh -File scripts/generate-image-variants.ps1 -Force

# 自定义质量参数
pwsh -File scripts/generate-image-variants.ps1 -AvifCrf 35 -WebpQuality 80
```

### 文档文本提取
```bash
# 从源 docx 文件提取文本到 content/source-text/
pwsh -File scripts/extract-docx-text.ps1
```

### 文本覆盖
```bash
# 应用文本覆盖到打包文件
pwsh -File scripts/apply-text-overrides.ps1
```

## 架构说明

### 图片加载机制

网站使用渐进式图片加载策略：
1. 首先尝试加载 AVIF 格式（最佳压缩）
2. 失败后回退到 WebP
3. 再失败回退到首选原始格式（PNG 源则用 JPG）
4. 最后回退到原始文件

此逻辑在 `index.html` 的内联脚本中实现，通过 MutationObserver 监听 DOM 变化以处理动态加载的图片。

### 内容管理

- **源材料位置**: `20260212-网站资料整理/0406-发出版本/`
- **文本映射**: 参见 `docs/source-asset-map.md`
- **项目清单**: 参见 `docs/project-text-checklist.md`
- **英文本地化状态**: 参见 `docs/english-mapping-status.md`

### 国际化 (i18n)

文本数据存储在 `assets/i18n-*.js` 中。当前站点主要使用中文，英文翻译通过脚本直接修改打包文件实现。

## 内容更新工作流

1. **添加新项目**:
   - 将图片放入 `images/projects/`
   - 运行图片变体生成脚本
   - 编辑 `assets/index-BUkr1E8S.js` 添加项目数据

2. **更新文本**:
   - 修改 `assets/i18n-*.js` 中的文本值
   - 或使用 `apply-text-overrides.ps1` 脚本

3. **替换图片**:
   - 替换 `images/` 下对应文件
   - 重新运行图片变体生成脚本

## 编码规范

- HTML/CSS 使用 2 空格缩进
- 文件名使用小写和连字符（kebab-case）
- 保持 UTF-8 编码
- 路径引用使用相对于仓库根目录的 web 安全路径

## 注意事项

- 这是一个预构建的快照，没有源项目可用
- 避免手动编辑压缩后的打包文件
- 优先通过替换 `images/` 中的文件和最小化 `index.html` 更改来更新内容
- `20260212-网站资料整理/` 目录仅作为参考，不是运行时代码
