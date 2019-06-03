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
        userID: 0,
        userName: '',
        userCredit: 0,

        userIDDisplay: {
            default: null,
            type: cc.Label,
        },

        userNameDisplay: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    start() {

    },

    setUserInfo(userInfo) {
        this.userID = userInfo.user_id;
        this.userName = userInfo.user_name;
        this.userCredit = userInfo.user_point;
        this.userIDDisplay.string = `user id : ${userInfo.user_id}`;
        this.userNameDisplay.string = `user name : ${userInfo.user_name}`;
    },

    setCredit(credit) {
        this.userCredit = credit;
    },

    addCredit(credit) {
        this.userCredit += credit;
    },
});
