import { browser } from "$app/environment";

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
