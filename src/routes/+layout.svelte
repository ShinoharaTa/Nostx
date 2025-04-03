<script>
import "$lib/styles/style.scss";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from "$lib/components/Footer.svelte";
</script>

<div class="h-min-100vh">
  <slot />
  <Footer></Footer>
</div>
<style>
  .h-min-100vh {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
</style>
