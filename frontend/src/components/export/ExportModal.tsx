import { motion, AnimatePresence } from 'framer-motion';
import { Check, Code, Copy, Download, FileCode, X } from 'lucide-react';
import { useState } from 'react';
import { projectsService } from '../../services/projects';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

export default function ExportModal({ isOpen, onClose, projectId, projectTitle }: ExportModalProps) {
  const [loading, setLoading] = useState(false);
  const [exportedCode, setExportedCode] = useState('');
  const [exportType, setExportType] = useState<'html' | 'react' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExport = async (type: 'html' | 'react') => {
    setLoading(true);
    setExportType(type);
    try {
      const response = type === 'html'
        ? await projectsService.exportHtml(projectId)
        : await projectsService.exportReact(projectId);
      setExportedCode(response.content);
    } catch {
      setExportedCode('Error exporting. Please try again.');
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = exportType === 'html' ? 'html' : 'tsx';
    const blob = new Blob([exportedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-landing-page.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-6 w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Export Landing Page</h2>
              <button onClick={onClose} className="text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!exportType ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleExport('html')}
                  className="glass-card p-6 hover:border-primary-500/50 transition-all text-left"
                >
                  <FileCode className="w-10 h-10 text-primary-400 mb-3" />
                  <h3 className="font-semibold text-lg mb-1">HTML Export</h3>
                  <p className="text-dark-400 text-sm">Self-contained HTML file with inline CSS. Ready to deploy anywhere.</p>
                </button>
                <button
                  onClick={() => handleExport('react')}
                  className="glass-card p-6 hover:border-primary-500/50 transition-all text-left"
                >
                  <Code className="w-10 h-10 text-accent-400 mb-3" />
                  <h3 className="font-semibold text-lg mb-1">React Component</h3>
                  <p className="text-dark-400 text-sm">React + Tailwind component. Drop into any React project.</p>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary-400">
                      {exportType === 'html' ? 'HTML' : 'React'} Export
                    </span>
                    <button
                      onClick={() => { setExportType(null); setExportedCode(''); }}
                      className="text-dark-400 hover:text-white text-xs underline"
                    >
                      Change format
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleDownload} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto bg-dark-900 rounded-xl border border-dark-700 p-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-dark-700 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <pre className="text-sm text-dark-300 whitespace-pre-wrap break-words font-mono">
                      {exportedCode}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
