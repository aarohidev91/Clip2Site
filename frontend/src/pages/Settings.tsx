import { motion } from 'framer-motion';
import { Bot, CheckCircle, RefreshCw, Sparkles, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { authService } from '../services/auth';
import { projectsService } from '../services/projects';
import type { ProviderStatus } from '../types/generation';

export default function Settings() {
  const user = authService.getUser();
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const status = await projectsService.getProviderStatus();
      setProviderStatus(status);
    } catch {
      // handle error silently
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Profile */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-dark-400">Name</label>
              <p className="text-dark-100">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-dark-400">Email</label>
              <p className="text-dark-100">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* AI Provider Status */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">AI Provider Status</h2>
            <button
              onClick={loadStatus}
              disabled={loading}
              className="text-dark-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <LoadingSpinner size="sm" message="Checking provider status..." />
          ) : providerStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-dark-700">
                <span className="text-dark-300">Configured Provider</span>
                <span className="font-medium">{providerStatus.configured_provider}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-dark-700">
                <span className="text-dark-300">Gemini API</span>
                <div className="flex items-center gap-2">
                  {providerStatus.gemini_available ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">Not configured</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-dark-700">
                <span className="text-dark-300">Gemini Model</span>
                <code className="text-sm bg-dark-800 px-2 py-1 rounded">{providerStatus.gemini_model}</code>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-dark-300">Active Provider</span>
                <span className="flex items-center gap-2">
                  {providerStatus.active_provider === 'gemini' ? (
                    <>
                      <Sparkles className="w-4 h-4 text-primary-400" />
                      <span className="text-primary-400 font-medium">Gemini AI</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-accent-400" />
                      <span className="text-accent-400 font-medium">Free Mock Engine</span>
                    </>
                  )}
                </span>
              </div>

              {!providerStatus.gemini_available && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
                  <p className="text-yellow-400 text-sm font-medium mb-1">Gemini API Key Not Set</p>
                  <p className="text-dark-400 text-sm">
                    Set <code className="bg-dark-800 px-1 rounded">GEMINI_API_KEY</code> in your backend environment to enable
                    AI-powered generation. The free mock engine is active as a fallback and produces realistic results.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-dark-400">Unable to fetch provider status. Is the backend running?</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
