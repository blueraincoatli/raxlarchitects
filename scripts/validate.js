const fs = require('fs');
const path = require('path');

const BEAUTIFIED_FILE = 'assets/index-BUkr1E8Sbeautified.js';

console.log('验证网站内容...\n');

// 读取文件
const code = fs.readFileSync(BEAUTIFIED_FILE, 'utf8');

// 1. 检查中文引号
console.log('1. 检查中文引号...');
const leftQuotes = (code.match(/\u201c/g) || []).length;
const rightQuotes = (code.match(/\u201d/g) || []).length;

if (leftQuotes > 0 || rightQuotes > 0) {
  console.log(`   ⚠️  发现中文引号: 左引号 ${leftQuotes} 个, 右引号 ${rightQuotes} 个`);
  console.log('   位置查找中...');

  for (let i = 0; i < code.length; i++) {
    if (code.charCodeAt(i) === 0x201C || code.charCodeAt(i) === 0x201D) {
      const context = code.substring(Math.max(0, i - 40), Math.min(code.length, i + 40));
      console.log(`   位置 ${i}: ...${context}...`);
      if (i > 0) break; // 只显示第一个
    }
  }
} else {
  console.log('   ✅ 未发现中文引号');
}

// 2. 提取项目数据
console.log('\n2. 提取项目数据...');

const projectsMatch = code.match(/pe = \[([\s\S]*?)\];/);
if (projectsMatch) {
  const projectsCode = projectsMatch[0];
  const projectCount = (projectsCode.match(/\{[\s\S]*?id: "/g) || []).length;
  console.log(`   ✅ 找到 ${projectCount} 个项目`);

  // 提取项目ID和名称
  const idPattern = /id: "([^"]+)"/g;
  const ids = [];
  let match;
  while ((match = idPattern.exec(projectsCode)) !== null) {
    ids.push(match[1]);
  }
  console.log('   项目 IDs:', ids.join(', '));
} else {
  console.log('   ⚠️  未找到项目数组');
}

// 3. 提取文本内容位置
console.log('\n3. 文本内容位置...');

const textSections = [
  { name: '导航标签', pattern: /Ar = \{[\s\S]*?title: "([^"]+)"/ },
  { name: '关于我们', pattern: /Nr = \{/ },
  { name: '联系我们', pattern: /Tr = \{/ },
  { name: '页脚', pattern: /Or = \{/ }
];

textSections.forEach(section => {
  const match = code.match(section.pattern);
  if (match) {
    const pos = code.indexOf(match[0]);
    const line = code.substring(0, pos).split('\n').length;
    console.log(`   ✅ ${section.name}: 第 ${line} 行`);
  }
});

// 4. 检查图片路径
console.log('\n4. 检查图片路径...');

const imagePattern = /image: "([^"]+)"/g;
const images = [];
while ((match = imagePattern.exec(code)) !== null) {
  images.push(match[1]);
}

console.log(`   找到 ${images.length} 个图片引用:`);

let missingCount = 0;

images.slice(0, 12).forEach(imgPath => {
  const fullPath = path.join(process.cwd(), imgPath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`   ${status} ${imgPath}`);
  if (!exists) missingCount++;
});

if (missingCount > 0) {
  console.log(`   ⚠️  ${missingCount} 个图片文件缺失`);
} else {
  console.log('   ✅ 所有检查的图片文件存在');
}

// 5. 检查项目名称一致性
console.log('\n5. 检查项目名称一致性...');

// 提取 Ar 对象中的 items
const arObjectStart = code.indexOf('Ar = {');
if (arObjectStart > 0 && projectsMatch) {
  // 找到 Ar 对象中 items: { 的位置
  const arObjectContent = code.substring(arObjectStart);
  const itemsInAr = arObjectContent.indexOf('items: {');

  if (itemsInAr > 0) {
    const itemsStart = arObjectStart + itemsInAr + 8; // 'items: {' 的长度

    // 找到 items 对象的结束位置
    let depth = 1;
    let itemsEnd = itemsStart;
    const itemsContent = code.substring(itemsStart);

    for (let i = 0; i < itemsContent.length && depth > 0; i++) {
      if (itemsContent[i] === '{') depth++;
      if (itemsContent[i] === '}') depth--;
      if (depth === 0) {
        itemsEnd = itemsStart + i;
        break;
      }
    }

    const itemsCode = code.substring(itemsStart, itemsEnd);

    // 提取 items 中的顶级键名（格式：xxx: {）
    const itemKeys = [];
    const keyPattern = /^\s{12}([a-zA-Z0-9]+): \{/gm;
    while ((match = keyPattern.exec(itemsCode)) !== null) {
      itemKeys.push(match[1]);
    }

    // 提取项目数组中的 key 值（格式：projects.items.xxx）
    const arrayKeys = [];
    const arrayKeyPattern = /key: "projects\.items\.([^"]+)"/g;
    while ((match = arrayKeyPattern.exec(projectsMatch[0])) !== null) {
      arrayKeys.push(match[1]);
    }

    // 检查一致性
    const missingInItems = arrayKeys.filter(k => !itemKeys.includes(k));
    const missingInArray = itemKeys.filter(k => !arrayKeys.includes(k));

    if (missingInItems.length > 0) {
      console.log(`   ⚠️  项目数组引用的 items 缺失: ${missingInItems.join(', ')}`);
    }
    if (missingInArray.length > 0) {
      console.log(`   ⚠️  items 定义但未被项目数组引用: ${missingInArray.join(', ')}`);
    }
    if (missingInItems.length === 0 && missingInArray.length === 0) {
      console.log('   ✅ 项目名称引用完全一致');
    }
  }
}

console.log('\n验证完成！');
