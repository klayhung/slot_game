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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.symbolIndexList = [];
        this.symbolWinLoseList = [];
        this.symbolOddsList = [];
    },

    start() {

    },

    setSymbolIndexList(indexCounts) {
        for (let i = 0; i < indexCounts; i += 1) {
            this.symbolIndexList.push(i);
        }

        this.symbolWinLoseList = this.symbolIndexList.map((value, index) => ({
            index: value,
            isWin: false,
            positions: [],
            winScore: 0,
        }));
    },

    setSymbolOddsList(odds) {
        this.symbolOddsList = odds;
    },

    initWinLose(indexCounts, odds) {
        this.setSymbolIndexList(indexCounts);
        this.setSymbolOddsList(odds);
    },

    resetSymbolWinLoseList() {
        this.symbolWinLoseList = this.symbolIndexList.map((value, index) => ({
            index: value,
            isWin: false,
            positions: [],
            winScore: 0,
        }));
    },

    getSymbolPosOfRowList(symbolResult, symbolRow) {
        const fisrtRowSymbolPosList = [];
        const symbolPosOfRowList = [];

        /** 取得第一行位置 */
        symbolResult.forEach((value, index) => {
            if (index === 0 || index % symbolRow === 0) {
                fisrtRowSymbolPosList.push(index);
            }
        });

        /** 取得以行排序的位置 */
        for (let j = 0; j < symbolRow; j += 1) {
            symbolPosOfRowList.push(fisrtRowSymbolPosList.map(val => val + j));
        }

        return symbolPosOfRowList;
    },

    setWinLose(totalBet, symbolResult, symbolRow) {
        this.resetSymbolWinLoseList();
        const symbolPosOfRowList = this.getSymbolPosOfRowList(symbolResult, symbolRow);
        const winSymbolIndexList = this.symbolIndexList.filter((value) => {
            let rowCounts = 0;
            symbolPosOfRowList.forEach((positions) => {
                const result = positions.find(pos => symbolResult[pos] === value);
                if (result !== undefined) ++rowCounts;
            });
            return rowCounts === symbolRow;
        });
        cc.log(`winSymbolIndexList:${winSymbolIndexList}`);

        this.symbolWinLoseList.forEach((symbol) => {
            if (winSymbolIndexList.includes(symbol.index)) {
                symbol.isWin = true;
                symbolResult.forEach((value, pos) => {
                    if (value === symbol.index) {
                        symbol.positions.push(pos);
                    }
                });

                const symbolCountOfRowList = [];
                symbolPosOfRowList.forEach((positions) => {
                    let countsOfRow = 0;
                    positions.forEach((pos) => {
                        if (symbol.positions.includes(pos)) {
                            ++countsOfRow;
                        }
                    });
                    symbolCountOfRowList.push(countsOfRow);
                });

                const symbolCounts = symbolCountOfRowList.reduce((first, second) => first * second);
                symbol.winScore = totalBet * symbolCounts * this.symbolOddsList[symbol.index];
            }
        });
        cc.log(`winSymbolIndexList:${JSON.stringify(this.symbolWinLoseList)}`);
    },

    getTotalWin() {
        let totalWin = 0;
        this.symbolWinLoseList.forEach((symbol) => {
            if (symbol.isWin) {
                totalWin += symbol.winScore;
            }
        });
        return totalWin;
    },

    getWinPositions(symbolRow) {
        let winPositions = [];
        this.symbolWinLoseList.forEach((symbol) => {
            if (symbol.isWin) {
                winPositions = winPositions.concat(symbol.positions);
            }
        });

        winPositions = winPositions.map(val => val + symbolRow);
        return winPositions;
    },
});
