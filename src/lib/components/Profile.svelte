<script lang="ts">
// @ts-ignore
import QRCode from "qrcode";
import { getSingleItem } from "$lib/nostr";
import { openModal } from "$lib/ui";
import ZapModal from "$lib/components/ZapModal.svelte";
  import { nip19 } from "nostr-tools";

export let id: string;
let metadata: { [key: string]: string } | null | "failed" = null;
let qrString = "";
const getItem = async () => {
	const data = await getSingleItem({ kind: 0, author: id });
	if (!data) {
		metadata = "failed";
		return;
	}
	metadata = JSON.parse(data.content);
  const npub = nip19.npubEncode(id)
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
		.catch((err: string) => {
			qrString = "";
		});
};
getItem();

const sendZapHandle = () => {
	openModal();
};
</script>

{#if !metadata}
  loading
{:else if metadata === "failed"}
  取得に失敗しました
{:else}
  <div class="item">
    <div class="d-flex mt-2">
      <img src={metadata.picture} alt="" class="picture" />
      <div>
        <div class="text-break">
          {metadata.display_name}
        </div>
        <div class="text-break">
          @{metadata.name}
        </div>
      </div>
    </div>
    <div class="mt-3 about">
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
        <strong>NIP-05:</strong> {metadata.nip05}
      </div>
    {/if}
    {#if metadata.lud16}
      <div class="mt-2">
        <strong>LUD16:</strong> {metadata.lud16}
      </div>
    {/if}
    {#if qrString}
      <div class="mt-4 text-center">
        <img src={qrString} alt="" class="w-50 qr_backgroud">
      </div>
    {/if}
    <div class="mt-3 d-flex gap-2 justify-content-center">
      <div>
        <button class="btn btn-sm btn-circle" on:click>
          <i class="bi bi-copy"></i> COPY
        </button>
      </div>
      <div>
        <button class="btn btn-sm btn-circle" on:click>
          <i class="bi bi-share-fill"></i> SHARE
        </button>
      </div>
      <div>
        <button class="btn btn-sm btn-circle" on:click={sendZapHandle}>
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
    border: 1px solid #ddd;
    color: #ddd
  }

  .about {
    white-space: pre-wrap;
  }

  .qr_backgroud {
    background: linear-gradient(
      135deg,
      #5a3e8b 5%,
      #b75fa2 50%,
      #ff914d 95%
    );
  }
</style>
