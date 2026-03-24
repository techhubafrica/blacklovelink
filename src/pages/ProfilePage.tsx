import { useState, useEffect } from "react";
import { 
  Shield, Crown, CheckCircle2, Trash2, LogOut, ChevronRight, 
  Bell, Lock, AlertTriangle, Loader2, Camera, Heart, ChevronLeft, ArrowRight
} from "lucide-react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUserProfile } from "@/hooks/useProfileData";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type ViewState = 'main' | 'notifications' | 'privacy' | 'verification';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useCurrentUserProfile();
  const [stats, setStats] = useState({ likes: 0, matches: 0 });
  const navigate = useNavigate();

  // Navigation state
  const [activeView, setActiveView] = useState<ViewState>('main');

  // Local preferences state for optimistic UI updates
  const [prefs, setPrefs] = useState({
    push_notifications: true,
    email_notifications: true,
    is_public: true,
  });

  useEffect(() => {
    if (profile) {
      setPrefs({
        push_notifications: profile.push_notifications ?? true,
        email_notifications: profile.email_notifications ?? true,
        is_public: profile.is_public ?? true,
      });
    }
  }, [profile]);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      await signOut();
      navigate('/auth');
    } catch (e) {
      console.error("Error deleting account:", e);
      toast.error("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleTogglePref = async (key: keyof typeof prefs) => {
    const newValue = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: newValue })); // Optimistic update
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: newValue })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      toast.success("Preferences updated successfully");
    } catch (e) {
      console.error("Failed to update pref:", e);
      toast.error("Failed to update setting. Reverting.");
      setPrefs(prev => ({ ...prev, [key]: !newValue })); // Revert on failure
    }
  };

  const handleRequestVerification = () => {
    toast.success("Verification request submitted! We will review your profile shortly.");
    setTimeout(() => setActiveView('main'), 2000);
  };

  // Fetch real stats
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const [likesRes, matchesRes] = await Promise.all([
          (supabase as any).from("swipes").select("*", { count: "exact", head: true }).eq("swiped_id", user.id).eq("direction", "right"),
          (supabase as any).from("matches").select("*", { count: "exact", head: true }).or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        ]);
        setStats({
          likes: likesRes.count ?? 0,
          matches: matchesRes.count ?? 0,
        });
      } catch (e) {
        console.error("Stats error:", e);
      }
    };
    fetchStats();
  }, [user]);

  const displayName = profile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "You";
  const avatarUrl = profile?.avatar_url || profile?.photos?.[0] || user?.user_metadata?.avatar_url || "/placeholder.svg";

  const fieldsComplete = [
    !!profile?.full_name,
    !!profile?.occupation_title,
    !!profile?.dob,
    !!profile?.intent,
    (profile?.photos?.length ?? 0) >= 2,
  ];
  const completeness = profile ? Math.round((fieldsComplete.filter(Boolean).length / fieldsComplete.length) * 100) : 0;

  // Custom iOS-style Switch Toggle
  const Switch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-[30px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checked ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
    >
      <span className={`pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-[20px]' : 'translate-x-0'}`} />
    </button>
  );

  const SettingsRow = ({ icon: Icon, title, value, onClick, isDestructive = false }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-card active:bg-muted/50 transition-colors border-b border-border/50 last:border-0 group"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl flex items-center justify-center ${isDestructive ? 'bg-red-100 text-red-600 dark:bg-red-950/30' : 'bg-primary/10 text-primary'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-semibold text-[15px] ${isDestructive ? 'text-red-500' : 'text-foreground'}`}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-muted-foreground font-medium">{value}</span>}
        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
      </div>
    </button>
  );

  const SubHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 px-1 mb-6 mt-2">
      <button 
        onClick={() => setActiveView('main')} 
        className="p-2 rounded-full hover:bg-muted transition-colors -ml-2 text-foreground"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-black text-foreground">{title}</h1>
    </div>
  );

  return (
    <div className="flex bg-[#f8f9fc] dark:bg-background min-h-[100dvh] flex-col relative w-full overflow-x-hidden">
      {activeView === 'main' && <TopNav />}

      <main className="flex-1 overflow-x-hidden relative h-full">
        <AnimatePresence mode="wait" initial={false}>
          {/* ── Main View ── */}
          {activeView === 'main' && (
            <motion.div 
              key="main"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 overflow-y-auto pb-24 touch-pan-y"
            >
              <div className="mx-auto w-full max-w-md px-4 pt-6">
                
                {/* Header Profile Section */}
                <div className="flex flex-col items-center">
                  <div className="relative group cursor-pointer" onClick={() => navigate('/create-profile')}>
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-xl relative z-10 transition-transform active:scale-95 duration-200">
                      {loading ? (
                        <div className="h-full w-full bg-muted animate-pulse" />
                      ) : (
                        <img src={avatarUrl} alt="Your profile" className="h-full w-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    {profile?.verified && (
                      <div className="absolute bottom-1 right-2 z-20 bg-background rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-blue-500" fill="currentColor" stroke="white" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-foreground tracking-tight">
                    {displayName}{profile?.age && <span className="font-medium text-muted-foreground">, {profile.age}</span>}
                  </h2>

                  <button 
                    onClick={() => navigate('/create-profile')}
                    className="mt-3 px-5 py-2 rounded-full bg-white dark:bg-card border border-border shadow-sm text-sm font-semibold text-foreground hover:bg-muted transition-colors active:scale-95"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Completeness Bar */}
                {completeness < 100 && (
                  <div className="mt-8 rounded-2xl bg-white dark:bg-card shadow-sm border border-border/50 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[15px] font-bold text-foreground">Complete your profile</p>
                      <p className="text-sm font-black text-primary">{completeness}%</p>
                    </div>
                    <div className="w-full h-3 rounded-full bg-muted overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full gradient-brand transition-all duration-1000 ease-out" style={{ width: `${completeness}%` }} />
                    </div>
                    <p className="mt-3 text-[13px] text-muted-foreground leading-snug">
                      Add more photos and fill out your bio to get <span className="font-semibold text-foreground">3x more matches</span>.
                    </p>
                  </div>
                )}

                {/* Stats Row */}
                <div className="mt-6 flex justify-between gap-3">
                  <div className="flex-1 rounded-2xl bg-white dark:bg-card shadow-sm border border-border/50 p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate('/likes')}>
                    <p className="text-2xl font-black text-primary">{stats.likes}</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-muted-foreground">Likes You</p>
                  </div>
                  <div className="flex-1 rounded-2xl bg-white dark:bg-card shadow-sm border border-border/50 p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate('/connections')}>
                    <p className="text-2xl font-black text-foreground">{stats.matches}</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-muted-foreground">Matches</p>
                  </div>
                </div>

                {/* Section: Premium */}
                <div className="mt-8">
                  <p className="px-4 text-[13px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">Premium</p>
                  <div className="overflow-hidden rounded-2xl bg-white dark:bg-card shadow-sm border border-border/50">
                    <button className="w-full relative overflow-hidden group p-5 text-left active:scale-[0.98] transition-transform">
                      <div className="absolute inset-0 gradient-gold opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-yellow-400/20 rounded-xl relative">
                          <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-[17px] bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-500">BlackLoveLink Gold</p>
                          <p className="text-[13px] text-muted-foreground font-medium mt-0.5">See who likes you & more</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-yellow-500/50" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section: Account Settings */}
                <div className="mt-8">
                  <p className="px-4 text-[13px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">Account</p>
                  <div className="overflow-hidden rounded-2xl bg-white dark:bg-card shadow-sm border border-border/50">
                    <SettingsRow icon={Bell} title="Notifications" onClick={() => setActiveView('notifications')} />
                    <SettingsRow icon={Lock} title="Privacy & Security" value={prefs.is_public ? "Public" : "Hidden"} onClick={() => setActiveView('privacy')} />
                    <SettingsRow icon={CheckCircle2} title="Verification" value={profile?.verified ? "Verified" : "Pending"} onClick={() => setActiveView('verification')} />
                  </div>
                </div>

                {/* Section: Safety & Support */}
                <div className="mt-8">
                  <div className="overflow-hidden rounded-2xl bg-white dark:bg-card shadow-sm border border-border/50">
                    <SettingsRow icon={Shield} title="Safety Center" onClick={() => navigate('/trust-safety')} />
                    <SettingsRow icon={Heart} title="Help & Support" onClick={() => navigate('/support')} />
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 mb-12">
                  <div className="overflow-hidden rounded-2xl bg-white dark:bg-card shadow-sm border border-border/50">
                    <SettingsRow icon={LogOut} title="Log Out" onClick={handleLogout} />
                    <SettingsRow icon={Trash2} title="Delete Account" onClick={() => setShowDeleteModal(true)} isDestructive />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Sub-view: Notifications ── */}
          {activeView === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-background overflow-y-auto pb-24"
            >
              <div className="mx-auto w-full max-w-md px-4 pt-6">
                <SubHeader title="Notifications" />
                <div className="rounded-2xl bg-card border border-border/50 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-5 border-b border-border/50">
                    <div>
                      <p className="font-semibold text-foreground text-lg">Push Notifications</p>
                      <p className="text-sm text-muted-foreground mt-1">Get alerts for new matches and messages directly on your device.</p>
                    </div>
                    <Switch checked={prefs.push_notifications} onChange={() => handleTogglePref('push_notifications')} />
                  </div>
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-semibold text-foreground text-lg">Email Notifications</p>
                      <p className="text-sm text-muted-foreground mt-1">Receive promotional offers and weekly match summaries.</p>
                    </div>
                    <Switch checked={prefs.email_notifications} onChange={() => handleTogglePref('email_notifications')} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Sub-view: Privacy ── */}
          {activeView === 'privacy' && (
            <motion.div 
              key="privacy"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-background overflow-y-auto pb-24"
            >
              <div className="mx-auto w-full max-w-md px-4 pt-6">
                <SubHeader title="Privacy & Security" />
                <div className="rounded-2xl bg-card border border-border/50 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-semibold text-foreground text-lg">Public Profile</p>
                      <p className="text-sm text-muted-foreground mt-1">Allow other users to see your profile in their swipe feed. Turning this off hides you completely, but you can still chat with existing matches.</p>
                    </div>
                    <Switch checked={prefs.is_public} onChange={() => handleTogglePref('is_public')} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Sub-view: Verification ── */}
          {activeView === 'verification' && (
            <motion.div 
              key="verification"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-background overflow-y-auto pb-24"
            >
              <div className="mx-auto w-full max-w-md px-4 pt-6">
                <SubHeader title="Verification" />
                <div className="flex flex-col items-center justify-center text-center py-12 px-6">
                  {profile?.verified ? (
                    <>
                      <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-12 h-12 text-blue-500" fill="currentColor" stroke="white" strokeWidth={1} />
                      </div>
                      <h2 className="text-2xl font-black text-foreground">You're Verified!</h2>
                      <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                        Your profile bears the official BlackLoveLink verification badge. You stand out as a trusted community member.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Camera className="w-10 h-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-black text-foreground">Get Verified</h2>
                      <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                        Boost your matches by up to 200%. Verification proves you are a real person and builds trust within the community.
                      </p>
                      <button 
                        onClick={handleRequestVerification}
                        className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-full gradient-brand text-primary-foreground font-bold shadow-button hover:opacity-90 transition-opacity"
                      >
                        Request Verification <ArrowRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4">
          <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-background p-6 shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 border border-border/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-5 shadow-inner">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-center text-foreground mb-2">Are you sure?</h2>
            <p className="text-sm text-center text-muted-foreground mb-8 px-2 font-medium">
              If you delete your account, you will permanently lose your profile, messages, photos, and matches. This is irreversible.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full flex justify-center items-center py-4 rounded-[20px] bg-red-500 hover:bg-red-600 text-white font-bold text-[15px] transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete My Account"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full py-4 rounded-[20px] bg-muted text-foreground font-bold text-[15px] hover:bg-muted/80 transition-colors"
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
