export const LAST_CLIENT_STORAGE_KEY = "nostx.last_client";

/** 最後に使ったクライアントの key を取得する(未保存・SSR・localStorage 不可の環境では null) */
export const getLastClientKey = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_CLIENT_STORAGE_KEY);
  } catch {
    return null;
  }
};

/** 最後に使ったクライアントの key を localStorage に保存する */
export const setLastClientKey = (key: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_CLIENT_STORAGE_KEY, key);
  } catch {
    // localStorage が使えない環境では保存をあきらめる
  }
};
