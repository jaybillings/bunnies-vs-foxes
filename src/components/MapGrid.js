import * as React from "react";
import { randomInt } from "../scripts/utilities";

export default class MapGrid extends React.Component {
  /**
   * Representation of the game map's grid.
   */
  constructor(props) {
    super(props);

    this.state = {map: [], rabbitCoords: [], foxCoords: [], burrowCoords: []};

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // Add listeners to keydown event
    window.addEventListener("keydown", this.handleKeyDown, false);

    this.createAndPopulateMap();
  }

  createAndPopulateMap() {
    let map = this.createNewMap();
    this.placeBarriers(map);
    this.placeBoosts(map);

    let foxCoords = this.placeAgent(map, '$');
    let burrowCoords = this.placeAgent(map, '@');
    let rabbitCoords = this.placeAgent(map, '#');

    this.setState({map, foxCoords, burrowCoords, rabbitCoords});
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

  moveRabbit(offset) {
    const map = this.state.map;
    const [oldX, oldY] = this.state.rabbitCoords;
    const [offsetX, offsetY] = offset;
    let newX = oldX + offsetX, newY = oldY + offsetY;

    if (map[newY] && [null, '*', '@'].includes(map[newY][newX])) {
      console.log('move!');
      map[oldY][oldX] = null;
      map[newY][newX] = '#';

      this.setState({map, rabbitCoords: [newX, newY]});
    } else {
      console.log('dont move');
    }
  }

  getRandomMapSquare() {
    return [randomInt(0, this.props.mapWidth - 1), randomInt(0, this.props.mapWidth - 1)];
  }

  handleKeyDown(e) {
    console.log(`pressed: ${e.key}`);

    switch (e.key) {
      case 'ArrowLeft':
        this.moveRabbit([-1, 0]);
        break;
      case 'ArrowRight':
        this.moveRabbit([1, 0]);
        break;
      case 'ArrowUp':
        this.moveRabbit([0, -1]);
        break;
      case 'ArrowDown':
        this.moveRabbit([0, 1]);
        break;
      default:
    }
  }

  render() {
    if (!this.state.map.length) return false;

    return <table className={'game-grid'}>
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
  }
}