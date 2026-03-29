import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
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
  { icon: Wallet, title: "Connect Wallet", desc: "MetaMask, Coinbase, WalletConnect", glow: "cyan" as const },
  { icon: PieChart, title: "Tokenomics", desc: "Editable charts & percentages", glow: "purple" as const },
  { icon: Timer, title: "Countdown", desc: "IDO & launch timers", glow: "blue" as const },
  { icon: BarChart3, title: "Live metrics", desc: "Price, holders, market cap", glow: "cyan" as const },
  { icon: ShieldCheck, title: "Audit badges", desc: "Certik, Hacken, and more", glow: "purple" as const },
  { icon: FileText, title: "Whitepaper", desc: "PDF viewer in-page", glow: "blue" as const },
  { icon: Users, title: "Team cards", desc: "Avatars & social links", glow: "cyan" as const },
  { icon: Layout, title: "Hero blocks", desc: "Headlines & CTAs", glow: "purple" as const },
  { icon: HelpCircle, title: "FAQ", desc: "Collapsible Q&A", glow: "blue" as const },
  { icon: Globe, title: "Custom domain", desc: "your-project.launchpad3.io", glow: "cyan" as const },
];

const glowStyles = {
  cyan: "shadow-[0_0_24px_-4px_rgba(6,182,212,0.45)] group-hover:shadow-[0_0_32px_-2px_rgba(6,182,212,0.55)]",
  purple: "shadow-[0_0_24px_-4px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_32px_-2px_rgba(124,58,237,0.5)]",
  blue: "shadow-[0_0_24px_-4px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_32px_-2px_rgba(59,130,246,0.5)]",
};

const iconColors = {
  cyan: "text-[#06b6d4]",
  purple: "text-[#a78bfa]",
  blue: "text-[#60a5fa]",
};

function FeatureCard({
  block,
  index,
}: {
  block: (typeof blocks)[0];
  index: number;
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "group rounded-xl bg-[#0D0D0D] p-6 cursor-default transition-all duration-500",
        "border border-white/[0.06]",
        "hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(124,58,237,0.35),0_0_32px_-8px_rgba(6,182,212,0.18),0_20px_40px_-28px_rgba(0,0,0,0.65)]",
        "section-fade-in",
        isVisible && "is-visible"
      )}
      style={{ transitionDelay: isVisible ? `${index * 45}ms` : undefined }}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "feature-icon-wrap h-12 w-12 shrink-0 rounded-xl border border-white/[0.08] bg-[#111111]",
            glowStyles[block.glow]
          )}
        >
          <block.icon className={cn("relative z-10 h-5 w-5", iconColors[block.glow])} />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1.5 tracking-tight">{block.title}</h3>
          <p className="text-sm text-[#888888] leading-relaxed font-normal">{block.desc}</p>
        </div>
      </div>
    </div>
  );
}

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-28 md:py-36 relative bg-[#000000] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(124,58,237,0.09),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] bg-[radial-gradient(circle_at_50%_80%,rgba(6,182,212,0.06),transparent_55%)]" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 section-fade-in is-visible">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Web3-native <span className="gradient-text">blocks</span>
          </h2>
          <p className="text-[#888888] text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Everything you need to ship a credible landing page — drag, drop, publish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {blocks.map((block, i) => (
            <FeatureCard key={block.title} block={block} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
