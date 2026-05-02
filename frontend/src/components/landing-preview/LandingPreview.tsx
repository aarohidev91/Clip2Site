import { motion } from 'framer-motion';
import type { GeneratedContent } from '../../types/generation';

interface LandingPreviewProps {
  content: GeneratedContent;
  template: string;
}

const templateStyles: Record<string, { primary: string; secondary: string; bg: string; card: string }> = {
  'creator-launch': { primary: 'from-purple-500 to-pink-500', secondary: 'text-purple-400', bg: 'bg-slate-900', card: 'bg-slate-800' },
  'saas-product': { primary: 'from-blue-500 to-cyan-500', secondary: 'text-blue-400', bg: 'bg-white', card: 'bg-slate-50' },
  'local-business': { primary: 'from-emerald-500 to-amber-500', secondary: 'text-emerald-600', bg: 'bg-amber-50', card: 'bg-white' },
};

export default function LandingPreview({ content, template }: LandingPreviewProps) {
  const style = templateStyles[template] || templateStyles['creator-launch'];
  const isLight = template === 'saas-product' || template === 'local-business';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-600' : 'text-slate-300';

  return (
    <div className={`${style.bg} rounded-xl overflow-hidden shadow-2xl`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
        <span className={`font-bold text-lg bg-gradient-to-r ${style.primary} bg-clip-text text-transparent`}>
          {content.brandName}
        </span>
      </div>

      {/* Hero */}
      <motion.section className="text-center py-16 px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4 leading-tight`}>{content.headline}</h1>
        <p className={`text-lg ${subTextColor} max-w-2xl mx-auto mb-8`}>{content.subheadline}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button className={`bg-gradient-to-r ${style.primary} text-white px-6 py-3 rounded-lg font-semibold`}>
            {content.primaryCta}
          </button>
          <button className={`border-2 ${isLight ? 'border-slate-300 text-slate-700' : 'border-slate-600 text-slate-300'} px-6 py-3 rounded-lg`}>
            {content.secondaryCta}
          </button>
        </div>
      </motion.section>

      {/* Problem */}
      <section className="py-12 px-6">
        <h2 className={`text-2xl font-bold ${textColor} text-center mb-6`}>{content.problem.title}</h2>
        <ul className={`max-w-xl mx-auto space-y-2 ${subTextColor}`}>
          {content.problem.points.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-red-400 mt-1">&#x2022;</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Solution */}
      <section className="py-12 px-6 text-center">
        <h2 className={`text-2xl font-bold ${textColor} mb-4`}>{content.solution.title}</h2>
        <p className={`${subTextColor} max-w-2xl mx-auto`}>{content.solution.description}</p>
      </section>

      {/* Benefits */}
      <section className="py-12 px-6">
        <h2 className={`text-2xl font-bold ${textColor} text-center mb-8`}>Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {content.benefits.map((b, i) => (
            <div key={i} className={`${style.card} p-5 rounded-xl ${isLight ? 'shadow-sm border border-slate-100' : ''}`}>
              <h3 className={`${style.secondary} font-semibold mb-2`}>{b.title}</h3>
              <p className={`${subTextColor} text-sm`}>{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-6">
        <h2 className={`text-2xl font-bold ${textColor} text-center mb-8`}>Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {content.features.map((f, i) => (
            <div key={i} className={`${style.card} p-5 rounded-xl ${isLight ? 'shadow-sm border border-slate-100' : ''}`}>
              <h3 className={`${style.secondary} font-semibold mb-2`}>{f.title}</h3>
              <p className={`${subTextColor} text-sm`}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-6">
        <h2 className={`text-2xl font-bold ${textColor} text-center mb-8`}>{content.socialProof.title}</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {content.socialProof.items.map((t, i) => (
            <div key={i} className={`${style.card} p-4 rounded-xl border-l-4 ${isLight ? 'border-l-blue-500' : 'border-l-purple-500'}`}>
              <p className={`${subTextColor} italic text-sm`}>{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-6 text-center">
        <h2 className={`text-2xl font-bold ${textColor} mb-2`}>{content.pricing.title}</h2>
        <p className={`${subTextColor} mb-6`}>{content.pricing.description}</p>
        <div className={`${style.card} p-8 rounded-2xl max-w-sm mx-auto border-2 ${isLight ? 'border-blue-500' : 'border-purple-500'}`}>
          <p className={`text-2xl font-bold ${style.secondary} mb-4`}>{content.pricing.price}</p>
          <ul className={`text-left space-y-2 mb-6 ${subTextColor} text-sm`}>
            {content.pricing.features.map((f, i) => (
              <li key={i}>&#10003; {f}</li>
            ))}
          </ul>
          <button className={`bg-gradient-to-r ${style.primary} text-white px-6 py-3 rounded-lg font-semibold w-full`}>
            {content.primaryCta}
          </button>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-6">
        <h2 className={`text-2xl font-bold ${textColor} text-center mb-8`}>FAQs</h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {content.faqs.map((fq, i) => (
            <div key={i} className={`${style.card} p-4 rounded-lg`}>
              <h4 className={`${style.secondary} font-semibold mb-1 text-sm`}>{fq.question}</h4>
              <p className={`${subTextColor} text-sm`}>{fq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-12 px-6 text-center bg-gradient-to-r ${style.primary} bg-opacity-10 mx-4 mb-4 rounded-2xl`}>
        <h2 className="text-2xl font-bold text-white mb-3">{content.finalCta.title}</h2>
        <p className="text-white/80 mb-6">{content.finalCta.description}</p>
        <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
          {content.finalCta.button}
        </button>
      </section>

      {/* Footer */}
      <div className={`text-center py-6 ${subTextColor} text-sm`}>
        &copy; 2025 {content.brandName}. All rights reserved.
      </div>
    </div>
  );
}
