
<script lang="ts">
  import { clients } from "../lib/const";
  import ClientItem from "./ClientItem.svelte";
  export let select = "";
</script>

{#each clients as client}
<button
  class="item mt-3"
  class:selected={select === client.key}
  on:click={() => {select = client.key}}
>
  <ClientItem imgsrc={client.imgsrc} name={client.name} />
</button>
{/each}
