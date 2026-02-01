import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

interface IndicatorData {
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

export function IndicatorHeatmap({ title, indicators, months }: IndicatorHeatmapProps) {
  const [selectedYears, setSelectedYears] = useState<number[]>([CURRENT_YEAR]);
  const [searchTerm, setSearchTerm] = useState("");

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
    { label: "Indicadores de Descoberta", start: 0, end: 5, taxaLabel: "Taxa de Descoberta" },
    { label: "Indicadores de Venda",      start: 5, end: 10, taxaLabel: "Taxa de Venda" },
    { label: "Indicadores de Entrega",    start: 10, end: 15, taxaLabel: "Taxa de Entrega" },
    { label: "Indicadores de Suporte",    start: 15, end: indicators.length, taxaLabel: "Taxa de Eficiência" },
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

  // Filtra indicadores com base no termo de busca
  const filteredIndicators = indicators.filter(ind =>
    ind.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Função auxiliar para verificar se um grupo tem algum indicador visível após filtro
  const groupHasVisibleIndicators = (start: number, end: number) => {
    return filteredIndicators.some(ind => {
      const index = indicators.indexOf(ind);
      return index >= start && index < end;
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>

      {/* Barra de busca */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar indicador..."
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

      {/* Guias de anos */}
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
              <th className="text-left p-1 text-muted-foreground font-normal min-w-[160px] w-[160px] sticky left-0 bg-card z-10">
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
            {groupsConfig.map(group => {
              // Filtra apenas os indicadores do grupo que batem com a busca
              const groupIndicators = indicators
                .slice(group.start, group.end)
                .filter(ind => 
                  ind.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
                );

              // Se não houver indicadores visíveis no grupo após filtro, pula o grupo inteiro
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
                        className="p-1 text-foreground truncate max-w-[160px] w-[160px] h-8 align-middle sticky left-0 bg-card z-0"
                        title={indicator.name}
                      >
                        {indicator.name}
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

                  {/* Linha da Taxa – merge nas duas últimas colunas */}
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
    </div>
  );
}