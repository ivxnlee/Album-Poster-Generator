import React from "react";
import type SpotifyData from "../interfaces";
import type SpotifyTrack from "../interfaces";

const PosterView: React.FC<{
  album: SpotifyData;
  tracks: SpotifyTrack[];
  scale: number;
  albumColors: string[];
  selectedDesignIndex: number;
}> = ({ album, tracks, scale, albumColors, selectedDesignIndex }) => {
  function groupBySeven(num: number) {
    if (num <= 0) return 0;
    return Math.ceil(num / 7);
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
        style={{
          width: 681 * scale,
          height: 962 * scale,
          position: "relative",
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
          <div className="poster-bottom-design-container">
            <div className="poster-title-container">
              <div className="flex-col" style={{ width: "70%", justifyContent: "center" }}>
                {/* album title size needs to be more flexible depending on length */}
                <span className="album-title">{album.name}</span>
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
            <div className="poster-tracklist-container">
              <div
                className="poster-tracklist"
                style={{ columnCount: groupBySeven(tracks.length) }}
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
};

export default PosterView;
