# Code name: Pirate-ship-battles
[![Code Climate](https://codeclimate.com/github/mezuro/prezento/badges/gpa.svg)](https://codeclimate.com/github/Herez/Pirate-ship-battles)[![Test Coverage](https://codeclimate.com/github/Herez/Pirate-ship-battles/badges/coverage.svg)](https://codeclimate.com/github/Herez/Pirate-ship-battles/progress/coverage)[![Build Status](https://travis-ci.org/uspgamedev/Pirate-ship-battles.svg?branch=dev)](https://travis-ci.org/uspgamedev/Pirate-ship-battles)

Online multiplayer game about pirates for USPGameDev

#index
1. Install dependencies
2. Run server
3. Server on the cloud
4. Playing the game
5. Unit testing

##1. Install dependencies
To run PSB (Pirate Ship Battles) you will need node.js and yarn installed in your machine.
1. To get node.js follow the instructions found [here](https://nodejs.org/en/download/package-manager/), the latest node version will be fine.
2. For the yarn installation follow this guide right [here](https://yarnpkg.com/lang/en/docs/install/#debian-stable).
3. Make sure your node version is equal or higher than 8.0, to do that run :
```
node --version
```
Execute:
```
yarn install
```

##2. Run server
* Execute:
```
yarn serve
```
1. This command will get the server up and run a bash script to minify the client .js files, thus getting a better load time.
```
yarn servep
```
2. Will do the same as the previous command with the change that a python3 script will be used to minify, note the bash script is preferred.
```
yarn up
```
3. This command is for the developers only, not changing anything about any file, just getting the server up.


##3. Server on the cloud
If you are gonna use some webservice to run the server, run :
```
sudo nano /lib/systemd/system/pirates_game.service
```
Now, add
```
[Unit]
Description=pirates
After=network.target

[Service]
Environment=NODE_PORT=80
Type=simple
User=root
ExecStart=/usr/bin/yarn --cwd /home/ubuntu/pirates serve
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
to the file and run :
```
sudo systemctl start pirates_game
```
##4. Playing the game

* Open http://localhost:2000 in a modern browser
* Enjoy!

##5. Unit testing
We have tests!! Just run :
```
yarn test
```
And all our automated unit tests should run and help you see if something broke. We use [Jest](https://jestjs.io/) as our test API.
