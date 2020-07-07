import React, {Component} from "react";
import MapGrid from "../components/MapGrid";

export default class GameLayout extends Component {
  render() {
    return <div className={'game-layout'}>
      <h1>the bunny game</h1>
      <MapGrid width={4} height={5} />
    </div>
  }
}