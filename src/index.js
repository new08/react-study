import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.handleClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      history: this.state.history.slice(0, this.state.stepNumber + 1),
      stepNumber: step,
      xIsNext: 0 === (step % 2)
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winner = calculateWinner(current.squares);
    let status = winner
      ? 'Winner: ' + winner
      : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move
        : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            handleClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);


// TODO
// 1. 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。
// 2. 在历史记录列表中加粗显示当前选择的项目。
// 3. 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
// 4. 添加一个可以升序或降序显示历史记录的按钮。
// 5. 每当有人获胜时，高亮显示连成一线的 3 颗棋子。
// 6. 当无人获胜时，显示一个平局的消息。
