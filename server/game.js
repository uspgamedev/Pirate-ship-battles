////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                               Server - Game                                //
////////////////////////////////////////////////////////////////////////////////

const ScoreBoard = require('./score_board.js');

module.exports = class Game {
  constructor (dict) {
    // List of players in the game
    if (typeof dict == "object" && "playerList" in dict) {
      this.playerList = dict["playerList"];
    }
    else {
      this.playerList = {};
    }
    /** @type Bullet{}*/
    if (typeof dict == "object" && "bulletList" in dict) {
      this.bulletList = dict["bulletList"];
    }
    else {
      this.bulletList = {};
    }
    //List of islands in the game
    if (typeof dict == "object" && "islandList" in dict) {
      this.islandList = dict["islandList"];
    }
    else {
      this.islandList = {};
    }
    //List of stones in the game
    if (typeof dict == "object" && "stoneList" in dict) {
      this.stoneList = dict["stoneList"];
    }
    else {
      this.stoneList = {};
    }
    // boxes object list
    if (typeof dict == "object" && "boxList" in dict) {
      this.boxList = dict["boxList"];
    }
    else {
      this.boxList = {};
    }
    // The list of scores form active players
    if (typeof dict == "object" && "score_board" in dict) {
      this.score_board = dict["score_board"];
    }
    else {
      this.score_board = new ScoreBoard();
    }
    // The max number of pickable boxes in the game
    if (typeof dict == "object" && "boxesMax" in dict) {
      this.boxesMax = dict["boxesMax"];
    }
    else {
      this.boxesMax = 15;
    }
    // Size of the boxes list
    if (typeof dict == "object" && "numOfBoxes" in dict) {
      this.numOfBoxes = dict["numOfBoxes"];
    }
    else {
      this.numOfBoxes = 0;
    }
    // The max number of islands in the game
    if (typeof dict == "object" && "islandMax" in dict) {
      this.islandMax = dict["islandMax"];
    }
    else {
      this.islandMax = 10;
    }
    // The max number of stones in the game
    if (typeof dict == "object" && "stoneMax" in dict) {
      this.stoneMax = dict["stoneMax"];
    }
    else {
      this.stoneMax = 4;
    }
    // Game height
    if (typeof dict == "object" && "canvasHeight" in dict) {
      this.canvasHeight = dict["canvasHeight"];
    }
    else {
      this.canvasHeight = 2000;
    }
    // Game width
    if (typeof dict == "object" && "canvasWidth" in dict) {
      this.canvasWidth = dict["canvasWidth"];
    }
    else {
      this.canvasWidth = 2000;
    }
    // Advances by one each game update cycle (related to player invulnerability)
    if (typeof dict == "object" && "delta" in dict) {
      this.delta = dict["delta"];
    }
    else {
      this.delta = 1;
    }
    // Arbitrary integer variable, used to define invulnerability time
    if (typeof dict == "object" && "mod" in dict) {
      this.mod = dict["mod"];
    }
    else {
      this.mod = 120;
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
