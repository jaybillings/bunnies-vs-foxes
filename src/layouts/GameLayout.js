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
        <h2 className={'message'}><p>{this.state.message || 'Get the bunny to her burrow!'}</p></h2>
      </header>
      <div>
        <p><strong>Legend:</strong></p>
        <ul>
          <li>#<BsArrowRight />the bunny, that's you!</li>
          <li>$<BsArrowRight />the fox, will eat the bunny</li>
          <li>@<BsArrowRight />the burrow, go here!</li>
          <li>^<BsArrowRight />hills, uncrossable</li>
          <li>*<BsArrowRight />dandelions, make you hop farther</li>
        </ul>
      </div>
      <GameBoard rockRatio={config.ratios.rock} flowerRatio={config.ratios.flower}
                 mapWidth={config.mapSize.width} mapHeight={config.mapSize.height} setMessage={this.setMessage} />
    </div>
  }
}