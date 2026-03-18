import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  ArrowLeft,
  Eye,
  Save,
  Upload,
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
  Layers,
  GripVertical,
  X,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Block {
  id: string;
  type: string;
  label: string;
  icon: React.ElementType;
}

const blockLibrary = [
  { type: "hero", label: "Hero Section", icon: Layout, category: "Standard" },
  { type: "features", label: "Features Grid", icon: Layers, category: "Standard" },
  { type: "faq", label: "FAQ Accordion", icon: HelpCircle, category: "Standard" },
  { type: "footer", label: "Footer", icon: Globe, category: "Standard" },
  { type: "wallet", label: "Connect Wallet", icon: Wallet, category: "Web3" },
  { type: "tokenomics", label: "Tokenomics Chart", icon: PieChart, category: "Web3" },
  { type: "roadmap", label: "Roadmap Timeline", icon: ChevronDown, category: "Web3" },
  { type: "countdown", label: "Countdown Timer", icon: Timer, category: "Web3" },
  { type: "metrics", label: "Token Metrics", icon: BarChart3, category: "Web3" },
  { type: "audit", label: "Audit Badges", icon: ShieldCheck, category: "Web3" },
  { type: "whitepaper", label: "Whitepaper", icon: FileText, category: "Web3" },
  { type: "team", label: "Team Cards", icon: Users, category: "Web3" },
];

