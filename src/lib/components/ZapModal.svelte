<script lang="ts">
import Modal from "$lib/components/Modal.svelte";
import { closeModal } from "$lib/ui";
import { _ } from "svelte-i18n";
// @ts-ignore
import QRCode from "qrcode";
import { sendZap } from "$lib/nostr";

let zapSuccess = false;
let zapError = "";
let zapAmount = 10;
let zapComment = "";
let zapSending = false;
let invoice: string | null = null;
let invoiceUrl: string | null = null;

export let lud16: string | null = null;
async function handleSendZap() {
	if (zapAmount <= 0) return;

	zapSending = true;
	zapError = "";
	if (!lud16) return;
	try {
		const result = await sendZap(lud16, zapAmount, zapComment);
		if (result.success) {
			zapSuccess = true;
			invoice = result.invoice;
			const opts = {
				quality: 0.3,
				color: {
					dark: "#fff",
					light: "#0000",
				},
			};
			QRCode.toDataURL(`lightning:${result.invoice}`, opts)
				.then((result: string) => {
					invoiceUrl = result;
				})
				.catch((err: string) => {
					invoiceUrl = null;
				});
		} else {
			zapError = result.message || $_("profile.zap_error");
			invoice = null;
			invoiceUrl = null;
		}
	} catch (e) {
		console.error("Failed to send ZAP", e);
		zapError = $_("profile.zap_error");
	} finally {
		zapSending = false;
	}
}

const copyInvoice = () => {
	if (!invoice) return;
	navigator.clipboard
		.writeText(invoice)
		.then(() => {
			alert($_("profile.copied"));
		})
		.catch((error) => {
			alert($_("profile.copy_failed"));
		});
};
</script>

<Modal>
    <div>
    {#if zapSuccess}
      {#if invoiceUrl}
      <div class="mt-4 text-center">
        <img src={invoiceUrl} class="w-75 qr_background" alt="" />
      </div>
      <div class="mt-3 text-center">
        <i class="bi bi-copy"></i> {$_("profile.tap_to_copy")}
        <button class="form-control form-control-sm text-break mt-2" on:click={copyInvoice}>{invoice}</button>
      </div>
      {/if}
    {:else if zapError}
      <div class="alert alert-danger">
        {zapError}
      </div>
    {:else}
      <div class="align-items-center">
        <label for="zapAmount" class="form-label">{$_("profile.zap_amount")}</label>
        <input
          type="number"
          class="form-control"
          bind:value={zapAmount}
        />
      </div>
      <div class="mt-3 d-flex justify-content-center gap-2">
        {#each [21, 88, 100, 500] as amount}
          <button
            class="btn btn-sm btn-outline-warning"
            on:click={() => zapAmount = amount}
          >
            {amount}
          </button>
        {/each}
      </div>
      <div class="mt-3">
        <label for="zapAmount" class="form-label">{$_("profile.zap_comment")}</label>
        <input
          type="text"
          class="form-control"
          bind:value={zapComment}
        />
      </div>
    {/if}
    </div>
    <div slot="footer" class="w-100 text-center">
      {#if zapSuccess}
        <button type="button" class="btn btn-secondary" on:click={closeModal}>
          {$_("profile.close")}
        </button>
      {:else}
        <button
          type="button"
          class="btn btn-warning"
          on:click={handleSendZap}
          disabled={zapAmount <= 0}
        >
          {#if zapSending}
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {$_("profile.sending")}
          {:else}
            {$_("profile.send_zap")}
          {/if}
        </button>
      {/if}
    </div>
  </Modal>

  <style>
    .qr_background {
  background: linear-gradient(
    135deg,
    hsl(45, 100%, 25%) 0%,   /* ダークなイエロー */
    hsl(45, 100%, 35%) 50%,   /* 中央：少し明るいが全体としてはダークなイエロー */
    hsl(45, 100%, 25%) 100%   /* ダークなイエロー */
  );
}
  </style>
