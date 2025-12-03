import { Search, ChevronDown, Filter, Plus } from "lucide-react";
import { PositionTable } from "./PositionTable";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = ["Todos", "Pré-venda", "Venda", "Entrega", "Suporte"];

const vendasPositions = [
  { id: "1", name: "Diretor Comercial", quantity: 1, salary: "R$ 10.000", phases: ["Suporte"] },
  { id: "2", name: "Supervisor de Vendas", quantity: 2, salary: "R$ 10.000", phases: ["Venda", "Pré-Venda"] },
  { id: "3", name: "Vendedor", quantity: 4, salary: "R$ 10.000", phases: ["Venda"] },
  { id: "4", name: "Representante Comercial", quantity: 3, salary: "R$ 10.000", phases: ["Pré-venda"] },
];

const logisticaPositions = [
  { id: "5", name: "Diretor de Logística", quantity: 1, salary: "R$ 10.000", phases: ["Estratégico"] },
  { id: "6", name: "Conferente", quantity: 2, salary: "R$ 10.000", phases: ["Tático"] },
  { id: "7", name: "Separador - Empilhadeira", quantity: 4, salary: "R$ 10.000", phases: ["Operacional"] },
];

export function CargosContent() {
  const [activeTab, setActiveTab] = useState("Todos");

  return (
    <main className="flex-1 bg-background overflow-y-auto scrollbar-thin">
      <div className="p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground mb-6">Cargos</h1>

        {/* Tabs */}
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

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          {/* Search */}
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

          {/* Sector Filter */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Setor</label>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span>Todos setores</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Salary Filter */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Salário</label>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors">
              <span>Todas as datas</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tables */}
        <PositionTable
          title="Vendas"
          totalPeople={10}
          positions={vendasPositions}
        />

        <PositionTable
          title="Logística"
          totalPeople={7}
          positions={logisticaPositions}
        />
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
    </main>
  );
}
