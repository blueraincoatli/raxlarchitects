import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const rootDir = 'D:/raxlarchitects';
const tempDir = path.join(rootDir, 'temp-processing');

// 源目录和临时目录映射
const tasks = [
  {
    name: '品尊国际三期',
    id: 'pinzun',
    source: 'D:/raxlarchitects/20260212-网站资料整理/品尊国际三期 最终精修',
  },
  {
    name: '开云艾尚里',
    id: 'aishangli',
    source: 'D:/raxlarchitects/20260212-网站资料整理/开云艾尚里 照片',
  },
];

const MAX_DIMENSION = 2560;
const PREVIEW_DIMENSION = 400;

// 获取图片信息
function getImageInfo(filePath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffprobe -v error -show_entries stream=width,height -of csv=p=0 "${filePath}"`;
    exec(cmd, (error, stdout) => {
      if (error) reject(error);
      const parts = stdout.trim().split(',');
      if (parts.length === 2) {
        resolve({
          width: parseInt(parts[0]),
          height: parseInt(parts[1]),
        });
      }
      reject(new Error('Could not get image info'));
    });
  });
}

// 计算目标尺寸（最长边限制）
function calculateTargetSize(width, height, maxDim) {
  const maxDimension = Math.max(width, height);
  if (maxDimension <= maxDim) {
    return { width, height };
  }
  const ratio = maxDim / maxDimension;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

// 运行 FFmpeg 命令
function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg ${args.join(' ')}`;
    exec(cmd, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
  });
}

// 处理单张图片 - 生成大图
async function processFullImage(sourcePath, targetBase, width, height) {
  const scaleFilter = `scale=${width}:${height}:flags=lanczos,unsharp=5:5:0.5:5:5:0.0`;

  // AVIF
  await runFFmpeg([
    '-y',
    '-i', `"${sourcePath}"`,
    '-vf', `"${scaleFilter}"`,
    '-c:v', 'libaom-av1',
    '-crf', '35',
    '-pix_fmt', 'yuv420p',
    '-cpu-used', '4',
    `"${targetBase}.avif"`,
  ]);

  // WebP
  await runFFmpeg([
    '-y',
    '-i', `"${sourcePath}"`,
    '-vf', `"${scaleFilter}"`,
    '-c:v', 'libwebp',
    '-quality', '82',
    '-method', '6',
    '-preset', 'photo',
    `"${targetBase}.webp"`,
  ]);

  // JPG
  await runFFmpeg([
    '-y',
    '-i', `"${sourcePath}"`,
    '-vf', `"${scaleFilter}"`,
    '-c:v', 'mjpeg',
    '-q:v', '3',
    `"${targetBase}.jpg"`,
  ]);
}

// 处理单张图片 - 生成预览图（仅 JPG，用于快速浏览）
async function processPreviewImage(sourcePath, targetPath, width, height) {
  const scaleFilter = `scale=${width}:${height}:flags=lanczos`;

  await runFFmpeg([
    '-y',
    '-i', `"${sourcePath}"`,
    '-vf', `"${scaleFilter}"`,
    '-c:v', 'mjpeg',
    '-q:v', '5',
    `"${targetPath}"`,
  ]);
}

// 处理单个任务
async function processTask(task) {
  console.log(`\n=== ${task.name} ===\n`);

  // 检查源目录
  if (!fs.existsSync(task.source)) {
    console.error(`Source directory not found: ${task.source}`);
    return { count: 0 };
  }

  // 创建临时目录
  const fullDir = path.join(tempDir, task.id, 'full');
  const previewDir = path.join(tempDir, task.id, 'preview');
  fs.mkdirSync(fullDir, { recursive: true });
  fs.mkdirSync(previewDir, { recursive: true });

  // 获取所有图片文件
  const files = fs.readdirSync(task.source)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log('No images found.');
    return { count: 0 };
  }

  console.log(`Found ${files.length} images.\n`);

  let processed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sourcePath = path.join(task.source, file);
    const baseName = path.parse(file).name;

    const fullBase = path.join(fullDir, baseName);
    const previewPath = path.join(previewDir, `${baseName}.jpg`);

    console.log(`[${i + 1}/${files.length}] ${file}`);

    try {
      const info = await getImageInfo(sourcePath);

      // 大图
      const fullTarget = calculateTargetSize(info.width, info.height, MAX_DIMENSION);
      console.log(`  Full: ${info.width}x${info.height} -> ${fullTarget.width}x${fullTarget.height}`);
      await processFullImage(sourcePath, fullBase, fullTarget.width, fullTarget.height);

      // 预览图
      const previewTarget = calculateTargetSize(info.width, info.height, PREVIEW_DIMENSION);
      console.log(`  Preview: ${previewTarget.width}x${previewTarget.height}`);
      await processPreviewImage(sourcePath, previewPath, previewTarget.width, previewTarget.height);

      processed++;
      console.log(`  Done\n`);
    } catch (error) {
      console.error(`  Error: ${error.message}\n`);
    }
  }

  return { count: processed };
}

async function main() {
  console.log('====================================');
  console.log('Step 1: Compress Photos');
  console.log('====================================');
  console.log('Settings:');
  console.log(`  - Full image max dimension: ${MAX_DIMENSION}px`);
  console.log(`  - Preview image max dimension: ${PREVIEW_DIMENSION}px`);
  console.log('  - Scale algorithm: Lanczos');
  console.log('  - Sharpen: Unsharp 5:5:0.5:5:5:0.0');
  console.log('  - Quality: JPG q:3, WebP 82, AVIF crf:35');
  console.log('====================================\n');

  // 清理旧临时目录
  if (fs.existsSync(tempDir)) {
    console.log('Cleaning old temp directory...\n');
    fs.rmSync(tempDir, { recursive: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  const results = [];
  for (const task of tasks) {
    const result = await processTask(task);
    results.push({ name: task.name, ...result });
  }

  console.log('\n====================================');
  console.log('Summary');
  console.log('====================================');
  for (const r of results) {
    console.log(`  ${r.name}: ${r.count} images`);
  }
  console.log(`\nOutput: ${tempDir}`);
  console.log('\nNext step: Review preview images, then run step2-rename-photos.js');
  console.log('====================================');
}

main().catch(console.error);
