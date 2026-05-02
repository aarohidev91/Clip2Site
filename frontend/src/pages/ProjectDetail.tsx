import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Download, Eye, Pen, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ExportModal from '../components/export/ExportModal';
import LandingPreview from '../components/landing-preview/LandingPreview';
import ContentEditor from '../components/project/ContentEditor';
import GenerationSteps from '../components/ui/GenerationSteps';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { projectsService } from '../services/projects';
import type { GeneratedContent } from '../types/generation';
import type { Project } from '../types/project';

const templates = [
  { id: 'creator-launch', label: 'Creator Launch', color: 'from-purple-500 to-pink-500' },
  { id: 'saas-product', label: 'SaaS / Product', color: 'from-blue-500 to-cyan-500' },
  { id: 'local-business', label: 'Local Business', color: 'from-emerald-500 to-amber-500' },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'editor'>('preview');
  const [exportOpen, setExportOpen] = useState(false);
  const [genError, setGenError] = useState('');

  useEffect(() => {
    if (id) loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectsService.get(id!);
      setProject(data);
    } catch {
      // handle error silently
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!project) return;
    setGenerating(true);
    setGenError('');
    try {
      const result = await projectsService.generate(project.id);
      setProject((prev) =>
        prev
          ? {
              ...prev,
              generated_content: result.generated_content,
              ai_provider_used: result.ai_provider_used,
              generation_error: result.generation_error,
              status: 'generated',
            }
          : prev
      );
    } catch {
      setGenError('Generation failed. Please try again.');
    }
    setGenerating(false);
  };

  const handleSaveContent = async (content: GeneratedContent) => {
    if (!project) return;
    setSaving(true);
    try {
      const updated = await projectsService.updateContent(project.id, content as unknown as Record<string, unknown>);
      setProject(updated);
    } catch {
      // handle error silently
    }
    setSaving(false);
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!project) return;
    try {
      const updated = await projectsService.update(project.id, { selected_template: templateId });
      setProject(updated);
    } catch {
      // handle error silently
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading project..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <Link to="/dashboard" className="text-primary-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const hasContent = project.generated_content && Object.keys(project.generated_content).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-dark-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                {project.ai_provider_used && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-400 flex items-center gap-1">
                    {project.ai_provider_used === 'gemini' ? (
                      <><Sparkles className="w-3 h-3" /> Generated with Gemini</>
                    ) : (
                      <><Bot className="w-3 h-3" /> Generated with Free Mock Engine</>
                    )}
                  </span>
                )}
                {project.generation_error && (
                  <span className="text-xs text-yellow-400">{project.generation_error}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!hasContent ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? 'Generating...' : 'Generate Landing Page'}
              </button>
            ) : (
              <>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Regenerate
                </button>
                <button
                  onClick={() => setExportOpen(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </>
            )}
          </div>
        </div>

        {/* Generation in progress */}
        {generating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 mb-8"
          >
            <GenerationSteps />
          </motion.div>
        )}

        {genError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
            {genError}
          </div>
        )}

        {/* Content area */}
        {hasContent ? (
          <>
            {/* Template selector */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-dark-400">Template:</span>
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    project.selected_template === t.id
                      ? `bg-gradient-to-r ${t.color} text-white`
                      : 'glass-card text-dark-300 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}

              <div className="flex ml-auto bg-dark-800 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
                    activeTab === 'preview' ? 'bg-primary-500/20 text-primary-400' : 'text-dark-400'
                  }`}
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-4 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all ${
                    activeTab === 'editor' ? 'bg-primary-500/20 text-primary-400' : 'text-dark-400'
                  }`}
                >
                  <Pen className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>

            {/* Preview / Editor */}
            {activeTab === 'preview' ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-1 overflow-hidden"
              >
                <LandingPreview
                  content={project.generated_content as unknown as GeneratedContent}
                  template={project.selected_template}
                />
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6"
              >
                <ContentEditor
                  content={project.generated_content as unknown as GeneratedContent}
                  onSave={handleSaveContent}
                  saving={saving}
                />
              </motion.div>
            )}
          </>
        ) : !generating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-16 text-center"
          >
            <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-dark-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Ready to Generate</h2>
            <p className="text-dark-400 mb-6 max-w-md mx-auto">
              Click the button above to generate your landing page content using AI.
            </p>
            {project.description && (
              <div className="glass-card p-4 max-w-lg mx-auto text-left mb-6">
                <p className="text-sm text-dark-400 mb-1">Project context:</p>
                <p className="text-dark-200 text-sm">{project.description}</p>
              </div>
            )}
            <button onClick={handleGenerate} className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Generate Landing Page
            </button>
          </motion.div>
        ) : null}
      </motion.div>

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        projectId={project.id}
        projectTitle={project.title}
      />
    </div>
  );
}
