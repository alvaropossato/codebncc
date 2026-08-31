import { supabase } from "@/integrations/supabase/client";
import type { Pratica } from "./curriculo";

export type Contexto = {
  disciplina: string;
  serie: string;
  conteudo: string;
  tema: string;
  eixo: string;
  duracao: string;
};

export type PraticaSalva = Contexto & {
  id: string;
  user_id: string | null;
  titulo: string;
  dados: Pratica;
  created_at: string;
};

export async function salvarPratica(
  pratica: Pratica,
  ctx: Contexto,
  userId: string | null,
): Promise<string> {
  const { data, error } = await supabase
    .from("praticas")
    .insert({
      user_id: userId,
      titulo: pratica.titulo,
      dados: pratica as never,
      ...ctx,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function carregarPratica(id: string): Promise<PraticaSalva | null> {
  const { data, error } = await supabase.from("praticas").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as PraticaSalva) ?? null;
}

export async function listarMinhasPraticas(userId: string): Promise<PraticaSalva[]> {
  const { data, error } = await supabase
    .from("praticas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as PraticaSalva[];
}

export async function excluirPratica(id: string): Promise<void> {
  const { error } = await supabase.from("praticas").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
