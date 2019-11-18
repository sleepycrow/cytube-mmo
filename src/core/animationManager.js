export default class AnimationManager {
    
    constructor(spritesheet, framewidth, frameheight){
        this.spritesheet = spritesheet;
        this.framewidth = framewidth;
        this.frameheight = frameheight;

        this.anims = {};
        this.currentAnim = null;
        this.currentFrameIndex = 0;
        this.playing = false;

        this._timer = 0;
        this._framesPerRow = Math.floor(spritesheet.width / framewidth);
    }

    addAnimation(name, fps, frames){
        this.anims[name] = {
            fps: fps,
            changeFrameEvery: (1000 / fps),
            frames: frames
        };

        if(!this.currentAnim) this.playAnimation(name);
    }

    playAnimation(name, forceRestart){
        this.playing = true;

        if(!name || !this.anims[name]){
            throw("no animation by the name " + name + " was defined!");
        }else{
            if(forceRestart || this.currentAnim != this.anims[name]){
                this.currentFrameIndex = 0;
                this.currentAnim = this.anims[name];
            }
        }
    }

    pause(){
        this.playing = false;
    }

    update(dt){
        if(!this.playing || !this.currentAnim || !this.currentAnim.changeFrameEvery) return false;

        this._timer += dt;
        if(this._timer >= this.currentAnim.changeFrameEvery){
            this._timer = 0;

            this.currentFrameIndex++;
            if(this.currentFrameIndex >= this.currentAnim.frames.length) this.currentFrameIndex = 0;
        }
    }

    getCurrentFrame(){
        if(!this.currentAnim || !this.currentAnim.frames) throw("no animation playing!");

        var currentFrame = this.currentAnim.frames[this.currentFrameIndex];
        return {
            frame: currentFrame,
            x: currentFrame % this._framesPerRow * this.framewidth,
            y: Math.floor(currentFrame / this._framesPerRow) * this.frameheight, //(row - 1) * frameheight
            width: this.framewidth,
            height: this.frameheight
        };
    }

}