import React, { useState, useEffect } from "react";
import { isMobile, isBrowser } from "react-device-detect";
import type SpotifyData from "../interfaces";
import type SpotifyTrack from "../interfaces";

const PosterView: React.FC<{ album: SpotifyData; tracks: SpotifyTrack[] }> = ({
  album,
  tracks,
}) => {
  const [previewSize, setPreviewSize] = useState({ width: 248, height: 351 });
  const [textColor, setTextColor] = useState("black");
  const [bgColor, setBgColor] = useState("white");
  console.log("🚀 ~ PosterView ~ album:", album);
  useEffect(() => {
    if (isMobile) {
      setPreviewSize({ width: 248, height: 351 });
    } else if (isBrowser) {
      setPreviewSize({ width: 496, height: 702 });
    }
  }, []);

  return (
    <div
      className="poster-view-container"
      style={{
        width: previewSize.width,
        height: previewSize.height,
      }}
    >
      <div>Test Text</div>
    </div>
  );
};

export default PosterView;
