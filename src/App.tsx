import { useState, useEffect } from "react";
import "./App.css";
import PosterView from "./components/posterView";
import LoadingOverlay from "./components/loadingOverlay";
import type SpotifyData from "./interfaces";
import type SpotifyTrack from "./interfaces";

function App() {
  const [language, setLanguage] = useState<string>("English (US)");
  const [size, setSize] = useState<string>("A4");
  const [userFlow, setUserFlow] = useState<number>(1);
  const [searchName, setSearchName] = useState<string>("");
  const [inputHasLength, setInputHasLength] = useState<boolean>(false);
  const [albumsDisplay, setAlbumsDisplay] = useState<SpotifyData[]>([]);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyData | null>(null);
  const [albumTracks, setAlbumTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Detect if device is touch-capable
  useEffect(() => {
    const touch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    setIsTouch(touch);
  }, []);

  useEffect(() => {
    if (language === "English (US)") {
      //document.documentElement.lang = "en-US";
    }
  }, [language]);

  useEffect(() => {
    setInputHasLength(searchName.trim().length > 0);
  }, [searchName]);

  const handleInputChange = (e: string) => {
    let input = e;

    // Remove invalid characters (keep letters, numbers, !@$&, and spaces)
    let filtered = input.replace(/[^a-zA-Z0-9 !@$&]/g, "");
    // Replace multiple spaces with single space
    filtered = filtered.replace(/\s+/g, " ");
    // Trim leading/trailing spaces
    filtered = filtered.trimStart(); // allow typing without trimming middle spaces

    // Set filtered value to state
    setSearchName(filtered);
  };

  // Handle Album Search during User Flow 1
  const handleAlbumSearch = async () => {
    setIsLoading(true);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/handleSpotifySearchRequest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchName }),
    });

    if (!response.ok) {
      console.error(response);
      setIsLoading(false);
    }

    const data = await response.json();
    console.log("🚀 ~ handleAlbumSearch ~ data:", data);
    if (data.length > 0) {
      setAlbumsDisplay(data);
      setUserFlow(2);
      setIsLoading(false);
    }
  };

  const getAlbumTracks = async (albumID: string) => {
    setIsLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/handleSpotifyGetTracksRequest`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumID: albumID }),
      }
    );

    if (!response.ok) {
      console.error(response);
      setIsLoading(false);
    }

    const data = await response.json();
    console.log("🚀 ~ getAlbumTracks ~ data:", data);
    setAlbumTracks(data);
    setIsLoading(false);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputHasLength) {
      handleAlbumSearch();
    }
  };

  const handleAlbumGridClick = (index: number, album: SpotifyData) => {
    if (isTouch) {
      setSelectedIndex(index);
    } else {
      handleUserFlow3(album);
    }
  };

  const handleUserFlow3 = (album: SpotifyData) => {
    setSelectedAlbum(album);
    getAlbumTracks(album.id);
    setUserFlow(3);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
      }}
    >
      {isLoading && <LoadingOverlay />}
      {/*
            <select
        className="language-dropdown"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option disabled>🌐Language</option>
        <option value={"English (US)"}>English (US)</option>
        <option value={"English (UK)"}>English (UK)</option>
        <option value={"Spanish"}>Spanish</option>
      </select>
      */}

      <span className="title">Album Cover Poster Generator</span>
      {(userFlow === 1 || userFlow === 2) && (
        <>
          <span className="subtitle">Create Your Perfect Album Cover Poster in Seconds</span>
          <div
            style={{
              marginTop: "5vh",
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              height: "5vh",
            }}
          >
            <div className="search-input-container">
              <input
                type="text"
                className={`search-input ${!inputHasLength && "empty"}`}
                placeholder="Search For Album OR Artist"
                value={searchName}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleEnter}
              />
              <button
                className={inputHasLength ? "submit-button" : "submit-button-empty"}
                onClick={handleAlbumSearch}
                disabled={!inputHasLength}
              >
                Go!
              </button>
            </div>
          </div>
        </>
      )}

      {userFlow === 2 ? (
        <div className="album-grid">
          {albumsDisplay.map((album, index) => (
            <div
              key={index}
              className="album-grid-item"
              onClick={() => handleAlbumGridClick(index, album)}
            >
              <div className="album-grid-image-wrapper">
                {isTouch && selectedIndex === index && (
                  <div className="album-grid-overlay" onClick={() => handleUserFlow3(album)}>
                    Tap Again To Continue
                  </div>
                )}
                <img className="album-grid-img" src={album.image} alt={album.name} />
              </div>
              <span className="album-grid-name">{album.name}</span>
              <span>{album.artist}</span>
            </div>
          ))}
        </div>
      ) : (
        userFlow === 3 && selectedAlbum && (
          <>
            <PosterView album={selectedAlbum} tracks={albumTracks} />
            <div>
              <label>Size {language === "English (US)" ? "(Inches)" : "(A Size)"}</label>
              {language === "English (US)" ? (
                <select>
                  <option>5.5 x 8.5</option>
                  <option>8.5 x 11</option>
                  <option>11 x 17</option>
                </select>
              ) : (
                <select>
                  <option>A5</option>
                  <option>A4</option>
                  <option>A3</option>
                  <option>A2</option>
                </select>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}

export default App;
