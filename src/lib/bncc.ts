/**
 * Dados oficiais da BNCC (Ensino Fundamental, documento 2018):
 * unidades temáticas / campos de atuação / eixos, objetos de conhecimento
 * e habilidades por componente curricular e ano.
 */
export type BnccItem = {
  /** código da habilidade, ex.: EF02MA01 */
  c: string;
  /** componente curricular */
  d: string;
  /** anos aos quais a habilidade se aplica */
  a: number[];
  /** unidade temática (ou campo de atuação / eixo) */
  u: string;
  /** objetos de conhecimento */
  o: string[];
  /** texto da habilidade */
  t: string;
};

let cache: BnccItem[] | null = null;

export async function carregarBncc(): Promise<BnccItem[]> {
  if (!cache) {
    const mod = await import("./bncc-ef.json");
    cache = (mod.default ?? mod) as unknown as BnccItem[];
  }
  return cache;
}

/** "3º ano" -> 3 ; Educação Infantil -> null */
export function anoDaSerie(serie: string): number | null {
  const m = serie.match(/^(\d)º ano$/);
  return m ? Number(m[1]) : null;
}

export function filtrar(itens: BnccItem[], disciplina: string, serie: string): BnccItem[] {
  const ano = anoDaSerie(serie);
  if (ano === null) return [];
  return itens.filter((i) => i.d === disciplina && i.a.includes(ano));
}

function unicos(v: string[]): string[] {
  return [...new Set(v.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function unidadesTematicas(itens: BnccItem[]): string[] {
  return unicos(itens.map((i) => i.u));
}

export function objetosDeConhecimento(itens: BnccItem[], unidade: string): string[] {
  return unicos(itens.filter((i) => !unidade || i.u === unidade).flatMap((i) => i.o));
}

export function habilidades(
  itens: BnccItem[],
  unidade: string,
  objeto: string,
): BnccItem[] {
  return itens
    .filter((i) => (!unidade || i.u === unidade) && (!objeto || i.o.includes(objeto)))
    .sort((a, b) => a.c.localeCompare(b.c));
}
