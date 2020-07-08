import React, { Component } from "react";
import GameBoard from "../components/GameBoard";

export default class GameLayout extends Component {
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
        <p>Get the bunny to her burrow!</p>
        <p>Legend:</p>
        <ul>
          <li># --> the bunny, that's you!</li>
          <li>$ --> the fox, will eat the bunny</li>
          <li>@ --> the burrow, go here!</li>
          <li>^ --> hills, uncrossable</li>
          <li>* --> dandelions, make your next move 2 spaces</li>
        </ul>
      </header>

      <GameBoard rockRatio={config.ratios.rock} flowerRatio={config.ratios.flower}
                 mapWidth={config.mapSize.width} mapHeight={config.mapSize.height} />
    </div>
  }
}