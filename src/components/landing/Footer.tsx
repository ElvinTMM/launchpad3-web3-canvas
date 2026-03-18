import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">LaunchPad3</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 LaunchPad3. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
