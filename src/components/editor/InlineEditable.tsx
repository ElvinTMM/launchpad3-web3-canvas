import { useRef, useCallback, KeyboardEvent } from "react";

interface Props {
  value: string;
  field: string;
  onSave: (field: string, value: string) => void;
  className?: string;
  tag?: "h2" | "h3" | "p" | "span" | "div";
  style?: React.CSSProperties;
}

export default function InlineEditable({ value, field, onSave, className = "", tag: Tag = "span", style }: Props) {
  const ref = useRef<HTMLElement>(null);

  const handleBlur = useCallback(() => {
    const text = ref.current?.innerText || "";
    if (text !== value) {
      onSave(field, text);
    }
  }, [field, value, onSave]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  }, []);

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      className={`outline-none focus:ring-1 focus:ring-primary/50 focus:bg-primary/5 rounded px-1 -mx-1 cursor-text ${className}`}
      style={style}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </Tag>
  );
}
