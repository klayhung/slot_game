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
        creditDisplay: {
            default: null,
            type: cc.Label,
        },

        curCredit: 1000,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.targetCredit = this.curCredit;
    },

    update(dt) {},

    setCredit(credit) {
        this.curCredit = credit;
    },

    updateCreditDisplay() {
        this.creditDisplay.string = `${this.curCredit}`;
    },

    /**
     * 設定分數跑表 Action
     */
    setRunCreditAction() {
        this.node.stopAllActions();
        const callback = cc.callFunc(this.onRunCredit, this);
        const delay = cc.delayTime(0.03);
        return cc.repeatForever(cc.sequence(callback, delay));
    },

    /**
     * 開始分數跑表 Action
     */
    startRunCredit(credit) {
        this.targetCredit += credit;
        this.node.runAction(this.setRunCreditAction());
    },

    /**
     * 停止分數跑表 Action
     */
    stopRunCredit() {
        this.node.stopAllActions();
    },

    /**
     * 分數跑表，分數跑到目標值後停止並發事件
     */
    onRunCredit() {
        if (this.curCredit === this.targetCredit) {
            this.stopRunCredit();
            this.node.emit('creditStop');
        }
        else {
            const spacingNumber = 1;
            this.curCredit += spacingNumber;
            this.creditDisplay.string = `${this.curCredit}`;
        }
    },
});
