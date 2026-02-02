export interface ProjecaoItem {
  id: string;
  name: string;
  conta?: string; // Plano de contas
  hasFichaTecnica: boolean;
  // Valores realizados por ano
  valores2022: number[];
  valores2023: number[];
  valores2024: number[];
  valores2025: number[];
  valores2026: number[];
  // Valores previstos (só ano atual)
  previsto: number[];
  // Sazonalidade (apenas para receitas)
  sazonalidade?: {
    notas: number[]; // 1-3 para cada mês
    percentuais: number[]; // calculado automaticamente
  };
  // Ficha técnica
  fichaTecnica?: FichaTecnicaItem[];
  // Preços (para despesas)
  precos?: PrecoItem[];
  // Resumo (para receitas)
  resumo?: ResumoReceita;
}

export interface FichaTecnicaItem {
  id: string;
  materiaPrima: string;
  composto: boolean;
  fixo: boolean;
  custo: number;
  unidade: string;
  medida: string;
  qntReal: number;
  qnt: number;
  custoTotal: number;
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
  margemContribuicaoPercent: number;
  margemContribuicaoValor: number;
  lucroMedioPercent: number;
  lucroMedioValor: number;
}
