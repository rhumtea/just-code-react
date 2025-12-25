import { useState } from "react";
import { View, Pressable } from "react-native";

const Square ({value, onSquareClick}) => {
    return (
        
    )
}

export default function Board() {
  const [board, setBoard] = useState(
    Array(20)
      .fill(null)
      .map(() => Array(20).fill(null))
  );
  const [player, setPlayer] = useState("X");

  const handlePress = (row: number, col: number) => {
    if (board[row][col]) {
      return;
    }
    const newBoard = [...board];
    newBoard[row][col] = player;
    setBoard(newBoard);
    const winner = calculateWinner(row, col);
    if (player === "X") {
      setPlayer("O");
    } else {
      setPlayer("X");
    }
    if (winner) {
      alert(`Player ${winner} wins!`);
    }
  };

  const calculateWinner = (row: number, col: number) => {
    const currentPlayer = board[row][col];
    const dir = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [a, b] of dir) {
      let count = 1;
      let startBlocked = false;
      let endBlocked = false;

      // check pos dir
      let r = row + a;
      let c = col + b;
      while (
        r >= 0 &&
        r < board.length &&
        c >= 0 &&
        c < board[0].length &&
        board[r][c] === currentPlayer
      ) {
        count++;
        r += a;
        c += b;
      }

      // check end blocked
      if (
        r >= 0 &&
        r < board.length &&
        c >= 0 &&
        c < board[0].length &&
        board[r][c] !== null &&
        board[r][c] !== currentPlayer
      ) {
        endBlocked = true;
      }

      // check neg dir
      r = row - a;
      c = col - b;
      while (
        r >= 0 &&
        r < board.length &&
        c >= 0 &&
        c < board[0].length &&
        board[r][c] === currentPlayer
      ) {
        count++;
        r -= a;
        c -= b;
      }

      // check start blocked
      if (
        r >= 0 &&
        r < board.length &&
        c >= 0 &&
        c < board[0].length &&
        board[r][c] !== null &&
        board[r][c] !== currentPlayer
      ) {
        startBlocked = true;
      }

      // Win
      if (count === 5 && !startBlocked && !endBlocked) {
        return currentPlayer;
      }
    }
    return null;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {board.map((row, rowIndex) => {
        return (
          <View key={rowIndex} style={{ flexDirection: "row" }}>
            {row.map((col, colIndex) => {
              return (
                <Pressable
                  key={colIndex}
                  style={{
                    borderColor: "black",
                    borderWidth: 1,
                    height: 20,
                    width: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => handlePress(rowIndex, colIndex)}
                >
                  {col}
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
