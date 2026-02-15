import { useSearchParams } from 'react-router-dom';
import PictureImage from '../components/PictureImage';

const ABOUT_HERO_IMAGE = '/images/projects/royal-pavilion/05-royal-pavilion';

const tabs = [
  { key: 'company', label: 'About Us' },
  { key: 'partners', label: 'Partners' },
  { key: 'awards', label: 'Awards' },
];

const aboutParagraphs = [
  'Shanghai RA Architecture Co., Ltd./ Shanghai Zhaodu Architecture Design Co., Ltd. is a professional design company operating as an architect office. Founded by Mr. Rao Qing and partners in 2001, it has been mainly operating in Shanghai as a creative company. The company has two departments, architecture and landscape design, with no more than 60 designers.',
  'It is committed to establishing an open design platform with broad social resources and has experience in cooperation with many well-known domestic and foreign architects and artists. The company is deeply involved in all aspects of the whole process from market positioning, real estate development, construction and operation, to later-stage marketing, achieving a seamless connection between architectural design products and real estate operation.',
  'Mr. Rao Qing has always controlled the scale of development, emphasizing the personal involvement of chief designers in all major design work to ensure the continued imagination and creativity of the company. At the same time, the company emphasizes the control and coordination of various stages of implementation, so that innovation and completion can be achieved in synchronization, truly realizing the architect responsibility system.',
  'In terms of cooperation mode, it adopts a design model that is in line with international standards, giving full play to its expertise, emphasizing division of labor and cooperation, and providing professional scheme design services and full-process control and tracking services.',
];

const partnerData = [
  { name: 'Vanke Group', type: 'Real Estate Developer' },
  { name: 'Poly Developments', type: 'Real Estate Developer' },
  { name: 'China Resources Land', type: 'Real Estate Developer' },
  { name: 'Sunac China', type: 'Real Estate Developer' },
  { name: 'Tongji University', type: 'Academic Partner' },
  { name: 'Shanghai Construction Group', type: 'Engineering Partner' },
];

const awardData = [
  { year: '2023', award: 'Shanghai Excellent Architectural Design Award', project: 'Yifangcheng Commercial Center' },
  { year: '2022', award: 'China Architectural Design Award', project: 'Hushan Peninsula Resort Hotel' },
  { year: '2021', award: 'WAA Architecture Award', project: 'Gubei Civic Activity Center' },
  { year: '2020', award: 'Asia Design Grand Award', project: 'Yunhu Tech Park' },
  { year: '2019', award: 'Shanghai Architecture Creation Award', project: 'Gubei Park Renewal' },
];

export function AboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = rawTab === 'partners' || rawTab === 'awards' ? rawTab : 'company';

  const switchTab = (key) => {
    if (key === 'company') {
      setSearchParams({});
      return;
    }
    setSearchParams({ tab: key });
  };

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
              <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-white">About Us</h1>
            </div>
          </div>
        </section>

        <section className="bg-[#181818]">
          <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-14 md:py-16">
            <div className="max-w-[900px] space-y-8 text-[14px] md:text-[14.5px] leading-8 text-white/78">
              {aboutParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

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
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-[#181818] text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex gap-6 text-sm uppercase tracking-[0.18em] text-white/60 mb-10 border-b border-white/15 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => switchTab(tab.key)}
              className={activeTab === tab.key ? 'text-white' : 'hover:text-white/90 transition-colors'}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'partners' && (
          <section className="max-w-5xl">
            <h1 className="text-4xl font-normal tracking-wide mb-8">Partners</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {partnerData.map((item, index) => (
                <div key={index} className="border border-white/15 p-5">
                  <h2 className="text-lg text-white mb-1">{item.name}</h2>
                  <p className="text-white/65 text-sm">{item.type}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'awards' && (
          <section className="max-w-4xl">
            <h1 className="text-4xl font-normal tracking-wide mb-8">Awards</h1>
            <div className="space-y-4">
              {awardData.map((item, index) => (
                <div key={index} className="grid grid-cols-[72px_1fr] gap-4 border-b border-white/10 pb-4">
                  <div className="text-white/55 text-2xl leading-none pt-1">{item.year}</div>
                  <div>
                    <h2 className="text-white text-lg mb-1">{item.award}</h2>
                    <p className="text-white/65 text-sm">{item.project}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default AboutPage;

