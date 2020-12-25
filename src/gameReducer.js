const INITIAL_SNAKE_POSITIONS = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 }
];

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

function getInitialState() {
  return {
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
}

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
    return getInitialState();
  }
  return state;
}

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

export default gameReducer;
export { getInitialState };
