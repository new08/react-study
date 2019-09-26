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
  renderRows(i) {
    const squares = Array(3).fill(null)
      .map((item, index) => this.renderSquare(index + 3 * i));
    return (
      <div className="board-row" key={i}>
        {squares}
      </div>
    );
  }

  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.handleClick(i)}
      />
    );
  }

  render() {
    const rows =  Array(3).fill(null)
      .map((item, index) => this.renderRows(index));
    return (
      <div>
        {rows}
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
        placement: null
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
        squares: squares,
        placement: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
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
      const players = ['X', 'O'];
      const player = (0 === move)
        ? ''
        : players[(move + 1) % 2]
      const placement = calculateCoordinate(step.placement);
      const desc = move
        ? 'Go back'
        : 'Reset';
      return (
        <tr key={move}>
          <td>{this.state.stepNumber === move ? '☞' : move}</td>
          <td>{player}</td>
          <td>{placement}</td>
          <td>
            <button onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </td>
        </tr>
      );
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            handleClick={(i) => this.handleClick(i)}
          />
        </div>
        <br/>
        <div className="game-info">
          <div>{status}</div>
          <table>
            <thead>
              <tr><td>#</td><td>Player</td><td>Placement</td><td>Action</td></tr>
            </thead>
            <tbody>
              {moves}
            </tbody>
          </table>
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

function calculateCoordinate(i) {
  const coordinates = [
    '(1,3)',
    '(2,3)',
    '(3,3)',
    '(1,2)',
    '(2,2)',
    '(3,2)',
    '(1,1)',
    '(2,1)',
    '(3,1)'
  ];
  return coordinates[i];
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
