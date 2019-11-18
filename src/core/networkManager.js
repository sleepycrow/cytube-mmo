export default class NetworkManager {

    constructor(){
        this.handlers = {
            pos: [],
            join: [],
            chatMsg: []
        };
    }

    setSocket(socket){
        this.socket = socket;
        this.socket.on("chatMsg", (data) => {
            try{
                if(data.msg.substr(0, 1) != "{") throw "nothing";

                var msgData = JSON.parse(data.msg);
                msgData.username = data.username;

                if(msgData.type && this.handlers[msgData.type])
                    this.dispatchEvent(msgData.type, msgData);
            }catch(e){
                data.msg = data.msg.replace(/title="([^"]+)"/gi, ">$1<");
                data.msg = data.msg.replace(/<([^>]+)?>/gi, "");
                this.dispatchEvent("chatMsg", data);
            }
        });
    }

    on(event, handler){
        if(!this.handlers[event]) throw "Non-existant event (" + event + ") requested!";

        this.handlers[event].push(handler);
    }

    dispatchEvent(event, data){
        if(!this.handlers[event]) throw "Non-existant event (" + event + ") requested!";

        for(var i = 0; i < this.handlers[event].length; i++){
            this.handlers[event][i](data);
        }
    }

    send(data){
        if(!this.socket) throw "No websocket client has been set!";

        this.socket.emit("chatMsg", {
            msg: JSON.stringify(data),
            meta: {}
        });
    }

}