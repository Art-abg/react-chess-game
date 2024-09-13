import React from "react";
import PropTypes from "prop-types";
import Square from "./Square";

const Board = ({ board, selectedSquare, onSquareClick }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isSelected={
                selectedSquare &&
                selectedSquare.row === rowIndex &&
                selectedSquare.col === colIndex
              }
              onClick={() => onSquareClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  selectedSquare: PropTypes.shape({
    row: PropTypes.number,
    col: PropTypes.number,
  }),
  onSquareClick: PropTypes.func.isRequired,
};

export default Board;
