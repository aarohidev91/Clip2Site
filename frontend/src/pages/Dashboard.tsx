import { motion } from 'framer-motion';
import { Bot, Clock, Film, FolderOpen, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { projectsService } from '../services/projects';
import type { Project } from '../types/project';

const statusColors: Record<string, string> = {
  draft: 'bg-dark-600 text-dark-300',
  uploaded: 'bg-blue-500/20 text-blue-400',
  transcribing: 'bg-yellow-500/20 text-yellow-400',
  analyzing: 'bg-purple-500/20 text-purple-400',
  generated: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsService.list();
      setProjects(data);
    } catch {
      // handle error silently
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    try {
      await projectsService.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch {
      // handle error silently
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-dark-400 mt-1">Create and manage your landing pages</p>
        </div>
        <Link to="/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Project
        </Link>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-16 text-center"
        >
          <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-10 h-10 text-dark-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
          <p className="text-dark-400 mb-8 max-w-md mx-auto">
            Create your first project to turn a product video into a beautiful landing page.
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create Your First Project
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="glass-card p-6 cursor-pointer hover:border-primary-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center">
                  <Film className="w-6 h-6 text-primary-400" />
                </div>
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  className="text-dark-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{project.title}</h3>
              {project.description && (
                <p className="text-dark-400 text-sm mb-3 line-clamp-2">{project.description}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap mt-auto">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status] || statusColors.draft}`}>
                  {project.status}
                </span>
                {project.ai_provider_used && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-400 flex items-center gap-1">
                    {project.ai_provider_used === 'gemini' ? (
                      <><Sparkles className="w-3 h-3" /> Gemini</>
                    ) : (
                      <><Bot className="w-3 h-3" /> Mock</>
                    )}
                  </span>
                )}
                <span className="text-xs text-dark-500 flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
