import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  month: string;
  projetado: number;
  realizado: number;
}

interface ProjectedVsRealizedChartProps {
  data: ChartData[];
}

export function ProjectedVsRealizedChart({ data }: ProjectedVsRealizedChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Projetado x Realizado</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
          />
          <Legend 
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Bar dataKey="projetado" name="Projetado" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="realizado" name="Realizado" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
