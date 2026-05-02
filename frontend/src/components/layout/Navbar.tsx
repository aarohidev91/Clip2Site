import { motion } from 'framer-motion';
import { Film, LogOut, Menu, Settings, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const isAuth = authService.isAuthenticated();
  const user = authService.getUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuth ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Clip2Site AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {isAuth ? (
              <>
                <Link to="/dashboard" className="text-dark-300 hover:text-white transition-colors px-3 py-2">
                  Dashboard
                </Link>
                <Link to="/settings" className="text-dark-300 hover:text-white transition-colors p-2">
                  <Settings className="w-5 h-5" />
                </Link>
                <span className="text-dark-400 text-sm">{user?.name}</span>
                <button onClick={handleLogout} className="text-dark-400 hover:text-white transition-colors p-2">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-dark-300 hover:text-white transition-colors px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-dark-300" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-dark-900 border-t border-dark-800"
        >
          <div className="px-4 py-4 space-y-3">
            {isAuth ? (
              <>
                <Link to="/dashboard" className="block text-dark-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/settings" className="block text-dark-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>
                  Settings
                </Link>
                <button onClick={handleLogout} className="block text-dark-400 hover:text-white py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-dark-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block btn-primary text-center" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
