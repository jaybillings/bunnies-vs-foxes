# Rabbits vs. Foxes

A game of predator and prey.

Get the bunny to her burrow while avoiding the fox!
* Press ENTER at any time to start a new game.
* Move the bunny with the arrow keys or WASD.
* Reach the burrow to win.
* If the bunny encounters the fox, you lose.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Version History

0.0.6
* Adds support for WASD keys.
* Adds instructions to README.
* Minor style updates.

0.0.5
* UI layout now mobile-first
* Separates map keys from game agent appearance.
  * Keys are now text (e.g. "burrow")
  * GameBoard has mapping of key -> appearance (e.g. {burrow: "@"})

0.0.4
* Improves UI layout

0.0.3
* Implements game start/end
* Adds UI elements tracking wins/moves
* Adds new game button

0.0.2
* Improves movement constraint.
* Renders other board items -- rocks, flowers, fox, burrow.
* Layout sends map values as props -- support for future user config screen.

0.0.1
* Renders basic gameboard.
* Supports basic movement (wasd);




