export default class StateManager {

    constructor(core){
        this.core = core;
        this.allowUpdate = false;
        this.stack = [];
    }

    // Get current state (or an empty object, if no states are currently in the stack)
    getState(){
        if (this.stack.length > 0)
            return this.stack[this.stack.length - 1];
        else
            return {};
    }

    // Drop the entire stack and set a new state
    switch(newState){
        this.drop();
        this.push(newState);
    }

    // Push a new state to the stack
    push(state){
        this.allowUpdate = false;
        this.stack.push(state);

        if(state.init){
            state.init(this.core)
            .then(() => {
                this.allowUpdate = true;
            });
        }else{
            this.allowUpdate = true;
        }
    }

    // Remove the topmost scene from the stack and go back to the previous one.
    pop(){
        this.allowUpdate = false;
        var state = this.stack.pop();
        if(state.exit){
            state.exit(this.core)
            .then(() => {
                this.allowUpdate = true;
            });
        }else{
            this.allowUpdate = true;
        }
    }

    // Drop the entire stack
    drop(){
        while(this.stack.length > 0){
            this.pop();
        }
    }

    // Internal function. Get current state (if any) and run it's 'update' function (if permitted).
    runUpdate(dt){
        if(this.allowUpdate){
            if(this.getState().update) this.getState().update(dt, this.core);
        }
    }

    // Internal function. Get current state (if any) and run it's 'draw' function (if permitted).
    runDraw(){
        if(this.allowUpdate){
            if(this.getState().draw) this.getState().draw(this.core);
        }
    }

}
