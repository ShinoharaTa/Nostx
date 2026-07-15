import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

/** ブラウザ / Node 共通で使用するグローバル定義(globals パッケージ非依存) */
const sharedGlobals = {
  // browser
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  location: "readonly",
  history: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  fetch: "readonly",
  alert: "readonly",
  confirm: "readonly",
  prompt: "readonly",
  console: "readonly",
  setTimeout: "readonly",
  setInterval: "readonly",
  clearTimeout: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  IntersectionObserver: "readonly",
  MutationObserver: "readonly",
  CustomEvent: "readonly",
  Event: "readonly",
  KeyboardEvent: "readonly",
  MouseEvent: "readonly",
  HTMLElement: "readonly",
  HTMLInputElement: "readonly",
  HTMLTextAreaElement: "readonly",
  Element: "readonly",
  Node: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  WebSocket: "readonly",
  Blob: "readonly",
  File: "readonly",
  FileReader: "readonly",
  FormData: "readonly",
  crypto: "readonly",
  atob: "readonly",
  btoa: "readonly",
  structuredClone: "readonly",
  // node / build
  process: "readonly",
  globalThis: "readonly",
};

export default [
  // 生成物・依存の除外
  {
    ignores: [
      ".svelte-kit/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "static/**",
      "docker/**",
    ],
  },

  // JS 推奨ルール
  js.configs.recommended,

  // TypeScript
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".svelte"],
      },
      globals: sharedGlobals,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // 型定義は tsc / svelte-check 側で検証するため未使用変数は警告に留める
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off",
    },
  },

  // Svelte コンポーネント
  ...sveltePlugin.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.svelte"],
  })),
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".svelte"],
      },
      globals: sharedGlobals,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // base ルールは TS ルールと重複するため無効化し、TS 側を警告に留める
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off",
      // 既存コードに全角スペースが含まれるため警告に留める
      "no-irregular-whitespace": "warn",
    },
  },

  // JS 設定ファイル類
  {
    files: ["*.js", "*.ts", "*.config.js", "*.config.ts"],
    languageOptions: {
      globals: sharedGlobals,
    },
    rules: {
      "no-undef": "off",
    },
  },
];
