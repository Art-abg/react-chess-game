import React from "react";
import Game from "./components/Game";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>React Chess Game</h1>
      <div className="game-container">
        <Game />
      </div>
    </div>
  );
}

export default App;
