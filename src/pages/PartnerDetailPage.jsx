import { Link, useParams } from 'react-router-dom';
import PictureImage from '../components/PictureImage';
import { useLanguage } from '../i18n.jsx';

const partners = {
  'rao-qing': {
    name: { en: 'RAO QING', zh: '饶青' },
    imagePath: '/images/about/partner1',
    imagePosition: 'center center',
    paragraphs: {
      en: [
        'Rao Qing was born in 1971 and is an architect.',
        'He graduated from Wuhan University of Technology with a major in architecture in 1994.',
        'In 2001, he founded RA Architects (RA Architecture Co., Ltd.) and has been the chief architect ever since.',
        'From 1997 to 2001, he was the lead guitarist of the famous Shanghai BLUES band “12 Bars”.',
        'In 2015, Mr. Rao Qing led RA Architects to design the Shanghai luxury house project - ONE PARK GUBEI, which won the “Asia’s Best Property Award”.',
        'In recent years, he has been committed to the design and research of China’s top luxury houses. Completed projects such as Shanghai ONE PARK GUBEI and Royal Pavilion have become benchmarks in the industry.',
        'In 2007, Rao Qing and his partners founded an independent fashion brand “Content”, continuing to gain inspiration from the crossover between architecture and fashion.',
        'In 2012, Rao Qing founded Fuer Culture & Entertainment Co., Ltd. and opened CHAIRCLUB, Shanghai’s authentic livehouse promoting BLUES music.',
        'In 2013, RA Architects initiated 1778 ART UNION with a group of young Shanghai artists and photographers, expanding its business to art, culture and music.',
      ],
      zh: [
        '饶青，1971年出生，建筑师。',
        '1994年毕业于武汉理工大学建筑学专业。',
        '2001年成立 RA Architects（上海锐点建筑设计有限公司），任主建筑师至今。',
        '1997年至2001年，任上海著名 BLUES 乐队“12小节”主音吉他手。',
        '2015年，饶青先生带领 RA Architects 设计的上海豪宅项目“古北壹号”获得“亚洲最佳物业奖”。',
        '近年来持续深耕中国顶级豪宅设计研究，已落成项目如上海古北壹号、华山公寓等，均已成为业界标杆。',
        '2007年，饶青与合伙人创立独立时装品牌“Content目录”，在建筑与时装跨界中持续获取灵感。',
        '2012年，创立孚耳文化娱乐有限公司，并开办以推广 BLUES 音乐为主的 Livehouse - CHAIRCLUB。',
        '2013年发起并与上海青年艺术家、摄影师共同成立 1778 ART UNION，进一步拓展至艺术、文化与音乐领域。',
      ],
    },
  },
  'liao-xiaoling': {
    name: { en: 'Liao Xiaoling', zh: '廖小玲' },
    imagePath: '/images/about/partner2',
    imagePosition: 'left center',
    paragraphs: {
      en: [
        'Liao Xiaoling received her Master Degree in Urban Planning from Shanghai Tongji University.',
        'From 2001 to 2008, she was the primary architect and co-founder of RA Architects.',
        'In 2008, she founded her own fashion label Content, attempting to present cultural values in a new field.',
        'In April 2011, she created WATCHING/WATCHED and the project was presented as the opening show for Shanghai Fashion Week.',
        'In October, the 2012SS collection of Content, “BODY ON BODY”, was launched at RAM (Shanghai Rockbund Art Museum).',
        'Content is a designer brand that conveys information, design and dimension to express the concept of “Content”.',
        'Content sees itself as a vessel displaying the zeitgeist of an incomplete content, delivering information and opportunities for expression on art and culture.',
        'Its uniqueness comes from openness in creative design, with participation from different designers and experiments in multiple methods.',
        'Hence, its open philosophy towards fashion creates imaginary space for customers.',
      ],
      zh: [
        '廖小玲，毕业于同济大学，获城市规划专业硕士学位。',
        '2001年至2008年担任 RA Architects 联合创始人及主要建筑师。',
        '2008年创立个人时装品牌 Content，尝试在新的领域呈现文化价值。',
        '2011年4月创作 WATCHING/WATCHED，并作为上海时装周开幕秀发布。',
        '同年推出 Content 2012SS 系列“BODY ON BODY”，于上海外滩美术馆（RAM）发布。',
        'Content 通过信息、设计与维度表达“内容”这一核心概念。',
        '品牌将自身视为展示时代精神的载体，在服装与媒介之间传递信息，也为艺术与文化表达提供空间。',
        '其独特性来自开放式创作方法，强调多元设计师参与与多种实验路径。',
        '因此，Content 以开放的时装哲学，为受众带来更具想象力的体验。',
      ],
    },
  },
};

export function PartnerDetailPage() {
  const { lang, t } = useLanguage();
  const { id } = useParams();
  const partner = partners[id || ''];
  const name = partner?.name?.[lang] || partner?.name?.en || '';
  const paragraphs = partner?.paragraphs?.[lang] || partner?.paragraphs?.en || [];

  if (!partner) {
    return <div className="min-h-screen bg-[#181818] pt-24 px-6 text-white/80">{t('common.partnerNotFound')} <Link className="text-white underline" to="/about?tab=partners">{t('common.backToPartners')}</Link></div>;
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white pt-20 md:pt-24 pb-16">
      <div className="max-w-[1160px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] gap-8 lg:gap-14 items-start">
          <div className="overflow-hidden aspect-[3/4]">
            <PictureImage
              imagePath={partner.imagePath}
              alt={name}
              className="w-full h-full object-cover"
              style={{ objectPosition: partner.imagePosition || 'center center' }}
            />
          </div>
          <div className="max-w-[640px]">
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/70 mb-4">{t('common.aboutMe')}</p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-wide mb-6">{name}</h1>
            <div className="space-y-2 text-[13px] md:text-[14px] leading-9 text-white/78">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerDetailPage;

