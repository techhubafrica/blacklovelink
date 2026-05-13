import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Home, Heart, Users, MessageCircle, User as UserIcon,
  Bell, Menu, ArrowLeft, Flame,
} from "lucide-react";
import logo from "@/assets/blacklovelink-logo.png";
import LeftRail from "@/components/shell/LeftRail";
import RightRail from "@/components/shell/RightRail";

const tabs = [
  { to: "/swipe", icon: Flame, label: "Discover" },
  { to: "/likes", icon: Heart, label: "Likes" },
  { to: "/community", icon: Users, label: "Community" },
  { to: "/messages", icon: MessageCircle, label: "Messages" },
  { to: "/profile", icon: UserIcon, label: "Profile" },
];

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Toggle body padding so fixed rails don't overlap content on lg+
  useEffect(() => {
    document.body.classList.add("app-shell-active");
    return () => document.body.classList.remove("app-shell-active");
  }, []);

  return (
    <>
      {/* ── FACEBOOK-STYLE TOP HEADER ───────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between gap-2 h-14 px-2 sm:px-4">
          {/* Left: logo + search */}
          <div className="flex items-center gap-2 flex-1 min-w-0 max-w-[360px]">
            <Link to="/" aria-label="Home" className="shrink-0">
              <img src={logo} alt="BlackLoveLink" className="h-9 w-9 rounded-full object-cover" />
            </Link>
            <div className="relative flex-1 min-w-0 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search BlackLoveLink"
                className="w-full h-10 pl-9 pr-3 rounded-full bg-muted text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:outline-none focus:border-primary/40 focus:bg-background transition"
              />
            </div>
            <button
              onClick={() => navigate(-1)}
              className="sm:hidden p-2 rounded-full hover:bg-muted text-muted-foreground"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Center: tab nav */}
          <nav className="hidden md:flex items-center justify-center flex-1 max-w-2xl">
            {tabs.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  aria-label={label}
                  className="relative flex items-center justify-center h-14 w-[88px] lg:w-[112px] group"
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                    fill={active ? "currentColor" : "none"}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  {active && (
                    <motion.div
                      layoutId="topnav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center justify-end gap-1.5 flex-1 max-w-[360px]">
            <button className="hidden sm:flex w-10 h-10 rounded-full bg-muted hover:bg-muted/70 items-center justify-center text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/messages" className="hidden sm:flex w-10 h-10 rounded-full bg-muted hover:bg-muted/70 items-center justify-center text-foreground relative">
              <MessageCircle className="w-5 h-5" />
            </Link>
            <button className="w-10 h-10 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-foreground relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-card" />
            </button>
            <Link
              to="/profile"
              aria-label="Your profile"
              className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── DESKTOP RAILS ───────────────────────────────────────────── */}
      <LeftRail />
      <RightRail />

      {/* ── MOBILE BOTTOM TAB BAR ───────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-14 bg-card border-t border-border flex items-center justify-around">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <Icon
                className={`w-6 h-6 ${active ? "text-primary" : "text-muted-foreground"}`}
                fill={active ? "currentColor" : "none"}
                strokeWidth={active ? 2.4 : 2}
              />
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default TopNav;
