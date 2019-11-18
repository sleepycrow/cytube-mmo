export default class InputManager {

    constructor(){
        this.keys = {};

        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toUpperCase()] = true;
        });
        window.addEventListener("keyup", (e) => {
            delete this.keys[e.key.toUpperCase()];
        });
    }

}