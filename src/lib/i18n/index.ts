import { DICTIONARY, type Lang, type TranslationKey } from "./dictionary";

export { DICTIONARY };
export type { Lang, TranslationKey };

/** Translate a single key for a given language. */
export function translate(lang: Lang, key: TranslationKey): string {
  return DICTIONARY[lang][key];
}

/** Bind a translator to a language: returns t(key) -> string. */
export function createTranslator(lang: Lang): (key: TranslationKey) => string {
  return (key: TranslationKey) => DICTIONARY[lang][key];
}
