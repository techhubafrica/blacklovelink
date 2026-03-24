import { useState, useEffect } from "react";
import { Settings, Edit2, Shield, Star, Crown, CheckCircle2, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUserProfile } from "@/hooks/useProfileData";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useCurrentUserProfile();
  const [stats, setStats] = useState({ likes: 0, matches: 0, superLikes: 0 });
  const navigate = useNavigate();

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      
      // Successfully deleted on backend, now sign out frontend
      await signOut();
      navigate('/auth');
    } catch (e) {
      console.error("Error deleting account:", e);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  // Fetch real stats
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const [likesRes, matchesRes, superRes] = await Promise.all([
          (supabase as any).from("swipes").select("*", { count: "exact", head: true }).eq("swiped_id", user.id).eq("direction", "right"),
          (supabase as any).from("matches").select("*", { count: "exact", head: true }).or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
          (supabase as any).from("swipes").select("*", { count: "exact", head: true }).eq("swiped_id", user.id).eq("direction", "up"),
        ]);
        setStats({
          likes: likesRes.count ?? 0,
          matches: matchesRes.count ?? 0,
          superLikes: superRes.count ?? 0,
        });
      } catch (e) {
        console.error("Stats error:", e);
      }
    };
    fetchStats();
  }, [user]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "You";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg";

  const fieldsComplete = [
    !!profile?.full_name,
    !!profile?.occupation_title,
    !!profile?.dob,
    !!profile?.gender,
    !!profile?.intent,
    (profile?.photos?.length ?? 0) >= 2,
  ];
  const completeness = profile ? Math.round((fieldsComplete.filter(Boolean).length / fieldsComplete.length) * 100) : 0;

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <TopNav />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-sm px-4 py-8">
          {/* Profile photo */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-primary shadow-glow">
                {loading ? (
                  <div className="h-full w-full bg-muted animate-pulse" />
                ) : (
                  <img src={avatarUrl} alt="Your profile" className="h-full w-full object-cover" />
                )}
              </div>
              <Link to="/create-profile" className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-primary-foreground shadow-button">
                <Edit2 className="h-4 w-4" />
              </Link>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground">{displayName}</h2>
            {profile?.verified && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-blue-500">
                <CheckCircle2 className="w-4 h-4" fill="currentColor" />
                LinkedIn Verified
              </div>
            )}
            {profile?.intent && (
              <p className="mt-1 text-sm text-muted-foreground">{profile.intent}</p>
            )}
          </div>

          {/* Profile completeness */}
          <div className="mt-6 rounded-2xl bg-card border border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Profile Completeness</p>
              <p className="text-sm font-bold text-primary">{completeness}%</p>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full gradient-brand rounded-full transition-all duration-700" style={{ width: `${completeness}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">Complete your profile to improve your match quality.</p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Likes", value: stats.likes },
              { label: "Matches", value: stats.matches },
              { label: "Super Likes", value: stats.superLikes },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-card border border-border p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {[
              { icon: Settings, label: "Account Settings", desc: "Notifications, privacy, account" },
              { icon: Shield, label: "Safety Center", desc: "Block, report, trust & safety" },
              { icon: Star, label: "Verification Badges", desc: "Background & professional checks" },
            ].map(({ icon: Icon, label, desc }) => (
              <button key={label} className="flex w-full items-center gap-4 rounded-xl bg-card border border-border p-4 text-left hover:bg-muted transition-colors">
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}

            <button className="flex w-full items-center gap-4 rounded-xl p-4 text-left gradient-gold text-background hover:opacity-90 transition">
              <Crown className="h-6 w-6" />
              <div>
                <p className="font-bold">Go Premium – BlackLoveLink Gold</p>
                <p className="text-xs text-background/70">Unlimited likes · See who liked you · Visibility boost</p>
              </div>
            </button>

            <button 
              onClick={() => setShowDeleteModal(true)}
              className="flex w-full items-center gap-4 rounded-xl bg-card border border-red-200/50 p-4 text-left hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-8"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-semibold text-red-600 dark:text-red-500">Delete Account</p>
                <p className="text-xs text-red-500/70">Permanently erase your data and profile</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-center text-foreground mb-2">Delete Account?</h2>
            <p className="text-sm text-center text-muted-foreground mb-6">
              This action cannot be undone. All your matches, messages, photos, and personal data will be permanently wiped from our servers.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full flex justify-center items-center py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Delete My Account"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full py-3.5 rounded-full bg-muted text-foreground font-semibold hover:bg-muted/80 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
