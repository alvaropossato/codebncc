import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { listarMinhasPraticas, type PraticaSalva } from "@/lib/praticas";
import { PUBLICOS_PCD } from "@/lib/curriculo";

export const Route = createFileRoute("/adaptacoes")({
  head: () => ({
    meta: [
      { title: "Adaptações PCD das minhas práticas — CODE" },
      {
        name: "description",
        content:
          "Veja todas as adaptações inclusivas geradas por público PCD, com filtros por tipo de deficiência e habilidade da BNCC.",
      },
      { property: "og:title", content: "Adaptações PCD das minhas práticas — CODE" },
      {
        property: "og:description",
        content:
          "Painel de adaptações para estudantes público-alvo da Educação Especial, filtrável por deficiência e habilidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Adaptacoes,
});

type Linha = {
  praticaId: string;
  titulo: string;
  serie: string;
  disciplina: string;
  habilidadeCodigo: string;
  habilidadeTexto: string;
  publico: string;
  sugestoes: string[];
  recursos: string;
  criadoEm: string;
};

function achatar(praticas: PraticaSalva[]): Linha[] {
  return praticas.flatMap((p) =>
    (p.dados?.adaptacoesPcd ?? []).map((a) => ({
      praticaId: p.id,
      titulo: p.titulo,
      serie: p.serie,
      disciplina: p.disciplina,
      habilidadeCodigo: p.dados?.codigo || p.habilidade_codigo || "",
      habilidadeTexto: p.dados?.habilidade || p.habilidade_texto || "",
      publico: a.publico,
      sugestoes: a.sugestoes ?? [],
      recursos: a.recursos ?? "",
      criadoEm: p.created_at,
    })),
  );
}

function Adaptacoes() {
  const { user, carregando } = useAuth();
  const [publico, setPublico] = useState("todos");
  const [habilidade, setHabilidade] = useState("todas");
  const [busca, setBusca] = useState("");

  const { data = [], isPending } = useQuery({
    queryKey: ["adaptacoes", user?.id],
    queryFn: () => listarMinhasPraticas(user!.id),
    enabled: !!user,
  });

  const linhas = useMemo(() => achatar(data), [data]);

  const habilidades = useMemo(
    () => Array.from(new Set(linhas.map((l) => l.habilidadeCodigo).filter(Boolean))).sort(),
    [linhas],
  );

  const filtradas = linhas.filter((l) => {
    if (publico !== "todos" && l.publico !== publico) return false;
    if (habilidade !== "todas" && l.habilidadeCodigo !== habilidade) return false;
    if (busca.trim()) {
      const t = busca.toLowerCase();
      const alvo = `${l.titulo} ${l.publico} ${l.sugestoes.join(" ")} ${l.recursos}`.toLowerCase();
      if (!alvo.includes(t)) return false;
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-ink font-sans text-mist">
      <div className="pointer-events-none absolute inset-0 aurora-glow" />
      <div className="relative mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="font-display text-base font-bold text-white">
            CODE
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/historico"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist/70 hover:border-aurora/40"
            >
              Meu histórico
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist/70 hover:border-aurora/40"
            >
              Nova prática
            </Link>
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-white">Adaptações PCD</h1>
        <p className="mt-1 text-sm text-mist/55">
          Todas as adaptações inclusivas geradas nas suas práticas, filtráveis por deficiência e
          habilidade.
        </p>

        {!carregando && !user && (
          <div className="panel mt-5 rounded-3xl p-6">
            <p className="text-sm text-mist/70">
              Entre com sua conta de professor para ver as adaptações das práticas salvas.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-block rounded-xl bg-gradient-to-r from-aurora via-aurora2 to-aurora3 px-4 py-2 font-display text-sm font-bold text-ink"
            >
              Entrar ou cadastrar
            </Link>
          </div>
        )}

        {user && (
          <>
            <div className="panel mt-5 grid gap-3 rounded-3xl p-4 sm:grid-cols-3">
              <label className="text-xs text-mist/50">
                Tipo de necessidade
                <select
                  value={publico}
                  onChange={(e) => setPublico(e.target.value)}
                  className="field field-focus mt-1"
                >
                  <option value="todos" className="bg-ink-soft">
                    Todas as deficiências
                  </option>
                  {PUBLICOS_PCD.map((p) => (
                    <option key={p} value={p} className="bg-ink-soft">
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-mist/50">
                Habilidade
                <select
                  value={habilidade}
                  onChange={(e) => setHabilidade(e.target.value)}
                  className="field field-focus mt-1"
                >
                  <option value="todas" className="bg-ink-soft">
                    Todas as habilidades
                  </option>
                  {habilidades.map((h) => (
                    <option key={h} value={h} className="bg-ink-soft">
                      {h}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-mist/50">
                Buscar
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="palavra na sugestão…"
                  className="field field-focus mt-1"
                />
              </label>
            </div>

            {isPending && <p className="mt-6 text-sm text-mist/55">Carregando adaptações…</p>}

            {!isPending && filtradas.length === 0 && (
              <p className="mt-6 text-sm text-mist/55">
                Nenhuma adaptação encontrada com esses filtros.
              </p>
            )}

            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-mist/40">
              {filtradas.length} adaptação(ões)
            </p>

            <div className="mt-3 space-y-4">
              {filtradas.map((l, i) => (
                <article key={`${l.praticaId}-${l.publico}-${i}`} className="panel rounded-3xl p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-aurora/15 px-3 py-1 text-[11px] font-semibold text-aurora">
                      {l.publico}
                    </span>
                    {l.habilidadeCodigo && (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-mist/60">
                        {l.habilidadeCodigo}
                      </span>
                    )}
                    <span className="text-[11px] text-mist/40">
                      {l.disciplina} · {l.serie}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-base font-bold text-white">{l.titulo}</h2>
                  {l.habilidadeTexto && (
                    <p className="mt-1 text-xs leading-relaxed text-mist/50">{l.habilidadeTexto}</p>
                  )}
                  <ul className="mt-3 space-y-1.5 text-sm text-mist/75">
                    {l.sugestoes.map((s, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-aurora" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  {l.recursos && (
                    <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs text-mist/60">
                      Recursos: {l.recursos}
                    </p>
                  )}
                  <Link
                    to="/p/$id"
                    params={{ id: l.praticaId }}
                    className="mt-3 inline-block text-xs text-aurora hover:underline"
                  >
                    Ver prática completa →
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
