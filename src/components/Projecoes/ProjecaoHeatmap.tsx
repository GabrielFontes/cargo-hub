import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Search, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjecaoEditDialog } from "./ProjecaoEditDialog";
import { ProjecaoItem } from "./types";

export type { ProjecaoItem } from "./types";

interface ProjecaoHeatmapProps {
  title: string;
  items: ProjecaoItem[];
  months: string[];
  onAddItem: (item: ProjecaoItem) => void;
  onEditItem: (item: ProjecaoItem) => void;
  colorScheme: "expense" | "revenue";
  despesas?: { id: string; name: string }[];
}

const YEARS = [2023, 2024, 2025, 2026];
const CURRENT_YEAR = 2026;

function formatCurrency(value: number): string {
  if (value === 0) return "–";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString('pt-BR');
}

function getCellBg(value: number, maxValue: number, type: "expense" | "revenue"): string {
  if (value === 0) return "";
  const intensity = Math.min(value / maxValue, 1);
  if (type === "expense") {
    if (intensity > 0.6) return "bg-destructive/20";
    if (intensity > 0.3) return "bg-destructive/10";
    return "bg-destructive/5";
  }
  if (intensity > 0.6) return "bg-emerald-500/20";
  if (intensity > 0.3) return "bg-emerald-500/10";
  return "bg-emerald-500/5";
}

export function ProjecaoHeatmap({ 
  title, items, months, onAddItem, onEditItem, colorScheme, despesas = []
}: ProjecaoHeatmapProps) {
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjecaoItem | null>(null);

  const yearKey = `valores${selectedYear}` as keyof ProjecaoItem;

  const allValues = items.flatMap(item => {
    const vals = (item[yearKey] as number[]) || [];
    return vals;
  }).filter(v => v > 0);
  const maxValue = Math.max(...allValues, 1);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleAddNew = () => {
    if (!newItemName.trim()) { setIsAdding(false); return; }
    const newItem: ProjecaoItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      hasFichaTecnica: false,
      valores2022: Array(12).fill(0),
      valores2023: Array(12).fill(0),
      valores2024: Array(12).fill(0),
      valores2025: Array(12).fill(0),
      valores2026: Array(12).fill(0),
      previsto: Array(12).fill(0),
    };
    onAddItem(newItem);
    setNewItemName("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddNew();
    else if (e.key === "Escape") { setIsAdding(false); setNewItemName(""); }
  };

  const openEditDialog = (item: ProjecaoItem) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const calculateTotal = (monthIdx: number): number => {
    return items.reduce((sum, item) => {
      return sum + ((item[yearKey] as number[])?.[monthIdx] || 0);
    }, 0);
  };

  const getItemTotal = (item: ProjecaoItem): number => {
    const vals = (item[yearKey] as number[]) || Array(12).fill(0);
    return vals.reduce((s, v) => s + v, 0);
  };

  return (
    <div className="bg-card border border-border rounded-xl">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mr-auto">{title}</h3>

        <div className="flex items-center gap-0.5 bg-muted/40 rounded-md p-0.5">
          {YEARS.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded transition-colors",
                selectedYear === year
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="relative w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-2.5 px-3 text-[10px] text-muted-foreground font-normal uppercase tracking-wider min-w-[150px] sticky left-0 bg-card z-10">
                Item
              </th>
              {months.map((month) => (
                <th key={month} className="text-center py-2.5 px-1 text-[10px] text-muted-foreground font-normal min-w-[54px]">
                  {month.slice(0, 3)}
                </th>
              ))}
              <th className="text-right py-2.5 px-3 text-[10px] text-muted-foreground font-normal min-w-[65px]">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(item => {
              const yearValues = (item[yearKey] as number[] | undefined) || Array(12).fill(0);
              const itemTotal = getItemTotal(item);

              return (
                <tr key={item.id} className="group hover:bg-muted/5 transition-colors border-b border-border/20">
                  <td className="py-1.5 px-3 sticky left-0 bg-card z-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[11px] text-foreground">{item.name}</span>
                      {item.hasFichaTecnica && (
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40" title="Ficha técnica" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>

                  {months.map((_, monthIdx) => {
                    const val = yearValues[monthIdx] ?? 0;
                    return (
                      <td key={monthIdx} className="py-1 px-0.5">
                        <div
                          className={cn(
                            "h-7 rounded flex items-center justify-center text-[10px] tabular-nums",
                            val === 0 ? "text-muted-foreground/30" : "font-medium text-foreground",
                            getCellBg(val, maxValue, colorScheme)
                          )}
                          title={`R$ ${val.toLocaleString('pt-BR')}`}
                        >
                          {formatCurrency(val)}
                        </div>
                      </td>
                    );
                  })}

                  <td className="py-1 px-3 text-right">
                    <span className={cn(
                      "text-[10px] tabular-nums font-semibold",
                      itemTotal === 0 ? "text-muted-foreground/30" : "text-foreground"
                    )}>
                      {formatCurrency(itemTotal)}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Add row */}
            <tr>
              <td colSpan={2 + months.length} className="py-1 px-3">
                {isAdding ? (
                  <Input
                    autoFocus
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleAddNew}
                    placeholder="Nome do item..."
                    className="h-7 text-xs"
                  />
                ) : (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </button>
                )}
              </td>
            </tr>

            {/* Totals */}
            <tr className="border-t border-border">
              <td className="py-2.5 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium sticky left-0 bg-card z-0">
                Total
              </td>
              {months.map((_, monthIdx) => {
                const total = calculateTotal(monthIdx);
                return (
                  <td key={monthIdx} className="py-1.5 px-0.5">
                    <div className={cn(
                      "h-7 rounded flex items-center justify-center text-[10px] font-semibold tabular-nums",
                      colorScheme === "expense"
                        ? "bg-destructive/8 text-destructive"
                        : "bg-emerald-500/8 text-emerald-600"
                    )}>
                      {formatCurrency(total)}
                    </div>
                  </td>
                );
              })}
              <td className="py-1.5 px-3 text-right">
                <span className={cn(
                  "text-[10px] tabular-nums font-bold",
                  colorScheme === "expense" ? "text-destructive" : "text-emerald-600"
                )}>
                  {formatCurrency(months.reduce((s, _, i) => s + calculateTotal(i), 0))}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ProjecaoEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={editingItem}
        onSave={onEditItem}
        months={months}
        type={colorScheme === "expense" ? "despesa" : "receita"}
        despesas={despesas}
      />
    </div>
  );
}
