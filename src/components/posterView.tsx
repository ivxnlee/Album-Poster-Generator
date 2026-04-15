import { useEffect, useRef, useState, forwardRef } from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import type SpotifyData from "../interfaces";
import type SpotifyTrack from "../interfaces";

dayjs.extend(advancedFormat);

type PosterViewProps = {
  album: SpotifyData;
  tracks: SpotifyTrack[];
  scale: number;
  albumColors: string[];
  selectedDesignIndex: number;
};

const PosterView = forwardRef<HTMLDivElement, PosterViewProps>(
  ({ album, tracks, scale, albumColors, selectedDesignIndex }, ref) => {
    const titleSizeRef1 = useRef<HTMLDivElement>(null);
    const titleSizeRef2 = useRef<HTMLDivElement>(null);
    const artistSizeRef2 = useRef<HTMLDivElement>(null);
    const titleSizeRef3 = useRef<HTMLDivElement>(null);
    const tracklistSizeOuterRef3 = useRef<HTMLDivElement>(null);
    const tracklistSizeInnerRef3 = useRef<HTMLDivElement>(null);
    const [titleFontSize1, setTitleFontSize1] = useState("36px");
    const [titleFontSize2, setTitleFontSize2] = useState("32px");
    const [artistFontSize2, setArtistFontSize2] = useState("26px");
    const [titleFontSize3, setTitleFontSize3] = useState("48px");
    const [tracklistFontSize3, setTracklistFontSize3] = useState("16px");

    useEffect(() => {
      if (titleSizeRef1.current) {
        let sizeStyle1 = 36;

        const el = titleSizeRef1.current;

        while (el.scrollWidth > el.clientWidth && sizeStyle1 > 12) {
          sizeStyle1 -= 1;
          el.style.fontSize = `${sizeStyle1}px`;
        }

        setTitleFontSize1(`${sizeStyle1}px`);
      }

      if (titleSizeRef2.current) {
        let sizeStyle2 = 32;

        const el = titleSizeRef2.current;

        while (el.scrollHeight > el.clientHeight && sizeStyle2 > 12) {
          sizeStyle2 -= 1;
          el.style.fontSize = `${sizeStyle2}px`;
        }
        setTitleFontSize2(`${sizeStyle2}px`);
      }

      if (artistSizeRef2.current) {
        let sizeStyleArtist2 = 26;

        const el = artistSizeRef2.current;

        while (el.scrollHeight > el.clientHeight && sizeStyleArtist2 > 12) {
          sizeStyleArtist2 -= 1;
          el.style.fontSize = `${sizeStyleArtist2}px`;
        }
        setArtistFontSize2(`${sizeStyleArtist2}px`);
      }

      if (titleSizeRef3.current) {
        let sizeStyle3 = 48;

        const el = titleSizeRef3.current;

        while (el.scrollHeight > el.clientHeight && sizeStyle3 > 24) {
          sizeStyle3 -= 1;
          el.style.fontSize = `${sizeStyle3}px`;
        }
        setTitleFontSize3(`${sizeStyle3}px`);
      }
    }, [album]);

    useEffect(() => {
      // For design 3, adjust tracklist font size to fit within container only after mapping track names to a single sentence
      requestAnimationFrame(() => {
        const outerTracklistRef3 = tracklistSizeOuterRef3.current;
        const innerTracklistRef3 = tracklistSizeInnerRef3.current;
        if (!outerTracklistRef3 || !innerTracklistRef3) return;

        let sizeStyle4 = 16;
        outerTracklistRef3.style.fontSize = `${sizeStyle4}px`;

        while (
          sizeStyle4 > 8 &&
          innerTracklistRef3.offsetHeight > outerTracklistRef3.clientHeight
        ) {
          sizeStyle4 -= 1;
          outerTracklistRef3.style.fontSize = `${sizeStyle4}px`;
        }

        setTracklistFontSize3(`${sizeStyle4}px`);
      });
    }, [tracks]);

    function groupBySeven(num: number) {
      if (num <= 0) return 0;
      return Math.ceil(num / 7);
    }

    const numOfRows = groupBySeven(tracks.length);
    let trackFontSize = "16px";
    let columnGap = "20px";

    if (selectedDesignIndex === 0) {
      if (numOfRows === 3) {
        trackFontSize = "14px";
      } else if (numOfRows === 4) {
        trackFontSize = "12px";
      } else if (numOfRows >= 5) {
        trackFontSize = "10px";
        columnGap = "15px";
      }
    }

    if (selectedDesignIndex === 1) {
      if (tracks.length <= 12) {
        trackFontSize = "14px";
      } else if (tracks.length > 12 && tracks.length < 16) {
        trackFontSize = "12px";
      } else if (tracks.length >= 16) {
        trackFontSize = "10px";
      }
    }

    const renderPosterOption = () => {
      switch (selectedDesignIndex) {
        case 0:
          return (
            <div className="poster-bottom-container-style1">
              <div className="poster-title-container-style1">
                <div
                  className="flex-col"
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span
                    ref={titleSizeRef1}
                    className="album-title"
                    style={{ fontSize: titleFontSize1 }}
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
                    className="album-colors-container"
                    style={{
                      height: "50%",
                      paddingRight: "1%",
                    }}
                  >
                    {albumColors.map((color, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: color,
                          aspectRatio: "1 / 1",
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
                  style={{
                    columnCount: numOfRows,
                    fontSize: trackFontSize,
                    columnGap: columnGap,
                  }}
                >
                  {tracks.map((track, index) => (
                    <span key={index} className="poster-tracklist-item">
                      {index + 1}. {track.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="poster-bottom-container-style2">
              <div className="poster-tracklist-container-style2">
                <div className="poster-tracklist" style={{ fontSize: trackFontSize }}>
                  {tracks.map((track, index) => (
                    <span key={index} className="poster-tracklist-item">
                      {index + 1}. {track.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="poster-title-container-style2">
                <div
                  className="album-colors-container"
                  style={{
                    height: "15%",
                  }}
                >
                  {albumColors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: color,
                        aspectRatio: "1 / 1",
                        margin: "2px",
                      }}
                    />
                  ))}
                </div>
                <div
                  className="flex-col"
                  style={{ justifyContent: "center", whiteSpace: "wrap", height: "85%" }}
                >
                  <span style={{ fontSize: "18px", fontWeight: "bold", height: "10%" }}>
                    {dayjs(album.releaseDate).format("MMMM Do, YYYY")}
                  </span>
                  <span
                    ref={artistSizeRef2}
                    className="album-artist"
                    style={{ fontWeight: "bold", fontSize: artistFontSize2, height: "20%" }}
                  >
                    {album.artist}
                  </span>
                  <span
                    ref={titleSizeRef2}
                    className="album-title"
                    style={{ fontSize: titleFontSize2, fontWeight: "800", height: "70%" }}
                  >
                    {album.name}
                  </span>
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="poster-bottom-container-style1">
              <div className="poster-content-container-style3">
                <span
                  ref={titleSizeRef3}
                  style={{
                    fontSize: titleFontSize3,
                    fontWeight: "800",
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                >
                  {album.name}
                  <span style={{ fontSize: "16px" }}>
                    {dayjs(album.releaseDate).format("YYYY")}
                  </span>
                </span>
              </div>
              <div className="poster-content-container-style3">
                <div
                  ref={tracklistSizeOuterRef3}
                  style={{
                    fontSize: tracklistFontSize3,
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <span ref={tracklistSizeInnerRef3}>{tracks.map((t) => t.name).join(", ")}</span>
                </div>
              </div>
            </div>
          );
        default:
          return <div>Error</div>;
      }
    };

    return (
      <div className="poster-view-parent-container">
        <div
          ref={ref}
          style={{
            width: 679 * scale,
            height: 960 * scale,
            position: "relative",
            boxShadow: "rgba(0, 0, 0, 0.3) 0px 10px 30px",
          }}
        >
          <div
            style={{
              width: "679px",
              height: "960px",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div
              className="poster-view-container"
              style={selectedDesignIndex === 2 ? { backgroundColor: "#ded9d3" } : {}}
            >
              <div className="poster-image-container">
                <img src={album.image} alt={album.name} />
              </div>
              <>{renderPosterOption()}</>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PosterView;
