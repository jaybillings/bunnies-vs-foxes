import React, { Component } from "react";
import GameBoard from "../components/GameBoard";
import { BsArrowRight } from "react-icons/bs";

export default class GameLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {message: null};
    this.setMessage = this.setMessage.bind(this);
  }

  setMessage(message) {
    this.setState({message});
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

    return <div className={'game-layout'}>
      <header>
        <h1>the bunny game</h1>
        <div className={'button_container'}>
          <button type={'button'} className={!this.state.gameState && 'emphasis'} onClick={this.startNewGame}>
            Start New Game
          </button>
        </div>
      </header>
      <GameBoard rockRatio={config.ratios.rock} flowerRatio={config.ratios.flower}
                 mapWidth={config.mapSize.width} mapHeight={config.mapSize.height} setMessage={this.setMessage} />
      <div className={'legend'}>
        <p><strong>Legend:</strong></p>
        <ul>
          <li><strong>#</strong><BsArrowRight />the bunny, that's you!</li>
          <li><strong>$</strong><BsArrowRight />the fox, will eat the bunny</li>
          <li><strong>@</strong><BsArrowRight />the burrow, go here!</li>
          <li>^<BsArrowRight />hills, uncrossable</li>
          <li>*<BsArrowRight />dandelions, make you hop farther</li>
        </ul>
      </div>
    </div>
  }
}