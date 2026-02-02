import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumoReceita } from "./types";

interface ResumoTabProps {
  resumo: ResumoReceita;
  onChange: (resumo: ResumoReceita) => void;
}

export function ResumoTab({ resumo, onChange }: ResumoTabProps) {
  const updateField = (field: keyof ResumoReceita, value: number) => {
    const newResumo = { ...resumo, [field]: value };
    
    // Recalcula valores automáticos
    const custoTotal = newResumo.custoTotalUnitario + newResumo.custoVariavel + newResumo.impostoValor + newResumo.custoAquisicao;
    const margemValor = newResumo.precoVendaUnidade - custoTotal;
    const margemPercent = newResumo.precoVendaUnidade > 0 
      ? (margemValor / newResumo.precoVendaUnidade) * 100 
      : 0;
    
    newResumo.margemContribuicaoValor = margemValor;
    newResumo.margemContribuicaoPercent = margemPercent;
    newResumo.lucroMedioValor = margemValor;
    newResumo.lucroMedioPercent = margemPercent;
    
    // Calcula imposto a partir do percentual
    if (field === "impostoPercentual") {
      newResumo.impostoValor = (newResumo.precoVendaUnidade * value) / 100;
    }
    
    onChange(newResumo);
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary text-primary-foreground p-3 rounded-t-lg text-center font-semibold">
        RESUMO
      </div>

      <div className="space-y-3">
        {/* Preço de venda */}
        <div className="flex items-center justify-between py-2 border-b">
          <Label className="text-sm">Preço de venda por unidade</Label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input
              type="number"
              value={resumo.precoVendaUnidade}
              onChange={(e) => updateField("precoVendaUnidade", parseFloat(e.target.value) || 0)}
              className="h-7 w-24 text-right text-sm font-semibold"
              step="0.01"
            />
          </div>
        </div>

        {/* Custo total unitário */}
        <div className="flex items-center justify-between py-2 border-b bg-muted/30 px-2 rounded">
          <Label className="text-sm text-muted-foreground">Custo total unitário (Produto)</Label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input
              type="number"
              value={resumo.custoTotalUnitario}
              onChange={(e) => updateField("custoTotalUnitario", parseFloat(e.target.value) || 0)}
              className="h-7 w-24 text-right text-sm"
              step="0.01"
            />
          </div>
        </div>

        {/* Custo variável */}
        <div className="flex items-center justify-between py-2 border-b">
          <Label className="text-sm">(-) Custo VARIÁVEL por mercadoria</Label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input
              type="number"
              value={resumo.custoVariavel}
              onChange={(e) => updateField("custoVariavel", parseFloat(e.target.value) || 0)}
              className="h-7 w-24 text-right text-sm"
              step="0.01"
            />
          </div>
        </div>

        {/* Imposto */}
        <div className="flex items-center justify-between py-2 border-b">
          <Label className="text-sm">(-) Imposto</Label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded">
              <Input
                type="number"
                value={resumo.impostoPercentual}
                onChange={(e) => updateField("impostoPercentual", parseFloat(e.target.value) || 0)}
                className="h-5 w-12 text-right text-xs border-0 bg-transparent p-0"
                step="0.01"
              />
              <span className="text-xs">%</span>
            </div>
            <span className="text-sm">R$ {resumo.impostoValor.toFixed(2)}</span>
          </div>
        </div>

        {/* Custo de aquisição */}
        <div className="flex items-center justify-between py-2 border-b">
          <Label className="text-sm">(-) Custo de Aquisição de cliente</Label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">R$</span>
            <Input
              type="number"
              value={resumo.custoAquisicao}
              onChange={(e) => updateField("custoAquisicao", parseFloat(e.target.value) || 0)}
              className="h-7 w-24 text-right text-sm"
              step="0.01"
            />
          </div>
        </div>

        {/* Margem de contribuição */}
        <div className="flex items-center justify-between py-2 border-b bg-emerald-50 px-2 rounded">
          <Label className="text-sm font-medium">Margem de Contribuição</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-emerald-100 px-2 py-1 rounded">
              {resumo.margemContribuicaoPercent.toFixed(2)}%
            </span>
            <span className="text-sm font-semibold">R$ {resumo.margemContribuicaoValor.toFixed(2)}</span>
          </div>
        </div>

        {/* Lucro médio */}
        <div className="flex items-center justify-between py-2 bg-amber-50 px-2 rounded">
          <Label className="text-sm font-medium">Lucro médio por venda</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-amber-100 px-2 py-1 rounded">
              {resumo.lucroMedioPercent.toFixed(2)}%
            </span>
            <span className="text-sm font-semibold">R$ {resumo.lucroMedioValor.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
