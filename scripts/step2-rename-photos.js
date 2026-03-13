import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const rootDir = 'D:/raxlarchitects';
const tempDir = path.join(rootDir, 'temp-processing');
const projectsDir = path.join(rootDir, 'images/projects');

// 项目配置 - 根据用户在预览图中的分类
const projects = [
  {
    id: 'prime-dynapolis',
    tempDir: 'pinzun',
    // 建筑外观 (gallery) - 按序号排序，无序号的排后面
    gallery: [
      // 有序号的
      '8K1A6037-topaz-upscale-10000',                              // 00
      '8K1A6151-topaz-upscale-10000w',                             // 01
      '8K1A6152_3-topaz-upscale-10000w',                           // 02
      '8K1A6157-upscale-10000w',                                   // 03
      '8K1A4804-topaz-upscale-10000w',                             // 04
      'DSCF2734_HDR_upscayl_2x_realesrgan-x4fast',                 // 05
      // 无序号的
      '8K1A4511-topaz-upscale-2x',
      'DSCF2558_upscayl_2x_realesrgan-x4fast',
      'DSCF2614_HDR_upscayl_2x_realesrgan-x4fast',
      'DSCF2782_HDR_upscayl_2x_realesrgan-x4fast',
      'DSCF2818_HDR_upscayl_2x_realesrgan-x4fast',
      'DSCF2845_HDR 重修扩图_upscayl_2x_realesrgan-x4plus',
    ],
    // 景观 (landscapeImages)
    landscape: [
      '8K1A4458-topaz-upscale-10000w',
      '8K1A6047_HDR-upscale-10000w',
      'DSCF2593_HDR_upscayl_2x_realesrgan-x4fast',
      'DSCF2761_HDR_upscayl_2x_realesrgan-x4fast',
      'DSCF2818_HDR_upscayl_2x_realesrgan-x4fast',
      'DSCF2845_HDR 重修扩图_upscayl_2x_realesrgan-x4plus',
    ],
    // 室内 (interiorImages)
    interior: [
      'DSCF2535_HDR 拷贝_upscayl_2x_realesrgan-x4fast',
    ],
  },
  {
    id: 'moment-to-cloud',
    tempDir: 'aishangli',
    // 建筑外观 (gallery)
    gallery: [
      '1',
      '2',
      '3',
      '8',
      '8K1A4898(1)',
      '9',
      '10',
      '11',
      '12',
      'DSCF3281_HDR 拷贝',
    ],
    // 景观 (landscapeImages)
    landscape: [
      '4',
      '5',
      '6',
      '7',
      '13',
    ],
  },
];

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

// 生成缩略图 (200x150, 居中裁切)
async function generateThumbnail(sourcePath, targetPath) {
  const filter = `scale=200:150:force_original_aspect_ratio=increase,crop=200:150`;

  await runFFmpeg([
    '-y',
    '-i', `"${sourcePath}"`,
    '-vf', `"${filter}"`,
    '-c:v', 'mjpeg',
    '-q:v', '5',
    `"${targetPath}.jpg"`,
  ]);

  await runFFmpeg([
    '-y',
    '-i', `"${sourcePath}"`,
    '-vf', `"${filter}"`,
    '-c:v', 'libwebp',
    '-quality', '82',
    `"${targetPath}.webp"`,
  ]);

  await runFFmpeg([
    '-y',
    '-i', `"${sourcePath}"`,
    '-vf', `"${filter}"`,
    '-c:v', 'libaom-av1',
    '-crf', '35',
    '-pix_fmt', 'yuv420p',
    '-cpu-used', '4',
    `"${targetPath}.avif"`,
  ]);
}

