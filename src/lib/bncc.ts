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
  /** origem: BNCC, Currículo Paulista ou ambos */
  f?: Fonte;
};

/** Fonte curricular escolhida pelo professor. */
export type Fonte = "bncc" | "paulista" | "ambos";

export const FONTES: { value: Fonte; label: string; curto: string }[] = [
  { value: "bncc", label: "BNCC", curto: "BNCC" },
  { value: "paulista", label: "Currículo Paulista", curto: "Paulista" },
  { value: "ambos", label: "BNCC + Currículo Paulista", curto: "Ambos" },
];

let cache: BnccItem[] | null = null;
let cachePaulista: BnccItem[] | null = null;

export async function carregarBncc(): Promise<BnccItem[]> {
  if (!cache) {
    const mod = await import("./bncc-ef.json");
    cache = ((mod.default ?? mod) as unknown as BnccItem[]).map((i) => ({
      ...i,
      f: "bncc" as Fonte,
    }));
  }
  return cache;
}

export async function carregarPaulista(): Promise<BnccItem[]> {
  if (!cachePaulista) {
    const mod = await import("./curriculo-paulista.json");
    cachePaulista = ((mod.default ?? mod) as unknown as BnccItem[]).map((i) => ({
      ...i,
      f: "paulista" as Fonte,
    }));
  }
  return cachePaulista;
}

/** Carrega o conjunto de habilidades conforme a fonte escolhida. */
export async function carregarCurriculo(fonte: Fonte): Promise<BnccItem[]> {
  if (fonte === "bncc") return carregarBncc();
  if (fonte === "paulista") return carregarPaulista();
  const [b, p] = await Promise.all([carregarBncc(), carregarPaulista()]);
  const mapa = new Map<string, BnccItem>();
  for (const i of b) mapa.set(i.c, i);
  for (const i of p) {
    const existente = mapa.get(i.c);
    mapa.set(i.c, existente ? { ...existente, f: "ambos" } : i);
  }
  return [...mapa.values()];
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
