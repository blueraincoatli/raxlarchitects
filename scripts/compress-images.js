import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const rootDir = 'D:/raxlarchitects';
const projectsDir = path.join(rootDir, 'images/projects');

// 只处理已存在的图片文件
async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  const jpgImages = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  const jpgCount = jpgImages.length;

  if (jpgCount === 0) {
    console.log(`Skip: ${dir} (no JPG files)`);
    return;
  }

  console.log(`Processing: ${dir} (${jpgCount} files)`);

  for (let i = 0; i < jpgCount; i++) {
    const file = jpgImages[i];
    const sourcePath = path.join(dir, file);

    // 生成新文件名
    const newName = String(i + 1).padStart(2, '0') + '.jpg';
    const targetBase = path.join(dir, newName.replace('.jpg', ''));

    // 获取图片信息
    try {
      const info = await getImageInfo(sourcePath);

      // 计算目标尺寸（最大宽度2500px）
      let targetWidth = info.width;
      let targetHeight = info.height;
      const maxWidth = 2500;

      if (targetWidth > maxWidth) {
        const ratio = maxWidth / targetWidth;
        targetWidth = maxWidth;
        targetHeight = Math.round(targetHeight * ratio);
      }

      console.log(`  [${i + 1}/${jpgCount}] ${file} (${info.width}x${info.height}) -> ${newName} (${targetWidth}x${targetHeight})`);

      // 生成压缩版本
      await processImage(sourcePath, targetBase, targetWidth, targetHeight);

    } catch (error) {
      console.error(`  Error: ${file} - ${error.message}`);
    }
  }

  console.log(`Done: ${dir}\n`);
}

function getImageInfo(filePath) {
  return new Promise((resolve, reject) => {
    const cmd = 'ffprobe';
    const args = [
      '-v', 'error',
      '-show_entries', 'format',
      '-show_entries', 'stream=width,height',
      `"${filePath}"`,
    ];
    exec(`${cmd} ${args.join(' ')}`, (error, stdout) => {
      if (error) reject(error);
      const match = stdout.match(/width=(\d+)/);
      const heightMatch = stdout.match(/height=(\d+)/);
      if (match && heightMatch) {
        resolve({ width: parseInt(match[1]), height: parseInt(heightMatch[1]) });
      }
      reject(new Error('Could not get image info'));
    });
  });
}

async function processImage(sourcePath, targetBase, width, height) {
  // 1. 生成 AVIF
  try {
    await runFFmpeg([
      '-i', sourcePath,
      '-vf', `scale=${width}:${height}`,
      '-c:v', 'libaom-av1',
      '-crf', '35',
      '-pix_fmt', 'yuv420p',
      `"${targetBase}.avif"`,
    ]);
  } catch (e) {
    console.warn(`  AVIF failed: ${path.basename(sourcePath)}`);
  }

  // 2. 生成 WebP
  try {
    await runFFmpeg([
      '-i', sourcePath,
      '-vf', `scale=${width}:${height}`,
      '-c:v', 'libwebp',
      '-quality', '82',
      '-method', '6',
      '-preset', 'photo',
      `"${targetBase}.webp"`,
    ]);
  } catch (e) {
    console.warn(`  WebP failed: ${path.basename(sourcePath)}`);
  }

  // 3. 生成压缩JPG
  try {
    await runFFmpeg([
      '-i', sourcePath,
      '-vf', `scale=${width}:${height}`,
      '-c:v', 'libjpeg',
      '-q:v', '3',
      '-predialone', '2',
      '-tune', 'ssim',
      `"${targetBase}.jpg"`,
    ]);
  } catch (e) {
    console.warn(`  JPG failed: ${path.basename(sourcePath)}`);
  }
}

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const cmd = 'ffmpeg';
    const safeArgs = args.map(arg => arg.includes(' ') ? `"${arg}"` : arg);
    exec(`${cmd} ${safeArgs.join(' ')}`, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
  });
}

async function main() {
  console.log('=== Compressing Project Images ===\n');

  const dirs = fs.readdirSync(projectsDir).filter(d => {
    const stat = fs.statSync(path.join(projectsDir, d));
    return stat.isDirectory();
  });

  for (const dir of dirs) {
    const fullPath = path.join(projectsDir, dir);
    try {
      await processDirectory(fullPath);
    } catch (error) {
      console.error(`Error processing ${dir}:`, error.message);
    }
  }

  console.log('\n=== Done ===');
}

main().catch(console.error);
