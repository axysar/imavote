import type { ProposalView } from "./contracts";

export function proposalsToCSV(proposals: ProposalView[]): string {
  const headers = [
    "ID",
    "Title",
    "Description",
    "Yes Votes",
    "No Votes",
    "Abstain Votes",
    "Total Votes",
    "State",
    "Created At",
    "Closed At",
    "Deadline",
    "Yes %",
    "No %",
    "Abstain %",
  ];

  const stateLabel = (s: number) =>
    s === 0 ? "Pending" : s === 1 ? "Active" : "Closed";

  const rows = proposals.map((p) => {
    const total = Number(p.yesVotes + p.noVotes + p.abstainVotes);
    const pct = (n: number) =>
      total > 0 ? ((n / total) * 100).toFixed(2) : "0.00";
    return [
      p.id.toString(),
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.description.replace(/"/g, '""')}"`,
      p.yesVotes.toString(),
      p.noVotes.toString(),
      p.abstainVotes.toString(),
      String(total),
      stateLabel(p.state),
      p.createdAt > 0n ? new Date(Number(p.createdAt) * 1000).toISOString() : "",
      p.closedAt > 0n ? new Date(Number(p.closedAt) * 1000).toISOString() : "",
      p.deadline > 0n ? new Date(Number(p.deadline) * 1000).toISOString() : "",
      pct(Number(p.yesVotes)),
      pct(Number(p.noVotes)),
      pct(Number(p.abstainVotes)),
    ];
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Explorer URL helpers have moved to lib/chains.ts
export { getExplorerTxUrl, getExplorerAddressUrl } from "./chains";
