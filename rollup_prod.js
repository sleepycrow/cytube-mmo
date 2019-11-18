import minify from "rollup-plugin-babel-minify";

export default {
    input: "./src/main.js",
    output: {
        name: "game",
        file: "./dist/js/game.js",
        format: "iife"
    },
    
    plugins: [
        minify({
            comments: false
        })
    ]
}