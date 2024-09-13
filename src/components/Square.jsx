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

const Square = ({ piece, isSelected, isDark, onClick }) => {
  return (
    <div
      className={`square ${isDark ? "dark" : "light"} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {piece !== " " && (
        <span
          className={`piece ${
            piece.toLowerCase() === piece ? "black" : "white"
          }`}
        >
          {pieceUnicode[piece]}
        </span>
      )}
    </div>
  );
};

Square.propTypes = {
  piece: PropTypes.string,
  isSelected: PropTypes.bool,
  isDark: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

Square.defaultProps = {
  piece: "",
  isSelected: false,
  isDark: false,
};

export default Square;
