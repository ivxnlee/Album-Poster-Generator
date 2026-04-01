# 🎵 Album Poster Generator

A sleek web app that transforms your favourite albums into stunning, print-ready posters — powered by the Spotify API. Search any album, pick a template, and download your poster in seconds.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

---

![Preview Posters](./public/sample.png)

## ✨ Features

- 🎧 **Spotify Integration** — Pull real album art, tracklists, and metadata directly from Spotify
- 🖼️ **Multiple Templates** — Choose from a curated set of poster layouts to suit any aesthetic
- 💾 **Download & Export** — Save your finished poster as a high-quality PDF, ready to print or share
- ⚡ **Blazing Fast** — Built with Vite for near-instant dev startup and optimised production builds

---

## 🛠️ Tech Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React + TypeScript (Vite) |
| Backend  | Node.js                   |
| Data     | Spotify Web API           |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A [Spotify Developer](https://developer.spotify.com/dashboard) account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/album-poster-generator.git

# Navigate into the project
cd album-poster-generator

# Install dependencies
npm install
```

### Running the App

Codebase is meant to be used with Vercel.

````bash
# Start the project using Vercel
vercel dev

Open [http://localhost:3000](http://localhost:3000) to see it running.

---

## 🔧 Environment Setup

Create a `.env` file in your server directory:

```env
KV_REST_API_READ_ONLY_TOKEN=""
KV_REST_API_TOKEN=""
KV_REST_API_URL="https://example.upstash.io"
KV_URL=""
REDIS_URL=""
SENTRY_DSN=""
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
VERCEL_OIDC_TOKEN=""
VITE_SENTRY_DSN=""
````

> Grab your credentials from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
> KV env data is taken from [Upstash Redis on Vercel](https://upstash.com/docs/redis/howto/vercelintegration).
> Sentry env data is taken from [Sentry](https://sentry.io).

---

## 🖼️ Usage

1. Search for an album by name or artist
2. Select your album — art and metadata are fetched automatically via Spotify
3. Pick a poster template and layout
4. Hit **Download** to export your poster

---

## 🤝 Contributing

Got an idea or found a bug? Contributions are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push and open a pull request

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Ivan Lee Teck Hong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">Made with ❤️ and great taste in music</p>
