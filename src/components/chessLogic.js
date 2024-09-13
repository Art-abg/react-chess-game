const isValidMove = (board, start, end, currentPlayer) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  const piece = board[startRow][startCol];

  // Check if it's the correct player's turn
  if (
    (currentPlayer === "white" && piece.toLowerCase() === piece) ||
    (currentPlayer === "black" && piece.toUpperCase() === piece)
  ) {
    return false;
  }

  // Check if the end position is occupied by the same color piece
  if (
    board[endRow][endCol] !== " " &&
    (piece.toLowerCase() === piece) ===
      (board[endRow][endCol].toLowerCase() === board[endRow][endCol])
  ) {
    return false;
  }

  switch (piece.toLowerCase()) {
    case "p":
      return isValidPawnMove(board, start, end, currentPlayer);
    case "r":
      return isValidRookMove(board, start, end);
    case "n":
      return isValidKnightMove(start, end);
    case "b":
      return isValidBishopMove(board, start, end);
    case "q":
      return isValidQueenMove(board, start, end);
    case "k":
      return isValidKingMove(start, end);
    default:
      return false;
  }
};

const isValidPawnMove = (board, start, end, currentPlayer) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  const direction = currentPlayer === "white" ? -1 : 1;

  // Move forward one square
  if (
    startCol === endCol &&
    endRow === startRow + direction &&
    board[endRow][endCol] === " "
  ) {
    return true;
  }

  // Move forward two squares from starting position
  if (
    startCol === endCol &&
    ((currentPlayer === "white" && startRow === 6 && endRow === 4) ||
      (currentPlayer === "black" && startRow === 1 && endRow === 3)) &&
    board[endRow][endCol] === " " &&
    board[startRow + direction][startCol] === " "
  ) {
    return true;
  }

  // Capture diagonally
  if (
    Math.abs(startCol - endCol) === 1 &&
    endRow === startRow + direction &&
    board[endRow][endCol] !== " " &&
    (board[endRow][endCol].toLowerCase() !== board[endRow][endCol]) ===
      (currentPlayer === "white")
  ) {
    return true;
  }

  return false;
};

const isValidRookMove = (board, start, end) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  if (startRow === endRow) {
    const step = startCol < endCol ? 1 : -1;
    for (let col = startCol + step; col !== endCol; col += step) {
      if (board[startRow][col] !== " ") return false;
    }
    return true;
  }

  if (startCol === endCol) {
    const step = startRow < endRow ? 1 : -1;
    for (let row = startRow + step; row !== endRow; row += step) {
      if (board[row][startCol] !== " ") return false;
    }
    return true;
  }

  return false;
};

const isValidKnightMove = (start, end) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  return (
    (Math.abs(startRow - endRow) === 2 && Math.abs(startCol - endCol) === 1) ||
    (Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 2)
  );
};

const isValidBishopMove = (board, start, end) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  if (Math.abs(startRow - endRow) === Math.abs(startCol - endCol)) {
    const rowStep = startRow < endRow ? 1 : -1;
    const colStep = startCol < endCol ? 1 : -1;
    let row = startRow + rowStep;
    let col = startCol + colStep;

    while (row !== endRow && col !== endCol) {
      if (board[row][col] !== " ") return false;
      row += rowStep;
      col += colStep;
    }
    return true;
  }

  return false;
};

const isValidQueenMove = (board, start, end) => {
  return (
    isValidRookMove(board, start, end) || isValidBishopMove(board, start, end)
  );
};

const isValidKingMove = (start, end) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  return Math.abs(startRow - endRow) <= 1 && Math.abs(startCol - endCol) <= 1;
};

const isCastlingMove = (board, start, end, currentPlayer) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  const piece = board[startRow][startCol].toLowerCase();

  if (piece !== "k") return false;

  const isWhite = currentPlayer === "white";
  const row = isWhite ? 7 : 0;

  // Kingside castling
  if (endCol - startCol === 2) {
    return (
      startRow === row &&
      startCol === 4 &&
      board[row][7] === (isWhite ? "R" : "r") &&
      board[row][5] === " " &&
      board[row][6] === " " &&
      !isInCheck(board, currentPlayer) &&
      !isInCheck(board, currentPlayer, [row, 5]) &&
      !isInCheck(board, currentPlayer, [row, 6])
    );
  }

  // Queenside castling
  if (startCol - endCol === 2) {
    return (
      startRow === row &&
      startCol === 4 &&
      board[row][0] === (isWhite ? "R" : "r") &&
      board[row][1] === " " &&
      board[row][2] === " " &&
      board[row][3] === " " &&
      !isInCheck(board, currentPlayer) &&
      !isInCheck(board, currentPlayer, [row, 3]) &&
      !isInCheck(board, currentPlayer, [row, 2])
    );
  }

  return false;
};

