import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  if(localStorage.getItem("isAuthenticated") === "true") {
    navigate("/dashboard");
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email == 'info@soapbox.cloud' && password == 'Admin@0147') {
      localStorage.setItem("isAuthenticated", "true");
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  const handleSSOLogin = (provider: string) => {
    localStorage.setItem("isAuthenticated", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Soft radial gradient background - white to light green tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#F8FDFB_0%,_#E8F5F0_100%)]" />
      
      {/* Subtle floating abstract shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[15%] w-32 h-32 rounded-full bg-[#2d5ab0]/8 blur-3xl" />
        <div className="absolute top-40 right-[20%] w-48 h-48 rounded-full bg-[#4db051]/8 blur-3xl" />
        <div className="absolute bottom-32 left-[25%] w-40 h-40 rounded-full bg-[#2d5ab0]/5 blur-3xl" />
        <div className="absolute top-16 right-[35%] w-24 h-24 rounded-full bg-[#E8F5F0]/80 blur-2xl" />
        <div className="absolute bottom-20 right-[15%] w-36 h-36 rounded-full bg-[#4db051]/6 blur-3xl" />
      </div>

      {/* Decorative floating UI elements at top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-3xl h-48 pointer-events-none">
        <div className="absolute top-8 left-[18%] w-14 h-14 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-lg flex items-center justify-center">
          <div className="w-7 h-7 rounded-lg bg-[#2d5ab0]/25" />
        </div>
        <div className="absolute top-4 left-[35%] w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-md" />
        <div className="absolute top-12 right-[18%] w-36 h-24 rounded-xl bg-white/75 backdrop-blur-sm border border-white/80 shadow-lg p-3">
          <div className="w-full h-2.5 rounded bg-[#2d5ab0]/35 mb-2" />
          <div className="w-4/5 h-2 rounded bg-[#D6E5DE]" />
          <div className="w-3/5 h-2 rounded bg-[#D6E5DE] mt-1.5" />
        </div>
        <div className="absolute top-6 right-[38%] w-11 h-11 rounded-xl bg-[#4db051] shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="absolute top-20 left-[28%] w-8 h-8 rounded-lg bg-[#E8F5F0]/80 backdrop-blur-sm border border-white/60 shadow-md" />
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in mt-20">
        {/* Logo with glass chip container */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/70 shadow-sm">
            <img 
              src={logo} 
              alt="SOAPBOX" 
              className="h-14"
            />
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-[34px] font-bold text-[#1F2A2E] mb-3">
            Sign In
          </h1>
          <p className="text-[#2C3E35] font-medium text-lg mb-3">
            Engineering the Operating System for Regulated Industries.
          </p>
          <p className="text-[#4A5F57] text-sm leading-[1.6] max-w-[520px] mx-auto">
            A unified, cloud-native foundation for safety, risk, and compliance — built with clarity, resilience, and governance at its core.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.95] backdrop-blur-md rounded-[18px] p-8 md:p-9 shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-white/60 transition-all duration-300">
          <h2 className="text-lg font-semibold text-[#1F2A2E] mb-6 text-center">
            Sign in to <span style={{ fontFamily: "'Orbitron', sans-serif" }}>Soapbox</span>
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a6580] transition-colors group-focus-within:text-[#2d5ab0]" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-[52px] bg-white border-[#D6DEE5] text-[#1a3a5c] placeholder:text-[#7A8F9A] rounded-xl transition-all focus:border-[#2d5ab0] focus:ring-[3px] focus:ring-[rgba(45,90,176,0.15)]"
                required
              />
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4a6580] transition-colors group-focus-within:text-[#2d5ab0]" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-32 h-[52px] bg-white border-[#D6DEE5] text-[#1a3a5c] placeholder:text-[#7A8F9A] rounded-xl transition-all focus:border-[#2d5ab0] focus:ring-[3px] focus:ring-[rgba(45,90,176,0.15)]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#2d5ab0] hover:text-[#1e4a96] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#D6DEE5] data-[state=checked]:bg-[#2d5ab0] data-[state=checked]:border-[#2d5ab0]"
              />
              <label
                htmlFor="remember"
                className="text-sm text-[#3E5B6E] cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-br from-[#2d5ab0] to-[#1F4A8D] text-white font-semibold h-[54px] rounded-[14px] shadow-[0_10px_24px_rgba(45,90,176,0.35)] hover:shadow-[0_14px_28px_rgba(45,90,176,0.4)] hover:-translate-y-0.5 hover:from-[#3868BE] hover:to-[#2d5ab0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Sign in
            </Button>
          </form>

          {/* SSO Options */}
          <div className="mt-7">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D6DEE5]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/95 text-[#5A7080]">Or sign in with</span>
              </div>
            </div>
            
            <div className="mt-5 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSSOLogin("google")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-[#D6DEE5] rounded-xl hover:bg-[#F8FAFC] hover:border-[#B8C8D8] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSSOLogin("microsoft")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-[#D6DEE5] rounded-xl hover:bg-[#F8FAFC] hover:border-[#B8C8D8] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z"/>
                  <path fill="#FFB900" d="M24 24H12.6V12.6H24V24z"/>
                  <path fill="#F25022" d="M11.4 11.4H0V0h11.4v11.4z"/>
                  <path fill="#7FBA00" d="M24 11.4H12.6V0H24v11.4z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleSSOLogin("apple")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white border border-[#D6DEE5] rounded-xl hover:bg-[#F8FAFC] hover:border-[#B8C8D8] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Footer links inside card */}
          <div className="mt-7 flex justify-center gap-3 text-sm">
            <a href="#" className="text-[#4a6580] hover:text-[#2d5ab0] hover:underline transition-colors">
              Privacy Policy
            </a>
            <span className="text-[#B8C8D8]">•</span>
            <a href="#" className="text-[#4a6580] hover:text-[#2d5ab0] hover:underline transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
        
        {/* Create account link */}
        <p className="text-center mt-7 text-sm">
          <span className="text-[#4a6580]">New here?</span>{" "}
          <button className="text-[#2d5ab0] font-semibold hover:underline transition-colors">
            Create an account
          </button>
        </p>
        
        {/* Copyright */}
        <p className="text-center mt-4 text-xs text-[#5A7080]">
          © 2024 <span style={{ fontFamily: "'Orbitron', sans-serif" }}>Soapbox</span>. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;