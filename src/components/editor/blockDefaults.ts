import type { Block } from "./types";

const defaults: Record<string, Record<string, any>> = {
  hero: {
    headline: "Your Project Name",
    subheadline: "The future of decentralized finance",
    buttonText: "Get Started",
    buttonColor: "#7c3aed",
    bgColor: "",
    bgImage: "",
  },
  roadmap: {
    items: [
      { quarter: "Q1 2026", status: "done" },
      { quarter: "Q2 2026", status: "active" },
      { quarter: "Q3 2026", status: "upcoming" },
    ],
  },
  countdown: {
    launchDate: new Date(Date.now() + 30 * 86400000).toISOString(),
  },
  tokenomics: {
    segments: [
      { label: "Team", percentage: 20, color: "hsl(263, 70%, 58%)" },
      { label: "Sale", percentage: 40, color: "hsl(187, 92%, 42%)" },
      { label: "Liquidity", percentage: 40, color: "hsl(160, 84%, 39%)" },
    ],
  },
  team: {
    members: [
      { name: "Name", role: "Founder", photoUrl: "", twitter: "" },
      { name: "Name", role: "CTO", photoUrl: "", twitter: "" },
      { name: "Name", role: "CMO", photoUrl: "", twitter: "" },
    ],
  },
  metrics: {
    contractAddress: "",
    network: "ETH",
  },
  audit: {
    badges: [
      { auditor: "Certik", reportUrl: "" },
      { auditor: "Hacken", reportUrl: "" },
    ],
  },
  footer: {
    copyright: "© 2026 Your Project. All rights reserved.",
    twitter: "",
    discord: "",
    telegram: "",
  },
  features: {
    items: ["Fast", "Secure", "Scalable"],
  },
  faq: {
    items: [
      { question: "What is this project?", answer: "A Web3 project." },
      { question: "How do I buy tokens?", answer: "Through our dApp." },
    ],
  },
  wallet: {
    wallets: ["MetaMask", "Coinbase", "WalletConnect"],
  },
  whitepaper: {
    buttonText: "Read Whitepaper",
    url: "",
  },
};

const blockLabels: Record<string, string> = {
  hero: "Hero Section",
  features: "Features Grid",
  faq: "FAQ Accordion",
  footer: "Footer",
  wallet: "Connect Wallet",
  tokenomics: "Tokenomics Chart",
  roadmap: "Roadmap Timeline",
  countdown: "Countdown Timer",
  metrics: "Token Metrics",
  audit: "Audit Badges",
  whitepaper: "Whitepaper",
  team: "Team Cards",
};

export function createBlock(type: string): Block {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    type,
    label: blockLabels[type] || type,
    data: JSON.parse(JSON.stringify(defaults[type] || {})),
  };
}

export { defaults as blockDefaults, blockLabels };
