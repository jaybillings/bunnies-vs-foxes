import React, { Component } from "react";
import MapGrid from "../components/MapGrid";

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
      <h1>the bunny game</h1>
      <MapGrid rockRatio={config.ratios.rock} flowerRatio={config.ratios.flower}
               mapWidth={config.mapSize.width} mapHeight={config.mapSize.height} />
    </div>
  }
}