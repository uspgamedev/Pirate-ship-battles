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

###### item.js
Islands, stones, bullets crates.

###### login.js
It' clear what it does

###### main.js
Has the shader of the death circle, gets all the data from the server so that it can represent what is happening to the player.

Some prediction of what the next position of the ship is done here, but that is not sent to the server.

###### players.js
Again, preaty clear.

###### util.js
Usefull functions that did not belong in any one specific file.

###### lib
The Phaser3 code, nothing to change here. 

### 1.2 Server code <a name="server-code"></a>
The code that runs on the server is the app.js and all the file that it calls, wich all can be found in the server/ folder

In the server folder you will find all objects used by the server