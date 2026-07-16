<script lang="ts">
import { getSingleItem } from "$lib/nostr";
import { fromUnixTime, format } from "date-fns";
import { nip19 } from "nostr-tools";
import type { Event } from "nostr-tools";

export let id: string;
export let relays: string[] = [];
export let author: string | undefined = undefined;
export let kind: number | undefined = undefined;
let text: Event;
let metadata: { [key: string]: string };

$: shortNpub = text ? `${nip19.npubEncode(text.pubkey).slice(0, 12)}...` : "";
const getItem = async () => {
	// kindヒントがあればそれを使い、なければkind指定なしで取得する
	const getText = await getSingleItem({ kind, note: id, author, relays });
	console.log(getText);
	if (getText) {
		text = getText;
	} else {
		return;
	}
	// kind:1以外は簡易表示のためプロフィール取得は行わない
	if (getText.kind !== 1) return;
	const getMetadata = await getSingleItem({
		kind: 0,
		author: getText.pubkey,
		relays,
	});
	if (getMetadata) metadata = JSON.parse(getMetadata.content);
};
getItem();
</script>

{#if text}
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
</style>
