export default class InputManager {

    constructor(){
        this.keys = {};
        this.keyAge = {};

        window.addEventListener("keydown", (e) => {
            let key = e.key.toUpperCase();
            if(key === ' ') key = 'SPACE';

            if(this.keys[key]) return false;

            this.keys[key] = true;
            this.keyAge[key] = 0;
        });

        window.addEventListener("keyup", (e) => {
            let key = e.key.toUpperCase();
            if(key === ' ') key = 'SPACE';

            delete this.keys[key];
            delete this.keyAge[key];
        });
    }

    update(){
        for(let key in this.keys){
            this.keyAge[key] += 1;
            if(this.keyAge[key] > 60) this.keyAge[key] = 2; // to prevent unnecessairly big numbers
        }
    }

    wasKeyJustPressed(key){
        if(this.keys[key] && this.keyAge[key] <= 1)
            return true;
        return false;
    }

}
