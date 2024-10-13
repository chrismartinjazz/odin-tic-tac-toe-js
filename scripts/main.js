const cellCount = 9;

function GameBoard() {
  // Initialization
  let board = [];
  for (let i = 0; i < cellCount; i++) {
    board.push(Cell());
  }

  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7],
    [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  // Return board values as an array.
  const getBoardValues = () => {
    let boardValues = [];
    board.forEach((element) => boardValues.push(element.getValue()));
    return boardValues;
  };

  // Function to update board with a new move. True if successful, false if not.
  const updateBoard = (position, token) => {
    if (board[position].getValue() === 0) {
      board[position].setValue(token);
      return true;
    } else {
      return false;
    }
  }

  // Check board for a win or tie. Returns '1', '2', 'tie' or false.
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

  // Clear the board
  const clearBoard = () => {
    board = [];
    for (let i = 0; i < cellCount; i++) {
      board.push(Cell());
    }
  }

  return {
    getBoardValues,
    updateBoard,
    checkWinConditions,
    clearBoard,
  };
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

  const resetScores = () => {
    playerOneScore = 0;
    playerTwoScore = 0;
    tieScore = 0;
  }
  return { getScores, updateScore, resetScores }
}

function Player(newName, newNumber, newToken) {
  let name = newName;
  const number = newNumber;
  let token = newToken;

  const getPlayer = () => { return { name, number, token } };
  const setName = (newName) => name = newName;
  const setToken = (newToken) => token = newToken;

  return { getPlayer, setName, setToken }
}

function GameController() {
  const board = GameBoard();
  const score = ScoreBoard();
  const playerOne = new Player("Player One", 1, "X");
  const playerTwo = new Player("Player Two", 2, "O");
  let currentPlayer = playerOne;
  let gameOver = false;

  const getBoardValues = () => {
    return board.getBoardValues();
  }
  const getScores = () => {
    return score.getScores();
  }
  const getPlayers = () => {
    return [playerOne.getPlayer(), playerTwo.getPlayer()]
  }
  const getCurrentPlayer = () => currentPlayer.getPlayer()
  const getGameOver = () => gameOver;

  // Update the board. If successful (move is valid, game is not over),
  // rotate current player, check for win conditions, update score, return false.
  // If game is won or tied, return result (1, 2, or "tie")
  const makeMove = (position) => {
    if (gameOver) return false;
    if (board.updateBoard(position, currentPlayer.getPlayer().number)) {
      currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
      let result = board.checkWinConditions();
      if (result) {
        score.updateScore(board.checkWinConditions());
        gameOver = true;
        return result;
      }
      return false;
    } else { return false };
  }

  const newGame = () => {
    board.clearBoard();
    rotatePlayerTokens();
    playerOne.getPlayer().token === "X" ? currentPlayer = playerOne : currentPlayer = playerTwo;
    gameOver = false;
  }

  const rotatePlayerTokens = () => {
    if (playerOne.getPlayer().token === "X") {
      playerOne.setToken("O");
      playerTwo.setToken("X");
    } else {
      playerOne.setToken("X");
      playerTwo.setToken("O");
    }
  }

  const resetGame = () => {
    board.clearBoard();
    score.resetScores();
    playerOne.setToken("X");
    playerTwo.setToken("O");
    currentPlayer = playerOne;
    gameOver = false;
  }

  const updatePlayerNames = (newPlayerOneName, newPlayerTwoName) => {
    playerOne.setName(newPlayerOneName);
    playerTwo.setName(newPlayerTwoName);
  }

  return {
    getBoardValues,
    getScores,
    getPlayers,
    getCurrentPlayer,
    getGameOver,
    makeMove,
    newGame,
    resetGame,
    updatePlayerNames
  }
}

function DisplayController() {
  const game = GameController();

  const playerOneName = document.querySelector("#playerOneName");
  const playerTwoName = document.querySelector("#playerTwoName");
  const playerOneWins = document.querySelector("#playerOneWins");
  const playerTwoWins = document.querySelector("#playerTwoWins");
  const tiedGames = document.querySelector("#tiedGames");
  const scoreBoardOutput = document.querySelector("#scoreBoardOutput");
  const setPlayerNamesButton = document.querySelector("#setPlayerNamesButton");
  const resetScoresButton = document.querySelector("#resetScoresButton");
  const nextGameButton = document.querySelector("#nextGameButton");

  let displayGrid = []
  for (let i = 0; i < cellCount; i++) {
    displayGrid.push(document.querySelector(`#cell${i}`));
  }

  // When a cell is clicked, make a move for current player unless the game is over.
  for (let i = 0; i < cellCount; i++) {
    displayGrid[i].addEventListener("click", () => {
      if (game.getGameOver()) return;

      let result = game.makeMove(i);
      updateDisplay();
      if (result) {
        enableNextGameButton();
        displayWinner(result);
      };
    });
  };

  const displayWinner = (result) => {
    let winnerText;
    switch (result) {
      case "tie":
        winnerText = "Tied game";
        break;
      case 1:
        winnerText = `${game.getPlayers()[0].name} won the game`;
        break;
      case 2:
        winnerText = `${game.getPlayers()[1].name} won the game`;
        break;
      default:
        winnerText = "";
    }
    scoreBoardOutput.innerHTML = winnerText;
  }

  // When the Next Game button is clicked, start next game
  nextGameButton.addEventListener("click", () => {
    game.newGame();
    nextGameButton.disabled = true;
    updateDisplay();
    scoreBoardOutput.innerHTML = "";
  });

  // When the Reset Scores button is clicked, reset the scores
  resetScoresButton.addEventListener("click", () => {
    game.resetGame();
    nextGameButton.disabled = true;
    scoreBoardOutput.innerHTML = "";
    updateDisplay();
  })

  // When the Set Player Names button is clicked, show the form
  initializeDialog();

  const updateDisplay = () => {
    displayScoreBoard();
    displayBoard();
  }

  const displayScoreBoard = () => {
    let score = game.getScores();
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

  const displayBoard = () => {
    boardValues = game.getBoardValues();
    for (let i = 0; i < cellCount; i++) {
      displayGrid[i].innerHTML = convertValue(boardValues[i]);
    };
  };

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

  const enableNextGameButton = () => {
    nextGameButton.disabled = false;
    playerOneName.classList.remove("selected-player");
    playerTwoName.classList.remove("selected-player");
  }

  function initializeDialog() {
    const dialog = document.querySelector("dialog");
    const closeButton = document.querySelector(".close-dialog");
    const form = document.querySelector("form");

    setPlayerNamesButton.addEventListener("click", () => {
      dialog.showModal();
    });

    // Close the dialog using button.
    closeButton.addEventListener("click", () => {
      dialog.close();
    });

    // Update player names with submitted form data.
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (event.submitter.classList.contains("submit-dialog")) {
        const newPlayerOneName = document.getElementById("newPlayerOneName").value;
        const newPlayerTwoName = document.getElementById("newPlayerTwoName").value;

        game.updatePlayerNames(newPlayerOneName, newPlayerTwoName);
      }
      dialog.close();

      form.reset();

      updateDisplay();
    })
  }

  return {
    updateDisplay
  };
};

function main() {
  display = DisplayController();
  display.updateDisplay();
};

main();
