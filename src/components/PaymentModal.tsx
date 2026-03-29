import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount, useSwitchChain, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { parseUnits, encodeFunctionData } from "viem";
import { base } from "wagmi/chains";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Check, Loader2 } from "lucide-react";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`;
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
  const { open: openWeb3Modal } = useWeb3Modal();
  const { switchChain } = useSwitchChain();
  const [step, setStep] = useState<"confirm" | "connecting" | "paying" | "success">("confirm");

  const { sendTransaction, data: txHash, isPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const price = preselectedPrice || 0;
  const planName = preselectedPlan || "Pro";
  const isOnBase = chain?.id === base.id;

  useEffect(() => {
    if (open) setStep("confirm");
  }, [open]);

  useEffect(() => {
    if (isConnected && step === "connecting") {
      if (!isOnBase) {
        switchChain({ chainId: base.id });
      }
      const timer = setTimeout(() => initiatePayment(), 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, step, isOnBase]);

  useEffect(() => {
    if (isSuccess && txHash) {
      handleVerifyPayment();
    }
  }, [isSuccess, txHash]);

  const handleVerifyPayment = async () => {
    try {
      if (user) {
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: user.id,
            plan: planName.toLowerCase(),
            status: "active",
            current_period_end: new Date(
              Date.now() + (isAnnual ? 365 : 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
            trial_ends_at: null,
          }, { onConflict: "user_id" });
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
      const amount = parseUnits(price.toString(), 6);
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
      openWeb3Modal();
      return;
    }
    if (!isOnBase) {
      switchChain({ chainId: base.id });
    }
    await initiatePayment();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#111111] border-[#222222] text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">
            {step === "success" ? "Payment successful" : `Upgrade to ${planName}`}
          </DialogTitle>
        </DialogHeader>

        {step === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#06b6d4]/15 flex items-center justify-center mx-auto border border-[#222222]">
              <Check className="w-8 h-8 text-[#06b6d4]" />
            </div>
            <p className="text-white font-semibold">Welcome to {planName}!</p>
            <p className="text-sm text-[#888888]">Your subscription is now active.</p>
            <Button variant="gradient" className="rounded-lg font-semibold" onClick={() => { onOpenChange(false); window.location.href = "/dashboard"; }}>Go to dashboard</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] p-4 text-center">
              <p className="text-sm text-[#888888]">{planName} plan</p>
              <p className="text-3xl font-semibold text-white mt-1">
                {price} USDC <span className="text-sm font-normal text-[#666666]">one-time</span>
              </p>
              <p className="text-xs text-[#666666] mt-1">USDC on Base (chain 8453)</p>
            </div>

            {isConnected && address && (
              <div className="text-xs text-[#888888] bg-[#0c0c0c] border border-[#222222] rounded-lg px-3 py-2">
                <span className="text-white font-medium">Wallet:</span>{" "}
                {address.slice(0, 6)}...{address.slice(-4)}
                {!isOnBase && (
                  <span className="text-amber-400 ml-2">Switch to Base</span>
                )}
              </div>
            )}

            <Button
              variant="gradient"
              className="w-full rounded-lg font-semibold"
              onClick={handlePay}
              disabled={isPending || isConfirming || step === "connecting"}
            >
              {step === "connecting" ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting wallet...</>
              ) : !isConnected ? (
                <><Wallet className="w-4 h-4 mr-2" />Connect Wallet</>
              ) : !isOnBase ? (
                <>Switch to Base Network</>
              ) : isPending || isConfirming ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isConfirming ? "Confirming..." : "Approve in wallet..."}</>
              ) : (
                <>Pay {price} USDC</>
              )}
            </Button>

            <p className="text-[10px] text-center text-[#666666]">
              WalletConnect · USDC on Base
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
