"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <main className="min-h-screen py-16 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
      <header className="mb-12">
        <Badge variant="warning">Admin Only</Badge>
        <h1 className="text-4xl font-black tracking-tighter mt-3">
          Election Management
        </h1>
        <p className="mt-2 text-zinc-400">
          Create proposals, manage voter registrations, and control election lifecycle.
        </p>
      </header>

      {/* Create Proposal */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Proposal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Budget Allocation 2025"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detailed description of the proposal..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
            </div>
            <Button variant="primary" size="lg" className="w-full">
              Submit Proposal to Chain
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voter Registration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Voter Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="0x... wallet address"
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/50 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-sm"
            />
            <Button variant="secondary">Register</Button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Only the Registrar role can add new voters. Ensure you are connected with the correct wallet.
          </p>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="destructive" className="flex-1">
              Pause All Voting
            </Button>
            <Button variant="secondary" className="flex-1">
              Resume Voting
            </Button>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            Pausing will immediately prevent all vote casting. Existing data remains intact.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
