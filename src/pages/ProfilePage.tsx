import { Settings, Edit2, Shield, Star, Crown, CheckCircle2 } from "lucide-react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUserProfile } from "@/hooks/useProfileData";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading } = useCurrentUserProfile();

  // Use data from Supabase profile, fall back to auth metadata
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "You";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg";

  // Calculate profile completeness from real data
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
              <div
                className="h-full gradient-brand rounded-full transition-all duration-700"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Complete your profile to improve your match quality.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Likes", value: "42" },
              { label: "Matches", value: "12" },
              { label: "Super Likes", value: "3" },
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
              <button
                key={label}
                className="flex w-full items-center gap-4 rounded-xl bg-card border border-border p-4 text-left hover:bg-muted transition-colors"
              >
                <Icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}

            {/* Premium CTA */}
            <button className="flex w-full items-center gap-4 rounded-xl p-4 text-left gradient-gold text-background hover:opacity-90 transition">
              <Crown className="h-6 w-6" />
              <div>
                <p className="font-bold">Go Premium – BlackLoveLink Gold</p>
                <p className="text-xs text-background/70">Unlimited likes · See who liked you · Visibility boost</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
