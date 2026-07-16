<script lang="ts">
// @ts-ignore
import QRCode from "qrcode";
import { getSingleItem } from "$lib/nostr";
import { openModal } from "$lib/ui";
import ZapModal from "$lib/components/ZapModal.svelte";
import { nip19 } from "nostr-tools";
import { _ } from "svelte-i18n";
import { queryProfile, type Nip05 } from "nostr-tools/nip05";

export let id: string;
export let relays: string[] = [];
let metadata: { [key: string]: string } | null = null;
let status: "loading" | "loaded" | "failed" = "loading";
let qrString = "";
let npub = "";
let nip05Verify= "";

$: shortNpub = npub ? `${npub.slice(0, 12)}...` : "";
const getItem = async () => {
	status = "loading";
	try {
		const data = await getSingleItem({ kind: 0, author: id, relays });
		if (!data) {
			status = "failed";
			return;
		}
		metadata = JSON.parse(data.content);
	} catch {
		// タイムアウトを含む取得失敗
		status = "failed";
		return;
	}
	status = "loaded";
	npub = nip19.npubEncode(id);
	const opts = {
		quality: 0.3,
		color: {
			dark: "#fff",
			light: "#0000",
		},
	};
	QRCode.toDataURL(`nostr:${npub}`, opts)
		.then((result: string) => {
			qrString = result;
		})
		.catch(() => {
			qrString = "";
		});
	if (!metadata) return;
	if (metadata.nip05) {
		try {
			const result = await queryProfile(metadata.nip05);
			nip05Verify = result ? "✅️" : "";
		} catch {
			nip05Verify = "";
		}
	}
};
getItem();

const sendZapHandle = () => {
	openModal();
};

const copyToNpub = () => {
	navigator.clipboard
		.writeText(npub)
		.then(() => {
			alert($_("profile.copied"));
		})
		.catch((error) => {
			alert($_("profile.copy_failed"));
		});
};

const shareToNpub = () => {
	if (!metadata) return;
	navigator
		.share({
			url: window.location.href,
		})
		.then(() => console.log("共有に成功しました"))
		.catch((error) => console.error("共有に失敗しました:", error));
};
</script>

{#if status === "loading"}
  <div class="item" aria-busy="true">
    <div class="d-flex mt-2 align-items-center">
      <div class="skeleton skeleton-avatar"></div>
      <div class="flex-grow-1">
        <div class="skeleton skeleton-line w-50"></div>
        <div class="skeleton skeleton-line w-25 mt-2"></div>
      </div>
    </div>
    <div class="skeleton skeleton-line mt-3"></div>
    <div class="skeleton skeleton-line mt-2 w-75"></div>
  </div>
{:else if status === "failed" || !metadata}
  <div class="item text-center">
    <div>{$_("profile.fetch_failed")}</div>
    <button class="btn btn-sm btn-outline-light mt-3" on:click={getItem}>
      <i class="bi bi-arrow-clockwise"></i> {$_("profile.retry")}
    </button>
  </div>
{:else}
  <div class="item">
    <div class="d-flex mt-2">
      <img src={metadata.picture} alt="" class="picture" />
      <div>
        <div class="text-break">
          {metadata.display_name || metadata.name || shortNpub}
        </div>
        {#if metadata.name}
        <div class="text-break">
          @{metadata.name}
        </div>
        {/if}
      </div>
    </div>
    <div class="mt-3 about text-break">
      {metadata.about}
    </div>
    {#if metadata.website}
      <div class="mt-2">
        <strong>WEB SITE: </strong>
        <a href={metadata.website} target="_blank" rel="noopener noreferrer">{metadata.website}</a>
      </div>
    {/if}
    {#if metadata.nip05}
      <div class="mt-2">
        <strong>NIP-05:</strong> {metadata.nip05} {nip05Verify}
      </div>
    {/if}
    {#if metadata.lud16}
      <div class="mt-2">
        <strong>LUD16:</strong> {metadata.lud16}
      </div>
    {/if}
    {#if qrString}
      <div class="mt-4 text-center">
        <img src={qrString} alt="" class="w-50 qr_background">
      </div>
    {/if}
    <div class="mt-3 d-flex gap-2 justify-content-center">
      <div>
        <button class="btn btn-sm btn-circle btn-light" on:click={copyToNpub}>
          <i class="bi bi-copy"></i> COPY
        </button>
      </div>
      <div>
        <button class="btn btn-sm btn-circle btn-light" disabled={!navigator.share} on:click={shareToNpub}>
          <i class="bi bi-share-fill"></i> SHARE
        </button>
      </div>
      <div>
        <button class="btn btn-sm btn-circle btn-warning" disabled={!metadata.lud16} on:click={sendZapHandle}>
          <i class="bi bi-lightning-charge-fill"></i> ZAP
        </button>
      </div>
    </div>
  </div>
  {#if metadata.lud16}
  <ZapModal lud16={metadata.lud16}></ZapModal>
  {/if}
{/if}

<style>
  .picture {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 64px;
    height: 64px;
    margin-right: 1rem;
  }

  .item {
    font-size: 14px;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .btn-circle {
    border-radius: 20px;
  }

  .skeleton {
    background: #333;
    border-radius: 4px;
  }

  .skeleton-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .skeleton-line {
    height: 0.9rem;
  }

  .about {
    white-space: pre-wrap;
  }

  .qr_background {
    background: linear-gradient(
      135deg,
      #5a3e8b 5%,
      #b75fa2 50%,
      #ff914d 95%
    );
  }
</style>
