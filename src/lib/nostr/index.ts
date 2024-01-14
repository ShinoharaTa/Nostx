import { nip19, nip05 } from "nostr-tools";

export type ParsedNIP19 = {
  key: string;
  hex: string;
  type: string;
}

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
