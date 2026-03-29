import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PaymentModal from "@/components/PaymentModal";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";

const SettingsPage = () => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { loading, hasAccess } = useRequireSubscription();

  if (loading || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-[#222222] border-t-[#06b6d4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#222222] bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] border border-[#222222]">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Settings</span>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="surface-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Site Settings</h2>
          <div className="space-y-2">
            <Label className="text-[#a3a3a3]">Site Name</Label>
            <Input placeholder="My DeFi Project" />
          </div>
          <div className="space-y-2">
            <Label className="text-[#a3a3a3]">Subdomain</Label>
            <div className="flex items-center gap-2">
              <Input placeholder="myproject" />
              <span className="text-sm text-[#666666] whitespace-nowrap">.launchpad3.io</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#a3a3a3]">Custom Domain</Label>
            <Input placeholder="www.yourproject.com" />
          </div>
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Subscription</h2>
          <p className="text-sm text-[#888888]">
            You are on the <span className="text-[#06b6d4] font-medium">Free Trial</span> — upgrade anytime.
          </p>
          <Button variant="gradient" className="rounded-lg font-semibold" onClick={() => setPaymentOpen(true)}>Upgrade plan</Button>
        </div>
      </main>

      <PaymentModal open={paymentOpen} onOpenChange={setPaymentOpen} preselectedPlan="Pro" preselectedPrice={79} />
    </div>
  );
};

export default SettingsPage;
