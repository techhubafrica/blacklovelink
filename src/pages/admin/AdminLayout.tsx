import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Users, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Users", href: "/admin/users", icon: Users },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    href === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-muted/20 font-display">
      {/* ── Desktop Sidebar ── */}
      <div className="hidden w-64 md:flex md:flex-col bg-card border-r border-border">
        <div className="p-6">
          <Link to="/" className="text-xl font-black tracking-tight flex flex-col">
            <div>
              Black<span className="text-primary">Love</span><span className="text-secondary">Link</span>
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-all"
          >
            <LogOut className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-x-hidden pt-6 px-4 pb-28 md:pt-8 md:px-8 md:pb-12">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <Link to="/" className="text-lg font-black tracking-tight">
            Black<span className="text-primary">Love</span><span className="text-secondary">Link</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest ml-2">Admin</span>
          </Link>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit
          </button>
        </div>
        <Outlet />
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border flex pb-safe z-50">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
              isActive(item.href) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.href) ? "scale-110" : ""} transition-transform`} />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;