const BlockPreview = ({ block, onRemove }: { block: Block; onRemove: () => void }) => {
  const previewContent: Record<string, React.ReactNode> = {
    hero: (
      <div className="text-center py-12 px-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Project Name</h2>
        <p className="text-muted-foreground text-sm mb-4">The future of decentralized finance</p>
        <div className="inline-block gradient-primary px-6 py-2 rounded text-sm text-primary-foreground font-medium">Get Started</div>
      </div>
    ),
    wallet: (
      <div className="flex justify-center py-8">
        <div className="glass rounded-lg p-4 w-64 space-y-2">
          <p className="text-sm font-medium text-foreground text-center mb-3">Connect Wallet</p>
          {["MetaMask", "Coinbase", "WalletConnect"].map((w) => (
            <div key={w} className="flex items-center gap-3 p-2 rounded bg-secondary hover:bg-secondary/80 cursor-pointer">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{w}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    tokenomics: (
      <div className="py-8 px-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tokenomics</h3>
        <div className="w-32 h-32 mx-auto rounded-full border-8 border-primary/30 relative">
          <div className="absolute inset-2 rounded-full border-8 border-accent/30" />
          <div className="absolute inset-4 rounded-full border-8 border-success/30" />
        </div>
        <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Team 20%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />Sale 40%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" />Liquidity 40%</span>
        </div>
      </div>
    ),
    countdown: (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">Token Launch In</p>
        <div className="flex justify-center gap-3">
          {[{ v: "12", l: "Days" }, { v: "08", l: "Hours" }, { v: "42", l: "Min" }, { v: "17", l: "Sec" }].map((t) => (
            <div key={t.l} className="glass rounded-lg p-3 w-16 text-center">
              <div className="text-xl font-bold text-foreground">{t.v}</div>
              <div className="text-xs text-muted-foreground">{t.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    roadmap: (
      <div className="py-8 px-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Roadmap</h3>
        <div className="space-y-3 max-w-sm mx-auto">
          {[
            { q: "Q1 2026", s: "Done", c: "text-success" },
            { q: "Q2 2026", s: "Active", c: "text-primary" },
            { q: "Q3 2026", s: "Upcoming", c: "text-muted-foreground" },
          ].map((r) => (
            <div key={r.q} className="flex items-center gap-3 glass rounded p-3">
              <div className={`w-2 h-2 rounded-full ${r.c === "text-success" ? "bg-success" : r.c === "text-primary" ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/30"}`} />
              <span className="text-sm font-medium text-foreground flex-1">{r.q}</span>
              <span className={`text-xs ${r.c}`}>{r.s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    metrics: (
      <div className="py-8 px-6">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {[{ l: "Price", v: "$0.042" }, { l: "Holders", v: "12,847" }, { l: "Market Cap", v: "$4.2M" }].map((m) => (
            <div key={m.l} className="glass rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground">{m.l}</div>
              <div className="text-lg font-bold text-foreground">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    team: (
      <div className="py-8 px-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Team</h3>
        <div className="flex justify-center gap-4">
          {["Founder", "CTO", "CMO"].map((role) => (
            <div key={role} className="glass rounded-lg p-4 text-center w-28">
              <div className="w-10 h-10 rounded-full bg-secondary mx-auto mb-2" />
              <div className="text-xs font-medium text-foreground">Name</div>
              <div className="text-xs text-muted-foreground">{role}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    audit: (
      <div className="py-8 flex justify-center gap-4">
        {["Certik", "Hacken"].map((a) => (
          <div key={a} className="glass rounded-lg px-4 py-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-foreground">{a}</span>
          </div>
        ))}
      </div>
    ),
    features: (
      <div className="py-8 px-6 grid grid-cols-3 gap-3 max-w-lg mx-auto">
        {["Fast", "Secure", "Scalable"].map((f) => (
          <div key={f} className="glass rounded-lg p-4 text-center">
            <Layers className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-xs font-medium text-foreground">{f}</div>
          </div>
        ))}
      </div>
    ),
    faq: (
      <div className="py-8 px-6 max-w-md mx-auto space-y-2">
        {["What is this project?", "How do I buy tokens?"].map((q) => (
          <div key={q} className="glass rounded p-3 flex items-center justify-between">
            <span className="text-sm text-foreground">{q}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    ),
    footer: (
      <div className="py-6 px-6 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">© 2026 Your Project. All rights reserved.</p>
      </div>
    ),
    whitepaper: (
      <div className="py-8 flex justify-center">
        <div className="gradient-primary px-6 py-3 rounded flex items-center gap-2 text-sm font-medium text-primary-foreground">
          <FileText className="w-4 h-4" />
          Read Whitepaper
        </div>
      </div>
    ),
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="glass rounded-lg relative group"
    >
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-destructive/10 hover:bg-destructive/20"
      >
        <X className="w-3 h-3 text-destructive" />
      </button>
      <div className="text-xs font-medium text-muted-foreground absolute top-2 left-8 opacity-0 group-hover:opacity-100 transition-opacity">
        {block.label}
      </div>
      {previewContent[block.type] || (
        <div className="py-12 text-center text-muted-foreground text-sm">{block.label}</div>
      )}
    </motion.div>
  );
};

const Editor = () => {
  const [canvasBlocks, setCanvasBlocks] = useState<Block[]>([
    { id: "1", type: "hero", label: "Hero Section", icon: Layout },
  ]);

  const addBlock = useCallback((type: string, label: string, icon: React.ElementType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      label,
      icon,
    };
    setCanvasBlocks((prev) => [...prev, newBlock]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setCanvasBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const web3Blocks = blockLibrary.filter((b) => b.category === "Web3");
  const standardBlocks = blockLibrary.filter((b) => b.category === "Standard");

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Editor header */}
      <header className="h-14 border-b border-border glass-strong flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">My Project</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast.success("Saved!")}>
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="gradient" size="sm" onClick={() => toast.success("Published!")}>
            <Upload className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border bg-card/50 overflow-y-auto flex-shrink-0 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Web3 Blocks
            </h3>
            <div className="space-y-1">
              {web3Blocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type, block.label, block.icon)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-foreground hover:bg-secondary transition-colors duration-150 group"
                >
                  <block.icon className="w-4 h-4 text-primary group-hover:scale-105 transition-transform" />
                  {block.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Standard Blocks
            </h3>
            <div className="space-y-1">
              {standardBlocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type, block.label, block.icon)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-foreground hover:bg-secondary transition-colors duration-150 group"
                >
                  <block.icon className="w-4 h-4 text-accent group-hover:scale-105 transition-transform" />
                  {block.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto dot-grid p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {canvasBlocks.map((block) => (
                <BlockPreview key={block.id} block={block} onRemove={() => removeBlock(block.id)} />
              ))}
            </AnimatePresence>

            {canvasBlocks.length === 0 && (
              <div className="text-center py-24">
                <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Click blocks from the sidebar to add them</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Editor;
