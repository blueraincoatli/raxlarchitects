const fs = require('fs');
const { minify } = require('terser');

const INPUT_FILE = 'assets/index-BUkr1E8Sbeautified.js';
const OUTPUT_FILE = 'assets/index-BUkr1E8S.js';

async function build() {
  console.log('读取 beautified 文件...');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`错误: 找不到文件 ${INPUT_FILE}`);
    process.exit(1);
  }

  const code = fs.readFileSync(INPUT_FILE, 'utf8');
  console.log(`文件大小: ${(code.length / 1024).toFixed(2)} KB`);

  console.log('压缩中...');

  try {
    const result = await minify(code, {
      compress: {
        passes: 3,
        unsafe: false
      },
      mangle: {
        toplevel: false
      },
      ecma: 2015,
      keep_classnames: false,
      keep_fnames: false
    });

    if (result.error) {
      console.error('压缩错误:', result.error);
      process.exit(1);
    }

    // 备份原文件
    if (fs.existsSync(OUTPUT_FILE)) {
      const backupPath = OUTPUT_FILE + '.backup';
      fs.copyFileSync(OUTPUT_FILE, backupPath);
      console.log(`已备份到: ${backupPath}`);
    }

    // 写入压缩文件
    fs.writeFileSync(OUTPUT_FILE, result.code, 'utf8');
    console.log(`压缩后大小: ${(result.code.length / 1024).toFixed(2)} KB`);
    console.log(`压缩率: ${((1 - result.code.length / code.length) * 100).toFixed(1)}%`);
    console.log(`✅ 成功写入: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('构建失败:', error.message);
    process.exit(1);
  }
}

build();
