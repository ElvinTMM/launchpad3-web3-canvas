import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";

const Navbar = () => {
  const hidden = useNavbarScroll();

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 navbar-frosted transition-transform duration-500 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c3aed]/25 to-[#06b6d4]/20 border border-white/[0.08] transition-all group-hover:border-[#7c3aed]/40 group-hover:shadow-[0_0_28px_-4px_rgba(124,58,237,0.45)]">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-[15px] tracking-tight">LaunchPad3</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#888888]">
          <a href="#features" className="hover:text-white transition-colors duration-200">
            Features
          </a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-medium">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="gradient" size="sm" className="font-semibold px-4 hover-glow-button">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
