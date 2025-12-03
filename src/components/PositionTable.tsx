import { Pencil, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { ActorSelector, Actor } from "./ActorSelector";
import { useState } from "react";

export interface Position {
  id: string;
  name: string;
  quantity: number;
  salary: string;
  phases: string[];
  isActive: boolean;
  actors: Actor[];
  avgSalary?: string;
  objective?: string;
}

interface PositionTableProps {
  title: string;
  totalPeople: number;
  positions: Position[];
  onPositionClick: (position: Position) => void;
  onActorClick: (actor: Actor) => void;
  onToggleActive: (positionId: string, isActive: boolean) => void;
}

type SortField = "name" | "quantity" | "salary" | "phase" | null;
type SortDirection = "asc" | "desc";

const phaseColors: Record<string, string> = {
  "Suporte": "bg-primary text-primary-foreground",
  "Venda": "bg-primary text-primary-foreground",
  "Pré-Venda": "bg-primary text-primary-foreground",
  "Pré-venda": "bg-primary text-primary-foreground",
  "Estratégico": "bg-primary text-primary-foreground",
  "Tático": "bg-primary text-primary-foreground",
  "Operacional": "bg-primary text-primary-foreground",
};

export function PositionTable({ 
  title, 
  totalPeople, 
  positions, 
  onPositionClick, 
  onActorClick,
  onToggleActive 
}: PositionTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPositions = [...positions].sort((a, b) => {
    if (!sortField) return 0;
    
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "quantity":
        comparison = a.quantity - b.quantity;
        break;
      case "salary":
        comparison = parseFloat(a.salary.replace(/[^\d]/g, "")) - parseFloat(b.salary.replace(/[^\d]/g, ""));
        break;
      case "phase":
        comparison = (a.phases[0] || "").localeCompare(b.phases[0] || "");
        break;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3" />;
    return sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title} ({totalPeople} pessoas)
      </h3>
      
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_120px_120px_140px_80px] gap-4 px-4 py-3 bg-table-header border-b border-border">
          <button 
            onClick={() => handleSort("name")}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Cargos <SortIcon field="name" />
          </button>
          <button 
            onClick={() => handleSort("quantity")}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center flex items-center justify-center gap-1 hover:text-foreground transition-colors"
          >
            QTD <SortIcon field="quantity" />
          </button>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Atores</span>
          <button 
            onClick={() => handleSort("salary")}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center flex items-center justify-center gap-1 hover:text-foreground transition-colors"
          >
            Salário Base <SortIcon field="salary" />
          </button>
          <button 
            onClick={() => handleSort("phase")}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center flex items-center justify-center gap-1 hover:text-foreground transition-colors"
          >
            Fase <SortIcon field="phase" />
          </button>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">Ativo</span>
        </div>
        
        {/* Rows */}
        {sortedPositions.map((position) => (
          <div 
            key={position.id}
            className="grid grid-cols-[1fr_80px_120px_120px_140px_80px] gap-4 px-4 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            {/* Name */}
            <button 
              onClick={() => onPositionClick(position)}
              className="flex items-center gap-3 text-left hover:text-primary transition-colors"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{position.name}</span>
            </button>
            
            {/* Quantity */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-muted-foreground">{position.quantity}</span>
            </div>
            
            {/* Actors Selector */}
            <div className="flex items-center">
              <ActorSelector actors={position.actors} onActorClick={onActorClick} />
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
            
            {/* Active Toggle */}
            <div className="flex items-center justify-center">
              <Switch
                checked={position.isActive}
                onCheckedChange={(checked) => onToggleActive(position.id, checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
