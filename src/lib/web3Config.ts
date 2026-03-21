import { createConfig, http } from "wagmi";
import { mainnet, bsc, polygon, base } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "c4f79cc821944d9680842e34466bfbd0";

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
