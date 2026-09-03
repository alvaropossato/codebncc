ALTER TABLE public.praticas
  ADD COLUMN IF NOT EXISTS unidade_tematica text,
  ADD COLUMN IF NOT EXISTS objeto_conhecimento text,
  ADD COLUMN IF NOT EXISTS habilidade_codigo text,
  ADD COLUMN IF NOT EXISTS habilidade_texto text;