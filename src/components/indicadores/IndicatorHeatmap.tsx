import { cn } from "@/lib/utils";

interface IndicatorData {
  name: string;
  previsto: number[];
  realizado: number[];
}

interface IndicatorHeatmapProps {
  title: string;
  indicators: IndicatorData[];
  months: string[];
  rate: number;
}

function getHeatmapColor(value: number, maxValue: number, type: "previsto" | "realizado"): string {
  if (value === 0) return "bg-muted";
  
  const intensity = Math.min(value / maxValue, 1);
  
  if (type === "previsto") {
    if (intensity > 0.7) return "bg-slate-500";
    if (intensity > 0.4) return "bg-slate-400";
    if (intensity > 0.2) return "bg-slate-300";
    return "bg-slate-200";
  } else {
    if (intensity > 0.7) return "bg-emerald-600";
    if (intensity > 0.4) return "bg-emerald-500";
    if (intensity > 0.2) return "bg-emerald-400";
    return "bg-emerald-300";
  }
}

function getRateColor(rate: number): string {
  if (rate >= 100) return "bg-emerald-500/10 text-emerald-500";
  if (rate >= 70) return "bg-amber-500/10 text-amber-500";
  return "bg-destructive/10 text-destructive";
}

export function IndicatorHeatmap({ title, indicators, months, rate }: IndicatorHeatmapProps) {
  const maxPrevisto = Math.max(...indicators.flatMap(i => i.previsto));
  const maxRealizado = Math.max(...indicators.flatMap(i => i.realizado));
  const maxValue = Math.max(maxPrevisto, maxRealizado);
  
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className={cn("px-3 py-1 rounded-full text-xs font-medium", getRateColor(rate))}>
          Taxa: {rate}%
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-1 text-muted-foreground font-normal min-w-[140px]">Indicador</th>
              {months.map((month) => (
                <th key={month} colSpan={2} className="text-center p-1 text-muted-foreground font-normal min-w-[60px]">
                  {month.slice(0, 3)}
                </th>
              ))}
            </tr>
            <tr>
              <th></th>
              {months.map((month) => (
                <>
                  <th key={`${month}-p`} className="text-center p-0.5 text-[10px] text-muted-foreground font-normal">P</th>
                  <th key={`${month}-r`} className="text-center p-0.5 text-[10px] text-muted-foreground font-normal">R</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {indicators.map((indicator) => (
              <tr key={indicator.name}>
                <td className="p-1 text-foreground truncate max-w-[140px]" title={indicator.name}>
                  {indicator.name}
                </td>
                {months.map((_, idx) => (
                  <>
                    <td key={`p-${idx}`} className="p-0.5">
                      <div 
                        className={cn(
                          "w-full h-5 rounded flex items-center justify-center text-[9px] font-medium",
                          getHeatmapColor(indicator.previsto[idx], maxValue, "previsto"),
                          indicator.previsto[idx] > 0 ? "text-white" : "text-muted-foreground"
                        )}
                        title={`Previsto: ${indicator.previsto[idx]}`}
                      >
                        {indicator.previsto[idx] > 0 ? indicator.previsto[idx] : "-"}
                      </div>
                    </td>
                    <td key={`r-${idx}`} className="p-0.5">
                      <div 
                        className={cn(
                          "w-full h-5 rounded flex items-center justify-center text-[9px] font-medium",
                          getHeatmapColor(indicator.realizado[idx], maxValue, "realizado"),
                          indicator.realizado[idx] > 0 ? "text-white" : "text-muted-foreground"
                        )}
                        title={`Realizado: ${indicator.realizado[idx]}`}
                      >
                        {indicator.realizado[idx] > 0 ? indicator.realizado[idx] : "-"}
                      </div>
                    </td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-400"></div>
          <span>Previsto</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span>Realizado</span>
        </div>
      </div>
    </div>
  );
}
