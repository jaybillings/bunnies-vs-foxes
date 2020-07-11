import React, { Component } from "react";
import GameBoard from "../components/GameBoard.jsx";
import { BsArrowRight } from "react-icons/bs";

export default class GameLayout extends Component {
  constructor(props) {
    super(props);

    this.gameBoardRef = React.createRef();
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown, false);
  }

  handleStartClick(e) {
    e.preventDefault();
    this.gameBoardRef.current.startNewGame();
  }

  handleKeyDown(e) {
    console.log(`pressed ${e.key}`);
    if (e.key === 'Enter') {
      this.gameBoardRef.current.startNewGame();
    }
  }

  render() {
    const config = {
      ratios: {
        rock: 0.2,
        flower: 0.05
      },
      mapSize: {
        width: 7,
        height: 7
      }
    };
    const emphasizeButton = this.gameBoardRef.current && this.gameBoardRef.current.state.gameState === 0 ? 'emphasis' : '';

    return <div className={'game-layout'}>
      <header>
        <h1>the bunny game</h1>
        <div className={'button_container'}>
          <button type={'button'} className={emphasizeButton} onClick={this.handleStartClick}>
            Start New Game
          </button>
        </div>
      </header>
      <GameBoard ref={this.gameBoardRef} rockRatio={config.ratios.rock} flowerRatio={config.ratios.flower}
                 mapWidth={config.mapSize.width} mapHeight={config.mapSize.height} setMessage={this.setMessage} />
      <div className={'legend'}>
        <p><strong>Legend:</strong></p>
        <ul>
          <li><strong>#</strong><BsArrowRight />the bunny, that's you!</li>
          <li><strong>$</strong><BsArrowRight />the fox, will eat the bunny</li>
          <li><strong>@</strong><BsArrowRight />the burrow, go here!</li>
          <li>^<BsArrowRight />hills, uncrossable</li>
          <li>*<BsArrowRight />dandelions, make you hop farther [currently not implemented]</li>
        </ul>
      </div>
    </div>
  }
}