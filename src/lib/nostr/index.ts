import { SimplePool, type Filter } from "nostr-tools";
import { queryProfile } from "nostr-tools/nip05";
import { decode, type DecodeResult } from "nostr-tools/nip19";

export const parseQuery = async (key: string): Promise<DecodeResult | null> => {
  try {
    const nip19decode = decode(key);
    console.log(nip19decode);
    return nip19decode;
  } catch {
    console.info("NIP-19 Parse error.");
  }
  try {
    const profile = await queryProfile(key);
    if (!profile) throw "error";
    return {
      type: "npub",
      data: profile.pubkey
    }
  } catch {
    console.info("NIP-05 Parse error.");
  }
  return null;
};

const pool = new SimplePool();
const relays = [
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://relay.nostr.wirednet.jp",
  "wss://yabu.me",
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
];

export const getSingleItem = async (params: {
  kind: number;
  note?: string;
  author?: string;
}) => {
  const filters: Filter = { kinds: [params.kind] };
  if (params.note) {
    filters.ids = [params.note];
  }
  if (params.author) {
    filters.authors = [params.author];
  }
  const lastData = await pool.get(relays, filters);
  return lastData;
};

// Send a ZAP
export const sendZap = async (address: string, amount: number, comment: string) => {
  try {
    // Lightning Addressからエンドポイントを生成
    const [username, domain] = address.split('@');
    const endpoint = `https://${domain}/.well-known/lnurlp/${username}`;
    
    // LNURL情報を取得
    const lnurlResponse = await fetch(endpoint);
    const lnurlData = await lnurlResponse.json();
    
    if (!lnurlData || !lnurlData.callback) {
      throw new Error('無効なLNURL応答');
    }
    // 金額をミリサトシに変換（LNURLの仕様）
    const amountInMilliSats = Math.floor(amount * 1000);
    
    // コールバックURLにパラメータを追加
    const callbackUrl = new URL(lnurlData.callback);
    callbackUrl.searchParams.append('amount', amountInMilliSats.toString());
    
    if (comment && lnurlData.commentAllowed && comment.length <= lnurlData.commentAllowed) {
      callbackUrl.searchParams.append('comment', comment);
    }
    
    // インボイスリクエスト
    const invoiceResponse = await fetch(callbackUrl.toString());
    const data = await invoiceResponse.json();
    if (!data || !data.pr) {
      throw new Error('無効なインボイス応答');
    }
    window.location.href = `lightning:${data.pr}`;
    return { success: true, message: "invoiceCreated", invoice: data.pr };
  } catch (error) {
    console.error('インボイス生成エラー:', error);
    return { success: false, message: "failed", invoide: null };
  }
};