const Sentry = require("../lib/sentry.js");
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

async function getSpotifyToken() {
  // Check cache first
  const cached = await redis.get("spotify_token");
  if (cached) return cached;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify client ID or secret");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify token request failed: ${text}`);
  }

  const data = await response.json();

  accessToken = data.access_token;

  await redis.set("spotify_token", data.access_token, { ex: data.expires_in - 60 });

  return accessToken;
}

module.exports = getSpotifyToken;
