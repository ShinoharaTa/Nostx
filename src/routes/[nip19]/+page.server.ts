import { mergeRelays } from "$lib/nostr";
import { fetchLatestEvent } from "$lib/server/relay";
import { validateNip19Input } from "$lib/validation";
import type { Event } from "nostr-tools";
import { decode } from "nostr-tools/nip19";
import type { PageServerLoad } from "./$types";

// サーバー側リレー取得の全体タイムアウト(ミリ秒)。
// OGP クローラーを待たせすぎないよう、クライアント側(10 秒)より短くする。
const SERVER_FETCH_BUDGET_MS = 3500;
// note/nevent で本文→プロフィールと直列に取得する場合の本文側の上限
const EVENT_FETCH_TIMEOUT_MS = 2000;

/** [nip19] ページの OGP 表示・初期データに使うサーバー取得結果 */
export interface OgpData {
  type: "npub" | "nprofile" | "note" | "nevent" | "naddr";
  /** note/nevent/naddr の対象イベント */
  event: Event | null;
  /** 対象の(または投稿者の)kind:0 プロフィールイベント */
  profile: Event | null;
}

export const load: PageServerLoad = async ({ params }) => {
  const fallback: { ogp: OgpData | null } = { ogp: null };
  // nsec・未対応形式・不正な入力はサーバーでは何も取得しない
  const validation = validateNip19Input(params.nip19);
  if (validation.status !== "ok" || !validation.normalized) {
    return fallback;
  }
  try {
    const decoded = decode(validation.normalized);
    const deadline = Date.now() + SERVER_FETCH_BUDGET_MS;
    const remaining = () => Math.max(deadline - Date.now(), 0);

    if (decoded.type === "npub" || decoded.type === "nprofile") {
      const pubkey =
        decoded.type === "npub" ? decoded.data : decoded.data.pubkey;
      const relays = mergeRelays(
        decoded.type === "nprofile" ? decoded.data.relays : undefined,
      );
      const profile = await fetchLatestEvent(
        relays,
        { kinds: [0], authors: [pubkey], limit: 1 },
        remaining(),
      );
      // 想定外のイベントを返すリレーがあっても OGP に使わない
      if (!profile || profile.kind !== 0 || profile.pubkey !== pubkey) {
        return { ogp: { type: decoded.type, event: null, profile: null } };
      }
      return { ogp: { type: decoded.type, event: null, profile } };
    }

    if (decoded.type === "note" || decoded.type === "nevent") {
      const id = decoded.type === "note" ? decoded.data : decoded.data.id;
      const relays = mergeRelays(
        decoded.type === "nevent" ? decoded.data.relays : undefined,
      );
      const author =
        decoded.type === "nevent" ? decoded.data.author : undefined;

      let event: Event | null;
      let profile: Event | null = null;
      if (author) {
        // 投稿者が分かっている場合は本文とプロフィールを並列取得する
        [event, profile] = await Promise.all([
          fetchLatestEvent(relays, { ids: [id], limit: 1 }, remaining()),
          fetchLatestEvent(
            relays,
            { kinds: [0], authors: [author], limit: 1 },
            remaining(),
          ),
        ]);
      } else {
        // 投稿者不明の場合は本文→プロフィールの直列取得(合計 3.5 秒以内)
        event = await fetchLatestEvent(
          relays,
          { ids: [id], limit: 1 },
          Math.min(remaining(), EVENT_FETCH_TIMEOUT_MS),
        );
        if (event) {
          profile = await fetchLatestEvent(
            relays,
            { kinds: [0], authors: [event.pubkey], limit: 1 },
            remaining(),
          );
        }
      }
      // 想定外のイベントを返すリレーがあっても OGP に使わない
      if (event && event.id !== id) event = null;
      const expectedAuthor = event ? event.pubkey : author;
      if (
        profile &&
        (profile.kind !== 0 || profile.pubkey !== expectedAuthor)
      ) {
        profile = null;
      }
      return { ogp: { type: decoded.type, event, profile } };
    }

    if (decoded.type === "naddr") {
      const { kind, pubkey, identifier } = decoded.data;
      const relays = mergeRelays(decoded.data.relays);
      // 記事本体(kind + author + #d)とプロフィールを並列取得する
      const [event, profile] = await Promise.all([
        fetchLatestEvent(
          relays,
          { kinds: [kind], authors: [pubkey], "#d": [identifier], limit: 1 },
          remaining(),
        ),
        fetchLatestEvent(
          relays,
          { kinds: [0], authors: [pubkey], limit: 1 },
          remaining(),
        ),
      ]);
      // 想定外のイベントを返すリレーがあっても OGP に使わない
      const matchedEvent =
        event &&
        event.kind === kind &&
        event.pubkey === pubkey &&
        Array.isArray(event.tags) &&
        event.tags.some((tag) => tag[0] === "d" && (tag[1] ?? "") === identifier)
          ? event
          : null;
      const matchedProfile =
        profile && profile.kind === 0 && profile.pubkey === pubkey
          ? profile
          : null;
      return { ogp: { type: decoded.type, event: matchedEvent, profile: matchedProfile } };
    }

    return fallback;
  } catch {
    // サーバー取得の失敗はフォールバック(クライアント側取得に任せる)
    return fallback;
  }
};
