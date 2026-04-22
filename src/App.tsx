import { useEffect, useMemo, useState } from "react";
import { calculators, findCalculator } from "./calculators/registry";
import { I18nProvider, useI18n } from "./shared/i18n/I18nProvider";
import { LanguageSwitcher } from "./shared/components/LanguageSwitcher";
import { useHashRoute } from "./shared/hooks/useHashRoute";

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}

function Shell() {
  const { t } = useI18n();
  const [route, setRoute] = useHashRoute();
  const active = useMemo(() => findCalculator(route || null), [route]);
  const [navOpen, setNavOpen] = useState(false);

  const activeLabels = active.labels(t);

  useEffect(() => {
    document.title = `${activeLabels.title} · ${t.appTitle}`;
  }, [activeLabels.title, t.appTitle]);

  useEffect(() => {
    if (!route) setRoute(active.id);
  }, [route, active.id, setRoute]);

  const ActiveComponent = active.Component;

  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
      <aside
        className="
          md:w-72 md:shrink-0 md:border-r border-b md:border-b-0
          border-[rgba(38,48,99,0.5)]
          bg-[rgba(11,16,32,0.5)] backdrop-blur-sm
          md:sticky md:top-0 md:h-dvh
          flex flex-col
        "
      >
        <div className="px-5 py-5 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-2 group">
            <span className="text-2xl">🧮</span>
            <span className="font-semibold text-text group-hover:text-white">{t.appTitle}</span>
          </a>
          <button
            type="button"
            className="md:hidden btn-ghost"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? t.close : t.menu}
          </button>
        </div>

        <nav className={`${navOpen ? "block" : "hidden"} md:block px-3 pb-4 flex-1 overflow-y-auto`}>
          <ul className="flex flex-col gap-1">
            {calculators.map((c) => {
              const isActive = c.id === active.id;
              const labels = c.labels(t);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setRoute(c.id);
                      setNavOpen(false);
                    }}
                    className={`
                      w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                      ${
                        isActive
                          ? "bg-[rgba(139,92,246,0.16)] border border-[rgba(139,92,246,0.35)]"
                          : "border border-transparent hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-lg"
                      style={{ background: `${c.accent}26`, color: c.accent }}
                    >
                      {c.emoji}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-text">{labels.title}</span>
                      {labels.subtitle && (
                        <span className="text-xs text-text-dim">{labels.subtitle}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 px-3 text-[11px] text-text-mute leading-relaxed">
            {t.moreComing} <span className="block mt-1 opacity-70">{t.moreComingHint}</span>
          </p>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 sm:py-10">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
              style={{ background: `${active.accent}26`, color: active.accent }}
            >
              {active.emoji}
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-text leading-tight">
                {activeLabels.title}
              </h1>
              {activeLabels.subtitle && (
                <p className="text-sm text-text-dim">{activeLabels.subtitle}</p>
              )}
            </div>
          </div>
          <LanguageSwitcher />
        </header>

        {activeLabels.description && (
          <p className="-mt-3 mb-5 text-sm text-text-dim max-w-2xl leading-relaxed">
            {activeLabels.description}
          </p>
        )}

        <ActiveComponent />
      </main>
    </div>
  );
}
