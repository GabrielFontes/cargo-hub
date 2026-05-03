import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IndicadorProjecao, ProjecaoItem } from "./types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface IndicadoresProjecaoTabProps {
  indicadores: IndicadorProjecao[];
  receitas: ProjecaoItem[];
  months: string[];
  onChange: (items: IndicadorProjecao[]) => void;
}

function getCellStyle(value: number, max: number, kind: "proj" | "real"): string {
  if (value === 0) return "bg-muted text-muted-foreground";
  const intensity = Math.min(value / max, 1);
  if (kind === "proj") {
    if (intensity > 0.6) return "bg-amber-500/25 text-amber-700";
    if (intensity > 0.3) return "bg-amber-500/15 text-amber-600/80";
    return "bg-amber-500/10 text-amber-600/70";
  }
  if (intensity > 0.6) return "bg-primary/25 text-primary";
  if (intensity > 0.3) return "bg-primary/15 text-primary/80";
  return "bg-primary/10 text-primary/70";
}

export function IndicadoresProjecaoTab({ indicadores, receitas, months, onChange }: IndicadoresProjecaoTabProps) {
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newReceitaId, setNewReceitaId] = useState<string>("");

  const max = Math.max(
    1,
    ...indicadores.flatMap(i => [...i.qtdProj, ...i.qtdReal])
  );

  const filtered = indicadores.filter(i => i.name.toLowerCase().includes(search.toLowerCase().trim()));
  const availableReceitas = receitas.filter(r => !indicadores.some(i => i.receitaId === r.id));

  const addIndicador = (receitaId: string) => {
    const r = receitas.find(x => x.id === receitaId);
    if (!r) return;
    onChange([
      ...indicadores,
      {
        id: `ind-${Date.now()}`,
        name: `Nº Vendas - ${r.name}`,
        qtdProj: r.qtdProj ? [...r.qtdProj] : Array(12).fill(0),
        qtdReal: r.qtdReal ? [...r.qtdReal] : Array(12).fill(0),
        receitaId: r.id,
      },
    ]);
    setNewReceitaId("");
    setAdding(false);
  };

  const updateCell = (id: string, field: "qtdProj" | "qtdReal", monthIdx: number, value: string) => {
    onChange(indicadores.map(ind => {
      if (ind.id !== id) return ind;
      const arr = [...ind[field]];
      arr[monthIdx] = parseFloat(value) || 0;
      return { ...ind, [field]: arr };
    }));
  };

  const remove = (id: string) => onChange(indicadores.filter(i => i.id !== id));

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mr-auto">Indicadores de Vendas</h3>
        <div className="relative w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50">
              <th rowSpan={2} className="text-left py-2 px-3 text-[10px] text-muted-foreground font-normal uppercase tracking-wider min-w-[200px] sticky left-0 bg-card z-10">Indicador</th>
              {months.map(m => (
                <th key={m} colSpan={2} className="text-center py-1.5 px-1 text-[10px] text-muted-foreground font-normal border-l border-border/50">{m}</th>
              ))}
              <th rowSpan={2} className="text-right py-2 px-3 text-[10px] text-muted-foreground font-normal uppercase tracking-wider border-l border-border/50">Total</th>
              <th rowSpan={2}></th>
            </tr>
            <tr className="border-b border-border/50">
              {months.map(m => (
                <>
                  <th key={`${m}-p`} className="text-center py-1 text-[9px] text-muted-foreground/70 font-normal border-l border-border/50">P</th>
                  <th key={`${m}-r`} className="text-center py-1 text-[9px] text-muted-foreground/70 font-normal">R</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(ind => {
              const totalP = ind.qtdProj.reduce((s, v) => s + v, 0);
              const totalR = ind.qtdReal.reduce((s, v) => s + v, 0);
              const pct = totalP > 0 ? Math.round((totalR / totalP) * 100) : 0;
              return (
                <tr key={ind.id} className="group border-t border-border/40 hover:bg-muted/10">
                  <td className="py-1.5 px-3 sticky left-0 bg-card z-0 text-[11px]">{ind.name}</td>
                  {months.map((_, idx) => (
                    <>
                      <td key={`${ind.id}-${idx}-p`} className="py-0.5 px-0.5 border-l border-border/30">
                        <input type="number" value={ind.qtdProj[idx] || ""}
                          onChange={(e) => updateCell(ind.id, "qtdProj", idx, e.target.value)}
                          className={cn("w-full h-6 text-center text-[9px] tabular-nums rounded outline-none focus:ring-1 focus:ring-ring", getCellStyle(ind.qtdProj[idx], max, "proj"))} />
                      </td>
                      <td key={`${ind.id}-${idx}-r`} className="py-0.5 px-0.5">
                        <input type="number" value={ind.qtdReal[idx] || ""}
                          onChange={(e) => updateCell(ind.id, "qtdReal", idx, e.target.value)}
                          className={cn("w-full h-6 text-center text-[9px] tabular-nums rounded outline-none focus:ring-1 focus:ring-ring", getCellStyle(ind.qtdReal[idx], max, "real"))} />
                      </td>
                    </>
                  ))}
                  <td className="py-1 px-3 text-right text-[10px] tabular-nums border-l border-border/40">
                    <div className="font-semibold">{totalR}/{totalP}</div>
                    <div className={cn("text-[9px]", pct >= 100 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-destructive")}>{pct}%</div>
                  </td>
                  <td className="px-1">
                    <button onClick={() => remove(ind.id)} className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100">
                      <X className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}

            <tr>
              <td colSpan={months.length * 2 + 3} className="py-2 px-3">
                {adding ? (
                  <div className="flex items-center gap-2">
                    <Select value={newReceitaId} onValueChange={addIndicador}>
                      <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="Selecionar receita..." /></SelectTrigger>
                      <SelectContent>
                        {availableReceitas.map(r => (
                          <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => setAdding(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setAdding(true)} disabled={availableReceitas.length === 0}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40">
                    <Plus className="h-3 w-3" /> Vincular indicador a uma receita
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
