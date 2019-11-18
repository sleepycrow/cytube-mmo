import StateManager from "./stateManager";
import InputManager from "./inputManager";
import Camera from "./camera";
import AssetManager from "./assetManager";
import NetworkManager from "./networkManager";

export default class Game {

    constructor(canvasId, scale){
        this.canvas = document.getElementById(canvasId);
        if(this.canvas == null) throw("canvas could not be found!");

        this.fps = 0;
        this.width = this.canvas.width / scale;
        this.height = this.canvas.height / scale;
        this.scale = scale;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(scale, scale);

        //start subsystems
        this.stateManager = new StateManager(this);
        this.input = new InputManager();
        this.camera = new Camera(this, 0, 0);
        this.assets = new AssetManager();
        this.net = new NetworkManager();

        //start the loop
        var lastTimestamp = Date.now();
        var loop = (timestamp) => {
            //get the delta time
            var dt = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            this.fps = 1000 / dt;

            //update the scene c:
            this.stateManager.runUpdate(dt);

            //clear canvas
            if(this.stateManager.allowUpdate){
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);
            }

            //draw the scene
            this.stateManager.runDraw();

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