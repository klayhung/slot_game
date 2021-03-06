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

        creditNode: {
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

        userNode: {
            default: null,
            type: cc.Node,
        },

        winloseNode: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.totalBet = 100;
        this.totalWin = 0;
        this.rollerNode.on('rollerStop', this.rollerStopCB, this);
        this.creditNode.on('creditStop', this.creditStopCB, this);
        // this.scoreNode.on('scoreStop', this.scoreStopCB, this);
        const user = cc.find('user');
        if (user !== null) {
            this.userNode = user;
            this.userNode.opacity = 255;
        }

        const net = cc.find('net');
        if (net !== null) {
            this.netNode = net;
            this.netNode.on('receiveServerMessage', this.receiveServerMessageCB, this);
        }
    },

    start() {
        const roller = this.rollerNode.getComponent('Roller');
        this.symbolCounts = roller.symbolCounts;
        this.symbolIndexCounts = roller.symbolIndexCounts;
        this.symbolRow = roller.symbolRow;

        const userComponent = this.userNode.getComponent('User');
        this.creditNode.getComponent('Credit').setCredit(userComponent.userCredit);
        this.creditNode.getComponent('Credit').updateCreditDisplay();

        this.netNode.getComponent('Net').sendMessage('GameInit', { userName: userComponent.userName });
    },

    /**
     * 按鈕 Spin 觸發
     */
    onSpin() {
        this.buttonNode.getComponent(cc.Button).interactable = false; // 禁能
        this.rollerNode.getComponent('Roller').startRolling();
        this.netNode.getComponent('Net').sendMessage('SlotSpin', { totalBet: this.totalBet });
    },

    /**
     * 滾輪停止後跑表
     */
    rollerStopCB() {
        // this.scoreNode.getComponent('Score').startRunScore();
        if (this.totalWin > 0) {
            const winPositions = this.winloseNode.getComponent('WinLose').getWinPositions(this.symbolRow);
            this.rollerNode.getComponent('Roller').startSymbolAnime(winPositions);
            this.creditNode.getComponent('Credit').startRunCredit(this.totalWin);
            this.userNode.getComponent('User').addCredit(this.totalWin);
        }
        else {
            this.buttonNode.getComponent(cc.Button).interactable = true;
        }
    },

    /**
     * 跑表後停止滾輪動畫
     */
    creditStopCB() {
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
            cc.log(`Game receive: ${pkg.type}`);
            switch (pkg.type) {
                case 'GameInit':
                    this.rollerNode.getComponent('Roller').setSymbolResult(pkg.message.symbols);
                    this.rollerNode.getComponent('Roller').initSymbol();
                    this.winloseNode.getComponent('WinLose').initWinLose(this.symbolIndexCounts, pkg.message.odds);
                    break;
                case 'SlotSpin':
                    this.totalWin = pkg.message.totalWin;
                    this.userNode.getComponent('User').setCredit(pkg.message.credit);
                    this.creditNode.getComponent('Credit').setCredit(pkg.message.credit);
                    this.creditNode.getComponent('Credit').updateCreditDisplay();
                    this.rollerNode.getComponent('Roller').setSymbolResult(pkg.message.symbols);
                    this.winloseNode.getComponent('WinLose').setWinLose(this.totalBet, pkg.message.symbols, this.symbolRow);
                    break;
                default:
                    break;
            }
        }
    },

    /**
     * 玩家按登出
     */
    onLogout() {
        this.buttonNode.getComponent(cc.Button).interactable = false; // 禁能
        const user = this.userNode.getComponent('User');
        this.netNode.getComponent('Net').sendMessage('Logout', {
            userID: user.userID,
            userName: user.userName,
            userPoint: user.userCredit,
        });
        // this.userNode.destroy();
        // this.netNode.destroy();
        cc.game.removePersistRootNode(this.userNode);
        cc.game.removePersistRootNode(this.netNode);
        cc.director.loadScene('login');
    },
});
