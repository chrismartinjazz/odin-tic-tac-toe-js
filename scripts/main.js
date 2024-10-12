const cellCount = 9;

function GameBoard() {
  // Initialize board with getter
  const board = [];
  for (let i = 0; i < cellCount; i++) {
    board.push(Cell());
  }
  const getBoard = () => board;

  // Initialize win conditions
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7],
    [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  // Function to print board to console
  const printBoard = () => {
    console.log("-----");
    const boardWithCellValues = board.map((cell) => cell.getValue())
    for (let i = 0; i < 3; i++) {
      console.log(`|${boardWithCellValues[3 * i]}${boardWithCellValues[3 * i + 1]}${boardWithCellValues[3 * i + 2]}| Line ${i + 1}`);
    }
    console.log("-----");
  }

  // Function to update board - returns true if successful, false if move is not possible
  const updateBoard = (position, token) => {
    if (board[position].getValue() === 0) {
      board[position].setValue(token);
      return true;
    } else {
      return false;
    }
  }

  // Function to check for a win or tie. Returns '1', '2', 'tie' or false.
  const checkWinConditions = () => {
    // Check for a tie - if no positions are "0" then all are taken
    if (board.every((element) => element.getValue() !== 0)) { return 'tie' }

    // forEach will not allow return from inside its loop, so use simple loop.
    for (let i = 0; i < winConditions.length; i++) {
      const line = [
        board[winConditions[i][0]].getValue(),
        board[winConditions[i][1]].getValue(),
        board[winConditions[i][2]].getValue(),
      ]
      if (line.every((element) => element === 1)) { return 1 }
      if (line.every((element) => element === 2)) { return 2 }
    }
    return false;
  }

  // Function to reset the board
  const clearBoard = () => {
    board = [];
    for (let i = 0; i < cellCount; i++) {
      board.push(Cell());
    }
  }

  return { getBoard, printBoard, updateBoard, checkWinConditions, clearBoard, updateBoard, checkWinConditions, clearBoard };
}

function Cell() {
  let value = 0;
  const getValue = () => value;
  const setValue = (val) => value = val;
  return { getValue, setValue };
}

function ScoreBoard() {
  let playerOneScore = 0;
  let playerTwoScore = 0;
  let tie = 0;

  const getScores = () => { return { playerOneScore, playerTwoScore, tie } }

  const updateScore = (winner) => {
    switch (winner) {
      case "tie":
        tie++;
        break;
      case 1:
        playerOneScore++;
        break;
      case 2:
        playerTwoScore++;
        break;
      default:
        return;
    }
  }
  return { updateScore, getScores }
}

function Player(name, token) {
  const playerName = name;
  const playerToken = token;

  const getPlayer = () => { return { playerName, playerToken } };
  const setName = (newName) => name = newName;

  return { getPlayer, setName }
}

function GameController() {
  const playerOne = new Player("Player One", 1);
  const playerTwo = new Player("Player Two", 2);
  const board = GameBoard();
  const score = ScoreBoard();
  let currentPlayer = playerOne;
  let gameOver = false;

  const getCurrentPlayer = () => currentPlayer
  const makeMove = (position) => {
    // Update the board. If successful (move is valid, game is not over),
    // rotate current player, check for win conditions, update score.
    // Otherwise return false.
    if (gameOver) return false;
    if (board.updateBoard(position, currentPlayer.getPlayer().playerToken)) {
      currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
      if (board.checkWinConditions()) {
        score.updateScore(board.checkWinConditions());
        gameOver = true;
      }
    } else { return false };
  }
  // Returning for testing in console
  return { board, score, makeMove, getCurrentPlayer }
}

function DisplayController() {
  const game = GameController();

  let displayGrid = []
  for (let i = 0; i < cellCount; i++) {
    displayGrid.push(document.querySelector(`#cell${i}`));
  }

  for (let i = 0; i < cellCount; i++) {
    displayGrid[i].addEventListener("click", (event) => {
      game.makeMove(i);
      displayBoard();
    })
  }

  const displayBoard = () => {
    for (let i = 0; i < cellCount; i++) {
      displayGrid[i].innerHTML = convertValue(game.board.getBoard()[i].getValue());
    }
  }

  const convertValue = (val) => {
    switch (val) {
      case 1:
        return "X";
      case 2:
        return "O";
      default:
        return "";
    }
  }

  return {
    displayBoard, game
  };
}

display = DisplayController();
display.displayBoard();

// Example game in console.

// const game = GameController("Chris", "John");
// console.table(game.score.getScores());
// game.board.printBoard();

// game.makeMove(0);
// game.board.printBoard();
// console.log(`Winner: ${game.board.checkWinConditions()}`);
// console.log(`Current player: ${game.getCurrentPlayer()}`)

// game.makeMove(1);
// game.board.printBoard();
// console.log(`Winner: ${game.board.checkWinConditions()}`);
// console.log(`Current player: ${game.getCurrentPlayer()}`)

// game.makeMove(4);
// game.board.printBoard();
// console.log(`Winner: ${game.board.checkWinConditions()}`);
// console.log(`Current player: ${game.getCurrentPlayer()}`)

// game.makeMove(5);
// game.board.printBoard();
// console.log(`Winner: ${game.board.checkWinConditions()}`);
// console.log(`Current player: ${game.getCurrentPlayer()}`)

// game.makeMove(8);
// game.board.printBoard();
// console.log(`Winner: ${game.board.checkWinConditions()}`);
// console.log(`Current player: ${game.getCurrentPlayer()}`)

// console.table(game.score.getScores());

// game.makeMove(2);
// game.board.printBoard();
