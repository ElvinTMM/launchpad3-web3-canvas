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
  onInlineEdit?: (field: string, value: string) => void;
  dragListeners?: Record<string, any>;
}

const BlockWrapper = memo(({
  block, index, total, isSelected, onSelect,
  onMoveUp, onMoveDown, onDuplicate, onDelete,
  onInlineEdit, dragListeners,
}: Props) => {
  return (
    <div
      className={`rounded-xl relative group cursor-pointer transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-[#7c3aed]/50 bg-[#111111] border border-[#333333] shadow-[0_0_24px_-8px_rgba(124,58,237,0.25)]"
          : "bg-[#111111]/80 border border-[#222222] hover:border-[#333333] hover:shadow-[0_0_20px_-8px_rgba(0,0,0,0.5)]"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag handle - grip (⠿) on hover */}
      <div
        className="absolute -left-9 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-grab active:cursor-grabbing"
        {...dragListeners}
      >
        <div className="h-7 w-7 flex items-center justify-center bg-[#161616] border border-[#222222] rounded-lg text-[#888888] text-sm font-bold select-none">
          ⠿
        </div>
      </div>

      {/* Hover controls */}
      <div className="absolute -right-11 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-[#161616] border border-[#222222] rounded-lg" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={index === 0}>
          <ChevronUp className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-[#161616] border border-[#222222] rounded-lg" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={index === total - 1}>
          <ChevronDown className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-[#161616] border border-[#222222] rounded-lg" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
          <Copy className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 bg-[#161616] border border-[#222222] rounded-lg text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Label */}
      <div className="absolute top-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-medium text-[#888888] bg-[#0c0c0c]/90 px-1.5 py-0.5 rounded border border-[#222222]">{block.label}</span>
      </div>

      <BlockPreview block={block} onInlineEdit={onInlineEdit} />
    </div>
  );
});

BlockWrapper.displayName = "BlockWrapper";
export default BlockWrapper;
