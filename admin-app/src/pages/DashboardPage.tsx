import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users as UsersIcon, UserCheck, ShieldCheck, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  femaleUsers: number;
  maleUsers: number;
  otherGender: number;
  intents: Record<string, number>;
}

const COLORS = ['#f43f5e', '#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6'];

const StatCard = ({ label, value, icon: Icon, color }: {
  label: string; value: number | undefined; icon: React.ElementType; color: string;
}) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-white">{value ?? '—'}</p>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase.from('profiles').select('gender, verified, intent');
        if (!data) return;

        let verified = 0, male = 0, female = 0, other = 0;
        const intents: Record<string, number> = {};
        data.forEach(p => {
          if (p.verified) verified++;
          if ((p.gender ?? '').toLowerCase() === 'male') male++;
          else if ((p.gender ?? '').toLowerCase() === 'female') female++;
          else other++;
          if (p.intent) intents[p.intent] = (intents[p.intent] ?? 0) + 1;
        });
        setStats({ totalUsers: data.length, verifiedUsers: verified, maleUsers: male, femaleUsers: female, otherGender: other, intents });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-rose-500 rounded-full animate-spin" />
    </div>
  );

  const genderData = [
    { name: 'Female', value: stats?.femaleUsers ?? 0 },
    { name: 'Male', value: stats?.maleUsers ?? 0 },
    { name: 'Other', value: stats?.otherGender ?? 0 },
  ].filter(d => d.value > 0);

  const intentData = stats ? Object.entries(stats.intents).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Overview</h1>
        <p className="text-slate-400 mt-1">Platform analytics and member demographics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Members" value={stats?.totalUsers} icon={UsersIcon} color="bg-rose-500/80" />
        <StatCard label="Verified" value={stats?.verifiedUsers} icon={ShieldCheck} color="bg-emerald-500/80" />
        <StatCard label="Active Profiles" value={stats?.totalUsers} icon={UserCheck} color="bg-sky-500/80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Gender Breakdown</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#f43f5e' : i === 1 ? '#0ea5e9' : '#a8a29e'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-3">
            {genderData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? '#f43f5e' : i === 1 ? '#0ea5e9' : '#a8a29e' }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Intent chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">User Intent</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={intentData} outerRadius={75} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {intentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {intentData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
