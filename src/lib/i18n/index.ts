import { browser } from "$app/environment";
import { init, locale, register } from "svelte-i18n";

const defaultLocale = "en";
export const LOCALE_STORAGE_KEY = "nostx.locale";

register("en", () => import("./locales/en.json"));
register("ja", () => import("./locales/ja.json"));

const getSavedLocale = (): string | null => {
  if (!browser) return null;
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
};

/** 保存済みの言語選択があればそれを、なければブラウザの言語を初期値にする */
export const getInitialLocale = (): string => {
  const saved = getSavedLocale();
  if (saved) return saved;
  return browser ? window.navigator.language : defaultLocale;
};

/** 言語を切り替えて localStorage に保存する */
export const setLocale = (value: string) => {
  locale.set(value);
  if (browser) {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, value);
    } catch {
      // localStorage が使えない環境では保存をあきらめる
    }
  }
};

init({
  fallbackLocale: defaultLocale,
  initialLocale: getInitialLocale(),
});
