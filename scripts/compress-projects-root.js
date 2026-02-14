import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const rootDir = 'D:/raxlarchitects';
const projectsDir = path.join(rootDir, 'images/projects');

// 目标尺寸
const TARGET_WIDTH = {
  HORIZONTAL: 2560,  // 横版
  VERTICAL: 1660,   // 竖版
  SQUARE: 2560       // 正方形
};

// 处理根目录的图片文件
async function processRootDirectory(dir) {
  const files = fs.readdirSync(dir);
  const images = files.filter(f =>
    f.endsWith('.jpg') ||
    f.endsWith('.jpeg') ||
    f.endsWith('.avif') ||
    f.endsWith('.webp')
  );
  const imgCount = images.length;

  if (imgCount === 0) {
    console.log(`Skip: ${dir} (no image files)`);
    return;
  }

  console.log(`Processing: ${dir} (${imgCount} files)\n`);

  for (let i = 0; i < imgCount; i++) {
    const file = images[i];
    const sourcePath = path.join(dir, file);

    try {
      // 获取图片信息
      const info = await getImageInfo(sourcePath);

      // 判断方向和目标宽度
      let orientation, targetWidth;
      if (info.width > info.height) {
        orientation = 'HORIZONTAL';
        targetWidth = TARGET_WIDTH.HORIZONTAL;
      } else if (info.height > info.width) {
        orientation = 'VERTICAL';
        targetWidth = TARGET_WIDTH.VERTICAL;
      } else if (info.height > info.width) {
        orientation = 'VERTICAL';
        targetWidth = TARGET_WIDTH.VERTICAL;
      } else {
        orientation = 'SQUARE';
        targetWidth = TARGET_WIDTH.SQUARE;
      }

      // 计算目标尺寸
      let newWidth = info.width;
      let newHeight = info.height;

      if (info.width > targetWidth) {
        const ratio = targetWidth / info.width;
        newWidth = targetWidth;
        newHeight = Math.round(info.height * ratio);
        console.log(`[${i + 1}/${imgCount}] ${file} (${info.width}x${info.height} -> ${newWidth}x${newHeight}) [${orientation}]`);
        await compressImage(sourcePath, newWidth, newHeight);
      } else {
        console.log(`[${i + 1}/${imgCount}] ${file} (${info.width}x${info.height}) - already within target [${orientation}]`);
      }

    } catch (error) {
      console.error(`ERROR: ${file} - ${error.message}`);
    }
  }

  console.log(`\nDone: ${dir}\n`);
}

function getImageInfo(filePath) {
  return new Promise((resolve, reject) => {
    const cmd = 'ffprobe';
    const args = [
      '-v', 'error',
      '-show_entries', 'stream=width,height',
      `"${filePath}"`,
    ];
    exec(`${cmd} ${args.join(' ')}`, { maxBuffer: 1024 * 1024 }, (error, stdout) => {
      if (error) {
        reject(new Error(`ffprobe failed: ${error.message}`));
        return;
      }

      const widthMatch = stdout.match(/width=(\d+)/);
      const heightMatch = stdout.match(/height=(\d+)/);

      if (widthMatch && heightMatch) {
        resolve({
          width: parseInt(widthMatch[1]),
          height: parseInt(heightMatch[1])
        });
      } else {
        reject(new Error('Could not parse image info'));
      }
    });
  });
}

async function compressImage(sourcePath, width, height) {
  const ext = path.extname(sourcePath).toLowerCase();

  // 根据不同格式使用不同压缩参数
  let codec, params;

  if (ext === '.avif') {
    codec = 'libaom-av1';
    params = ['-crf', '35', '-pix_fmt', 'yuv420p'];
  } else if (ext === '.webp') {
    codec = 'libwebp';
    params = ['-quality', '82', '-method', '6', '-preset', 'photo'];
  } else {
    // jpg/jpeg
    codec = 'libjpeg';
    params = ['-q:v', '3', '-predialone', '2', '-tune', 'ssim'];
  }

  // 使用临时文件
  const tempPath = sourcePath + '.tmp' + ext;

  const args = [
    '-y',                              // 覆盖输出文件
    '-i', sourcePath,                 // 输入文件
    '-vf', `scale=${width}:${height}`,  // 缩放滤镜
    '-c:v', codec,                     // 视频编码器
    ...params,                          // 格式特定参数
    `"${tempPath}"`                     // 输出到临时文件
  ];

  return new Promise((resolve, reject) => {
    const cmd = 'ffmpeg';
    const safeArgs = args.map(arg => arg.includes(' ') ? `"${arg}"` : arg);

    exec(`${cmd} ${safeArgs.join(' ')}`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        // ffmpeg用stderr输出进度信息，检查是否有真正的错误
        if (stderr && (stderr.includes('Error') || stderr.includes('Invalid'))) {
          // 清理临时文件
          try { fs.unlinkSync(tempPath); } catch {}
          reject(new Error(`ffmpeg failed: ${stderr}`));
        } else {
          // 有些warning可能是正常的，尝试替换原文件
          try {
            fs.renameSync(tempPath, sourcePath);
            console.log(`    Saved: ${path.basename(sourcePath)}`);
            resolve();
          } catch (renameError) {
            reject(new Error(`Failed to replace file: ${renameError.message}`));
          }
        }
      } else {
        // 成功，替换原文件
        try {
          fs.renameSync(tempPath, sourcePath);
          console.log(`    Saved: ${path.basename(sourcePath)}`);
          resolve();
        } catch (renameError) {
          reject(new Error(`Failed to replace file: ${renameError.message}`));
        }
      }
    });
  });
}

async function main() {
  console.log('=== Compressing Project Root Images ===\n');
  console.log('Targets:');
  console.log('  HORIZONTAL: 2560px width');
  console.log('  VERTICAL:   1660px width');
  console.log('  SQUARE:    2560px width\n');

  try {
    await processRootDirectory(projectsDir);
  } catch (error) {
    console.error(`\nFatal error:`, error.message);
    process.exit(1);
  }

  console.log('=== All Done ===');
}

main().catch(console.error);
