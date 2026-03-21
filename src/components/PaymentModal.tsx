import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useSwitchChain, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, encodeFunctionData } from "viem";
import { base } from "wagmi/chains";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Check, Loader2 } from "lucide-react";
import { injected } from "wagmi/connectors";

// USDC on Base
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`;

// Treasury address - replace with your actual address
const TREASURY_ADDRESS = "0x2a613eeE5aA1f8A086c86f2EB80D662cDc87746b" as `0x${string}`;

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
  preselectedPrice?: number;
  isAnnual?: boolean;
}

export default function PaymentModal({ open, onOpenChange, preselectedPlan, preselectedPrice, isAnnual }: Props) {
  const { user } = useAuth();
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { switchChain } = useSwitchChain();
  const [step, setStep] = useState<"confirm" | "connecting" | "paying" | "success">("confirm");

  const { sendTransaction, data: txHash, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const price = preselectedPrice || 0;
  const planName = preselectedPlan || "Pro";
  const isOnBase = chain?.id === base.id;

  // Reset step when modal opens
  useEffect(() => {
    if (open) setStep("confirm");
  }, [open]);

  // When wallet connects, auto-initiate payment
  useEffect(() => {
    if (isConnected && step === "connecting") {
      if (!isOnBase) {
        switchChain({ chainId: base.id });
      }
      // Small delay to let chain switch settle
      const timer = setTimeout(() => initiatePayment(), 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, step, isOnBase]);

  // Handle successful confirmation
  useEffect(() => {
    if (isSuccess && txHash) {
      handleVerifyPayment(txHash);
    }
  }, [isSuccess, txHash]);

  const handleVerifyPayment = async (hash: string) => {
    try {
      // Update subscription directly
      if (user) {
        const { error: subError } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: user.id,
            plan: planName.toLowerCase(),
            status: "active",
            current_period_end: new Date(
              Date.now() + (isAnnual ? 365 : 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
          }, { onConflict: "user_id" });

        if (subError) {
          // If upsert fails (no unique on user_id), try insert
          await supabase.from("subscriptions").insert({
            user_id: user.id,
            plan: planName.toLowerCase(),
            status: "active",
            current_period_end: new Date(
              Date.now() + (isAnnual ? 365 : 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
          });
        }
      }

      setStep("success");
      toast.success(`Subscribed to ${planName}!`);
    } catch {
      toast.error("Payment sent but verification failed. Contact support.");
      setStep("confirm");
    }
  };

  const initiatePayment = async () => {
    if (!isConnected || !address) return;

    if (chain?.id !== base.id) {
      switchChain({ chainId: base.id });
      return;
    }

    setStep("paying");

    try {
      const amount = parseUnits(price.toString(), 6); // USDC = 6 decimals
      const data = encodeFunctionData({
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [TREASURY_ADDRESS, amount],
      });

      sendTransaction(
        { to: USDC_BASE, data },
        {
          onError: (err) => {
            toast.error(err.message || "Transaction rejected");
            setStep("confirm");
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
      setStep("confirm");
    }
  };

  const handlePay = async () => {
    if (!isConnected) {
      setStep("connecting");
      // Try MetaMask first, fall back to WalletConnect
      try {
        connect({ connector: injected() });
      } catch {
        // injected will show WalletConnect modal if no injected wallet
      }
      return;
    }

    if (!isOnBase) {
      switchChain({ chainId: base.id });
    }

    await initiatePayment();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {step === "success" ? "Payment Successful!" : `Upgrade to ${planName}`}
          </DialogTitle>
        </DialogHeader>

        {step === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <p className="text-foreground font-semibold">Welcome to {planName}!</p>
            <p className="text-sm text-muted-foreground">Your subscription is now active.</p>
            <Button variant="gradient" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plan summary */}
            <div className="glass rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">{planName} Plan</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                €{price} <span className="text-sm font-normal text-muted-foreground">{isAnnual ? "/yr" : "/mo"}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Paid in USDC on Base network</p>
            </div>

            {/* Wallet status */}
            {isConnected && address && (
              <div className="text-xs text-muted-foreground bg-secondary rounded px-3 py-2">
                <span className="text-foreground font-medium">Wallet:</span>{" "}
                {address.slice(0, 6)}...{address.slice(-4)}
                {!isOnBase && (
                  <span className="text-warning ml-2">⚠ Switch to Base network</span>
                )}
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
              ) : !isOnBase ? (
                <>Switch to Base Network</>
              ) : isPending || isConfirming ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isConfirming ? "Confirming..." : "Approve in wallet..."}</>
              ) : (
                <>Pay €{price} USDC</>
              )}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground">
              Powered by WalletConnect · USDC on Base
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
