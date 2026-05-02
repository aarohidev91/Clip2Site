import { useState } from 'react';
import { Save } from 'lucide-react';
import type { GeneratedContent } from '../../types/generation';

interface ContentEditorProps {
  content: GeneratedContent;
  onSave: (content: GeneratedContent) => void;
  saving: boolean;
}

export default function ContentEditor({ content, onSave, saving }: ContentEditorProps) {
  const [edited, setEdited] = useState<GeneratedContent>({ ...content });

  const updateField = (path: string, value: string) => {
    const keys = path.split('.');
    const newContent = JSON.parse(JSON.stringify(edited));
    let obj = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setEdited(newContent);
  };

  const updateArrayItem = (path: string, index: number, field: string, value: string) => {
    const newContent = JSON.parse(JSON.stringify(edited));
    const keys = path.split('.');
    let obj = newContent;
    for (const key of keys) {
      obj = obj[key];
    }
    obj[index][field] = value;
    setEdited(newContent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit Content</h3>
        <button
          onClick={() => onSave(edited)}
          disabled={saving}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-dark-400 mb-1">Brand Name</label>
          <input
            className="input-field"
            value={edited.brandName}
            onChange={(e) => updateField('brandName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-dark-400 mb-1">Headline</label>
          <input
            className="input-field"
            value={edited.headline}
            onChange={(e) => updateField('headline', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-dark-400 mb-1">Subheadline</label>
          <textarea
            className="input-field"
            rows={2}
            value={edited.subheadline}
            onChange={(e) => updateField('subheadline', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-dark-400 mb-1">Primary CTA</label>
            <input
              className="input-field"
              value={edited.primaryCta}
              onChange={(e) => updateField('primaryCta', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-1">Secondary CTA</label>
            <input
              className="input-field"
              value={edited.secondaryCta}
              onChange={(e) => updateField('secondaryCta', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-dark-400 mb-1">Solution Description</label>
          <textarea
            className="input-field"
            rows={3}
            value={edited.solution.description}
            onChange={(e) => updateField('solution.description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Benefits</label>
          {edited.benefits.map((b, i) => (
            <div key={i} className="glass-card p-3 mb-2">
              <input
                className="input-field mb-2 text-sm"
                placeholder="Title"
                value={b.title}
                onChange={(e) => updateArrayItem('benefits', i, 'title', e.target.value)}
              />
              <textarea
                className="input-field text-sm"
                rows={2}
                placeholder="Description"
                value={b.description}
                onChange={(e) => updateArrayItem('benefits', i, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">FAQs</label>
          {edited.faqs.map((fq, i) => (
            <div key={i} className="glass-card p-3 mb-2">
              <input
                className="input-field mb-2 text-sm"
                placeholder="Question"
                value={fq.question}
                onChange={(e) => updateArrayItem('faqs', i, 'question', e.target.value)}
              />
              <textarea
                className="input-field text-sm"
                rows={2}
                placeholder="Answer"
                value={fq.answer}
                onChange={(e) => updateArrayItem('faqs', i, 'answer', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm text-dark-400 mb-1">Pricing Price</label>
          <input
            className="input-field"
            value={edited.pricing.price}
            onChange={(e) => updateField('pricing.price', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
