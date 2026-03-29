import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative">
        <div className="absolute inset-0 raycast-grid opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#06b6d4]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[400px] mx-auto px-4 relative z-10 text-center">
          <div className="auth-card-border">
            <div className="rounded-[11px] bg-[#111111] border border-[#1a1a1a] p-10 space-y-5">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#161616] border border-[#222222] flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#06b6d4]" />
              </div>
              <h1 className="text-xl font-semibold text-white leading-snug">Check your email to confirm your account</h1>
              <p className="text-[#888888] text-sm leading-relaxed">
                We sent a confirmation email to <span className="text-white font-medium">{email}</span>. Click the link, then sign in.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full h-11 rounded-lg font-medium mt-2">
                  Go to sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      <div className="absolute inset-0 raycast-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#7c3aed]/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] border border-[#222222]">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">LaunchPad3</span>
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-[#888888] mt-2">14-day free trial · No card required</p>
        </div>

        <div className="auth-card-border">
          <form onSubmit={handleSignup} className="rounded-[11px] bg-[#111111] border border-[#1a1a1a] p-8 space-y-5">
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
              {loading ? "Creating account..." : "Start free trial"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[#888888] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#06b6d4] font-medium hover:underline">
            Sign in
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

export default Signup;
