import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2 } from "lucide-react";
import type { Block } from "./types";

interface Props {
  block: Block;
  onChange: (data: Record<string, any>) => void;
  onClose: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export default function PropertyPanel({ block, onChange, onClose }: Props) {
  const d = block.data;
  const set = (key: string, value: any) => onChange({ ...d, [key]: value });

  const renderFields = () => {
    switch (block.type) {
      case "hero":
        return (
          <>
            <Field label="Headline"><Input value={d.headline || ""} onChange={(e) => set("headline", e.target.value)} /></Field>
            <Field label="Subheadline"><Input value={d.subheadline || ""} onChange={(e) => set("subheadline", e.target.value)} /></Field>
            <Field label="Button Text"><Input value={d.buttonText || ""} onChange={(e) => set("buttonText", e.target.value)} /></Field>
            <Field label="Button Color"><Input type="color" value={d.buttonColor || "#7c3aed"} onChange={(e) => set("buttonColor", e.target.value)} className="h-10 w-full" /></Field>
            <Field label="Background Color"><Input type="color" value={d.bgColor || "#0a0a12"} onChange={(e) => set("bgColor", e.target.value)} className="h-10 w-full" /></Field>
            <Field label="Background Image URL"><Input value={d.bgImage || ""} onChange={(e) => set("bgImage", e.target.value)} placeholder="https://..." /></Field>
          </>
        );

      case "roadmap":
        return (
          <>
            {(d.items || []).map((item: any, i: number) => (
              <div key={i} className="glass rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Phase {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    const items = [...d.items];
                    items.splice(i, 1);
                    set("items", items);
                  }}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <Input value={item.quarter} onChange={(e) => {
                  const items = [...d.items];
                  items[i] = { ...items[i], quarter: e.target.value };
                  set("items", items);
                }} placeholder="Q1 2026" />
                <Select value={item.status} onValueChange={(v) => {
                  const items = [...d.items];
                  items[i] = { ...items[i], status: v };
                  set("items", items);
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => set("items", [...(d.items || []), { quarter: "Q? 2026", status: "upcoming" }])}>
              <Plus className="w-3 h-3 mr-1" /> Add Phase
            </Button>
          </>
        );

      case "countdown":
        return (
          <Field label="Launch Date & Time">
            <Input type="datetime-local" value={d.launchDate ? new Date(d.launchDate).toISOString().slice(0, 16) : ""} onChange={(e) => set("launchDate", new Date(e.target.value).toISOString())} />
          </Field>
        );

      case "tokenomics":
        return (
          <>
            {(d.segments || []).map((seg: any, i: number) => (
              <div key={i} className="glass rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Segment {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    const segs = [...d.segments];
                    segs.splice(i, 1);
                    set("segments", segs);
                  }}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <Input value={seg.label} onChange={(e) => {
                  const segs = [...d.segments];
                  segs[i] = { ...segs[i], label: e.target.value };
                  set("segments", segs);
                }} placeholder="Label" />
                <Input type="number" value={seg.percentage} onChange={(e) => {
                  const segs = [...d.segments];
                  segs[i] = { ...segs[i], percentage: Number(e.target.value) };
                  set("segments", segs);
                }} placeholder="%" />
                <Input type="color" value={seg.color || "#7c3aed"} onChange={(e) => {
                  const segs = [...d.segments];
                  segs[i] = { ...segs[i], color: e.target.value };
                  set("segments", segs);
                }} className="h-8 w-full" />
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => set("segments", [...(d.segments || []), { label: "New", percentage: 10, color: "#7c3aed" }])}>
              <Plus className="w-3 h-3 mr-1" /> Add Segment
            </Button>
          </>
        );

      case "team":
        return (
          <>
            {(d.members || []).map((m: any, i: number) => (
              <div key={i} className="glass rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Member {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    const members = [...d.members];
                    members.splice(i, 1);
                    set("members", members);
                  }}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <Input value={m.name} onChange={(e) => {
                  const members = [...d.members];
                  members[i] = { ...members[i], name: e.target.value };
                  set("members", members);
                }} placeholder="Name" />
                <Input value={m.role} onChange={(e) => {
                  const members = [...d.members];
                  members[i] = { ...members[i], role: e.target.value };
                  set("members", members);
                }} placeholder="Role" />
                <Input value={m.photoUrl} onChange={(e) => {
                  const members = [...d.members];
                  members[i] = { ...members[i], photoUrl: e.target.value };
                  set("members", members);
                }} placeholder="Photo URL" />
                <Input value={m.twitter} onChange={(e) => {
                  const members = [...d.members];
                  members[i] = { ...members[i], twitter: e.target.value };
                  set("members", members);
                }} placeholder="@twitter" />
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => set("members", [...(d.members || []), { name: "Name", role: "Role", photoUrl: "", twitter: "" }])}>
              <Plus className="w-3 h-3 mr-1" /> Add Member
            </Button>
          </>
        );

      case "metrics":
        return (
          <>
            <Field label="Contract Address"><Input value={d.contractAddress || ""} onChange={(e) => set("contractAddress", e.target.value)} placeholder="0x..." /></Field>
            <Field label="Network">
              <Select value={d.network || "ETH"} onValueChange={(v) => set("network", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">Ethereum</SelectItem>
                  <SelectItem value="BSC">BSC</SelectItem>
                  <SelectItem value="Polygon">Polygon</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        );

      case "audit":
        return (
          <>
            {(d.badges || []).map((b: any, i: number) => (
              <div key={i} className="glass rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Badge {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    const badges = [...d.badges];
                    badges.splice(i, 1);
                    set("badges", badges);
                  }}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <Select value={b.auditor} onValueChange={(v) => {
                  const badges = [...d.badges];
                  badges[i] = { ...badges[i], auditor: v };
                  set("badges", badges);
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certik">Certik</SelectItem>
                    <SelectItem value="Hacken">Hacken</SelectItem>
                    <SelectItem value="OpenZeppelin">OpenZeppelin</SelectItem>
                    <SelectItem value="Trail of Bits">Trail of Bits</SelectItem>
                    <SelectItem value="Consensys Diligence">Consensys</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={b.reportUrl || ""} onChange={(e) => {
                  const badges = [...d.badges];
                  badges[i] = { ...badges[i], reportUrl: e.target.value };
                  set("badges", badges);
                }} placeholder="Report URL" />
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => set("badges", [...(d.badges || []), { auditor: "Certik", reportUrl: "" }])}>
              <Plus className="w-3 h-3 mr-1" /> Add Badge
            </Button>
          </>
        );

      case "footer":
        return (
          <>
            <Field label="Copyright Text"><Input value={d.copyright || ""} onChange={(e) => set("copyright", e.target.value)} /></Field>
            <Field label="Twitter URL"><Input value={d.twitter || ""} onChange={(e) => set("twitter", e.target.value)} placeholder="https://twitter.com/..." /></Field>
            <Field label="Discord URL"><Input value={d.discord || ""} onChange={(e) => set("discord", e.target.value)} placeholder="https://discord.gg/..." /></Field>
            <Field label="Telegram URL"><Input value={d.telegram || ""} onChange={(e) => set("telegram", e.target.value)} placeholder="https://t.me/..." /></Field>
          </>
        );

      case "features":
        return (
          <>
            {(d.items || []).map((item: string, i: number) => (
              <div key={i} className="flex gap-2">
                <Input value={item} onChange={(e) => {
                  const items = [...d.items];
                  items[i] = e.target.value;
                  set("items", items);
                }} />
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => {
                  const items = [...d.items];
                  items.splice(i, 1);
                  set("items", items);
                }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => set("items", [...(d.items || []), "New Feature"])}>
              <Plus className="w-3 h-3 mr-1" /> Add Feature
            </Button>
          </>
        );

      case "faq":
        return (
          <>
            {(d.items || []).map((item: any, i: number) => (
              <div key={i} className="glass rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">FAQ {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    const items = [...d.items];
                    items.splice(i, 1);
                    set("items", items);
                  }}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <Input value={item.question} onChange={(e) => {
                  const items = [...d.items];
                  items[i] = { ...items[i], question: e.target.value };
                  set("items", items);
                }} placeholder="Question" />
                <Textarea value={item.answer} onChange={(e) => {
                  const items = [...d.items];
                  items[i] = { ...items[i], answer: e.target.value };
                  set("items", items);
                }} placeholder="Answer" rows={2} />
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => set("items", [...(d.items || []), { question: "New question?", answer: "Answer here." }])}>
              <Plus className="w-3 h-3 mr-1" /> Add FAQ
            </Button>
          </>
        );

      case "wallet":
        return (
          <>
            {(d.wallets || []).map((w: string, i: number) => (
              <div key={i} className="flex gap-2">
                <Input value={w} onChange={(e) => {
                  const wallets = [...d.wallets];
                  wallets[i] = e.target.value;
                  set("wallets", wallets);
                }} />
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => {
                  const wallets = [...d.wallets];
                  wallets.splice(i, 1);
                  set("wallets", wallets);
                }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => set("wallets", [...(d.wallets || []), "New Wallet"])}>
              <Plus className="w-3 h-3 mr-1" /> Add Wallet
            </Button>
          </>
        );

      case "whitepaper":
        return (
          <>
            <Field label="Button Text"><Input value={d.buttonText || ""} onChange={(e) => set("buttonText", e.target.value)} /></Field>
            <Field label="PDF URL"><Input value={d.url || ""} onChange={(e) => set("url", e.target.value)} placeholder="https://..." /></Field>
          </>
        );

      default:
        return <p className="text-sm text-muted-foreground">No editable properties for this block.</p>;
    }
  };

  return (
    <aside className="w-80 border-l border-border bg-card/50 flex flex-col flex-shrink-0 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">{block.label}</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {renderFields()}
      </div>
    </aside>
  );
}
