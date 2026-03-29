import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#111111] group-[.toaster]:text-white group-[.toaster]:border-[#222222] group-[.toaster]:shadow-xl",
          description: "group-[.toast]:text-[#888888]",
          actionButton: "group-[.toast]:bg-[#7c3aed] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-[#222222] group-[.toast]:text-[#888888]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
