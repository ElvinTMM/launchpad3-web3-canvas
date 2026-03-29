import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[#222222] bg-[#0c0c0c] px-3 py-2 text-base text-white ring-offset-black placeholder:text-[#666666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed]/40 focus-visible:border-[#333333] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
