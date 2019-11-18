export default class Tilemap {

    constructor(width, height, tileSize, tileSheet){
        this.width = width;
        this.height = height;
        this.tileSheet = tileSheet;
        this.tileSize = tileSize;

        if(tileSheet) this._tilesPerRow = Math.floor(tileSheet.width / tileSize);

        this.loaded = {
            map: [],
            collision: [],
            entities: []
        };
    }

    loadMap(newMap){
        this.loaded = newMap;
        return true;
    }

    drawArea(core, x, y, width, height){
        if(!this.loaded || !this.loaded.map || !this.tileSheet) return false;

        var min = {
            x: Math.floor(x / this.tileSize),
            y: Math.floor(y / this.tileSize)
        };
        var max = {
            x: Math.floor((x + width) / this.tileSize),
            y: Math.floor((y + height) / this.tileSize)
        };

        for(var y = min.y; y <= max.y; y++){
            for(var x = min.x; x <= max.x; x++){
                if(!this.loaded.map[y] || !this.loaded.map[y][x] || this.loaded.map[y][x] < 1) continue;

                let tile = this.loaded.map[y][x] - 1;
                let sx = tile % this._tilesPerRow * this.tileSize;
                let sy = Math.floor(tile / this._tilesPerRow) * this.tileSize;
                let dx = x * this.tileSize;
                let dy = y * this.tileSize;
                
                core.drawImage(this.tileSheet,
                    sx, sy, this.tileSize, this.tileSize,
                    dx, dy, this.tileSize, this.tileSize);
            }
        }
    }

    isSolid(tileX, tileY){
        if(this.loaded && this.loaded.collision && this.loaded.collision[tileY] && this.loaded.collision[tileY][tileX]){
            if(this.loaded.collision[tileY][tileX] > 0) return true;
        }
        return false;
    }

    spawnEntityByType(type, entity, spritesheet){
        var entitiesSpawned = [];

        if(this.loaded && this.loaded.entities){
            for(var i = 0; i < this.loaded.entities.length; i++){
                if(this.loaded.entities[i].type == type){
                    entitiesSpawned.push(new entity(this.loaded.entities[i].x, this.loaded.entities[i].y, spritesheet));
                }
            }
        }
        
        return entitiesSpawned;
    }

    calculateCollision(posX, posY, width, height, velX = 0, velY = 0){
        // here's what we will output
        var blocked = {
            left: false,
            right: false,
            top: false,
            bottom: false
        };

        // if there's no collision layer, just say nothing's blocked
        if(!this.loaded || !this.loaded.collision) return blocked;

        //get the target position
        var tX = posX + velX;
        var tY = posY + velY;

        // determine the range of tiles to be checked
        var tiles = {
            yStart: Math.floor(tY / this.tileSize),
            yEnd: Math.floor((tY + height) / this.tileSize),
            xStart: Math.floor(tX / this.tileSize),
            xEnd: Math.floor((tX + width) / this.tileSize)
        };

        // get the tiles to the left and right of the player
        for(var y = tiles.yStart; y <= tiles.yEnd; y++){
            if(this.isSolid(tiles.xStart, y)) blocked.left = true;
            if(this.isSolid(tiles.xEnd, y)) blocked.right = true;
        }

        // get the tiles above and below the player
        for(var x = tiles.xStart; x <= tiles.xEnd; x++){
            if(this.isSolid(x, tiles.yStart)) blocked.top = true;
            if(this.isSolid(x, tiles.yEnd)) blocked.bottom = true;
        }

        return blocked;
    }

}