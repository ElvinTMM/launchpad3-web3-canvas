import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Please confirm your email first. Check your inbox.");
        await supabase.auth.resend({ type: "signup", email });
      } else {
        toast.error(error.message);
      }
      return;
    }
    if (data.user && !data.user.email_confirmed_at) {
      toast.error("Please confirm your email first. Check your inbox.");
      await supabase.auth.signOut();
      await supabase.auth.resend({ type: "signup", email });
      return;
    }
    toast.success("Logged in successfully");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      <div className="absolute inset-0 raycast-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-b from-[#7c3aed]/8 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-[400px] mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] border border-[#222222]">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">LaunchPad3</span>
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-[#888888] mt-2">Sign in with email and password</p>
        </div>

        <div className="auth-card-border">
          <form onSubmit={handleLogin} className="rounded-[11px] bg-[#111111] border border-[#1a1a1a] p-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#a3a3a3] text-sm font-medium">
                Email
              </Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#a3a3a3] text-sm font-medium">
                Password
              </Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="gradient" className="w-full h-11 rounded-lg font-semibold mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[#888888] mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-[#06b6d4] font-medium hover:underline">
            Sign up
          </Link>
        </p>

        <Link
          to="/"
          className="flex items-center justify-center gap-1.5 text-sm text-[#666666] mt-8 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default Login;
