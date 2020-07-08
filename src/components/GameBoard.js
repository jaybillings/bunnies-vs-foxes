import * as React from "react";
import { randomInt } from "../scripts/utilities";

export default class GameBoard extends React.Component {
  /**
   * Representation of the game map's grid.
   */
  constructor(props) {
    super(props);

    // gameState: 1 - in progress, 0 - current game ended
    this.state = {
      map: [], bunnyCoords: [], gameState: 1, moves: 0, wins: 0, message: ''
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown, false);
    this.startNewGame();
  }

  startNewGame() {
    this.setState({gameState: 1, moves: 0, message: ''});
    this.initMap();
  }

  initMap() {
    let map = this.createNewMap();
    this.placeBarriers(map);
    //this.placeBoosts(map);

    this.placeAgent(map, '$');
    this.placeAgent(map, '@');
    let bunnyCoords = this.placeAgent(map, '#');

    this.setState({map, bunnyCoords});
  }

  moveBunny(offset) {
    const [oldX, oldY] = this.state.bunnyCoords;
    const [offsetX, offsetY] = offset;
    let newX = oldX + offsetX, newY = oldY + offsetY;

    console.info(`newx: ${newX}, newy: ${newY}, oldX: ${oldX}, oldY: ${oldY}`);
    console.info('offset', offset);

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
        case '^':
          this.setState({message: "Silly bunny! You can't go through rocks!"});
          break;
        case '$':
          // Fox -- die :(
          this.setState(prevState => {
            let newMap = prevState.map;
            newMap[oldY][oldX] = null;
            newMap[newY][newX] = ':(';

            return {map: newMap, moves: prevState.moves++, gameState: 0, message: 'Game over -- bunny got eaten by a fox. :('};
          });
          break;
        case '@':
          // Burrow -- win! :)
          this.setState(prevState => {
            let newMap = prevState.map;
            newMap[oldY][oldX] = null;
            newMap[newY][newX] = '(#)';

            return {map: newMap,
              wins: prevState.wins++,
              moves: prevState.moves++,
              gameState: 0,
              message: 'You won -- bunny made it home! :D'};
          });
          break;
        default:
          console.info('at default');
          // Just move
          this.setState(prevState => {
            let newMap = prevState.map;
            newMap[oldY][oldX] = null;
            newMap[newY][newX] = '#';

            return {map: newMap, moves: prevState.moves++, bunnyCoords: [newX, newY], message: ''}
          });
      }
    } else {
      console.log('dont move');
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
    console.info('numRocks ', numRocks);

    while (numRocks > 0) {
      const [randX, randY] = this.getRandomMapSquare();

      if (map[randY][randX] === null) {
        map[randY][randX] = '^';
        numRocks--;
      }
    }
  }

  placeBoosts(map) {
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
    console.info(`initial location of ${agentChar}: [${randX},${randY}]`);

    return [randX, randY]
  }

  getRandomMapSquare() {
    return [randomInt(0, this.props.mapWidth - 1), randomInt(0, this.props.mapWidth - 1)];
  }

  handleKeyDown(e) {
    console.log(`pressed: ${e.key}`);

    switch (e.key) {
      case 'ArrowLeft':
        if (this.state.gameState) this.moveBunny([-1, 0]);
        break;
      case 'ArrowRight':
        if (this.state.gameState) this.moveBunny([1, 0]);
        break;
      case 'ArrowUp':
        if (this.state.gameState) this.moveBunny([0, -1]);
        break;
      case 'ArrowDown':
        if (this.state.gameState) this.moveBunny([0, 1]);
        break;
      case 'Enter':
        this.startNewGame();
        break;
      default:
        // nothing
    }
  }

  render() {
    return <div className={'game-board'}>
      <button type={'button'} onClick={this.startNewGame}>Start New Game</button>
      <div className={'info-container'}>
        <p>Moves: {this.state.moves}</p>
        <p>Wins this session: {this.state.wins}</p>
        <p>{this.state.message}</p>
      </div>

      <table className={'game-grid'}>
        <tbody>
        {
          this.state.map.map((col, i) => {
            return <tr key={`col_${i}`}>{col.map((item, j) => {
              return <td key={`item_${j}:${i}`}><span
                className={'dev_note'}>{`${j}, ${i}`}</span>{item && `${item}`}</td>
            })}</tr>
          })
        }
        </tbody>
      </table>
    </div>
  }
}