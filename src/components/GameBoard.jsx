import * as React from "react";
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
      map: [],
      bunnyCoords: [], foxCoords: [],
      userCanMove: false, gameState: 1,
      moves: 0, wins: 0,
      message: null
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
    let map = this.createNewMap();
    this.placeBarriers(map);
    this.placeBoosts(map);

    this.placeAgent(map, 'burrow'); // TODO: Burrow should be reachable
    let foxCoords = this.placeAgent(map, 'fox');
    let bunnyCoords = this.placeAgent(map, 'bunny');

    this.setState({map, bunnyCoords, foxCoords, userCanMove: true});
  }

  moveBunny(offset) {
    const [oldX, oldY] = this.state.bunnyCoords;
    const [offsetX, offsetY] = offset;
    let newX = oldX + offsetX, newY = oldY + offsetY;

    if (this.state.map[newY] && typeof this.state.map[newY][newX] !== 'undefined') {
      switch (this.state.map[newY][newX]) {
        case 'flower':
          // Flower -- boost!
          this.setState(prevState => {
            let newMap = prevState.map;
            newMap[oldY][oldX] = null;
            newMap[newY][newX] = 'bunny';

            return {
              userCanMove: false,
              map: newMap,
              message: 'Bunny ate a flower -- yum!',
              bunnyCoords: [newX, newY]
            }
          }, () => {
            this.moveFox();
          });
          break;
        case 'rock':
          this.setState({message: "Silly bunny! You can't go through rocks!"});
          break;
        case 'fox':
          // Fox -- die :(
          this.setState(prevState => {
            let newMap = prevState.map;
            newMap[oldY][oldX] = null;
            newMap[newY][newX] = 'loss';

            return {
              map: newMap,
              moves: prevState.moves++,
              gameState: 0,
              message: "Game over -- bunny got eaten by fox. :("
            }
          });
          break;
        case 'burrow':
          // Burrow -- win! :)
          this.setState(prevState => {
            let newMap = prevState.map;
            newMap[oldY][oldX] = null;
            newMap[newY][newX] = 'win';

            return {
              map: newMap,
              wins: prevState.wins++,
              moves: prevState.moves++,
              gameState: 0,
              message: "You won -- bunny made it home! :)"
            };
          });
          break;
        default:
          // Just move
          this.setState(prevState => {
            let newMap = prevState.map;
            newMap[oldY][oldX] = null;
            newMap[newY][newX] = 'bunny';

            return {
              userCanMove: false,
              map: newMap,
              moves: prevState.moves++,
              bunnyCoords: [newX, newY],
              message: null
            };
          }, () => {
            this.moveFox();
          });
      }
    } else {
      this.setState({message: "Don't fall off the edge of the world!"});
    }
  }

  moveFox() {
    // TODO: Retain previous cell contents
    let [oldX, oldY] = this.state.foxCoords;
    let possibleMoves = [[oldX - 1, oldY], [oldX + 1, oldY], [oldX, oldY - 1], [oldX, oldY + 1]];
    let foxCanMove = false;
    let newX, newY;

    // Randomly choose a move to make
    while (!foxCanMove && possibleMoves.length > 0) {
      let randMove = randomInt(0, possibleMoves.length - 1);
      [newX, newY] = possibleMoves[randMove];

      if (this.state.map[newY] && typeof this.state.map[newY][newX] !== 'undefined' && this.state.map[newY][newX] !== 'rock') {
        foxCanMove = true;
      }
    }

    // Handle fox move
    if (foxCanMove) {
      let newCellContents = this.state.map[newY][newX];
      if (newCellContents === 'bunny') {
        this.setState(prevState => {
          let newMap = prevState.map;
          newMap[oldY][oldX] = null;
          newMap[newY][newX] = 'loss';

          return {
            map: newMap,
            moves: prevState.moves++,
            gameState: 0,
            message: "Game over -- bunny got eaten by fox! :(",
            userCanMove: true
          }
        });
      } else {
        this.setState(prevState => {
          let newMap = prevState.map;
          newMap[oldY][oldX] = null;
          newMap[newY][newX] = 'fox';

          return {
            map: newMap,
            foxCoords: [newX, newY],
            userCanMove: true
          }
        });
      }
    } else {
      this.setState({message: 'Fox is trapped! Go you!'});
    }
  }

  createNewMap() {
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

    if (!this.state.userCanMove) {
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
      <GameGrid map={this.state.map} />
    </div>
  }
}