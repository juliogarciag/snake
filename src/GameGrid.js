import React, { useMemo } from "react";

function times(n) {
  const array = [];
  for (let i = 0; i <= n; i++) {
    array.push(i);
  }
  return array;
}

function SnakePiece() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(50, 50, 50)"
      }}
    />
  );
}

const RANDOM_FOOD_SAMPLES = ["🍒", "🍉", "🍌", "🍓", "🍊", "🍎"];

function sample(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function FoodPiece() {
  const randomFoodEmoji = useMemo(() => sample(RANDOM_FOOD_SAMPLES), []);

  return (
    <span
      role="img"
      aria-label="Food"
      style={{
        lineHeight: "22px",
        fontSize: "24px"
      }}
    >
      {randomFoodEmoji}
    </span>
  );
}

function Cell({ blockSize, holdsFood, holdsSnake }) {
  return (
    <div
      style={{
        width: blockSize,
        height: blockSize,
        border: "1px solid rgb(190, 190, 190)"
      }}
    >
      {holdsSnake ? <SnakePiece /> : null}
      {holdsFood ? <FoodPiece /> : null}
    </div>
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
