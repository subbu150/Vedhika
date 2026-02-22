import React from "react";
import Confetti from "react-confetti";
import Snowfall from "react-snowfall";

export default function AnimationRenderer({ type, primaryColor = "#3b82f6" }) {
  if (!type || type === "none") return null;

  switch (type) {
    case "confetti":
      return <Confetti recycle numberOfPieces={150} gravity={0.12} />;

    case "snowfall":
      return <Snowfall snowflakeCount={100} speed={[0.5, 1.2]} />;

    case "fireworks":
      return (
        <div className="firework-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="firework-rocket" style={{ "--primary": primaryColor }} />
          ))}
        </div>
      );

    case "waves":
      return (
        <div className="waves-wrapper" style={{ "--primary": primaryColor }}>
          <div className="wave-layer layer-1" />
          <div className="wave-layer layer-2" />
        </div>
      );

    case "gradient":
      return <div className="dynamic-gradient" style={{ "--primary": primaryColor }} />;

    default:
      return null;
  }
}