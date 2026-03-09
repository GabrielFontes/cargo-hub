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

function getCellStyle(value: number, maxValue: number, type: "expense" | "revenue" | "previsto"): string {
  if (value === 0) return "bg-muted text-muted-foreground";
  const intensity = Math.min(value / maxValue, 1);

  if (type === "previsto") {
    if (intensity > 0.5) return "bg-amber-500/25 text-amber-700";
    return "bg-amber-500/10 text-amber-600/70";
  } else if (type === "expense") {
    if (intensity > 0.6) return "bg-destructive/25 text-destructive";
    if (intensity > 0.3) return "bg-destructive/15 text-destructive/80";
    return "bg-destructive/8 text-destructive/60";
  } else {
    if (intensity > 0.6) return "bg-emerald-500/25 text-emerald-700";
    if (intensity > 0.3) return "bg-emerald-500/15 text-emerald-600/80";
    return "bg-emerald-500/8 text-emerald-600/60";
  }
}

function formatCurrency(value: number): string {
  if (value === 0) return "–";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toLocaleString('pt-BR');
}

export function ProjecaoHeatmap({ 
  title, items, months, onAddItem, onEditItem, colorScheme, despesas = []
}: ProjecaoHeatmapProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([CURRENT_YEAR]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjecaoItem | null>(null);

  // Calculate max value for color scaling
  const allValues = items.flatMap(item => {
    const yearVals = selectedYears.flatMap(y => {
      const key = `valores${y}` as keyof ProjecaoItem;
      return (item[key] as number[]) || [];
    });
    return [...yearVals, ...(item.previsto || [])];
  }).filter(v => v > 0);
  const maxValue = Math.max(...allValues, 1);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const toggleYear = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year].sort()
    );
  };

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

  const calculateTotal = (monthIdx: number, type: "realizado" | "previsto", year?: number): number => {
    return items.reduce((sum, item) => {
      if (type === "previsto") return sum + (item.previsto?.[monthIdx] || 0);
      const key = `valores${year}` as keyof ProjecaoItem;
      return sum + ((item[key] as number[])?.[monthIdx] || 0);
    }, 0);
  };

  // Columns: Item | [Year1_Month1 | ... | Year1_Month12 | P_Month1 | ... | P_Month12] for each selected year
  // Simplified: Item | foreach month: [Year values... | P]

  return (
    <div className="bg-card border border-border rounded-xl">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mr-auto">{title}</h3>

        {/* Year multi-select */}
        <div className="flex items-center gap-1 bg-muted/40 rounded-md p-0.5">
          {YEARS.map(year => (
            <button
              key={year}
              onClick={() => toggleYear(year)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded transition-colors",
                selectedYears.includes(year)
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Search */}
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
              <th className="text-left py-2 px-3 text-[10px] text-muted-foreground font-normal uppercase tracking-wider min-w-[140px] sticky left-0 bg-card z-10">
                Item
              </th>
              {months.map((month) => (
                <React.Fragment key={month}>
                  {/* One column per selected year */}
                  {selectedYears.map(year => (
                    <th key={`${month}-${year}`} className="text-center py-2 px-0.5 text-[10px] text-muted-foreground font-normal min-w-[48px]">
                      <div className="flex flex-col items-center leading-tight">
                        <span>{month.slice(0, 3)}</span>
                        <span className="text-[8px] text-muted-foreground/60">{year}</span>
                      </div>
                    </th>
                  ))}
                  {/* Previsto column */}
                  <th className="text-center py-2 px-0.5 text-[10px] text-muted-foreground/60 font-normal min-w-[44px] italic">
                    <div className="flex flex-col items-center leading-tight">
                      <span>{month.slice(0, 3)}</span>
                      <span className="text-[8px]">P</span>
                    </div>
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(item => {
              return (
                <tr key={item.id} className="group hover:bg-muted/5 transition-colors">
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
                    const prev = item.previsto?.[monthIdx] || 0;

                    return (
                      <React.Fragment key={monthIdx}>
                        {selectedYears.map(year => {
                          const yearKey = `valores${year}` as keyof ProjecaoItem;
                          const yearValues = (item[yearKey] as number[]) || Array(12).fill(0);
                          const realizado = yearValues[monthIdx] ?? 0;

                          return (
                            <td key={`${monthIdx}-${year}`} className="py-0.5 px-0.5">
                              <div
                                className={cn(
                                  "h-6 rounded flex items-center justify-center text-[9px] font-medium tabular-nums",
                                  getCellStyle(realizado, maxValue, colorScheme)
                                )}
                                title={`${year}: R$ ${realizado.toLocaleString('pt-BR')}`}
                              >
                                {formatCurrency(realizado)}
                              </div>
                            </td>
                          );
                        })}
                        <td className="py-0.5 px-0.5">
                          <div
                            className={cn(
                              "h-6 rounded flex items-center justify-center text-[9px] font-medium tabular-nums",
                              getCellStyle(prev, maxValue, "previsto")
                            )}
                            title={`Previsto: R$ ${prev.toLocaleString('pt-BR')}`}
                          >
                            {formatCurrency(prev)}
                          </div>
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}

            {/* Add row */}
            <tr>
              <td colSpan={1 + months.length * (selectedYears.length + 1)} className="py-1 px-3">
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
              <td className="py-2 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium sticky left-0 bg-card z-0">
                Total
              </td>
              {months.map((_, monthIdx) => {
                const totalPrev = calculateTotal(monthIdx, "previsto");
                return (
                  <React.Fragment key={monthIdx}>
                    {selectedYears.map(year => {
                      const totalReal = calculateTotal(monthIdx, "realizado", year);
                      return (
                        <td key={`total-${monthIdx}-${year}`} className="py-1 px-0.5">
                          <div className={cn(
                            "h-6 rounded flex items-center justify-center text-[9px] font-semibold tabular-nums",
                            colorScheme === "expense"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-emerald-500/10 text-emerald-600"
                          )}>
                            {formatCurrency(totalReal)}
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-1 px-0.5">
                      <div className="h-6 rounded flex items-center justify-center text-[9px] font-semibold tabular-nums bg-primary/10 text-primary">
                        {formatCurrency(totalPrev)}
                      </div>
                    </td>
                  </React.Fragment>
                );
              })}
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
