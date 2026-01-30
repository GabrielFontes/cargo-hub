import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface MonthlyData {
  month: string;
  previsto: number;
  realizado: number;
}

interface Indicator {
  name: string;
  monthlyData: MonthlyData[];
  currentPrevisto: number;
  currentRealizado: number;
  percentage: number;
}

interface IndicatorCardMonthlyProps {
  title: string;
  indicators: Indicator[];
  rate: number;
}

function getPercentageColor(percentage: number): string {
  if (percentage >= 100) return "text-emerald-500";
  if (percentage >= 70) return "text-amber-500";
  return "text-destructive";
}

function getChartColor(percentage: number): string {
  if (percentage >= 100) return "hsl(var(--chart-positive))";
  if (percentage >= 70) return "hsl(var(--chart-warning))";
  return "hsl(var(--destructive))";
}

function getChartGradientId(name: string, percentage: number): string {
  const suffix = percentage >= 100 ? "positive" : percentage >= 70 ? "warning" : "negative";
  return `gradient-${name.replace(/\s+/g, "-")}-${suffix}`;
}

export function IndicatorCardMonthly({ title, indicators, rate }: IndicatorCardMonthlyProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
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
        {indicators.map((indicator) => {
          const gradientId = getChartGradientId(indicator.name, indicator.percentage);
          const chartColor = getChartColor(indicator.percentage);
          
          return (
            <div key={indicator.name} className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground truncate max-w-[50%]" title={indicator.name}>
                  {indicator.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {indicator.currentRealizado}/{indicator.currentPrevisto}
                  </span>
                  <span className={cn("text-xs font-bold", getPercentageColor(indicator.percentage))}>
                    {indicator.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={indicator.monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "10px",
                        padding: "4px 8px"
                      }}
                      formatter={(value: number, name: string) => [
                        value,
                        name === "realizado" ? "Realizado" : "Previsto"
                      ]}
                      labelFormatter={(label) => label}
                    />
                    <Area
                      type="monotone"
                      dataKey="previsto"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      fill="none"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="realizado"
                      stroke={chartColor}
                      strokeWidth={2}
                      fill={`url(#${gradientId})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-between mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-muted-foreground" style={{ borderStyle: "dashed" }} />
                  <span className="text-[9px] text-muted-foreground">Previsto</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: chartColor }} />
                  <span className="text-[9px] text-muted-foreground">Realizado</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
