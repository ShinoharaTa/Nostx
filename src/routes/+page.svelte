<script lang="ts">
import { goto } from "$app/navigation";
import { decode } from "nostr-tools/nip19";
import { _ } from "svelte-i18n";

let nip19 = "";
const jump = () => {
	try {
		console.log(nip19);
		decode(nip19);
		goto(`/${nip19}`);
	} catch (e) {
		console.log(e);
	}
};
</script>

<div class="page">
  <div class="px-4 pt-5">
    <div class="text-center">
      <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      <div class="fs-3 mt-3">Nostrの世界をシームレスに</div>
    </div>
    <div class="mt-5 text-center">
      <!-- {$_("app.client_select", { default: "アプリを選ぶ" })} -->
    </div>
    <div class="text-center">
      <div class="fs-4">NIP19簡単変換&連携</div>
    </div>
    <div class="mt-3">このアプリNostxは、Nostrで使われるコード（NIP19形式）を読み取って、あなたが普段使っているアプリやWebサービスで使えるURLに変換するツールです。<br>
      Nostrの情報を簡単に共有したり活用したりできるようサポートします</div>
    <form class="text-center mt-3">
      <input type="text" bind:value={nip19} class="form-control" placeholder="nevent1, nprofile1, npub1 ...">
      <button class="btn btn-light mt-2" on:click={jump} type="button">npubやneventを開く</button>
    </form>
    <div class="text-center mt-5">
      <div class="fs-4 mt-2">QRコードで共有しよう</div>
    </div>
    <div class="mt-4">
      https://nostx.io/... の形式に変換して、簡単に共有できるQRコードを生成します
    </div>
    <div class="text-center mt-3">
      <a href="/qr" class="btn bg-brand px-4">{$_("qr.make", { default: "QRコードを作る" })}</a>
    </div>
  </div>
</div>
