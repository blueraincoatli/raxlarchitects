import { useState } from 'react';

export function AboutPage() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { key: 'company', label: '公司介绍' },
    { key: 'partners', label: '合作伙伴' },
    { key: 'awards', label: '获奖情况' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-normal tracking-wider text-white mb-8">关于我们</h1>

        <div className="flex gap-4 mb-8 border-b border-white/20">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-lg font-medium tracking-wide transition-colors relative ${
                activeTab === tab.key ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8">
          {activeTab === 'company' && (
            <div className="text-white/90 space-y-4">
              <h2 className="text-2xl font-normal tracking-wider text-white mb-4">公司介绍</h2>
              <p className="leading-relaxed">
                上海锐点建筑设计有限公司（RA Architects）是一家专业的建筑设计事务所，致力于为城市和社区创造具有人文关怀的建筑空间。
              </p>
              <p className="leading-relaxed">
                我们的设计理念源于对现代生活方式的深刻理解，强调建筑与环境的和谐共生。从城市规划到室内设计，我们提供全方位的建筑设计服务。
              </p>
              <p className="leading-relaxed">
                多年来，我们参与了众多类型丰富的项目，包括商业综合体、办公建筑、文化设施、住宅开发及景观设计等。每个项目都是我们与客户深度合作的成果，体现了对功能、美学和可持续性的综合考量。
              </p>
              <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-xl font-normal text-white mb-4">设计理念</h3>
                <ul className="space-y-2 text-white/80">
                  <li>以人为本的功能设计</li>
                  <li>与自然环境和谐共生的空间营造</li>
                  <li>文化传承与现代创新的结合</li>
                  <li>可持续发展的社会责任</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="text-white/90">
              <h2 className="text-2xl font-normal tracking-wider text-white mb-4">合作伙伴</h2>
              <p className="text-white/70 mb-6">我们与以下企业和机构建立了长期合作关系</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: '万科集团', type: '房地产开发' },
                  { name: '保利发展', type: '房地产开发' },
                  { name: '华润置地', type: '房地产开发' },
                  { name: '融创中国', type: '房地产开发' },
                  { name: '同济大学', type: '学术合作' },
                  { name: '上海建工集团', type: '工程实施' },
                ].map((partner, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-1">{partner.name}</h3>
                    <p className="text-white/60 text-sm">{partner.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'awards' && (
            <div className="text-white/90">
              <h2 className="text-2xl font-normal tracking-wider text-white mb-4">获奖情况</h2>
              <div className="space-y-6">
                {[
                  { year: '2023', award: '上海市优秀建筑工程设计奖', project: '壹方城商业中心' },
                  { year: '2022', award: '中国建筑设计奖', project: '湖山半岛度假酒店' },
                  { year: '2021', award: 'WAA建筑奖', project: '古北市民活动中心' },
                  { year: '2020', award: '亚洲设计大奖', project: '云湖科技园' },
                  { year: '2019', award: '上海市建筑创作奖', project: '古北公园改造' },
                  { year: '2018', award: 'WAA中国建筑奖', project: '古北艺术中心' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                    <div className="flex-shrink-0">
                      <span className="text-2xl font-light text-white/50">{item.year}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-1">{item.award}</h3>
                      <p className="text-white/60 text-sm">项目：{item.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
