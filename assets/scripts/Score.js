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
        scoreDisplay: {
            default: null,
            type: cc.Label,
        },

        curScore: 0,
        increaseScore: 100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.targetScore = this.curScore;
    },

    update(dt) {},

    /**
     * 設定分數跑表 Action
     */ 
    setRunScoreAction() {
        this.node.stopAllActions();
        const callback = cc.callFunc(this.onRunScore, this);
        const delay = cc.delayTime(0.03);
        return cc.repeatForever(cc.sequence(callback, delay));
    },

    /**
     * 開始分數跑表 Action
     */
    startRunScore() {
        this.targetScore += this.increaseScore;
        this.node.runAction(this.setRunScoreAction());
    },

    /**
     * 停止分數跑表 Action
     */
    stopRunScore() {
        this.node.stopAllActions();
    },

    /**
     * 分數跑表，分數跑到目標值後停止並發事件
     */
    onRunScore() {
        if (this.curScore === this.targetScore) {
            this.stopRunScore();
            this.node.emit('scoreStop');
        }
        else {
            const spacingNumber = 1;
            this.curScore += spacingNumber;
            this.scoreDisplay.string = `${this.curScore}`;
        }
    },
});
