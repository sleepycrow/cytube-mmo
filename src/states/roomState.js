import State from "../core/state";
import Tilemap from "../core/tilemap";
import LocalPlayerEntity from "../entities/localPlayer";
import RemotePlayerEntity from "../entities/remotePlayer";

export default class RoomState extends State {

    constructor(username, channelId, roomConfig){
        super();

        this.username = username;
        this.channel = channelId;
        this.roomConf = roomConfig;
        this.players = {};
    }

    init(core){
        this.drawLoadingScreen(core);

        return new Promise((resolve, reject) => {
            console.log("entering roomstate...");

            core.assets.loadImages({
                tileset: this.roomConf.tileset
            }).then(() => {
                core.camera.resetPos();

                this.tilemap = new Tilemap(48, 48, this.roomConf.tileSize, core.assets.loaded.tileset);
                this.tilemap.loadMap(this.roomConf.tilemap);

                this.player = new LocalPlayerEntity(128, 128);

                core.net.setChannel(this.channel);
                core.net.send({type: "join"});

                console.log("FINISHED LOADING!!!!!");
                resolve();
            });
        });
    }

    exit(core){
        return new Promise((resolve, reject) => {
            console.log("exiting gamestate...");

            core.net.send({type: "leave"});
            core.net.unsetChannel();

            resolve();
        });
    }

    update(dt, core){
        for(var i in this.players){
            this.players[i].update(dt, core);
        }

        this.player.update(dt, core, this.tilemap);
        core.camera.centerOnEntity(this.player, this.tilemap);

        if(core.input.wasKeyJustPressed('ESCAPE'))
            core.stateManager.switch('menu', [this.username]);
    }

    _drawGrid(ctx, width, height, camX, camY, tileSize){
        //draw background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#000000";
        for(var x = tileSize; x < (width + tileSize); x += tileSize){
            ctx.fillRect(x - (camX % tileSize), 0, 1, height);
        }

        for(var y = tileSize; y < (height + tileSize); y += tileSize){
            ctx.fillRect(0, y - (camY % tileSize), width, 1);
        }
    }

    draw(core){
        this._drawGrid(core.ctx, core.width, core.height, core.camera.x, core.camera.y, 64);

        this.tilemap.drawArea(core, core.camera.x, core.camera.y, core.camera.width, core.camera.height);

        for(var i in this.players){
            this.players[i].draw(core);
        }

        this.player.draw(core);

        core.ctx.font = "12px sans-serif";
        core.ctx.fillStyle = "#000000";
        core.ctx.fillText("koton mmorpg experiance; x: " + this.player.x + "; y: " + this.player.y + "; FPS: " + core.fps, 4, 12);
    }

    onPacket(type, data){
        if(type !== 'chatMsg' && data.chan !== this.channel) return false;

        switch(type){
            case 'chatMsg':
                this.handleMessage(data);
                break;

            case 'join':
                this.handleJoin(data);
                break;

            case 'leave':
                this.handleLeave(data);
                break;

            case 'pos':
                this.handlePosUpdate(data);
                break;
        }
    }

    handlePosUpdate(data){
        if(data.username != this.username){
            if(this.players[data.username]){
                this.players[data.username].setPos(data.x, data.y);
            }else{
                this.players[data.username] = new RemotePlayerEntity(data.x, data.y, data.username);
            }
            console.log(this.players[data.username]);
        }
    }

    handleJoin(){
        this.player.x += 1; //dirty trick to get the player to send his pos without having to do weird shit
    }

    handleLeave(){
        //nothing here yet, stub function
    }

    handleMessage(data){
        if(data.username != this.username){
            if(this.players[data.username]) this.players[data.username].chatMsg = data.msg;
        }else{
            this.player.chatMsg = data.msg;
        }
    }

}
