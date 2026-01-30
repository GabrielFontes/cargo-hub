import { useState } from "react";
import { Calendar } from "lucide-react";
import { FinancialCard } from "./FinancialCard";
import { Heatmap } from "./Heatmap";
import { ProjectedVsRealizedChart } from "./ProjectedVsRealizedChart";
import { AnnualSummary } from "./AnnualSummary";
import { IndicatorCardMonthly } from "./IndicatorCardMonthly";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const revenueHeatmapData = [
  { label: "Produto - Ideação", values: [565323, 50000000, 300000, 400000, 555000, 50000, 50000, 1600000, 0, 0, 0, 0], total: 53520323 },
  { label: "Produto - Validação", values: [20000, 200000, 1100000, 340000, 180000, 60000, 240000, 800000, 0, 0, 0, 0], total: 2940000 },
  { label: "Consultoria", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], total: 0 },
];

const expenseHeatmapData = [
  { label: "Assistente administrativa", values: [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 0], total: 24000 },
  { label: "Condomínio", values: [1250, 1250, 1250, 1250, 1250, 1250, 1800, 1800, 1800, 1800, 1800, 1800], total: 18300 },
  { label: "Água", values: [10, 10, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500], total: 5020 },
  { label: "Mão-de-Obra + Encargos", values: [2550, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], total: 2550 },
];

const chartData = [
  { month: "Jan", projetado: 50000, realizado: 45000 },
  { month: "Fev", projetado: 55000, realizado: 58000 },
  { month: "Mar", projetado: 60000, realizado: 52000 },
  { month: "Abr", projetado: 65000, realizado: 68000 },
  { month: "Mai", projetado: 70000, realizado: 65000 },
  { month: "Jun", projetado: 75000, realizado: 72000 },
  { month: "Jul", projetado: 80000, realizado: 85000 },
  { month: "Ago", projetado: 85000, realizado: 78000 },
  { month: "Set", projetado: 0, realizado: 0 },
  { month: "Out", projetado: 0, realizado: 0 },
  { month: "Nov", projetado: 0, realizado: 0 },
  { month: "Dez", projetado: 0, realizado: 0 },
];

const annualSummaryItems = [
  { label: "Receita Realizada", value: "R$ 5.000.000", type: "positive" as const },
  { label: "Despesas Realizada", value: "R$ 4.000.000", type: "negative" as const },
  { label: "Despesas Prevista", value: "R$ 4.000.000" },
  { label: "Receita Necessária", value: "R$ 4.000.000" },
  { label: "Deduções/Impostos indiretos", value: "R$ 10.000.000", type: "negative" as const },
  { label: "(=) Receita Líquida Total", value: "R$ 10.000.000" },
  { label: "(-) Custos/Despesas Totais", value: "R$ 10.000.000", type: "negative" as const },
  { label: "(=) Lucro Líquido Total", value: "R$ 10.000.000", isTotal: true, type: "positive" as const },
];

const indicatorMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];

const discoveryIndicatorsMonthly = [
  { 
    name: "Ligações feitas", 
    currentPrevisto: 3, 
    currentRealizado: 0, 
    percentage: 0,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 3, realizado: [0, 1, 2, 1, 0, 2, 1, 0][i] }))
  },
  { 
    name: "Visitas no site", 
    currentPrevisto: 10, 
    currentRealizado: 9, 
    percentage: 90,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 10, realizado: [5, 7, 8, 6, 9, 11, 10, 9][i] }))
  },
  { 
    name: "Visitantes únicos", 
    currentPrevisto: 50, 
    currentRealizado: 25, 
    percentage: 50,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 50, realizado: [20, 25, 30, 28, 35, 40, 32, 25][i] }))
  },
];

