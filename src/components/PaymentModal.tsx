import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, encodeFunctionData } from "viem";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Check, Loader2 } from "lucide-react";
import { injected } from "wagmi/connectors";

const PLANS = [
  { name: "Starter", price: 29, features: ["1 site", "All Web3 blocks", "Custom subdomain"] },
  { name: "Pro", price: 79, features: ["5 sites", "Custom domain", "Remove branding"] },
  { name: "Agency", price: 199, features: ["Unlimited sites", "White-label", "API access"] },
] as const;

// USDC contract addresses per chain
const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",    // Ethereum
  56: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",   // BSC
  137: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",  // Polygon
};

// Replace with your treasury/payment receiving address
const TREASURY_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

const ERC20_TRANSFER_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedPlan?: string;
}

export default function PaymentModal({ open, onOpenChange, preselectedPlan }: Props) {
  const { user } = useAuth();
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const [selectedPlan, setSelectedPlan] = useState<number>(
    preselectedPlan ? PLANS.findIndex(p => p.name === preselectedPlan) : 1
  );
  const [step, setStep] = useState<"select" | "paying" | "success">("select");

  const { sendTransaction, data: txHash, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const plan = PLANS[selectedPlan];
  const chainId = chain?.id || 1;
  const usdcAddress = USDC_ADDRESSES[chainId];

  const handlePay = async () => {
    if (!isConnected || !address) {
      connect({ connector: injected() });
      return;
    }

    if (!usdcAddress) {
      toast.error("USDC not supported on this network. Switch to Ethereum, BSC, or Polygon.");
      return;
    }

    setStep("paying");

    try {
      const amount = parseUnits(plan.price.toString(), 6); // USDC has 6 decimals
      const data = encodeFunctionData({
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [TREASURY_ADDRESS, amount],
      });

      sendTransaction(
        { to: usdcAddress, data },
        {
          onSuccess: async (hash) => {
            // Update subscription in backend
            try {
              const { error } = await supabase.functions.invoke("verify-payment", {
                body: {
                  txHash: hash,
                  plan: plan.name.toLowerCase(),
                  chainId,
                  walletAddress: address,
                },
              });
              if (error) throw error;
              setStep("success");
              toast.success(`Subscribed to ${plan.name}!`);
            } catch {
              toast.error("Payment sent but verification failed. Contact support.");
              setStep("select");
            }
          },
          onError: (err) => {
            toast.error(err.message || "Transaction rejected");
            setStep("select");
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
      setStep("select");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === "success" ? "Payment Successful!" : "Upgrade with Crypto"}
          </DialogTitle>
        </DialogHeader>

        {step === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <p className="text-foreground font-semibold">Welcome to {plan.name}!</p>
            <p className="text-sm text-muted-foreground">Your subscription is now active.</p>
            <Button variant="gradient" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plan selector */}
            <div className="grid grid-cols-3 gap-2">
              {PLANS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlan(i)}
                  className={`rounded-lg p-3 text-center transition-all border ${
                    selectedPlan === i
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-lg font-bold text-primary">${p.price}</p>
                  <p className="text-[10px] text-muted-foreground">USDC/mo</p>
                </button>
              ))}
            </div>

            {/* Features */}
            <ul className="space-y-1.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-success" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Wallet status */}
            {isConnected && address && (
              <div className="text-xs text-muted-foreground bg-secondary rounded px-3 py-2">
                Paying from: {address.slice(0, 6)}...{address.slice(-4)} on {chain?.name || "Unknown"}
              </div>
            )}

            {/* Pay button */}
            <Button
              variant="gradient"
              className="w-full"
              onClick={handlePay}
              disabled={isPending || isConfirming}
            >
              {!isConnected ? (
                <><Wallet className="w-4 h-4 mr-2" />Connect Wallet</>
              ) : isPending || isConfirming ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isConfirming ? "Confirming..." : "Approve in wallet..."}</>
              ) : (
                <>Pay ${plan.price} USDC</>
              )}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground">
              Powered by WalletConnect Pay · Project {`f456c1a3...`}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
