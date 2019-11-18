import Sprite from "../core/sprite";
import AnimationManager from "../core/animationManager";

export default class PlayerEntity extends Sprite {

    constructor(x, y, spritesheet, health = 3){
        super(x, y, 16, 32);

        this.dead = false;
        this.health = health;

        // animations
        this.spritesheet = spritesheet;
        this.anims = new AnimationManager(spritesheet, this.width, this.height);
        this.anims.addAnimation("walk_r", 7, [0, 1, 2, 1]);
        this.anims.addAnimation("punch_r", 7, [3]);
        this.anims.addAnimation("walk_l", 7, [5, 6, 7, 6]);
        this.anims.addAnimation("punch_l", 7, [4]);

        this.facing = "r";

        // movement
        this.speed = 3;
        this.jumpVelocity = 6;
        this.gravity = 0.25;
        this.maxGravity = 5;
        this.vel = {x: 0, y: 0};

        // jumping
        this.jumpCooldown = 150;
        this.jumpCooldownCounter = 0;

        // attacking
        this.attackReady = false;
        this.attacking = false;
        this.attackLength = 100;
        this.attackCounter = 0;
        this.timeSinceLastAttack = 0;
        this.attackCooldown = 500;
    }

    update(dt, core, tilemap){
        if(this.dead) return false;

        this.anims.update(dt);

        this._update_attack(dt, core);

        this._update_movement(dt, core, tilemap);
    }

    _update_attack(dt, core){
        this.timeSinceLastAttack += dt;

        // don't let the player just hold down the attack key
        if(this.attackCounter > 0){
            this.attackCounter -= dt;
            this.attackReady = false;
        }else{
            if(!this.attackReady){
                this.attackReady = !core.input.keys.z;
                this.anims.playAnimation("walk_" + this.facing);
                this.anims.pause();
            }
            this.attacking = false;
        }

        if(this.attackReady && this.timeSinceLastAttack >= this.attackCooldown && core.input.keys.z){
            this.timeSinceLastAttack = 0;
            this.attackCounter = this.attackLength;
            this.attacking = true;
            this.anims.playAnimation("punch_" + this.facing);
        }
    }

    _update_movement(dt, core, tilemap){
        // Reset the velocity
        this.vel.x = 0;
        this.vel.y = Math.min(this.vel.y + this.gravity, this.maxGravity);

        // handle movement on the x axis
        if(!this.attacking){
            if(core.input.keys.ArrowLeft){
                this.vel.x -= this.speed;
                this.facing = "l";
                this.anims.playAnimation("walk_l");
            }else if(core.input.keys.ArrowRight){
                this.vel.x += this.speed;
                this.facing = "r";
                this.anims.playAnimation("walk_r");
            }else{
                this.anims.pause();
            }
        }

        // check for collisions on the x axis
        if(tilemap){
            let blocked = tilemap.calculateCollision(this.x, this.y, this.width, this.height, this.vel.x, 0);
            
            if(blocked.left && this.vel.x < 0) this.vel.x = 0;
            else if(blocked.right && this.vel.x > 0) this.vel.x = 0;
        }

        // handle movement on the y axis
        if(!this.attacking){
            if((core.input.keys.ArrowUp || core.input.keys.x) && this.jumpCooldownCounter <= 0){
                this.vel.y -= this.jumpVelocity;
                this.jumpCooldownCounter = this.jumpCooldown;
            }
        }

        // check for collisions on the y axis
        if(tilemap){
            let blocked = tilemap.calculateCollision(this.x, this.y, this.width, this.height, 0, this.vel.y);
            
            if(blocked.bottom && this.vel.y > 0) this.vel.y = 0;
            else if(blocked.top && this.vel.y < 0) this.vel.y = 0;

            if(this.jumpCooldownCounter > 0 && blocked.bottom) this.jumpCooldownCounter -= dt;
        }

        // finally update position
        this.x += this.vel.x;
        this.y += this.vel.y;
    }

    draw(core){
        let frame = this.anims.getCurrentFrame();
        
        core.drawImage(this.spritesheet,
            frame.x, frame.y, frame.width, frame.height,
            this.x, this.y, this.width, this.height);
    }

    onCollideWithEntity(entity){
        if(this.attacking && entity.takeDamage) entity.takeDamage(this, 1);
    }

    takeDamage(damager, damage){
        this.health -= damage;

        if(this.health <= 0){
            this.dead = true;
        }
    }

}