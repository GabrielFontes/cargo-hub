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
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000)}K`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
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
          
          {/* Step areas for predicted values */}
          <Area 
            type="step" 
            dataKey="receitaPrevista" 
            fill="hsl(152, 57%, 58%)" 
            fillOpacity={0.08}
            stroke="hsl(152, 57%, 58%)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
          />
          <Area 
            type="step" 
            dataKey="despesaPrevista" 
            fill="hsl(4, 70%, 65%)" 
            fillOpacity={0.08}
            stroke="hsl(4, 70%, 65%)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
          />
          
          {/* Bars for realized values */}
          <Bar 
            dataKey="receitaRealizada" 
            fill="hsl(152, 57%, 48%)" 
            radius={[3, 3, 0, 0]} 
            barSize={14}
            opacity={0.85}
          />
          <Bar 
            dataKey="despesaRealizada" 
            fill="hsl(4, 70%, 58%)" 
            radius={[3, 3, 0, 0]} 
            barSize={14}
            opacity={0.85}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
