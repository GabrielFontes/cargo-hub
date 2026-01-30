import { cn } from "@/lib/utils";

interface HeatmapData {
  label: string;
  values: number[];
  total: number;
}

interface HeatmapProps {
  title: string;
  data: HeatmapData[];
  months: string[];
  type: "revenue" | "expense";
}

function getHeatmapColor(value: number, maxValue: number, type: "revenue" | "expense"): string {
  if (value === 0) return "bg-muted";
  
  const intensity = Math.min(value / maxValue, 1);
  
  if (type === "revenue") {
    if (intensity > 0.7) return "bg-emerald-600";
    if (intensity > 0.4) return "bg-emerald-500";
    if (intensity > 0.2) return "bg-emerald-400";
    return "bg-emerald-300";
  } else {
    if (intensity > 0.7) return "bg-red-600";
    if (intensity > 0.4) return "bg-red-500";
    if (intensity > 0.2) return "bg-red-400";
    return "bg-red-300";
  }
}

export function Heatmap({ title, data, months, type }: HeatmapProps) {
  const maxValue = Math.max(...data.flatMap(d => d.values));
  
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-1 text-muted-foreground font-normal min-w-[120px]">Categoria</th>
              {months.map((month) => (
                <th key={month} className="text-center p-1 text-muted-foreground font-normal min-w-[40px]">
                  {month.slice(0, 3)}
                </th>
              ))}
              <th className="text-right p-1 text-muted-foreground font-normal min-w-[60px]">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.label}>
                <td className="p-1 text-foreground truncate max-w-[120px]" title={row.label}>
                  {row.label}
                </td>
                {row.values.map((value, idx) => (
                  <td key={idx} className="p-1">
                    <div 
                      className={cn(
                        "w-full h-6 rounded flex items-center justify-center text-[10px] font-medium",
                        getHeatmapColor(value, maxValue, type),
                        value > 0 ? "text-white" : "text-muted-foreground"
                      )}
                      title={`R$ ${value.toLocaleString()}`}
                    >
                      {value > 0 ? (value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}K` : value) : "-"}
                    </div>
                  </td>
                ))}
                <td className="p-1 text-right font-medium text-foreground">
                  R$ {row.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
