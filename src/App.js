import React, { useCallback, useEffect, useReducer } from "react";
import DefeatScreen from "./DefeatScreen";
import GameGrid from "./GameGrid";
import GameInfo from "./GameInfo";
import gameReducer, { getInitialState } from "./gameReducer";

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

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
        <GameGrid
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
