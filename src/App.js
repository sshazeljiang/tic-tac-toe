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
    onPlay(nextSquares, i);
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
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), index: Array(2).fill(null) },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [showAscending, setShowAscending] = useState(true);

  function handlePlay(nextSquares, index) {
    const nextIndex = [Math.floor(index / 3), index % 3];
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      {
        squares: nextSquares,
        index: nextIndex,
      },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = showAscending
    ? history.map((step, move) => {
        let description;
        if (move === currentMove) {
          description = "You are at move " + move;
          return <li key={move}>{description}</li>;
        } else if (move > 0) {
          description =
            "Go to move #" +
            move +
            " at (" +
            step.index[0] +
            ", " +
            step.index[1] +
            ")";
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
        .map((step, move) => {
          move = history.length - move - 1;
          let description;
          if (move === currentMove) {
            description = "You are at move " + move;
            return <li key={move}>{description}</li>;
          } else if (move > 0) {
            description =
              "Go to move #" +
              move +
              " at (" +
              step.index[0] +
              ", " +
              step.index[1] +
              ")";
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
        <button
          className="function-button"
          onClick={() => {
            setHistory([
              { squares: Array(9).fill(null), index: Array(2).fill(null) },
            ]);
            setCurrentMove(0);
          }}
        >
          {"Restart Game"}
        </button>
        <button
          className="function-button"
          onClick={() => setShowAscending(!showAscending)}
        >
          {showAscending
            ? "Show History in Descending Order"
            : "Show History in Ascending Order"}
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
