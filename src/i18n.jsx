import { createContext, useContext, useState } from 'react';

// 语言上下文
const LanguageContext = createContext(null);

// 语言提供者组件
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // 从 localStorage 读取保存的语言设置
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('site_lang');
      return saved || 'zh';
    }
    return 'zh';
  });

  const value = {
    lang,
    setLang: (newLang) => {
      setLang(newLang);
      localStorage.setItem('site_lang', newLang);
    },
    t: (key) => getMessage(key, lang),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 使用语言的 Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// 消息映射
const messages = {
  zh: {
    // 导航
    'nav.home': '首页',
    'nav.projects': '作品',
    'nav.about': '关于',
    'nav.contact': '联系',
    'nav.search': '搜索',
    'nav.langToggle': '中/英',

    // 导航子菜单
    'nav.statusGroup': '状态',
    'nav.categoryGroup': '分类',
    'nav.finalized': '已建成',
    'nav.underConstruction': '建设中',
    'nav.proposed': '提案中',
    'nav.architecture': '建筑',
    'nav.interior': '室内',
    'nav.landscape': '景观',
    'nav.show': '秀场',
    'nav.aboutUs': '关于我们',
    'nav.partners': '团队',
    'nav.awards': '荣誉',

    // 项目状态
    'status.finalized': '已建成',
    'status.under-construction': '建设中',
    'status.proposed': '提案中',

    // 项目分类
    'category.architecture': '建筑',
    'category.interior': '室内',
    'category.landscape': '景观',
    'category.show': '秀场',
    'category.other': '其他',

    // 详情页
    'detail.status': '状态',
    'detail.category': '分类',
    'detail.notFound': '项目未找到',

    // 搜索
    'search.placeholder': '搜索项目...',
    'search.noResults': '未找到相关项目',

    // 页脚
    'footer.copyright': '© 2024 RA Architects. All rights reserved.',

    // 通用
    'common.loading': '加载中...',
    'common.close': '关闭',
    'common.viewProject': '查看详情',
    'common.searchProjects': '搜索项目',
    'common.searchPlaceholder': '输入项目名称或位置...',
    'common.searchHint': '输入关键词搜索项目',
    'common.searchNoResults': '未找到匹配的项目',
  },
  en: {
    // Navigation
    'nav.home': 'HOME',
    'nav.projects': 'PROJECTS',
    'nav.about': 'ABOUT',
    'nav.contact': 'CONTACT',
    'nav.search': 'SEARCH',
    'nav.langToggle': 'EN/ZH',

    // Nav Submenu
    'nav.statusGroup': 'STATUS',
    'nav.categoryGroup': 'CATEGORY',
    'nav.finalized': 'FINALIZED',
    'nav.underConstruction': 'UNDER CONSTRUCTION',
    'nav.proposed': 'PROPOSED',
    'nav.architecture': 'ARCHITECTURE',
    'nav.interior': 'INTERIOR',
    'nav.landscape': 'LANDSCAPE',
    'nav.show': 'SHOW',
    'nav.aboutUs': 'ABOUT US',
    'nav.partners': 'PARTNERS',
    'nav.awards': 'AWARDS',

    // Project Status
    'status.finalized': 'FINALIZED',
    'status.under-construction': 'UNDER CONSTRUCTION',
    'status.proposed': 'PROPOSED',

    // Project Categories
    'category.architecture': 'ARCHITECTURE',
    'category.interior': 'INTERIOR',
    'category.landscape': 'LANDSCAPE',
    'category.show': 'SHOW',
    'category.other': 'OTHER',

    // Detail Page
    'detail.status': 'STATUS',
    'detail.category': 'CATEGORY',
    'detail.notFound': 'Project not found',

    // Search
    'search.placeholder': 'Search projects...',
    'search.noResults': 'No projects found',

    // Footer
    'footer.copyright': '© 2024 RA Architects. All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.close': 'Close',
    'common.viewProject': 'VIEW PROJECT',
    'common.searchProjects': 'SEARCH PROJECTS',
    'common.searchPlaceholder': 'Enter project name or location...',
    'common.searchHint': 'Type keywords to search projects',
    'common.searchNoResults': 'No matching projects found',
  },
};

// 项目状态标签映射
const statusLabelMap = {
  finalized: { zh: '已建成', en: 'FINALIZED' },
  'under-construction': { zh: '建设中', en: 'UNDER CONSTRUCTION' },
  proposed: { zh: '提案中', en: 'PROPOSED' },
};

// 项目分类标签映射
const categoryLabelMap = {
  architecture: { zh: '建筑', en: 'ARCHITECTURE' },
  interior: { zh: '室内', en: 'INTERIOR' },
  landscape: { zh: '景观', en: 'LANDSCAPE' },
  show: { zh: '秀场', en: 'SHOW' },
  other: { zh: '其他', en: 'OTHER' },
};

// 项目名称翻译映射
const projectNameMap = {
  'one-park-gubei': { zh: '古北壹号', en: 'ONE PARK GUBEI' },
  'royal-pavilion': { zh: '华山公寓', en: 'ROYAL PAVILION' },
  'upper-east': { zh: '尚东鼎', en: 'UPPER EAST' },
  rongxinarc: { zh: '杭州融信', en: 'RONGXIN ARC' },
  'macalline-anji': { zh: '安吉度假别墅', en: 'ANJI RESORT VILLA' },
  'prime-dynapolis': { zh: '品尊国际（三期）', en: 'PRIME DYNAPOLIS (PHASE III)' },
  'moment-to-cloud': { zh: '开云·艾尚里', en: 'MOMENT TO CLOUD' },
  'lot-hk231': { zh: '新湖·天虹', en: 'LOT HK231' },
  chairclub: { zh: 'Chair Club', en: 'CHAIR CLUB' },
  'content-office-shop': { zh: 'Content Office & Shop', en: 'CONTENT OFFICE & SHOP' },
  'content-show': { zh: 'Content Show', en: 'CONTENT SHOW' },
};

// 项目客户翻译映射
const projectClientMap = {
  'one-park-gubei': { zh: '福来国际（上海）有限公司', en: 'WEALINE INTERNATIONAL (SHANGHAI) CO., LTD.' },
  'royal-pavilion': { zh: '上海和峰源置业有限公司', en: 'HEFENGYUAN (SHANGHAI) CO., LTD.' },
  'upper-east': { zh: '中万置业（上海）有限公司', en: 'ZHONGWAN (SHANGHAI) CO., LTD.' },
  rongxinarc: { zh: '杭州融誉房地产开发有限公司', en: 'Hangzhou Rongyu Real Estate Development Co., Ltd.' },
  'macalline-anji': { zh: '红星美凯龙', en: 'Red Star Macalline' },
  'prime-dynapolis': { zh: '上海明捷置业有限公司', en: 'Shanghai Mingjie Real Estate Co., Ltd.' },
  'moment-to-cloud': { zh: '上海北蔡新城镇开发有限公司', en: 'Shanghai Beicai New Town Development Co., Ltd.' },
  'lot-hk231': { zh: '上海新湖天虹城市开发有限公司', en: 'Shanghai Xinhu Tianhong Urban Development Co., Ltd.' },
  chairclub: { zh: '私人业主', en: 'Private Client' },
  'content-office-shop': { zh: '万科集团', en: 'Vanke Group' },
  'content-show': { zh: '上海市绿化局', en: 'Shanghai Municipal Greening Bureau' },
};

// 项目描述翻译映射（详细信息）
const projectDescriptionMap = {
  'one-park-gubei': {
    zh: '项目名称：上海古北壹号（ONE PARK GUBEI）。业主：福来国际（上海）有限公司。建筑设计：上海锐点建筑设计有限公司。建筑施工图设计：上海天华建筑设计有限公司。设计团队：饶青、林海新、胡继伟、乐俊平、黄先岳。室内设计：维迩森室内建筑设计（上海）有限公司、梁志天设计咨询（深圳）有限公司、美高建设（中国）有限公司。景观设计：贝尔高林国际（新加坡）私人有限公司、上海锐点建筑设计有限公司。设计时间：2009年。建成时间：2015年。建筑面积：147,500㎡。',
    en: 'Project Name: Shanghai ONE PARK GUBEI. Client: WEALINE INTERNATIONAL (SHANGHAI) CO., LTD. Architectural Design: RA ARCHITECTS CO., LTD. Construction Drawing Design: TIANHUA Architect Planning & Engineering Ltd. Design Team: Rao Qing, Lin Haixin, Hu Jiwei, Le Junping, Huang Xianyue. Interior Design: Wilson Associates Interior Architectural Design, Steve Leung Designers, and MEGO Decoration (China) Co., Ltd. Landscape Design: Belt Collins International (Singapore) Pte Ltd and RA ARCHITECTS CO., LTD. Design Year: 2009. Completion Year: 2015. Gross Floor Area: 147,500 sqm.',
  },
  'royal-pavilion': {
    zh: '项目名称：上海华山公寓（Royal Pavilion）。业主：上海和峰源置业有限公司。建筑设计：上海锐点建筑设计有限公司。室内设计：梁志天设计咨询（深圳）有限公司。景观设计：上海锐点建筑设计有限公司。设计时间：2016年。建成时间：2018年。建筑面积：34,800㎡。',
    en: 'Project: Shanghai Royal Pavilion. Client: HEFENGYUAN (SHANGHAI) CO., LTD. Architectural Design: RA ARCHITECTS CO., LTD. Interior Design: Steve Leung Designers. Landscape Design: RA ARCHITECTS CO., LTD. Design Year: 2016. Completion Year: 2018. Gross Floor Area: 34,800 sqm.',
  },
  'upper-east': {
    zh: '项目名称：上海尚东国际名园&尚东鼎（UPPER EAST）。业主：中万置业（上海）有限公司。建筑设计：上海锐点建筑设计有限公司。室内设计：美高建设（中国）有限公司。景观设计：上海锐点建筑设计有限公司。设计时间：2004-2008年。建成时间：2010年。建筑面积：300,000㎡。',
    en: 'Project: Shanghai UPPER EAST. Client: ZHONGWAN (SHANGHAI) CO., LTD. Architectural Design: RA ARCHITECTS CO., LTD. Interior Design: MEGO Decoration (China) Co., Ltd. Landscape Design: RA ARCHITECTS CO., LTD. Design Period: 2004-2008. Completion Year: 2010. Gross Floor Area: 300,000 sqm.',
  },
  rongxinarc: {
    zh: '项目名称：杭州·融信公馆ARC。项目业主：杭州融誉房地产开发有限公司。建筑设计：上海锐点建筑设计有限公司。设计时间：2016-2017。建成时间：2020年。建筑面积：119,719㎡。奖项荣誉：2018年金盘奖"总评选最佳住宅""浙江赛区年度最佳住宅奖"。状态：已建成。',
    en: 'Project: Hangzhou Rongxin Mansion ARC. Client: Hangzhou Rongyu Real Estate Development Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD. Design Period: 2016-2017. Completion Year: 2020. Gross Floor Area: 119,719 sqm. Awards: 2018 Golden Platter Awards - Best Residential Project (Overall) and Best Residential Project of Zhejiang Region. Status: Finalized.',
  },
  'macalline-anji': {
    zh: '项目信息：红星美凯龙安吉度假别墅。建筑设计：上海锐点建筑设计有限公司。设计时间：2017年。状态：提案。',
    en: 'Project: Red Star Macalline Anji Resort Villa. Architectural Design: RA ARCHITECTS CO., LTD. Design Year: 2017. Status: Proposed.',
  },
  'prime-dynapolis': {
    zh: '项目名称：品尊国际（三期）（Prime Dynapolis）。项目业主：上海明捷置业有限公司。建筑设计：上海锐点建筑设计有限公司。建筑施工图设计：上海民用建筑设计院。室内设计：梁志天设计咨询有限公司。景观设计：SCDA Architects。设计时间：2020年。建成时间：2024年。建筑面积：地上136,399㎡，地下62,193㎡。状态：建设中。',
    en: 'Project: Prime Dynapolis (Phase III). Client: Shanghai Mingjie Real Estate Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD. Construction Drawing Design: Shanghai Civil Architectural Design Institute. Interior Design: Steve Leung Designers. Landscape Design: SCDA Architects. Design Year: 2020. Expected Completion: 2024. Gross Floor Area: 136,399 sqm above ground and 62,193 sqm below ground. Status: Under Construction.',
  },
  'moment-to-cloud': {
    zh: '项目名称：开云·艾尚里（Moment To Cloud）。项目业主：上海北蔡新城镇开发有限公司。建筑设计：上海锐点建筑设计有限公司。建筑施工图设计：上海筑景建筑设计有限公司。室内设计：上海锐点建筑设计有限公司。景观设计：上海锐点建筑设计有限公司。设计时间：2019年起。建成时间：2024年。建筑面积：地上180,953㎡，地下138,151㎡。状态：建设中。',
    en: 'Project: Moment To Cloud. Client: Shanghai Beicai New Town Development Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD. Construction Drawing Design: Shanghai Zhujing Architectural Design Co., Ltd. Interior Design: RA ARCHITECTS CO., LTD. Landscape Design: RA ARCHITECTS CO., LTD. Design Start: 2019. Expected Completion: 2024. Gross Floor Area: 180,953 sqm above ground and 138,151 sqm below ground. Status: Under Construction.',
  },
  'lot-hk231': {
    zh: '项目名称：北外滩32街坊（Lot HK231-01，North Bund Street，Hongkou District）。项目业主：上海新湖天虹城市开发有限公司。建筑设计：上海锐点建筑设计有限公司、大象建筑（GOA）设计有限公司。建筑施工图设计：上海中房建筑设计有限公司。设计时间：2020年。建成时间：2025年。建筑面积：地上56,443㎡，地下55,761㎡。状态：建设中。',
    en: 'Project: Lot HK231-01, North Bund Street, Hongkou District. Client: Shanghai Xinhu Tianhong Urban Development Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD and GOA (Group of Architects). Construction Drawing Design: Shanghai Zhongfang Architectural Design Co., Ltd. Design Year: 2020. Expected Completion: 2025. Gross Floor Area: 56,443 sqm above ground and 55,761 sqm below ground. Status: Under Construction.',
  },
  chairclub: {
    zh: '',
    en: '',
  },
  'content-office-shop': {
    zh: '',
    en: '',
  },
  'content-show': {
    zh: '',
    en: '',
  },
};

const locationCityMap = {
  上海: 'Shanghai',
  杭州: 'Hangzhou',
  安吉: 'Anji',
  嘉兴: 'Jiaxing',
  开化: 'Kaihua',
};

// 获取翻译消息
function getMessage(key, lang) {
  return messages[lang]?.[key] || messages['zh'][key] || key;
}

// 获取项目状态标签
export function getStatusLabel(status, lang) {
  return statusLabelMap[status]?.[lang] || status;
}

// 获取项目分类标签
export function getCategoryLabel(category, lang) {
  return categoryLabelMap[category]?.[lang] || category;
}

// 获取项目名称
export function getProjectName(project, lang) {
  if (!project) return '';
  const mapped = projectNameMap[project.id];
  if (mapped && Object.prototype.hasOwnProperty.call(mapped, lang)) {
    return mapped[lang];
  }
  return project.name;
}

// 获取项目位置
export function getProjectLocation(project, lang) {
  if (!project) return '';
  const location = project.location;
  if (lang === 'en') {
    // 解析位置格式 "城市 · 国家"
    const parts = location.split(' · ');
    if (parts.length === 2) {
      const city = parts[0];
      const country = parts[1];
      const cityEn = locationCityMap[city] || city;
      return `${cityEn} · ${country}`;
    }
    return location;
  }
  return location;
}

// 获取项目客户
export function getProjectClient(project, lang) {
  if (!project) return '';
  const mapped = projectClientMap[project.id];
  if (mapped && Object.prototype.hasOwnProperty.call(mapped, lang)) {
    return mapped[lang];
  }
  return project.client;
}

// 获取项目描述（详细信息）
export function getProjectDescription(project, lang) {
  if (!project) return '';
  const mapped = projectDescriptionMap[project.id];
  if (mapped && Object.prototype.hasOwnProperty.call(mapped, lang)) {
    return mapped[lang];
  }
  return project.description;
}

export function getProjectDetailEntries(project, lang) {
  const raw = (getProjectDescription(project, lang) || '').trim();
  if (!raw) return [];

  const splitBySentence = (text) => {
    if (lang === 'zh') {
      return text
        .split('。')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `${line}。`);
    }

    return text
      .split('. ')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => (line.endsWith('.') ? line : `${line}.`));
  };

  const lines = splitBySentence(raw);
  return lines.map((line) => {
    const cleaned = line.endsWith('。') || line.endsWith('.')
      ? line.slice(0, -1).trim()
      : line.trim();
    const match = cleaned.match(/^([^:：]+)\s*[:：]\s*(.+)$/);
    if (!match) {
      return { text: line };
    }
    return {
      label: match[1].trim(),
      value: match[2].trim(),
    };
  });
}

export function formatDetailLabel(label, lang) {
  if (!label) return '';
  if (lang === 'zh') {
    return label;
  }
  return label.toUpperCase();
}
