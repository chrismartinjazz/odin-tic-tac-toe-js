# Planning for Tic Tac Toe

## Steps

- DONE Build console version of game
  - DONE Gameboard object with 'board' array, as an IIFE (module pattern)
  - DONE Player objects
  - DONE Object to control flow of game (Game?)
  - DONE Player can make moves
  - DONE Check for 3-in a row and for ties (win / draw condition)
- Build another Object to handle display/DOM logic.
  - DONE DisplayController (as an IIFE (module) - not done)
  - DONE Function to render contents of board array to webpage
  - DONE Functions allowing players to add marks to specific spot on board by clicking on a board square to place marker.
  - DONE Ensure can't play in spots already taken.
  - DONE Display scoreboard
  - DONE Visually indicate current player
- Add functionality:
  - DONE Display element to show results.
  - DONE At end of game (won or tied)
    - DONE Button to start next game
    - DONE Rotate player tokens
    - DONE Clear board
    - DONE Set current player to player with X token
  - DONE Button to restart game (reset scores)
  - DONE Players put in own names (use dialog and form)
  - DONEAdd a text element feedback when the game is won - "Player One wins"
- DONE Styling and images etc.
- Tidy up code and refactor a little bit.

## Looking at <https://www.ayweb.dev/blog/building-a-house-from-the-inside-out>

### Structure

#### function Gameboard() is reponsible for

- Holding the number of rows and columns and the board array
  - The board array holds Cells
  - getBoard() exposes the board.
- Adding tokens to the board with dropToken()
- Printing the board to the console with printBoard()

#### function Cell() is responsible for

- Remembering what is in that cell
- adding tokens with addToken() and returning value of cell with getValue()

#### function GameController(playerOneName, playerTwoName) is responsible for

- Holding everything together:
  - Holding the gameboard (calls Gameboard()) and therefore game state
  - Holding the players in an array
  - Remembering the activePlayer and returning it for UI - getActivePlayer()
- Controlling the flow of the game playRound()
  - Make a move
  - Updating the console (calls board.printBoard()) for each new round
  - Check for a winner
  - Proceed to next turn

### Flow

- GameController()
  - Gameboard()
    - Initialize board
    - Cell()
      - Initialize values for board
  - Set player names in array
  - Set activePlayer to Player One
  - Displays board with printNewRound()

Player then types game.playRound(column) into console.

- board.dropToken(...)
  - Check move is possible
  - Add token to the selected column
  - switchPlayerTurn() - change to next player
  - printNewRound - display message in console.

Player types their move in again, and repeats.

For the visual version, ScreenController is implemented wrapping around GameController.

This holds the GameController (flow of the game) and all the parts of the screen, along with functions to update screen. Sets everything up, then renders the screen and will handle everything from there.

### Overall structuring of the JS code

- GameBoard
- Cell
- GameController
- ScreenController
- Call the ScreenController to initialize everything

I have already implemented this in Ruby, but I will basically go from scratch here.

## Pseudocode

- Init a 3 X 3 game board
- Init 2 players
- Set player 1 as active player
- Game loop:
  - Display board
  - Until valid input from active player:
    - Get input from active player
    - Check input is valid
  - Place active player symbol in chosen square
  - Break if draw (all spaces filled)
  - Break if win:
    - Check rows X 3, columns X 3, diagonals X 2
  - Next active player
- Display board
- Display win message
