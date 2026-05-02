import { motion } from 'framer-motion';
import { ArrowRight, Film, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsService } from '../services/projects';

export default function CreateProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'details' | 'upload'>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [desiredTone, setDesiredTone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!title.trim()) {
      setError('Please enter a project title');
      return;
    }
    setError('');
    setStep('upload');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 100 * 1024 * 1024) {
        setError('File too large. Max 100MB.');
        return;
      }
      setFile(f);
      setError('');
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const project = await projectsService.create({
        title,
        description,
        target_audience: targetAudience,
        desired_tone: desiredTone,
      });

      if (file) {
        await projectsService.uploadVideo(project.id, file);
      }

      navigate(`/projects/${project.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Failed to create project';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-dark-400 mt-2">Tell us about your product and upload a video</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 'details' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">
                Project Title <span className="text-red-400">*</span>
              </label>
              <input
                className="input-field"
                placeholder="e.g., FitPro AI Fitness App"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">
                Project Description / Video Context <span className="text-primary-400">(recommended)</span>
              </label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Describe what your product or service does, its key selling points, and what the video showcases..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-dark-500 mt-1">
                This helps generate better results even without video transcription
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">
                Target Audience <span className="text-dark-500">(optional)</span>
              </label>
              <input
                className="input-field"
                placeholder="e.g., busy professionals who want to stay fit"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">
                Desired Tone <span className="text-dark-500">(optional)</span>
              </label>
              <select
                className="input-field"
                value={desiredTone}
                onChange={(e) => setDesiredTone(e.target.value)}
              >
                <option value="">Select tone...</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual & Friendly</option>
                <option value="energetic">Energetic & Bold</option>
                <option value="luxury">Luxury & Premium</option>
                <option value="playful">Playful & Fun</option>
                <option value="authoritative">Authoritative & Expert</option>
              </select>
            </div>

            <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Upload Video</h2>
              <p className="text-dark-400 text-sm">Upload a product video or skip to generate from description</p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                file ? 'border-green-500/50 bg-green-500/5' : 'border-dark-600 hover:border-primary-500/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <>
                  <Film className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="font-medium text-green-400">{file.name}</p>
                  <p className="text-dark-500 text-sm mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-dark-500 mx-auto mb-3" />
                  <p className="text-dark-300 font-medium">Click to upload a video</p>
                  <p className="text-dark-500 text-sm mt-1">MP4, MOV, AVI, MKV, WebM (max 100MB)</p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('details')}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>Create Project</>
                )}
              </button>
            </div>

            {!file && (
              <p className="text-center text-dark-500 text-sm">
                Video is optional. You can generate from title and description.
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
