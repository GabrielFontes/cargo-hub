import { useState } from "react";
import { Calendar } from "lucide-react";
import { FinancialCard } from "./FinancialCard";
import { Heatmap } from "./Heatmap";
import { ProjectedVsRealizedChart } from "./ProjectedVsRealizedChart";
import { AnnualSummary } from "./AnnualSummary";
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
  { month: "Jan", receitaRealizada: 85000, despesaRealizada: 45000, receitaPrevista: 90000, despesaPrevista: 50000 },
  { month: "Fev", receitaRealizada: 92000, despesaRealizada: 48000, receitaPrevista: 95000, despesaPrevista: 52000 },
  { month: "Mar", receitaRealizada: 78000, despesaRealizada: 52000, receitaPrevista: 85000, despesaPrevista: 55000 },
  { month: "Abr", receitaRealizada: 105000, despesaRealizada: 58000, receitaPrevista: 100000, despesaPrevista: 58000 },
  { month: "Mai", receitaRealizada: 98000, despesaRealizada: 62000, receitaPrevista: 105000, despesaPrevista: 60000 },
  { month: "Jun", receitaRealizada: 115000, despesaRealizada: 65000, receitaPrevista: 110000, despesaPrevista: 62000 },
  { month: "Jul", receitaRealizada: 125000, despesaRealizada: 70000, receitaPrevista: 120000, despesaPrevista: 68000 },
  { month: "Ago", receitaRealizada: 118000, despesaRealizada: 68000, receitaPrevista: 125000, despesaPrevista: 70000 },
  { month: "Set", receitaRealizada: 0, despesaRealizada: 0, receitaPrevista: 130000, despesaPrevista: 72000 },
  { month: "Out", receitaRealizada: 0, despesaRealizada: 0, receitaPrevista: 135000, despesaPrevista: 75000 },
  { month: "Nov", receitaRealizada: 0, despesaRealizada: 0, receitaPrevista: 140000, despesaPrevista: 78000 },
  { month: "Dez", receitaRealizada: 0, despesaRealizada: 0, receitaPrevista: 150000, despesaPrevista: 80000 },
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

export function DashboardContent() {
  const [selectedMonth, setSelectedMonth] = useState("janeiro");

  return (
    <main className="flex-1 bg-background overflow-y-auto scrollbar-thin">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground"></h1>
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
      </div>
    </main>
  );
}
