import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FichaTecnicaTab } from "./FichaTecnicaTab";
import { PrecosTab } from "./PrecosTab";
import { ResumoTab } from "./ResumoTab";
import { ProjecaoItem, FichaTecnicaItem, PrecoItem, ResumoReceita } from "./types";

interface ProjecaoSidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProjecaoItem | null;
  type: "despesa" | "receita";
  onUpdate: (item: ProjecaoItem) => void;
}

export function ProjecaoSidePanel({
  open,
  onOpenChange,
  item,
  type,
  onUpdate,
}: ProjecaoSidePanelProps) {
  if (!item) return null;

  const handleFichaTecnicaChange = (fichaTecnica: FichaTecnicaItem[]) => {
    onUpdate({ ...item, fichaTecnica });
  };

  const handlePrecosChange = (precos: PrecoItem[]) => {
    onUpdate({ ...item, precos });
  };

  const handleResumoChange = (resumo: ResumoReceita) => {
    onUpdate({ ...item, resumo });
  };

  const defaultResumo: ResumoReceita = item.resumo || {
    precoVendaUnidade: 0,
    custoTotalUnitario: 0,
    custoVariavel: 0,
    impostoPercentual: 6,
    impostoValor: 0,
    custoAquisicao: 0,
    margemContribuicaoPercent: 0,
    margemContribuicaoValor: 0,
    lucroMedioPercent: 0,
    lucroMedioValor: 0,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{item.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue={item.hasFichaTecnica ? "ficha" : (type === "despesa" ? "precos" : "resumo")}>
            <TabsList className="w-full">
              {item.hasFichaTecnica && (
                <TabsTrigger value="ficha" className="flex-1">
                  Ficha Técnica
                </TabsTrigger>
              )}
              {type === "despesa" ? (
                <TabsTrigger value="precos" className="flex-1">
                  Preços
                </TabsTrigger>
              ) : (
                <TabsTrigger value="resumo" className="flex-1">
                  Resumo
                </TabsTrigger>
              )}
            </TabsList>

            {item.hasFichaTecnica && (
              <TabsContent value="ficha" className="mt-4">
                <FichaTecnicaTab
                  items={item.fichaTecnica || []}
                  onChange={handleFichaTecnicaChange}
                  readonly={false}
                />
              </TabsContent>
            )}

            {type === "despesa" ? (
              <TabsContent value="precos" className="mt-4">
                <PrecosTab
                  items={item.precos || []}
                  onChange={handlePrecosChange}
                />
              </TabsContent>
            ) : (
              <TabsContent value="resumo" className="mt-4">
                <ResumoTab
                  resumo={defaultResumo}
                  onChange={handleResumoChange}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
