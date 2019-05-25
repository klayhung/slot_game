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

        rollerNode: {
            default: null,
            type: cc.Node,
        },

        scoreNode: {
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
        this.rollerNode.on('rollerStop', this.rollerStopCB, this);
        this.scoreNode.on('scoreStop', this.scoreStopCB, this);
        this.netNode.on('receiveServerMessage', this.receiveServerMessageCB, this);
    },

    update(dt) {},

    /**
     * 按鈕 Spin 觸發
     */
    onSpin() {
        this.buttonNode.getComponent(cc.Button).interactable = false; // 禁能
        this.rollerNode.getComponent('Roller').startRolling();
        this.netNode.getComponent('Net').sendMessage('SlotSpin', { symbolCounts: 3, symbolIndexCounts: 5 });
    },

    /**
     * 滾輪停止後跑表
     */
    rollerStopCB() {
        this.scoreNode.getComponent('Score').startRunScore();
    },

    /**
     * 跑表後停止滾輪動畫
     */
    scoreStopCB() {
        this.buttonNode.getComponent(cc.Button).interactable = true;
        this.rollerNode.getComponent('Roller').stopSymbolAnime();
    },

    /**
     * 處理 Server 傳來的封包
     * @param {JSON} msg ex.{"type":"SlotSpin","message":{"symbols":[1,1,1]}}
     */
    receiveServerMessageCB(msg) {
        if (msg) {
            const pkg = JSON.parse(msg);
            switch (pkg.type) {
                case 'SlotSpin':
                    cc.log(pkg.message.symbols);
                    this.rollerNode.getComponent('Roller').setSymbolResult(pkg.message.symbols);
                    break;
                default:
                    break;
            }
        }
    },
});
