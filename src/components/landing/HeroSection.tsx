import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Play, Blocks, LayoutGrid, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroPattern = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden>
    <defs>
      <pattern id="hero-dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.12)" />
      </pattern>
      <linearGradient id="hero-pattern-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
        <stop offset="45%" stopColor="white" stopOpacity="0.15" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <mask id="hero-pattern-mask">
        <rect width="100%" height="100%" fill="url(#hero-pattern-fade)" />
      </mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#hero-dot-grid)" mask="url(#hero-pattern-mask)" />
  </svg>
);

const ShootingStars = () => (
  <>
    <div
      className="shooting-star"
      style={{ top: "12%", right: "8%", animationDelay: "0s", animationDuration: "5s" }}
    />
    <div
      className="shooting-star"
      style={{ top: "22%", right: "25%", animationDelay: "1.2s", animationDuration: "6s" }}
    />
    <div
      className="shooting-star"
      style={{ top: "8%", right: "40%", animationDelay: "2.5s", animationDuration: "4.5s" }}
    />
    <div
      className="shooting-star opacity-70"
      style={{ top: "18%", right: "55%", animationDelay: "3.8s", animationDuration: "5.5s" }}
    />
  </>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden pt-24 pb-24 md:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-[#000000]" />

      {/* Animated gradient mesh blobs */}
      <div className="hero-blob hero-blob-1 -left-[20%] top-[5%] md:left-[5%]" />
      <div className="hero-blob hero-blob-2 right-[-15%] top-[25%] md:right-[8%]" />
      <div className="hero-blob hero-blob-3 left-[15%] bottom-[10%] md:left-[25%]" />
      <div className="hero-blob hero-blob-4 right-[20%] top-[45%] hidden md:block" />

      <HeroPattern />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.12),transparent)]" />

      <ShootingStars />

      <div className="container relative z-10 text-center max-w-4xl mx-auto px-4 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-[#0D0D0D]/80 text-sm font-medium text-[#a3a3a3] mb-8 backdrop-blur-sm shadow-[0_0_0_1px_rgba(124,58,237,0.08)]">
            <Sparkles className="w-4 h-4 text-[#06b6d4]" />
            <span>The Web3 landing page builder</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.08]">
            Ship a{" "}
            <span className="text-shimmer-hero inline-block">stunning</span>
            <br />
            Web3 page in minutes
          </h1>

          <p className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Drag-and-drop blocks, wallet connect, tokenomics, and more — built for teams who care about craft.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/signup">
              <Button variant="hero" size="lg" className="h-12 px-8 rounded-lg min-w-[180px] hover-glow-button">
                <Rocket className="w-5 h-5" />
                Start for free
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 rounded-lg min-w-[180px] border-white/[0.08] bg-[#0D0D0D] hover:bg-[#141414]"
              >
                <Play className="w-4 h-4" />
                See demo
              </Button>
            </Link>
          </div>

          <p className="text-sm text-[#666666] mt-6">14-day trial · No card required</p>
        </motion.div>

        {/* Floating product mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 w-full max-w-5xl mx-auto"
        >
          <div className="relative mockup-float rounded-xl p-[1px] bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent mockup-glow">
            <div className="rounded-[11px] bg-[#0a0a0a] overflow-hidden border border-white/[0.06]">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0D0D0D]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs font-medium text-[#666666] font-mono truncate px-2">
                    editor · myproject.launchpad3.io
                  </span>
                </div>
                <LayoutGrid className="w-4 h-4 text-[#444444] shrink-0" />
              </div>
              <div className="grid grid-cols-[180px_1fr] min-h-[300px] md:min-h-[380px]">
                <div className="border-r border-white/[0.06] bg-[#080808] p-3 space-y-1 hidden sm:block">
                  {["Hero", "Wallet", "Tokenomics", "Roadmap", "Footer"].map((label, i) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                        i === 0
                          ? "bg-[#141414] text-white border border-white/[0.08]"
                          : "text-[#666666] hover:text-[#888888]"
                      }`}
                    >
                      <Blocks className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      {label}
                    </div>
                  ))}
                </div>
                <div className="relative dot-grid opacity-50 flex flex-col items-center justify-center p-8">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#7c3aed]/8 to-transparent pointer-events-none" />
                  <div className="relative w-full max-w-md rounded-xl border border-white/[0.08] bg-[#0D0D0D]/95 p-8 shadow-2xl backdrop-blur-sm">
                    <p className="text-shimmer-hero text-2xl md:text-3xl font-semibold text-center mb-3">Your headline here</p>
                    <p className="text-center text-sm text-[#888888] mb-6">Subheadline and value prop</p>
                    <div className="flex justify-center">
                      <div className="h-10 px-8 rounded-lg gradient-primary text-white text-sm font-semibold flex items-center shadow-lg">
                        Connect wallet
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
