import { clampNum } from "./utils";

export default class Camera {

    constructor(core, x, y){
        this.width = core.width;
        this.height = core.height;
        this.x = x;
        this.y = y;
    }

    centerOnEntity(entity, tilemap){
        var newX = entity.x - (this.width / 2) + (entity.width / 2);
        var newY = entity.y - (this.height / 2) + (entity.height / 2);

        if(tilemap){
            let minX = 0;
            let minY = 0;
            let maxX = (tilemap.width * tilemap.tileSize) - this.width;
            let maxY = (tilemap.height * tilemap.tileSize) - this.height;

            newX = clampNum(newX, minX, maxX);
            newY = clampNum(newY, minY, maxY);
        }

        this.x = newX;
        this.y = newY;

        return true;
    }

    resetPos(){
        this.x = 0;
        this.y = 0;
    }

    fitsInCamera(x, y, width, height){
        //TODO: Implement fitsInCamera. You should have some help in your notebook! c:
        return true;
    }

}