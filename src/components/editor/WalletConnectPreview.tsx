import { Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export default function WalletConnectPreview() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex justify-center py-8">
        <div className="glass rounded-lg p-4 w-64 space-y-3">
          <p className="text-sm font-medium text-foreground text-center">Wallet Connected</p>
          <div className="p-2 rounded bg-success/10 text-success text-xs text-center truncate">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={(e) => { e.stopPropagation(); disconnect(); }}
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <div className="glass rounded-lg p-4 w-64 space-y-2">
        <p className="text-sm font-medium text-foreground text-center mb-3">Connect Wallet</p>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={(e) => {
              e.stopPropagation();
              connect({ connector });
            }}
            disabled={isPending}
            className="w-full flex items-center gap-3 p-2 rounded bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">
              {connector.name}
            </span>
          </button>
        ))}
        {isPending && (
          <p className="text-xs text-muted-foreground text-center mt-2">Connecting...</p>
        )}
      </div>
    </div>
  );
}
