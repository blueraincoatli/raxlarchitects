import { Link, useParams } from 'react-router-dom';
import PictureImage from '../components/PictureImage';

const partners = {
  'rao-qing': {
    name: 'RAO QING',
    imagePath: '/images/about/partner1',
    imagePosition: 'center center',
    paragraphs: [
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
  },
  'liao-xiaoling': {
    name: 'Liao Xiaoling',
    imagePath: '/images/about/partner2',
    imagePosition: 'left center',
    paragraphs: [
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
  },
};

export function PartnerDetailPage() {
  const { id } = useParams();
  const partner = partners[id || ''];

  if (!partner) {
    return <div className="min-h-screen bg-[#181818] pt-24 px-6 text-white/80">Partner not found. <Link className="text-white underline" to="/about?tab=partners">Back to Partners</Link></div>;
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white pt-20 md:pt-24 pb-16">
      <div className="max-w-[1160px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] gap-8 lg:gap-14 items-start">
          <div className="overflow-hidden aspect-[3/4]">
            <PictureImage
              imagePath={partner.imagePath}
              alt={partner.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: partner.imagePosition || 'center center' }}
            />
          </div>
          <div className="max-w-[640px]">
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/70 mb-4">About Me</p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-wide mb-6">{partner.name}</h1>
            <div className="space-y-2 text-[13px] md:text-[14px] leading-9 text-white/78">
              {partner.paragraphs.map((paragraph, index) => (
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
