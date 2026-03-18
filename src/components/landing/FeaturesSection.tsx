import { motion } from "framer-motion";
import {
  Wallet,
  PieChart,
  Timer,
  BarChart3,
  ShieldCheck,
  FileText,
  Users,
  Layout,
  HelpCircle,
  Globe,
} from "lucide-react";

const blocks = [
  { icon: Wallet, title: "Connect Wallet", desc: "MetaMask, Coinbase, WalletConnect support", color: "text-primary" },
  { icon: PieChart, title: "Tokenomics Chart", desc: "Editable pie chart with labels & percentages", color: "text-accent" },
  { icon: Timer, title: "Countdown Timer", desc: "IDO, mint, or launch date countdown", color: "text-primary" },
  { icon: BarChart3, title: "Live Token Metrics", desc: "Price, holders, market cap via CoinGecko", color: "text-accent" },
  { icon: ShieldCheck, title: "Audit Badges", desc: "Certik, Hacken, SlowMist verification", color: "text-success" },
  { icon: FileText, title: "Whitepaper Viewer", desc: "Upload PDF, inline viewer", color: "text-primary" },
  { icon: Users, title: "Team Cards", desc: "Avatar, role, social links", color: "text-accent" },
  { icon: Layout, title: "Hero Section", desc: "Headline, CTA, background image", color: "text-primary" },
  { icon: HelpCircle, title: "FAQ Accordion", desc: "Collapsible Q&A section", color: "text-accent" },
  { icon: Globe, title: "Custom Domain", desc: "your-project.launchpad3.io", color: "text-primary" },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Web3-Native <span className="gradient-text">Building Blocks</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to launch a professional crypto project page.
            Just drag, drop, and publish.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-lg p-5 hover:border-primary/30 transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-secondary">
                  <block.icon className={`w-5 h-5 ${block.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{block.title}</h3>
                  <p className="text-sm text-muted-foreground">{block.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
