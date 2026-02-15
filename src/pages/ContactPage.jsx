import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen pt-16 bg-[#181818]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-normal tracking-wider text-white mb-8">联系我们</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-normal tracking-wider text-white mb-6">发送消息</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-500/30 border border-green-400 rounded-lg">
                <p className="text-green-300">感谢您的留言！我们会尽快与您联系。</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white/80 mb-2 text-sm">
                  姓名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/80 mb-2 text-sm">
                  邮箱 <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="请输入您的邮箱"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white/80 mb-2 text-sm">
                  电话
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="请输入您的联系电话"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-white/80 mb-2 text-sm">
                  主题 <span className="text-red-400">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50 transition-colors"
                >
                  <option value="">请选择咨询主题</option>
                  <option value="project">项目咨询</option>
                  <option value="cooperation">商务合作</option>
                  <option value="media">媒体采访</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-white/80 mb-2 text-sm">
                  留言 <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors resize-none"
                  placeholder="请输入您的留言内容"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-white text-gray-900 rounded-lg font-medium tracking-wide hover:bg-white/90 transition-colors"
              >
                发送消息
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-normal tracking-wider text-white mb-6">联系方式</h2>

            <div className="space-y-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">公司信息</h3>
                <div className="space-y-3 text-white/80">
                  <p>上海锐点建筑设计有限公司</p>
                  <p>RA Architects</p>
                  <p>地址：上海市徐汇区田林路XXX号</p>
                  <p>邮编：200030</p>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">联系方式</h3>
                <div className="space-y-3 text-white/80">
                  <p>电话：+86 21 XXXX XXXX</p>
                  <p>邮箱：info@rchitects.com</p>
                  <p>网址：www.rchitects.com</p>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">工作时间</h3>
                <div className="space-y-2 text-white/80">
                  <p>周一至周五</p>
                  <p>9:00 - 18:00</p>
                  <p className="text-white/60 text-sm">（节假日除外）</p>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">关注我们</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white">微信</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white">微博</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white">领英</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

