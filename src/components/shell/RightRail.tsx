import { Link } from "react-router-dom";
import { Sparkles, Heart, MessageCircle } from "lucide-react";
import profile1 from "@/assets/profile-1.png";
import profile2 from "@/assets/profile-2.png";
import profile3 from "@/assets/profile-3.png";
import profile4 from "@/assets/profile-4.png";
import profile5 from "@/assets/profile-5.png";

const suggestions = [
  { name: "Amara O.", role: "Architect · Lagos", img: profile1 },
  { name: "Kwame B.", role: "Surgeon · Accra", img: profile2 },
  { name: "Zara M.", role: "Founder · Nairobi", img: profile3 },
];

const online = [
  { name: "Adaeze", img: profile4 },
  { name: "Tunde", img: profile5 },
  { name: "Naima", img: profile1 },
  { name: "Kojo", img: profile2 },
  { name: "Imani", img: profile3 },
];

export default function RightRail() {
  return (
    <aside className="hidden lg:flex fixed right-0 top-14 bottom-0 w-[320px] z-40 flex-col p-3 gap-4 overflow-y-auto bg-background border-l border-border">
      {/* Suggested matches */}
      <section className="rounded-2xl bg-card border border-border p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Suggested for you
          </h3>
          <Link to="/swipe" className="text-xs font-semibold text-primary hover:underline">See all</Link>
        </div>
        <ul className="flex flex-col gap-1">
          {suggestions.map((s) => (
            <li key={s.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition">
              <img src={s.img} alt={s.name} className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">{s.role}</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition" aria-label={`Like ${s.name}`}>
                <Heart className="w-4 h-4" fill="currentColor" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Online now */}
      <section className="rounded-2xl bg-card border border-border p-3">
        <h3 className="text-sm font-bold text-foreground mb-2 px-1">Active now</h3>
        <ul className="flex flex-col">
          {online.map((p) => (
            <li key={p.name}>
              <Link to="/messages" className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition">
                <div className="relative">
                  <img src={p.img} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-card" />
                </div>
                <span className="text-sm font-medium text-foreground">{p.name}</span>
                <MessageCircle className="ml-auto w-4 h-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer ad-style card */}
      <section className="rounded-2xl p-4 bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Tip</p>
        <p className="text-sm font-semibold text-foreground leading-snug">
          Verified profiles get 4× more meaningful matches.
        </p>
        <Link to="/profile" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
          Verify now →
        </Link>
      </section>
    </aside>
  );
}