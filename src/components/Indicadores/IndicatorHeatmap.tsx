import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Search, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IndicatorEditDialog } from "./IndicatorEditDialog";

export interface IndicatorData {
  name: string;
  previsto: number[];
  realizado2022: number[];
  realizado2023: number[];
  realizado2024: number[];
  realizado2025: number[];
  realizado2026: number[];
}

interface IndicatorHeatmapProps {
  title: string;
  indicators: IndicatorData[];
  months: string[];
  onIndicatorsChange?: (indicators: IndicatorData[]) => void;
}

const YEARS = [2022, 2023, 2024, 2025, 2026];
const CURRENT_YEAR = 2026;

function getHeatmapColor(value: number, maxValue: number, type: "previsto" | "realizado"): string {
  if (value === 0) return "bg-muted";
  const intensity = Math.min(value / maxValue, 1);

  if (type === "previsto") {
    if (intensity > 0.7) return "bg-slate-500";
    if (intensity > 0.4) return "bg-slate-400";
    if (intensity > 0.2) return "bg-slate-300";
    return "bg-slate-200";
  } else {
    if (intensity > 0.7) return "bg-emerald-600";
    if (intensity > 0.4) return "bg-emerald-500";
    if (intensity > 0.2) return "bg-emerald-400";
    return "bg-emerald-300";
  }
}

function getRateColor(rate: number): string {
  if (rate >= 100) return "bg-emerald-500/20 text-emerald-700 font-medium";
  if (rate >= 70) return "bg-amber-500/20 text-amber-700 font-medium";
  return "bg-red-500/20 text-red-700 font-medium";
}