const salesIndicatorsMonthly = [
  { 
    name: "Reuniões realizadas", 
    currentPrevisto: 10, 
    currentRealizado: 5, 
    percentage: 50,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 10, realizado: [3, 5, 7, 6, 8, 4, 6, 5][i] }))
  },
  { 
    name: "Propostas enviadas", 
    currentPrevisto: 8, 
    currentRealizado: 4, 
    percentage: 50,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 8, realizado: [2, 4, 5, 3, 6, 7, 5, 4][i] }))
  },
  { 
    name: "Propostas aprovadas", 
    currentPrevisto: 5, 
    currentRealizado: 3, 
    percentage: 60,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 5, realizado: [1, 2, 3, 2, 4, 5, 4, 3][i] }))
  },
];

const deliveryIndicatorsMonthly = [
  { 
    name: "Entregas realizadas", 
    currentPrevisto: 100, 
    currentRealizado: 95, 
    percentage: 95,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 100, realizado: [85, 90, 92, 88, 95, 98, 96, 95][i] }))
  },
  { 
    name: "Entregas no prazo", 
    currentPrevisto: 100, 
    currentRealizado: 88, 
    percentage: 88,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 100, realizado: [80, 82, 85, 83, 88, 90, 87, 88][i] }))
  },
  { 
    name: "Satisfação do cliente", 
    currentPrevisto: 95, 
    currentRealizado: 92, 
    percentage: 97,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 95, realizado: [88, 90, 91, 89, 93, 94, 93, 92][i] }))
  },
];

const supportIndicatorsMonthly = [
  { 
    name: "Tickets resolvidos", 
    currentPrevisto: 50, 
    currentRealizado: 48, 
    percentage: 96,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 50, realizado: [40, 42, 45, 43, 47, 49, 48, 48][i] }))
  },
  { 
    name: "Tempo médio resposta (h)", 
    currentPrevisto: 24, 
    currentRealizado: 18, 
    percentage: 133,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 24, realizado: [30, 28, 25, 22, 20, 18, 17, 18][i] }))
  },
  { 
    name: "NPS", 
    currentPrevisto: 80, 
    currentRealizado: 75, 
    percentage: 94,
    monthlyData: indicatorMonths.map((month, i) => ({ month, previsto: 80, realizado: [65, 68, 70, 72, 74, 76, 75, 75][i] }))
  },
];

export function DashboardContent() {
  const [selectedMonth, setSelectedMonth] = useState("janeiro");

  return (
    <main className="flex-1 bg-background overflow-y-auto scrollbar-thin">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
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

        {/* Row 1: Financial Cards + Heatmaps */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <FinancialCard
              title="Receita Bruta"
              value="R$ 1.000,00"
              comparison="R$ 800,00"
              trend="up"
            />
            <FinancialCard
              title="Impostos"
              value="R$ (5.000,00)"
              comparison="R$ 4.500,00"
              trend="down"
            />
            <FinancialCard
              title="Custos"
              value="R$ (10.000,00)"
              comparison="R$ 9.000,00"
              trend="down"
            />
            <FinancialCard
              title="Lucro Líquido"
              value="R$ (14.000,00)"
              comparison="-1400%"
              trend="down"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Heatmap
              title="Principais Fontes de Receita"
              data={revenueHeatmapData}
              months={months}
              type="revenue"
            />
            <Heatmap
              title="Principais Custos"
              data={expenseHeatmapData}
              months={months}
              type="expense"
            />
          </div>
        </div>

        {/* Row 2: Chart + Annual Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <ProjectedVsRealizedChart data={chartData} />
          </div>
          <AnnualSummary items={annualSummaryItems} margin="10,00%" />
        </div>

        {/* Row 3: Indicators */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Indicadores Mensais</h2>
          <div className="grid grid-cols-4 gap-4">
            <IndicatorCardMonthly
              title="Indicadores de Descoberta"
              indicators={discoveryIndicatorsMonthly}
              rate={50}
            />
            <IndicatorCardMonthly
              title="Indicadores de Venda"
              indicators={salesIndicatorsMonthly}
              rate={54}
            />
            <IndicatorCardMonthly
              title="Indicadores de Entrega"
              indicators={deliveryIndicatorsMonthly}
              rate={85}
            />
            <IndicatorCardMonthly
              title="Indicadores de Suporte"
              indicators={supportIndicatorsMonthly}
              rate={105}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
