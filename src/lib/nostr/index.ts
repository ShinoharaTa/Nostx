import { SimplePool, type Filter } from "nostr-tools";
import { queryProfile } from "nostr-tools/nip05";
import { decode } from "nostr-tools/nip19";

export type ParsedNIP19 = {
  hex: string;
  type: string;
};

export const parseQuery = async (key: string): Promise<ParsedNIP19 | null> => {
  try {
    const object = decode(key);
    console.log(object);
    let hexString = "";
    switch(object.type){
      case "nprofile":
        hexString = object.data.pubkey;
        break;
      case "nevent":
        hexString = object.data.id;
        break;
      case "note":
      case "npub":
        hexString = object.data;
        break;
    }
    return Promise.resolve({
      hex: hexString,
      type: object.type,
    });
  } catch {
    console.info("NIP-19 Parse error.");
  }
  try {
    const profile = await queryProfile(key);
    if (!profile) throw "error";
    return {
      hex: profile.pubkey,
      type: "npub",
    };
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
