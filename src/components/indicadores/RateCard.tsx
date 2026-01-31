import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface RateCardProps {
  title: string;
  rate: number;
  icon: LucideIcon;
  color: "discovery" | "sales" | "delivery" | "efficiency";
}

const colorStyles = {
  discovery: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    icon: "text-blue-500",
  },
  sales: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    icon: "text-emerald-500",
  },
  delivery: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    icon: "text-amber-500",
  },
  efficiency: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    icon: "text-purple-500",
  },
};

function getRateColor(rate: number): string {
  if (rate >= 100) return "text-emerald-500";
  if (rate >= 70) return "text-amber-500";
  return "text-destructive";
}

export function RateCard({ title, rate, icon: Icon, color }: RateCardProps) {
  const styles = colorStyles[color];
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-lg", styles.bg)}>
          <Icon className={cn("w-6 h-6", styles.icon)} />
        </div>
        <span className={cn(
          "text-3xl font-bold",
          getRateColor(rate)
        )}>
          {rate}%
        </span>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    </div>
  );
}
