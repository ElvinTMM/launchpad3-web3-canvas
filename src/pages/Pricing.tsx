import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Rocket, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PaymentModal from "@/components/PaymentModal";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 29,
    features: ["1 site", "All Web3 blocks", "Subdomain hosting"],
    cta: "Start free trial",
    featured: false,
    contactSales: false,
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    features: ["5 sites", "All Web3 blocks", "Custom domain", "Priority support"],
    cta: "Start free trial",
    featured: true,
    contactSales: false,
  },
  {
    name: "Agency",
    monthlyPrice: 199,
    features: ["Unlimited sites", "White-label", "Custom domain", "API access"],
    cta: "Contact sales",
    featured: false,
    contactSales: true,
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const { user } = useAuth();

  const getPrice = (monthlyPrice: number) => {
    return isAnnual ? Math.round(monthlyPrice * 12 * 0.8) : monthlyPrice;
  };

  const handlePlanClick = (plan: (typeof plans)[0]) => {
    if (plan.contactSales) {
      window.location.href = "mailto:sales@launchpad3.io?subject=Agency Plan Inquiry";
      return;
    }
    setSelectedPlan(plan.name);
    setSelectedPrice(plan.monthlyPrice);
    setPaymentOpen(true);
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
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-14"
        >
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
            Choose your <span className="gradient-text">plan</span>
          </h1>
          <p className="text-[#888888] text-lg mb-10 max-w-xl mx-auto">
            Select a plan to access your dashboard. Pay with card or USDC on Base.
          </p>

          <div className="inline-flex items-center p-1 rounded-full border border-[#222222] bg-[#111111]">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual ? "gradient-primary text-white shadow-lg" : "text-[#888888] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isAnnual ? "gradient-primary text-white shadow-lg" : "text-[#888888] hover:text-white"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs">−20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => {
            const price = getPrice(plan.monthlyPrice);
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`relative flex flex-col rounded-xl p-8 ${
                  plan.featured
                    ? "bg-[#111111] border-2 border-[#7c3aed]/40 shadow-[0_0_60px_-12px_rgba(124,58,237,0.25)] z-10"
                    : "surface-card hover-glow-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {!plan.contactSales && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#333333] bg-[#0c0c0c] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#888888]">
                      <Coins className="w-3 h-3 text-[#06b6d4]" />
                      USDC
                    </span>
                  )}
                </div>
                <div className="mt-2 mb-1">
                  <span className="text-4xl font-semibold">€{price}</span>
                  <span className="text-[#888888] ml-1">{isAnnual ? "/yr" : "/mo"}</span>
                </div>
                {isAnnual && !plan.contactSales && (
                  <p className="text-xs text-[#06b6d4] mb-2">Save €{Math.round(plan.monthlyPrice * 12 * 0.2)}/year</p>
                )}
                <p className="text-sm text-[#888888] mb-8 min-h-[40px]">
                  {plan.contactSales ? "For agencies at scale." : "14-day trial included."}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#e5e5e5]">
                      <Check className="w-4 h-4 text-[#06b6d4] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.featured ? "gradient" : "outline"}
                  className="w-full h-11 rounded-lg font-semibold"
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </main>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        preselectedPlan={selectedPlan}
        preselectedPrice={selectedPrice}
        isAnnual={isAnnual}
      />
    </div>
  );
};

export default Pricing;
