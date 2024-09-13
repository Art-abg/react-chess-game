import React from "react";
import PropTypes from "prop-types";
import Square from "./Square";

const Board = ({ board, selectedSquare, onSquareClick, isRotated }) => {
  const renderSquare = (row, col) => {
    return (
      <Square
        key={`${row}-${col}`}
        piece={board[row][col]}
        isSelected={
          selectedSquare &&
          selectedSquare.row === row &&
          selectedSquare.col === col
        }
        isDark={(row + col) % 2 === 1}
        onClick={() => onSquareClick(row, col)}
      />
    );
  };

  const renderBoard = () => {
    let rows = [...Array(8).keys()];
    let cols = [...Array(8).keys()];

    if (isRotated) {
      rows.reverse();
      cols.reverse();
    }

    return (
      <div className="board">
        {rows.map((row) => (
          <div key={row} className="board-row">
            <div className="rank-label">{8 - row}</div>
            {cols.map((col) => renderSquare(row, col))}
          </div>
        ))}
        <div className="file-labels">
          {cols.map((col) => (
            <div key={col} className="file-label">
              {String.fromCharCode(97 + col)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return renderBoard();
};

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  selectedSquare: PropTypes.shape({
    row: PropTypes.number,
    col: PropTypes.number,
  }),
  onSquareClick: PropTypes.func.isRequired,
  isRotated: PropTypes.bool.isRequired,
};

export default Board;
