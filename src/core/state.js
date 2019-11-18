export default class State {

    constructor(){
        this.texts = {};
    }

    drawLoadingScreen(core){
        core.ctx.fillStyle = "#000000";
        core.ctx.fillRect(0, 0, core.width, core.height);

        core.ctx.fillStyle = "#FFFFFF";
        core.ctx.font = (32 / core.scale) + "px sans-serif";
        core.ctx.fillText("Loading...", (16 / core.scale), (48 / core.scale));
    }
    
}