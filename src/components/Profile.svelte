<script lang="ts">
  import { Metadata, NostrApp, Text } from "nosvelte";
  import "websocket-polyfill";

  const relays = ["wss://relay.damus.io", "wss://relay.snort.social"];
  export let id: string = "";
</script>

<NostrApp {relays}>
  <Metadata queryKey={["metadata", id]} pubkey={id} let:metadata>
    <div class="item">
      <!-- <div
        class="background"
        style={`background-image: url(${JSON.parse(metadata.content).banner});`}
      />
      <div class="overlay" /> -->
      <div class="d-flex mt-4">
        <img
          src={JSON.parse(metadata.content).picture}
          alt=""
          class="picture"
        />
        <div>
          <div class="text-break">
            {JSON.parse(metadata.content).display_name}
          </div>
          <div class="text-break">
            @{JSON.parse(metadata.content).name}
          </div>
        </div>
      </div>
      <div class="mt-3 about">
        {JSON.parse(metadata.content).about}
      </div>
    </div>
  </Metadata>
</NostrApp>

<style>
  /* .background {
    content: "";
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    height: 120px;
    width: 100%;
  }

  .overlay {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 121px;
    background-image: linear-gradient(180deg, transparent 0 60%, #fff 100%);
  } */

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
