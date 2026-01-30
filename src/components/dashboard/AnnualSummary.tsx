import { cn } from "@/lib/utils";

interface SummaryItem {
  label: string;
  value: string;
  type?: "positive" | "negative" | "neutral";
  isTotal?: boolean;
}

interface AnnualSummaryProps {
  items: SummaryItem[];
  margin?: string;
}

export function AnnualSummary({ items, margin }: AnnualSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Resumo Anual</h3>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "flex justify-between items-center py-2",
              item.isTotal && "border-t border-border pt-3 mt-3"
            )}
          >
            <span className={cn(
              "text-sm",
              item.isTotal ? "font-semibold text-foreground" : "text-muted-foreground"
            )}>
              {item.label}
            </span>
            <span className={cn(
              "text-sm font-medium",
              item.type === "positive" && "text-emerald-500",
              item.type === "negative" && "text-destructive",
              (!item.type || item.type === "neutral") && "text-foreground"
            )}>
              {item.value}
            </span>
          </div>
        ))}
        
        {margin && (
          <div className="bg-primary/10 rounded-lg p-3 mt-4 flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Margem Líquida</span>
            <span className="text-lg font-bold text-primary">{margin}</span>
          </div>
        )}
      </div>
    </div>
  );
}
