# CyTube MMO (reborn)

A customizable, proof-of-concept multiplayer game that uses the CyTube chatroom to communicate between players. Allows room admins to set their own selection of maps.
Based on the code of [offl1n3](https://github.com/sleepycrow/offl1n3).

## Testing and Building

To test, simply run `npm run build-dev`. This will build a dev build of the game, then start a web and websockets server on port 10001.

To make a release build, simply run `npm run build-prod`. The finished file will be located in `dist/js/`.

## Embedding

### 1) Build the game script

Make a release build with `npm run build-prod`.

### 2) Embed the game script

Get the .js file from `dist/js/` and throw it up on some https server, then, on your CyTube channel, go to Channel Settings > Admin Settings, and set the URL to the file as the External Javascript.

### 3) Add maps

Go to Channel Settings > Edit > JavaScript, and append the following: 

```js
window.cyGameConf = { maps: [] };
```

Then, append the maps. If you don't have any, [here's an example map you can use](https://gist.github.com/sleepycrow/069522c1769eaaa9d55aff35dd641079).
Alternatively, you can make your own maps using the format described below. Laying out tiles by hand can be a bit of a pain, [so here's an impromptu Tiled plugin](https://gist.github.com/sleepycrow/d547d5daddbd7bd695ee9111b52235b7). Beware that you need to have 2 layers - 'map' and 'collision' - and the plugin only outputs the 'tilemap' bit of the map, the rest you'll still need to write by hand. (sorry about that!)

### 4) Add a canvas, launch code and start!

Drop in a canvas of any size with the id `game-canvas`, then append the following JS to your scripts:

```js
var activeGame;
function startGame() {
  if(activeGame)
    return false;

  if (game && CLIENT.logged_in) {
    socket.emit("chatMsg", {
      msg: CLIENT.name + " joined the game!",
      meta: {}
    });

    activeGame = game("game-canvas", socket, CLIENT.name);
  } else {
    window.alert("Something went wrong. Are sure you're logged in? Are you sure you enabled external scripts?");
  }
}
```

Now, if everything is set up right, you should be able to launch the game by simply running `startGame()`, either via devtools or by adding in a button with onclick="startGame()".

## Map Format

```js
// The map should be a JS/JSON object in the window.cyGameConf.maps array
window.cyGameConf.maps[1] = {
    name: "test map 2", // Readable name, for display in room menu

    // A list of named assets to load
    assets: {
        tiles: '/assets/tiles.png',
        bg: '/assets/bg.png'
    },

    bgColor: '#FFFFFF', // (Optional) custom background color
    bgImage: 'bg', // (Optional) custom static background image. Should be the name of one of the assets
    tileset: 'tiles', // Tileset. Should be the name of one of the assets
    tileSize: 16, // The width and height (in pixels) of a single tile in the tileset
    spawn: { x: 32, y: 32 }, // The map's spawnpoint. This is where players will appear when they enter the map.

    // The tilemap itself.
    tilemap: {
        "map": [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        "collision": [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]
    }
};
```