const isEnPassantMove = (board, start, end, lastMove) => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  const piece = board[startRow][startCol].toLowerCase();

  if (piece !== "p") return false;

  const direction = board[startRow][startCol] === "P" ? -1 : 1;

  if (
    lastMove &&
    Math.abs(lastMove.start[0] - lastMove.end[0]) === 2 && // Last move was a two-square pawn move
    lastMove.end[0] === startRow && // The capturing pawn is on the same rank as the captured pawn
    Math.abs(lastMove.end[1] - startCol) === 1 && // The captured pawn is on an adjacent file
    endRow === startRow + direction && // The capturing pawn moves diagonally
    endCol === lastMove.end[1]
  ) {
    // The capturing pawn moves to the square the captured pawn skipped
    return true;
  }

  return false;
};

const isPawnPromotion = (board, end) => {
  const [endRow, endCol] = end;
  const piece = board[endRow][endCol].toLowerCase();

  return piece === "p" && (endRow === 0 || endRow === 7);
};

const isInCheck = (board, player, kingPosition = null) => {
  const isWhite = player === "white";
  let kingPos = kingPosition;

  if (!kingPos) {
    // Find the king's position
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === (isWhite ? "K" : "k")) {
          kingPos = [row, col];
          break;
        }
      }
      if (kingPos) break;
    }
  }

  // Check if any opponent's piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece !== " " && (piece.toLowerCase() === piece) === isWhite) {
        if (
          isValidMove(
            board,
            [row, col],
            kingPos,
            player === "white" ? "black" : "white"
          )
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

const isCheckmate = (board, player) => {
  if (!isInCheck(board, player)) return false;

  // Check all possible moves for the current player
  for (let startRow = 0; startRow < 8; startRow++) {
    for (let startCol = 0; startCol < 8; startCol++) {
      const piece = board[startRow][startCol];
      if (
        piece !== " " &&
        (piece.toLowerCase() === piece) !== (player === "white")
      ) {
        for (let endRow = 0; endRow < 8; endRow++) {
          for (let endCol = 0; endCol < 8; endCol++) {
            if (
              isValidMove(board, [startRow, startCol], [endRow, endCol], player)
            ) {
              // Make the move
              const newBoard = board.map((row) => [...row]);
              newBoard[endRow][endCol] = newBoard[startRow][startCol];
              newBoard[startRow][startCol] = " ";

              // If this move gets the king out of check, it's not checkmate
              if (!isInCheck(newBoard, player)) {
                return false;
              }
            }
          }
        }
      }
    }
  }

  return true;
};

const isStalemate = (board, player) => {
  if (isInCheck(board, player)) return false;

  // Check if the current player has any valid moves
  for (let startRow = 0; startRow < 8; startRow++) {
    for (let startCol = 0; startCol < 8; startCol++) {
      const piece = board[startRow][startCol];
      if (
        piece !== " " &&
        (piece.toLowerCase() === piece) !== (player === "white")
      ) {
        for (let endRow = 0; endRow < 8; endRow++) {
          for (let endCol = 0; endCol < 8; endCol++) {
            if (
              isValidMove(board, [startRow, startCol], [endRow, endCol], player)
            ) {
              // Make the move
              const newBoard = board.map((row) => [...row]);
              newBoard[endRow][endCol] = newBoard[startRow][startCol];
              newBoard[startRow][startCol] = " ";

              // If this move doesn't put the king in check, it's a valid move
              if (!isInCheck(newBoard, player)) {
                return false;
              }
            }
          }
        }
      }
    }
  }

  return true;
};

export {
  isValidMove,
  isCastlingMove,
  isEnPassantMove,
  isPawnPromotion,
  isInCheck,
  isCheckmate,
  isStalemate,
};
