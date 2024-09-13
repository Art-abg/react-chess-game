import React, { useState, useCallback, useEffect } from "react";
import Board from "./Board";
import GameInfo from "./GameInfo";
import {
  isValidMove,
  isCastlingMove,
  isEnPassantMove,
  isPawnPromotion,
  isInCheck,
  isCheckmate,
  isStalemate,
} from "./chessLogic";

const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const Game = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({
    white: [],
    black: [],
  });
  const [isRotated, setIsRotated] = useState(false);
  const [gameStatus, setGameStatus] = useState("");
  const [lastMove, setLastMove] = useState(null);

  useEffect(() => {
    checkGameStatus();
  }, [board, currentPlayer]);

  const checkGameStatus = () => {
    if (isCheckmate(board, currentPlayer)) {
      setGameStatus(
        `Checkmate! ${currentPlayer === "white" ? "Black" : "White"} wins!`
      );
    } else if (isStalemate(board, currentPlayer)) {
      setGameStatus("Stalemate! The game is a draw.");
    } else if (isInCheck(board, currentPlayer)) {
      setGameStatus(
        `${
          currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)
        } is in check!`
      );
    } else {
      setGameStatus("");
    }
  };

  const handleSquareClick = useCallback(
    (row, col) => {
      if (!selectedSquare) {
        if (
          board[row][col] !== " " &&
          (board[row][col].toLowerCase() === board[row][col]) ===
            (currentPlayer === "black")
        ) {
          setSelectedSquare({ row, col });
        }
      } else {
        const start = [selectedSquare.row, selectedSquare.col];
        const end = [row, col];

        if (
          isValidMove(board, start, end, currentPlayer) ||
          isCastlingMove(board, start, end, currentPlayer) ||
          isEnPassantMove(board, start, end, lastMove)
        ) {
          makeMove(start, end);
        }
        setSelectedSquare(null);
      }
    },
    [board, selectedSquare, currentPlayer, lastMove]
  );

  const makeMove = useCallback(
    (start, end) => {
      const [startRow, startCol] = start;
      const [endRow, endCol] = end;
      const newBoard = board.map((row) => [...row]);
      const movingPiece = newBoard[startRow][startCol];
      let capturedPiece = newBoard[endRow][endCol];

      // Handle castling
      if (isCastlingMove(board, start, end, currentPlayer)) {
        const isKingsideCastling = endCol > startCol;
        const rookCol = isKingsideCastling ? 7 : 0;
        const newRookCol = isKingsideCastling ? 5 : 3;
        newBoard[endRow][newRookCol] = newBoard[endRow][rookCol];
        newBoard[endRow][rookCol] = " ";
      }

      // Handle en passant
      if (isEnPassantMove(board, start, end, lastMove)) {
        const capturedPawnRow = startRow;
        const capturedPawnCol = endCol;
        capturedPiece = newBoard[capturedPawnRow][capturedPawnCol];
        newBoard[capturedPawnRow][capturedPawnCol] = " ";
      }

      newBoard[endRow][endCol] = movingPiece;
      newBoard[startRow][startCol] = " ";

      // Handle pawn promotion
      if (isPawnPromotion(newBoard, end)) {
        const promotionPiece =
          prompt("Choose promotion piece: Q, R, B, or N") || "Q";
        newBoard[endRow][endCol] =
          currentPlayer === "white"
            ? promotionPiece.toUpperCase()
            : promotionPiece.toLowerCase();
      }

      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setMoveHistory([...moveHistory, { start, end, board: [...board] }]);
      setLastMove({ start, end });

      if (capturedPiece !== " ") {
        setCapturedPieces((prev) => ({
          ...prev,
          [currentPlayer]: [...prev[currentPlayer], capturedPiece],
        }));
      }
    },
    [board, currentPlayer, moveHistory, lastMove]
  );

  const undoMove = useCallback(() => {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];
      setBoard(lastMove.board);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setMoveHistory(moveHistory.slice(0, -1));
      // Remove the last captured piece if there was one
      setCapturedPieces((prev) => {
        const opponent = currentPlayer === "white" ? "black" : "white";
        return {
          ...prev,
          [opponent]: prev[opponent].slice(0, -1),
        };
      });
    }
  }, [moveHistory, currentPlayer]);

  const rotateBoard = () => {
    setIsRotated(!isRotated);
  };

  return (
    <div className="game">
      <Board
        board={board}
        selectedSquare={selectedSquare}
        onSquareClick={handleSquareClick}
        isRotated={isRotated}
      />
      <GameInfo
        currentPlayer={currentPlayer}
        onUndoMove={undoMove}
        canUndo={moveHistory.length > 0}
        onRotateBoard={rotateBoard}
        capturedPieces={capturedPieces}
        gameStatus={gameStatus}
      />
    </div>
  );
};

export default Game;
