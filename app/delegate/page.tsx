"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  Users,
  UserCheck,
  UserMinus,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useMyDelegate,
  useDelegateWeight,
  useSetDelegate,
  useRemoveDelegate,
} from "@/hooks/useDelegation";
import { isValidAddress, truncateAddress } from "@/lib/utils";
import { zeroAddress } from "viem";

export default function DelegatePage() {
  const { address, isConnected } = useAccount();
  const { data: currentDelegate, refetch } = useMyDelegate();
  const { data: myWeight } = useDelegateWeight(address);

  const hasDelegation =
    currentDelegate && currentDelegate !== zeroAddress;

  if (!isConnected) {
    return (
      <main className="min-h-screen py-24 px-6 max-w-2xl mx-auto">
        <EmptyState
          icon={<Lock className="h-6 w-6" />}
          title="Connect your wallet"
          description="Connect a wallet to manage your vote delegation."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="info" dot>
            Delegation
          </Badge>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
          Vote Delegation
        </h1>
        <p className="mt-3 text-zinc-400 text-lg max-w-2xl">
          Can&apos;t vote on every proposal? Delegate your voting power to a
          trusted representative. They vote on your behalf — you can revoke at
          any time.
        </p>
      </header>

      {/* Status cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card interactive className="p-5">
          <CardContent>
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Users className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider">
                Delegating to you
              </p>
            </div>
            <p className="text-2xl font-black tabular-nums">
              {myWeight !== undefined ? String(myWeight) : "—"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              addresses have delegated their vote to your wallet
            </p>
          </CardContent>
        </Card>
        <Card interactive className="p-5">
          <CardContent>
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <UserCheck className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wider">
                Your Delegate
              </p>
            </div>
            {hasDelegation ? (
              <>
                <p className="text-lg font-mono font-bold truncate">
                  {truncateAddress(currentDelegate as string, 6)}
                </p>
                <p className="text-xs text-emerald-400 mt-1">Active</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-zinc-500">None</p>
                <p className="text-xs text-zinc-500 mt-1">
                  You are voting independently
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SetDelegateCard
          hasDelegation={hasDelegation}
          onSuccess={() => refetch()}
        />
        {hasDelegation && (
          <RemoveDelegateCard
            delegate={currentDelegate as `0x${string}`}
            onSuccess={() => refetch()}
          />
        )}
      </div>

      {/* Info section */}
      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
          >
            <f.icon className="h-5 w-5 text-indigo-400 mb-3" />
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Non-custodial",
    desc: "Delegation transfers voting power, never token custody. Revoke at any time.",
  },
  {
    icon: Users,
    title: "Weight accumulates",
    desc: "Delegates accumulate weight from multiple delegators — visible on-chain.",
  },
  {
    icon: ArrowRight,
    title: "Instant switch",
    desc: "Change your delegate in a single transaction. Weight updates atomically.",
  },
];

function SetDelegateCard({
  hasDelegation,
  onSuccess,
}: {
  hasDelegation: boolean | undefined;
  onSuccess: () => void;
}) {
  const [addr, setAddr] = useState("");
  const [error, setError] = useState<string>();
  const {
    setDelegate,
    isPending,
    isConfirming,
    isSuccess,
    error: txError,
    reset,
  } = useSetDelegate();

  useEffect(() => {
    if (isSuccess) {
      setAddr("");
      onSuccess();
      const t = setTimeout(reset, 4000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onSuccess, reset]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(addr)) {
      setError("Enter a valid 0x address (40 hex characters).");
      return;
    }
    setError(undefined);
    setDelegate(addr as `0x${string}`);
  };

  const loading = isPending || isConfirming;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {hasDelegation ? "Change Delegate" : "Set Delegate"}
        </CardTitle>
        <CardDescription>
          Enter the Ethereum address of your trusted representative.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <Input
            name="delegate-address"
            placeholder="0x… delegate address"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            className="font-mono text-sm"
            error={error}
          />
          {txError && (
            <Alert variant="error">{txError.message}</Alert>
          )}
          {isSuccess && (
            <Alert variant="success">
              Delegation set successfully. Your vote weight is now with your
              delegate.
            </Alert>
          )}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
            loadingText={isConfirming ? "Confirming…" : "Signing…"}
          >
            <UserCheck className="h-4 w-4" />
            {hasDelegation ? "Switch Delegate" : "Delegate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RemoveDelegateCard({
  delegate,
  onSuccess,
}: {
  delegate: `0x${string}`;
  onSuccess: () => void;
}) {
  const {
    removeDelegate,
    isPending,
    isConfirming,
    isSuccess,
    error: txError,
    reset,
  } = useRemoveDelegate();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
      const t = setTimeout(reset, 4000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onSuccess, reset]);

  const loading = isPending || isConfirming;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remove Delegation</CardTitle>
        <CardDescription>
          Currently delegating to{" "}
          <span className="font-mono text-zinc-200">
            {truncateAddress(delegate, 6)}
          </span>
          . Remove to vote independently again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {txError && (
          <Alert variant="error" className="mb-3">
            {txError.message}
          </Alert>
        )}
        {isSuccess && (
          <Alert variant="success" className="mb-3">
            Delegation removed. You are now voting independently.
          </Alert>
        )}
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => removeDelegate()}
          isLoading={loading}
          loadingText={isConfirming ? "Confirming…" : "Signing…"}
        >
          <UserMinus className="h-4 w-4" />
          Revoke Delegation
        </Button>
      </CardContent>
    </Card>
  );
}
