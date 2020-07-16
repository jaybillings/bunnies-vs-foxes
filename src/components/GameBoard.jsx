import * as React from "react";
import DeepCopy from "deepcopy";
import { randomInt } from "../scripts/utilities";
import GameGrid from "./GameGrid";

export default class GameBoard extends React.Component {
  /**
   * Representation of the game map's grid.
   */
  constructor(props, ref) {
    super(props, ref);

    // gameState: 1 - in progress, 0 - current game ended
    this.state = {
      boardMap: [], bunnyCoords: [], foxCoords: [], userCanMove: false, gameState: 1, moves: 0, wins: 0, message: null
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.startNewGame();
    window.addEventListener("keydown", this.handleKeyDown, false);
  }

  startNewGame() {
    this.setState({userCanMove: false, gameState: 1, moves: 0, message: null});
    this.initMap();
  }

  initMap() {
    let map = this.createBlankMap();
    this.placeBarriers(map);
    this.placeBoosts(map);

    this.placeAgent(map, 'burrow'); // TODO: Burrow should be reachable
    let foxCoords = this.placeAgent(map, 'fox');
    let bunnyCoords = this.placeAgent(map, 'bunny');

    this.setState({boardMap: map, bunnyCoords, foxCoords, userCanMove: true});
  }

  moveBunny(offset) {
    const [oldX, oldY] = this.state.bunnyCoords;
    const [offsetX, offsetY] = offset;
    let newX = oldX + offsetX, newY = oldY + offsetY;

    if (typeof this.state.boardMap[newY] === 'undefined' || typeof this.state.boardMap[newY][newX] === 'undefined') {
      this.setState({message: "Don't go off the edge of the world!"});
      return;
    }

    // DEEP COPY FOR GREAT JUSTICE
    // (and to direct alteration of state b/c of copying inner array by ref)
    const newMap = DeepCopy(this.state.boardMap);
    let doFoxTurn = false, newState;

    switch (newMap[newY][newX]) {
      case 'rock':
        // Rock -- can't move
        newState = {message: "Silly bunny! You can't go through rocks!"};
        break;
      case 'flower':
        // Flower -- boost
        newMap[oldY][oldX] = null;
        newMap[newY][newX] = 'bunny';
        newState = {
          boardMap: newMap,
          message: "Bunny ate flower -- yum!",
          bunnyCoords: [newX, newY]
        };
        doFoxTurn = true;
        break;
      case 'fox':
        // Fox -- loss :(
        newMap[oldY][oldX] = null;
        newMap[newY][newX] = 'loss';
        newState = {
          boardMap: newMap,
          moves: this.state.moves + 1,
          gameState: 0,
          message: "Game over -- bunny got eaten by fox! :("
        };
        break;
      case 'burrow':
        // Burrow -- win :)
        newMap[oldY][oldX] = null;
        newMap[newY][newX] = 'win';
        newState = {
          boardMap: newMap,
          wins: this.state.wins + 1,
          moves: this.state.moves + 1,
          gameState: 0,
          message: "You won -- bunny made it home! :)"
        };
        break;
      default:
        // Just move
        newMap[oldY][oldX] = null;
        newMap[newY][newX] = 'bunny';
        newState = {
          boardMap: newMap,
          moves: this.state.moves + 1,
          bunnyCoords: [newX, newY],
          message: null
        };
        doFoxTurn = true;
    }

    this.setState(Object.assign({userCanMove: !doFoxTurn}, newState), () => {
      doFoxTurn && this.doFoxTurn();
    });
  }

  /**
   * Rules:
   * burrow <-- cannot land on
   * flower <-- can land on, does not destroy
   * rock <-- cannot land on
   * bunny <-- can land on, kills
   *
   * TODO: Better fox following (add 'eyesight')
   */
  doFoxTurn() {
    let [oldX, oldY] = this.state.foxCoords;
    let possibleMoves = [[oldX - 1, oldY], [oldX + 1, oldY], [oldX, oldY - 1], [oldX, oldY + 1]];

    // Hunt down that bun!
    let bunnyIndex = possibleMoves.indexOf(this.state.bunnyCoords);
    if (bunnyIndex !== -1) this.moveFox(this.state.bunnyCoords);

    const isValidFoxMove = (coords) => {
      let [x, y] = coords;
      return !(typeof this.state.boardMap[y] === 'undefined' || typeof this.state.boardMap[y][x] === 'undefined'
        || ['rock', 'burrow'].includes(this.state.boardMap[y][x]));
    };
    let allowedMoves = possibleMoves.filter(isValidFoxMove);

    // No moves
    if (!allowedMoves.length) {
      console.log('fox trapped!');
      this.moveFox(false);
      return;
    }

    let randMove = randomInt(0, allowedMoves.length - 1);
    console.log('foxMove', allowedMoves[randMove]);
    this.moveFox(allowedMoves[randMove]);
  }

  moveFox(coords) {
    if (!coords) this.setState({message: "Fox can't move!", userCanMove: true});

    let [newX, newY] = coords, [oldX, oldY] = this.state.foxCoords, newMap = [...this.state.boardMap], newState;

    console.log('newMap', newMap);
    console.log(newMap[oldY][oldX]);
    // This test makes sure the cell is an object, specifically an array, and will have something left when popped
    if (typeof newMap[oldY][oldX] === 'object') newMap[oldY][oldX].pop();
    else newMap[oldY][oldX] = null;

    switch (newMap[newY][newX]) {
      case 'bunny':
        newMap[newY][newX] = 'loss';
        newState = {
          boardMap: newMap,
          gameState: 0,
          message: "Game over -- bunny got eaten by fox! :("
        };
        break;
      case 'flower':
        newMap[newY][newX] = ['flower', 'fox'];
        newState = {
          boardMap: newMap,
          foxCoords: [newX, newY],
          userCanMove: true
        };
        break;
      default:
        newMap[newY][newX] = 'fox';
        newState = {
          boardMap: newMap,
          foxCoords: [newX, newY],
          userCanMove: true
        };
    }

    this.setState(newState);
  }

  moveFoxOld() {
    // TODO: Retain previous cell contents
    let [oldX, oldY] = this.state.foxCoords;
    let possibleMoves = [[oldX - 1, oldY], [oldX + 1, oldY], [oldX, oldY - 1], [oldX, oldY + 1]];
    let foxCanMove = false;
    let newX, newY;

    // Randomly choose a move to make
    while (!foxCanMove && possibleMoves.length > 0) {
      let randMove = randomInt(0, possibleMoves.length - 1);
      [newX, newY] = possibleMoves[randMove];

      if (this.state.boardMap[newY] && typeof this.state.boardMap[newY][newX] !== 'undefined' && this.state.boardMap[newY][newX] !== 'rock') {
        foxCanMove = true;
      }
    }

    // Handle fox move
    if (foxCanMove) {
      let newCellContents = this.state.boardMap[newY][newX];
      if (newCellContents === 'bunny') {
        this.setState(prevState => {
          let newMap = prevState.boardMap;
          newMap[oldY][oldX] = null;
          newMap[newY][newX] = 'loss';

          return {
            boardMap: newMap,
            moves: prevState.moves++,
            gameState: 0,
            message: "Game over -- bunny got eaten by fox! :(",
            userCanMove: true
          }
        });
      } else {
        this.setState(prevState => {
          let newMap = prevState.boardMap;
          newMap[oldY][oldX] = null;
          newMap[newY][newX] = 'fox';

          return {
            boardMap: newMap,
            foxCoords: [newX, newY],
            userCanMove: true
          }
        });
      }
    } else {
      this.setState({message: 'Fox is trapped! Go you!'});
    }
  }

  createBlankMap() {
    let initialMap = [];

    for (let y = 0; y < this.props.mapHeight; y++) {
      let innerMap = [];
      for (let x = 0; x < this.props.mapWidth; x++) {
        innerMap[x] = null;
      }
      initialMap[y] = innerMap;
    }

    return initialMap;
  }

  placeBarriers(map) {
    let numRocks = Math.floor((this.props.mapWidth * this.props.mapHeight) * this.props.rockRatio);
    if (numRocks < 2) numRocks = 2;

    while (numRocks > 0) {
      const [randX, randY] = this.getRandomMapSquare();

      if (map[randY][randX] === null) {
        map[randY][randX] = 'rock';
        numRocks--;
      }
    }
  }

  placeBoosts(map) {
    let numFlowers = Math.floor((this.props.mapWidth * this.props.mapHeight) * this.props.flowerRatio);
    if (numFlowers < 1) numFlowers = 1;

    while (numFlowers > 0) {
      const [randX, randY] = this.getRandomMapSquare();

      if (map[randY][randX] === null) {
        map[randY][randX] = 'flower';
        numFlowers--;
      }
    }
  }

  placeAgent(map, agentID) {
    let randX, randY;

    do {
      [randX, randY] = this.getRandomMapSquare();
    } while (map[randY][randX]);
    map[randY][randX] = agentID;

    return [randX, randY]
  }

  findSolutionPath() {
    // TODO: Find at least one path to solution -- otherwise alter map
  }

  handleKeyDown(e) {
    e.preventDefault();

    if (!this.state.userCanMove || !this.state.gameState) {
      console.info('User cannot move -- prop is negative');
      return;
    }

    switch (e.key) {
      case 'a':
      case 'ArrowLeft':
        if (this.state.gameState) this.moveBunny([-1, 0]);
        break;
      case 'd':
      case 'ArrowRight':
        if (this.state.gameState) this.moveBunny([1, 0]);
        break;
      case 'w':
      case 'ArrowUp':
        if (this.state.gameState) this.moveBunny([0, -1]);
        break;
      case 's':
      case 'ArrowDown':
        if (this.state.gameState) this.moveBunny([0, 1]);
        break;
      default:
      // nothing
    }
  }

  getRandomMapSquare() {
    return [randomInt(0, this.props.mapWidth - 1), randomInt(0, this.props.mapWidth - 1)];
  }

  render() {
    return <div className={'game-board'}>
      <header>
        <h2 className={'message'}><p>{this.state.message || 'Get the bunny to her burrow!'}</p></h2>
        <div className={'info-container'}>
          <p>Moves: {this.state.moves}</p>
          <p>Wins this session: {this.state.wins}</p>
        </div>
      </header>
      <GameGrid boardMap={this.state.boardMap} icons={this.props.icons} />
    </div>
  }
}