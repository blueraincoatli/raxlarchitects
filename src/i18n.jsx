import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

const messages = {
  en: {
    nav: {
      home: 'HOME',
      projects: 'PROJECTS',
      about: 'ABOUT US',
      contact: 'CONTACT US',
      finalized: 'FINALIZED PROJECT',
      underConstruction: 'UNDER CONSTRUCTION',
      proposed: 'PROPOSED PROJECT',
      architecture: 'ARCHITECTURE',
      interior: 'INTERIOR',
      landscape: 'LANDSCAPE',
      aboutUs: 'ABOUT US',
      partners: 'PARTNERS',
      awards: 'AWARDS',
      search: 'SEARCH',
      statusGroup: 'STATUS',
      categoryGroup: 'CATEGORY',
      langToggle: '中文',
    },
    common: {
      viewProject: 'VIEW PROJECT',
      loading: 'Loading...',
      noMatch: 'No matching projects',
      switchFilter: 'Please switch filters to view other projects.',
      viewAllProjects: 'View all projects',
      partnerNotFound: 'Partner not found.',
      backToPartners: 'Back to Partners',
      aboutMe: 'About Me',
      close: 'Close',
      searchProjects: 'Search Projects',
      searchPlaceholder: 'Search by project name or city...',
      searchHint: 'Type to search projects.',
      searchNoResults: 'No matching projects found.',
    },
    detail: {
      client: 'Client',
      year: 'Year',
      area: 'Area',
      status: 'Status',
      category: 'Category',
      notFound: 'Project not found',
    },
  },
  zh: {
    nav: {
      home: '首页',
      projects: '项目',
      about: '关于我们',
      contact: '联系我们',
      finalized: '已建成项目',
      underConstruction: '建设中项目',
      proposed: '提案中项目',
      architecture: '建筑',
      interior: '室内',
      landscape: '景观',
      aboutUs: '关于我们',
      partners: '合伙人',
      awards: '奖项',
      search: '搜索',
      statusGroup: '进度',
      categoryGroup: '分类',
      langToggle: 'EN',
    },
    common: {
      viewProject: '查看项目',
      loading: '加载中...',
      noMatch: '暂无匹配项目',
      switchFilter: '请切换筛选条件查看其他项目。',
      viewAllProjects: '查看全部项目',
      partnerNotFound: '未找到设计师。',
      backToPartners: '返回合伙人',
      aboutMe: '关于我',
      close: '关闭',
      searchProjects: '搜索项目',
      searchPlaceholder: '输入项目名或城市进行搜索...',
      searchHint: '输入关键词开始搜索项目。',
      searchNoResults: '未找到匹配项目。',
    },
    detail: {
      client: '客户',
      year: '年份',
      area: '面积',
      status: '状态',
      category: '分类',
      notFound: '未找到项目',
    },
  },
};

const projectNameMap = {
  'one-park-gubei': { en: 'ONE PARK GUBEI' },
  'royal-pavilion': { en: 'ROYAL PAVILION' },
  'upper-east': { en: 'UPPER EAST' },
  rongxinarc: { en: 'RONGXIN ARC' },
  'macalline-anji': { en: 'ANJI RESORT VILLA' },
  'prime-dynapolis': { en: 'PRIME DYNAPOLIS (PHASE III)' },
  'moment-to-cloud': { en: 'MOMENT TO CLOUD' },
  'lot-hk231': { en: 'LOT HK231' },
  chairclub: { en: 'CHAIR CLUB' },
  'content-office-shop': { en: 'CONTENT OFFICE & SHOP' },
  'content-show': { en: 'CONTENT SHOW' },
};

