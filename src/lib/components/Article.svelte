<script lang="ts">
import { getSingleItem } from "$lib/nostr";
import { fromUnixTime, format } from "date-fns";
import { nip19 } from "nostr-tools";
import type { Event } from "nostr-tools";
import { _ } from "svelte-i18n";

// naddr(kind:30023 長文記事など)を簡易カード表示するコンポーネント
let {
	kind,
	pubkey,
	identifier,
	relays = [],
	// サーバー(+page.server.ts)で取得済みの初期データ(あればクライアント再取得をスキップする)
	initialEvent = null,
	initialMetadata = null,
}: {
	kind: number;
	pubkey: string;
	identifier: string;
	relays?: string[];
	initialEvent?: Event | null;
	initialMetadata?: { [key: string]: string } | null;
} = $props();

let article = $state<Event | null>(null);
let metadata = $state<{ [key: string]: string } | null>(null);
let status = $state<"loading" | "loaded" | "failed">("loading");

// タグから最初の値を取り出す
const getTagValue = (event: Event, name: string): string | undefined => {
	const tag = event.tags.find((t) => t[0] === name && t[1]);
	return tag?.[1];
};

// 概要: summary タグがあればそれを、なければ content の先頭 150 字を使う
const buildSummary = (event: Event): string => {
	const summary = getTagValue(event, "summary");
	const source = summary ?? event.content;
	const singleLine = source.replace(/\s+/g, " ").trim();
	return singleLine.length > 150 ? `${singleLine.slice(0, 150)}…` : singleLine;
};

// 公開日時: published_at タグ(unixtime)があればそれを、なければ created_at を使う
const resolvePublishedAt = (event: Event): number => {
	const published = Number(getTagValue(event, "published_at"));
	return Number.isFinite(published) && published > 0
		? published
		: event.created_at;
};

const shortNpub = $derived(`${nip19.npubEncode(pubkey).slice(0, 12)}...`);
const title = $derived(
	article ? (getTagValue(article, "title") ?? identifier) : "",
);
const summary = $derived(article ? buildSummary(article) : "");
const image = $derived(article ? getTagValue(article, "image") : undefined);
const publishedAt = $derived(article ? resolvePublishedAt(article) : 0);
const authorName = $derived(
	metadata?.display_name || metadata?.name || shortNpub,
);

// 投稿者のプロフィール(kind:0)を取得する(失敗しても記事表示には影響させない)
const getAuthorMetadata = async () => {
	try {
		const getMetadata = await getSingleItem({
			kind: 0,
			author: pubkey,
			relays,
		});
		if (getMetadata) metadata = JSON.parse(getMetadata.content);
	} catch {
		// プロフィール取得失敗は無視する
	}
};

const getItem = async () => {
	status = "loading";
	try {
		// kind + author + #d(identifier)で記事本体を取得する
		const event = await getSingleItem({
			kind,
			author: pubkey,
			identifier,
			relays,
		});
		if (!event) {
			status = "failed";
			return;
		}
		article = event;
		status = "loaded";
		await getAuthorMetadata();
	} catch {
		// タイムアウトを含む取得失敗
		if (status !== "loaded") status = "failed";
	}
};

if (initialEvent) {
	// サーバー取得済みのイベントがあれば再取得せずに使う
	article = initialEvent;
	metadata = initialMetadata;
	status = "loaded";
	if (!initialMetadata) {
		getAuthorMetadata();
	}
} else {
	getItem();
}
</script>

{#if status === "loading"}
  <div class="item" aria-busy="true">
    <div class="skeleton skeleton-line w-75"></div>
    <div class="skeleton skeleton-line mt-3"></div>
    <div class="skeleton skeleton-line mt-2 w-50"></div>
  </div>
{:else if status === "failed"}
  <div class="item text-center">
    <div>{$_("article.fetch_failed")}</div>
    <button class="btn btn-sm btn-outline-light mt-3" onclick={getItem}>
      <i class="bi bi-arrow-clockwise"></i> {$_("article.retry")}
    </button>
  </div>
{:else if article}
  <div class="item">
    <div>
      <span class="badge bg-secondary">{$_("article.badge")}</span>
    </div>
    <h1 class="title mt-2 text-break">{title}</h1>
    {#if image}
      <img src={image} alt={$_("a11y.article_image")} class="article-image" loading="lazy" />
    {/if}
    {#if summary}
      <p class="summary mt-2 text-break">{summary}</p>
    {/if}
    <div class="d-flex align-items-center mt-3">
      {#if metadata && metadata.picture}
        <img src={metadata.picture} alt={authorName} class="picture" />
      {:else}
        <img src="/image/app_icon.svg" alt="" aria-hidden="true" class="picture" />
      {/if}
      <div class="text-break">
        <div>{authorName}</div>
        <div class="published">
          {format(fromUnixTime(publishedAt), "yyyy/MM/dd HH:mm")}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .item {
    font-size: 14px;
    padding: 1rem;
  }

  .title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .summary {
    margin-bottom: 0;
  }

  .article-image {
    display: block;
    max-width: 100%;
    border-radius: 8px;
    margin: 0.5rem 0;
  }

  .picture {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 42px;
    height: 42px;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .published {
    font-size: 12px;
    opacity: 0.8;
  }

  .skeleton {
    background: #333;
    border-radius: 4px;
  }

  .skeleton-line {
    height: 0.9rem;
  }
</style>
