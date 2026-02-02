import { useState } from "react";
import { Calendar } from "lucide-react";
import { ProjecaoHeatmap } from "./ProjecaoHeatmap";
import { ProjecaoItem } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const initialDespesas: ProjecaoItem[] = [
  {
    id: "desp-1",
    name: "Aluguel",
    hasFichaTecnica: false,
    valores2022: [5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000],
    valores2023: [5200, 5200, 5200, 5200, 5200, 5200, 5200, 5200, 5200, 5200, 5200, 5200],
    valores2024: [5500, 5500, 5500, 5500, 5500, 5500, 5500, 5500, 5500, 5500, 5500, 5500],
    valores2025: [5800, 5800, 5800, 5800, 5800, 5800, 5800, 5800, 5800, 5800, 5800, 5800],
    valores2026: [6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 0, 0, 0, 0],
    previsto: [6200, 6200, 6200, 6200, 6200, 6200, 6200, 6200, 6200, 6200, 6200, 6200],
  },
  {
    id: "desp-2",
    name: "Folha de Pagamento",
    hasFichaTecnica: false,
    valores2022: [25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000, 25000],
    valores2023: [28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000, 28000],
    valores2024: [30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000],
    valores2025: [32000, 32000, 32000, 32000, 32000, 32000, 32000, 32000, 32000, 32000, 32000, 32000],
    valores2026: [35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000, 0, 0, 0, 0],
    previsto: [36000, 36000, 36000, 36000, 36000, 36000, 36000, 36000, 36000, 36000, 36000, 36000],
  },
  {
    id: "desp-3",
    name: "Marketing",
    hasFichaTecnica: true,
    valores2022: [3000, 3500, 4000, 3200, 3800, 4200, 3500, 4000, 3800, 4100, 4500, 5000],
    valores2023: [4000, 4500, 5000, 4200, 4800, 5200, 4500, 5000, 4800, 5100, 5500, 6000],
    valores2024: [5000, 5500, 6000, 5200, 5800, 6200, 5500, 6000, 5800, 6100, 6500, 7000],
    valores2025: [6000, 6500, 7000, 6200, 6800, 7200, 6500, 7000, 6800, 7100, 7500, 8000],
    valores2026: [7000, 7500, 8000, 7200, 7800, 8200, 7500, 8000, 0, 0, 0, 0],
    previsto: [8000, 8500, 9000, 8200, 8800, 9200, 8500, 9000, 8800, 9100, 9500, 10000],
  },
  {
    id: "desp-4",
    name: "Infraestrutura/TI",
    hasFichaTecnica: false,
    valores2022: [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000],
    valores2023: [2200, 2200, 2200, 2200, 2200, 2200, 2200, 2200, 2200, 2200, 2200, 2200],
    valores2024: [2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500, 2500],
    valores2025: [2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800],
    valores2026: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 0, 0, 0, 0],
    previsto: [3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200],
  },
  {
    id: "desp-5",
    name: "Fornecedores",
    hasFichaTecnica: true,
    valores2022: [8000, 9000, 8500, 9500, 10000, 9000, 8000, 9500, 10000, 11000, 12000, 13000],
    valores2023: [9000, 10000, 9500, 10500, 11000, 10000, 9000, 10500, 11000, 12000, 13000, 14000],
    valores2024: [10000, 11000, 10500, 11500, 12000, 11000, 10000, 11500, 12000, 13000, 14000, 15000],
    valores2025: [11000, 12000, 11500, 12500, 13000, 12000, 11000, 12500, 13000, 14000, 15000, 16000],
    valores2026: [12000, 13000, 12500, 13500, 14000, 13000, 12000, 13500, 0, 0, 0, 0],
    previsto: [13000, 14000, 13500, 14500, 15000, 14000, 13000, 14500, 15000, 16000, 17000, 18000],
  },
];

