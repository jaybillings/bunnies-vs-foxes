import * as React from "react";
import { randomInt } from "../scripts/utilities";

export default class GameBoard extends React.Component {
  /**
   * Representation of the game map's grid.
   */
  constructor(props, ref) {
    super(props, ref);

    // gameState: 1 - in progress, 0 - current game ended
    this.state = {
      map: [], bunnyCoords: [], gameState: 1, moves: 0, wins: 0, message: null
    };

    this.icons = {
      bunny: '#',
      fox: '$',
      rock: '^',
      flower: '*',
      burrow: '@',
      win: '(@)',
      loss: ':('
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    //this.startNewGame = this.startNewGame.bind(this);
  }

  componentDidMount() {
    this.startNewGame();
    window.addEventListener("keydown", this.handleKeyDown, false);
  }

  startNewGame() {
    this.setState({gameState: 1, moves: 0, message: null});
    this.initMap();
  }

  initMap() {
    let map = this.createNewMap();
    this.placeRocks(map);
    //this.placeFlowers(map);

    this.placeAgent(map, 'fox');
    this.placeAgent(map, 'burrow'); // TODO: Burrow should be reachable
    let bunnyCoords = this.placeAgent(map, 'bunny');

    this.setState({map, bunnyCoords});
  }

  moveBunny(offset) {
    const [oldX, oldY] = this.state.bunnyCoords;
    const [offsetX, offsetY] = offset;
    let newX = oldX + offsetX, newY = oldY + offsetY;

    if (this.state.map[newY] && typeof this.state.map[newY][newX] !== 'undefined') {
      switch (this.state.map[newY][newX]) {
        /*case '*':
         // Flower -- boost!
         this.setState(prevState => {
         let newMap = prevState.map;
         newMap[oldY][oldX] = null;
         newMap[newY][newX] = '#';

         return {
         map: newMap,
         bunnySpeed: 2,
         message: 'Bunny ate a flower -- next move will be two spaces.',
         bunnyCoords: [newX, newY]
         }
         });
         break;*/
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
              message: "Game over -- bunny got eaten by a fox. :("
            };
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

            return {map: newMap, moves: prevState.moves++, bunnyCoords: [newX, newY], message: null}
          });
      }
    } else {
      this.setState({message: "Don't fall off the edge of the world!"});
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

  placeRocks(map) {
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

  placeFlowers(map) {
    let numFlowers = Math.floor((this.props.mapWidth * this.props.mapHeight) * this.props.flowerRatio);
    if (numFlowers < 1) numFlowers = 1;
    console.info(numFlowers);

    while (numFlowers > 0) {
      const [randX, randY] = this.getRandomMapSquare();

      if (map[randY][randX] === null) {
        map[randY][randX] = '*';
        numFlowers--;
      }
    }
  }

  placeAgent(map, agentChar) {
    let randX, randY;

    do {
      [randX, randY] = this.getRandomMapSquare();
    } while (map[randY][randX]);
    map[randY][randX] = agentChar;

    return [randX, randY]
  }

  findSolutionPath() {
    // TODO: Find at least one path to solution -- otherwise alter map
  }

  handleKeyDown(e) {
    e.preventDefault();

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

      <table className={'game-grid'}>
        <tbody>
        {
          this.state.map.map((col, i) => {
            return <tr key={`col_${i}`}>{col.map((item, j) => {
              return <td key={`item_${j}:${i}`}>
                <small>{`${j}, ${i}`}</small>
                <span className={'grid-item'}>{item && `${this.icons[item]}`}</span>
              </td>
            })}</tr>
          })
        }
        </tbody>
      </table>
    </div>
  }
}