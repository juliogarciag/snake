import React from "react";

function DefeatScreen({ height, width, onRestart }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex"
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontFamily: "monospace",
          textAlign: "center",
          color: "rgb(220, 220, 220)",
          alignSelf: "center",
          width: "100%",
          position: "relative",
          top: "-30px"
        }}
      >
        Game Over
        <div>
          <button onClick={onRestart}>Play Again</button>
        </div>
      </h1>
    </div>
  );
}

export default DefeatScreen;
