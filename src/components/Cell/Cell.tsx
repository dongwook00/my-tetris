import React from 'react';
import { StyledCell } from './Cell.styles';
import { TETROMINOS } from '../../setup';

type Props = {
  type: keyof typeof TETROMINOS;
  index: number;
};

const Cell: React.FC<Props> = ({ type, index }) => {
  return <StyledCell data-index={index} type={type} color={TETROMINOS[type].color} />;
};

export default React.memo(Cell);
