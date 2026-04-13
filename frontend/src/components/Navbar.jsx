import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, User, Settings } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed w-full top-0 z-40 transition-all bg-bg-surface/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-bg-dark group">
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
            <MessageSquare className="size-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-text-main">Chatr</h1>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `
              flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-bg-dark group border-none cursor-pointer
              ${isActive ? "nav-item-active" : "text-text-muted"}
            `}
          >
            <Settings className="size-5 group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline text-[13px] font-bold tracking-tight">Settings</span>
          </NavLink>

          {authUser && (
            <>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-bg-dark group border-none cursor-pointer
                  ${isActive ? "nav-item-active" : "text-text-muted"}
                `}
              >
                <User className="size-5 group-hover:text-primary transition-colors" />
                <span className="hidden sm:inline text-[13px] font-bold tracking-tight">Profile</span>
              </NavLink>

              <div className="h-4 w-px bg-bg-dark/10 mx-2 hidden sm:block" />

              <button 
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-bg-dark text-text-muted hover:text-error border-none bg-transparent cursor-pointer group shadow-none outline-none" 
                onClick={logout}
              >
                <LogOut className="size-5 transition-transform group-hover:translate-x-0.5" />
                <span className="hidden sm:inline text-[13px] font-bold tracking-tight">Logout</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
