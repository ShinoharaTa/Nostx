<script lang="ts">
  import { getSingleItem } from "$lib/nostr";

  export let id: string = "";
  let metadata: { [key: string]: any } | null = null;
  const getItem = async () => {
    const data = await getSingleItem({ kind: 0, author: id });
    if (data) metadata = JSON.parse(data.content);
  };
  getItem();
</script>

{#if metadata}
  <div class="item">
    <div class="d-flex mt-4">
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
  </div>
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

  .about {
    white-space: pre-wrap;
  }
</style>
