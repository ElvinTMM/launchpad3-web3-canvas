import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "€29",
    period: "/mo",
    desc: "Perfect for solo founders launching their first project.",
    features: ["1 site", "All Web3 blocks", "Custom subdomain", "Basic analytics", "Email support"],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Pro",
    price: "€79",
    period: "/mo",
    desc: "For teams managing multiple project launches.",
    features: ["5 sites", "All Web3 blocks", "Custom domain", "Advanced analytics", "Priority support", "Remove branding"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Agency",
    price: "€199",
    period: "/mo",
    desc: "Unlimited sites for agencies and studios.",
    features: ["Unlimited sites", "All Web3 blocks", "Custom domains", "White-label", "API access", "Dedicated support"],
    cta: "Start Free Trial",
    featured: false,
  },
];

const PricingSection = () => {
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
          <p className="text-muted-foreground text-lg">
            14-day free trial on all plans. No credit card required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-lg p-6 flex flex-col ${
                plan.featured
                  ? "glass glow-primary border-primary/30"
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
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button
                  variant={plan.featured ? "gradient" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
