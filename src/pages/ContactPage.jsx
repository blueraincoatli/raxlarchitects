export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <div className="max-w-[1160px] mx-auto px-6 lg:px-8 pt-48 md:pt-56 lg:pt-64 pb-24">
        <section className="max-w-[860px]">
          <h1 className="text-[34px] md:text-[40px] lg:text-[44px] leading-[1] font-semibold tracking-[0.018em] text-white">CONTACT</h1>
          <p className="mt-4 text-[15px] md:text-[17px] lg:text-[18px] leading-[1.4] text-white/88">Let&apos;s start new project.</p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14">
            <div>
              <div className="border-t border-white/15 pt-7">
                <h2 className="text-[24px] md:text-[28px] lg:text-[32px] leading-none font-semibold tracking-[0.02em] text-white mb-5">USA</h2>
                <div className="space-y-2 text-[12.5px] md:text-[13.5px] lg:text-[14px] text-white/78 leading-[1.7]">
                  <p>1512 11th Street, Suite #203, Santa Monica, 90401</p>
                  <p>raxlla@raxlarchitects.com</p>
                  <p>+1 (310) 393-1396</p>
                </div>
              </div>
            </div>

            <div>
              <div className="border-t border-white/15 pt-7">
                <h2 className="text-[24px] md:text-[28px] lg:text-[32px] leading-none font-semibold tracking-[0.02em] text-white mb-5">CHINA</h2>
                <div className="space-y-2 text-[12.5px] md:text-[13.5px] lg:text-[14px] text-white/78 leading-[1.7]">
                  <p>Building 12, Tonglefang, No. 555 Haifang Road, Shanghai</p>
                  <p>raxlsh@raxlarchitects.com</p>
                  <p>021-62473655</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;
