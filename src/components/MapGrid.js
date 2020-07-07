import * as React from "react";
import { randomInt } from "../scripts/utilities";

export default class MapGrid extends React.Component {
  /**
   * Representation of the game map's grid.
   * @param {{height: number, width: number, agent: *}} props
   */
  constructor(props) {
    super(props);

    this.state = {mapData: [], agentCoords: [0, 0]};

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // Add listeners to keydown event
    console.log('hi');
    window.addEventListener("keydown", this.handleKeyDown, false);

    this.populateMap();
  }

  handleKeyDown(e) {
    console.log(`pressed: ${e.key}`);

    switch (e.key) {
      case 'ArrowLeft':
        if (this.state.agentCoords[0] > 0) this.moveAgent([-1, 0]);
        break;
      case 'ArrowRight':
        if (this.state.agentCoords[0] < this.props.width - 1) this.moveAgent([1, 0]);
        break;
      case 'ArrowUp':
        if (this.state.agentCoords[1] > 0) this.moveAgent([0, -1]);
        break;
      case 'ArrowDown':
        if (this.state.agentCoords[1] < this.props.height - 1) this.moveAgent([0, 1]);
        break;
      default:
    }
  }

  populateMap() {
    let initialMap = [];

    for (let y = 0; y < this.props.height; y++) {
      let innerMap = [];
      for (let x = 0; x < this.props.width; x++) {
        innerMap[x] = null;
      }
      initialMap[y] = innerMap;
    }

    // Place agent
    let initialX = randomInt(0, this.props.width - 1), initialY = randomInt(0, this.props.height - 1);
    initialMap[initialY][initialX] = '@';
    console.log('initial: ' + initialX + "," + initialY);

    this.setState({mapData: initialMap, agentCoords: [initialX, initialY]}, () => {
      console.log(this.state.mapData);
    });
  }

  moveAgent(offset) {
    const map = this.state.mapData;
    const [oldX, oldY] = this.state.agentCoords;
    const [offsetX, offsetY] = offset;
    let newX = oldX + offsetX, newY = oldY + offsetY;

    map[oldY][oldX] = null;
    map[newY][newX] = '@';

    this.setState({mapData: map, agentCoords: [newX, newY]});
  }

  render() {
    if (!this.state.mapData.length) return false;

    return <table className={'game-grid'}>
      <tbody>
      {
        this.state.mapData.map((col, i) => {
          return <tr key={`col_${i}`}>{col.map((item, j) => {
            return <td key={`item_${j}:${i}`}>{`${j}, ${i} ${item}`}</td>
          })}</tr>
        })
      }
      </tbody>
    </table>
  }
}