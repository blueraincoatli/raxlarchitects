import { Link, useSearchParams } from 'react-router-dom';
import PictureImage from '../components/PictureImage';
import { useLanguage } from '../i18n.jsx';

const ABOUT_HERO_IMAGE = '/images/projects/royal-pavilion/05-royal-pavilion';
const PARTNER_HERO_IMAGE = '/images/projects/royal-pavilion/05-royal-pavilion';
const AWARDS_HERO_IMAGE = '/images/projects/royal-pavilion/05-royal-pavilion';
const AWARDS_FEATURE_IMAGE = '/images/about/award';

const contentByLang = {
  en: {
    tabTitle: {
      company: 'About Us',
      partners: 'Partners',
      awards: 'Awards',
    },
    aboutParagraphs: [
      'Shanghai RA Architecture Co., Ltd./ Shanghai Zhaodu Architecture Design Co., Ltd. is a professional design company operating as an architect office. Founded by Mr. Rao Qing and partners in 2001, it has been mainly operating in Shanghai as a creative company. The company has two departments, architecture and landscape design, with no more than 60 designers.',
      'It is committed to establishing an open design platform with broad social resources and has experience in cooperation with many well-known domestic and foreign architects and artists. The company is deeply involved in all aspects of the whole process from market positioning, real estate development, construction and operation, to later-stage marketing, achieving a seamless connection between architectural design products and real estate operation.',
      'Mr. Rao Qing has always controlled the scale of development, emphasizing the personal involvement of chief designers in all major design work to ensure the continued imagination and creativity of the company. At the same time, the company emphasizes the control and coordination of various stages of implementation, so that innovation and completion can be achieved in synchronization, truly realizing the architect responsibility system.',
      'In terms of cooperation mode, it adopts a design model that is in line with international standards, giving full play to its expertise, emphasizing division of labor and cooperation, and providing professional scheme design services and full-process control and tracking services.',
    ],
    leadPartners: [
      { id: 'rao-qing', name: 'RAO QING', imagePath: '/images/about/partner1' },
      { id: 'liao-xiaoling', name: 'LIAO XIAOLING', imagePath: '/images/about/partner2' },
    ],
    awardsFeature: {
      title: 'Shanghai ONE PARK GUBEI',
      lines: [
        "Awarded 'Asia's Best Property Award' in 2015.",
        "Awarded 'Annual Best Apartment' at the 2015 Nobility Awards.",
      ],
      paragraphs: [
        "The 'Asia's Best Property Award' is an authoritative real estate award in the Asia-Pacific region. Since its inception in 2005, it has been considered the “Oscar” ceremony of the Asian real estate industry. The professionalism and impartiality of the award are second to none in the Asia-Pacific region, and winning the award undoubtedly represents the highest level in the field.",
        "In 2015, the project was also honored with the 'Best Residential Development (Shanghai) - Excellent Award,' representing the top-notch architectural design and service level of luxury homes in Asia.",
      ],
    },
  },
  zh: {
    tabTitle: {
      company: '关于我们',
      partners: '合伙人',
      awards: '奖项',
    },
    aboutParagraphs: [
      'RA Architects（上海锐点建筑设计有限公司 / 上海照度建筑设计事务所）是一间建筑师事务所性质的专业设计公司。由饶青先生与合伙人于2001年创立，长期以创意型公司的模式在上海开展工作。公司设有建筑与景观设计两个部门，设计人员控制在60人以内。',
      '公司致力于建立由广泛社会资源支持的开放设计平台，具备与多位境内外知名建筑师及艺术家合作的经验。团队深度介入项目从市场定位、开发运营、建设实施到后期营销的全过程，实现建筑设计产品与房地产运营的无缝衔接。',
      '饶青先生长期强调主创设计师在重大项目中的亲力亲为，以保持公司持续的想象力与创造力。同时，公司强调对实施阶段各环节的控制与协同，确保创新性与完成度同步实现，真正落实“建筑师负责制”。',
      '在合作模式上，公司采用与国际接轨的设计方法，发挥专长并强调分工协作，提供专业方案设计与全流程控制跟踪服务。在与国内外知名建筑师及本土设计院协作方面，团队均具备成熟的方法与经验。',
    ],
    leadPartners: [
      { id: 'rao-qing', name: '饶青', imagePath: '/images/about/partner1' },
      { id: 'liao-xiaoling', name: '廖小玲', imagePath: '/images/about/partner2' },
    ],
    awardsFeature: {
      title: '上海 古北壹号',
      lines: [
        '获 2015 年“亚洲最佳物业奖”',
        '获 2015 年诺金盘奖“年度最佳公寓”',
      ],
      paragraphs: [
        '“亚洲最佳物业奖”是亚太地区权威房地产奖项，自2005年举办以来被誉为亚洲地产界的“奥斯卡”。该奖项以专业性与公正性著称，获奖项目代表着各自领域的高水准。',
        '项目同时获得“最佳住宅（上海）优异奖”，体现了亚洲高端住宅建筑设计与服务的领先水平。',
      ],
    },
  },
};

