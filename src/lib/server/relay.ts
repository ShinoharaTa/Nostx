// サーバー(Cloudflare Pages Functions = Workers ランタイム)用の最小 Nostr リレークライアント。
// - Workers では Node の ws / websocket-polyfill が使えないため、
//   グローバル WebSocket(workerd は new WebSocket() の外向き接続をサポート、
//   Node 22+ もグローバル WebSocket を持つ)だけで実装する。
// - nostr-tools の SimplePool はモジュールスコープで接続を再利用するため、
//   Workers の「リクエストをまたぐ I/O 禁止」制約に抵触する。
//   ここではリクエスト毎に接続を張り、REQ → EVENT/EOSE の受信のみ行って閉じる。
import type { Event, Filter } from "nostr-tools";

const SUBSCRIPTION_ID = "nostx-ogp";

// リレーから受信したオブジェクトが Nostr イベントの形をしているか(署名検証はしない)
const isEventLike = (value: unknown): value is Event => {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.id === "string" &&
    typeof event.pubkey === "string" &&
    typeof event.kind === "number" &&
    typeof event.content === "string" &&
    typeof event.created_at === "number"
  );
};

/**
 * 複数リレーに並列で REQ を送り、フィルタに合致するイベントのうち
 * created_at が最新のものを 1 件返す。
 * 全リレーの EOSE / エラー / タイムアウトのいずれかで解決し、例外は投げない。
 */
export const fetchLatestEvent = (
  relayUrls: string[],
  filter: Filter,
  timeoutMs: number,
): Promise<Event | null> => {
  return new Promise((resolve) => {
    let best: Event | null = null;
    let pending = relayUrls.length;
    let settled = false;
    const sockets: WebSocket[] = [];

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      for (const socket of sockets) {
        try {
          socket.close();
        } catch {
          // すでに閉じている場合などは無視
        }
      }
      resolve(best);
    };
    const timer = setTimeout(finish, Math.max(timeoutMs, 0));

    if (pending === 0 || timeoutMs <= 0) {
      finish();
      return;
    }

    for (const url of relayUrls) {
      let socket: WebSocket;
      try {
        socket = new WebSocket(url);
      } catch {
        pending -= 1;
        if (pending <= 0) finish();
        continue;
      }
      sockets.push(socket);

      // 1 ソケットにつき 1 回だけ完了カウントを進める(EOSE と close の二重計上を防ぐ)
      let completed = false;
      const complete = () => {
        if (completed) return;
        completed = true;
        pending -= 1;
        if (pending <= 0) finish();
      };

      socket.addEventListener("open", () => {
        try {
          socket.send(JSON.stringify(["REQ", SUBSCRIPTION_ID, filter]));
        } catch {
          complete();
        }
      });
      socket.addEventListener("message", (message) => {
        if (typeof message.data !== "string") return;
        try {
          const payload = JSON.parse(message.data);
          if (payload[0] === "EVENT" && payload[1] === SUBSCRIPTION_ID) {
            const event = payload[2];
            if (isEventLike(event) && (!best || event.created_at > best.created_at)) {
              best = event;
            }
          } else if (payload[0] === "EOSE" && payload[1] === SUBSCRIPTION_ID) {
            try {
              socket.close();
            } catch {
              // 無視
            }
            complete();
          }
        } catch {
          // 不正な JSON は無視
        }
      });
      socket.addEventListener("error", complete);
      socket.addEventListener("close", complete);
    }
  });
};
