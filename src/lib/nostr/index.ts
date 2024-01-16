import { nip19, nip05 } from "nostr-tools";
import { NostrFetcher } from "nostr-fetch";
import type { NostrEvent, FetchFilter } from "nostr-fetch";
import "websocket-polyfill";

export type ParsedNIP19 = {
  key: string;
  hex: string;
  type: string;
};

export const parseQuery = async (key: string): Promise<ParsedNIP19 | null> => {
  try {
    const object = nip19.decode(key);
    return Promise.resolve({
      key: key,
      hex: object.data.toString(),
      type: object.type,
    });
  } catch {
    console.info("NIP-19 Parse error.");
  }
  try {
    const profile = await nip05.queryProfile(key);
    if (!profile) throw "error";
    return {
      key: nip19.npubEncode(profile.pubkey),
      hex: profile.pubkey,
      type: "user",
    };
  } catch {
    console.info("NIP-05 Parse error.");
  }
  return null;
};

const fetcher = NostrFetcher.init();
const relays = ["wss://relay.damus.io", "wss://relay.snort.social"];

export const getSingleItem = async (params: {
  kind: number;
  note?: string;
  author?: string;
}) => {
  const filters: FetchFilter = { kinds: [params.kind] };
  if (params.note) {
    filters.authors = [params.note];
  }
  if (params.author) {
    filters.authors = [params.author];
  }
  const lastData: NostrEvent | undefined = await fetcher.fetchLastEvent(
    relays,
    filters
  );
  console.log(lastData);
  return lastData;
};
