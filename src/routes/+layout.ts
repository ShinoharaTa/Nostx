// +layout.ts
import { browser } from "$app/environment";
import { getInitialLocale } from "$lib/i18n";
import { locale, waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  if (browser) {
    // localStorage に保存された言語選択があればそれを優先し、なければブラウザの言語を使う
    locale.set(getInitialLocale());
  }
  await waitLocale();
};
