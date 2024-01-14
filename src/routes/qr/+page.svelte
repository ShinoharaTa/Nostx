<script lang="ts">
  // @ts-ignore
  import QRCode from "qrcode";

  let nip19 = "";
  let url = "";
  const generate = () => {
    if (nip19 === "") return;
    QRCode.toDataURL("https://nostx.io/" + nip19)
      .then((result: string) => {
        url = result;
      })
      .catch((err: string) => {
        url = "";
      });
  };
</script>

<div class="page text-center">
  <div class="px-4 pt-5">
    <div class="">
      <div class="text-center">
        <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      </div>
    </div>
    <!-- <div class="mt-4" id="generatedQR"></div> -->
    <div class="mt-4 card py-3 bg-dark">
      Nostrの npub or note入力すると<br />
      `https://nostx.io/npub...`の <br />
      形式のQRコードを生成します
    </div>
    {#if url}
    <div class="mt-4">
      <img src={url} class="img-fluid w-75" alt="" />
    </div>
    {:else}
    <div class="mt-4">
      <img src="/image/notimage.png" class="img-fluid w-75" alt="" />
    </div>
    {/if}
    <div class="text-center mt-5">
      <textarea
        bind:value={nip19}
        class="form-control"
        placeholder="npub... or note..."
        rows="3"
      />
      <div class="mt-3">
        <button class="btn btn-lg bg-brand px-4" on:click={generate}>
          QRコードを生成する
        </button>
      </div>
    </div>
    <div class="mt-4">
      <a href="javascript:void(0)" class="" on:click={() => window.history.back()}>
        «　前のページへ
      </a>
    </div>
  </div>
</div>

<style>
  .card {
    /* color: #444;
    background: #f2f2f2; */
    font-size: 0.8rem;
    font-family: initial;
  }
</style>
