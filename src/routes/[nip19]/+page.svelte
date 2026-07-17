<script lang="ts">
import { onMount } from "svelte";
import Application from "$lib/components/Application.svelte";
import { clients } from "$lib/const";
import { page } from "$app/state";
import { parseQuery } from "$lib/nostr";
import { getLastClientKey } from "$lib/preferences";
import Article from "$lib/components/Article.svelte";
import PostContent from "$lib/components/Content.svelte";
import Profile from "$lib/components/Profile.svelte";
import { _ } from "svelte-i18n";
import type { Event } from "nostr-tools";
import type { DecodeResult } from "nostr-tools/nip19";
import { nip19 as nip19tools } from "nostr-tools";
import { validateNip19Input } from "$lib/validation";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();

const key: string = page.params.nip19;
const validation = validateNip19Input(key);

let nip19decode = $state<DecodeResult | null>();
let process = $state(true);
let isMobile = $state(false);
let lastClientKey = $state<string | null>(null);

// ---- サーバー(load)で取得済みの OGP 用データ ----
const ogp = data.ogp;

// kind:0 イベントの content をプロフィール情報として安全にパースする
const parseMetadataContent = (
	event: Event | null,
): { [key: string]: string } | null => {
	if (!event) return null;
	try {
		return JSON.parse(event.content);
	} catch {
		return null;
	}
};

const serverEvent: Event | null = ogp?.event ?? null;
const serverProfile = parseMetadataContent(ogp?.profile ?? null);

// OGP の description 用に空白をたたんで先頭 150 字程度に丸める
const truncateForOgp = (value: string, max = 150): string => {
	const singleLine = value.replace(/\s+/g, " ").trim();
	return singleLine.length > max ? `${singleLine.slice(0, max)}…` : singleLine;
};

// og:image に使える http(s) URL かどうか
const isHttpUrl = (value: unknown): value is string =>
	typeof value === "string" && /^https?:\/\//.test(value);

// 表示名(display_name → name → 短縮 npub の順)
const resolveDisplayName = (pubkey: string): string => {
	if (serverProfile?.display_name) return serverProfile.display_name;
	if (serverProfile?.name) return serverProfile.name;
	try {
		return `${nip19tools.npubEncode(pubkey).slice(0, 12)}...`;
	} catch {
		return "Nostr";
	}
};

// ---- OGP メタタグの値を組み立てる(データなし時は汎用 OGP) ----
const GENERIC_OGP_DESCRIPTION =
	"Nostx is a redirect service that opens Nostr profiles and notes in your favorite Nostr apps.";
let ogTitle = $state("Nostx");
let ogDescription = $state(GENERIC_OGP_DESCRIPTION);
let ogImage = $state(`${page.url.origin}/image/nostxlogo.svg`);

// イベントのタグから最初の値を取り出す
const getTagValue = (event: Event, name: string): string | undefined => {
	const tag = event.tags.find((t) => t[0] === name && t[1]);
	return tag?.[1];
};

const serverPicture = serverProfile?.picture;
if (ogp && ogp.type === "naddr" && serverEvent) {
	// 記事: og:title = title タグ、og:description = summary タグまたは content 先頭 150 字
	const articleTitle = getTagValue(serverEvent, "title");
	if (articleTitle) {
		ogTitle = articleTitle;
	}
	const summary = getTagValue(serverEvent, "summary") ?? serverEvent.content;
	if (summary) {
		ogDescription = truncateForOgp(summary);
	}
	const articleImage = getTagValue(serverEvent, "image");
	if (isHttpUrl(articleImage)) {
		ogImage = articleImage;
	} else if (isHttpUrl(serverPicture)) {
		ogImage = serverPicture;
	}
} else if (ogp && (ogp.type === "npub" || ogp.type === "nprofile") && ogp.profile) {
	ogTitle = resolveDisplayName(ogp.profile.pubkey);
	if (serverProfile?.about) {
		ogDescription = truncateForOgp(serverProfile.about);
	}
	if (isHttpUrl(serverPicture)) {
		ogImage = serverPicture;
	}
} else if (ogp && (ogp.type === "note" || ogp.type === "nevent") && serverEvent) {
	ogTitle = `${resolveDisplayName(serverEvent.pubkey)}の投稿`;
	if (serverEvent.content) {
		ogDescription = truncateForOgp(serverEvent.content);
	}
	if (isHttpUrl(serverPicture)) {
		ogImage = serverPicture;
	}
}

// naddr のときは naddr 対応 URL を持つクライアントだけを表示対象にする
const supportsCurrentType = (client: (typeof clients)[number]): boolean =>
	nip19decode?.type !== "naddr" || Boolean(client.url.naddr);
