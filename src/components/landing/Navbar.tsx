import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground text-lg">LaunchPad3</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="gradient" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
