import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PaymentModal from "@/components/PaymentModal";
import { cn } from "@/lib/utils";

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

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const getPrice = (monthlyPrice: number) => {
    if (isAnnual) {
      return Math.round(monthlyPrice * 12 * 0.8);
    }
    return monthlyPrice;
  };

  const handlePlanClick = (plan: (typeof plans)[0]) => {
    if (plan.contactSales) {
      window.location.href = "mailto:sales@launchpad3.io?subject=Agency Plan Inquiry";
      return;
    }

    if (!user) {
      navigate("/signup");
      return;
    }

    const price = getPrice(plan.monthlyPrice);
    setSelectedPlan(plan.name);
    setSelectedPrice(price);
    setPaymentOpen(true);
  };

  return (
    <section id="pricing" className="py-28 md:py-36 relative bg-[#000000] border-t border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(124,58,237,0.07),transparent_55%)]" />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Simple <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-[#888888] text-lg mb-8 max-w-xl mx-auto">
            14-day trial on every plan. Pay with card or crypto.
          </p>

          <div className="inline-flex items-center p-1 rounded-full border border-white/[0.08] bg-[#0D0D0D]">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                !isAnnual ? "gradient-primary text-white shadow-lg" : "text-[#888888] hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                isAnnual ? "gradient-primary text-white shadow-lg" : "text-[#888888] hover:text-white"
              )}
            >
              Annual
              <span className="ml-1.5 text-xs opacity-90">−20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {plans.map((plan, i) => {
            const price = getPrice(plan.monthlyPrice);
            const inner = (
              <>
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="badge-popular inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2 flex-wrap pt-1">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  {!plan.contactSales && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-[#080808] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#888888]">
                      <Coins className="w-3 h-3 text-[#06b6d4]" />
                      Pay with USDC
                    </span>
                  )}
                </div>
                <div className="mt-2 mb-1">
                  <span className="text-4xl font-semibold text-white tracking-tight">€{price}</span>
                  <span className="text-[#888888] ml-1">{isAnnual ? "/yr" : "/mo"}</span>
                </div>
                {isAnnual && !plan.contactSales && (
                  <p className="text-xs text-[#06b6d4] mb-2">Save €{Math.round(plan.monthlyPrice * 12 * 0.2)}/year</p>
                )}
                <p className="text-sm text-[#888888] mb-8 min-h-[40px]">
                  {plan.contactSales ? "For agencies at scale." : "Includes full editor & hosting."}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#e5e5e5]">
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
              </>
            );

            if (plan.featured) {
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative md:scale-[1.03] z-10 pricing-pro-glow rounded-[14px]"
                >
                  <div className="pricing-pro-shell h-full">
                    <div className="pricing-pro-inner flex flex-col p-8 relative">{inner}</div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "relative flex flex-col rounded-xl p-8 bg-[#0D0D0D] border border-white/[0.06] pricing-card-lift"
                )}
              >
                {inner}
              </motion.div>
            );
          })}
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        preselectedPlan={selectedPlan}
        preselectedPrice={selectedPrice}
        isAnnual={isAnnual}
      />
    </section>
  );
};

export default PricingSection;
