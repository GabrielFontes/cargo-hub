import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  month: string;
  receitaRealizada: number;
  despesaRealizada: number;
  receitaPrevista: number;
  despesaPrevista: number;
}

interface ProjectedVsRealizedChartProps {
  data: ChartData[];
}

export function ProjectedVsRealizedChart({ data }: ProjectedVsRealizedChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Receitas e Despesas: Previsto x Realizado</h3>
      
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11 }} 
            tickLine={false}
            axisLine={{ className: "stroke-border" }}
          />
          <YAxis 
            tick={{ fontSize: 11 }} 
            tickLine={false}
            axisLine={{ className: "stroke-border" }}
            tickFormatter={(value) => `${(value / 1000)}K`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                receitaPrevista: "Receita Prevista",
                despesaPrevista: "Despesa Prevista",
                receitaRealizada: "Receita Realizada",
                despesaRealizada: "Despesa Realizada",
              };
              return [`R$ ${value.toLocaleString('pt-BR')}`, labels[name] || name];
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                receitaPrevista: "Receita Prevista",
                despesaPrevista: "Despesa Prevista",
                receitaRealizada: "Receita Realizada",
                despesaRealizada: "Despesa Realizada",
              };
              return labels[value] || value;
            }}
          />
          
          {/* Areas for predicted values (background) */}
          <Area 
            type="monotone" 
            dataKey="receitaPrevista" 
            fill="hsl(142, 76%, 36%)" 
            fillOpacity={0.15}
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <Area 
            type="monotone" 
            dataKey="despesaPrevista" 
            fill="hsl(0, 84%, 60%)" 
            fillOpacity={0.15}
            stroke="hsl(0, 84%, 60%)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          
          {/* Bars for realized values */}
          <Bar 
            dataKey="receitaRealizada" 
            fill="hsl(142, 76%, 36%)" 
            radius={[4, 4, 0, 0]} 
            barSize={16}
          />
          <Bar 
            dataKey="despesaRealizada" 
            fill="hsl(0, 84%, 60%)" 
            radius={[4, 4, 0, 0]} 
            barSize={16}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
