<script lang="ts">
import type { Client } from "$lib/const";
import { setLastClientKey } from "$lib/preferences";
import {
	naddrEncode,
	neventEncode,
	noteEncode,
	nprofileEncode,
	npubEncode,
	type DecodeResult,
} from "nostr-tools/nip19";
import { _ } from "svelte-i18n";
let {
	client,
	result,
	variant = "default",
}: {
	client: Client;
	result: DecodeResult;
	variant?: "default" | "primary";
} = $props();

const linkUrl = () => {
	let nip19Encode = "";
	let clientUrl = "";
	if (result.type === "npub") {
		nip19Encode = npubEncode(result.data);
		clientUrl = client.url.npub;
	}
	if (result.type === "nprofile" && client.url.nprofile) {
		nip19Encode = nprofileEncode(result.data);
		clientUrl = client.url.nprofile;
	} else if (result.type === "nprofile") {
		nip19Encode = npubEncode(result.data.pubkey);
		clientUrl = client.url.npub;
	}
	if (result.type === "note") {
		nip19Encode = noteEncode(result.data);
		clientUrl = client.url.note;
	}
	if (result.type === "nevent" && client.url.nevent) {
		nip19Encode = neventEncode(result.data);
		clientUrl = client.url.nevent;
	} else if (result.type === "nevent") {
		nip19Encode = noteEncode(result.data.id);
		clientUrl = client.url.note;
	}
	// naddr は対応クライアント(url.naddr あり)のみボタンが表示される前提
	if (result.type === "naddr" && client.url.naddr) {
		nip19Encode = naddrEncode(result.data);
		clientUrl = client.url.naddr;
	}
	return clientUrl + nip19Encode;
};

// クリックしたクライアントを「前回使ったアプリ」として記録する(遷移は既存の href に任せる)
const rememberClient = () => {
	setLastClientKey(client.key);
};

// 表示名: 「アプリで開く」(apps)のみ i18n キーを優先する(英語 UI でも日本語で表示される課題への対応)。
// 他クライアントはブランド名なので const.ts の name をそのまま使う
const displayName = $derived(
	client.key === "apps"
		? $_("clients.apps", { default: client.name })
		: client.name,
);
</script>

{#if variant === "primary"}
  <div class="col-12">
    <a
      class="item item_primary mt-2 d-flex align-items-center justify-content-center"
      href="{linkUrl()}"
      onclick={rememberClient}
    >
      <div class="bg-white app_icon">
        <img src={client.imgsrc} alt="" class="img-fluid" />
      </div>
      <div class="primary_text ms-2">{displayName}</div>
    </a>
  </div>
{:else}
  <div class="col-4">
    <a class="item mt-2 text-center" href="{linkUrl()}" onclick={rememberClient}>
      <div class="d-flex justify-content-center">
        <div class="bg-white app_icon">
          <img src={client.imgsrc} alt="" class="img-fluid" />
        </div>
      </div>
      <div class="app_text mt-1">{displayName}</div>
    </a>
  </div>
{/if}

<style>
  a {
    display: inline-block;
    text-decoration: none;
  }
  .app_icon {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 42px;
    height: 42px;
    /* margin-right: 2rem; */
  }
  .app_text {
    font-size: 8px;
  }
  .item {
    padding: 0.6rem 0;
    width: 100%;
  }
  .item_primary {
    display: flex;
    padding: 0.8rem 0;
  }
  .primary_text {
    font-size: 1rem;
  }
</style>
