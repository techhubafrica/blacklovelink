import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, ShieldAlert, UserX, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  intent: string;
  verified: boolean;
  is_admin: boolean;
  created_at: string;
  avatar_url: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setUsers(data ?? []);
      } catch { toast.error('Failed to load users'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Users</h1>
          <p className="text-slate-400 mt-1">View and manage registered accounts.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-600 focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800/50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center">
                  <div className="w-6 h-6 border-2 border-slate-700 border-t-rose-500 rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  {search ? `No users found matching "${search}"` : 'No users yet.'}
                </td></tr>
              ) : filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                        {user.avatar_url
                          ? <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full gradient-brand opacity-70" />
                        }
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {user.full_name || 'Unnamed'}
                          {user.is_admin && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">Admin</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 truncate max-w-[180px]" title={user.id}>{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {user.age ? `${user.age} yrs` : 'N/A'} · {user.gender || 'Not specified'}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">{user.intent || 'No intent set'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                        <Shield className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Suspend user"
                      onClick={() => toast.info('Suspension feature coming soon')}
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
