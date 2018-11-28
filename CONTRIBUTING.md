# Contributing to Pirate-ship-battles

## Table of Contents
1. [Code Overview](#code-overview)

### 1. Code Overview <a name="code-overview"></a>
1.1 [Client Code](#client-code)
1.2 [Server Code](#server-code)

#### 1.1 Client Code <a name="client-code"></a>
The client code uses [Phaser3](https://photonstorm.github.io/phaser3-docs/) to render the game, no computation done by the client is returned to the server, by doing that we can prevent some level of cheating.  

###### game.js
Contains general game configuration. Contains the Phaser scenes,
and the definition of some constants.

###### hud.js
Displays the ammo, life, score board.