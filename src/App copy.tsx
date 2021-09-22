import React from 'react';
import { throttle } from 'lodash';
import { createStage, isColliding } from './gameHelpers';

import { useInterval } from './hooks/useInterval';
import { usePlayer } from './hooks/usePlayer';
import { useStage } from './hooks/useStage';
import { useGameStatus } from './hooks/useGameStatus';

import Stage from './components/Stage/Stage';
import Display from './components/Display/Display';
import StartButton from './components/StartButton/StartButton';

import { StyledTetrisWrapper, StyledTetris } from './App.styles';

const App: React.FC = () => {
  const [dropTime, setDroptime] = React.useState<null | number>(null);
  const [gameOver, setGameOver] = React.useState(true);

  const gameArea = React.useRef<HTMLDivElement>(null);

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);

  const movePlayer = React.useCallback(
    (dir: number) => {
      if (!isColliding(player, stage, { x: dir, y: 0 })) {
        updatePlayerPos({ x: dir, y: 0, collided: false });
      }
    },
    [updatePlayerPos],
  );

  const keyUp = ({ keyCode }: { keyCode: number }): void => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDroptime(1000 / level + 2000);
      }
    }
  };

  const handleStartGame = (): void => {
    if (gameArea.current) gameArea.current.focus();
    setStage(createStage());
    setDroptime(1000);
    resetPlayer();
    setScore(0);
    setLevel(1);
    setRows(0);
    setGameOver(false);
  };

  const move = ({ keyCode, repeat }: { keyCode: number; repeat: boolean }): void => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        if (repeat) return;
        setDroptime(30);
      } else if (keyCode === 38) {
        playerRotate(stage);
      }
    }
  };

  const drop = (): void => {
    if (rows > level * 10) {
      setLevel((prev) => prev + 1);
    }

    if (!isColliding(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDroptime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!e.currentTarget) return;
      console.log('onmosuemove');
      const elements = e.currentTarget.children;
      const target = e.target as HTMLElement;
      let indexOfcurrentBlock;
      let right;
      let left;
      for (const el of elements) {
        if (el.getAttribute('type') === 'O') {
          indexOfcurrentBlock = el.getAttribute('data-index');
        }
      }
      const indexOfMouseCursor = target.getAttribute('data-index');
      if (indexOfcurrentBlock && indexOfMouseCursor) {
        right = indexOfcurrentBlock < indexOfMouseCursor;
        left = indexOfcurrentBlock > indexOfMouseCursor;
      }
      // console.log('result', right, left);
      if (left) movePlayer(-1);
      if (right) movePlayer(1);
    },
    [movePlayer],
  );

  const throttled = React.useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => onMouseMove(e), 1000),
    [onMouseMove],
  );

  const mousemove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      throttled(e);
    },
    [throttled],
  );
  return (
    <StyledTetrisWrapper role="button" tabIndex={0} onKeyDown={move} onKeyUp={keyUp} ref={gameArea}>
      <StyledTetris>
        <div className="display">
          {gameOver ? (
            <>
              <Display gameOver={gameOver} text="Game Over!" />
              <StartButton callback={handleStartGame} />
            </>
          ) : (
            <>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </>
          )}
        </div>
        <Stage stage={stage} onMouseMove={mousemove} />
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default App;
