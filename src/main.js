/*
"Let me not die without fame, without a fight,
But let me do some great deed to be heard by those to come."
 - Homer, The Iliad

if found, please return to sleepycrow
*/

import Game from "./core/game";
import MenuState from "./states/menuState";
import RoomState from "./states/roomState";

export default function startGame(canvasId, socket, username){
    if(!window.cyGameConf || !window.cyGameConf.maps){
        window.alert('Cannot start game, no config/maps have been given!');
        return false;
    }

    window.username = username;

    var game = new Game(canvasId, 1);
    game.net.setSocket(socket);
    game.stateManager.registerState('menu', MenuState);
    game.stateManager.registerState('room', RoomState);
    game.stateManager.switch('menu', [username]);

    return game;
}