export function IndicatorHeatmap({ title, indicators: initialIndicators, months, onIndicatorsChange }: IndicatorHeatmapProps) {
  const [indicators, setIndicators] = useState<IndicatorData[]>(initialIndicators);
  const [selectedYears, setSelectedYears] = useState<number[]>([CURRENT_YEAR]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<IndicatorData | null>(null);
  const [addingToGroup, setAddingToGroup] = useState<string | null>(null);
  const [newIndicatorName, setNewIndicatorName] = useState("");

  const toggleYear = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const sortedSelectedYears = [...selectedYears].sort((a, b) => a - b);
  const showPrevisto = true;

  const allValues = [
    ...indicators.flatMap(i => i.previsto),
    ...sortedSelectedYears.flatMap(year => {
      const key = `realizado${year}` as keyof IndicatorData;
      return indicators.flatMap(ind => (ind[key] as number[] | undefined) || []);
    })
  ].filter(v => v !== undefined);
  const maxValue = Math.max(...allValues, 1);

  const groupsConfig = [
    { label: "Indicadores de Descoberta", start: 0, end: 6, taxaLabel: "Taxa de Descoberta" },
    { label: "Indicadores de Venda", start: 6, end: 12, taxaLabel: "Taxa de Venda" },
    { label: "Indicadores de Entrega", start: 12, end: 16, taxaLabel: "Taxa de Entrega" },
    { label: "Indicadores de Suporte", start: 16, end: indicators.length, taxaLabel: "Taxa de Eficiência" },
  ];

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    groupsConfig.reduce((acc, g) => ({ ...acc, [g.label]: true }), {})
  );

  const toggleGroup = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const calculateGroupRate = (groupStart: number, groupEnd: number, monthIdx: number): number => {
    let totalPrevisto = 0;
    let totalRealizado = 0;
    const groupInd = indicators.slice(groupStart, groupEnd);

    groupInd.forEach(ind => {
      totalPrevisto += ind.previsto[monthIdx] || 0;
      totalRealizado += (ind.realizado2026?.[monthIdx] || 0);
    });

    if (totalPrevisto === 0) return 0;
    return Math.round((totalRealizado / totalPrevisto) * 100);
  };

  const filteredIndicators = indicators.filter(ind =>
    ind.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const openEditDialog = (indicator: IndicatorData) => {
    setEditingIndicator(indicator);
    setEditDialogOpen(true);
  };

  const handleSaveIndicator = (updatedIndicator: IndicatorData) => {
    if (editingIndicator) {
      // Editing existing
      const newIndicators = indicators.map(ind => 
        ind.name === editingIndicator.name ? updatedIndicator : ind
      );
      setIndicators(newIndicators);
      onIndicatorsChange?.(newIndicators);
    } else {
      // Adding new
      const newIndicators = [...indicators, updatedIndicator];
      setIndicators(newIndicators);
      onIndicatorsChange?.(newIndicators);
    }
    setEditingIndicator(null);
  };

  const handleAddIndicator = (groupLabel: string, insertIndex: number) => {
    if (!newIndicatorName.trim()) {
      setAddingToGroup(null);
      return;
    }

    const newIndicator: IndicatorData = {
      name: newIndicatorName.trim(),
      previsto: Array(12).fill(0),
      realizado2022: Array(12).fill(0),
      realizado2023: Array(12).fill(0),
      realizado2024: Array(12).fill(0),
      realizado2025: Array(12).fill(0),
      realizado2026: Array(12).fill(0),
    };

    const newIndicators = [...indicators];
    newIndicators.splice(insertIndex, 0, newIndicator);
    setIndicators(newIndicators);
    onIndicatorsChange?.(newIndicators);
    setNewIndicatorName("");
    setAddingToGroup(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, groupLabel: string, insertIndex: number) => {
    if (e.key === "Enter") {
      handleAddIndicator(groupLabel, insertIndex);
    } else if (e.key === "Escape") {
      setAddingToGroup(null);
      setNewIndicatorName("");
    }
  };

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

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-0.5">
          <thead>
            <tr>
              <th className="text-left p-1 text-muted-foreground font-normal min-w-[200px] w-[200px] sticky left-0 bg-card z-10">
                Indicador
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

                  {showPrevisto && (
                    <th
                      className="text-center p-1 text-muted-foreground font-normal min-w-[60px] w-[60px]"
                    >
                      {month.slice(0, 3)} P
                    </th>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {groupsConfig.map((group, groupIdx) => {
              const groupIndicators = indicators
                .slice(group.start, group.end)
                .filter(ind => 
                  ind.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
                );

              if (groupIndicators.length === 0 && searchTerm.trim() !== "") {
                return null;
              }

              const isExpanded = expanded[group.label];

              return (
                <React.Fragment key={group.label}>
                  <tr>
                    <td
                      colSpan={1 + months.length * (sortedSelectedYears.length + (showPrevisto ? 1 : 0))}
                      className="p-2 pt-4 text-sm font-semibold text-foreground bg-muted/50 border-t border-border cursor-pointer hover:bg-muted/70 transition-colors sticky left-0 z-10"
                      onClick={() => toggleGroup(group.label)}
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        {group.label}
                      </div>
                    </td>
                  </tr>

                  {isExpanded && groupIndicators.map(indicator => (
                    <tr key={indicator.name}>
                      <td
                        className="p-1 text-foreground truncate max-w-[200px] w-[200px] h-8 align-middle sticky left-0 bg-card z-0"
                        title={indicator.name}
                      >
                        <div className="flex items-center gap-1">
                          <span className="truncate flex-1">{indicator.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 shrink-0 opacity-50 hover:opacity-100"
                            onClick={() => openEditDialog(indicator)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>

                      {months.map((_, monthIdx) => (
                        <React.Fragment key={monthIdx}>
                          {sortedSelectedYears.map(year => {
                            const key = `realizado${year}` as keyof IndicatorData;
                            const value = (indicator[key] as number[] | undefined)?.[monthIdx] ?? 0;
                            return (
                              <td key={`${monthIdx}-${year}`} className="p-0.5 w-[60px] h-8">
                                <div
                                  className={cn(
                                    "w-full h-full rounded flex items-center justify-center text-[10px] font-medium",
                                    getHeatmapColor(value, maxValue, "realizado"),
                                    value > 0 ? "text-white" : "text-muted-foreground"
                                  )}
                                  title={`Realizado ${year}: ${value}`}
                                >
                                  {value > 0 ? value : "-"}
                                </div>
                              </td>
                            );
                          })}

                          {showPrevisto && (
                            <td className="p-0.5 w-[60px] h-8">
                              <div
                                className={cn(
                                  "w-full h-full rounded flex items-center justify-center text-[10px] font-medium",
                                  getHeatmapColor(indicator.previsto[monthIdx], maxValue, "previsto"),
                                  indicator.previsto[monthIdx] > 0 ? "text-white" : "text-muted-foreground"
                                )}
                                title={`Previsto: ${indicator.previsto[monthIdx]}`}
                              >
                                {indicator.previsto[monthIdx] > 0 ? indicator.previsto[monthIdx] : "-"}
                              </div>
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}

                  {/* Add indicator row */}
                  {isExpanded && (
                    <tr>
                      <td
                        colSpan={1 + months.length * (sortedSelectedYears.length + (showPrevisto ? 1 : 0))}
                        className="p-1 sticky left-0 bg-card z-0"
                      >
                        {addingToGroup === group.label ? (
                          <Input
                            autoFocus
                            value={newIndicatorName}
                            onChange={(e) => setNewIndicatorName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, group.label, group.end)}
                            onBlur={() => handleAddIndicator(group.label, group.end)}
                            placeholder="Nome do indicador..."
                            className="h-7 text-xs max-w-[200px]"
                          />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setAddingToGroup(group.label)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar indicador
                          </Button>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* Taxa row */}
                  <tr className="bg-muted/30 font-medium">
                    <td className="p-1.5 text-right text-[11px] text-muted-foreground pr-3 sticky left-0 bg-card z-0">
                      {group.taxaLabel}
                    </td>

                    {months.map((_, monthIdx) => {
                      const taxa = calculateGroupRate(group.start, group.end, monthIdx);

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
                            colSpan={2}
                            className={cn(
                              "p-1 text-center text-[11px] rounded h-8 min-w-[120px]",
                              getRateColor(taxa)
                            )}
                          >
                            {taxa}%
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
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span>Realizado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-400"></div>
          <span>Previsto</span>
        </div>
      </div>

      <IndicatorEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        indicator={editingIndicator}
        onSave={handleSaveIndicator}
        months={months}
      />
    </div>
  );
}
