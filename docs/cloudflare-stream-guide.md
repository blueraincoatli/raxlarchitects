# Cloudflare Stream 视频集成指南

## 概述

项目已集成 Cloudflare Stream 视频播放支持。通过 Cloudflare Stream，你可以：

- ✅ 全球 CDN 加速播放（包括中国大陆，但速度可能受限）
- ✅ 无广告、无水印
- ✅ 支持 4K/8K 视频
- ✅ 自动生成多码率适配
- ✅ 支持字幕和多语言音轨

## Show 秀场视频专区

已创建专门的 **Show** 分类用于展示秀场视频：

- 导航栏 Projects 菜单新增 **Show/秀场** 选项
- 已创建 5 个 Show 项目模板（`show-01` 到 `show-05`）
- 每个项目包含独立的视频配置
- 筛选页面：`/projects?category=show`

### Show 项目配置示例

```javascript
{
  id: 'show-01',
  name: '秀场一',
  location: '上海 · 中国',
  client: '品牌客户A',
  year: '2024',
  grossFloorArea: '2,000 m²',
  status: 'finalized',
  statusLabel: '已建成',
  category: 'show',           // 分类标识
  categoryLabel: '秀场',
  imagePath: '/images/projects/show-01',  // 封面图（需要准备）
  videos: [
    {
      videoId: 'YOUR_VIDEO_UID',        // Cloudflare Stream Video UID
      customerCode: 'YOUR_CUSTOMER_CODE', // Customer Code
      title: '秀场一 完整视频',
      thumbnail: '/images/projects/show-01',
    },
  ],
  description: '品牌时装秀场设计...',
}
```

## 费用说明

| 项目 | 费用 |
|------|------|
| 存储费 | $5/月/1000分钟视频 |
| 播放流量 | $1/1000分钟观看时长 |
| 上传编码 | 免费 |

> **估算示例**：1.5GB 的 1080p 视频约 20-30 分钟，每月存储费约 $0.15，每完整播放一次约 $0.02

## 快速开始

### 步骤 1: 注册 Cloudflare Stream

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击左侧菜单 **Stream**
3. 首次使用需要绑定付款方式

### 步骤 2: 上传视频

**方式 A - 网页上传：**
1. 进入 Stream > Videos
2. 点击 "Upload Video"
3. 拖拽或选择视频文件上传

**方式 B - API 上传（适合批量）：**
```bash
# 使用 tus 协议上传大文件
curl -X POST \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "file=@your-video.mp4" \
  https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/stream
```

### 步骤 3: 获取视频信息

上传完成后，在 Video Details 页面获取：
- **Video UID**: 如 `5d5bc37ffcf54c9b82a996e81b4b3c9b`
- **Customer Code**: 如 `abc123def456`（在 iframe URL 中）

iframe URL 格式：
```
https://customer-<CODE>.cloudflarestream.com/<VIDEO_UID>/iframe
```

### 步骤 4: 添加到项目

#### 方式 A: 添加到现有项目（如 content-show）

在 `src/content/projects.js` 中找到 `content-show` 项目，取消注释 `videos` 部分：

```javascript
{
  id: 'content-show',
  name: 'Content Show',
  // ... 其他字段保持不变
  
  // 添加视频配置（取消注释并填写真实信息）
  videos: [
    {
      videoId: 'YOUR_VIDEO_UID_1',        // Cloudflare Stream Video UID
      customerCode: 'YOUR_CUSTOMER_CODE', // 从 iframe URL 获取，如 abc123def456
      title: '视频标题 1',
      thumbnail: '/images/projects/11-content show', // 缩略图路径
    },
    // 可添加多个视频，会按顺序显示
    {
      videoId: 'YOUR_VIDEO_UID_2',
      customerCode: 'YOUR_CUSTOMER_CODE',
      title: '视频标题 2',
      thumbnail: '/images/projects/11-content show',
    },
  ],
  
  // 图片画廊（视频和图片可以混合显示）
  gallery: [
    '/images/projects/content-show/01-content-show',
    '/images/projects/content-show/02-content-show',
    // ...
  ],
  
  description: '项目描述...',
}
```

**显示顺序**：视频在前，图片在后。用户可以像浏览图片一样切换视频。

#### 方式 B: 新建纯视频项目

```javascript
{
  id: 'your-video-project',
  name: '项目名称',
  location: '上海 · 中国',
  client: '客户名称',
  year: '2024',
  grossFloorArea: '面积',
  status: 'finalized',
  statusLabel: '已建成',
  category: 'other',
  categoryLabel: '其他',
  imagePath: '/images/projects/video-thumbnail',
  
  videos: [
    {
      videoId: '5d5bc37ffcf54c9b82a996e81b4b3c9b',
      customerCode: 'abc123def456',
      title: '视频标题',
      thumbnail: '/images/projects/video-thumb',
    },
  ],
  
  description: '项目描述...',
}
```

