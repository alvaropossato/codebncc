import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { excluirPratica, listarMinhasPraticas } from "@/lib/praticas";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Meu histórico de práticas — Compêta" },
      {
        name: "description",
        content:
          "Consulte, compartilhe e imprima as práticas de BNCC Computação que você já gerou no Compêta.",
      },
      { property: "og:title", content: "Meu histórico de práticas — Compêta" },
      {
        property: "og:description",
        content: "Histórico salvo das práticas pedagógicas geradas pelo professor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Historico,
});

function Historico() {
  const { user, carregando } = useAuth();
  const qc = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["historico", user?.id],
    queryFn: () => listarMinhasPraticas(user!.id),
    enabled: !!user,
  });

  return (
    <div className="relative min-h-screen bg-ink font-sans text-mist">
      <div className="pointer-events-none absolute inset-0 aurora-glow" />
      <div className="relative mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="font-display text-base font-bold text-white">
            Compêta
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist/70 hover:border-aurora/40"
            >
              Nova prática
            </Link>
            {user && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist/70"
              >
                Sair
              </button>
            )}
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-white">Meu histórico</h1>

        {!carregando && !user && (
          <div className="panel mt-5 rounded-3xl p-6">
            <p className="text-sm text-mist/70">
              Entre com sua conta de professor para ver as práticas salvas. Você também pode
              continuar usando o gerador sem cadastro.
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                to="/auth"
                className="rounded-xl bg-gradient-to-r from-aurora via-aurora2 to-aurora3 px-4 py-2 font-display text-sm font-bold text-ink"
              >
                Entrar ou cadastrar
              </Link>
              <Link
                to="/"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-mist/70"
              >
                Usar sem cadastro
              </Link>
            </div>
          </div>
        )}

        {user && isPending && <p className="mt-5 text-sm text-mist/55">Carregando…</p>}

        {user && data && data.length === 0 && (
          <p className="mt-5 text-sm text-mist/55">Você ainda não salvou nenhuma prática.</p>
        )}

        <div className="mt-5 space-y-3">
          {data?.map((p) => (
            <div
              key={p.id}
              className="panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4"
            >
              <div>
                <p className="font-display text-base font-bold text-white">{p.titulo}</p>
                <p className="mt-1 text-xs text-mist/50">
                  {p.serie} · {p.disciplina} · {p.conteudo} · {p.eixo}
                </p>
                <p className="mt-1 text-[11px] text-mist/35">
                  {new Date(p.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/p/$id"
                  params={{ id: p.id }}
                  className="rounded-lg border border-aurora/40 bg-aurora/10 px-3 py-1.5 text-xs font-semibold text-aurora"
                >
                  Abrir
                </Link>
                <button
                  onClick={async () => {
                    await excluirPratica(p.id);
                    qc.invalidateQueries({ queryKey: ["historico", user?.id] });
                  }}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist/70"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
