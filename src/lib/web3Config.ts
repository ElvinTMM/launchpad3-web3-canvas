import { createConfig, http } from "wagmi";
import { mainnet, bsc, polygon } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// Replace with your WalletConnect Cloud project ID from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = "DEMO_PROJECT_ID";

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, polygon],
  connectors: [
    injected(),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
    coinbaseWallet({ appName: "LaunchPad3" }),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
  },
});
