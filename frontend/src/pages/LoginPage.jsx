import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center pt-20 px-4 bg-darker">
      <div className="glass max-w-md w-full p-8 space-y-8 rounded-xl">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2 tracking-tight">Welcome Back</h1>
            <p className="text-text-muted">Securely sign in to your accounts</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Email Address</label>
            <div className="input-group">
              <div className="input-icon-container">
                <Mail className="size-5" />
              </div>
              <input
                type="email"
                className="input-field"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Password</label>
            <div className="input-group">
              <div className="input-icon-container">
                <Lock className="size-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="input-icon-container hover:text-white border-none bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-primary animate-pulse" />
                ) : (
                  <Eye className="size-5 transition-colors" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                <span>Entering...</span>
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-text-muted">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
