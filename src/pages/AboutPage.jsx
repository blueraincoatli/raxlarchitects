import { Link, useSearchParams } from 'react-router-dom';
import PictureImage from '../components/PictureImage';

const ABOUT_HERO_IMAGE = '/images/projects/royal-pavilion/05-royal-pavilion';
const PARTNER_HERO_IMAGE = '/images/projects/royal-pavilion/05-royal-pavilion';
const AWARDS_HERO_IMAGE = '/images/projects/royal-pavilion/05-royal-pavilion';
const AWARDS_FEATURE_IMAGE = '/images/about/award';

const aboutParagraphs = [
  'Shanghai RA Architecture Co., Ltd./ Shanghai Zhaodu Architecture Design Co., Ltd. is a professional design company operating as an architect office. Founded by Mr. Rao Qing and partners in 2001, it has been mainly operating in Shanghai as a creative company. The company has two departments, architecture and landscape design, with no more than 60 designers.',
  'It is committed to establishing an open design platform with broad social resources and has experience in cooperation with many well-known domestic and foreign architects and artists. The company is deeply involved in all aspects of the whole process from market positioning, real estate development, construction and operation, to later-stage marketing, achieving a seamless connection between architectural design products and real estate operation.',
  'Mr. Rao Qing has always controlled the scale of development, emphasizing the personal involvement of chief designers in all major design work to ensure the continued imagination and creativity of the company. At the same time, the company emphasizes the control and coordination of various stages of implementation, so that innovation and completion can be achieved in synchronization, truly realizing the architect responsibility system.',
  'In terms of cooperation mode, it adopts a design model that is in line with international standards, giving full play to its expertise, emphasizing division of labor and cooperation, and providing professional scheme design services and full-process control and tracking services.',
];

const leadPartners = [
  { id: 'rao-qing', name: 'RAO QING', imagePath: '/images/about/partner1' },
  { id: 'liao-xiaoling', name: 'LIAO XIAOLING', imagePath: '/images/about/partner2' },
];

const awardsFeature = {
  title: 'Shanghai ONE PARK GUBEI',
  lines: [
    "Awarded 'Asia's Best Property Award' in 2015.",
    "Awarded 'Annual Best Apartment' at the 2015 Nobility Awards.",
  ],
  paragraphs: [
    "The 'Asia's Best Property Award' is an authoritative real estate award in the Asia-Pacific region. Since its inception in 2005, it has been considered the “Oscar” ceremony of the Asian real estate industry. The professionalism and impartiality of the award are second to none in the Asia-Pacific region, and winning the award undoubtedly represents the highest level in the field.",
    "In 2015, the project was also honored with the 'Best Residential Development (Shanghai) - Excellent Award,' representing the top-notch architectural design and service level of luxury homes in Asia.",
  ],
};

export function AboutPage() {
  const [searchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const activeTab = rawTab === 'partners' || rawTab === 'awards' ? rawTab : 'company';

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

        {renderFooter()}
      </div>
    );
  }

  if (activeTab === 'partners') {
    return (
      <div className="min-h-screen bg-[#181818] text-white">
        <section className="relative">
          <div className="w-full h-[300px] md:h-[420px] lg:h-[520px]">
            <PictureImage imagePath={PARTNER_HERO_IMAGE} alt="RA Architects Partners" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0">
            <div className="max-w-[1160px] h-full mx-auto px-6 lg:px-8 flex items-center">
              <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-white">Partners</h1>
            </div>
          </div>
        </section>

        <section className="bg-[#181818]">
          <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-12 md:py-14">
            <div className="max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {leadPartners.map((partner) => (
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
          <PictureImage imagePath={AWARDS_HERO_IMAGE} alt="RA Architects Awards" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0">
          <div className="max-w-[1160px] h-full mx-auto px-6 lg:px-8 flex items-center">
            <h1 className="text-4xl md:text-5xl font-medium tracking-wide text-white">Awards</h1>
          </div>
        </div>
      </section>

      <section className="bg-[#181818]">
        <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr] gap-6 md:gap-8 items-start">
            <div className="overflow-hidden">
              <PictureImage imagePath={AWARDS_FEATURE_IMAGE} alt={awardsFeature.title} className="w-full h-full object-cover" />
            </div>
            <div className="text-white/75">
              <h2 className="text-4xl md:text-[42px] font-semibold tracking-wide text-white mb-5">
                {awardsFeature.title}
              </h2>
              <div className="space-y-2 text-[13.5px] leading-7 mb-6">
                {awardsFeature.lines.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <div className="space-y-4 text-[13.5px] leading-8">
                {awardsFeature.paragraphs.map((paragraph, index) => (
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

