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

$: shortNpub = text ? `${nip19.npubEncode(text.pubkey).slice(0, 12)}...` : "";
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
  {#if text.kind === 1}
    <div class="item">
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
      <div class="mt-3 text-break">
        {text.content}
      </div>
      <div class="text-end mt-2">
        {format(fromUnixTime(text.created_at), "yyyy/MM/dd HH:mm")}
      </div>
    </div>
  {:else}
    <div class="item">
      <div>
        <span class="badge bg-secondary">kind: {text.kind}</span>
      </div>
      <div class="mt-3 text-break">
        {text.content}
      </div>
      <div class="text-end mt-2">
        {format(fromUnixTime(text.created_at), "yyyy/MM/dd HH:mm")}
      </div>
    </div>
  {/if}
{/if}

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
</style>
