import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

interface ProposalCardProps {
  title: string;
  description: string;
  yesVotes: number;
  noVotes: number;
  state: "Pending" | "Active" | "Closed";
}

export function ProposalCard({
  title,
  description,
  yesVotes,
  noVotes,
  state,
}: ProposalCardProps) {
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;

  const badgeVariant =
    state === "Active" ? "success" : state === "Closed" ? "danger" : "warning";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant={badgeVariant}>{state}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-emerald-400">Yes: {yesVotes}</span>
            <span className="text-red-400">No: {noVotes}</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
        </div>

        {state === "Active" && (
          <div className="flex gap-3 mt-6">
            <Button variant="primary" size="sm" className="flex-1">
              Vote Yes
            </Button>
            <Button variant="destructive" size="sm" className="flex-1">
              Vote No
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
