import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Rocket, ArrowLeft, Eye, Save, Upload,
  Wallet, PieChart, Timer, BarChart3, ShieldCheck,
  FileText, Users, Layout, HelpCircle, Globe,
  Layers, ChevronDown, Monitor, Tablet, Smartphone,
  Undo2, Redo2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";

import type { Block, ViewportMode } from "@/components/editor/types";
import { VIEWPORT_WIDTHS } from "@/components/editor/types";
import { createBlock } from "@/components/editor/blockDefaults";
import { useEditorHistory } from "@/components/editor/useEditorHistory";
import SortableBlockWrapper from "@/components/editor/SortableBlockWrapper";
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
  const { loading: subLoading, hasAccess } = useRequireSubscription();
  const { blocks, push, replace, undo, redo, canUndo, canRedo } = useEditorHistory([
    createBlock("hero"),
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!user || siteId === "new") {
      setSiteLoaded(true);
      return;
    }
    const loadSite = async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("content")
        .eq("id", siteId)
        .single();
      if (!error && data?.content && Array.isArray(data.content)) {
        replace(data.content as Block[]);
      }
      setSiteLoaded(true);
    };
    loadSite();
  }, [siteId, user, replace]);

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

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

  const handleInlineEdit = useCallback((blockId: string, field: string, value: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    updateBlockData(blockId, { ...block.data, [field]: value });
  }, [blocks, updateBlockData]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    updateBlocks(arrayMove(blocks, oldIndex, newIndex));
  }, [blocks, updateBlocks]);

  const handleSave = useCallback(async () => {
    if (!user) {
      toast.error("Please log in to save");
      return;
    }

    setSaving(true);
    try {
      if (siteId === "new") {
        const subdomain = "site-" + Date.now().toString(36);
        const { error } = await supabase
          .from("sites")
          .insert({
            name: (blocks.find(b => b.type === "hero")?.data?.headline) || "Untitled Site",
            subdomain,
            content: blocks as any,
            user_id: user.id,
          });
        if (error) throw error;
        toast.success("Site created!");
      } else {
        const { error } = await supabase
          .from("sites")
          .update({ content: blocks as any, updated_at: new Date().toISOString() })
          .eq("id", siteId);
        if (error) throw error;
        toast.success("Saved!");
      }
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }, [blocks, siteId, user]);

  const handlePublish = useCallback(async () => {
    if (!user) {
      toast.error("Please log in to publish");
      return;
    }

    setPublishing(true);
    try {
      let currentSiteId = siteId;
      const siteName = (blocks.find(b => b.type === "hero")?.data?.headline) || "Untitled Site";
      const subdomain = siteName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30) + "-" + Date.now().toString(36).slice(-4);

      if (siteId === "new") {
        const { data, error } = await supabase
          .from("sites")
          .insert({
            name: siteName,
            subdomain,
            content: blocks as any,
            user_id: user.id,
            published: true,
          })
          .select("id")
          .single();
        if (error) throw error;
        currentSiteId = data.id;
      } else {
        const { error } = await supabase
          .from("sites")
          .update({
            content: blocks as any,
            published: true,
            subdomain,
            updated_at: new Date().toISOString(),
          })
          .eq("id", siteId);
        if (error) throw error;
      }

      const liveUrl = `${subdomain}.launchpad3.io`;
      toast.success(
        <div className="space-y-1">
          <p className="font-semibold">Published! 🚀</p>
          <p className="text-xs text-muted-foreground">{liveUrl}</p>
        </div>,
        { duration: 8000 }
      );
    } catch (err: any) {
      toast.error(err.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  }, [blocks, siteId, user]);

  const web3Blocks = sidebarBlocks.filter((b) => b.category === "Web3");
  const standardBlocks = sidebarBlocks.filter((b) => b.category === "Standard");
  const viewportWidth = VIEWPORT_WIDTHS[viewport];

  if (subLoading || !hasAccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-[#222222] border-t-[#06b6d4]" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      <header className="h-[52px] border-b border-[#222222] bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-between px-3 md:px-4 flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] border border-[#222222]">
              <Rocket className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <span className="text-sm font-semibold text-white truncate">Editor</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 rounded-lg p-0.5 bg-[#111111] border border-[#222222]">
          {([
            { mode: "desktop" as const, icon: Monitor },
            { mode: "tablet" as const, icon: Tablet },
            { mode: "mobile" as const, icon: Smartphone },
          ]).map(({ mode, icon: Icon }) => (
            <Button
              key={mode}
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md transition-all ${
                viewport === mode ? "bg-[#1a1a1a] text-white shadow-sm" : "text-[#888888] hover:text-white"
              }`}
              onClick={() => setViewport(mode)}
            >
              <Icon className="w-3.5 h-3.5" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hidden sm:flex" onClick={undo} disabled={!canUndo} title="Undo">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hidden sm:flex" onClick={redo} disabled={!canRedo} title="Redo">
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex rounded-lg text-[#888888]">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="secondary" size="sm" className="rounded-lg font-medium" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? "..." : "Save"}
          </Button>
          <Button variant="gradient" size="sm" className="rounded-lg font-semibold" onClick={handlePublish} disabled={publishing}>
            <Upload className="w-4 h-4" />
            {publishing ? "..." : "Publish"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        <aside className="w-56 md:w-60 border-r border-[#222222] bg-[#0c0c0c] overflow-y-auto flex-shrink-0 p-3">
          <div className="mb-6">
            <h3 className="text-[10px] font-semibold text-[#666666] uppercase tracking-widest mb-3 px-1">Web3</h3>
            <div className="space-y-0.5">
              {web3Blocks.map((block) => (
                <button
                  key={block.type}
                  type="button"
                  onClick={() => addBlock(block.type)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#e5e5e5] hover:bg-[#161616] border border-transparent hover:border-[#2a2a2a] transition-all duration-200 group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#111111] border border-[#222222] group-hover:border-[#333333] group-hover:shadow-[0_0_16px_-4px_rgba(6,182,212,0.25)] transition-all">
                    <block.icon className="w-4 h-4 text-[#06b6d4]" />
                  </span>
                  <span className="text-left font-medium truncate">{block.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-semibold text-[#666666] uppercase tracking-widest mb-3 px-1">Standard</h3>
            <div className="space-y-0.5">
              {standardBlocks.map((block) => (
                <button
                  key={block.type}
                  type="button"
                  onClick={() => addBlock(block.type)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#e5e5e5] hover:bg-[#161616] border border-transparent hover:border-[#2a2a2a] transition-all duration-200 group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#111111] border border-[#222222] group-hover:border-[#333333] group-hover:shadow-[0_0_16px_-4px_rgba(124,58,237,0.2)] transition-all">
                    <block.icon className="w-4 h-4 text-[#a78bfa]" />
                  </span>
                  <span className="text-left font-medium truncate">{block.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main
          className="flex-1 overflow-y-auto bg-[#050505] dot-grid p-4 md:p-6 transition-colors duration-300"
          onClick={() => setSelectedId(null)}
        >
          <div
            className={`mx-auto transition-all duration-500 ease-out ${
              viewport === "mobile"
                ? "border-[12px] border-[#222222] rounded-[2.5rem] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.9)] bg-black overflow-hidden"
                : "rounded-xl border border-[#222222] bg-[#0a0a0a] shadow-[0_24px_48px_-32px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            }`}
            style={{
              maxWidth: viewport === "mobile" ? viewportWidth + 24 : viewportWidth,
              ...(viewport === "mobile" ? { minHeight: 700 } : {}),
            }}
          >
            {/* Phone notch for mobile */}
            {viewport === "mobile" && (
              <div className="flex justify-center py-2 bg-[#111111]">
                <div className="w-24 h-5 bg-[#222222] rounded-full" />
              </div>
            )}
            <div className={`space-y-4 ${viewport === "mobile" ? "" : "p-4 md:p-6"}`}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block, index) => (
                    <SortableBlockWrapper
                      key={block.id}
                      block={block}
                      index={index}
                      total={blocks.length}
                      isSelected={selectedId === block.id}
                      onSelect={() => setSelectedId(block.id)}
                      onMoveUp={() => moveBlock(block.id, -1)}
                      onMoveDown={() => moveBlock(block.id, 1)}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onDelete={() => removeBlock(block.id)}
                      onInlineEdit={(field, value) => handleInlineEdit(block.id, field, value)}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {blocks.length === 0 && (
                <div className="text-center py-24">
                  <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Click blocks from the sidebar to add them</p>
                </div>
              )}
            </div>
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
