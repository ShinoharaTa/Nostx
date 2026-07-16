<script lang="ts">
import { getSingleItem } from "$lib/nostr";
import { fromUnixTime, format } from "date-fns";
import { nip19 } from "nostr-tools";
import type { Event } from "nostr-tools";
import { _ } from "svelte-i18n";

export let id: string;
export let relays: string[] = [];
export let author: string | undefined = undefined;
export let kind: number | undefined = undefined;
let text: Event | null = null;
let metadata: { [key: string]: string } | null = null;
let status: "loading" | "loaded" | "failed" = "loading";
let expanded = false;

// contentをリッチ表示するためのトークン({@html}を使わずに要素を組み立てる)
type Token =
	| { type: "text"; value: string }
	| { type: "image"; url: string }
	| { type: "link"; url: string }
	| { type: "nostr"; bech32: string };

// 折りたたみの目安文字数
const CONTENT_COLLAPSE_LIMIT = 500;

// URLとnostr:参照を検出する正規表現
const tokenRegex =
	/(https?:\/\/[^\s"'<>]+)|nostr:((?:npub|nprofile|note|nevent|naddr)1[02-9ac-hj-np-z]+)/g;

// 画像URLかどうか(クエリ・フラグメント付きにも対応)
const isImageUrl = (url: string): boolean => {
	try {
		return /\.(jpe?g|png|gif|webp)$/i.test(new URL(url).pathname);
	} catch {
		return false;
	}
};

// content文字列をトークンに分割する
const tokenize = (content: string): Token[] => {
	const tokens: Token[] = [];
	let lastIndex = 0;
	for (const match of content.matchAll(tokenRegex)) {
		const index = match.index ?? 0;
		if (index > lastIndex) {
			tokens.push({ type: "text", value: content.slice(lastIndex, index) });
		}
		if (match[1]) {
			tokens.push(
				isImageUrl(match[1])
					? { type: "image", url: match[1] }
					: { type: "link", url: match[1] },
			);
		} else {
			tokens.push({ type: "nostr", bech32: match[2] });
		}
		lastIndex = index + match[0].length;
	}
	if (lastIndex < content.length) {
		tokens.push({ type: "text", value: content.slice(lastIndex) });
	}
	return tokens;
};

// トークンの表示上の長さ
const tokenLength = (token: Token): number => {
	if (token.type === "text") return token.value.length;
	if (token.type === "nostr") return token.bech32.length;
	return token.url.length;
};

// トークン列を目安の文字数で切り詰める(URLの途中では切らない)
const truncateTokens = (tokens: Token[], limit: number): Token[] => {
	const result: Token[] = [];
	let count = 0;
	for (const token of tokens) {
		const length = tokenLength(token);
		if (count + length > limit) {
			const rest =
				token.type === "text" ? token.value.slice(0, limit - count) : "";
			result.push({ type: "text", value: `${rest}…` });
			break;
		}
		result.push(token);
		count += length;
	}
	return result;
};

let copyMenuOpen = false;

// 指定した形式でクリップボードにコピーする
const copyAs = (copyFormat: "note" | "nevent" | "hex") => {
	copyMenuOpen = false;
	let value = "";
	try {
		if (copyFormat === "note") {
			value = nip19.noteEncode(id);
		} else if (copyFormat === "nevent") {
			// 取得済みのリレーヒント・作者があれば含める
			const pointer: { id: string; relays?: string[]; author?: string } = {
				id,
			};
			if (relays.length > 0) pointer.relays = relays;
			if (text) pointer.author = text.pubkey;
			value = nip19.neventEncode(pointer);
		} else {
			value = id;
		}
	} catch {
		alert($_("content.copy_failed"));
		return;
	}
	navigator.clipboard
		.writeText(value)
		.then(() => {
			alert($_("content.copied"));
		})
		.catch(() => {
			alert($_("content.copy_failed"));
		});
};

$: shortNpub = text ? `${nip19.npubEncode(text.pubkey).slice(0, 12)}...` : "";
$: tokens = text ? tokenize(text.content) : [];
$: isLong = text ? text.content.length > CONTENT_COLLAPSE_LIMIT : false;
$: displayTokens =
	isLong && !expanded ? truncateTokens(tokens, CONTENT_COLLAPSE_LIMIT) : tokens;
const getItem = async () => {
	status = "loading";
	try {
		// kindヒントがあればそれを使い、なければkind指定なしで取得する
		const getText = await getSingleItem({ kind, note: id, author, relays });
		if (!getText) {
			status = "failed";
			return;
		}
		text = getText;
		status = "loaded";
		// kind:1以外は簡易表示のためプロフィール取得は行わない
		if (getText.kind !== 1) return;
		const getMetadata = await getSingleItem({
			kind: 0,
			author: getText.pubkey,
			relays,
		});
		if (getMetadata) metadata = JSON.parse(getMetadata.content);
	} catch {
		// タイムアウトを含む取得失敗(本文が取得済みならプロフィール失敗は無視する)
		if (status !== "loaded") status = "failed";
	}
};
getItem();
</script>

{#if status === "loading"}
  <div class="item" aria-busy="true">
    <div class="d-flex align-items-center">
      <div class="skeleton skeleton-avatar"></div>
      <div class="skeleton skeleton-line w-50"></div>
    </div>
    <div class="skeleton skeleton-line mt-3"></div>
    <div class="skeleton skeleton-line mt-2 w-75"></div>
  </div>
{:else if status === "failed"}
  <div class="item text-center">
    <div>{$_("content.fetch_failed")}</div>
    <button class="btn btn-sm btn-outline-light mt-3" on:click={getItem}>
      <i class="bi bi-arrow-clockwise"></i> {$_("content.retry")}
    </button>
  </div>
{:else if text}
  <div class="item">
    {#if text.kind === 1}
      <div class="d-flex">
        {#if metadata && metadata.picture}
        <img src={metadata.picture} alt="" class="picture" />
        {:else}
        <img src="/image/app_icon.svg" alt="" class="picture" />
        {/if}
        <p class="text-break">
          {#if metadata}
            {metadata.display_name || metadata.name || shortNpub}{#if metadata.name}&nbsp;@{metadata.name}{/if}
          {:else}
            {shortNpub}
          {/if}
        </p>
      </div>
    {:else}
      <div>
        <span class="badge bg-secondary">kind: {text.kind}</span>
      </div>
    {/if}
    <div class="mt-3 text-break">
      {#each displayTokens as token}
        {#if token.type === "image"}
          <img src={token.url} alt="" class="content-image" loading="lazy" />
        {:else if token.type === "link"}
          <a href={token.url} target="_blank" rel="noopener noreferrer">{token.url}</a>
        {:else if token.type === "nostr"}
          <a href={`/${token.bech32}`}>nostr:{`${token.bech32.slice(0, 12)}...`}</a>
        {:else}
          {token.value}
        {/if}
      {/each}
    </div>
    {#if isLong}
      <div class="mt-2 text-center">
        <button
          class="btn btn-sm btn-outline-light"
          on:click={() => (expanded = !expanded)}
        >
          {expanded ? $_("content.show_less") : $_("content.show_more")}
        </button>
      </div>
    {/if}
    <div class="text-end mt-2">
      {format(fromUnixTime(text.created_at), "yyyy/MM/dd HH:mm")}
    </div>
    <div class="d-flex justify-content-end mt-2">
      <div class="position-relative">
        <button
          class="btn btn-sm btn-circle btn-light"
          on:click|stopPropagation={() => (copyMenuOpen = !copyMenuOpen)}
        >
          <i class="bi bi-copy"></i> COPY
        </button>
        {#if copyMenuOpen}
          <div class="copy-menu">
            <button class="copy-menu-item" on:click={() => copyAs("note")}>note</button>
            <button class="copy-menu-item" on:click={() => copyAs("nevent")}>nevent</button>
            <button class="copy-menu-item" on:click={() => copyAs("hex")}>hex</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<svelte:window on:click={() => (copyMenuOpen = false)} />

<style>
  .picture {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 42px;
    height: 42px;
    margin-right: 1rem;
  }

  .item {
    font-size: 14px;
    padding: 1rem;
    white-space: pre-wrap;
  }

  .skeleton {
    background: #333;
    border-radius: 4px;
  }

  .skeleton-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .skeleton-line {
    height: 0.9rem;
  }

  .content-image {
    display: block;
    max-width: 100%;
    border-radius: 8px;
    margin: 0.5rem 0;
  }

  .item a {
    word-break: break-all;
  }

  .btn-circle {
    border-radius: 20px;
  }

  .copy-menu {
    position: absolute;
    bottom: calc(100% + 4px);
    right: 0;
    background: #333;
    border: 1px solid #555;
    border-radius: 8px;
    overflow: hidden;
    z-index: 10;
    min-width: 6.5rem;
    white-space: nowrap;
  }

  .copy-menu-item {
    display: block;
    width: 100%;
    padding: 0.4rem 1rem;
    background: none;
    border: none;
    color: #eee;
    text-align: left;
    font-size: 13px;
  }

  .copy-menu-item:hover {
    background: #444;
  }
</style>