// 处理图片列表
async function processImageList(imageList, sourceDir, targetDir, projectId, categoryName) {
  const results = [];
  let fileIndex = 0;

  // 获取当前目录中已有的文件数量，用于确定起始编号
  const existingFiles = fs.readdirSync(targetDir).filter(f => f.endsWith('.jpg') && !f.startsWith('thumb-'));
  fileIndex = existingFiles.length;

  console.log(`Processing ${categoryName} (${imageList.length} images)...`);

  for (const baseName of imageList) {
    fileIndex++;
    const newName = String(fileIndex).padStart(2, '0');
    const sourceJpg = path.join(sourceDir, `${baseName}.jpg`);

    if (!fs.existsSync(sourceJpg)) {
      console.log(`  [SKIP] ${baseName} - file not found`);
      continue;
    }

    // 复制大图文件
    for (const ext of ['jpg', 'webp', 'avif']) {
      const source = path.join(sourceDir, `${baseName}.${ext}`);
      const target = path.join(targetDir, `${newName}-${projectId}.${ext}`);
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, target);
      }
    }

    // 生成缩略图
    const thumbBase = path.join(targetDir, `thumb-${newName}-${projectId}`);
    await generateThumbnail(sourceJpg, thumbBase);

    results.push(`/images/projects/${projectId}/${newName}-${projectId}`);
    console.log(`  [${fileIndex}] ${baseName.substring(0, 40)}...`);
  }

  return results;
}

// 处理单个项目
async function processProject(project) {
  console.log(`\n=== ${project.id} ===\n`);

  const sourceFullDir = path.join(tempDir, project.tempDir, 'full');
  const targetDir = path.join(projectsDir, project.id);

  // 备份旧文件
  const backupDir = `${targetDir}-backup-${Date.now()}`;
  if (fs.existsSync(targetDir)) {
    console.log(`Backing up to: ${path.basename(backupDir)}`);
    fs.cpSync(targetDir, backupDir, { recursive: true });

    // 清理旧文件（保留目录）
    const oldFiles = fs.readdirSync(targetDir);
    for (const f of oldFiles) {
      fs.unlinkSync(path.join(targetDir, f));
    }
  }
  fs.mkdirSync(targetDir, { recursive: true });

  const results = {
    gallery: [],
    landscape: [],
    interior: [],
  };

  // 处理 gallery (建筑外观)
  if (project.gallery && project.gallery.length > 0) {
    results.gallery = await processImageList(project.gallery, sourceFullDir, targetDir, project.id, 'gallery (建筑外观)');
  }

  // 处理 landscape (景观)
  if (project.landscape && project.landscape.length > 0) {
    console.log('');
    results.landscape = await processImageList(project.landscape, sourceFullDir, targetDir, project.id, 'landscape (景观)');
  }

  // 处理 interior (室内)
  if (project.interior && project.interior.length > 0) {
    console.log('');
    results.interior = await processImageList(project.interior, sourceFullDir, targetDir, project.id, 'interior (室内)');
  }

  return results;
}

async function main() {
  console.log('====================================');
  console.log('Step 2: Rename & Organize Photos');
  console.log('====================================\n');

  const results = {};
  for (const project of projects) {
    const result = await processProject(project);
    results[project.id] = result;
  }

  console.log('\n====================================');
  console.log('Summary');
  console.log('====================================');

  for (const [id, result] of Object.entries(results)) {
    console.log(`\n${id}:`);
    console.log(`  gallery: ${result.gallery.length} images`);
    console.log(`  landscapeImages: ${result.landscape.length} images`);
    if (result.interior.length > 0) {
      console.log(`  interiorImages: ${result.interior.length} images`);
    }
  }

  // 输出 projects.js 配置片段
  console.log('\n====================================');
  console.log('projects.js 配置片段');
  console.log('====================================\n');

  for (const [id, result] of Object.entries(results)) {
    console.log(`// ${id}`);
    if (result.gallery.length > 0) {
      console.log(`gallery: [`);
      for (const p of result.gallery) {
        console.log(`  '${p}',`);
      }
      console.log(`],`);
    }
    if (result.landscape.length > 0) {
      console.log(`landscapeImages: [`);
      for (const p of result.landscape) {
        console.log(`  '${p}',`);
      }
      console.log(`],`);
    }
    if (result.interior.length > 0) {
      console.log(`interiorImages: [`);
      for (const p of result.interior) {
        console.log(`  '${p}',`);
      }
      console.log(`],`);
    }
    console.log('');
  }
}

main().catch(console.error);
