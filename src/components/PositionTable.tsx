import { Pencil, FileText } from "lucide-react";
import { AvatarStack } from "./AvatarStack";
import { cn } from "@/lib/utils";

interface Position {
  id: string;
  name: string;
  quantity: number;
  salary: string;
  phases: string[];
}

interface PositionTableProps {
  title: string;
  totalPeople: number;
  positions: Position[];
}

const phaseColors: Record<string, string> = {
  "Suporte": "bg-primary text-primary-foreground",
  "Venda": "bg-primary text-primary-foreground",
  "Pré-Venda": "bg-primary text-primary-foreground",
  "Pré-venda": "bg-primary text-primary-foreground",
  "Estratégico": "bg-primary text-primary-foreground",
  "Tático": "bg-primary text-primary-foreground",
  "Operacional": "bg-primary text-primary-foreground",
};

export function PositionTable({ title, totalPeople, positions }: PositionTableProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title} ({totalPeople} pessoas)
      </h3>
      
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_120px_120px_140px_80px] gap-4 px-4 py-3 bg-table-header border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cargos</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">QTD</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Atores</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">Salário Base</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">Fase</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">Descrição</span>
        </div>
        
        {/* Rows */}
        {positions.map((position) => (
          <div 
            key={position.id}
            className="grid grid-cols-[1fr_80px_120px_120px_140px_80px] gap-4 px-4 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            {/* Name */}
            <div className="flex items-center gap-3">
              <Pencil className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{position.name}</span>
            </div>
            
            {/* Quantity */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-muted-foreground">{position.quantity}</span>
            </div>
            
            {/* Avatars */}
            <div className="flex items-center">
              <AvatarStack count={position.quantity} />
            </div>
            
            {/* Salary */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-muted-foreground">{position.salary}</span>
            </div>
            
            {/* Phases */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {position.phases.map((phase, i) => (
                <span 
                  key={i}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    phaseColors[phase] || "bg-primary text-primary-foreground"
                  )}
                >
                  {phase}
                </span>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-center">
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
