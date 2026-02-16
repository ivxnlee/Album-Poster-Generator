import { HashLoader } from "react-spinners";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <HashLoader
        color={"#c0382b"}
        loading={true}
        size={200}
        cssOverride={{ position: "absolute" }}
        speedMultiplier={1.5}
      />
    </div>
  );
};

export default LoadingOverlay;
