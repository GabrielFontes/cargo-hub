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
