import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FichaTecnicaItem } from "./types";

interface DespesaOption {
  id: string;
  name: string;
  // metadados que vêm das despesas
  precoMedio?: number;
  medida?: string;
  faixaMin?: number;
  faixaMax?: number;
}

interface FichaTecnicaTabProps {
  items: FichaTecnicaItem[];
  onChange: (items: FichaTecnicaItem[]) => void;
  despesas?: DespesaOption[];
  readonly?: boolean;
}

const UNIDADES = ["Unidade", "Caixa", "Pacote", "Frasco", "Tubete", "Envelope", "Par", "Kit"];
const CAP_UNIDADES = ["un", "mL", "g", "par", "envelope", "kit", "tubete"];

function calcCustoTotal(item: FichaTecnicaItem): number {
  // custo por unidade da capacidade = custoUnitario / custoMedida
  const custoPorUnidade = item.custoMedida > 0 ? item.custoUnitario / item.custoMedida : 0;
  // qntReal é fração (0-1). qnt é qtd nominal usada
  return custoPorUnidade * item.qnt * (item.qntReal || 1);
}

export function FichaTecnicaTab({ items, onChange, despesas = [], readonly = false }: FichaTecnicaTabProps) {
  const addRow = (despesaId: string) => {
    const despesa = despesas.find(d => d.id === despesaId);
    if (!despesa || items.some(i => i.materiaPrima === despesa.name)) return;

    const newItem: FichaTecnicaItem = {
      id: `ft-${Date.now()}`,
      materiaPrima: despesa.name,
      composto: false,
      fixo: false,
      custoUn: "Unidade",
      custoMedida: 1,
      custoUnitario: despesa.precoMedio || 0,
      capUn: despesa.medida || "un",
      capMedida: 1,
      qntReal: 1,
      qnt: 1,
      custoTotal: 0,
    };
    newItem.custoTotal = calcCustoTotal(newItem);
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof FichaTecnicaItem, value: any) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value } as FichaTecnicaItem;
        newItem.custoTotal = calcCustoTotal(newItem);
        return newItem;
      }
      return item;
    });
    onChange(updated);
  };

  const removeItem = (id: string) => onChange(items.filter(i => i.id !== id));

  const total = items.reduce((sum, item) => sum + item.custoTotal, 0);
  const availableDespesas = despesas.filter(d => !items.some(i => i.materiaPrima === d.name));

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-[11px]">
            <thead className="bg-muted/40">
              <tr>
                <th rowSpan={2} className="text-left px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium min-w-[180px]">Insumo</th>
                <th rowSpan={2} className="px-1 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Cmp</th>
                <th rowSpan={2} className="px-1 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Fix</th>
                <th colSpan={3} className="px-1 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium border-l border-border">Custo</th>
                <th colSpan={4} className="px-1 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium border-l border-border">Capacidade</th>
                <th rowSpan={2} className="text-right px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium border-l border-border">Subtotal</th>
                <th rowSpan={2}></th>
              </tr>
              <tr className="text-[9px] text-muted-foreground/80">
                <th className="px-1 py-1 border-l border-border font-normal">Un</th>
                <th className="px-1 py-1 font-normal">Med</th>
                <th className="px-1 py-1 font-normal">R$ Unit</th>
                <th className="px-1 py-1 border-l border-border font-normal">Un</th>
                <th className="px-1 py-1 font-normal">Med</th>
                <th className="px-1 py-1 font-normal">% Real</th>
                <th className="px-1 py-1 font-normal">Qnt</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="group border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-2 py-1 text-[11px] truncate max-w-[200px]" title={item.materiaPrima}>{item.materiaPrima}</td>
                  <td className="px-1 py-1 text-center">
                    <Checkbox checked={item.composto} onCheckedChange={(c) => updateItem(item.id, "composto", !!c)} disabled={readonly} className="h-3 w-3" />
                  </td>
                  <td className="px-1 py-1 text-center">
                    <Checkbox checked={item.fixo} onCheckedChange={(c) => updateItem(item.id, "fixo", !!c)} disabled={readonly} className="h-3 w-3" />
                  </td>
                  {/* CUSTO */}
                  <td className="px-0.5 py-0.5 border-l border-border">
                    <Select value={item.custoUn} onValueChange={(v) => updateItem(item.id, "custoUn", v)} disabled={readonly}>
                      <SelectTrigger className="h-6 text-[10px] border-0 bg-muted/30 px-1.5 shadow-none w-[70px]"><SelectValue /></SelectTrigger>
                      <SelectContent>{UNIDADES.map(u => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-0.5 py-0.5">
                    <Input type="number" value={item.custoMedida || ""} onChange={(e) => updateItem(item.id, "custoMedida", parseFloat(e.target.value) || 0)}
                      className="h-6 w-14 text-[10px] text-right border-0 bg-muted/30 shadow-none px-1" disabled={readonly} />
                  </td>
                  <td className="px-0.5 py-0.5">
                    <Input type="number" value={item.custoUnitario || ""} onChange={(e) => updateItem(item.id, "custoUnitario", parseFloat(e.target.value) || 0)}
                      className="h-6 w-16 text-[10px] text-right border-0 bg-muted/30 shadow-none px-1" disabled={readonly} step="0.01" />
                  </td>
                  {/* CAPACIDADE */}
                  <td className="px-0.5 py-0.5 border-l border-border">
                    <Select value={item.capUn} onValueChange={(v) => updateItem(item.id, "capUn", v)} disabled={readonly}>
                      <SelectTrigger className="h-6 text-[10px] border-0 bg-muted/30 px-1.5 shadow-none w-[55px]"><SelectValue /></SelectTrigger>
                      <SelectContent>{CAP_UNIDADES.map(u => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-0.5 py-0.5">
                    <Input type="number" value={item.capMedida || ""} onChange={(e) => updateItem(item.id, "capMedida", parseFloat(e.target.value) || 0)}
                      className="h-6 w-14 text-[10px] text-right border-0 bg-muted/30 shadow-none px-1" disabled={readonly} />
                  </td>
                  <td className="px-0.5 py-0.5">
                    <Input type="number" value={item.qntReal === 0 ? "" : (item.qntReal * 100).toString()}
                      onChange={(e) => updateItem(item.id, "qntReal", (parseFloat(e.target.value) || 0) / 100)}
                      className="h-6 w-14 text-[10px] text-right border-0 bg-muted/30 shadow-none px-1" disabled={readonly} step="0.01" />
                  </td>
                  <td className="px-0.5 py-0.5">
                    <Input type="number" value={item.qnt || ""} onChange={(e) => updateItem(item.id, "qnt", parseFloat(e.target.value) || 0)}
                      className="h-6 w-12 text-[10px] text-right border-0 bg-muted/30 shadow-none px-1" disabled={readonly} step="0.01" />
                  </td>
                  <td className="px-2 py-1 text-right text-[11px] font-medium tabular-nums border-l border-border">R$ {item.custoTotal.toFixed(2)}</td>
                  <td className="px-1 py-1">
                    {!readonly && (
                      <button onClick={() => removeItem(item.id)} className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!readonly && availableDespesas.length > 0 && (
        <Select onValueChange={addRow}>
          <SelectTrigger className="h-8 text-xs text-muted-foreground border-dashed">
            <SelectValue placeholder="+ Selecionar insumo das despesas..." />
          </SelectTrigger>
          <SelectContent>
            {availableDespesas.map(d => (
              <SelectItem key={d.id} value={d.id} className="text-xs">{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {items.length === 0 && !readonly && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Selecione insumos das despesas para compor a ficha técnica
        </p>
      )}

      {items.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t border-border px-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Custo total unitário</span>
          <span className="text-xs font-semibold text-foreground tabular-nums">R$ {total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
