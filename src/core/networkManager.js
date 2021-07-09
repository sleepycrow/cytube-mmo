export default class NetworkManager {

    constructor(){
        this.onPacket = console.log;
    }

    setSocket(socket){
        this.socket = socket;
        this.socket.on("chatMsg", (data) => {
            try{
                if(data.msg.substr(0, 1) != "{") throw "nothing";

                var msgData = JSON.parse(data.msg);
                msgData.username = data.username;

                if(msgData.type)
                    this.onPacket(msgData.type, msgData);
            }catch(e){
                data.msg = data.msg.replace(/title="([^"]+)"/gi, ">$1<");
                data.msg = data.msg.replace(/<([^>]+)?>/gi, "");
                this.onPacket("chatMsg", data);
            }
        });
    }

    send(data){
        if(!this.socket) throw "No websocket client has been set!";

        this.socket.emit("chatMsg", {
            msg: JSON.stringify(data),
            meta: {}
        });
    }

}
