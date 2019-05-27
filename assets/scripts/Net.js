// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const socket = require('WebSocket.js');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        //socket.connect('ws://127.0.0.1:8080', this.onMessageCB.bind(this));
    },

    connect(url){
        socket.connect(url, 
            this.onOpenCB.bind(this), 
            this.onMessageCB.bind(this));
    },

    /**
     * 收 web sockect 收到訊息通知，並轉發 event
     * @param {String} msg
     */
    onOpenCB(msg) {
        console.log(`Net: ${msg}`);
        this.node.emit('receiveServerConnected', msg);
    },

    /**
     * 收 web sockect 收到訊息通知，並轉發 event
     * @param {String} msg
     */
    onMessageCB(msg) {
        console.log(`Net: ${msg}`);
        this.node.emit('receiveServerMessage', msg);
    },

    /**
     * 送給 Server 的封包
     * @param {String} type 封包名稱
     * @param {String} msg 封包內容
     */
    sendMessage(type, msg) {
        socket.send_data(JSON.stringify({
            type: `${type}`,
            message: msg,
        }));
    },
});
