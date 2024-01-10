import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  const className = "square" + (highlight ? " square-highlight" : "");
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const draw = checkDraw(squares);

  let status;
  status = winner
    ? "Winner: " + squares[winner[0]]
    : "Next player: " + (xIsNext ? "X" : "O");
  status = draw ? "Draw" : status;

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>
        {[0, 3, 6].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => {
              const index = row + col;
              const isWinningSquare = winner && winner.includes(index);

              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                  highlight={isWinningSquare}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [showAscending, setShowAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = showAscending
    ? history.map((squares, move) => {
        let description;
        if (move === currentMove) {
          description = "You are at move " + move;
          return <li key={move}>{description}</li>;
        } else if (move > 0) {
          description = "Go to move #" + move;
        } else {
          description = "Go to game start";
        }
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        );
      })
    : history
        .slice()
        .reverse()
        .map((squares, move) => {
          move = history.length - move - 1;
          let description;
          if (move === currentMove) {
            description = "You are at move " + (move + 1);
            return <li key={move}>{description}</li>;
          } else if (move > 0) {
            description = "Go to move #" + move;
          } else {
            description = "Go to game start";
          }
          return (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
          );
        });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setShowAscending(!showAscending)}>
          {showAscending
            ? "Show in Descending Order"
            : "Show in Ascending Order"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function checkDraw(squares) {
  return squares.every((square) => square !== null);
}
