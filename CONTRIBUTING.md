# Contributing to Pirate-ship-battles
A quick run down where every thing is and should be.

## Table of Contents
1. [Client Code](#client-code)
2. [Server code](#server-code)
3. [Minify script](#minify-script)


#### 1. Client Code <a name="client-code"></a>
The client code uses [Phaser3](https://photonstorm.github.io/phaser3-docs/) to render the game, no computation done by the client is returned to the server, by doing that we can prevent some level of cheating.  

#### game.js
Contains general game configuration. Contains the Phaser scenes,
and the definition of some constants.

#### hud.js
Displays the ammo, life, score board.

#### item.js
Islands, stones, bullets crates.

#### login.js
The login scene.

#### main.js
Has the shader of the safe zone, gets all the data from the server so that it can represent what is happening to the player.

Some prediction of what the next position of the ship is done here, but that is not sent to the server.

#### players.js
The player class.

#### util.js
Usefull functions that did not belong in any one specific file.

#### lib
The Phaser3 code, only change this file if you want to use a newer version of Phaser or feel confident in changing the file.

### 2. Server code <a name="server-code"></a>
The code that runs on the server is the app.js and all the file that it calls, wich all can be found in the server/ folder

In the server folder you will find all the code that could have been removed from the app.js (server proper), like the objects used.

### 3. Minify script <a name="minify-script"></a>
Both concat.py and concat.sh merge all the client.js files for better loading time. Concat.sh is a bash script and is may not be compatible with all shell types.
