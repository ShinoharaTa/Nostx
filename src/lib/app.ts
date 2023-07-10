import { browser } from "$app/environment";
import { nip19, nip05 } from "nostr-tools";

export interface Config {
  client: string;
  auto: boolean;
}

export const updateLocalStorage = (config: Config): void => {
  localStorage.setItem("config", JSON.stringify(config));
  return;
};

export const getLocalStorage = (): Config => {
  if (browser) {
    const ls = localStorage.getItem("config");
    return ls ? JSON.parse(ls) : { client: "iris", auto: false };
  }
  return { client: "", auto: false };
};

export interface CheckKey {
  id: string;
  type: string;
}

export const checkNip19 = (nip19_key: string): CheckKey | null => {
  try {
    let object = nip19.decode(nip19_key);
    return {
      id: nip19_key,
      type: object.type,
    };
  } catch {
    console.info("NIP-19 Parse error.");
    return null;
  }
};

export const checkNip05 = async (userKey: string): Promise<CheckKey | null> => {
  try {
    const profile = await nip05.queryProfile(userKey);
    if (!profile) throw "error";
    return {
      id: userKey,
      type: "user",
    };
  } catch {
    console.info("NIP-05 Parse error.");
    return null;
  }
};
