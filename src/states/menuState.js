import State from "../core/state";

export default class MenuState extends State {

    constructor(username){
        super();
        this.timer = 0;
        this.username = username;
        this.mapCursor = 0;
    }

    onPacket(type, data){
        console.log(type, data);
    }

    init(core){
        this.drawLoadingScreen(core);

        return new Promise((resolve, reject) => {
            console.log("entering menustate...");

            this.timer = 0;
            this.mapCursor = 0;

            resolve();
        });
    }

    exit(core){
        return new Promise((resolve, reject) => {
            console.log("exiting menustate...");

            resolve();
        });
    }

    update(dt, core){
        if(!Number.isNaN(dt)){
            this.timer += 1 * (Math.floor(dt) / 50);
            if(this.timer >= 64) this.timer = 0;
        }

        if(core.input.wasKeyJustPressed('W')) this.mapCursor--;
        if(core.input.wasKeyJustPressed('S')) this.mapCursor++;
        this.mapCursor = Math.min(Math.max(this.mapCursor, 0), window.cyGameConf.maps.length - 1)

        if(core.input.wasKeyJustPressed('SPACE')){
            core.stateManager.switch('room', [this.username, this.mapCursor, window.cyGameConf.maps[this.mapCursor]]);
        }
    }

    _drawGrid(ctx, width, height, camX, camY, tileSize){
        //draw background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#777777";
        for(var x = tileSize; x < (width + tileSize); x += tileSize){
            ctx.fillRect(x - (camX % tileSize), 0, 1, height);
        }

        for(var y = tileSize; y < (height + tileSize); y += tileSize){
            ctx.fillRect(0, y - (camY % tileSize), width, 1);
        }
    }

    draw(core){
        this._drawGrid(core.ctx, core.width, core.height, Math.round(this.timer), Math.round(this.timer), 64);

        core.ctx.font = "12px sans-serif";
        core.ctx.fillStyle = "#000000";
        core.ctx.fillText("koton mmorpg experience; FPS: " + core.fps, 4, 12);

        var y = 12 + 6 + 24;
        core.ctx.font = '24px sans-serif';
        core.ctx.fillText('Witaj, ' + this.username, 4, y);

        y += 6 + 16;
        core.ctx.font = '16px sans-serif';
        core.ctx.fillText('WASD aby wybrać pokój, SPACE aby do niego wejść.', 4, y);

        y += 12;
        core.ctx.beginPath();
        core.ctx.moveTo(0, y);
        core.ctx.lineTo(core.width, y);
        core.ctx.stroke();

        y += 12 + 16;

        for(let i = 0; i < window.cyGameConf.maps.length; i++){
            let map = window.cyGameConf.maps[i];
            let name = map.name;
            core.ctx.fillStyle = "#000000";

            if(this.mapCursor == i){
                name = '> ' + name;
                core.ctx.fillStyle = "#007fff";
            }

            core.ctx.fillText(name, 4, y);
            y += 6 + 16;
        }

        //core.ctx.fillText("press [z] to beninging", 128, 128);
    }

}
