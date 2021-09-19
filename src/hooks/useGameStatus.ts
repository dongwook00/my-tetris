import React from 'react';
import { ROWPOINTS } from '../setup';

export const useGameStatus = (rowCleared: number) => {
  const [score, setScore] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [level, setLevel] = React.useState(1);

  React.useEffect(() => {
    if (rowCleared > 0) {
      setScore((prev) => prev + ROWPOINTS[rowCleared - 1] * level);
      setRows((prev) => prev + rowCleared);
    }
  }, [rowCleared]);

  return { score, setScore, rows, setRows, level, setLevel };
};
