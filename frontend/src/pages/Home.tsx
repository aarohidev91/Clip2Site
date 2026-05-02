import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Code,
  Film,
  Laptop,
  Lightbulb,
  Rocket,
  Sparkles,
  Target,
  Upload,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-300">AI-Powered Landing Page Generator</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Turn your product video into a{' '}
            <span className="gradient-text">high-converting landing page</span>{' '}
            in seconds
          </h1>
          <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10">
            Upload a video or describe your product. Clip2Site AI generates stunning, conversion-optimized landing pages
            with compelling copy, ready to export as HTML or React.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              See How It Works
            </a>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-dark-400 text-lg">Three simple steps to your perfect landing page</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: '1. Upload & Describe', desc: 'Upload your product video and add a brief description. Our AI uses every detail to understand your offer.' },
              { icon: Sparkles, title: '2. AI Generates', desc: 'Gemini AI analyzes your content and generates compelling copy, headlines, benefits, FAQs, and more.' },
              { icon: Rocket, title: '3. Export & Launch', desc: 'Preview your page, edit any section, choose a template, and export as HTML or React component.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-8 text-center hover:border-primary-500/30 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-dark-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 px-4 bg-dark-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built For</h2>
            <p className="text-dark-400 text-lg">Everyone who needs a landing page — fast</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Film, label: 'Instagram Sellers' },
              { icon: Laptop, label: 'Course Creators' },
              { icon: Users, label: 'Freelancers' },
              { icon: Target, label: 'Agencies' },
              { icon: Lightbulb, label: 'Local Businesses' },
              { icon: Zap, label: 'Personal Brands' },
              { icon: Code, label: 'Product Teams' },
              { icon: Sparkles, label: 'Content Creators' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 text-center hover:border-primary-500/30 transition-all"
              >
                <item.icon className="w-7 h-7 text-primary-400 mx-auto mb-2" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Output */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Professional Results</h2>
            <p className="text-dark-400 text-lg">Every page comes with conversion-optimized sections</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Creator Launch', desc: 'Bold, dark theme with vibrant gradients. Perfect for creators and personal brands.', color: 'from-purple-500 to-pink-500' },
              { title: 'SaaS / Product', desc: 'Clean, professional light theme. Ideal for software products and startups.', color: 'from-blue-500 to-cyan-500' },
              { title: 'Local Business', desc: 'Warm, inviting design. Great for local services, shops, and restaurants.', color: 'from-emerald-500 to-amber-500' },
            ].map((tmpl, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card overflow-hidden hover:border-primary-500/30 transition-all"
              >
                <div className={`h-40 bg-gradient-to-br ${tmpl.color} flex items-center justify-center`}>
                  <span className="text-white/90 font-bold text-xl">{tmpl.title}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{tmpl.title}</h3>
                  <p className="text-dark-400 text-sm">{tmpl.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-dark-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-dark-400 text-lg">Start free. No credit card required.</p>
          </motion.div>

          <motion.div {...fadeInUp} className="glass-card p-10 text-center max-w-md mx-auto border-primary-500/30">
            <div className="text-5xl font-bold gradient-text mb-2">Free</div>
            <p className="text-dark-400 mb-8">Everything you need to get started</p>
            <ul className="text-left space-y-3 mb-8">
              {[
                'Unlimited projects',
                'AI content generation (Gemini)',
                'Free mock engine fallback',
                '3 professional templates',
                'HTML & React export',
                'Content editor',
                'Mobile responsive pages',
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-dark-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary w-full block text-center text-lg py-4">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'What is Clip2Site AI?', a: 'Clip2Site AI is an AI-powered tool that converts your product videos and descriptions into professional landing pages in seconds.' },
              { q: 'Is it really free?', a: 'Yes! The core features are completely free. We use Google Gemini free tier for AI generation, with a built-in mock engine as fallback.' },
              { q: 'Do I need coding skills?', a: 'Not at all. Just upload a video or describe your product, and our AI handles everything. You can export clean HTML or React code.' },
              { q: 'What if the AI quota runs out?', a: 'Our smart mock engine automatically kicks in, generating realistic landing page content based on your inputs. The app never stops working.' },
              { q: 'Can I edit the generated content?', a: 'Absolutely! Every section is fully editable. Change headlines, benefits, FAQs, pricing text — everything is customizable.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="font-semibold text-lg mb-2 text-primary-300">{faq.q}</h3>
                <p className="text-dark-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <motion.div
          {...fadeInUp}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-3xl p-16 border border-primary-500/20"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Turn Your Videos Into Sales Pages?</h2>
          <p className="text-dark-400 text-lg mb-8">
            Join thousands of creators who are building beautiful landing pages in seconds.
          </p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Start Building Free <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Clip2Site AI</span>
          </div>
          <p className="text-dark-500 text-sm">&copy; 2025 Clip2Site AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
