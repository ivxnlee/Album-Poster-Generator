import React, { useState, useEffect } from "react";
import { isMobile, isBrowser } from "react-device-detect";

const PosterView: React.FC = () => {
  const [previewSize, setPreviewSize] = useState({ width: 248, height: 351 });
  const [textColor, setTextColor] = useState("black");
  const [bgColor, setBgColor] = useState("white");

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
    ></div>
  );
};

export default PosterView;
