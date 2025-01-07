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
