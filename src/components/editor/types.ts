export interface HeroData {
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonColor: string;
  bgColor: string;
  bgImage: string;
}

export interface RoadmapItem {
  quarter: string;
  status: "done" | "active" | "upcoming";
}

export interface RoadmapData {
  items: RoadmapItem[];
}

export interface CountdownData {
  launchDate: string; // ISO string
}

export interface TokenomicsSegment {
  label: string;
  percentage: number;
  color: string;
}

export interface TokenomicsData {
  segments: TokenomicsSegment[];
}

export interface TeamMember {
  name: string;
  role: string;
  photoUrl: string;
  twitter: string;
}

export interface TeamData {
  members: TeamMember[];
}

export interface MetricsData {
  contractAddress: string;
  network: "ETH" | "BSC" | "Polygon";
}

export interface AuditBadge {
  auditor: string;
  reportUrl: string;
}

export interface AuditData {
  badges: AuditBadge[];
}

export interface FooterData {
  copyright: string;
  twitter: string;
  discord: string;
  telegram: string;
}

export interface FeaturesData {
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  items: FaqItem[];
}

export interface WalletData {
  wallets: string[];
}

export interface WhitepaperData {
  buttonText: string;
  url: string;
}

export type BlockData =
  | HeroData
  | RoadmapData
  | CountdownData
  | TokenomicsData
  | TeamData
  | MetricsData
  | AuditData
  | FooterData
  | FeaturesData
  | FaqData
  | WalletData
  | WhitepaperData;

export interface Block {
  id: string;
  type: string;
  label: string;
  data: Record<string, any>;
}

export type ViewportMode = "desktop" | "tablet" | "mobile";

export const VIEWPORT_WIDTHS: Record<ViewportMode, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};
