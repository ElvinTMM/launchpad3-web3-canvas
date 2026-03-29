import { useRef, useCallback, useState, KeyboardEvent, useEffect } from "react";

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
  const [editing, setEditing] = useState(false);

  const handleBlur = useCallback(() => {
    const text = ref.current?.innerText?.trim() ?? "";
    if (text !== value) {
      onSave(field, text || value);
    }
    setEditing(false);
  }, [field, value, onSave]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  }, []);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  }, []);

  if (editing) {
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

  return (
    <Tag
      className={`rounded px-1 -mx-1 cursor-text hover:bg-primary/5 hover:ring-1 hover:ring-primary/30 ${className}`}
      style={style}
      onClick={handleClick}
    >
      {value}
    </Tag>
  );
}
