CREATE TABLE public.perfis (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  escola TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfis_own" ON public.perfis FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.praticas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  titulo TEXT NOT NULL DEFAULT '',
  disciplina TEXT NOT NULL DEFAULT '',
  serie TEXT NOT NULL DEFAULT '',
  conteudo TEXT NOT NULL DEFAULT '',
  tema TEXT NOT NULL DEFAULT '',
  eixo TEXT NOT NULL DEFAULT '',
  duracao TEXT NOT NULL DEFAULT '',
  dados JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX praticas_user_idx ON public.praticas (user_id, created_at DESC);
GRANT SELECT, INSERT ON public.praticas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.praticas TO authenticated;
GRANT ALL ON public.praticas TO service_role;
ALTER TABLE public.praticas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "praticas_select_publico" ON public.praticas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "praticas_insert_anon" ON public.praticas FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "praticas_insert_auth" ON public.praticas FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "praticas_update_own" ON public.praticas FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "praticas_delete_own" ON public.praticas FOR DELETE TO authenticated USING (user_id = auth.uid());