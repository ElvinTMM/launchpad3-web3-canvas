import { createConfig, http } from "wagmi";
import { mainnet, bsc, polygon, base } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

const WALLETCONNECT_PROJECT_ID = "f456c1a3a156fa401463b7d0ee899d5e";

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
