export type Client = {
  key: string,
  name: string,
  imgsrc: string,
  url: {
    npub: string,
    nprofile?: string,
    note: string,
    nevent?: string,
  }
  nip05: boolean,
  smartphone: boolean,
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
    },
    nip05: false,
    smartphone: false,
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
    },
    nip05: true,
    smartphone: false,
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
    },
    nip05: false,
    smartphone: false,
  },
  {
    key: "iris",
    name: 'Iris',
    imgsrc: '/image/iris.png',
    url: {
      npub: "https://iris.to/",
      nprofile: "https://iris.to/",
      note: "https://iris.to/",
      nevent: "https://iris.to/",
    },
    nip05: true,
    smartphone: false,
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
    smartphone: false,
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
    },
    nip05: false,
    smartphone: false,
  },
]
