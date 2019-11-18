import Sprite from "../core/sprite";

export default class RemotePlayerEntity extends Sprite {

    constructor(x, y, username){
        super(x, y, 32, 32);
        this.username = username;
        this.chatMsg = "";
        this.dest = {x: x, y: y};
        this.speed = {x: 0, y: 0};
    }

    setPos(x, y){
        this.dest.x = x;
        this.dest.y = y;
        this.speed.x = (this.dest.x - this.x) / 275;
        this.speed.y = (this.dest.y - this.y) / 275;
    }

    update(dt, core){
        if(Math.abs(this.dest.x - this.x) > 8 || Math.abs(this.dest.y - this.y) > 8){
            this.x += Math.round(this.speed.x * dt);
            this.y += Math.round(this.speed.y * dt);
        }else{
            this.x = this.dest.x;
            this.y = this.dest.y;
        }
    }

    draw(core){
        core.ctx.fillStyle = "#666666";
        core.ctx.fillRect((this.x - core.camera.x), (this.y - core.camera.y), this.width, this.height);

        core.ctx.font = "24px sans-serif";
        core.ctx.fillText(this.username, (this.x - core.camera.x) + this.width, (this.y - core.camera.y) + this.height);
        
        core.ctx.font = "16px sans-serif";
        core.ctx.fillText(this.chatMsg, (this.x - core.camera.x), (this.y - core.camera.y) - 4);
    }

}