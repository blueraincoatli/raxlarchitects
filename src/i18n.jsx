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
  'one-park-gubei': { en: 'WEALINE INTERNATIONAL (SHANGHAI) CO., LTD' },
  'royal-pavilion': { en: 'HEFENGYUAN (SHANGHAI) CO., LTD' },
  'upper-east': { en: 'ZHONGWAN (SHANGHAI) CO., LTD' },
  rongxinarc: { en: 'Hangzhou Rongyu Real Estate Development Co., Ltd.' },
  'macalline-anji': { en: 'Red Star Macalline' },
  'prime-dynapolis': { en: 'Shanghai Mingjie Real Estate Co., Ltd.' },
  'moment-to-cloud': { en: 'Shanghai Beicai New Town Development Co., Ltd.' },
  'lot-hk231': { en: 'Shanghai Xinhu Tianhong Urban Development Co., Ltd.' },
  chairclub: { en: 'Private Client' },
  'content-office-shop': { en: 'Vanke Group' },
  'content-show': { en: 'Shanghai Landscaping Administration' },
};

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
    zh: '项目名称：杭州·融信公馆ARC。位置：杭州市拱墅区学院北路与隐秀路交汇处。项目状态：已建成。项目业主：杭州融誉房地产开发有限公司。建筑设计：上海锐点建筑设计有限公司。设计时间：2016-2017。建成时间：2020年。建筑面积：119,719㎡。奖项荣誉：2018年金盘奖“总评选最佳住宅”“浙江赛区年度最佳住宅奖”。',
    en: 'Project: Hangzhou Rongxin Mansion ARC. Location: Intersection of Xueyuan North Road and Yinxiu Road, Gongshu District, Hangzhou. Status: Finalized. Client: Hangzhou Rongyu Real Estate Development Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD. Design Period: 2016-2017. Completion Year: 2020. Gross Floor Area: 119,719 sqm. Awards: 2018 Golden Platter Awards - Best Residential Project (Overall) and Best Residential Project of Zhejiang Region.',
  },
  'macalline-anji': {
    zh: '项目信息：红星美凯龙安吉度假别墅。位置：浙江省安吉县。项目状态：提案。建筑设计：上海锐点建筑设计有限公司。设计时间：2017年。',
    en: 'Project: Red Star Macalline Anji Resort Villa. Location: Anji County, Zhejiang Province. Status: Proposed. Architectural Design: RA ARCHITECTS CO., LTD. Design Year: 2017.',
  },
  'prime-dynapolis': {
    zh: '项目名称：品尊国际（三期）（Prime Dynapolis）。位置：上海市普陀区府村路268号。项目状态：建设中。项目业主：上海明捷置业有限公司。建筑设计：上海锐点建筑设计有限公司。建筑施工图设计：上海民用建筑设计院。室内设计：梁志天设计咨询有限公司。景观设计：SCDA Architects。设计时间：2020年。建成时间：2024年。建筑面积：地上136,399㎡，地下62,193㎡。',
    en: 'Project: Prime Dynapolis (Phase III). Location: No. 268 Fucun Road, Putuo District, Shanghai. Status: Under Construction. Client: Shanghai Mingjie Real Estate Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD. Construction Drawing Design: Shanghai Civil Architectural Design Institute. Interior Design: Steve Leung Designers. Landscape Design: SCDA Architects. Design Year: 2020. Expected Completion: 2024. Gross Floor Area: 136,399 sqm above ground and 62,193 sqm below ground.',
  },
  'moment-to-cloud': {
    zh: '项目名称：开云·艾尚里（Moment To Cloud）。位置：浦三路东、新浦路北、川杨河南。项目状态：建设中。项目业主：上海北蔡新城镇开发有限公司。建筑设计：上海锐点建筑设计有限公司。建筑施工图设计：上海筑景建筑设计有限公司。室内设计：上海锐点建筑设计有限公司。景观设计：上海锐点建筑设计有限公司。设计时间：2019年起。建成时间：2024年。建筑面积：地上180,953㎡，地下138,151㎡。',
    en: 'Project: Moment To Cloud. Location: East of Pusan Road, north of Xinpu Road, south of Chuanyang River. Status: Under Construction. Client: Shanghai Beicai New Town Development Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD. Construction Drawing Design: Shanghai Zhujing Architectural Design Co., Ltd. Interior Design: RA ARCHITECTS CO., LTD. Landscape Design: RA ARCHITECTS CO., LTD. Design Start: 2019. Expected Completion: 2024. Gross Floor Area: 180,953 sqm above ground and 138,151 sqm below ground.',
  },
  'lot-hk231': {
    zh: '项目名称：北外滩32街坊（Lot HK231-01，North Bund Street，Hongkou District）。位置：乍浦路东、天潼路北、武昌路南、吴淞路西。项目状态：建设中。项目业主：上海新湖天虹城市开发有限公司。建筑设计：上海锐点建筑设计有限公司、大象建筑（GOA）设计有限公司。建筑施工图设计：上海中房建筑设计有限公司。设计时间：2020年。建成时间：2025年。建筑面积：地上56,443㎡，地下55,761㎡。',
    en: 'Project: Lot HK231-01, North Bund Street, Hongkou District. Location: East of Zhapu Road, north of Tiantong Road, south of Wuchang Road, west of Wusong Road. Status: Under Construction. Client: Shanghai Xinhu Tianhong Urban Development Co., Ltd. Architectural Design: RA ARCHITECTS CO., LTD and GOA (Group of Architects). Construction Drawing Design: Shanghai Zhongfang Architectural Design Co., Ltd. Design Year: 2020. Expected Completion: 2025. Gross Floor Area: 56,443 sqm above ground and 55,761 sqm below ground.',
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
