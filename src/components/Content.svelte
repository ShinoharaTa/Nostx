<script lang="ts">
  import { Metadata, NostrApp, Text } from "nosvelte";
  import "websocket-polyfill";
  import { fromUnixTime, format } from "date-fns";

  const relays = ["wss://relay.damus.io", "wss://relay.snort.social"];
  // const id = "b6cf76789bd25d11eafa65d28c16dd640056919f703191aa06619c5b21f732e3";
  export let id: string = "";
</script>

<NostrApp {relays}>
  <Text queryKey={[id]} {id} let:text>
    <div class="item">
      <div class="d-flex">
        <Metadata
          queryKey={["metadata", text.pubkey]}
          pubkey={text.pubkey}
          let:metadata
        >
          <img
            src={JSON.parse(metadata.content).picture}
            alt=""
            class="picture"
          />
          <p class="text-break">
            {JSON.parse(metadata.content).display_name} @{JSON.parse(
              metadata.content
            ).name}
          </p>
        </Metadata>
      </div>
      <div class="mt-3 text-break">
        {text.content}
      </div>
      <div class="text-end mt-2">
        {format(fromUnixTime(text.created_at), "yyyy/MM/dd HH:mm")}
      </div>
    </div>
  </Text>
</NostrApp>

<style>
  .picture {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 42px;
    height: 42px;
    margin-right: 1rem;
  }

  .item {
    font-size: 14px;
    padding: 1rem;
  }
</style>
