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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/dashboard" },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setShowConfirmation(true);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-accent/10 blur-[120px]" />

        <div className="w-full max-w-sm mx-auto px-4 relative z-10 text-center">
          <div className="glass rounded-lg p-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
            <p className="text-muted-foreground">
              We sent a confirmation link to <span className="text-foreground font-medium">{email}</span>.
              Please verify your email to continue.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full mt-4">Go to Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-accent/10 blur-[120px]" />

      <div className="w-full max-w-sm mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Rocket className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-foreground">LaunchPad3</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start your 14-day free trial</p>
        </div>

        <form onSubmit={handleSignup} className="glass rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Start Free Trial"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>

        <Link to="/" className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default Signup;
