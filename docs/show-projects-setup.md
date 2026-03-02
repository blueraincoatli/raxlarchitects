# Show 秀场项目设置指南

## 项目结构

已创建 5 个 Show 项目：

| 项目ID | 名称 | 位置 | 视频占位符 |
|--------|------|------|-----------|
| show-01 | 秀场一 | 上海 | PLACEHOLDER_VIDEO_UID_01 |
| show-02 | 秀场二 | 上海 | PLACEHOLDER_VIDEO_UID_02 |
| show-03 | 秀场三 | 北京 | PLACEHOLDER_VIDEO_UID_03 |
| show-04 | 秀场四 | 深圳 | PLACEHOLDER_VIDEO_UID_04 |
| show-05 | 秀场五 | 杭州 | PLACEHOLDER_VIDEO_UID_05 |

## ✅ 视频配置已完成

所有5个视频已配置完成，按年份从2016到2009排列：

| 项目 | 年份 | 视频标题 | Video UID | 状态 |
|------|------|----------|-----------|------|
| show-01 | 2016 | Content Show 2016 | `327692a29a92e389049f71ed6230e6d2` | ✅ |
| show-02 | 2014 | Content Show 2014 | `fe071957cbbb50eb0314b1147d5bc223` | ✅ |
| show-03 | 2013 | Content Show 2013 | `db094d62df6790c05dc08069dde73673` | ✅ |
| show-04 | 2011 | Content Show 2011 | `a8c0a8703a7dfc6ddf27b498ab4f5dae` | ✅ |
| show-05 | 2009 | Body on Body | `dc28c93e5c07da9a8fafa1e733373cab` | ✅ |

**Customer Code**: `vi3l2h3rpgipaodm`

## 需要准备的资源

### 封面图片

每个 Show 项目需要一张封面图用于项目列表展示：

```
images/projects/content-show/
├── show-01.jpg (或 show-01.avif/webp)
├── show-02.jpg
├── show-03.jpg
├── show-04.jpg
└── show-05.jpg
```

**路径**: `D:\raxlarchitects\images\projects\content-show\`

**建议尺寸**：1200 x 800 像素（3:2 比例）
**格式**：优先 AVIF，其次 WebP，最后 JPG

> 图片已配置为从 `content-show` 子目录读取，方便集中管理所有 Show 项目的资源。

```javascript
// 秀场一示例
{
  id: 'show-01',
  // ... 其他字段保持不变
  videos: [
    {
      videoId: 'abc123def456',           // ← 替换为真实 Video UID
      customerCode: 'xyz789uvw012',      // ← 替换为真实 Customer Code
      title: '秀场一 完整视频',
      thumbnail: '/images/projects/show-01',
    },
  ],
  // ...
}
```

## 获取 Cloudflare Stream 信息

### Video UID

上传视频后，在视频详情页 URL 中可以看到：
```
https://dash.cloudflare.com/.../stream/videos/VIDEO_UID_HERE
```

### Customer Code

1. 在视频详情页点击 **Embed** 标签
2. 复制 iframe 代码，格式如下：
```html
<iframe src="https://customer-CUSTOMER_CODE.cloudflarestream.com/VIDEO_UID/iframe" ...>
```
3. 提取 `customer-` 后面的字符串作为 Customer Code

## 快速检查清单

- [ ] 准备 5 张封面图片放入 `images/projects/`
- [ ] 上传 5 个视频到 Cloudflare Stream
- [ ] 记录 5 个 Video UID
- [ ] 记录 Customer Code（通常是相同的）
- [ ] 编辑 `src/content/projects.js` 替换所有 PLACEHOLDER
- [ ] 运行 `npm run build` 测试构建
- [ ] 访问 `/projects?category=show` 验证页面

## 导航栏显示

设置完成后，导航栏 Projects 菜单将显示：

```
CATEGORY
├── ARCHITECTURE / 建筑
├── INTERIOR / 室内
├── LANDSCAPE / 景观
└── SHOW / 秀场     ← 新增
```

点击 **SHOW/秀场** 将跳转到筛选页面，展示所有 5 个秀场视频项目。

## 详情页展示

每个 Show 项目的详情页 (`/projects/show-01`) 将显示：
- 视频播放器（带播放/暂停、进度条、音量控制）
- 项目信息（名称、地点、客户、年份等）
- 左右箭头切换（如果配置了多个视频）
- 底部缩略图导航（区分视频和图片）

视频播放器已设置默认静音，用户需要手动开启声音。
