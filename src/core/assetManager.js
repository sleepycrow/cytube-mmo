export default class AssetManager {

    constructor(){
        this.loaded = {};
    }

    loadImages(toLoad){
        var loaded = this.loaded;
        var promises = [];

        for(var key in toLoad){
            let promise = new Promise((resolve, reject) => {
                let myKey = key;
                let img = new Image();
                img.src = toLoad[myKey];
                img.onload = function(){
                    console.log("Loaded file " + myKey); // this is here because the babel-minify plugin hates me.
                    loaded[myKey] = this;
                    resolve(this);
                };
                img.onerror = reject;
            });
            promises.push(promise);
        }

        return Promise.all(promises);
    }

}