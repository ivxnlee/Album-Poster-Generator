import Sentry from "../lib/sentry.js";
import getSpotifyToken from "../lib/spotifyAuth.js";
import { body, validationResult } from "express-validator";

const validQuery = body("query")
  .trim()
  .notEmpty()
  .withMessage("Query cannot be empty")
  .isLength({ min: 1, max: 50 })
  .withMessage("Query must be between 1 and 50 characters")
  .matches(/^[a-zA-Z0-9\s\-'\.&]+$/)
  .withMessage("Invalid characters in query");

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check for User-Agent header to prevent unauthorized access
  if (!req.headers["user-agent"]) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Validate input
  await validQuery.run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { query } = req.body; // Format: { query: name of searched artist/album }

  try {
    const token = await getSpotifyToken();

    if (!token) {
      throw new Error("Failed to obtain Spotify access token");
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spotify API error In Search Request: ${errorText}`);
    }

    const data = await response.json();
    if (data && data.albums) {
      if (data.albums.items) {
        let albumArr = [];
        data.albums.items.map((item) => {
          if (item.album_type === "album") {
            albumArr.push({
              id: item.id,
              name: item.name,
              artist: item.artists.map((artist) => artist.name).join(", "),
              url: item.external_urls.spotify,
              image: item.images[0].url,
              releaseDate: item.release_date,
            });
          }
        });
        res.json(albumArr);
      }
    } else {
      res.status(500).json({ error: "Error Occured" });
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error("Spotify search failed:", e.message);
    res.status(500).json({ error: "Failed to fetch from Spotify API" });
  }
}
