import { Search, ChevronDown, Filter, Plus } from "lucide-react";
import { PositionTable, Position } from "./PositionTable";
import { PositionDialog } from "./PositionDialog";
import { ActorDialog } from "./ActorDialog";
import { Actor } from "./ActorSelector";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tabs = ["Todos", "Pré-venda", "Venda", "Entrega", "Suporte"];

const mockActors: Actor[] = [
  { id: "a1", name: "Alexandra Della", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", salary: "38.85K", phone: "+01 (375) 2589 645", email: "alex.della@outlook.com", positions: ["Diretor Comercial"], isOnline: true },
  { id: "a2", name: "Carlos Silva", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", salary: "25.00K", phone: "+01 (375) 2589 646", email: "carlos.silva@outlook.com", positions: ["Supervisor de Vendas"], isOnline: false },
  { id: "a3", name: "Maria Santos", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", salary: "15.00K", phone: "+01 (375) 2589 647", email: "maria.santos@outlook.com", positions: ["Vendedor"], isOnline: true },
  { id: "a4", name: "João Oliveira", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", salary: "12.00K", phone: "+01 (375) 2589 648", email: "joao.oliveira@outlook.com", positions: ["Vendedor"], isOnline: false },
  { id: "a5", name: "Ana Costa", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100", salary: "14.00K", phone: "+01 (375) 2589 649", email: "ana.costa@outlook.com", positions: ["Representante Comercial"], isOnline: true },
];

const vendasPositions: Position[] = [
  { id: "1", name: "Diretor Comercial", quantity: 1, salary: "R$ 10.000", phases: ["Suporte"], isActive: true, actors: [mockActors[0]] },
  { id: "2", name: "Supervisor de Vendas", quantity: 2, salary: "R$ 10.000", phases: ["Venda", "Pré-Venda"], isActive: true, actors: [mockActors[1], mockActors[2]] },
  { id: "3", name: "Vendedor", quantity: 4, salary: "R$ 10.000", phases: ["Venda"], isActive: true, actors: [mockActors[2], mockActors[3], mockActors[4], mockActors[0]] },
  { id: "4", name: "Representante Comercial", quantity: 3, salary: "R$ 10.000", phases: ["Pré-venda"], isActive: false, actors: [mockActors[4], mockActors[1], mockActors[3]] },
];

const logisticaPositions: Position[] = [
  { id: "5", name: "Diretor de Logística", quantity: 1, salary: "R$ 10.000", phases: ["Estratégico"], isActive: true, actors: [mockActors[0]] },
  { id: "6", name: "Conferente", quantity: 2, salary: "R$ 10.000", phases: ["Tático"], isActive: true, actors: [mockActors[1], mockActors[2]] },
  { id: "7", name: "Separador - Empilhadeira", quantity: 4, salary: "R$ 10.000", phases: ["Operacional"], isActive: false, actors: [mockActors[2], mockActors[3], mockActors[4], mockActors[0]] },
];

export function CargosContent() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [positions, setPositions] = useState({
    vendas: vendasPositions,
    logistica: logisticaPositions,
  });
  
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [actorDialogOpen, setActorDialogOpen] = useState(false);

  const handlePositionClick = (position: Position) => {
    setSelectedPosition(position);
    setPositionDialogOpen(true);
  };

  const handleActorClick = (actor: Actor) => {
    setSelectedActor(actor);
    setActorDialogOpen(true);
  };

  const handleToggleActive = (positionId: string, isActive: boolean) => {
    setPositions(prev => ({
      vendas: prev.vendas.map(p => p.id === positionId ? { ...p, isActive } : p),
      logistica: prev.logistica.map(p => p.id === positionId ? { ...p, isActive } : p),
    }));
  };

  const filterPositions = (positionList: Position[]) => {
    return positionList.filter(p => {
      if (statusFilter === "active") return p.isActive;
      if (statusFilter === "inactive") return !p.isActive;
      return true;
    });
  };

  const filteredVendas = filterPositions(positions.vendas);
  const filteredLogistica = filterPositions(positions.logistica);

  return (
    <main className="flex-1 bg-background overflow-y-auto scrollbar-thin">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Cargos</h1>

        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <label className="text-xs text-muted-foreground mb-1 block">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar Cargos..."
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Setor</label>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span>Todos setores</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Salário</label>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors">
              <span>Todas as faixas</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {filteredVendas.length > 0 && (
          <PositionTable
            title="Vendas"
            totalPeople={filteredVendas.reduce((acc, p) => acc + p.quantity, 0)}
            positions={filteredVendas}
            onPositionClick={handlePositionClick}
            onActorClick={handleActorClick}
            onToggleActive={handleToggleActive}
          />
        )}

        {filteredLogistica.length > 0 && (
          <PositionTable
            title="Logística"
            totalPeople={filteredLogistica.reduce((acc, p) => acc + p.quantity, 0)}
            positions={filteredLogistica}
            onPositionClick={handlePositionClick}
            onActorClick={handleActorClick}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>

      <PositionDialog 
        position={selectedPosition} 
        open={positionDialogOpen} 
        onOpenChange={setPositionDialogOpen} 
      />
      <ActorDialog 
        actor={selectedActor} 
        open={actorDialogOpen} 
        onOpenChange={setActorDialogOpen} 
      />
    </main>
  );
}
