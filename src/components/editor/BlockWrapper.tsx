import { memo } from "react";
import { ChevronUp, ChevronDown, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Block } from "./types";
import BlockPreview from "./BlockPreview";

interface Props {
  block: Block;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const BlockWrapper = memo(({
  block, index, total, isSelected, onSelect,
  onMoveUp, onMoveDown, onDuplicate, onDelete,
}: Props) => {
  return (
    <div
      className={`rounded-lg relative group cursor-pointer transition-all duration-150 ${
        isSelected
          ? "ring-2 ring-primary glass"
          : "glass hover:ring-1 hover:ring-border"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Hover controls */}
      <div className="absolute -right-11 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-card border border-border" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={index === 0}>
          <ChevronUp className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-card border border-border" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={index === total - 1}>
          <ChevronDown className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-card border border-border" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
          <Copy className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-card border border-border text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Label */}
      <div className="absolute top-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-medium text-muted-foreground bg-card/80 px-1.5 py-0.5 rounded">{block.label}</span>
      </div>

      <BlockPreview block={block} />
    </div>
  );
});

BlockWrapper.displayName = "BlockWrapper";
export default BlockWrapper;
