import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PaymentModal from "@/components/PaymentModal";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 29,
    features: [
      "1 site",
      "All Web3 blocks",
      "Subdomain hosting",
    ],
    cta: "Start Free Trial",
    featured: false,
    contactSales: false,
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    features: [
      "5 sites",
      "All Web3 blocks",
      "Custom domain",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
    contactSales: false,
  },
  {
    name: "Agency",
    monthlyPrice: 199,
    features: [
      "Unlimited sites",
      "All Web3 blocks",
      "White-label",
      "Custom domain",
      "API access",
    ],
    cta: "Contact Sales",
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

  const handlePlanClick = (plan: typeof plans[0]) => {
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
    <section id="pricing" className="py-24 relative">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            14-day free trial on all plans. No credit card required.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-full px-2 py-1.5">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !isAnnual
                  ? "gradient-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isAnnual
                  ? "gradient-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs opacity-80">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const price = getPrice(plan.monthlyPrice);
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-lg p-6 flex flex-col ${
                  plan.featured
                    ? "glass glow-primary border border-primary/30"
                    : "glass"
                }`}
              >
                {plan.featured && (
                  <div className="text-xs font-semibold gradient-primary rounded-full px-3 py-1 w-fit mb-4 text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="mt-3 mb-1">
                  <span className="text-4xl font-bold text-foreground">
                    €{price}
                  </span>
                  <span className="text-muted-foreground">
                    {isAnnual ? "/yr" : "/mo"}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-xs text-primary">
                    Save €{Math.round(plan.monthlyPrice * 12 * 0.2)}/year
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-6 mt-1">
                  {plan.contactSales
                    ? "For agencies and studios at scale."
                    : "14-day free trial included."}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.featured ? "gradient" : "outline"}
                  className="w-full"
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.cta}
                </Button>
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