export function AboutPage() {
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = rawTab === 'partners' || rawTab === 'awards' ? rawTab : 'company';
  const content = contentByLang[lang] || contentByLang.en;

  const renderFooter = () => (
    <footer className="bg-[#181818] border-t border-white/10">
      <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-8 text-xs text-white/75">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-wide text-white leading-none">RA ARCHITECTS</h2>
          </div>
          <div className="space-y-1 leading-6">
            <p>1512 11th Street, Suite 203, Santa Monica, 90401</p>
            <p>+1 (310) 393-1396</p>
            <p>raxlla@raxlarchitects.com</p>
          </div>
          <div className="space-y-1 leading-6">
            <p>Building 12, Tonglefang, No. 555 Haifang Road, Shanghai</p>
            <p>+86-21-62473655</p>
            <p>raxlsh@raxlarchitects.com</p>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t border-white/10 text-[10px] tracking-[0.16em] uppercase text-white/45">
          RAXL (C) 2025 ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );

  if (activeTab === 'company') {
    return (
      <div className="min-h-screen bg-[#181818] text-white">
        <section className="relative">
          <div className="w-full h-[300px] md:h-[420px] lg:h-[520px]">
            <PictureImage imagePath={ABOUT_HERO_IMAGE} alt="RA Architects About" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0">
            <div className="max-w-[1160px] h-full mx-auto px-6 lg:px-8 flex items-center">
              <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-white">{content.tabTitle.company}</h1>
            </div>
          </div>
        </section>

        <section className="bg-[#181818]">
          <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-14 md:py-16">
            <div className="max-w-[900px] space-y-8 text-[14px] md:text-[14.5px] leading-8 text-white/78">
              {content.aboutParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {renderFooter()}
      </div>
    );
  }

  if (activeTab === 'partners') {
    return (
      <div className="min-h-screen bg-[#181818] text-white">
        <section className="relative">
          <div className="w-full h-[300px] md:h-[420px] lg:h-[520px]">
          <PictureImage imagePath={PARTNER_HERO_IMAGE} alt={content.tabTitle.partners} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0">
            <div className="max-w-[1160px] h-full mx-auto px-6 lg:px-8 flex items-center">
              <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-white">{content.tabTitle.partners}</h1>
            </div>
          </div>
        </section>

        <section className="bg-[#181818]">
          <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-12 md:py-14">
            <div className="max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {content.leadPartners.map((partner) => (
                <div key={partner.name}>
                  <Link to={`/about/partners/${partner.id}`} className="block group">
                    <div className="aspect-[5/4] overflow-hidden">
                      <PictureImage imagePath={partner.imagePath} alt={partner.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <h2 className="mt-4 text-center text-2xl md:text-3xl font-semibold tracking-wide text-white">
                      {partner.name}
                    </h2>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {renderFooter()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <section className="relative">
        <div className="w-full h-[300px] md:h-[420px] lg:h-[520px]">
          <PictureImage imagePath={AWARDS_HERO_IMAGE} alt={content.tabTitle.awards} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0">
          <div className="max-w-[1160px] h-full mx-auto px-6 lg:px-8 flex items-center">
              <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-white">{content.tabTitle.awards}</h1>
            </div>
          </div>
        </section>

      <section className="bg-[#181818]">
        <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr] gap-6 md:gap-8 items-start">
            <div className="overflow-hidden">
              <PictureImage imagePath={AWARDS_FEATURE_IMAGE} alt={content.awardsFeature.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-white/75">
              <h2 className="text-4xl md:text-[42px] font-semibold tracking-wide text-white mb-5">
                {content.awardsFeature.title}
              </h2>
              <div className="space-y-2 text-[13.5px] leading-7 mb-6">
                {content.awardsFeature.lines.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <div className="space-y-4 text-[13.5px] leading-8">
                {content.awardsFeature.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {renderFooter()}
    </div>
  );
}

export default AboutPage;


