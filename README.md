# Code name: Pirate-ship-battles
[![Build Status](https://travis-ci.org/uspgamedev/Pirate-ship-battles.svg?branch=dev)](https://travis-ci.org/uspgamedev/Pirate-ship-battles)
 
Online multiplayer game about pirates for USPGameDev

## Install dependencies
To run PSB (Pirate Ship Battles) you will need node.js and yarn installed in your machine.
1. To get node.js follow the instructions found [here](https://nodejs.org/en/download/package-manager/), the latest node version will be fine.
2. For the yarn installation follow this guide right [here](https://yarnpkg.com/lang/en/docs/install/#debian-stable).
3. Make sure your node version is equal or higher than 8.0, to do that run.
```
node --version
```
Execute:
```
yarn install
```

## Run server
* Execute:
1. This command will get the server up and run a bash script to minify the client .js files, thus getting a better load time.
```
yarn serve
```
2. Will do the same as the previous command with the change that a python3 script will be used to minify, note the bash script is preferred.
```
yarn servep
```
3. This command is for the developers only, not changing anything about any file, just getting the server up.
```
yarn up
```


* Open http://localhost:2000 in a modern browser
* Enjoy!
