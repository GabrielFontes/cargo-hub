import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FichaTecnicaItem } from "./types";

interface FichaTecnicaTabProps {
  items: FichaTecnicaItem[];
  onChange: (items: FichaTecnicaItem[]) => void;
  readonly?: boolean;
}

export function FichaTecnicaTab({ items, onChange, readonly = false }: FichaTecnicaTabProps) {
  const addRow = () => {
    const newItem: FichaTecnicaItem = {
      id: `ft-${Date.now()}`,
      materiaPrima: "",
      composto: false,
      fixo: false,
      custo: 0,
      unidade: "",
      medida: "",
      qntReal: 0,
      qnt: 0,
      custoTotal: 0,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof FichaTecnicaItem, value: any) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        // Recalcula custo total
        newItem.custoTotal = newItem.custo * newItem.qnt;
        return newItem;
      }
      return item;
    });
    onChange(updated);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="p-2 text-left min-w-[150px]">Matéria-Prima</th>
              <th className="p-2 text-center w-[70px]">Composto</th>
              <th className="p-2 text-center w-[60px]">Fixo?</th>
              <th className="p-2 text-center w-[80px]">Custo</th>
              <th className="p-2 text-center w-[50px]">Un.</th>
              <th className="p-2 text-center w-[70px]">Medida</th>
              <th className="p-2 text-center w-[70px]">Qnt Real</th>
              <th className="p-2 text-center w-[60px]">Qnt.</th>
              <th className="p-2 text-center w-[80px] bg-amber-100 text-amber-900">Custo</th>
              {!readonly && <th className="p-2 w-[40px]"></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                <td className="p-1">
                  <Input
                    value={item.materiaPrima}
                    onChange={(e) => updateItem(item.id, "materiaPrima", e.target.value)}
                    className="h-7 text-xs"
                    disabled={readonly}
                    placeholder="Nome..."
                  />
                </td>
                <td className="p-1 text-center">
                  <Checkbox
                    checked={item.composto}
                    onCheckedChange={(checked) => updateItem(item.id, "composto", checked)}
                    disabled={readonly}
                  />
                </td>
                <td className="p-1 text-center">
                  <Checkbox
                    checked={item.fixo}
                    onCheckedChange={(checked) => updateItem(item.id, "fixo", checked)}
                    disabled={readonly}
                  />
                </td>
                <td className="p-1">
                  <Input
                    type="number"
                    value={item.custo}
                    onChange={(e) => updateItem(item.id, "custo", parseFloat(e.target.value) || 0)}
                    className="h-7 text-xs text-center"
                    disabled={readonly}
                    step="0.01"
                  />
                </td>
                <td className="p-1">
                  <Input
                    value={item.unidade}
                    onChange={(e) => updateItem(item.id, "unidade", e.target.value)}
                    className="h-7 text-xs text-center"
                    disabled={readonly}
                    placeholder="un"
                  />
                </td>
                <td className="p-1">
                  <Input
                    value={item.medida}
                    onChange={(e) => updateItem(item.id, "medida", e.target.value)}
                    className="h-7 text-xs text-center"
                    disabled={readonly}
                  />
                </td>
                <td className="p-1">
                  <Input
                    type="number"
                    value={item.qntReal}
                    onChange={(e) => updateItem(item.id, "qntReal", parseFloat(e.target.value) || 0)}
                    className="h-7 text-xs text-center"
                    disabled={readonly}
                  />
                </td>
                <td className="p-1">
                  <Input
                    type="number"
                    value={item.qnt}
                    onChange={(e) => updateItem(item.id, "qnt", parseFloat(e.target.value) || 0)}
                    className="h-7 text-xs text-center"
                    disabled={readonly}
                  />
                </td>
                <td className="p-1 bg-amber-50">
                  <div className="h-7 flex items-center justify-center text-xs font-medium text-amber-900">
                    R$ {item.custoTotal.toFixed(2)}
                  </div>
                </td>
                {!readonly && (
                  <td className="p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readonly && (
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Matéria-Prima
        </Button>
      )}

      {items.length > 0 && (
        <div className="flex justify-end pt-2 border-t">
          <div className="text-sm font-medium">
            Total: <span className="text-primary">R$ {items.reduce((sum, item) => sum + item.custoTotal, 0).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