const projectClientMap = {
  'one-park-gubei': { en: 'Vanke Group' },
  'royal-pavilion': { en: 'China Resources Land' },
  'upper-east': { en: 'Private Client' },
  rongxinarc: { en: 'Sunac China' },
  'macalline-anji': { en: 'Red Star Macalline' },
  'prime-dynapolis': { en: 'Vanke Group' },
  'moment-to-cloud': { en: 'Kaihua Municipal Government' },
  'lot-hk231': { en: 'Xinhu Zhongbao' },
  chairclub: { en: 'Private Client' },
  'content-office-shop': { en: 'Vanke Group' },
  'content-show': { en: 'Shanghai Landscaping Administration' },
};

const projectDescriptionMap = {
  'one-park-gubei': {
    en: 'An urban renewal project in Gubei that blends tradition and contemporary living through innovative spatial organization.',
  },
  'royal-pavilion': {
    en: 'A high-end apartment project in central Shanghai focused on functional planning, comfort and material quality.',
  },
  'upper-east': {
    en: 'A premium residential project in Pudong integrating modern urban life with landscape-oriented living.',
  },
  rongxinarc: {
    en: 'An innovation-oriented complex built around an integrated ecosystem for work, life and learning.',
  },
  'macalline-anji': {
    en: 'A resort villa concept in Anji inspired by the bamboo forest context and low-impact architectural strategies.',
  },
  'prime-dynapolis': {
    en: 'Phase III extension of Prime Dynapolis, continuing the urban renewal approach with renewed community vitality.',
  },
  'moment-to-cloud': {
    en: 'A regeneration proposal in old Kaihua, reinterpreting local urban heritage with contemporary functions.',
  },
  'lot-hk231': {
    en: 'A waterfront residential development in Jiaxing inspired by the spatial rhythm of Rainbow Bridge.',
  },
  chairclub: {
    en: 'An adaptive reuse interior project in the former French Concession, balancing art atmosphere and historic texture.',
  },
  'content-office-shop': {
    en: 'An interior project for a community-oriented office and retail space conceived as an urban living room.',
  },
  'content-show': {
    en: 'A cross-disciplinary content and fashion project centered on visual experiments and cultural presentation.',
  },
};

const locationCityMap = {
  上海: 'Shanghai',
  杭州: 'Hangzhou',
  安吉: 'Anji',
  开化: 'Kaihua',
  嘉兴: 'Jiaxing',
};

const statusLabelMap = {
  finalized: { en: 'Finalized', zh: '已建成' },
  'under-construction': { en: 'Under Construction', zh: '建设中' },
  proposed: { en: 'Proposed', zh: '提案中' },
};

const categoryLabelMap = {
  architecture: { en: 'Architecture', zh: '建筑' },
  interior: { en: 'Interior', zh: '室内' },
  landscape: { en: 'Landscape', zh: '景观' },
  other: { en: 'Other', zh: '其他' },
};

function detectInitialLanguage() {
  const stored = window.localStorage.getItem('site_lang');
  if (stored === 'zh' || stored === 'en') return stored;
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLanguage);

  const setLang = (nextLang) => {
    const safeLang = nextLang === 'zh' ? 'zh' : 'en';
    setLangState(safeLang);
    window.localStorage.setItem('site_lang', safeLang);
  };

  const t = (key) => {
    const value = key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), messages[lang]);
    return value || key;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function getProjectName(project, lang) {
  if (lang === 'zh') return project.name;
  return projectNameMap[project.id]?.en || project.name;
}

export function getProjectLocation(project, lang) {
  if (lang === 'zh') return project.location;

  const [cityPart] = String(project.location || '').split('·').map((s) => s.trim());
  const enCity = locationCityMap[cityPart] || cityPart;
  return `${enCity} · China`;
}

export function getStatusLabel(status, lang) {
  return statusLabelMap[status]?.[lang] || status || '';
}

export function getCategoryLabel(category, lang) {
  return categoryLabelMap[category]?.[lang] || category || '';
}

export function getProjectClient(project, lang) {
  if (lang === 'zh') return project.client;
  return projectClientMap[project.id]?.en || project.client;
}

export function getProjectDescription(project, lang) {
  if (lang === 'zh') return project.description;
  return projectDescriptionMap[project.id]?.en || project.description;
}
