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
  let tieScore = 0;

  const getScores = () => { return { playerOneScore, playerTwoScore, tieScore } }

  const updateScore = (winner) => {
    switch (winner) {
      case "tie":
        tieScore++;
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

function Player(newName, newNumber, newToken) {
  const name = newName;
  const number = newNumber;
  const token = newToken;

  const getPlayer = () => { return { name, number, token } };
  const setName = (newName) => name = newName;
  const setToken = (newToken) => token = newToken;

  return { getPlayer, setName, setToken }
}

function GameController() {
  const playerOne = new Player("Player One", 1, "X");
  const playerTwo = new Player("Player Two", 2, "O");
  const board = GameBoard();
  const score = ScoreBoard();
  let currentPlayer = playerOne;
  let gameOver = false;

  const getCurrentPlayer = () => currentPlayer.getPlayer()
  const makeMove = (position) => {
    // Update the board. If successful (move is valid, game is not over),
    // rotate current player, check for win conditions, update score.
    // Otherwise return false.
    if (gameOver) return false;
    if (board.updateBoard(position, currentPlayer.getPlayer().number)) {
      currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
      if (board.checkWinConditions()) {
        score.updateScore(board.checkWinConditions());
        gameOver = true;
      }
    } else { return false };
  }

  const getPlayers = () => {
    return [playerOne.getPlayer(), playerTwo.getPlayer()]
  }

  return { board, score, makeMove, getCurrentPlayer, getPlayers }
}

function DisplayController() {
  const game = GameController();

  const playerOneName = document.querySelector("#playerOneName");
  const playerTwoName = document.querySelector("#playerTwoName");
  const playerOneWins = document.querySelector("#playerOneWins");
  const playerTwoWins = document.querySelector("#playerTwoWins");
  const tiedGames = document.querySelector("#tiedGames");
  const setPlayerNamesButton = document.querySelector("#setPlayerNamesButton");
  const resetScoresButton = document.querySelector("#resetScoresButton");
  let displayGrid = []
  for (let i = 0; i < cellCount; i++) {
    displayGrid.push(document.querySelector(`#cell${i}`));
  }

  // When a cell is clicked, make a move for current player
  for (let i = 0; i < cellCount; i++) {
    displayGrid[i].addEventListener("click", (event) => {
      game.makeMove(i);
      displayScoreBoard();
      displayBoard();
    })
  }

  const displayBoard = () => {
    for (let i = 0; i < cellCount; i++) {
      displayGrid[i].innerHTML = convertValue(game.board.getBoard()[i].getValue());
    }
  }

  const convertValue = (val) => {
    let players = game.getPlayers();
    switch (val) {
      case 1:
        return players.find((player) => player.number === 1).token;
      case 2:
        return players.find((player) => player.number === 2).token;
      default:
        return "";
    }
  }

  const displayScoreBoard = () => {
    let score = game.score.getScores()
    let players = game.getPlayers();
    let currentPlayer = game.getCurrentPlayer();
    let playerOne = players.find((player) => player.number === 1);
    let playerTwo = players.find((player) => player.number === 2);

    playerOneName.innerHTML = `${playerOne.name}: ${playerOne.token}`
    playerTwoName.innerHTML = `${playerTwo.name}: ${playerTwo.token}`
    playerOneWins.innerHTML = `${score.playerOneScore}`
    playerTwoWins.innerHTML = `${score.playerTwoScore}`
    tiedGames.innerHTML = `${score.tieScore}`

    if (currentPlayer.number === 1) {
      playerOneName.classList.add("selected-player");
      playerTwoName.classList.remove("selected-player");
    } else {
      playerOneName.classList.remove("selected-player");
      playerTwoName.classList.add("selected-player");
    }
  }

  return {
    displayBoard, displayScoreBoard, game
  };
}

display = DisplayController();
display.displayScoreBoard();
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
