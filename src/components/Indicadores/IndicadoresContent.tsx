import { useState } from "react";
import { Calendar, Search, TrendingUp, ShoppingCart, Truck, Headphones } from "lucide-react";
import { RateCard } from "./RateCard";
import { IndicatorHeatmap } from "./IndicatorHeatmap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const discoveryIndicators = [
  { 
    name: "Número de ligações feitas", 
    previsto: [10, 15, 12, 18, 20, 15, 12, 14, 0, 0, 0, 0], 
    realizado: [8, 12, 15, 14, 18, 12, 10, 11, 0, 0, 0, 0] 
  },
  { 
    name: "Visitas no site", 
    previsto: [100, 120, 150, 180, 200, 220, 250, 280, 0, 0, 0, 0], 
    realizado: [95, 115, 160, 175, 210, 200, 240, 270, 0, 0, 0, 0] 
  },
  { 
    name: "Visitantes únicos", 
    previsto: [50, 60, 75, 90, 100, 110, 125, 140, 0, 0, 0, 0], 
    realizado: [45, 55, 80, 85, 105, 100, 120, 130, 0, 0, 0, 0] 
  },
  { 
    name: "Seguidores Instagram", 
    previsto: [100, 150, 200, 250, 300, 350, 400, 450, 0, 0, 0, 0], 
    realizado: [90, 140, 190, 240, 290, 340, 390, 440, 0, 0, 0, 0] 
  },
  { 
    name: "Seguidores LinkedIn", 
    previsto: [50, 75, 100, 125, 150, 175, 200, 225, 0, 0, 0, 0], 
    realizado: [45, 70, 95, 120, 145, 170, 195, 220, 0, 0, 0, 0] 
  },
  { 
    name: "Formulários preenchidos", 
    previsto: [20, 25, 30, 35, 40, 45, 50, 55, 0, 0, 0, 0], 
    realizado: [15, 22, 28, 32, 38, 42, 48, 52, 0, 0, 0, 0] 
  },
    { 
    name: "Lojas visitadas", 
    previsto: [5, 8, 10, 12, 15, 18, 20, 22, 0, 0, 0, 0], 
    realizado: [4, 7, 9, 11, 14, 16, 18, 20, 0, 0, 0, 0] 
  },
  { 
    name: "Reuniões realizadas", 
    previsto: [10, 15, 20, 25, 30, 35, 40, 45, 0, 0, 0, 0], 
    realizado: [8, 12, 18, 22, 28, 32, 38, 42, 0, 0, 0, 0] 
  },
  { 
    name: "Visitas feitas", 
    previsto: [15, 20, 25, 30, 35, 40, 45, 50, 0, 0, 0, 0], 
    realizado: [12, 18, 22, 28, 32, 38, 42, 48, 0, 0, 0, 0] 
  },
  { 
    name: "Propostas enviadas", 
    previsto: [8, 12, 16, 20, 24, 28, 32, 36, 0, 0, 0, 0], 
    realizado: [6, 10, 14, 18, 22, 26, 30, 34, 0, 0, 0, 0] 
  },
  { 
    name: "Propostas aprovadas", 
    previsto: [5, 8, 10, 13, 15, 18, 20, 23, 0, 0, 0, 0], 
    realizado: [4, 7, 9, 12, 14, 17, 19, 22, 0, 0, 0, 0] 
  },
  { 
    name: "Pedidos emitidos", 
    previsto: [5, 8, 10, 13, 15, 18, 20, 23, 0, 0, 0, 0], 
    realizado: [4, 7, 9, 12, 14, 17, 19, 22, 0, 0, 0, 0] 
  },
    { 
    name: "Entregas realizadas", 
    previsto: [100, 120, 140, 160, 180, 200, 220, 240, 0, 0, 0, 0], 
    realizado: [95, 115, 135, 155, 175, 195, 215, 235, 0, 0, 0, 0] 
  },
  { 
    name: "Entregas no prazo", 
    previsto: [95, 114, 133, 152, 171, 190, 209, 228, 0, 0, 0, 0], 
    realizado: [88, 106, 125, 144, 162, 181, 199, 218, 0, 0, 0, 0] 
  },
  { 
    name: "Devoluções", 
    previsto: [5, 6, 7, 8, 9, 10, 11, 12, 0, 0, 0, 0], 
    realizado: [3, 4, 5, 5, 6, 7, 8, 9, 0, 0, 0, 0] 
  },
  { 
    name: "Satisfação do cliente", 
    previsto: [95, 95, 95, 95, 95, 95, 95, 95, 0, 0, 0, 0], 
    realizado: [92, 93, 94, 93, 94, 95, 94, 93, 0, 0, 0, 0] 
  },
    { 
    name: "Tickets resolvidos", 
    previsto: [50, 60, 70, 80, 90, 100, 110, 120, 0, 0, 0, 0], 
    realizado: [48, 58, 68, 78, 88, 98, 108, 118, 0, 0, 0, 0] 
  },
  { 
    name: "Tempo médio resposta (h)", 
    previsto: [24, 24, 24, 24, 24, 24, 24, 24, 0, 0, 0, 0], 
    realizado: [22, 20, 18, 19, 21, 20, 18, 17, 0, 0, 0, 0] 
  },
  { 
    name: "NPS", 
    previsto: [80, 80, 80, 80, 80, 80, 80, 80, 0, 0, 0, 0], 
    realizado: [75, 76, 78, 77, 79, 80, 81, 82, 0, 0, 0, 0] 
  },
  { 
    name: "Retenção de clientes (%)", 
    previsto: [90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0], 
    realizado: [88, 89, 90, 89, 91, 90, 92, 91, 0, 0, 0, 0] 
  },
];

const salesIndicators = [

];

const deliveryIndicators = [

];

const supportIndicators = [

];

export function IndicadoresContent() {
  const [selectedMonth, setSelectedMonth] = useState("janeiro");

  return (
    <main className="flex-1 bg-background overflow-y-auto scrollbar-thin">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Indicadores</h1>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="janeiro">Janeiro 2026</SelectItem>
                <SelectItem value="fevereiro">Fevereiro 2026</SelectItem>
                <SelectItem value="março">Março 2026</SelectItem>
                <SelectItem value="abril">Abril 2026</SelectItem>
                <SelectItem value="maio">Maio 2026</SelectItem>
                <SelectItem value="junho">Junho 2026</SelectItem>
                <SelectItem value="julho">Julho 2026</SelectItem>
                <SelectItem value="agosto">Agosto 2026</SelectItem>
                <SelectItem value="setembro">Setembro 2026</SelectItem>
                <SelectItem value="outubro">Outubro 2026</SelectItem>
                <SelectItem value="novembro">Novembro 2026</SelectItem>
                <SelectItem value="dezembro">Dezembro 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 1: Rate Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <RateCard
            title="Taxa de Descoberta"
            rate={50}
            icon={Search}
            color="discovery"
          />
          <RateCard
            title="Taxa de Venda"
            rate={54}
            icon={ShoppingCart}
            color="sales"
          />
          <RateCard
            title="Taxa de Entrega"
            rate={85}
            icon={Truck}
            color="delivery"
          />
          <RateCard
            title="Taxa de Eficiência"
            rate={105}
            icon={Headphones}
            color="efficiency"
          />
        </div>

        {/* Row 2: Indicator Heatmaps */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <IndicatorHeatmap
            title=""
            indicators={discoveryIndicators}
            months={months}
            rate={50}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

        </div>
      </div>
    </main>
  );
}
