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
        'Rao Qing, born in 1971, is an architect. He graduated from Wuhan University of Technology with a degree in architecture in 1994.',
        'In 2001, he founded RA Architects (RA Architecture Co., Ltd.) and has served as chief architect since then. From 1997 to 2001, he was the lead guitarist of the well-known Shanghai BLUES band “12 Bars”.',
        'In 2015, Rao Qing led RA Architects on Shanghai luxury residential project ONE PARK GUBEI, which received the “Asia’s Best Property Award” jointly organized by Ensign Media (Singapore) Pte Ltd and architectural magazine Perspective.',
        'In recent years, he has focused on the design and research of China’s top-tier luxury residences. Completed projects such as ONE PARK GUBEI and Royal Pavilion have become industry benchmarks.',
        'In 2007, Rao Qing and his partners founded independent fashion label “Content Directory,” continuing to draw inspiration from the crossover between architecture and fashion.',
        'As the show director of the brand, he collaborated with artists from different fields and directed multiple Content runway shows during Shanghai Fashion Week, attracting wide industry attention.',
        'Using these spaces as a template, he created a large body of moving-image works, exploring the design idea of integrating video into space and fashion.',
        'In 2012, he founded Fuer Culture & Entertainment Co., Ltd. and launched CHAIRCLUB, one of Shanghai’s most authentic BLUES-focused livehouses, which quickly gained influence in that field.',
        'In 2013, RA Architects co-initiated 1778 ART UNION with a group of young Shanghai artists and photographers, further expanding into art, culture, and music. On October 26, 2013, he also planned the cross-disciplinary “Out of Rail” art event co-hosted by 1778 ART UNION and Bazaar Art, which received a strong public response.',
      ],
      zh: [
        '饶青，1971年出生，建筑师。1994年毕业于武汉理工大学建筑学专业。',
        '2001年成立 RA Architects（上海锐点建筑设计有限公司），任主建筑师至今。1997年-2001年任上海著名 BLUES 乐队“12小节”主音吉他手。',
        '2015年，饶青先生带领 RA Architects 设计的上海豪宅项目“古北壹号”，获得由 Ensign Media（Singapore）Pte Ltd 及著名建筑设计杂志《透视杂志》合办的“亚洲最佳物业奖”。',
        '近年来一直致力于中国顶级豪宅的设计研究，已设计落成的上海古北壹号、华山公寓等项目均成为业界标杆。',
        '2007年，饶青与公司合伙人创立独立时装品牌“Content目录”，在建筑与时装的跨界中持续获得灵感来源。',
        '作为品牌秀导，饶青与不同艺术家合作，执导了 Content 多次上海时装周时装秀，在业界引起广泛关注。',
        '以上述空间为模板，饶青拍摄制作了大量影像作品，实践“影像介入空间、介入时装”的设计理念。',
        '2012年，饶青创立孚耳文化娱乐有限公司，并开办上海最纯正、以推广 BLUES 音乐为主的 Livehouse——CHAIRCLUB，迅速获得这一领域影响力。',
        '2013年，RA Architects 发起并与上海年轻艺术家、摄影师共同成立 1778 ART UNION，将事业进一步拓展到艺术、文化、音乐等领域。2013年10月26日，策划了 1778 ART UNION 与《芭莎艺术》携手的“出轨”跨界艺术活动，获得巨大反响。',
      ],
    },
  },
  'liao-xiaoling': {
    name: { en: 'Liao Xiaoling', zh: '廖晓玲' },
    imagePath: '/images/about/partner2',
    imagePosition: 'left center',
    paragraphs: {
      en: [
        'Liao Xiaoling received her Master Degree in Urban Planning from Shanghai Tongji University. From 2001 to 2008, she was the primary architect and co-founder of RA Architects. In 2008, she founded her own fashion label content, attempting to present the cultural values in a wholly new area. In April 2011, she created WATCHING/WATCHED and the project was presented as the opening show for Shanghai Fashion Week. In October, the 2012SS collection of Content, BODY ON BODY, was launched at RAM (Shanghai Rock Art Museum) in Shanghai.',
        'Content, a designer brand that emerges information, design and dimension to convey the concept of "Content". Content sees itself as a vessel that displays the zeitgeist of an incomplete content. Content refers clothing to media; delivers information as well, and provides opportunities for the designer to express opinions on art and culture. Content uniqueness comes from its open approach in the creative design field through the involvement of different designers, and experimentation with different ways to encode visions of city culture. Content also relates clothing to iconography and is known for daring themed approaches.',
      ],
      zh: [
        '廖晓玲，曾获同济大学城市规划硕士学位，2001-2008年在 RA ARCHITECTS 任主要建筑师7年；随后在2008年组建了 RA DESIGN STUDIO，尝试在全新的领域内表达文化价值观，推出个人时装品牌 Content。2011年4月发布2011AW作品《WATCHING/WATCHED》，为上海国际时装周开幕秀。2011年10月，在上海外滩美术馆发布2012SS作品《BODY ON BODY》。',
        'Content，一个试图让衣服承载更多信息的设计师品牌，无论是衣服还是空间，都传达出他们的“目录”精神。将品牌理解成为一种容器，是展示时代精神的一部不完全目录。衣服作为媒介，传递转瞬即逝的信息，表达设计师对城市文化与当代艺术的关注。品牌具有开放与独立的姿态，集结不同领域的设计师与创作人，用多种方式表达对城市文化的理解。影像介入衣服，是 Content 最直接的设计语汇，用不同的方式展示不同的影像主题，是 Content 独特的品牌风格。',
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

