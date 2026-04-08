"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  ShieldAlert,
  Lock,
  UserPlus,
  Play,
  XCircle,
  Plus,
  Pause as PauseIcon,
  PlayCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useAccessRoles,
  useCreateProposal,
  useRegisterVoter,
  usePauseControls,
  useIsPaused,
  useProposals,
  useActivateProposal,
  useCloseProposal,
} from "@/hooks/useVotingContract";
import { ProposalState } from "@/lib/contracts";
import { isValidAddress } from "@/lib/utils";

export default function AdminPage() {
  const { isConnected } = useAccount();
  const { isAdmin, isRegistrar, isLoading: isRolesLoading } = useAccessRoles();
  const { data: isPaused } = useIsPaused();
  const { proposals } = useProposals(1n, 100n);

  if (!isConnected) {
    return (
      <Gate
        title="Connect your wallet"
        description="The admin panel is gated behind on-chain roles. Connect a wallet that holds DEFAULT_ADMIN_ROLE or REGISTRAR_ROLE to continue."
      />
    );
  }

  if (isRolesLoading) {
    return (
      <main className="min-h-screen py-16 px-6 max-w-5xl mx-auto">
        <div className="animate-pulse text-zinc-500">Checking permissions…</div>
      </main>
    );
  }

  if (!isAdmin && !isRegistrar) {
    return (
      <Gate
        title="Access denied"
        description="Your wallet does not hold DEFAULT_ADMIN_ROLE or REGISTRAR_ROLE on the VotingCore contract. Ask an admin to grant you the appropriate role."
      />
    );
  }

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="warning" dot>
            Admin Panel
          </Badge>
          {isAdmin && <Badge variant="info">DEFAULT_ADMIN_ROLE</Badge>}
          {isRegistrar && <Badge variant="info">REGISTRAR_ROLE</Badge>}
          {isPaused ? <Badge variant="danger">Paused</Badge> : null}
        </div>
        <h1 className="text-4xl font-black tracking-tighter">
          Election Management
        </h1>
        <p className="mt-3 text-zinc-400">
          Create proposals, onboard voters, and control the voting lifecycle —
          every action is a signed Ethereum transaction.
        </p>
      </header>

      <div className="space-y-8">
        {isAdmin && <CreateProposalCard />}
        {isRegistrar && <RegisterVoterCard />}
        {isAdmin && <ProposalLifecycleCard proposals={proposals} />}
        {isAdmin && <EmergencyControlsCard isPaused={Boolean(isPaused)} />}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */

function Gate({ title, description }: { title: string; description: string }) {
  return (
    <main className="min-h-screen py-24 px-6 max-w-2xl mx-auto">
      <EmptyState
        icon={<Lock className="h-6 w-6" />}
        title={title}
        description={description}
      />
    </main>
  );
}

/* -------------------------------------------------------------------------- */

function CreateProposalCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(""); // datetime-local value
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  const {
    createProposal,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  } = useCreateProposal();

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDescription("");
      setDeadline("");
      const t = setTimeout(reset, 4000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, reset]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Title is required";

    let deadlineTs = 0n;
    if (deadline) {
      const ts = Math.floor(new Date(deadline).getTime() / 1000);
      if (isNaN(ts)) {
        next.deadline = "Invalid date";
      } else if (ts <= Math.floor(Date.now() / 1000)) {
        next.deadline = "Deadline must be in the future";
      } else {
        deadlineTs = BigInt(ts);
      }
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    createProposal(title.trim(), description.trim(), deadlineTs);
  };

  const loading = isPending || isConfirming;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          <CardTitle>Create New Proposal</CardTitle>
        </div>
        <CardDescription>
          Proposals start in Pending state. Activate them below to open voting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Input
            name="title"
            label="Proposal Title"
            placeholder="e.g., Treasury Allocation Q2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            maxLength={120}
            required
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="Detailed rationale, impact, and expected outcomes…"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
          <Input
            name="deadline"
            type="datetime-local"
            label="Voting Deadline (optional)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            error={errors.deadline}
            helper="Leave empty for no deadline."
          />

          {error && (
            <Alert variant="error" title="Transaction failed">
              {error.message}
            </Alert>
          )}
          {isSuccess && (
            <Alert variant="success" title="Proposal created">
              Your proposal has been permanently recorded on-chain.
            </Alert>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
            loadingText={isConfirming ? "Confirming…" : "Awaiting signature…"}
          >
            Submit Proposal to Chain
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */

function RegisterVoterCard() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | undefined>();
  const {
    registerVoter,
    isPending,
    isConfirming,
    isSuccess,
    error: txError,
    reset,
  } = useRegisterVoter();

  useEffect(() => {
    if (isSuccess) {
      setAddress("");
      const t = setTimeout(reset, 4000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, reset]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidAddress(address)) {
      setError("Invalid EVM address. Must be 0x followed by 40 hex chars.");
      return;
    }
    setError(undefined);
    registerVoter(address);
  };

  const loading = isPending || isConfirming;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          <CardTitle>Voter Registration</CardTitle>
        </div>
        <CardDescription>
          Whitelist a wallet address. Only addresses with REGISTRAR_ROLE can
          call this.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <div className="flex gap-3 flex-col sm:flex-row sm:items-start">
            <div className="flex-1">
              <Input
                name="voter-address"
                placeholder="0x… wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono text-sm"
                aria-label="Voter wallet address"
                error={error}
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              isLoading={loading}
              loadingText={isConfirming ? "Confirming…" : "Signing…"}
              className="sm:mt-0"
            >
              Register
            </Button>
          </div>

          {txError && (
            <Alert variant="error" title="Transaction failed">
              {txError.message}
            </Alert>
          )}
          {isSuccess && (
            <Alert variant="success" title="Voter registered">
              The address can now cast votes on active proposals.
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */

function ProposalLifecycleCard({
  proposals,
}: {
  proposals: ReturnType<typeof useProposals>["proposals"];
}) {
  const {
    activateProposal,
    isPending: isActPending,
    isConfirming: isActConfirming,
  } = useActivateProposal();
  const {
    closeProposal,
    isPending: isClosePending,
    isConfirming: isCloseConfirming,
  } = useCloseProposal();

  const actionable = proposals.filter(
    (p) => p.state !== ProposalState.Closed,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposal Lifecycle</CardTitle>
        <CardDescription>
          Activate pending proposals to open voting, or close active proposals
          to finalize tallies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {actionable.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No pending or active proposals.
          </p>
        ) : (
          <ul className="space-y-3">
            {actionable.map((p) => (
              <li
                key={p.id.toString()}
                className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    <span className="text-zinc-500 font-mono">
                      #{p.id.toString()}
                    </span>{" "}
                    {p.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    State:{" "}
                    {p.state === ProposalState.Pending ? "Pending" : "Active"}
                  </p>
                </div>
                {p.state === ProposalState.Pending ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => activateProposal(p.id)}
                    isLoading={isActPending || isActConfirming}
                  >
                    <Play className="h-3.5 w-3.5" />
                    Activate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => closeProposal(p.id)}
                    isLoading={isClosePending || isCloseConfirming}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Close
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */

function EmergencyControlsCard({ isPaused }: { isPaused: boolean }) {
  const { pause, unpause, isPending, isConfirming, error } = usePauseControls();
  const loading = isPending || isConfirming;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-400" aria-hidden="true" />
          <CardTitle>Emergency Controls</CardTitle>
        </div>
        <CardDescription>
          Pausing immediately prevents all vote casting. Existing proposals and
          results remain intact and readable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="destructive"
            onClick={pause}
            disabled={isPaused}
            isLoading={loading && !isPaused}
          >
            <PauseIcon className="h-4 w-4" />
            {isPaused ? "Paused" : "Pause Voting"}
          </Button>
          <Button
            variant="secondary"
            onClick={unpause}
            disabled={!isPaused}
            isLoading={loading && isPaused}
          >
            <PlayCircle className="h-4 w-4" />
            Resume Voting
          </Button>
        </div>
        {error && (
          <Alert variant="error" title="Transaction failed" className="mt-4">
            {error.message}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

