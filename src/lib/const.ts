export type Client = {
  key: string,
  name: string,
  imgsrc: string,
  url: {
    npub: string,
    nprofile?: string,
    note: string,
    nevent?: string,
    naddr?: string,
  }
  nip05: boolean,
}

export const clients: Client[] = [
  {
    key: "apps",
    name: 'アプリで開く',
    imgsrc: '/image/app_icon.svg',
    url: {
      npub: 'nostr:',
      nprofile: 'nostr:',
      note: 'nostr:',
      nevent: 'nostr:',
      naddr: 'nostr:',
    },
    nip05: false,
  },
  {
    key: "primal",
    name: 'Primal',
    imgsrc: '/image/primal.svg',
    url: {
      npub: 'https://primal.net/p/',
      nprofile: 'https://primal.net/p/',
      note: 'https://primal.net/e/',
      nevent: 'https://primal.net/e/',
      naddr: 'https://primal.net/a/',
    },
    nip05: true,
  },
  {
    key: "njump",
    name: 'njump',
    imgsrc: '/image/njump.png',
    url: {
      npub: 'https://njump.me/',
      nprofile: 'https://njump.me/',
      note: 'https://njump.me/',
      nevent: 'https://njump.me/',
      naddr: 'https://njump.me/',
    },
    nip05: true,
  },
  {
    key: "nostrudel",
    name: 'noStrudel',
    imgsrc: '/image/nostrudel.svg',
    url: {
      npub: 'https://nostrudel.ninja/u/',
      nprofile: 'https://nostrudel.ninja/u/',
      note: 'https://nostrudel.ninja/n/',
      nevent: 'https://nostrudel.ninja/n/',
      naddr: 'https://nostrudel.ninja/articles/',
    },
    nip05: false,
  },
  {
    key: "coracle",
    name: 'Coracle',
    imgsrc: '/image/coracle.png',
    url: {
      npub: 'https://coracle.social/',
      nprofile: 'https://coracle.social/',
      note: 'https://coracle.social/',
      nevent: 'https://coracle.social/',
      naddr: 'https://coracle.social/',
    },
    nip05: false,
  },
  {
    key: "snort",
    name: 'Snort',
    imgsrc: '/image/snort.png',
    url: {
      npub: 'https://snort.social/',
      nprofile: 'https://snort.social/',
      note: 'https://snort.social/',
      nevent: 'https://snort.social/',
    },
    nip05: false,
  },
  {
    key: "nostter",
    name: 'nostter',
    imgsrc: '/image/nostter.png',
    url: {
      npub: 'https://nostter.app/',
      nprofile: 'https://nostter.app/',
      note: 'https://nostter.app/',
      nevent: 'https://nostter.app/',
      naddr: 'https://nostter.app/',
    },
    nip05: false,
  },
  {
    key: "lumilumi",
    name: 'Lumilumi',
    imgsrc: '/image/lumilumi.svg',
    url: {
      npub: 'https://lumilumi.app/',
      nprofile: 'https://lumilumi.app/',
      note: 'https://lumilumi.app/',
      nevent: 'https://lumilumi.app/',
      naddr: 'https://lumilumi.app/',
    },
    nip05: false,
  },

]
