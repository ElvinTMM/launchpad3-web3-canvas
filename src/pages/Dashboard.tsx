import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Settings, Rocket, LogOut, LayoutTemplate } from "lucide-react";
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
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      const sub = subs?.[0];

      if (!sub) {
        navigate("/pricing");
        return;
      }

      if (sub.plan === "trial") {
        const trialEnd = sub.trial_ends_at ? new Date(sub.trial_ends_at) : null;
        if (trialEnd && trialEnd < new Date()) {
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
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#222222] bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] border border-[#222222]">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">LaunchPad3</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {trialDaysLeft !== null && !isPaidPlan && (
        <div className="border-b border-[#222222] bg-[#111111] py-2.5 px-4 text-center text-sm">
          <span className="text-[#e5e5e5]">
            Free trial: <strong className="text-white">{trialDaysLeft} days</strong> left.{" "}
          </span>
          <Link to="/pricing" className="text-[#06b6d4] font-medium hover:underline">
            Upgrade
          </Link>
        </div>
      )}

      <main className="container max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Your sites</h1>
            <p className="text-[#888888] mt-1 text-sm">Manage and publish Web3 landing pages</p>
          </div>
          <Link to="/editor/new">
            <Button variant="gradient" className="rounded-lg font-semibold">
              <Plus className="w-4 h-4" />
              New site
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-9 w-9 border-2 border-[#222222] border-t-[#06b6d4]" />
          </div>
        ) : sites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-[#222222] bg-[#111111] p-12 md:p-16 text-center max-w-xl mx-auto"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#161616] border border-[#222222]">
              <LayoutTemplate className="w-10 h-10 text-[#444444]" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No sites yet</h2>
            <p className="text-[#888888] text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Create your first landing page — drag blocks, connect wallets, and publish in minutes.
            </p>
            <Link to="/editor/new">
              <Button variant="gradient" size="lg" className="rounded-lg font-semibold px-8">
                <Plus className="w-4 h-4" />
                Create your first site
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sites.map((site, i) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="group rounded-xl border border-[#222222] bg-[#111111] overflow-hidden hover-glow-card"
              >
                <div className="relative h-40 bg-[#0a0a0a] border-b border-[#222222] overflow-hidden">
                  <div className="absolute inset-0 dot-grid opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
                  <div className="absolute inset-4 rounded-lg border border-[#222222] bg-[#111111]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 shadow-sm">
                    <p className="text-xs font-medium text-[#666666] mb-1 truncate w-full text-center">Preview</p>
                    <p className="text-sm font-semibold text-white truncate w-full text-center">{site.name}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white truncate">{site.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 ${
                        site.published ? "bg-[#06b6d4]/20 text-[#06b6d4]" : "bg-[#333333] text-[#888888]"
                      }`}
                    >
                      {site.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] mb-4 truncate">
                    {site.subdomain}.launchpad3.io · {formatDate(site.updated_at)}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/editor/${site.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full rounded-lg font-medium">
                        Edit
                      </Button>
                    </Link>
                    {site.published && (
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/editor/new">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sites.length * 0.05, duration: 0.35 }}
                className="rounded-xl border border-dashed border-[#333333] bg-transparent min-h-[280px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#444444] hover:bg-[#0c0c0c] transition-all duration-300 group"
              >
                <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] group-hover:border-[#333333] group-hover:shadow-[0_0_24px_-8px_rgba(124,58,237,0.2)] transition-all">
                  <Plus className="w-6 h-6 text-[#666666] group-hover:text-[#888888]" />
                </div>
                <p className="text-sm font-medium text-[#888888] group-hover:text-white transition-colors">New site</p>
              </motion.div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
