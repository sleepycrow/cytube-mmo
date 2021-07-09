const { terser } = require('rollup-plugin-terser');

export default {
    input: "./src/main.js",
    output: {
        name: "game",
        file: "./dist/js/game.js",
        format: "iife"
    },

    plugins: [
        terser()
    ]
}
