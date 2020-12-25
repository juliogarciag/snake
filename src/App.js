import React, { useCallback, useEffect, useReducer } from "react";

function times(n) {
  const array = [];
  for (let i = 0; i <= n; i++) {
    array.push(i);
  }
  return array;
}

function Cell({ blockSize, color }) {
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

function Grid({ height, width, blockSize, snakePositions, foodPosition }) {
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
                  color={
                    holdsSnake
                      ? "rgb(50, 50, 50)"
                      : holdsFood
                      ? "rgb(120, 300, 30)"
                      : "transparent"
                  }
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function moveSnake(positions, getHeadPosition) {
  const reversedPositions = [...positions].reverse();
  const reversedNewPositions = reversedPositions.map((position, index) => {
    if (index === 0) {
      return getHeadPosition(position.x, position.y);
    } else {
      return reversedPositions[index - 1];
    }
  });
  reversedNewPositions.reverse();
  return reversedNewPositions;
}

const MOVEMENTS = {
  DOWN: (positions) => {
    return moveSnake(positions, (x, y) => {
      return { x, y: y + 1 };
    });
  },
  UP: (positions) => {
    return moveSnake(positions, (x, y) => {
      return { x, y: y - 1 };
    });
  },
  LEFT: (positions) => {
    return moveSnake(positions, (x, y) => {
      return { x: x - 1, y };
    });
  },
  RIGHT: (positions) => {
    return moveSnake(positions, (x, y) => {
      return { x: x + 1, y };
    });
  }
};

function collidedWithFood(head, foodPosition) {
  return head.x === foodPosition.x && head.y === foodPosition.y;
}

function collidedWithWalls(head, width, height) {
  return head.x < 0 || head.y < 0 || head.x > width || head.y > height;
}

function collidedWithItself(head, snakePositions) {
  const nonHeadPositions = snakePositions.slice(0, -1);
  return nonHeadPositions.some((position) => {
    return position.x === head.x && position.y === head.y;
  });
}

function getCollisionInformation(snakePositions, width, height, foodPosition) {
  const head = snakePositions[snakePositions.length - 1];

  const withWalls = collidedWithWalls(head, width, height);
  const withFood = !withWalls && collidedWithFood(head, foodPosition);
  const withItself = !withFood && collidedWithItself(head, snakePositions);

  return { withWalls, withFood, withItself };
}

const INITIAL_SNAKE_POSITIONS = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 }
];

const INITIAL_STATE = {
  snakePositions: INITIAL_SNAKE_POSITIONS,
  foodPosition: spawnFood(INITIAL_SNAKE_POSITIONS, 30, 30),
  width: 30,
  height: 30,
  direction: "RIGHT",
  lastSafeDirection: "RIGHT",
  ended: false,
  defeat: false,
  speed: 1,
  score: 0
};

function spawnFood(snakePositions, width, height) {
  let randomX = Math.floor(Math.random() * width);
  let randomY = Math.floor(Math.random() * height);

  if (
    snakePositions.some(
      (position) => position.x === randomX && position.y === randomY
    )
  ) {
    return spawnFood(snakePositions, width, height);
  } else {
    return { x: randomX, y: randomY };
  }
}

function addNewTail(tail, direction) {
  const { x, y } = tail;
  switch (direction) {
    case "UP":
      return { x, y: y + 1 };
    case "DOWN":
      return { x, y: y - 1 };
    case "LEFT":
      return { x: x + 1, y };
    case "RIGHT":
      return { x: x - 1, y };
    default:
      throw new Error("Unknown direction when adding a new tail.");
  }
}

function eatFood(snakePositions, direction) {
  const tail = snakePositions[0];
  const newPositions = [...snakePositions];
  newPositions.unshift(addNewTail(tail, direction));
  return newPositions;
}

function gameReducer(state, action) {
  if (action.type === "MOVE") {
    if (state.ended) {
      return state;
    }

    const nextPositions = MOVEMENTS[state.direction](state.snakePositions);
    const collision = getCollisionInformation(
      nextPositions,
      state.width,
      state.height,
      state.foodPosition
    );

    if (collision.withWalls) {
      return {
        ...state,
        ended: true,
        defeat: true
      };
    } else if (collision.withFood) {
      return {
        ...state,
        snakePositions: eatFood(nextPositions, state.direction),
        foodPosition: spawnFood(
          state.snakePositions,
          state.width,
          state.height
        ),
        score: state.score + 1,
        speed: state.speed + 0.07
      };
    } else if (collision.withItself) {
      return {
        ...state,
        ended: true,
        defeat: true
      };
    } else {
      return {
        ...state,
        lastSafeDirection: state.direction,
        snakePositions: nextPositions
      };
    }
  } else if (action.type === "CHANGE_DIRECTION") {
    return {
      ...state,
      direction: action.direction
    };
  } else if (action.type === "RESTART") {
    return INITIAL_STATE;
  }
  return state;
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowLeft": {
          if (state.lastSafeDirection !== "RIGHT") {
            dispatch({ type: "CHANGE_DIRECTION", direction: "LEFT" });
          }
          break;
        }
        case "ArrowRight": {
          if (state.lastSafeDirection !== "LEFT") {
            dispatch({ type: "CHANGE_DIRECTION", direction: "RIGHT" });
          }
          break;
        }
        case "ArrowDown": {
          if (state.lastSafeDirection !== "UP") {
            dispatch({ type: "CHANGE_DIRECTION", direction: "DOWN" });
          }
          break;
        }
        case "ArrowUp": {
          if (state.lastSafeDirection !== "DOWN") {
            dispatch({ type: "CHANGE_DIRECTION", direction: "UP" });
          }
          break;
        }
        default: {
          break;
        }
      }
    },
    [dispatch, state.lastSafeDirection]
  );

  const handleRestart = useCallback(() => {
    dispatch({ type: "RESTART" });
  }, [dispatch]);

  useEffect(() => {
    window.document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const moveAutomatically = useCallback(() => {
    dispatch({ type: "MOVE" });
  }, [dispatch]);

  useEffect(() => {
    const intervalTime = 1 / (state.speed / 250);
    const interval = setInterval(moveAutomatically, intervalTime);

    return () => clearInterval(interval);
  }, [state.speed, moveAutomatically]);

  const blockSize = 20;

  return (
    <>
      <GameInfo score={state.score} speed={state.speed} />
      <div style={{ position: "relative" }}>
        {state.defeat && (
          <DefeatScreen
            height={state.height * (blockSize + 3)}
            width={state.width * (blockSize + 3)}
            onRestart={handleRestart}
          />
        )}
        <Grid
          height={state.height}
          width={state.width}
          blockSize={blockSize}
          snakePositions={state.snakePositions}
          foodPosition={state.foodPosition}
        />
      </div>
    </>
  );
}
