import { createConfig, http } from "wagmi";
import { mainnet, bsc, polygon, base } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim();
if (!projectId) {
  console.error("WalletConnect Project ID is missing! Add VITE_WALLETCONNECT_PROJECT_ID to .env");
}
export const WALLETCONNECT_PROJECT_ID = projectId || "c4f79cc821944d9680842e34466bfbd0";

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, polygon, base],
  connectors: [
    injected(),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
    coinbaseWallet({ appName: "LaunchPad3" }),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});

createWeb3Modal({
  wagmiConfig,
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [base],
  defaultChain: base,
});
