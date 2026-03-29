import { motion } from "framer-motion";

const SocialProofSection = () => {
  return (
    <section className="py-16 border-y border-white/[0.06] bg-[#000000] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(6,182,212,0.04),transparent)]" />
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-medium text-[#666666] uppercase tracking-widest mb-3">Trusted by builders</p>
          <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Join <span className="gradient-text">500+</span> Web3 projects
          </p>
          <p className="text-[#888888] mt-3 max-w-lg mx-auto text-sm md:text-base">
            From DeFi protocols to NFT drops — teams ship faster with LaunchPad3.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-10 opacity-40">
            {["Base", "Arbitrum", "Polygon", "Solana"].map((name) => (
              <span key={name} className="text-sm font-semibold text-[#666666] tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
