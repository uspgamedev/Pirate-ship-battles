////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                               Client - Login                               //
////////////////////////////////////////////////////////////////////////////////

entername.onclick = function () {
  if (!gameProperties.inGame) {
    console.log(`Player ${socket.id} entered name`);
    socket.emit('enter_name', {username: signdivusername.value, config: config});
  }
}

////////////////////////////////////////////////////////////////////////////////
function throwError (data) {
  //let errorLog = document.getElementById("errorLog");
  errorLog.textContent = data.message;
}

////////////////////////////////////////////////////////////////////////////////
function joinGame (data) {
  console.log(`Player ${socket.id} joined the game`);
  signDiv.style.display = 'none';
  gameDiv.style.display = null;
  errorLog.textContent = "";
  game.scene.start('Main', data.username);
}

////////////////////////////////////////////////////////////////////////////////
// Login                                                                      //
////////////////////////////////////////////////////////////////////////////////
class Login extends Phaser.Scene {
  constructor () {
    super({key: "Login"});
    // Everything here will execute just one time per client session
    socket.on('join_game', joinGame);
    socket.on('throw_error', throwError);
  }

  //////////////////////////////////////////////////////////////////////////////
  create () {
    signDiv.style.display = null;
    gameDiv.style.display = 'none';
    game.backgroundColor = "#AFF7F0";
    gameProperties.inGame = false;
    mobilecheckbox.checked = isTouchDevice();
  }
}

////////////////////////////////////////////////////////////////////////////////
