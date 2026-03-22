import { useEffect, useRef, useState, forwardRef } from "react";
import type SpotifyData from "../interfaces";
import type SpotifyTrack from "../interfaces";

type PosterViewProps = {
  album: SpotifyData;
  tracks: SpotifyTrack[];
  scale: number;
  albumColors: string[];
  selectedDesignIndex: number;
};

const PosterView = forwardRef<HTMLDivElement, PosterViewProps>(
  ({ album, tracks, scale, albumColors, selectedDesignIndex }, ref) => {
    const titleSizeRef = useRef<HTMLDivElement>(null);
    const [titleFontSize, setTitleFontSize] = useState("36px");

    useEffect(() => {
      if (titleSizeRef.current) {
        let size = 36;
        const el = titleSizeRef.current;

        while (el.scrollWidth > el.clientWidth && size > 12) {
          size -= 1;
          el.style.fontSize = `${size}px`;
        }

        setTitleFontSize(`${size}px`);
      }
    }, [album]);

    function groupBySeven(num: number) {
      if (num <= 0) return 0;
      return Math.ceil(num / 7);
    }

    const numOfRows = groupBySeven(tracks.length);
    let trackFontSize = "16px";
    let columnGap = "20px";

    if (numOfRows === 3) {
      trackFontSize = "14px";
    } else if (numOfRows === 4) {
      trackFontSize = "12px";
    } else if (numOfRows >= 5) {
      trackFontSize = "10px";
      columnGap = "15px";
    }

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={ref}
          style={{
            width: 681 * scale,
            height: 962 * scale,
            position: "relative",
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 10px 30px",
          }}
        >
          <div
            className="poster-view-container"
            style={{
              width: "679px",
              height: "960px",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div className="poster-image-container">
              <img src={album.image} alt={album.name} />
            </div>
            <div className="poster-bottom-container-style1">
              <div className="poster-title-container-style1">
                <div
                  className="flex-col"
                  style={{ width: "70%", justifyContent: "center", whiteSpace: "nowrap" }}
                >
                  <span
                    ref={titleSizeRef}
                    className="album-title"
                    style={{ fontSize: titleFontSize }}
                  >
                    {album.name}
                  </span>
                  <span className="album-artist">{album.artist}</span>
                </div>
                <div
                  className="flex-col"
                  style={{ width: "30%", justifyContent: "center", paddingLeft: "1%" }}
                >
                  <div
                    style={{
                      height: "50%",
                      display: "flex",
                      flexDirection: "row",
                      paddingRight: "1%",
                    }}
                  >
                    {albumColors.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: color,
                          height: "100%",
                          width: `${100 / albumColors.length}%`,
                          margin: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="poster-tracklist-container-style1">
                <div
                  className="poster-tracklist"
                  style={{ columnCount: numOfRows, fontSize: trackFontSize, columnGap: columnGap }}
                >
                  {tracks.map((track, index) => (
                    <span key={index} className="poster-tracklist-item">
                      {index + 1}. {track.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PosterView;
