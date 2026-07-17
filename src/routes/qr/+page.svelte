<script lang="ts">
// @ts-ignore
import QRCode from "qrcode";
import { validateNip19Input } from "$lib/validation";
import { onMount } from "svelte";
import { _ } from "svelte-i18n";

let nip19 = $state("");
let url = $state("");
let shareUrl = $state("");
let errorKey = $state<string | null>(null);
let origin = $state("https://nostx.io");
let canShare = $state(false);

onMount(() => {
	origin = location.origin;
	canShare = !!navigator.share;
});

const generate = () => {
	const result = validateNip19Input(nip19);
	if (result.status !== "ok") {
		url = "";
		shareUrl = "";
		switch (result.status) {
			case "nsec-warning":
				errorKey = "validation.nsec_warning";
				break;
			case "unsupported":
				errorKey = "validation.unsupported";
				break;
			default:
				errorKey = "validation.invalid";
				break;
		}
		return;
	}
	errorKey = null;
	const target = `${location.origin}/${nip19.trim()}`;
	QRCode.toDataURL(target)
		.then((result: string) => {
			url = result;
			shareUrl = target;
		})
		.catch(() => {
			url = "";
			shareUrl = "";
		});
};

const share = async () => {
	if (!shareUrl) return;
	let data: ShareData = { url: shareUrl };
	try {
		const blob = await (await fetch(url)).blob();
		const file = new File([blob], "nostx-qr.png", { type: "image/png" });
		if (navigator.canShare?.({ files: [file] })) {
			data = { files: [file] };
		}
	} catch {
		// PNG の変換に失敗した場合は URL のみ共有する
	}
	try {
		await navigator.share(data);
	} catch {
		// ユーザーによるキャンセル等は無視する
	}
};
</script>

<div class="page text-center">
  <div class="px-4 pt-5">
    <div class="">
      <div class="text-center">
        <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="Nostx" />
      </div>
    </div>
    <!-- <div class="mt-4" id="generatedQR"></div> -->
    <div class="mt-4 card py-3 bg-dark">
      {$_("qr.description", { values: { origin } })}
    </div>
    {#if url}
      <div class="mt-4">
        <img src={url} class="img-fluid w-75" alt={$_("a11y.generated_qr")} />
      </div>
      <div class="mt-3">
        <a class="btn btn-outline-light mx-1" href={url} download="nostx-qr.png">
          <i class="bi bi-download"></i>
          {$_("qr.download")}
        </a>
        {#if canShare}
          <button class="btn btn-outline-light mx-1" onclick={share} type="button">
            <i class="bi bi-share"></i>
            {$_("qr.share")}
          </button>
        {/if}
      </div>
    {:else}
      <div class="mt-4">
        <img src="/image/notimage.png" class="img-fluid w-75" alt="" aria-hidden="true" />
      </div>
    {/if}
    <div class="text-center mt-5">
      <textarea
        bind:value={nip19}
        class="form-control"
        placeholder="npub1, nprofile1, note1, nevent1..."
        rows="3"
      ></textarea>
      {#if errorKey}
        <div class="text-danger mt-2">{$_(errorKey)}</div>
      {/if}
      <div class="mt-3">
        <button class="btn btn-lg bg-brand px-4" onclick={generate}>
          {$_("qr.generate")}
        </button>
      </div>
    </div>
    <div class="mt-4">
      <a href="/" class=""> « {$_("qr.back_home")} </a>
    </div>
  </div>
</div>

<style>
  .card {
    /* Bootstrap の .card は文字色が背景 (bg-dark) と同化するため明示する */
    color: #eee;
    font-size: 0.9rem;
    font-family: initial;
  }
</style>