const initialReceitas: ProjecaoItem[] = [
  {
    id: "rec-1",
    name: "Vendas Produto A",
    hasFichaTecnica: true,
    valores2022: [30000, 32000, 35000, 38000, 40000, 42000, 45000, 48000, 50000, 52000, 55000, 60000],
    valores2023: [35000, 37000, 40000, 43000, 45000, 47000, 50000, 53000, 55000, 57000, 60000, 65000],
    valores2024: [40000, 42000, 45000, 48000, 50000, 52000, 55000, 58000, 60000, 62000, 65000, 70000],
    valores2025: [45000, 47000, 50000, 53000, 55000, 57000, 60000, 63000, 65000, 67000, 70000, 75000],
    valores2026: [50000, 52000, 55000, 58000, 60000, 62000, 65000, 68000, 0, 0, 0, 0],
    previsto: [55000, 57000, 60000, 63000, 65000, 67000, 70000, 73000, 75000, 77000, 80000, 85000],
    sazonalidade: {
      notas: [2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3],
      percentuais: [6.67, 6.67, 6.67, 6.67, 10, 10, 10, 10, 6.67, 6.67, 10, 10],
    },
    resumo: {
      precoVendaUnidade: 150,
      custoTotalUnitario: 45,
      custoVariavel: 12,
      impostoPercentual: 6,
      impostoValor: 9,
      custoAquisicao: 15,
      margemContribuicaoPercent: 46,
      margemContribuicaoValor: 69,
      lucroMedioPercent: 46,
      lucroMedioValor: 69,
    },
  },
  {
    id: "rec-2",
    name: "Vendas Produto B",
    hasFichaTecnica: true,
    valores2022: [15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000],
    valores2023: [18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000],
    valores2024: [21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000],
    valores2025: [24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000, 34000, 35000],
    valores2026: [27000, 28000, 29000, 30000, 31000, 32000, 33000, 34000, 0, 0, 0, 0],
    previsto: [30000, 31000, 32000, 33000, 34000, 35000, 36000, 37000, 38000, 39000, 40000, 41000],
    sazonalidade: {
      notas: [1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2],
      percentuais: [5.26, 5.26, 10.53, 10.53, 10.53, 10.53, 10.53, 10.53, 5.26, 5.26, 10.53, 10.53],
    },
  },
  {
    id: "rec-3",
    name: "Serviços",
    hasFichaTecnica: false,
    valores2022: [10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500],
    valores2023: [12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500, 16000, 16500, 17000, 17500],
    valores2024: [14000, 14500, 15000, 15500, 16000, 16500, 17000, 17500, 18000, 18500, 19000, 19500],
    valores2025: [16000, 16500, 17000, 17500, 18000, 18500, 19000, 19500, 20000, 20500, 21000, 21500],
    valores2026: [18000, 18500, 19000, 19500, 20000, 20500, 21000, 21500, 0, 0, 0, 0],
    previsto: [20000, 20500, 21000, 21500, 22000, 22500, 23000, 23500, 24000, 24500, 25000, 25500],
    sazonalidade: {
      notas: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      percentuais: [8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33],
    },
  },
  {
    id: "rec-4",
    name: "Consultoria",
    hasFichaTecnica: false,
    valores2022: [5000, 6000, 5500, 7000, 6500, 8000, 7500, 8500, 9000, 8000, 9500, 10000],
    valores2023: [6000, 7000, 6500, 8000, 7500, 9000, 8500, 9500, 10000, 9000, 10500, 11000],
    valores2024: [7000, 8000, 7500, 9000, 8500, 10000, 9500, 10500, 11000, 10000, 11500, 12000],
    valores2025: [8000, 9000, 8500, 10000, 9500, 11000, 10500, 11500, 12000, 11000, 12500, 13000],
    valores2026: [9000, 10000, 9500, 11000, 10500, 12000, 11500, 12500, 0, 0, 0, 0],
    previsto: [10000, 11000, 10500, 12000, 11500, 13000, 12500, 13500, 14000, 13000, 14500, 15000],
    sazonalidade: {
      notas: [1, 2, 1, 2, 2, 3, 2, 3, 3, 2, 3, 3],
      percentuais: [3.7, 7.41, 3.7, 7.41, 7.41, 11.11, 7.41, 11.11, 11.11, 7.41, 11.11, 11.11],
    },
  },
];

export function ProjecoesContent() {
  const [selectedMonth, setSelectedMonth] = useState("janeiro");
  const [despesas, setDespesas] = useState<ProjecaoItem[]>(initialDespesas);
  const [receitas, setReceitas] = useState<ProjecaoItem[]>(initialReceitas);

  const handleAddDespesa = (item: ProjecaoItem) => {
    setDespesas(prev => [...prev, item]);
  };

  const handleEditDespesa = (updatedItem: ProjecaoItem) => {
    setDespesas(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleAddReceita = (item: ProjecaoItem) => {
    setReceitas(prev => [...prev, item]);
  };

  const handleEditReceita = (updatedItem: ProjecaoItem) => {
    setReceitas(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  return (
    <main className="flex-1 bg-background overflow-y-auto scrollbar-thin">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Projeções</h1>
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

        {/* Tabs */}
        <Tabs defaultValue="despesas" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
          </TabsList>

          <TabsContent value="despesas">
            <ProjecaoHeatmap
              title="Despesas"
              items={despesas}
              months={months}
              onAddItem={handleAddDespesa}
              onEditItem={handleEditDespesa}
              colorScheme="expense"
            />
          </TabsContent>

          <TabsContent value="receitas">
            <ProjecaoHeatmap
              title="Receitas"
              items={receitas}
              months={months}
              onAddItem={handleAddReceita}
              onEditItem={handleEditReceita}
              colorScheme="revenue"
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
