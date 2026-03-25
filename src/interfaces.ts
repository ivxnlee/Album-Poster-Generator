export default interface SpotifyData {
  id: string;
  name: string;
  artist: string;
  url: string;
  image: string;
  releaseDate: string;
}

export default interface SpotifyTrack {
  name: string;
  track_number: number;
  duration_ms: number;
}
