<script lang="ts">
import { getSingleItem } from "$lib/nostr";
import { fromUnixTime, format } from "date-fns";
import { nip19 } from "nostr-tools";
import type { Event } from "nostr-tools";

export let id: string;
let text: Event;
let metadata: { [key: string]: string };

$: shortNpub = text ? `${nip19.npubEncode(text.pubkey).slice(0, 12)}...` : "";
const getItem = async () => {
	const getText = await getSingleItem({ kind: 1, note: id });
	console.log(getText);
	if (getText) {
		text = getText;
	} else {
		return;
	}
	const getMetadata = await getSingleItem({
		kind: 0,
		author: getText.pubkey,
	});
	if (getMetadata) metadata = JSON.parse(getMetadata.content);
};
getItem();
</script>

{#if text}
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
