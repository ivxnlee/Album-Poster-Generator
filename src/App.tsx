import { useState, useEffect, useRef } from "react";
import { Vibrant } from "node-vibrant/browser";
import debounce from "lodash/debounce";
import useEmblaCarousel from "embla-carousel-react";
import { isMobile } from "react-device-detect";
import { Download, ArrowBigLeft } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./App.css";
import PosterView from "./components/posterView";
import LoadingOverlay from "./components/loadingOverlay";
import type SpotifyData from "./interfaces";
import type SpotifyTrack from "./interfaces";

function App() {
  const posterRef1 = useRef<HTMLDivElement>(null);
  const posterRefDownload = useRef<HTMLDivElement>(null);
  const [userFlow, setUserFlow] = useState<number>(1);
  const [searchName, setSearchName] = useState<string>("");
  const [inputHasLength, setInputHasLength] = useState<boolean>(false);
  const [albumsDisplay, setAlbumsDisplay] = useState<SpotifyData[]>([]);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  // User Flow 3 States
  const calculatedScaleX = (window.innerWidth * 0.9) / 679; // Calculate scale based on window width and original poster width
  const calculatedScaleY = (window.innerHeight * 0.8) / 960; // Calculate scale based on window height and original poster height
  const [scale, setScale] = useState<number>(Math.min(calculatedScaleX, calculatedScaleY));
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyData | null>(null);
  const [albumTracks, setAlbumTracks] = useState<SpotifyTrack[]>([]);
  const [albumColors, setAlbumColors] = useState<string[]>([]);
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    // Detect if device is touch-capable
    const touch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    setIsTouch(touch);

    // Handle Scale on Window Resize with debounce to optimize performance
    const handleResize = debounce(() => {
      const newCalculatedScaleX = (window.innerWidth * 0.9) / 679;
      const newCalculatedScaleY = (window.innerHeight * 0.8) / 960;
      setScale(Math.min(newCalculatedScaleX, newCalculatedScaleY));
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setInputHasLength(searchName.trim().length > 0);
  }, [searchName]);

  useEffect(() => {
    if (selectedAlbum) {
      // Get prominent colors from the album cover using Vibrant package
      Vibrant.from(selectedAlbum.image)
        .getPalette()
        .then((palette) => {
          const prominentColors = [
            palette.Vibrant?.hex,
            palette.Muted?.hex,
            palette.DarkVibrant?.hex,
          ].filter(Boolean) as string[];

          setAlbumColors(prominentColors);
        });
    }
  }, [selectedAlbum]);

  // Emabla carousel API Handling
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedDesignIndex(emblaApi.selectedScrollSnap());
    };

    // Attach listener
    emblaApi.on("select", onSelect);

    // Set initial index
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!emblaApi) return;

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        emblaApi.scrollNext();
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        emblaApi.scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [emblaApi]);

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

  // fetch album tracks during User Flow 3 after album selection
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

  // Handle enter key press in search input
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputHasLength) {
      handleAlbumSearch();
    }
  };

  // Handle album click during User Flow 2 depending on if device is touch-capable or not
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

  // Handle PDF Download during User Flow 3
  const downloadPDF = async () => {
    if (!posterRefDownload.current) return;

    const canvas = await html2canvas(posterRefDownload.current, {
      scale: 2, // increase for better quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    // Maintain aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? "landscape" : "portrait",
      unit: "px",
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("download.pdf");
  };

  return (
    <div className="outer-container">
      {isLoading && <LoadingOverlay />}
      {(userFlow === 1 || userFlow === 2) && (
        <>
          <span className="site-title">Album Poster Generator</span>
          <span className="site-subtitle">Create Your Perfect Album Poster in Seconds</span>
          <div className="search-input-wrapper">
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
        userFlow === 3 &&
        selectedAlbum && (
          <>
            <div className="flex-center" style={{ height: "10%" }}>
              <span className="site-title site-title-small">Album Poster Generator</span>
            </div>

            <div className="embla">
              {!isMobile && (
                <div className="arrow left" onClick={() => emblaApi?.scrollPrev()}>
                  &#10094;
                </div>
              )}
              <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                  <div className="embla__slide">
                    <PosterView
                      ref={posterRef1}
                      album={selectedAlbum}
                      tracks={albumTracks}
                      scale={scale}
                      albumColors={albumColors}
                      selectedDesignIndex={0}
                    />
                  </div>
                  <div className="embla__slide">PLACEHOLDER</div>
                </div>
              </div>
              {!isMobile && (
                <div className="arrow right" onClick={() => emblaApi?.scrollNext()}>
                  &#10095;
                </div>
              )}
            </div>

            {/* Hidden poster at full scale (1.0) for high-quality downloads */}
            <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
              <PosterView
                ref={posterRefDownload}
                album={selectedAlbum}
                tracks={albumTracks}
                scale={1}
                albumColors={albumColors}
                selectedDesignIndex={selectedDesignIndex}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                height: "10%",
                display: "flex",
                marginLeft: "5%",
                marginRight: "5%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "35%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <button
                  className="standard-button back-button"
                  onClick={() => {
                    setSelectedAlbum(null);
                    setSelectedIndex(undefined);
                    setUserFlow(2);
                    setAlbumTracks([]);
                  }}
                >
                  <ArrowBigLeft size={36} color={"#ffffff"} />
                </button>
                <button className="standard-button download-button" onClick={downloadPDF}>
                  <Download size={36} color={"#ffffff"} />
                </button>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default App;
