import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Users, LogOut, Shield,
} from 'lucide-react';

const nav = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Users', href: '/users', icon: Users },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const handleLogout = () => {
    sessionStorage.removeItem('bll_admin_unlocked');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-900 border-r border-slate-800 fixed inset-y-0 left-0 z-40">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-white text-sm leading-tight">BlackLoveLink</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Admin</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(item => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-sm">BLL Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {nav.map(item => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
              isActive(item.href) ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-transform ${isActive(item.href) ? 'scale-110' : ''}`} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
