import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrecoItem } from "./types";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const YEARS = [2024, 2025, 2026];

interface PrecosTabProps {
  items: PrecoItem[];
  onChange: (items: PrecoItem[]) => void;
}

export function PrecosTab({ items, onChange }: PrecosTabProps) {
  const [newPreco, setNewPreco] = useState({
    mes: 0,
    ano: 2026,
    valor: 0,
    descricao: "",
  });

  const addPreco = () => {
    if (newPreco.valor <= 0) return;

    const item: PrecoItem = {
      id: `preco-${Date.now()}`,
      ...newPreco,
    };

    onChange([...items, item]);
    setNewPreco({ mes: 0, ano: 2026, valor: 0, descricao: "" });
  };

  const removePreco = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a.ano !== b.ano) return b.ano - a.ano;
    return b.mes - a.mes;
  });

  return (
    <div className="space-y-4">
      {/* Add new price form */}
      <div className="bg-muted/30 p-4 rounded-lg space-y-3">
        <h4 className="text-sm font-medium">Lançar Novo Preço</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Mês</Label>
            <Select
              value={newPreco.mes.toString()}
              onValueChange={(v) => setNewPreco(prev => ({ ...prev, mes: parseInt(v) }))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Ano</Label>
            <Select
              value={newPreco.ano.toString()}
              onValueChange={(v) => setNewPreco(prev => ({ ...prev, ano: parseInt(v) }))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Valor (R$)</Label>
          <Input
            type="number"
            value={newPreco.valor}
            onChange={(e) => setNewPreco(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
            className="h-8 text-xs"
            step="0.01"
            placeholder="0,00"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Descrição (opcional)</Label>
          <Input
            value={newPreco.descricao}
            onChange={(e) => setNewPreco(prev => ({ ...prev, descricao: e.target.value }))}
            className="h-8 text-xs"
            placeholder="Descrição do lançamento..."
          />
        </div>

        <Button
          onClick={addPreco}
          disabled={newPreco.valor <= 0}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Lançar Preço
        </Button>
      </div>

      {/* Price list */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Histórico de Preços</h4>
        
        {sortedItems.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Nenhum preço lançado ainda.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-background border rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {MONTHS[item.mes]} {item.ano}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      R$ {item.valor.toFixed(2)}
                    </span>
                  </div>
                  {item.descricao && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.descricao}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removePreco(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
