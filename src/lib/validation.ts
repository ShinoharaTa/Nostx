import { decode } from "nostr-tools/nip19";

/** Nostx が対応している NIP-19 形式 */
export const SUPPORTED_NIP19_TYPES = [
  "npub",
  "nprofile",
  "note",
  "nevent",
] as const;

export type SupportedNip19Type = (typeof SUPPORTED_NIP19_TYPES)[number];

export type Nip19ValidationStatus =
  | "ok" // 対応形式としてデコード成功
  | "unsupported" // デコードは成功するが Nostx 未対応の形式 (naddr など)
  | "nsec-warning" // 秘密鍵 (nsec) が入力された
  | "invalid"; // NIP-19 形式として認識できない

export interface Nip19ValidationResult {
  status: Nip19ValidationStatus;
  /** デコードに成功した場合の NIP-19 タイプ */
  type?: string;
}

/**
 * 入力文字列を NIP-19 として分類する純粋関数。
 * - nsec は checksum が壊れていても prefix で警告扱いにする(秘密鍵を decode に通さない)
 */
export const validateNip19Input = (input: string): Nip19ValidationResult => {
  const value = input.trim();
  if (value === "") {
    return { status: "invalid" };
  }
  if (value.startsWith("nsec1")) {
    return { status: "nsec-warning", type: "nsec" };
  }
  try {
    const { type } = decode(value);
    if (type === "nsec") {
      return { status: "nsec-warning", type };
    }
    if ((SUPPORTED_NIP19_TYPES as readonly string[]).includes(type)) {
      return { status: "ok", type };
    }
    return { status: "unsupported", type };
  } catch {
    return { status: "invalid" };
  }
};
