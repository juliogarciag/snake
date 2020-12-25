import React from "react";

function GameInfo({ score, speed }) {
  return (
    <div>
      <pre>
        <code>Score: {score}</code>
        <br />
        <code>Speed: {speed.toFixed(2)}</code>
      </pre>
    </div>
  );
}

export default GameInfo;
