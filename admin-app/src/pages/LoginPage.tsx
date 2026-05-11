import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'BlackLoveAdmin2026!';

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    if (password !== ADMIN_PASSWORD) {
      setError('Incorrect password');
      setPassword('');
      return;
    }

    setLoading(true);

    try {
      // Verify the current user is logged in via Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be signed into BlackLoveLink first.');
        setLoading(false);
        return;
      }

      // Mark as admin in DB
      await supabase.from('profiles').update({ is_admin: true }).eq('user_id', user.id);

      // Unlock session
      sessionStorage.setItem('bll_admin_unlocked', 'true');
      navigate('/', { replace: true });
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand mb-4 shadow-lg shadow-rose-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">
              Black<span className="text-gradient-brand">Love</span>Link
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium uppercase tracking-widest">
              Admin Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-600 rounded-xl pl-10 pr-11 py-3.5 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-rose-400 text-sm font-semibold text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl gradient-brand text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock Dashboard
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            BlackLoveLink Admin · Restricted Access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
