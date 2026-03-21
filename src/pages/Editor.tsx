import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Rocket, ArrowLeft, Eye, Save, Upload,
  Wallet, PieChart, Timer, BarChart3, ShieldCheck,
  FileText, Users, Layout, HelpCircle, Globe,
  Layers, ChevronDown, Monitor, Tablet, Smartphone,
  Undo2, Redo2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Reorder, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import type { Block, ViewportMode } from "@/components/editor/types";
import { VIEWPORT_WIDTHS } from "@/components/editor/types";
import { createBlock } from "@/components/editor/blockDefaults";
import { useEditorHistory } from "@/components/editor/useEditorHistory";
import BlockWrapper from "@/components/editor/BlockWrapper";
import PropertyPanel from "@/components/editor/PropertyPanel";

const sidebarBlocks = [
  { type: "wallet", label: "Connect Wallet", icon: Wallet, category: "Web3" },
  { type: "tokenomics", label: "Tokenomics Chart", icon: PieChart, category: "Web3" },
  { type: "roadmap", label: "Roadmap Timeline", icon: ChevronDown, category: "Web3" },
  { type: "countdown", label: "Countdown Timer", icon: Timer, category: "Web3" },
  { type: "metrics", label: "Token Metrics", icon: BarChart3, category: "Web3" },
  { type: "audit", label: "Audit Badges", icon: ShieldCheck, category: "Web3" },
  { type: "whitepaper", label: "Whitepaper", icon: FileText, category: "Web3" },
  { type: "team", label: "Team Cards", icon: Users, category: "Web3" },
  { type: "hero", label: "Hero Section", icon: Layout, category: "Standard" },
  { type: "features", label: "Features Grid", icon: Layers, category: "Standard" },
  { type: "faq", label: "FAQ Accordion", icon: HelpCircle, category: "Standard" },
  { type: "footer", label: "Footer", icon: Globe, category: "Standard" },
];

const Editor = () => {
  const { id: siteId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { blocks, push, undo, redo, canUndo, canRedo } = useEditorHistory([
    createBlock("hero"),
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [saving, setSaving] = useState(false);

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  const updateBlocks = useCallback((newBlocks: Block[]) => {
    push(newBlocks);
  }, [push]);

  const addBlock = useCallback((type: string) => {
    const newBlock = createBlock(type);
    updateBlocks([...blocks, newBlock]);
    setSelectedId(newBlock.id);
  }, [blocks, updateBlocks]);

  const removeBlock = useCallback((id: string) => {
    updateBlocks(blocks.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [blocks, updateBlocks, selectedId]);

  const duplicateBlock = useCallback((id: string) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const orig = blocks[idx];
    const dup: Block = {
      ...JSON.parse(JSON.stringify(orig)),
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    };
    const next = [...blocks];
    next.splice(idx + 1, 0, dup);
    updateBlocks(next);
    setSelectedId(dup.id);
  }, [blocks, updateBlocks]);

  const moveBlock = useCallback((id: string, dir: -1 | 1) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[target]] = [next[target], next[idx]];
    updateBlocks(next);
  }, [blocks, updateBlocks]);

  const updateBlockData = useCallback((id: string, data: Record<string, any>) => {
    updateBlocks(blocks.map((b) => (b.id === id ? { ...b, data } : b)));
  }, [blocks, updateBlocks]);

  const handleReorder = useCallback((newOrder: Block[]) => {
    updateBlocks(newOrder);
  }, [updateBlocks]);

  const handleSave = useCallback(async () => {
    if (!siteId || !user) {
      toast.error("Please log in to save");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("sites")
        .update({ content: blocks as any, updated_at: new Date().toISOString() })
        .eq("id", siteId);
      if (error) throw error;
      toast.success("Saved!");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }, [blocks, siteId, user]);

  const web3Blocks = sidebarBlocks.filter((b) => b.category === "Web3");
  const standardBlocks = sidebarBlocks.filter((b) => b.category === "Standard");

  const viewportWidth = VIEWPORT_WIDTHS[viewport];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border glass-strong flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Editor</span>
          </div>
        </div>

        {/* Viewport toggle */}
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {([
            { mode: "desktop" as const, icon: Monitor },
            { mode: "tablet" as const, icon: Tablet },
            { mode: "mobile" as const, icon: Smartphone },
          ]).map(({ mode, icon: Icon }) => (
            <Button
              key={mode}
              variant={viewport === mode ? "default" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewport(mode)}
            >
              <Icon className="w-3.5 h-3.5" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="gradient" size="sm" onClick={() => toast.success("Published!")}>
            <Upload className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar – block library */}
        <aside className="w-60 border-r border-border bg-card/50 overflow-y-auto flex-shrink-0 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Web3 Blocks</h3>
            <div className="space-y-1">
              {web3Blocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-foreground hover:bg-secondary transition-colors group"
                >
                  <block.icon className="w-4 h-4 text-primary group-hover:scale-105 transition-transform" />
                  {block.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Standard</h3>
            <div className="space-y-1">
              {standardBlocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-foreground hover:bg-secondary transition-colors group"
                >
                  <block.icon className="w-4 h-4 text-accent group-hover:scale-105 transition-transform" />
                  {block.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <main
          className="flex-1 overflow-y-auto dot-grid p-6"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="mx-auto transition-all duration-300 space-y-4"
            style={{ maxWidth: viewportWidth }}
          >
            <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="space-y-4">
              {blocks.map((block, index) => (
                <Reorder.Item key={block.id} value={block} className="list-none">
                  <BlockWrapper
                    block={block}
                    index={index}
                    total={blocks.length}
                    isSelected={selectedId === block.id}
                    onSelect={() => setSelectedId(block.id)}
                    onMoveUp={() => moveBlock(block.id, -1)}
                    onMoveDown={() => moveBlock(block.id, 1)}
                    onDuplicate={() => duplicateBlock(block.id)}
                    onDelete={() => removeBlock(block.id)}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {blocks.length === 0 && (
              <div className="text-center py-24">
                <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Click blocks from the sidebar to add them</p>
              </div>
            )}
          </div>
        </main>

        {/* Right panel – property editor */}
        {selectedBlock && (
          <PropertyPanel
            block={selectedBlock}
            onChange={(data) => updateBlockData(selectedBlock.id, data)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
