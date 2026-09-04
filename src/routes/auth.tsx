import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — CODE | Práticas BNCC Computação" },
      {
        name: "description",
        content:
          "Crie sua conta de professor no CODE para salvar o histórico de práticas pedagógicas alinhadas à BNCC Computação e aos PCN.",
      },
      { property: "og:title", content: "Entrar no CODE" },
      {
        property: "og:description",
        content: "Cadastro de professores para salvar e compartilhar práticas alinhadas à BNCC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [escola, setEscola] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setAviso("");
    setCarregando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        navigate({ to: "/historico" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session && data.user) {
          await supabase.from("perfis").upsert({ id: data.user.id, nome, escola });
          navigate({ to: "/historico" });
        } else {
          setAviso("Cadastro criado! Confirme o e-mail enviado para você e depois entre.");
        }
      }
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  async function google() {
    setErro("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setErro("Não foi possível entrar com Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/historico" });
  }

  return (
    <div className="relative min-h-screen bg-ink font-sans text-mist">
      <div className="pointer-events-none absolute inset-0 aurora-glow" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8 sm:px-6 sm:py-10">
        <Link to="/" className="mb-6 text-xs text-mist/50 hover:text-aurora">
          ← Voltar ao gerador
        </Link>
        <div className="panel rounded-2xl p-4 sm:rounded-3xl sm:p-6">
          <h1 className="font-display text-2xl font-bold text-white">
            {modo === "entrar" ? "Entrar" : "Criar conta de professor"}
          </h1>
          <p className="mt-2 text-sm text-mist/55">
            O cadastro é opcional: serve para salvar seu histórico de práticas.
          </p>

          <button
            onClick={google}
            className="mt-5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
          >
            Continuar com Google
          </button>

          <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-widest text-mist/35">
            <span className="h-px flex-1 bg-white/10" /> ou <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={enviar} className="space-y-3">
            {modo === "cadastrar" && (
              <>
                <input
                  className="field field-focus"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <input
                  className="field field-focus"
                  placeholder="Escola"
                  value={escola}
                  onChange={(e) => setEscola(e.target.value)}
                />
              </>
            )}
            <input
              type="email"
              required
              className="field field-focus"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              minLength={6}
              className="field field-focus"
              placeholder="Senha (mín. 6 caracteres)"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {erro && <p className="text-sm text-aurora3">{erro}</p>}
            {aviso && <p className="text-sm text-aurora">{aviso}</p>}
            <button
              disabled={carregando}
              className="w-full rounded-xl bg-gradient-to-r from-aurora via-aurora2 to-aurora3 px-5 py-3 font-display text-sm font-bold text-ink disabled:opacity-60"
            >
              {carregando ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            onClick={() => setModo(modo === "entrar" ? "cadastrar" : "entrar")}
            className="mt-4 w-full text-xs text-mist/55 hover:text-aurora"
          >
            {modo === "entrar"
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Entrar"}
          </button>
          <Link to="/" className="mt-3 block text-center text-xs text-mist/45 hover:text-aurora">
            Usar sem cadastro
          </Link>
        </div>
      </div>
    </div>
  );
}
