import React, { Component } from "react";
import GameBoard from "../components/GameBoard.jsx";
import { BsArrowRight } from "react-icons/bs";

export default class GameLayout extends Component {
  constructor(props) {
    super(props);

    this.config = {
      ratios: {
        rock: 0.2,
        flower: 0.05
      },
      mapSize: {
        width: 7,
        height: 7
      },
      icons: {
        bunny: '#',
        fox: '$',
        rock: '^',
        flower: '*',
        burrow: '@',
        win: '(@)',
        loss: ':('
      }
    };

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
      <GameBoard ref={this.gameBoardRef} rockRatio={this.config.ratios.rock} flowerRatio={this.config.ratios.flower}
                 mapWidth={this.config.mapSize.width} mapHeight={this.config.mapSize.height}
                 icons={this.config.icons} setMessage={this.setMessage} />
      <div className={'legend'}>
        <p><strong>Legend:</strong></p>
        <ul>
          <li><strong>{this.config.icons.bunny}</strong><BsArrowRight />the bunny, that's you!</li>
          <li><strong>{this.config.icons.fox}</strong><BsArrowRight />the fox, will eat the bunny</li>
          <li><strong>{this.config.icons.burrow}</strong><BsArrowRight />the burrow, go here!</li>
          <li>{this.config.icons.rock}<BsArrowRight />hills, uncrossable</li>
          <li>{this.config.icons.flower}<BsArrowRight />dandelions, make you hop farther [currently not implemented]</li>
        </ul>
      </div>
    </div>
  }
}