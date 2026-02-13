const fs = require('fs');

// 简单的CSS格式化工具 - 只添加换行和缩进，不破坏CSS语法
function formatCSS(css) {
  let formatted = '';
  let indent = 0;
  const indentStr = '    ';
  let inRule = false;
  let inComment = false;

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    const next = css[i + 1] || '';

    // 处理注释
    if (char === '/' && next === '*') {
      inComment = true;
      formatted += '/*';
      i++;
      continue;
    }
    if (inComment && char === '*' && next === '/') {
      inComment = false;
      formatted += '*/';
      i++;
      continue;
    }
    if (inComment) {
      formatted += char;
      continue;
    }

    // 处理规则开始
    if (char === '{') {
      formatted += ' {\n';
      indent++;
      inRule = true;
      continue;
    }

    // 处理规则结束
    if (char === '}') {
      indent--;
      formatted += indentStr.repeat(indent) + '}\n';
      inRule = false;
      continue;
    }

    // 处理分号
    if (char === ';' && inRule) {
      formatted += ';\n' + indentStr.repeat(indent);
      continue;
    }

    // 处理逗号
    if (char === ',') {
      formatted += ', ';
      // 跳过可能的空格
      while (css[i + 1] === ' ') i++;
      continue;
    }

    // 其他字符直接添加
    formatted += char;
  }

  return formatted;
}

const inputFile = 'assets/index-CVG2TpGm.css';
const outputFile = 'assets/index-CVG2TpGm-formatted.css';

console.log('读取CSS文件...');
const css = fs.readFileSync(inputFile, 'utf8');
console.log(`原始大小: ${(css.length / 1024).toFixed(2)} KB`);

console.log('格式化中...');
const formatted = formatCSS(css);

console.log(`格式化后大小: ${(formatted.length / 1024).toFixed(2)} KB`);

fs.writeFileSync(outputFile, formatted, 'utf8');
console.log(`✅ 写入: ${outputFile}`);

// 显示前几行对比
console.log('\n前几行对比:');
console.log('原始:');
console.log(css.substring(0, 200));
console.log('\n格式化:');
console.log(formatted.substring(0, 500));
