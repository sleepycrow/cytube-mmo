export default class StateManager {

    constructor(core){
        this.core = core;
        this.allowUpdate = false;
        this.currentState = {};
    }

    switchState(newState){
        this.allowUpdate = false;
        this.currentState = newState;

        if(this.currentState.init){
            this.currentState.init(this.core)
            .then(() => {
                this.allowUpdate = true;
            });
        }else{
            this.allowUpdate = true;
        }
    }

    runUpdate(dt){
        if(this.allowUpdate){
            if(this.currentState.update) this.currentState.update(dt, this.core);
        }
    }
    
    runDraw(){
        if(this.allowUpdate){
            if(this.currentState.draw) this.currentState.draw(this.core);
        }
    }

}