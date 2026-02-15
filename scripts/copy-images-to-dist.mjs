import { cp, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'images');
const targetDir = path.join(rootDir, 'dist', 'images');

async function run() {
  try {
    const sourceStat = await stat(sourceDir);
    if (!sourceStat.isDirectory()) {
      throw new Error(`Source is not a directory: ${sourceDir}`);
    }
  } catch (error) {
    throw new Error(`Missing images directory: ${sourceDir}`);
  }

  await mkdir(path.dirname(targetDir), { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true, force: true });
  console.log(`Copied images to ${targetDir}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
