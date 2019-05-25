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
        // symbolRow: 1,
        // symbolColumn: 3,

        // symbolRowSpacing: 0,
        // symbolColumnSpacing: 0,

        // symbolInitPosition: {
        //     default: cc.v2(0, 0),
        // },

        // rollDuration: 0,

        fisrtSymbol: {
            default: null,
            type: cc.SpriteFrame,
        },

        blurSymbol: {
            default: null,
            type: cc.SpriteFrame,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },

    update(dt) {
    },

});
