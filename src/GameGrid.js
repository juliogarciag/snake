import React from "react";

function times(n) {
  const array = [];
  for (let i = 0; i <= n; i++) {
    array.push(i);
  }
  return array;
}

function Cell({ blockSize, holdsFood, holdsSnake }) {
  const color = holdsSnake
    ? "rgb(50, 50, 50)"
    : holdsFood
    ? "rgb(120, 300, 30)"
    : "transparent";

  return (
    <div
      style={{
        width: blockSize,
        height: blockSize,
        border: "1px solid rgb(120, 120, 120)",
        backgroundColor: color
      }}
    />
  );
}

function GameGrid({ height, width, blockSize, snakePositions, foodPosition }) {
  return (
    <div>
      {times(height).map((i) => {
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              boxShadow: "0px 0px 1px black",
              width: "fit-content"
            }}
          >
            {times(width).map((j) => {
              const x = j;
              const y = i;

              const holdsSnake = snakePositions.some((position) => {
                return position.x === x && position.y === y;
              });

              const holdsFood = foodPosition.x === x && foodPosition.y === y;

              return (
                <Cell
                  key={j}
                  x={x}
                  y={y}
                  blockSize={blockSize}
                  holdsSnake={holdsSnake}
                  holdsFood={holdsFood}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default GameGrid;