const appsClient = clients.find((client) => client.key === "apps");
// 前回使ったアプリ(記録がなければ null)。大ボタンとして先頭に表示する
const lastClient = $derived(
	clients.find(
		(client) => client.key === lastClientKey && supportsCurrentType(client),
	) ?? null,
);
// 大ボタン(前回使ったアプリ・モバイルの「アプリで開く」)に出したクライアントは一覧から除外する
const listClients = $derived(
	clients.filter(
		(client) =>
			supportsCurrentType(client) &&
			client.key !== lastClient?.key &&
			!(isMobile && client.key === "apps"),
	),
);

onMount(async () => {
	isMobile =
		window.innerWidth < 768 ||
		/android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
	lastClientKey = getLastClientKey();
	if (validation.status === "nsec-warning" || validation.status === "unsupported") {
		// 秘密鍵や未対応形式はクライアントへ渡さない
		nip19decode = null;
	} else {
		// "invalid" でも NIP-05 (name@domain) の可能性があるため parseQuery に委ねる
		nip19decode = await parseQuery(key);
	}
	process = false;
});
</script>

<svelte:head>
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<div class="page">
  <div class="px-4 pt-3">
    <div class="d-grid">
      <div class="text-center">
        <a href="/">
          <img src="/image/nostxlogo.svg" class="img-fluid w-25" alt="Nostx" />
        </a>
      </div>
      {#if process}
        <div class="mt-5">Loading...</div>
      {:else if validation.status === "nsec-warning" || validation.status === "unsupported"}
        <div
          class="text-danger text-center mt-5 py-4 px-5 border border-danger item"
        >
          <div class="d-flex align-items-center justify-content-center">
            <div class="bg-white error_icon">
              <img src="/image/error_icon.jpg" alt="" aria-hidden="true" class="img-fluid" />
            </div>
          </div>
          <div class="mt-4">
            {#if validation.status === "nsec-warning"}
              {$_("validation.nsec_warning")}
            {:else}
              {$_("validation.unsupported")}
            {/if}
          </div>
        </div>
      {:else}
        {#if nip19decode}
          <div class="mt-4">
            {#if nip19decode}
              {#if nip19decode.type === "npub"}
                <Profile id={nip19decode.data} initialMetadata={serverProfile} />
              {:else if nip19decode.type === "nprofile"}
                <Profile
                  id={nip19decode.data.pubkey}
                  relays={nip19decode.data.relays ?? []}
                  initialMetadata={serverProfile}
                />
              {:else if nip19decode.type === "note"}
                <PostContent
                  id={nip19decode.data}
                  initialEvent={serverEvent}
                  initialMetadata={serverProfile}
                />
              {:else if nip19decode.type === "nevent"}
                <PostContent
                  id={nip19decode.data.id}
                  relays={nip19decode.data.relays ?? []}
                  author={nip19decode.data.author}
                  kind={nip19decode.data.kind}
                  initialEvent={serverEvent}
                  initialMetadata={serverProfile}
                />
              {:else if nip19decode.type === "naddr"}
                <Article
                  kind={nip19decode.data.kind}
                  pubkey={nip19decode.data.pubkey}
                  identifier={nip19decode.data.identifier}
                  relays={nip19decode.data.relays ?? []}
                  initialEvent={serverEvent}
                  initialMetadata={serverProfile}
                />
              {/if}
            {/if}
          </div>
          {#if lastClient}
            <div class="mt-3 text-center">{$_("app.last_used")}</div>
            <div class="row g-2">
              <Application
                client={lastClient}
                result={nip19decode}
                variant="primary"
              />
            </div>
          {/if}
          {#if isMobile && appsClient && appsClient.key !== lastClientKey}
            <div class="row g-2 mt-2">
              <Application
                client={appsClient}
                result={nip19decode}
                variant="primary"
              />
            </div>
          {/if}
          <div class="mt-3 text-center">{$_("app.client_select")}</div>
          <div class="row g-2">
            {#each listClients as client}
              <Application {client} result={nip19decode} />
            {/each}
          </div>
        {:else}
          <div
            class="text-danger text-center mt-5 py-4 px-5 border border-danger item"
          >
            <div class="d-flex align-items-center justify-content-center">
              <div class="bg-white error_icon">
                <img src="/image/error_icon.jpg" alt="" aria-hidden="true" class="img-fluid" />
              </div>
            </div>
            <div class="mt-4">
              {$_("single.error")}
              {#if validation.status === "invalid"}
                <div class="mt-2">{$_("validation.invalid")}</div>
              {/if}
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
