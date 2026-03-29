import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireSubscription() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading && !user) {
        navigate("/login");
        setLoading(false);
      }
      return;
    }

    const check = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      const sub = data?.[0];
      if (!sub) {
        navigate("/pricing");
        setLoading(false);
        return;
      }

      if (sub.plan === "trial") {
        const trialEnd = sub.trial_ends_at ? new Date(sub.trial_ends_at) : null;
        if (trialEnd && trialEnd < new Date()) {
          navigate("/pricing");
          setLoading(false);
          return;
        }
      } else if (sub.status !== "active") {
        navigate("/pricing");
        setLoading(false);
        return;
      }

      setHasAccess(true);
      setLoading(false);
    };

    check();
  }, [user, authLoading, navigate]);

  return { loading, hasAccess };
}
