import React from 'react';
import Cell from '../Cell/Cell';
import { StyledStage } from './Stage.styles';
import { TETROMINOS } from '../../setup';

export type STAGECELL = [keyof typeof TETROMINOS, string];
export type STAGE = STAGECELL[][];

type Props = {
  stage: STAGE;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const Stage: React.FC<Props> = ({ stage, onMouseMove }) => (
  <StyledStage onMouseMove={onMouseMove}>{stage.map((row) => row.map((cell, x) => <Cell index={x} key={x} type={cell[0]} />))}</StyledStage>
);

export default Stage;
