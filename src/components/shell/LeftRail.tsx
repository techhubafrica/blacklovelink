import { Link, NavLink } from "react-router-dom";
import {
  Flame, Heart, Users, MessageCircle, User as UserIcon, Bookmark,
  Settings, ShieldCheck, Sparkles, BookOpen, HelpCircle,
} from "lucide-react";

const primary = [
  { to: "/swipe", icon: Flame, label: "Discover" },
  { to: "/likes", icon: Heart, label: "Who liked you" },
  { to: "/community", icon: Users, label: "Community" },
  { to: "/messages", icon: MessageCircle, label: "Messages" },
  { to: "/profile", icon: UserIcon, label: "Your profile" },
];

const shortcuts = [
  { to: "/connections", icon: Sparkles, label: "Smart matches" },
  { to: "/education", icon: BookOpen, label: "Relationship hub" },
  { to: "/trust-safety", icon: ShieldCheck, label: "Trust & safety" },
  { to: "/support", icon: HelpCircle, label: "Help center" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Item = ({ to, icon: Icon, label }: { to: string; icon: typeof Flame; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground hover:bg-muted"
      }`
    }
  >
    <span className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </span>
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default function LeftRail() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-[280px] z-40 flex-col p-3 overflow-y-auto bg-background border-r border-border">
      <nav className="flex flex-col gap-0.5">
        {primary.map((i) => <Item key={i.to} {...i} />)}
      </nav>
      <div className="my-3 border-t border-border" />
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shortcuts</p>
      <nav className="flex flex-col gap-0.5">
        {shortcuts.map((i) => <Item key={i.to} {...i} />)}
      </nav>
      <div className="mt-auto pt-4 px-3 text-[11px] text-muted-foreground">
        <p>BlackLoveLink · {new Date().getFullYear()}</p>
        <p className="mt-1">
          <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
          {" · "}
          <Link to="/terms-of-service" className="hover:underline">Terms</Link>
          {" · "}
          <Link to="/cookie-policy" className="hover:underline">Cookies</Link>
        </p>
      </div>
    </aside>
  );
}