import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Blocks } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/10 blur-[100px]" />

      <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Blocks className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              The Web3 Landing Page Builder
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Build Your{" "}
            <span className="gradient-text">Web3 Project</span>
            <br />
            Landing Page in Minutes
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Drag-and-drop builder with native Web3 blocks. Tokenomics charts,
            wallet connect, roadmap timelines — all pre-built and customizable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="hero" size="lg" className="h-12 px-8">
                <Rocket className="w-5 h-5" />
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="h-12 px-8">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            14-day free trial · No credit card required
          </p>
        </motion.div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 glass rounded-lg p-1 glow-primary"
        >
          <div className="bg-card rounded-md overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="text-xs text-muted-foreground ml-2">myproject.launchpad3.io</span>
            </div>
            <div className="h-64 md:h-80 dot-grid flex items-center justify-center">
              <div className="text-center">
                <Blocks className="w-12 h-12 text-primary mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm">Your landing page preview</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
