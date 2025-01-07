export type Client = {
  key: string,
  name: string,
  imgsrc: string,
  url_user: string,
  url_note: string,
  nip05: boolean,
  smartphone: boolean,
}

export const clients: Client[] = [
  {
    key: "iris",
    name: 'Iris.to',
    imgsrc: '/image/iris.png',
    url_user: 'https://iris.to/',
    url_note: 'https://iris.to/',
    nip05: true,
    smartphone: false,
  },
  {
    key: "snort",
    name: 'Snort.social',
    imgsrc: '/image/snort.png',
    url_user: 'https://snort.social/',
    url_note: 'https://snort.social/',
    nip05: false,
    smartphone: false,
  },
  {
    key: "nostter",
    name: 'nostter',
    imgsrc: '/image/nostter.png',
    url_user: 'https://nostter.app/',
    url_note: 'https://nostter.app/',
    nip05: false,
    smartphone: false,
  },
  {
    key: "apps",
    name: 'アプリで開く',
    imgsrc: '/image/app_icon.svg',
    url_user: 'nostr:',
    url_note: 'nostr:',
    nip05: false,
    smartphone: false,
  },
]
