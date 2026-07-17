import { decode } from "nostr-tools/nip19";

/** Nostx が対応している NIP-19 形式 */
export const SUPPORTED_NIP19_TYPES = [
  "npub",
  "nprofile",
  "note",
  "nevent",
  "naddr",
] as const;

export type SupportedNip19Type = (typeof SUPPORTED_NIP19_TYPES)[number];

export type Nip19ValidationStatus =
  | "ok" // 対応形式としてデコード成功
  | "unsupported" // デコードは成功するが Nostx 未対応の形式 (nrelay など)
  | "nsec-warning" // 秘密鍵 (nsec) が入力された
  | "invalid"; // NIP-19 形式として認識できない

export interface Nip19ValidationResult {
  status: Nip19ValidationStatus;
  /** デコードに成功した場合の NIP-19 タイプ */
  type?: string;
  /** プレフィックス除去・URL 内抽出などの正規化を適用した後の文字列 */
  normalized?: string;
}

/** 文字列中の bech32 エンティティ (npub1... など) を検出するパターン */
const BECH32_ENTITY_PATTERN = /(?:npub|nprofile|note|nevent|naddr|nsec)1[a-z0-9]+/;

/**
 * 入力文字列を NIP-19 判定にかけられる形へ正規化する。
 * - 前後の空白・改行をトリム
 * - `nostr:` / `web+nostr:` プレフィックスを除去
 * - URL などの文字列中に含まれる bech32 エンティティを抽出
 *   (例: https://nostter.app/npub1xxx → npub1xxx)
 */
export const normalizeNip19Input = (input: string): string => {
  const trimmed = input.trim();
  const withoutScheme = trimmed.replace(/^(?:web\+)?nostr:(?:\/\/)?/i, "");
  const matched = withoutScheme.match(BECH32_ENTITY_PATTERN);
  return matched ? matched[0] : withoutScheme;
};

/**
 * 入力文字列を NIP-19 として分類する純粋関数。
 * - 判定前に normalizeNip19Input で正規化する(結果の normalized に格納)
 * - nsec は checksum が壊れていても prefix で警告扱いにする(秘密鍵を decode に通さない)
 */
export const validateNip19Input = (input: string): Nip19ValidationResult => {
  const value = normalizeNip19Input(input);
  if (value === "") {
    return { status: "invalid" };
  }
  if (value.startsWith("nsec1")) {
    return { status: "nsec-warning", type: "nsec", normalized: value };
  }
  try {
    const { type } = decode(value);
    if (type === "nsec") {
      return { status: "nsec-warning", type, normalized: value };
    }
    if ((SUPPORTED_NIP19_TYPES as readonly string[]).includes(type)) {
      return { status: "ok", type, normalized: value };
    }
    return { status: "unsupported", type, normalized: value };
  } catch {
    return { status: "invalid" };
  }
};
