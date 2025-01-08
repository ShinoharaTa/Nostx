<script lang="ts">
import type { Client } from "$lib/const";
import {
	neventEncode,
	noteEncode,
	nprofileEncode,
	npubEncode,
	type DecodeResult,
} from "nostr-tools/nip19";
export let client: Client;
export let result: DecodeResult;

const linkUrl = () => {
	let nip19Encode = "";
	let clientUrl = "";
	if (result.type === "npub") {
		nip19Encode = npubEncode(result.data);
		clientUrl = client.url.npub;
	}
	if (result.type === "nprofile" && client.url.nprofile) {
		nip19Encode = nprofileEncode(result.data);
		clientUrl = client.url.nprofile;
	} else if (result.type === "nprofile") {
		nip19Encode = npubEncode(result.data.pubkey);
		clientUrl = client.url.npub;
	}
	if (result.type === "note") {
		nip19Encode = noteEncode(result.data);
		clientUrl = client.url.note;
	}
	if (result.type === "nevent" && client.url.nevent) {
		nip19Encode = neventEncode(result.data);
		clientUrl = client.url.nevent;
	} else if (result.type === "nevent") {
		nip19Encode = noteEncode(result.data.id);
		clientUrl = client.url.note;
	}
	return clientUrl + nip19Encode;
};
</script>

<div class="col-4">
  <a class="item mt-2 text-center" href="{linkUrl()}">
    <div class="d-flex justify-content-center">
      <div class="bg-white app_icon">
        <img src={client.imgsrc} alt="" class="img-fluid" />
      </div>
    </div>
    <div class="app_text mt-1">{client.name}</div>
  </a>
</div>

<style>
  a {
    display: inline-block;
    text-decoration: none;
  }
  .app_icon {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;
    width: 42px;
    height: 42px;
    /* margin-right: 2rem; */
  }
  .app_text {
    font-size: 8px;
  }
  .item {
    padding: 0.6rem 0;
    width: 100%;
  }
</style>
