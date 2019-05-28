// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const rollerState = cc.Enum({
    IDLE: 0,
    MOVE: 1,
    STOP: 2,
});

cc.Class({
    extends: cc.Component,

    properties: {
        symbolPrefab: {
            default: null,
            type: cc.Prefab,
        },

        symbolRow: {
            default: 0,
            type: cc.Integer,
            notify() {
                this.adjustIDEDisplaySymbols();
            },
        }, // 欄

        symbolColumn: {
            default: 0,
            type: cc.Integer,
            notify() {
                this.adjustIDEDisplaySymbols();
            },
        }, // 列


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isStartRoll = false;
        this.rollerState = rollerState.IDLE;
        this.symbolList = [];
        this.symbolList = this.node.children;
        this.symbolPositions = [];
        this.firstSymbolY = this.symbolList[0].y;
        this.moveSpacing = 0.1;
        this.totalMoveSpacing = 0;
        this.symbolMoveDownCounts = 20;
        this.changeSymbolCount = 0;
        this.symbolResult = [];
        this.symbolCounts = this.symbolRow * this.symbolColumn;
        this.symbolIndexCounts = this.getSymbolIndexCounts();
        this.closeAllSymbolActive();
    },

    start() {
        // this.initSymbol();
    },

    update(dt) {
        if (this.isStartRoll) {
            switch (this.rollerState) {
                /** 滾輪初始 */
                case rollerState.IDLE:
                    break;
                /** 滾輪滾動 */
                case rollerState.MOVE:
                    this.updateSymbolPosition();
                    this.setLastSymbolToFist();
                    if (this.changeSymbolCount >= this.symbolMoveDownCounts) {
                        this.rollerState = rollerState.STOP;
                        this.changeSymbolCount = 0;
                    }
                    break;
                /** 滾輪停止 */
                case rollerState.STOP:
                    this.isStartRoll = false;
                    this.rollerState = rollerState.IDLE;
                    this.adjustSymbolPosition();
                    this.setFirstSymbol();
                    // this.startSymbolAnime(this.dealSymbolResult(this.getCurrentSymbolResult(this.symbolRow)));
                    this.node.emit('rollerStop');
                    break;
                default:
                    break;
            }
        }
    },

    adjustIDEDisplaySymbols() {
        if (this.symbolRow <= 0 || this.symbolColumn <= 0) {
            return;
        }
        cc.log(`symbolRow: ${this.symbolRow}, symbolColumn: ${this.symbolColumn}`);
        this.fisrtSymbolX = -140;
        this.fisrtSymbolY = 280;
        this.symbolList = this.node.children;
        const symbolsSize = this.symbolList.length;
        for (let a = 0; a < symbolsSize; a += 1) {
            this.symbolList[a].destroy();
        }
        this.symbolList.length = 0;
        this.symbolList = [];
        const symbolMaxCounts = this.symbolRow * (this.symbolColumn + 2);
        let x = -140;
        let y = 280;
        cc.log(`symbolMaxCounts:${symbolMaxCounts}`);

        for (let b = 0; b < symbolMaxCounts; b += 1) {
            const symbolNode = cc.instantiate(this.symbolPrefab);
            this.node.addChild(symbolNode);
            this.symbolList.push(symbolNode);
        }
        cc.log(`childrenCount:${this.node.childrenCount}`);
        let count = 0;
        for (let i = 0; i < this.symbolColumn + 2; i += 1) {
            for (let j = 0; j < this.symbolRow; j += 1) {
                // cc.log(`count: ${count} x: ${x}, y: ${y}`);
                this.symbolList[count].setPosition(x, y);
                x += this.symbolList[count].width;
                count += 1;
            }
            x = this.fisrtSymbolX;
            y -= this.symbolList[0].height;
        }

        this.symbolCounts = this.symbolRow * this.symbolColumn;
        this.symbolIndexCounts = this.getSymbolIndexCounts();
    },

    closeAllSymbolActive() {
        this.symbolList.forEach((symbol) => {
            symbol.children.forEach((child) => {
                child.active = false;
            });
        });
    },

    getSymbolIndexCounts() {
        return this.symbolList[0].childrenCount;
    },

    /**
     * 初始 Symbol
     */
    initSymbol() {
        for (let i = 0; i < this.symbolList.length; i += 1) {
            if (i >= this.symbolRow && i < this.symbolResult.length + this.symbolRow) {
                this.setDisplaySymbol(this.symbolList[i], this.symbolResult[i - this.symbolRow]);
            }
            else {
                this.setDisplaySymbol(this.symbolList[i], this.getRandomSymbolIndex(this.symbolList[i].childrenCount));
            }
            this.symbolPositions[i] = this.symbolList[i].getPosition();
        }
    },

    /**
     * 取得隨機亂數
     * @param {Number} num 數值，ex.num: 6 get: 0 - 5
    */
    getRandomSymbolIndex(num) {
        return Math.floor(Math.random() * Math.floor(num));
    },

    /**
     * 開始滾動
     */
    startRolling() {
        this.isStartRoll = true;
        this.rollerState = rollerState.MOVE;
        this.setBlurSymbol();
    },

    /**
     * 設定 Symbol 為模糊圖
     */
    setBlurSymbol() {
        for (let i = 0; i < this.symbolList.length; i += 1) {
            for (let j = 0; j < this.symbolList[i].childrenCount; j += 1) {
                const symbolComponent = this.symbolList[i].children[j].getComponent('Symbol');
                this.symbolList[i].children[j].getComponent(cc.Sprite).spriteFrame = symbolComponent.blurSymbol;
            }
        }
    },

    /**
     * 設定 Symbol 為第一張圖
     */
    setFirstSymbol() {
        for (let i = 0; i < this.symbolList.length; i += 1) {
            for (let j = 0; j < this.symbolList[i].childrenCount; j += 1) {
                const symbolComponent = this.symbolList[i].children[j].getComponent('Symbol');
                this.symbolList[i].children[j].getComponent(cc.Sprite).spriteFrame = symbolComponent.fisrtSymbol;
            }
        }
    },

    /**
     * 變更 Symbol 位置 (下移: 高度 * 區間)
     */
    updateSymbolPosition() {
        for (let i = 0; i < this.symbolList.length; i += 1) {
            this.symbolList[i].setPosition(this.symbolList[i].x, this.symbolList[i].y - this.symbolList[i].height * this.moveSpacing);
        }
        this.totalMoveSpacing += this.moveSpacing;
    },

    /**
     * 將最後一個 Symbol 移至第一個位置
     */
    setLastSymbolToFist() {
        if (this.totalMoveSpacing >= 1) {
            for (let i = 0; i < this.symbolRow; i += 1) {
                const lastSymbol = this.symbolList.pop();
                lastSymbol.y = this.firstSymbolY;

                if (this.symbolResult.length > 0
                    && this.changeSymbolCount >= (this.symbolMoveDownCounts - this.symbolColumn - 1)) {
                    this.setDisplaySymbol(lastSymbol, this.symbolResult.pop());
                }
                else {
                    this.setDisplaySymbol(lastSymbol, this.getRandomSymbolIndex(lastSymbol.childrenCount));
                }

                this.symbolList.unshift(lastSymbol);
            }
            this.totalMoveSpacing = 0;
            this.changeSymbolCount += 1;
        }
    },

    /**
     * 設定要顯示的 Symbol
     * @param {Node} symbol Symbol 節點
     * @param {Number} index 開啟第 n 個子節點 (active)
     */
    setDisplaySymbol(symbol, index) {
        for (let i = 0; i < symbol.childrenCount; i += 1) {
            symbol.children[i].active = false;
        }

        const child = symbol.getChildByName(index.toString());
        child.active = true;
    },

    /**
    * 調整 Symbol 位置為初始位置，避免浮點數運算精確度問題而位置偏移
    */
    adjustSymbolPosition() {
        for (let i = 0; i < this.symbolList.length; i += 1) {
            this.symbolList[i].setPosition(this.symbolPositions[i]);
        }
    },

    /**
     * 開始 Symbol 動畫 (輪巡)
     */
    startSymbolAnime(symbolPositions) {
        for (let i = 0; i < this.symbolList.length; i += 1) {
            for (let j = 0; j < this.symbolList[i].childrenCount; j += 1) {
                if (this.symbolList[i].children[j].active === true) {
                    if (symbolPositions === undefined || symbolPositions.indexOf(i) === -1) {
                        const symbolComponent = this.symbolList[i].children[j].getComponent('Symbol');
                        this.symbolList[i].children[j].getComponent(cc.Sprite).spriteFrame = symbolComponent.fisrtSymbol;
                    }
                    else {
                        this.symbolList[i].children[j].getComponent(cc.Animation).play().wrapMode = cc.WrapMode.Loop;
                    }
                }
            }
        }
    },

    /**
     * 將 SpriteFrame 設為第一張圖示並停止 Symbol 動畫
     */
    stopSymbolAnime() {
        for (let i = 0; i < this.symbolList.length; i += 1) {
            for (let j = 0; j < this.symbolList[i].childrenCount; j += 1) {
                if (this.symbolList[i].children[j].active === true) {
                    this.symbolList[i].children[j].getComponent(cc.Animation).setCurrentTime(1);
                    this.symbolList[i].children[j].getComponent(cc.Animation).stop();
                }
            }
        }
    },

    /**
     * 設定 Symbol 結果
     * @param {ARRAY} symbols
     */
    setSymbolResult(symbols) {
        if (symbols) {
            this.symbolResult = symbols;
        }
    },

    getCurrentSymbolResult(row) {
        if (row === undefined) {
            row = 0;
        }
        const symbols = [];
        for (let i = 0 + row; i < this.symbolList.length - row; i += 1) {
            for (let j = 0; j < this.symbolList[i].childrenCount; j += 1) {
                if (this.symbolList[i].children[j].active === true) {
                    symbols.push(j);
                }
            }
        }

        return symbols;
    },
});
