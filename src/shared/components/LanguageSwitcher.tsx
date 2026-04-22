import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { LOCALE_FLAGS, LOCALE_NAMES, SUPPORTED_LOCALES } from "../i18n/locales";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="btn-ghost flex items-center gap-2 text-sm"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.language}
        title={t.language}
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="
            absolute right-0 mt-2 min-w-40 z-20
            rounded-xl border border-[rgba(38,48,99,0.65)]
            bg-[rgba(17,24,52,0.96)] backdrop-blur-md
            shadow-xl shadow-black/30 overflow-hidden
          "
        >
          {SUPPORTED_LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                  transition-colors
                  ${l === locale
                    ? "bg-[rgba(139,92,246,0.18)] text-text"
                    : "text-text-dim hover:bg-white/[0.05] hover:text-text"}
                `}
              >
                <span className="text-base leading-none">{LOCALE_FLAGS[l]}</span>
                <span>{LOCALE_NAMES[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
