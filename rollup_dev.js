const rollup = require('rollup');
const { terser } = require('rollup-plugin-terser');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const port = 10001;

// Options for Rollup.js
const inputOpts = {
    input: "./src/main.js",
    plugins: [terser()]
};
const outputOpts = {
    name: "game",
    file: "./dist/js/game.js",
    format: "iife"
};

// Set up the testing environment
console.log("Starting web server...");
const app = express();
const httpServer = http.Server(app);

app.use(express.static("dist"));

console.log("Starting socket server...");
const io = socketio(httpServer);
io.on("connect", function(socket){
    console.log("a user connected.");

    socket.on("login", function(data){
        console.log("a user has set his username to " + data);
        socket.username = data;
    });

    socket.on("chatMsg", function(data){
        if(socket.username){
            data.username = socket.username;
            console.log(data);
            io.emit("chatMsg", data);
        }
    });
});

httpServer.listen(port, function(){
    console.log("Both servers now listening on port :" + port);
});

// Then finally build the js bundle
async function build(){
    const bundle = await rollup.rollup(inputOpts);
    await bundle.write(outputOpts);
}

build();
