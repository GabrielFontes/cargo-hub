import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Search, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjecaoEditDialog } from "./ProjecaoEditDialog";

export interface ProjecaoItem {
  id: string;
  name: string;
  valores2022: number[];
  valores2023: number[];
  valores2024: number[];
  valores2025: number[];
  valores2026: number[];
}

interface ProjecaoHeatmapProps {
  title: string;
  items: ProjecaoItem[];
  months: string[];
  onAddItem: (item: ProjecaoItem) => void;
  onEditItem: (item: ProjecaoItem) => void;
  colorScheme: "expense" | "revenue";
}

const YEARS = [2022, 2023, 2024, 2025, 2026];
const CURRENT_YEAR = 2026;

function getHeatmapColor(value: number, maxValue: number, type: "expense" | "revenue"): string {
  if (value === 0) return "bg-muted";
  const intensity = Math.min(value / maxValue, 1);

  if (type === "expense") {
    if (intensity > 0.7) return "bg-rose-600";
    if (intensity > 0.4) return "bg-rose-500";
    if (intensity > 0.2) return "bg-rose-400";
    return "bg-rose-300";
  } else {
    if (intensity > 0.7) return "bg-emerald-600";
    if (intensity > 0.4) return "bg-emerald-500";
    if (intensity > 0.2) return "bg-emerald-400";
    return "bg-emerald-300";
  }
}

function formatCurrency(value: number): string {
  if (value === 0) return "-";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

export function ProjecaoHeatmap({ 
  title, 
  items, 
  months, 
  onAddItem, 
  onEditItem,
  colorScheme 
}: ProjecaoHeatmapProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([CURRENT_YEAR]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjecaoItem | null>(null);

  const toggleYear = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const sortedSelectedYears = [...selectedYears].sort((a, b) => a - b);

  const allValues = sortedSelectedYears.flatMap(year => {
    const key = `valores${year}` as keyof ProjecaoItem;
    return items.flatMap(item => (item[key] as number[] | undefined) || []);
  }).filter(v => v !== undefined);
  const maxValue = Math.max(...allValues, 1);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const calculateMonthlyTotal = (monthIdx: number): number => {
    return items.reduce((sum, item) => {
      return sum + (item.valores2026?.[monthIdx] || 0);
    }, 0);
  };

  const handleAddNew = () => {
    if (!newItemName.trim()) {
      setIsAdding(false);
      return;
    }

    const newItem: ProjecaoItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      valores2022: Array(12).fill(0),
      valores2023: Array(12).fill(0),
      valores2024: Array(12).fill(0),
      valores2025: Array(12).fill(0),
      valores2026: Array(12).fill(0),
    };

    onAddItem(newItem);
    setNewItemName("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddNew();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewItemName("");
    }
  };

  const openEditDialog = (item: ProjecaoItem) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>

      {/* Search bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar item..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      {/* Year tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {YEARS.map(year => (
          <button
            key={year}
            onClick={() => toggleYear(year)}
            disabled={year === CURRENT_YEAR}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
              selectedYears.includes(year)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
              year === CURRENT_YEAR && "opacity-80 cursor-default"
            )}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-0.5">
          <thead>
            <tr>
              <th className="text-left p-1 text-muted-foreground font-normal min-w-[180px] w-[180px] sticky left-0 bg-card z-10">
                Item
              </th>

              {months.map((month) => (
                <React.Fragment key={month}>
                  {sortedSelectedYears.map(year => (
                    <th
                      key={`${month}-${year}`}
                      className="text-center p-1 text-muted-foreground font-normal min-w-[60px] w-[60px]"
                    >
                      {month.slice(0, 3)} {year}
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td
                  className="p-1 text-foreground truncate max-w-[180px] w-[180px] h-8 align-middle sticky left-0 bg-card z-0"
                  title={item.name}
                >
                  <div className="flex items-center gap-1">
                    <span className="truncate flex-1">{item.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                </td>

                {months.map((_, monthIdx) => (
                  <React.Fragment key={monthIdx}>
                    {sortedSelectedYears.map(year => {
                      const key = `valores${year}` as keyof ProjecaoItem;
                      const value = (item[key] as number[] | undefined)?.[monthIdx] ?? 0;
                      return (
                        <td key={`${monthIdx}-${year}`} className="p-0.5 w-[60px] h-8">
                          <div
                            className={cn(
                              "w-full h-full rounded flex items-center justify-center text-[10px] font-medium",
                              getHeatmapColor(value, maxValue, colorScheme),
                              value > 0 ? "text-white" : "text-muted-foreground"
                            )}
                            title={`${year}: R$ ${value.toLocaleString('pt-BR')}`}
                          >
                            {formatCurrency(value)}
                          </div>
                        </td>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tr>
            ))}

            {/* Add new item row */}
            {isAdding ? (
              <tr>
                <td
                  colSpan={1 + months.length * sortedSelectedYears.length}
                  className="p-1 sticky left-0 bg-card z-0"
                >
                  <Input
                    autoFocus
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleAddNew}
                    placeholder="Nome do item..."
                    className="h-7 text-xs"
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td
                  colSpan={1 + months.length * sortedSelectedYears.length}
                  className="p-1 sticky left-0 bg-card z-0"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setIsAdding(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar item
                  </Button>
                </td>
              </tr>
            )}

            {/* Total row */}
            <tr className="bg-muted/30 font-medium">
              <td className="p-1.5 text-right text-[11px] text-muted-foreground pr-3 sticky left-0 bg-card z-0">
                Total Mensal
              </td>

              {months.map((_, monthIdx) => {
                const total = calculateMonthlyTotal(monthIdx);
                return (
                  <React.Fragment key={monthIdx}>
                    {sortedSelectedYears
                      .filter(y => y < CURRENT_YEAR)
                      .map(year => (
                        <td 
                          key={`${monthIdx}-${year}`} 
                          className="p-0.5 w-[60px] h-8 bg-muted/10"
                        />
                      ))}

                    <td
                      className={cn(
                        "p-1 text-center text-[11px] rounded h-8 min-w-[60px] font-semibold",
                        colorScheme === "expense" 
                          ? "bg-rose-500/20 text-rose-700" 
                          : "bg-emerald-500/20 text-emerald-700"
                      )}
                    >
                      {formatCurrency(total)}
                    </td>

                    {sortedSelectedYears
                      .filter(y => y > CURRENT_YEAR)
                      .map(year => (
                        <td 
                          key={`${monthIdx}-${year}`} 
                          className="p-0.5 w-[60px] h-8 bg-muted/10"
                        />
                      ))}
                  </React.Fragment>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className={cn(
            "w-3 h-3 rounded",
            colorScheme === "expense" ? "bg-rose-500" : "bg-emerald-500"
          )}></div>
          <span>{colorScheme === "expense" ? "Despesa" : "Receita"}</span>
        </div>
      </div>

      <ProjecaoEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={editingItem}
        onSave={onEditItem}
        months={months}
        type={colorScheme === "expense" ? "despesa" : "receita"}
      />
    </div>
  );
}
