// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        buttonNode: {
            default: null,
            type: cc.Node,
        },

        netNode: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.netNode.on('receiveServerConnected', this.receiveServerConnected, this);
        this.netNode.on('receiveServerMessage', this.receiveServerMessageCB, this);
    },

    start() {

    },

    inputUserNameEnded(editbox, customEventData) {
        this.userName = editbox.string;
    },

    onLogin() {
        this.buttonNode.getComponent(cc.Button).interactable = false; // 禁能
        this.netNode.getComponent('Net').connect('ws://127.0.0.1:8080');
    },

    receiveServerConnected(msg) {
        this.netNode.getComponent('Net').sendMessage('Login', { userName: this.userName });
    },

    /**
     * 處理 Server 傳來的封包
     * @param {JSON} msg ex.{"type":"Login","message":{"symbols":[1,1,1]}}
     */
    receiveServerMessageCB(msg) {
        if (msg) {
            const pkg = JSON.parse(msg);
            switch (pkg.type) {
                case 'Login':
                    cc.log(JSON.stringify(pkg.message));
                    cc.director.loadScene('game');
                    break;
                default:
                    break;
            }
        }
    },
});