## 播放器控件说明

Cloudflare Stream 默认播放器包含以下控件：
- **播放/暂停按钮** - 点击视频或按钮控制
- **进度条** - 可拖动跳转
- **音量控制** - 滑动调节音量
- **全屏按钮** - 进入全屏模式
- **当前时间/总时长** - 显示播放进度

### 控件与导航栏的层级关系

✅ **不会冲突** - 已做好以下处理：

1. **移动端**：视频区域底部预留了 80px 的间距 (`pb-20`)，确保播放器控件不被底部缩略图导航栏遮挡
2. **桌面端**：导航栏只在鼠标悬停底部时显示，视频播放器有自己的控制条
3. **全屏模式**：点击全屏按钮后，视频会覆盖整个屏幕，导航栏完全隐藏
4. **缩略图导航**：视频在缩略图区域显示播放图标，方便识别

### 播放器参数

可以在 `videoId` 后添加查询参数控制播放器：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `autoplay=true` | 自动播放（静音） | false |
| `muted=true` | 默认静音 | false |
| `controls=true` | 显示控制条 | true |
| `loop=true` | 循环播放 | false |
| `preload=metadata` | 预加载策略 | none |
| `poster=URL` | 自定义封面图 | 视频首帧 |

修改 `src/pages/ProjectDetailPage.jsx` 中的 `StreamVideoPlayer` 组件：

```javascript
const src = `https://customer-${customerCode}.cloudflarestream.com/${videoId}/iframe?muted=true&preload=metadata&autoplay=true`;
```

## 关于中国大陆访问

⚠️ **重要提示**：Cloudflare Stream 在中国大陆访问可能存在以下问题：

1. **速度较慢**：Cloudflare 在中国大陆没有 CDN 节点，视频需要从香港/新加坡/日本等节点拉取
2. **偶发阻断**：某些地区/运营商可能间歇性无法访问

### 优化建议

1. **使用国内 CDN 回源**（高级方案）：
   - 在 Cloudflare Stream 获取 HLS/DASH 流地址
   - 使用阿里云/腾讯云 CDN 回源加速

2. **多平台备用方案**：
   - 主要视频使用 Cloudflare Stream（海外用户）
   - 同时上传压缩版到 Bilibili（国内用户）
   - 根据用户 IP 自动切换

3. **预加载策略**：
   - 设置 `preload=metadata` 减少初始加载
   - 使用缩略图引导用户点击播放

## 批量上传脚本

如果你有多个视频文件，可以使用以下脚本批量上传：

```javascript
// scripts/upload-videos.js
const fs = require('fs');
const path = require('path');

const ACCOUNT_ID = 'your-account-id';
const API_TOKEN = 'your-api-token';

async function uploadVideo(filePath) {
  const fileName = path.basename(filePath);
  const stats = fs.statSync(filePath);
  
  // 创建 upload URL
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/direct_upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxDurationSeconds: 3600,  // 最大时长（秒）
        meta: { name: fileName },
      }),
    }
  );
  
  const { result } = await response.json();
  
  // 上传文件
  const uploadResponse = await fetch(result.uploadURL, {
    method: 'POST',
    body: fs.createReadStream(filePath),
    headers: {
      'Content-Length': stats.size,
    },
  });
  
  return uploadResponse.json();
}

// 批量上传
const videoDir = './videos-to-upload';
fs.readdirSync(videoDir)
  .filter(f => f.endsWith('.mp4'))
  .forEach(file => {
    uploadVideo(path.join(videoDir, file))
      .then(result => console.log('Uploaded:', result.result.uid))
      .catch(err => console.error('Failed:', file, err));
  });
```

运行：
```bash
node scripts/upload-videos.js
```

## 故障排除

### 视频无法播放

1. 检查 Video UID 和 Customer Code 是否正确
2. 确认视频已编码完成（Stream Dashboard 显示 Ready）
3. 检查浏览器控制台是否有跨域错误

### 播放卡顿

1. 检查视频码率是否过高（建议 1080p 不超过 8Mbps）
2. 确认网络连接正常
3. 尝试降低视频分辨率

### 中国大陆访问慢

1. 考虑使用备用视频源（Bilibili/YouTube）
2. 联系 Cloudflare 了解 Enterprise 方案的中国优化选项

## 参考文档

- [Cloudflare Stream Docs](https://developers.cloudflare.com/stream/)
- [Stream Player Configuration](https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/)
- [Uploading Videos](https://developers.cloudflare.com/stream/uploading-videos/)
