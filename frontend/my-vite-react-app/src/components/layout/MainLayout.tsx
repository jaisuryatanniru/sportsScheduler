
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  Calendar, 
  PlusCircle, 
  Dumbbell, 
  LogOut, 
  User,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
      "hover:bg-secondary",
      active ? "bg-secondary font-medium text-primary" : "text-muted-foreground"
    )}
  >
    <span className={cn("", active ? "text-primary" : "text-muted-foreground")}>
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Close sidebar when changing routes on mobile
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div className="font-semibold text-lg">SportySessions</div>
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={20} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/login")}
              aria-label="Login"
            >
              <User size={20} />
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop and expanded mobile */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
            "lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full py-6">
            <div className="px-6 mb-8 hidden lg:block">
              <h1 className="text-xl font-semibold">SportySessions</h1>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              <NavLink
                to="/dashboard"
                icon={<Home size={20} />}
                label="Dashboard"
                active={location.pathname === "/dashboard"}
              />
              <NavLink
                to="/sessions"
                icon={<Calendar size={20} />}
                label="Sessions"
                active={location.pathname === "/sessions"}
              />
              <NavLink
                to="/create-session"
                icon={<PlusCircle size={20} />}
                label="Create Session"
                active={location.pathname === "/create-session"}
              />
              {isAdmin && (
                <NavLink
                  to="/admin/sports"
                  icon={<Dumbbell size={20} />}
                  label="Manage Sports"
                  active={location.pathname === "/admin/sports"}
                />
              )}
            </nav>

            <div className="mt-auto px-3">
              {isAuthenticated ? (
                <div className="space-y-3 p-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <CustomButton 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleLogout}
                    icon={<LogOut size={18} />}
                  >
                    Log out
                  </CustomButton>
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  <CustomButton 
                    className="w-full" 
                    onClick={() => navigate("/login")}
                  >
                    Sign in
                  </CustomButton>
                  <CustomButton 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <div className="container pt-6 pb-12 px-4 lg:px-8 max-w-7xl animate-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};