import { useEffect, useState } from "react";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };

export function InstalarApp() {
  const [evento, setEvento] = useState<PromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setEvento(e as PromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setEvento(null));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!evento) return null;

  return (
    <button
      onClick={async () => {
        await evento.prompt();
        setEvento(null);
      }}
      className="no-print fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 min-h-11 rounded-xl bg-gradient-to-r from-aurora via-aurora2 to-aurora3 px-4 py-2.5 font-display text-xs font-bold text-ink shadow-lg sm:left-auto"
    >
      Instalar app CODE
    </button>
  );
}
