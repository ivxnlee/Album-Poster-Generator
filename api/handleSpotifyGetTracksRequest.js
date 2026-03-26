import Sentry from "../lib/sentry.js";
import getSpotifyToken from "../lib/spotifyAuth.js";
import { body, validationResult } from "express-validator";

const validQuery = body("albumID")
  .trim()
  .notEmpty()
  .withMessage("Album ID cannot be empty")
  .isLength({ min: 1, max: 100 })
  .withMessage("Album ID must be between 1 and 100 characters")
  .isAlphanumeric()
  .withMessage("Album ID must contain letters and numbers only");

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

  const { albumID } = req.body;

  try {
    const token = await getSpotifyToken();

    const response = await fetch(`https://api.spotify.com/v1/albums/${albumID}/tracks?limit=36`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spotify API error in Get Tracks Request: ${errorText}`);
    }

    const data = await response.json();
    if (data && data.items && Array.isArray(data.items)) {
      let tracksArr = [];
      data.items.map((item) => {
        if (item.type === "track") {
          tracksArr.push({
            name: item.name,
            duration: item.duration_ms,
          });
        }
      });
      res.status(200).json(tracksArr);
    } else {
      res.status(500).json({ error: "Error Occured" });
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error("Spotify Get Track failed:", e.message);
    res.status(500).json({ error: "Failed to fetch from Spotify API" });
  }
}
