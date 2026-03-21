import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Settings, Rocket, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Site = Tables<"sites">;

const Dashboard = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  const [isPaidPlan, setIsPaidPlan] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      // Check subscription
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      const sub = subs?.[0];

      if (!sub) {
        // No subscription at all → pricing
        navigate("/pricing");
        return;
      }

      if (sub.plan === "trial") {
        const trialEnd = sub.trial_ends_at ? new Date(sub.trial_ends_at) : null;
        if (trialEnd && trialEnd < new Date()) {
          // Trial expired
          navigate("/pricing");
          return;
        }
        if (trialEnd) {
          const days = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          setTrialDaysLeft(Math.max(0, days));
        }
      } else if (sub.status !== "active") {
        navigate("/pricing");
        return;
      } else {
        setIsPaidPlan(true);
      }

      // Load sites
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) {
        toast.error("Failed to load sites");
      } else {
        setSites(data || []);
      }
      setLoading(false);
    };

    loadData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border glass-strong sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">LaunchPad3</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/settings">
              <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Trial banner */}
      {trialDaysLeft !== null && !isPaidPlan && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center text-sm">
          <span className="text-foreground">
            🎉 Free trial: <strong>{trialDaysLeft} days remaining</strong>.{" "}
          </span>
          <Link to="/pricing" className="text-primary font-medium hover:underline">
            Upgrade to keep access →
          </Link>
        </div>
      )}

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Sites</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your Web3 landing pages</p>
          </div>
          <Link to="/editor/new">
            <Button variant="gradient"><Plus className="w-4 h-4" />New Site</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site, i) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-150 group"
              >
                <div className="h-36 dot-grid flex items-center justify-center bg-secondary/30">
                  <Rocket className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">{site.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${site.published ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {site.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {site.subdomain}.launchpad3.io · Updated {formatDate(site.updated_at)}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/editor/${site.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">Edit</Button>
                    </Link>
                    {site.published && (
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/editor/new">
              <div className="glass rounded-lg h-full min-h-[240px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/30 transition-all duration-150 border-dashed">
                <div className="p-3 rounded-full bg-secondary">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Create new site</p>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
