import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Search, Plus, Pencil, ChevronRight } from "lucide-react";
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

function formatCurrency(value: number): string {
  if (value === 0) return "–";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString('pt-BR');
}

function getBarWidth(value: number, maxValue: number): number {
  if (value === 0 || maxValue === 0) return 0;
  return Math.min((value / maxValue) * 100, 100);
}

const YEAR_COLORS: Record<number, { bar: string; text: string }> = {
  2023: { bar: "bg-muted-foreground/15", text: "text-muted-foreground" },
  2024: { bar: "bg-muted-foreground/25", text: "text-muted-foreground" },
  2025: { bar: "bg-primary/20", text: "text-primary" },
  2026: { bar: "bg-primary/35", text: "text-primary" },
};

const PREVISTO_COLOR = { bar: "bg-emerald-500/20", text: "text-emerald-600" };

export function ProjecaoHeatmap({ 
  title, items, months, onAddItem, onEditItem, colorScheme, despesas = []
}: ProjecaoHeatmapProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjecaoItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Calculate max value across all years for consistent scale
  const allValues = items.flatMap(item => 
    YEARS.flatMap(y => {
      const key = `valores${y}` as keyof ProjecaoItem;
      return ((item[key] as number[]) || []);
    }).concat(item.previsto || [])
  ).filter(v => v > 0);
  const maxValue = Math.max(...allValues, 1);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
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

  // Get annual total for an item
  const getAnnualTotal = (item: ProjecaoItem, year: number): number => {
    const key = `valores${year}` as keyof ProjecaoItem;
    const vals = (item[key] as number[]) || Array(12).fill(0);
    return vals.reduce((s, v) => s + v, 0);
  };

  const getPrevistoTotal = (item: ProjecaoItem): number => {
    return (item.previsto || []).reduce((s, v) => s + v, 0);
  };

  return (
    <div className="bg-card border border-border rounded-xl">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mr-auto">{title}</h3>
        <div className="relative w-44">
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

      {/* Header row with months */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-2 px-3 text-[10px] text-muted-foreground font-normal uppercase tracking-wider w-[180px] min-w-[180px] sticky left-0 bg-card z-10">
                Item
              </th>
              <th className="text-right py-2 px-2 text-[10px] text-muted-foreground font-normal w-[60px] min-w-[60px]">
                Ano
              </th>
              {months.map((month) => (
                <th key={month} className="text-center py-2 px-0.5 text-[10px] text-muted-foreground font-normal min-w-[56px]">
                  {month.slice(0, 3)}
                </th>
              ))}
              <th className="text-right py-2 px-3 text-[10px] text-muted-foreground font-normal min-w-[70px]">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(item => {
              const isExpanded = expandedItems.has(item.id);
              // Show latest year + previsto by default, all years when expanded
              const visibleYears = isExpanded ? YEARS : [YEARS[YEARS.length - 1]];

              return (
                <React.Fragment key={item.id}>
                  {/* Year rows */}
                  {visibleYears.map((year, yearIdx) => {
                    const yearKey = `valores${year}` as keyof ProjecaoItem;
                    const yearValues = (item[yearKey] as number[]) || Array(12).fill(0);
                    const yearTotal = yearValues.reduce((s, v) => s + v, 0);
                    const colors = YEAR_COLORS[year] || YEAR_COLORS[2026];
                    const isFirstRow = yearIdx === 0;

                    return (
                      <tr key={`${item.id}-${year}`} className="group hover:bg-muted/5 transition-colors">
                        {isFirstRow ? (
                          <td className="py-0 px-3 sticky left-0 bg-card z-0" rowSpan={isExpanded ? visibleYears.length + 1 : 2}>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="shrink-0 p-0.5 rounded hover:bg-muted/30 transition-colors"
                              >
                                <ChevronRight className={cn(
                                  "h-3 w-3 text-muted-foreground transition-transform",
                                  isExpanded && "rotate-90"
                                )} />
                              </button>
                              <span className="truncate text-[11px] text-foreground font-medium">{item.name}</span>
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
                        ) : null}
                        <td className="py-0.5 px-2 text-right">
                          <span className={cn("text-[10px] tabular-nums font-medium", colors.text)}>{year}</span>
                        </td>
                        {months.map((_, monthIdx) => {
                          const val = yearValues[monthIdx] ?? 0;
                          const width = getBarWidth(val, maxValue);
                          return (
                            <td key={monthIdx} className="py-0.5 px-0.5">
                              <div className="h-5 relative rounded-[3px] bg-muted/20 overflow-hidden flex items-center">
                                <div
                                  className={cn("absolute left-0 top-0 bottom-0 rounded-[3px] transition-all", colors.bar)}
                                  style={{ width: `${width}%` }}
                                />
                                <span className={cn(
                                  "relative z-10 w-full text-center text-[9px] tabular-nums font-medium",
                                  val === 0 ? "text-muted-foreground/40" : colors.text
                                )}>
                                  {formatCurrency(val)}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                        <td className="py-0.5 px-3 text-right">
                          <span className={cn("text-[10px] tabular-nums font-semibold", colors.text)}>
                            {formatCurrency(yearTotal)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Previsto row */}
                  <tr className="hover:bg-muted/5 transition-colors">
                    <td className="py-0.5 px-2 text-right">
                      <span className={cn("text-[10px] tabular-nums font-medium italic", PREVISTO_COLOR.text)}>Prev.</span>
                    </td>
                    {months.map((_, monthIdx) => {
                      const val = item.previsto?.[monthIdx] || 0;
                      const width = getBarWidth(val, maxValue);
                      return (
                        <td key={monthIdx} className="py-0.5 px-0.5">
                          <div className="h-5 relative rounded-[3px] bg-muted/20 overflow-hidden flex items-center">
                            <div
                              className={cn("absolute left-0 top-0 bottom-0 rounded-[3px] transition-all", PREVISTO_COLOR.bar)}
                              style={{ width: `${width}%` }}
                            />
                            <span className={cn(
                              "relative z-10 w-full text-center text-[9px] tabular-nums font-medium",
                              val === 0 ? "text-muted-foreground/40" : PREVISTO_COLOR.text
                            )}>
                              {formatCurrency(val)}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-0.5 px-3 text-right">
                      <span className={cn("text-[10px] tabular-nums font-semibold", PREVISTO_COLOR.text)}>
                        {formatCurrency(getPrevistoTotal(item))}
                      </span>
                    </td>
                  </tr>

                  {/* Spacer between items */}
                  <tr><td colSpan={2 + months.length + 1} className="h-1.5" /></tr>
                </React.Fragment>
              );
            })}

            {/* Add row */}
            <tr>
              <td colSpan={2 + months.length + 1} className="py-1 px-3">
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
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-border/50">
        {YEARS.map(year => {
          const colors = YEAR_COLORS[year];
          return (
            <div key={year} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-2 rounded-sm", colors.bar)} />
              <span className={cn("text-[10px]", colors.text)}>{year}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5">
          <div className={cn("w-3 h-2 rounded-sm", PREVISTO_COLOR.bar)} />
          <span className={cn("text-[10px] italic", PREVISTO_COLOR.text)}>Previsto</span>
        </div>
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
