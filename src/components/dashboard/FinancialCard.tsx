import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface FinancialCardProps {
  title: string;
  value: string;
  comparison?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function FinancialCard({ title, value, comparison, trend, className }: FinancialCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-2xl font-bold",
          trend === "up" && "text-emerald-500",
          trend === "down" && "text-destructive",
          trend === "neutral" && "text-foreground"
        )}>
          {value}
        </span>
        {trend && trend !== "neutral" && (
          <span className={cn(
            "flex items-center text-xs",
            trend === "up" ? "text-emerald-500" : "text-destructive"
          )}>
            {trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          </span>
        )}
      </div>
      {comparison && (
        <p className="text-xs text-muted-foreground mt-1">Mês anterior - {comparison}</p>
      )}
    </div>
  );
}
