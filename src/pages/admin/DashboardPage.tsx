import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users as UsersIcon, UserCheck, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  maleUsers: number;
  femaleUsers: number;
  otherGender: number;
  intents: Record<string, number>;
}

const COLORS = ["#f43f5e", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6"];

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("gender, verified, intent");

        if (error) throw error;

        let verified = 0;
        let male = 0;
        let female = 0;
        let other = 0;
        let intents: Record<string, number> = {};

        profiles.forEach(p => {
          if (p.verified) verified++;
          
          if (p.gender === "Male" || p.gender === "male") male++;
          else if (p.gender === "Female" || p.gender === "female") female++;
          else other++;

          if (p.intent) {
            intents[p.intent] = (intents[p.intent] || 0) + 1;
          }
        });

        setStats({
          totalUsers: profiles.length,
          verifiedUsers: verified,
          maleUsers: male,
          femaleUsers: female,
          otherGender: other,
          intents
        });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const genderData = [
    { name: "Female", value: stats?.femaleUsers || 0 },
    { name: "Male", value: stats?.maleUsers || 0 },
    { name: "Other", value: stats?.otherGender || 0 },
  ].filter(d => d.value > 0);

  const intentData = stats ? Object.entries(stats.intents).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-black text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Platform analytics and demographics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Users</p>
              <h2 className="text-4xl font-black mt-2">{stats?.totalUsers}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Verified</p>
              <h2 className="text-4xl font-black mt-2">{stats?.verifiedUsers}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Signups</p>
              <h2 className="text-4xl font-black mt-2">{stats?.totalUsers}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Breakdown */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-6">Gender Breakdown</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#f43f5e" : index === 1 ? "#0ea5e9" : "#a8a29e"} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {genderData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-muted-foreground'}`} />
                <span className="text-sm font-medium">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intent Breakdown */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-6">User Intent</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={intentData}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {intentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
