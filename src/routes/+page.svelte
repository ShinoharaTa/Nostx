<script lang="ts">
  import { _ } from "svelte-i18n";
</script>

<div class="page">
  <div class="px-4 pt-5">
    <div class="d-grid">
      <div class="text-center">
        <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" />
      </div>
      <div class="mt-5 text-center">
        <!-- {$_("app.client_select", { default: "アプリを選ぶ" })} -->
      </div>
      <div>
        このアプリケーションの使い方を記載します。
      </div>
    </div>
  </div>
  <div class="text-center mt-4">
    <a href="/qr">QRコードを作る</a>
  </div>
</div>
