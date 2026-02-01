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
    realizado2022: [5, 8, 10, 12, 14, 10, 8, 9, 6, 7, 8, 9],
    realizado2023: [6, 10, 12, 13, 16, 11, 9, 10, 7, 8, 9, 10],
    realizado2024: [7, 11, 14, 13, 17, 11, 9, 10, 8, 9, 10, 11],
    realizado2025: [8, 12, 15, 14, 18, 12, 10, 11, 0, 0, 0, 0],
    realizado2026: [8, 12, 15, 14, 18, 12, 10, 11, 0, 0, 0, 0]
  },
  { 
    name: "Visitas no site", 
    previsto: [100, 120, 150, 180, 200, 220, 250, 280, 0, 0, 0, 0], 
    realizado2022: [80, 95, 130, 145, 170, 160, 200, 230, 180, 190, 200, 210],
    realizado2023: [85, 100, 140, 155, 180, 170, 210, 240, 190, 200, 210, 220],
    realizado2024: [90, 110, 155, 170, 200, 190, 230, 260, 0, 0, 0, 0],
    realizado2025: [95, 115, 160, 175, 210, 200, 240, 270, 0, 0, 0, 0],
    realizado2026: [95, 115, 160, 175, 210, 200, 240, 270, 0, 0, 0, 0]
  },
  { 
    name: "Visitantes únicos", 
    previsto: [50, 60, 75, 90, 100, 110, 125, 140, 0, 0, 0, 0], 
    realizado2022: [35, 45, 60, 70, 85, 80, 100, 110, 90, 95, 100, 105],
    realizado2023: [40, 50, 70, 80, 95, 90, 110, 120, 100, 105, 110, 115],
    realizado2024: [42, 52, 75, 82, 100, 95, 115, 125, 0, 0, 0, 0],
    realizado2025: [45, 55, 80, 85, 105, 100, 120, 130, 0, 0, 0, 0],
    realizado2026: [45, 55, 80, 85, 105, 100, 120, 130, 0, 0, 0, 0]
  },
  { 
    name: "Seguidores Instagram", 
    previsto: [100, 150, 200, 250, 300, 350, 400, 450, 0, 0, 0, 0], 
    realizado2022: [70, 110, 150, 190, 230, 270, 310, 350, 300, 320, 340, 360],
    realizado2023: [80, 120, 170, 210, 260, 300, 350, 390, 340, 360, 380, 400],
    realizado2024: [85, 130, 180, 225, 275, 325, 375, 420, 0, 0, 0, 0],
    realizado2025: [90, 140, 190, 240, 290, 340, 390, 440, 0, 0, 0, 0],
    realizado2026: [90, 140, 190, 240, 290, 340, 390, 440, 0, 0, 0, 0]
  },
  { 
    name: "Seguidores LinkedIn", 
    previsto: [50, 75, 100, 125, 150, 175, 200, 225, 0, 0, 0, 0], 
    realizado2022: [35, 55, 75, 95, 115, 135, 155, 175, 150, 160, 170, 180],
    realizado2023: [40, 60, 85, 105, 130, 155, 175, 200, 170, 180, 190, 200],
    realizado2024: [42, 65, 90, 115, 140, 165, 190, 215, 0, 0, 0, 0],
    realizado2025: [45, 70, 95, 120, 145, 170, 195, 220, 0, 0, 0, 0],
    realizado2026: [45, 70, 95, 120, 145, 170, 195, 220, 0, 0, 0, 0]
  },
  { 
    name: "Formulários preenchidos", 
    previsto: [20, 25, 30, 35, 40, 45, 50, 55, 0, 0, 0, 0], 
    realizado2022: [10, 15, 20, 25, 30, 35, 40, 45, 35, 38, 40, 42],
    realizado2023: [12, 18, 24, 28, 34, 38, 44, 48, 40, 42, 44, 46],
    realizado2024: [14, 20, 26, 30, 36, 40, 46, 50, 0, 0, 0, 0],
    realizado2025: [15, 22, 28, 32, 38, 42, 48, 52, 0, 0, 0, 0],
    realizado2026: [15, 22, 28, 32, 38, 42, 48, 52, 0, 0, 0, 0]
  },
  { 
    name: "Lojas visitadas", 
    previsto: [5, 8, 10, 12, 15, 18, 20, 22, 0, 0, 0, 0], 
    realizado2022: [3, 5, 7, 8, 10, 12, 14, 16, 14, 15, 16, 17],
    realizado2023: [3, 6, 8, 9, 12, 14, 16, 18, 16, 17, 18, 19],
    realizado2024: [4, 6, 8, 10, 13, 15, 17, 19, 0, 0, 0, 0],
    realizado2025: [4, 7, 9, 11, 14, 16, 18, 20, 0, 0, 0, 0],
    realizado2026: [4, 7, 9, 11, 14, 16, 18, 20, 0, 0, 0, 0]
  },
  { 
    name: "Reuniões realizadas", 
    previsto: [10, 15, 20, 25, 30, 35, 40, 45, 0, 0, 0, 0], 
    realizado2022: [6, 9, 14, 18, 22, 26, 30, 35, 30, 32, 34, 36],
    realizado2023: [7, 10, 16, 20, 25, 29, 34, 38, 33, 35, 37, 39],
    realizado2024: [7, 11, 17, 21, 27, 31, 36, 40, 0, 0, 0, 0],
    realizado2025: [8, 12, 18, 22, 28, 32, 38, 42, 0, 0, 0, 0],
    realizado2026: [8, 12, 18, 22, 28, 32, 38, 42, 0, 0, 0, 0]
  },
  { 
    name: "Visitas feitas", 
    previsto: [15, 20, 25, 30, 35, 40, 45, 50, 0, 0, 0, 0], 
    realizado2022: [9, 14, 17, 22, 26, 31, 35, 40, 35, 37, 39, 41],
    realizado2023: [10, 15, 19, 24, 28, 33, 38, 44, 38, 40, 42, 44],
    realizado2024: [11, 17, 21, 26, 30, 36, 40, 46, 0, 0, 0, 0],
    realizado2025: [12, 18, 22, 28, 32, 38, 42, 48, 0, 0, 0, 0],
    realizado2026: [12, 18, 22, 28, 32, 38, 42, 48, 0, 0, 0, 0]
  },
  { 
    name: "Propostas enviadas", 
    previsto: [8, 12, 16, 20, 24, 28, 32, 36, 0, 0, 0, 0], 
    realizado2022: [4, 7, 10, 14, 17, 21, 25, 28, 24, 26, 28, 30],
    realizado2023: [5, 8, 12, 16, 19, 23, 27, 31, 27, 29, 31, 33],
    realizado2024: [5, 9, 13, 17, 21, 25, 29, 33, 0, 0, 0, 0],
    realizado2025: [6, 10, 14, 18, 22, 26, 30, 34, 0, 0, 0, 0],
    realizado2026: [6, 10, 14, 18, 22, 26, 30, 34, 0, 0, 0, 0]
  },
  { 
    name: "Propostas aprovadas", 
    previsto: [5, 8, 10, 13, 15, 18, 20, 23, 0, 0, 0, 0], 
    realizado2022: [3, 5, 7, 9, 11, 13, 15, 18, 15, 16, 17, 18],
    realizado2023: [3, 6, 8, 10, 12, 15, 17, 20, 17, 18, 19, 20],
    realizado2024: [4, 6, 8, 11, 13, 16, 18, 21, 0, 0, 0, 0],
    realizado2025: [4, 7, 9, 12, 14, 17, 19, 22, 0, 0, 0, 0],
    realizado2026: [4, 7, 9, 12, 14, 17, 19, 22, 0, 0, 0, 0]
  },
  { 
    name: "Pedidos emitidos", 
    previsto: [5, 8, 10, 13, 15, 18, 20, 23, 0, 0, 0, 0], 
    realizado2022: [3, 5, 7, 9, 11, 13, 15, 18, 15, 16, 17, 18],
    realizado2023: [3, 6, 8, 10, 12, 15, 17, 20, 17, 18, 19, 20],
    realizado2024: [4, 6, 8, 11, 13, 16, 18, 21, 0, 0, 0, 0],
    realizado2025: [4, 7, 9, 12, 14, 17, 19, 22, 0, 0, 0, 0],
    realizado2026: [4, 7, 9, 12, 14, 17, 19, 22, 0, 0, 0, 0]
  },
  { 
    name: "Entregas realizadas", 
    previsto: [100, 120, 140, 160, 180, 200, 220, 240, 0, 0, 0, 0], 
    realizado2022: [80, 96, 112, 128, 144, 160, 176, 192, 168, 176, 184, 192],
    realizado2023: [85, 102, 119, 136, 153, 170, 187, 204, 178, 187, 196, 204],
    realizado2024: [90, 108, 126, 145, 165, 184, 203, 221, 0, 0, 0, 0],
    realizado2025: [95, 115, 135, 155, 175, 195, 215, 235, 0, 0, 0, 0],
    realizado2026: [95, 115, 135, 155, 175, 195, 215, 235, 0, 0, 0, 0]
  },
  { 
    name: "Entregas no prazo", 
    previsto: [95, 114, 133, 152, 171, 190, 209, 228, 0, 0, 0, 0], 
    realizado2022: [72, 88, 103, 118, 133, 148, 163, 178, 156, 163, 171, 178],
    realizado2023: [77, 93, 109, 125, 141, 158, 173, 189, 166, 174, 181, 189],
    realizado2024: [82, 99, 118, 135, 153, 171, 188, 206, 0, 0, 0, 0],
    realizado2025: [88, 106, 125, 144, 162, 181, 199, 218, 0, 0, 0, 0],
    realizado2026: [88, 106, 125, 144, 162, 181, 199, 218, 0, 0, 0, 0]
  },
  { 
    name: "Devoluções", 
    previsto: [5, 6, 7, 8, 9, 10, 11, 12, 0, 0, 0, 0], 
    realizado2022: [2, 3, 4, 4, 5, 5, 6, 7, 6, 6, 7, 7],
    realizado2023: [2, 3, 4, 4, 5, 6, 7, 8, 7, 7, 7, 8],
    realizado2024: [3, 3, 4, 5, 5, 6, 7, 8, 0, 0, 0, 0],
    realizado2025: [3, 4, 5, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    realizado2026: [3, 4, 5, 5, 6, 7, 8, 9, 0, 0, 0, 0]
  },
  { 
    name: "Satisfação do cliente", 
    previsto: [95, 95, 95, 95, 95, 95, 95, 95, 0, 0, 0, 0], 
    realizado2022: [88, 89, 90, 89, 90, 91, 90, 89, 88, 89, 90, 91],
    realizado2023: [89, 90, 91, 90, 91, 92, 91, 90, 89, 90, 91, 92],
    realizado2024: [91, 92, 93, 92, 93, 94, 93, 92, 0, 0, 0, 0],
    realizado2025: [92, 93, 94, 93, 94, 95, 94, 93, 0, 0, 0, 0],
    realizado2026: [92, 93, 94, 93, 94, 95, 94, 93, 0, 0, 0, 0]
  },
  { 
    name: "Tickets resolvidos", 
    previsto: [50, 60, 70, 80, 90, 100, 110, 120, 0, 0, 0, 0], 
    realizado2022: [40, 48, 56, 64, 72, 80, 88, 96, 84, 88, 92, 96],
    realizado2023: [43, 52, 60, 69, 78, 86, 95, 103, 90, 95, 99, 103],
    realizado2024: [45, 55, 64, 73, 82, 92, 101, 110, 0, 0, 0, 0],
    realizado2025: [48, 58, 68, 78, 88, 98, 108, 118, 0, 0, 0, 0],
    realizado2026: [48, 58, 68, 78, 88, 98, 108, 118, 0, 0, 0, 0]
  },
  { 
    name: "Tempo médio resposta (h)", 
    previsto: [24, 24, 24, 24, 24, 24, 24, 24, 0, 0, 0, 0], 
    realizado2022: [28, 26, 24, 25, 26, 25, 24, 23, 24, 23, 22, 21],
    realizado2023: [26, 24, 22, 23, 24, 23, 22, 21, 22, 21, 20, 19],
    realizado2024: [24, 22, 20, 21, 23, 22, 20, 19, 0, 0, 0, 0],
    realizado2025: [22, 20, 18, 19, 21, 20, 18, 17, 0, 0, 0, 0],
    realizado2026: [22, 20, 18, 19, 21, 20, 18, 17, 0, 0, 0, 0]
  },
  { 
    name: "NPS", 
    previsto: [80, 80, 80, 80, 80, 80, 80, 80, 0, 0, 0, 0], 
    realizado2022: [68, 70, 72, 70, 72, 73, 74, 75, 73, 74, 75, 76],
    realizado2023: [71, 72, 74, 73, 75, 76, 77, 78, 76, 77, 78, 79],
    realizado2024: [73, 74, 76, 75, 77, 78, 79, 80, 0, 0, 0, 0],
    realizado2025: [75, 76, 78, 77, 79, 80, 81, 82, 0, 0, 0, 0],
    realizado2026: [75, 76, 78, 77, 79, 80, 81, 82, 0, 0, 0, 0]
  },
  { 
    name: "Retenção de clientes (%)", 
    previsto: [90, 90, 90, 90, 90, 90, 90, 90, 0, 0, 0, 0], 
    realizado2022: [82, 83, 84, 83, 85, 84, 86, 85, 84, 85, 86, 87],
    realizado2023: [84, 85, 86, 85, 87, 86, 88, 87, 86, 87, 88, 89],
    realizado2024: [86, 87, 88, 87, 89, 88, 90, 89, 0, 0, 0, 0],
    realizado2025: [88, 89, 90, 89, 91, 90, 92, 91, 0, 0, 0, 0],
    realizado2026: [88, 89, 90, 89, 91, 90, 92, 91, 0, 0, 0, 0]
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


        {/* Row 2: Indicator Heatmaps */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <IndicatorHeatmap
            title=""
            indicators={discoveryIndicators}
            months={months}
          />
        </div>
      </div>
    </main>
  );
}
