import React from "react";
import PropTypes from "prop-types";

const Square = ({ piece, isSelected, onClick }) => {
  return (
    <button
      className={`square ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {piece}
    </button>
  );
};

Square.propTypes = {
  piece: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

Square.defaultProps = {
  piece: "",
  isSelected: false,
};

export default Square;
