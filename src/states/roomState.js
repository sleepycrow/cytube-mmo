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

            core.assets.loadImages(this.roomConf.assets)
            .then(() => {
                core.camera.resetPos();

                let mapH = this.roomConf.tilemap.map.length;
                let mapW = this.roomConf.tilemap.map[0].length;
                this.tilemap = new Tilemap(mapW, mapH, this.roomConf.tileSize, core.assets.loaded[this.roomConf.tileset]);
                this.tilemap.loadMap(this.roomConf.tilemap);

                this.player = new LocalPlayerEntity(this.roomConf.spawn.x, this.roomConf.spawn.y);

                core.net.setChannel(this.channel);
                core.net.send({type: "join"});

                console.log("FINISHED LOADING!!!!!");
                resolve();
            })
            .catch(() => {
                window.alert('Nie udało się załadować zasobów tej mapy.');
                core.stateManager.switch('menu', [this.username]);
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

    _drawBackground(core){
        core.ctx.fillStyle = (this.roomConf.bgColor ? this.roomConf.bgColor : '#000000');
        core.ctx.fillRect(0, 0, core.width, core.height);

        if(this.roomConf.bgImage)
            core.ctx.drawImage(core.assets.loaded[this.roomConf.bgImage], 0, 0);
    }

    draw(core){
        this._drawBackground(core);

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
        if(data.username == this.username) return false;

        if(this.players[data.username])
            this.players[data.username].setPos(data.x, data.y);
        else
            this.players[data.username] = new RemotePlayerEntity(data.x, data.y, data.username);
    }

    handleJoin(data){
        if(data.username == this.username) return false;

        this.players[data.username] = new RemotePlayerEntity(this.roomConf.spawn.x, this.roomConf.spawn.y, data.username);

        this.player.x += 1; //dirty trick to get the player to send his pos without having to do weird shit
    }

    handleLeave(data){
        if(data.username == this.username) return false; //probably unnecessary, but why not, lol

        delete this.players[data.username];
    }

    handleMessage(data){
        console.log('msg', data, data.username != this.username);
        if(data.username == this.username){
            this.player.chatMsg = data.msg;
        }else{
            if(this.players[data.username])
                this.players[data.username].chatMsg = data.msg;
        }
    }

}
