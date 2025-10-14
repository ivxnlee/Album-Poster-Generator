import { useState, useEffect } from "react";
import "./App.css";
import PosterView from "./components/posterView";

function App() {
  const [language, setLanguage] = useState<string>("English (US)");
  const [size, setSize] = useState<string>("A4");
  const [userFlow, setUserFlow] = useState<number>(1);
  const [searchName, setSearchName] = useState<string>("");
  const [inputHasLength, setInputHasLength] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAlbumSearch = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/handleSpotifySearchRequest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchName }),
    });

    if (!response.ok) {
      console.error(response);
    }

    const data = await response.json();
    console.log("🚀 ~ handleAlbumSearch ~ data:", data);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputHasLength) {
      handleAlbumSearch();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "20px",
      }}
    >
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

      <span className="title">Album Cover Poster Generator</span>
      {userFlow === 1 ? (
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
      ) : userFlow === 2 ? (
        <div></div>
      ) : (
        <>
          <PosterView />
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
      )}
    </div>
  );
}

export default App;
