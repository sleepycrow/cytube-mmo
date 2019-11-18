export default class Sprite {

    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dead = false;
    }

    draw(core){
        core.ctx.fillStyle = "#FF0000";
        core.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(sprite){
        if(sprite.dead) return false;

        return this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y;
    }

}