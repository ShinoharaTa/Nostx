<script lang="ts">
import { goto } from "$app/navigation";
import { validateNip19Input } from "$lib/validation";
import { _ } from "svelte-i18n";

let nip19 = "";
let errorKey: string | null = null;

const jump = () => {
	const result = validateNip19Input(nip19);
	switch (result.status) {
		case "ok":
			errorKey = null;
			goto(`/${nip19.trim()}`);
			break;
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
};
</script>

<div class="page">
  <div class="px-4 pt-5">
    <div class="text-center">
      <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      <div class="fs-3 mt-3">{$_("top.catchphrase")}</div>
    </div>
    <div class="mt-5 text-center">
      <!-- {$_("app.client_select", { default: "アプリを選ぶ" })} -->
    </div>
    <div class="text-center">
      <div class="fs-4">{$_("top.feature_title")}</div>
    </div>
    <div class="mt-3">{$_("top.feature_description")}</div>
    <form class="text-center mt-3">
      <input type="text" bind:value={nip19} class="form-control" placeholder="nevent1, nprofile1, npub1 ...">
      {#if errorKey}
        <div class="text-danger mt-2">{$_(errorKey)}</div>
      {/if}
      <button class="btn btn-light mt-2" on:click={jump} type="button">{$_("top.open_button")}</button>
    </form>
    <div class="text-center mt-5">
      <div class="fs-4 mt-2">{$_("top.qr_title")}</div>
    </div>
    <div class="mt-4">
      {$_("top.qr_description")}
    </div>
    <div class="text-center mt-3">
      <a href="/qr" class="btn bg-brand px-4">{$_("qr.make")}</a>
    </div>
  </div>
</div>
