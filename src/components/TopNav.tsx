import { User, MessageCircle, Flame, Users, Heart, ArrowLeft, Home } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/swipe", icon: Flame, label: "Discover" },
    { to: "/likes", icon: Heart, label: "Likes" },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/messages", icon: MessageCircle, label: "Chat" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-xl border-b border-border/40 shadow-sm">
      {/* Top tiny utility bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-muted/10">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-card shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* Subtle decorative pills to balance the center */}
        <div className="flex items-center justify-center gap-1 pointer-events-none opacity-60">
             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>

        <Link
          to="/"
          aria-label="Go home"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-card shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
        >
          <Home className="w-3.5 h-3.5" /> Home
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex items-center justify-between px-3 py-2 max-w-md mx-auto relative">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center justify-center w-[72px] py-1.5 rounded-2xl transition-all group"
            >
              {active && (
                <motion.div 
                  layoutId="topnav-active-indicator" 
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl" 
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Icon 
                className={`relative z-10 h-6 w-6 transition-all duration-300 ${active ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"}`} 
                fill={active ? "currentColor" : "none"} 
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`relative z-10 mt-1 text-[10px] font-bold tracking-wide transition-all duration-300 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TopNav;
