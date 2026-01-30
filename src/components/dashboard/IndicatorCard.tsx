import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Indicator {
  name: string;
  previsto: number;
  realizado: number;
  percentage: number;
}

interface IndicatorCardProps {
  title: string;
  indicators: Indicator[];
  rate: number;
}

function getPercentageColor(percentage: number): string {
  if (percentage >= 100) return "text-emerald-500";
  if (percentage >= 70) return "text-amber-500";
  return "text-destructive";
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return "bg-emerald-500";
  if (percentage >= 70) return "bg-amber-500";
  return "bg-destructive";
}

export function IndicatorCard({ title, indicators, rate }: IndicatorCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          rate >= 70 ? "bg-emerald-500/10 text-emerald-500" : 
          rate >= 40 ? "bg-amber-500/10 text-amber-500" : 
          "bg-destructive/10 text-destructive"
        )}>
          Taxa: {rate}%
        </div>
      </div>
      
      <div className="space-y-4">
        {indicators.map((indicator) => (
          <div key={indicator.name} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground truncate max-w-[60%]" title={indicator.name}>
                {indicator.name}
              </span>
              <span className={cn("font-medium", getPercentageColor(indicator.percentage))}>
                {indicator.percentage}%
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={Math.min(indicator.percentage, 100)} 
                className="h-2 bg-muted"
              />
              <div 
                className={cn("absolute top-0 left-0 h-2 rounded-full transition-all", getProgressColor(indicator.percentage))}
                style={{ width: `${Math.min(indicator.percentage, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Prev: {indicator.previsto}</span>
              <span>Real: {indicator.realizado}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
