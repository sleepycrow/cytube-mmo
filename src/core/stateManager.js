export default class StateManager {

    constructor(core){
        this.core = core;
        this.allowUpdate = false;
        this.stack = [];
        this.states = {};
    }

    registerState(name, state){
        if(this.states[name]) throw 'A state by the name of ' + name + ' already exists!';
        if(typeof state !== 'function') throw 'State ' + name + ' is not a class!';

        this.states[name] = state;
    }

    // Get current state (or an empty object, if no states are currently in the stack)
    getState(){
        if (this.stack.length > 0)
            return this.stack[this.stack.length - 1];
        else
            return {};
    }

    // Drop the entire stack and set a new state
    async switch(newState, params){
        await this.drop()
        await this.push(newState, params);
    }

    // Push a new state to the stack
    push(newState, params){
        if(!this.states[newState]) throw 'No state by the name of ' + name + '!';

        return new Promise((resolve, reject) => {
            this.allowUpdate = false;

            var state = new this.states[newState](...params);
            this.stack.push(state);

            if(state.init){
                state.init(this.core)
                .then(() => {
                    this.allowUpdate = true;
                    resolve();
                });
            }else{
                this.allowUpdate = true;
                resolve();
            }
        });
    }

    // Remove the topmost scene from the stack and go back to the previous one.
    pop(){
        return new Promise((resolve, reject) => {
            this.allowUpdate = false;

            var state = this.stack.pop();

            if(state.exit){
                state.exit(this.core)
                .then(() => {
                    this.allowUpdate = true;
                    resolve();
                });
            }else{
                this.allowUpdate = true;
                resolve();
            }
        });
    }

    // Drop the entire stack
    async drop(){
        while(this.stack.length > 0){
            await this.pop();
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
