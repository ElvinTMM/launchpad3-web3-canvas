import { memo } from "react";
import {
  Wallet, PieChart, ChevronDown, ShieldCheck, FileText,
  Layers, Layout,
} from "lucide-react";
import type { Block } from "./types";

interface Props {
  block: Block;
}

const BlockPreview = memo(({ block }: Props) => {
  const d = block.data;

  const previews: Record<string, React.ReactNode> = {
    hero: (
      <div className="text-center py-12 px-6" style={{ backgroundColor: d.bgColor || undefined }}>
        <h2 className="text-2xl font-bold text-foreground mb-2">{d.headline || "Your Project Name"}</h2>
        <p className="text-muted-foreground text-sm mb-4">{d.subheadline || "Subheadline"}</p>
        <div className="inline-block gradient-primary px-6 py-2 rounded text-sm text-primary-foreground font-medium" style={{ backgroundColor: d.buttonColor || undefined }}>
          {d.buttonText || "Get Started"}
        </div>
      </div>
    ),
    wallet: (
      <div className="flex justify-center py-8">
        <div className="glass rounded-lg p-4 w-64 space-y-2">
          <p className="text-sm font-medium text-foreground text-center mb-3">Connect Wallet</p>
          {(d.wallets || ["MetaMask", "Coinbase", "WalletConnect"]).map((w: string) => (
            <div key={w} className="flex items-center gap-3 p-2 rounded bg-secondary hover:bg-secondary/80">
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
        <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground flex-wrap">
          {(d.segments || []).map((s: any, i: number) => (
            <span key={i} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label} {s.percentage}%
            </span>
          ))}
        </div>
      </div>
    ),
    countdown: (() => {
      const target = d.launchDate ? new Date(d.launchDate).getTime() : Date.now() + 86400000;
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      return (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Token Launch In</p>
          <div className="flex justify-center gap-3">
            {[{ v: String(days).padStart(2, "0"), l: "Days" }, { v: String(hours).padStart(2, "0"), l: "Hours" }, { v: String(mins).padStart(2, "0"), l: "Min" }, { v: String(secs).padStart(2, "0"), l: "Sec" }].map((t) => (
              <div key={t.l} className="glass rounded-lg p-3 w-16 text-center">
                <div className="text-xl font-bold text-foreground">{t.v}</div>
                <div className="text-xs text-muted-foreground">{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      );
    })(),
    roadmap: (
      <div className="py-8 px-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Roadmap</h3>
        <div className="space-y-3 max-w-sm mx-auto">
          {(d.items || []).map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-3 glass rounded p-3">
              <div className={`w-2 h-2 rounded-full ${r.status === "done" ? "bg-success" : r.status === "active" ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className="text-sm font-medium text-foreground flex-1">{r.quarter}</span>
              <span className={`text-xs ${r.status === "done" ? "text-success" : r.status === "active" ? "text-primary" : "text-muted-foreground"}`}>
                {r.status === "done" ? "Done" : r.status === "active" ? "Active" : "Upcoming"}
              </span>
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
        {d.contractAddress && (
          <p className="text-xs text-muted-foreground text-center mt-3 truncate max-w-md mx-auto">
            {d.network}: {d.contractAddress}
          </p>
        )}
      </div>
    ),
    team: (
      <div className="py-8 px-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Team</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          {(d.members || []).map((m: any, i: number) => (
            <div key={i} className="glass rounded-lg p-4 text-center w-28">
              {m.photoUrl ? (
                <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full mx-auto mb-2 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary mx-auto mb-2" />
              )}
              <div className="text-xs font-medium text-foreground">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    audit: (
      <div className="py-8 flex justify-center gap-4 flex-wrap">
        {(d.badges || []).map((a: any, i: number) => (
          <div key={i} className="glass rounded-lg px-4 py-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-foreground">{a.auditor}</span>
          </div>
        ))}
      </div>
    ),
    features: (
      <div className="py-8 px-6 grid grid-cols-3 gap-3 max-w-lg mx-auto">
        {(d.items || ["Fast", "Secure", "Scalable"]).map((f: string, i: number) => (
          <div key={i} className="glass rounded-lg p-4 text-center">
            <Layers className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-xs font-medium text-foreground">{f}</div>
          </div>
        ))}
      </div>
    ),
    faq: (
      <div className="py-8 px-6 max-w-md mx-auto space-y-2">
        {(d.items || []).map((q: any, i: number) => (
          <div key={i} className="glass rounded p-3 flex items-center justify-between">
            <span className="text-sm text-foreground">{q.question}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    ),
    footer: (
      <div className="py-6 px-6 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">{d.copyright || "© 2026 Your Project"}</p>
      </div>
    ),
    whitepaper: (
      <div className="py-8 flex justify-center">
        <div className="gradient-primary px-6 py-3 rounded flex items-center gap-2 text-sm font-medium text-primary-foreground">
          <FileText className="w-4 h-4" />
          {d.buttonText || "Read Whitepaper"}
        </div>
      </div>
    ),
  };

  return previews[block.type] || (
    <div className="py-12 text-center text-muted-foreground text-sm">{block.label}</div>
  );
});

BlockPreview.displayName = "BlockPreview";
export default BlockPreview;
