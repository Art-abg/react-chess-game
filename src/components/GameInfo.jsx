import React from "react";
import PropTypes from "prop-types";

const GameInfo = ({ currentPlayer }) => {
  return (
    <div className="game-info">
      <h2>Current Turn: {currentPlayer}</h2>
    </div>
  );
};

GameInfo.propTypes = {
  currentPlayer: PropTypes.string.isRequired,
};

export default GameInfo;
