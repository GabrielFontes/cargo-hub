export interface ProjecaoItem {
  id: string;
  name: string;
  conta?: string; // Plano de contas
  hasFichaTecnica: boolean;
  // Valores realizados por ano (R$ totais)
  valores2022: number[];
  valores2023: number[];
  valores2024: number[];
  valores2025: number[];
  valores2026: number[];
  // Valores previstos (R$ totais)
  previsto: number[];

  // ===== Metadados (PDF) =====
  // Receitas
  precoUnitario?: number;       // Preço de venda unitário
  medida?: string;              // Atendimento, Sessão, un, etc
  cmv?: number;                 // Custo de mercadoria vendida
  impostoPercent?: number;      // %Imposto
  variavelPercent?: number;     // %Variável
  comissaoPercent?: number;     // %Comissão
  // Despesas (insumos)
  faixaMin?: number;            // Faixa de preço mínima
  faixaMax?: number;            // Faixa de preço máxima
  precoMedio?: number;          // Preço médio do insumo

  // Quantidades mês a mês (ano vigente)
  qtdProj?: number[];           // 12 — quantidade prevista
  qtdReal?: number[];           // 12 — quantidade realizada

  // Sazonalidade (apenas para receitas)
  sazonalidade?: {
    notas: number[];
    percentuais: number[];
  };
  // Ficha técnica
  fichaTecnica?: FichaTecnicaItem[];
  // Preços
  precos?: PrecoItem[];
  // Resumo (para receitas)
  resumo?: ResumoReceita;
}

export interface FichaTecnicaItem {
  id: string;
  materiaPrima: string;
  composto: boolean;
  fixo: boolean;
  // CUSTO
  custoUn: string;        // Un. (Unidade, Caixa, Pacote)
  custoMedida: number;    // qtd da embalagem (ex: 100, 50)
  custoUnitario: number;  // R$ Custo Unit
  // CAPACIDADE
  capUn: string;          // un, mL, ml, par, etc
  capMedida: number;      // qtd referência
  qntReal: number;        // % efetivo (1.00 = 100%)
  qnt: number;            // qtd usada por atendimento
  custoTotal: number;     // calculado
}

export interface PrecoItem {
  id: string;
  mes: number;
  ano: number;
  valor: number;
  descricao?: string;
}

export interface ResumoReceita {
  precoVendaUnidade: number;
  custoTotalUnitario: number;
  custoVariavel: number;
  impostoPercentual: number;
  impostoValor: number;
  custoAquisicao: number;
  comissaoPercentual: number;
  comissaoValor: number;
  margemContribuicaoPercent: number;
  margemContribuicaoValor: number;
  lucroMedioPercent: number;
  lucroMedioValor: number;
}

export interface IndicadorProjecao {
  id: string;
  name: string;
  qtdProj: number[];   // 12 meses
  qtdReal: number[];   // 12 meses
  receitaId?: string;  // referência à receita vinculada (opcional)
}
