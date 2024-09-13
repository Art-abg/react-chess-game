import React from "react";
import PropTypes from "prop-types";

const pieceUnicode = {
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
};

const GameInfo = ({
  currentPlayer,
  onUndoMove,
  canUndo,
  onRotateBoard,
  capturedPieces,
  gameStatus,
}) => {
  const renderCapturedPieces = (pieces) => {
    return pieces.map((piece, index) => (
      <span
        key={index}
        className={`captured-piece ${
          piece.toLowerCase() === piece ? "black" : "white"
        }`}
      >
        {pieceUnicode[piece]}
      </span>
    ));
  };

  return (
    <div className="game-info">
      <h2>Current Turn</h2>
      <div className={`player-indicator ${currentPlayer}`}>
        {currentPlayer === "white" ? "♔" : "♚"}
      </div>
      <div className="captured-pieces">
        <div>
          <h3>White Captures:</h3>
          {renderCapturedPieces(capturedPieces.white)}
        </div>
        <div>
          <h3>Black Captures:</h3>
          {renderCapturedPieces(capturedPieces.black)}
        </div>
      </div>
      <div className="game-status">{gameStatus}</div>
      <button onClick={onUndoMove} disabled={!canUndo}>
        Undo Move
      </button>
      <button onClick={onRotateBoard}>Rotate Board</button>
    </div>
  );
};

GameInfo.propTypes = {
  currentPlayer: PropTypes.string.isRequired,
  onUndoMove: PropTypes.func.isRequired,
  canUndo: PropTypes.bool.isRequired,
  onRotateBoard: PropTypes.func.isRequired,
  capturedPieces: PropTypes.shape({
    white: PropTypes.arrayOf(PropTypes.string),
    black: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  gameStatus: PropTypes.string.isRequired,
};

export default GameInfo;
