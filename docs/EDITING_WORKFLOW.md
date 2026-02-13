# RA Architects 网站编辑工作流程

## 概述

由于没有源代码，网站内容通过编辑预编译的 bundle 文件修改。工作流程如下：

```
beautified files → 编辑内容 → 压缩 → 测试 → 部署
```

## 文件说明

| 文件 | 大小 | 行数 | 状态 | 说明 |
|------|------|------|------|------|
| `index-BUkr1E8Sbeautified.js` | 221KB | 10,410 | ✅ | 主要应用代码 - **可编辑** |
| `vendor-BQtgnkn3beautified.js` | 69KB | 2,140 | ✅ | React库代码 - 通常无需编辑 |
| `index-CVG2TpGm-formatted.css` | 90KB | ~1,500 | ✅ | 样式文件 - 可编辑 |
| `index-CVG2TpGmbeautified.css` | 126KB | 1,500 | ⚠️ | **格式错误** - 不建议使用 |

## 数据位置

### 1. 项目数据 (index-BUkr1E8Sbeautified.js 第9622行起)

```javascript
pe = [{
    id: "项目ID",                    // URL中使用
    key: "projects.items.xxx",       // i18n键名
    image: "/images/projects/xxx.jpg",
    images: [],
    status: "finalized|proposed",    // finalized / proposed
    category: "architecture|interior",
    statusLabel: "Finalized Project|Proposed Project",
    client: "业主名称",
    construction: "施工图设计单位",
    projectTeam: "团队成员",
    interiorDesign: "室内设计单位",
    landscape: "景观设计单位",
    year: "年份范围",
    grossFloorArea: "建筑面积"
}, ...]
```

### 2. 文本内容位置

| 内容 | 位置 | 对象名 | 示例 |
|------|------|--------|------|
| 导航标签 | 第9183-9236行 | `Ar` | `title: "项目"` |
| 项目名称 | 第9187-9234行 | `Ar.items` | `oneParkGubei: {name: "古北壹号"}` |
| 关于我们 | 第9237-9242行 | `Nr` | 三段公司描述 |
| 联系我们 | 第9243-9258行 | `Tr` | 中美地址、邮箱、电话 |
| 项目详情标签 | 第9259-9270行 | `Er` | `status: "状态"` |
| 页脚 | 第9271-9279行 | `Or` | 公司信息和版权 |

### 3. 样式文件 (index-CVG2TpGm-formatted.css)

主要样式类：
- `.project-card` - 项目卡片
- `.navigation` - 导航栏
- `.about-section` - 关于我们
- `.contact-section` - 联系我们
- `.footer` - 页脚

Tailwind CSS变量（所有样式）：
- `--tw-border-spacing-x`
- `--tw-translate-x`
- 等等...

## 添加新项目步骤

### 1. 添加到项目数组

在 `index-BUkr1E8Sbeautified.js` 第9622行的 `pe` 数组中添加：

```javascript
{
    id: "new-project-id",
    key: "projects.items.newProject",
    image: "/images/projects/new-project.jpg",
    status: "finalized",
    category: "architecture",
    year: "2020 - 2024",
    grossFloorArea: "50,000 ㎡"
}
```

### 2. 添加项目名称

在 `index-BUkr1E8Sbeautified.js` 的 `Ar.items` 中添加：

```javascript
newProject: {
    name: "新项目名称",
    location: "城市"
}
```

### 3. 准备图片文件

```bash
# 复制主图片
cp "源文件.jpg" "/path/to/raxlarchitects/images/projects/new-project.jpg"

# 生成图片变体 (AVIF/WebP)
pwsh -File scripts/generate-image-variants.ps1
```

## 编辑步骤

### 1. 编辑文件

```bash
# 使用你喜欢的编辑器
code assets/index-BUkr1E8Sbeautified.js
code assets/index-CVG2TpGm-formatted.css
```

### 2. 验证语法

```bash
# 验证 JS 文件
npm run check

# 验证内容完整性
npm run validate
```

### 3. 压缩文件

```bash
# 压缩主应用文件
npm run build

# 压缩 CSS (使用 csso 或类似工具)
npx csso assets/index-CVG2TpGm-formatted.css -o assets/index-CVG2TpGm.css
```

### 4. 本地测试

```bash
# 启动本地服务器
npm run serve

# 浏览器访问测试
# http://localhost:8080
# http://localhost:8080/projects
# http://localhost:8080/about
```

### 5. 检查控制台

打开浏览器开发者工具 (F12)，确认：
- ✅ 无 JavaScript 错误
- ✅ 所有资源加载成功 (200 状态)
- ✅ 图片显示正常
- ✅ 样式正确应用

## 常见问题

### 中文引号问题

**症状**: "Invalid or unexpected token" 错误

**原因**: 使用了中文引号 `""` 而非英文引号 `""`

**解决**:
```javascript
// ❌ 错误
name: "项目名称"

// ✅ 正确
name: "项目名称"
```

### 图片不显示

检查清单：
1. ✅ 图片路径以 `/images/` 开头
2. ✅ 图片文件存在于正确位置
3. ✅ 图片格式支持 (jpg, png, avif, webp)
4. ✅ 文件名大小写匹配

### 项目不显示

检查清单：
1. ✅ 项目已添加到 `pe` 数组
2. ✅ 项目名称已添加到 `Ar.items`
3. ✅ `key` 值与 `items` 中的键名匹配
4. ✅ 浏览器控制台无错误

### CSS样式不生效

如果使用 `index-CVG2TpGmbeautified.css`：
- **问题**: CSS变量名被错误格式化
- **解决**: 使用 `index-CVG2TpGm-formatted.css`

## 工具脚本

```bash
# 格式化 CSS (生成正确的格式化版本)
node scripts/format-css.js

# 验证内容
npm run validate

# 构建压缩版本
npm run build

# 启动服务器
npm run serve
```

## 备份策略

```bash
# 编辑前备份
cp assets/index-BUkr1E8Sbeautified.js assets/index-BUkr1E8Sbeautified.js.backup
cp assets/index-BUkr1E8S.js assets/index-BUkr1E8S.js.backup

# 或使用 git
git add assets/
git commit -m "备份: 编辑前"
```

## 文件对比

### Beautified vs Original

| 文件 | 原始大小 | Beautified大小 | 增加 |
|------|----------|----------------|------|
| index-BUkr1E8S.js | 219KB | 221KB | ~1% |
| vendor-BQtgnkn3.js | 46KB | 69KB | ~50% |
| index-CVG2TpGm.css | 84KB | 90KB | ~7% (formatted) |

## 部署

```bash
# 确认文件
git status
git diff assets/

# 提交更改
git add assets/
git commit -m "更新: 添加新项目/修改内容"
git push
```
