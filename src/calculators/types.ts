import type { ComponentType } from "react";
import type { Translations } from "../shared/i18n/locales";

/**
 * A calculator entry. The `labels` function pulls title/subtitle/description
 * from the current translations bundle so the sidebar + header update live
 * when the user changes language.
 */
export interface CalculatorMeta {
  id: string;
  emoji: string;
  accent: string;
  labels: (t: Translations) => {
    title: string;
    subtitle?: string;
    description?: string;
  };
  Component: ComponentType;
}
