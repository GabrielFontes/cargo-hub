import { useState } from "react";
import { Calendar } from "lucide-react";
import { FinancialCard } from "./FinancialCard";
import { Heatmap } from "./Heatmap";
import { ProjectedVsRealizedChart } from "./ProjectedVsRealizedChart";
import { AnnualSummary } from "./AnnualSummary";
import { IndicatorCard } from "./IndicatorCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const discoveryIndicators = [
  { name: "Número de ligações feitas", previsto: 3, realizado: 0, percentage: 0 },
  { name: "Número de visitas no site", previsto: 10, realizado: 9, percentage: 111 },
  { name: "Número de visitantes únicos", previsto: 50, realizado: 25, percentage: 50 },
  { name: "Seguidores Instagram", previsto: 100, realizado: 45, percentage: 45 },
  { name: "Seguidores LinkedIn", previsto: 100, realizado: 50, percentage: 50 },
  { name: "Formulários preenchidos", previsto: 20, realizado: 5, percentage: 25 },
];

const salesIndicators = [
  { name: "Lojas visitadas", previsto: 2, realizado: 1, percentage: 50 },
  { name: "Reuniões realizadas", previsto: 10, realizado: 5, percentage: 50 },
  { name: "Visitas feitas", previsto: 15, realizado: 8, percentage: 53 },
  { name: "Propostas enviadas", previsto: 8, realizado: 4, percentage: 50 },
  { name: "Propostas aprovadas", previsto: 5, realizado: 3, percentage: 60 },
  { name: "Pedidos emitidos", previsto: 5, realizado: 3, percentage: 60 },
];

const deliveryIndicators = [
  { name: "Entregas realizadas", previsto: 100, realizado: 95, percentage: 95 },
  { name: "Entregas no prazo", previsto: 100, realizado: 88, percentage: 88 },
  { name: "Devoluções", previsto: 5, realizado: 3, percentage: 60 },
  { name: "Satisfação do cliente", previsto: 95, realizado: 92, percentage: 97 },
];

const supportIndicators = [
  { name: "Tickets resolvidos", previsto: 50, realizado: 48, percentage: 96 },
  { name: "Tempo médio de resposta", previsto: 24, realizado: 18, percentage: 133 },
  { name: "NPS", previsto: 80, realizado: 75, percentage: 94 },
  { name: "Retenção de clientes", previsto: 90, realizado: 88, percentage: 98 },
];

export function IndicadoresDash() {
  const [selectedMonth, setSelectedMonth] = useState("janeiro");

  return (
    <main className="flex-1 bg-background overflow-y-auto scrollbar-thin">
      <div className="p-8">

        {/* Row 3: Indicators */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Indicadores</h2>
          <div className="grid grid-cols-4 gap-4">
            <IndicatorCard
              title="Indicadores de Descoberta"
              indicators={discoveryIndicators}
              rate={50}
            />
            <IndicatorCard
              title="Indicadores de Venda"
              indicators={salesIndicators}
              rate={54}
            />
            <IndicatorCard
              title="Indicadores de Entrega"
              indicators={deliveryIndicators}
              rate={85}
            />
            <IndicatorCard
              title="Indicadores de Suporte"
              indicators={supportIndicators}
              rate={105}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
