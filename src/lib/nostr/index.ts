import { nip19, nip05 } from "nostr-tools";
import { NostrFetcher } from "nostr-fetch";
import type { NostrEvent, FetchFilter } from "nostr-fetch";
import { simplePoolAdapter } from "@nostr-fetch/adapter-nostr-tools";
import { SimplePool } from "nostr-tools";
import "websocket-polyfill";

export type ParsedNIP19 = {
  hex: string;
  type: string;
  key: string;
};

export const parseQuery = async (key: string): Promise<ParsedNIP19 | null> => {
  try {
    const object = nip19.decode(key);
    console.log(object);
    let hexString = "";
    switch (object.type) {
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
      key: key,
    });
  } catch {
    console.info("NIP-19 Parse error.");
  }
  try {
    const profile = await nip05.queryProfile(key);
    if (!profile) throw "error";
    return {
      hex: profile.pubkey,
      type: "user",
      key: key,
    };
  } catch {
    console.info("NIP-05 Parse error.");
  }
  return null;
};

const pool = new SimplePool();

// const fetcher = NostrFetcher.init();
const fetcher = NostrFetcher.withCustomPool(simplePoolAdapter(pool));
const relays = [
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://relay.nostr.wirednet.jp",
  "wss://nostr-relay.nokotaro.com",
  "wss://yabu.me",
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
  "wss://relay-jp.shino3.net",
];

export const getSingleItem = async (params: {
  kind: number;
  note?: string;
  author?: string;
}) => {
  const filters: FetchFilter = { kinds: [params.kind] };
  if (params.note) {
    filters.ids = [params.note];
  }
  if (params.author) {
    filters.authors = [params.author];
  }
  const lastData: NostrEvent | undefined = await fetcher.fetchLastEvent(
    relays,
    filters
  );
  return lastData;
};
