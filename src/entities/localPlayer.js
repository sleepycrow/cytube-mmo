import Sprite from "../core/sprite";

export default class LocalPlayerEntity extends Sprite {

    constructor(x, y){
        super(x, y, 32, 32);

        // movement
        this.speed = 0.2;
        this.vel = {x: 0, y: 0};
        this.lastX = -1;
        this.lastY = -1;
        this.lastUpdate = -1;

        // chatMsg
        this.chatMsg = "";
    }

    update(dt, core, tilemap){
        this._updateMovement(dt, core, tilemap);
        if(core.net.socket) this.sendPosition(core.net.socket);
    }

    _updateMovement(dt, core, tilemap){
        // Reset the velocity
        this.vel.x = 0;
        this.vel.y = 0;

        // handle movement on the x axis
        if(core.input.keys.A){
            this.vel.x -= this.getSpeed(dt);
        }else if(core.input.keys.D){
            this.vel.x += this.getSpeed(dt);
        }

        // check for collisions on the x axis
        if(tilemap){
            let blocked = tilemap.calculateCollision(this.x, this.y, this.width, this.height, this.vel.x, 0);
            
            if(blocked.left && this.vel.x < 0) this.vel.x = 0;
            else if(blocked.right && this.vel.x > 0) this.vel.x = 0;
        }

        // move shit on the x axis
        this.x += this.vel.x;

        // handle movement on the y axis
        if(core.input.keys.S){
            this.vel.y += this.getSpeed(dt);
        }else if(core.input.keys.W){
            this.vel.y -= this.getSpeed(dt);
        }

        // check for collisions on the y axis
        if(tilemap){
            let blocked = tilemap.calculateCollision(this.x, this.y, this.width, this.height, 0, this.vel.y);
            
            if(blocked.top && this.vel.y < 0) this.vel.y = 0;
            else if(blocked.bottom && this.vel.y > 0) this.vel.y = 0;
        }

        // move shit on the y axis
        this.y += this.vel.y;
    }

    sendPosition(socket){
        if(this.x == this.lastX && this.y == this.lastY) return false;
        if(Date.now() - this.lastUpdate < 250) return false;

        socket.emit("chatMsg", {
            msg: '{"type": "pos", "x": ' + this.x + ', "y": ' + this.y + '}',
            meta: {}
        });

        this.lastX = this.x;
        this.lastY = this.y;
        this.lastUpdate = Date.now();
    }

    draw(core){
        core.ctx.fillStyle = "#0094FF";
        core.ctx.fillRect((this.x - core.camera.x), (this.y - core.camera.y), this.width, this.height);

        core.ctx.font = "16px sans-serif";
        core.ctx.fillText(this.chatMsg, (this.x - core.camera.x), (this.y - core.camera.y) - 4);
    }

    getSpeed(dt){
        return Math.round(this.speed * dt);
    }

}