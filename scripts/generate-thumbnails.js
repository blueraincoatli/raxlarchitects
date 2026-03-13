import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const rootDir = 'D:/raxlarchitects';
const projectsDir = path.join(rootDir, 'images/projects');
const THUMB_WIDTH = 200;
const THUMB_HEIGHT = 150;

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  const jpgImages = files.filter(f => {
    const isJpg = f.endsWith('.jpg') || f.endsWith('.jpeg');
    const isThumb = f.startsWith('thumb-');
    return isJpg && !isThumb;
  });

  if (jpgImages.length === 0) {
    console.log('Skip: ' + dir);
    return;
  }

  console.log('Processing: ' + dir + ' (' + jpgImages.length + ' files)');

  for (const file of jpgImages) {
    const sourcePath = path.join(dir, file);
    const baseName = file.replace('.jpg', '').replace('.jpeg', '');
    const thumbBase = path.join(dir, 'thumb-' + baseName);

    try {
      // Check if all formats exist
      const hasAvif = fs.existsSync(thumbBase + '.avif');
      const hasWebp = fs.existsSync(thumbBase + '.webp');
      const hasJpg = fs.existsSync(thumbBase + '.jpg');
      
      if (hasAvif && hasWebp && hasJpg) {
        console.log('  [SKIP] thumb-' + file);
        continue;
      }
      
      console.log('  [GENERATE] thumb-' + file);
      await generateThumbnail(sourcePath, thumbBase);
    } catch (error) {
      console.error('  Error: ' + file + ' - ' + error.message);
    }
  }
}

async function generateThumbnail(sourcePath, targetBase) {
  const filter = 'scale=' + THUMB_WIDTH + ':' + THUMB_HEIGHT + ':force_original_aspect_ratio=increase,crop=' + THUMB_WIDTH + ':' + THUMB_HEIGHT;
  
  // AVIF
  if (!fs.existsSync(targetBase + '.avif')) {
    try {
      await runCmd('ffmpeg -i "' + sourcePath + '" -vf "' + filter + '" -c:v libaom-av1 -crf 40 -pix_fmt yuv420p -frames:v 1 "' + targetBase + '.avif"');
      console.log('    AVIF ok');
    } catch (e) { console.warn('    AVIF failed'); }
  }

  // WebP
  if (!fs.existsSync(targetBase + '.webp')) {
    try {
      await runCmd('ffmpeg -i "' + sourcePath + '" -vf "' + filter + '" -c:v libwebp -quality 75 -preset photo -frames:v 1 "' + targetBase + '.webp"');
      console.log('    WebP ok');
    } catch (e) { console.warn('    WebP failed'); }
  }

  // JPG
  if (!fs.existsSync(targetBase + '.jpg')) {
    try {
      await runCmd('ffmpeg -i "' + sourcePath + '" -vf "' + filter + '" -c:v mjpeg -q:v 5 -frames:v 1 "' + targetBase + '.jpg"');
      console.log('    JPG ok');
    } catch (e) { console.warn('    JPG failed'); }
  }
}

function runCmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: rootDir }, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function main() {
  console.log('=== Generating Thumbnails ===\n');
  const dirs = fs.readdirSync(projectsDir).filter(d => {
    const stat = fs.statSync(path.join(projectsDir, d));
    return stat.isDirectory();
  });

  for (const dir of dirs) {
    await processDirectory(path.join(projectsDir, dir));
  }
  console.log('\n=== Done ===');
}

main().catch(console.error);
