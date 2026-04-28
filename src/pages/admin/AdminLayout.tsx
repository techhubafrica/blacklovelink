import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Users, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20 font-display">
      {/* Sidebar Content */}
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
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden pt-8 px-8 pb-12">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
