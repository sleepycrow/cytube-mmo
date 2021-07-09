import StateManager from "./stateManager";
import InputManager from "./inputManager";
import Camera from "./camera";
import AssetManager from "./assetManager";
import NetworkManager from "./networkManager";

export default class Game {

    constructor(canvasId, scale){
        this.outputCanvas = document.getElementById(canvasId);
        if(this.outputCanvas == null) throw("canvas could not be found!");

        this.fps = 0;
        this.scale = scale;
        this.width = this.outputCanvas.width / scale;
        this.height = this.outputCanvas.height / scale;

        // create a new canvas. on this one, everything will be drawn at scale 1
        // afterwards, everything from this canvas will be redrawn on the new
        // canvas at the proper scale. this is to prevent the fuckery that comes
        // with drawing tilesets with drawImage with a scale.
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        this.outCtx = this.outputCanvas.getContext("2d");
        this.outCtx.scale(scale, scale);
        this.outCtx.imageSmoothingEnabled = false;

        //start subsystems
        this.stateManager = new StateManager(this);
        this.input = new InputManager();
        this.camera = new Camera(this, 0, 0);
        this.assets = new AssetManager();
        this.net = new NetworkManager();

        //set up subsystems
        this.net.onPacket = (type, data) => {
            if(this.stateManager.getState().onPacket)
                this.stateManager.getState().onPacket(type, data);
        };

        //start the loop
        var lastTimestamp = Date.now();
        var loop = (timestamp) => {
            //get the delta time
            var dt = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            this.fps = 1000 / dt;

            // update subsystems
            this.input.update();
            this.stateManager.runUpdate(dt);

            //clear canvas
            if(this.stateManager.allowUpdate){
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);
            }

            //draw the scene
            this.stateManager.runDraw();

            //copy scene to output canvas
            this.outCtx.drawImage(this.canvas, 0, 0);

            //request another frame
            this.frameRequestId = window.requestAnimationFrame(loop);
        };
        loop();
    }

    drawImage(src, sx, sy, w, h, dx, dy){
        if(this.camera){
            this.ctx.drawImage(src,
                sx, sy, w, h,
                (dx - this.camera.x), (dy - this.camera.y), w, h);
        }else{
            this.ctx.drawImage(src, sx, sy, w, h, dx, dy, w, h);
        }
    }

}
