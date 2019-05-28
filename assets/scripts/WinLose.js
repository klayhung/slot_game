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

    setSymboIndexList(indexCounts) {
        for (let i = 0; i < indexCounts; i += 1) {
            this.symbolIndexList.push(i);
        }

        this.symbolWinLoseList = this.symboIndexList.map((value, index) => ({
            index: value,
            isWin: false,
            positions: [],
            winScore: 0,
        }));
    },

    setsymbolOddsList(odds) {
        this.symbolOddsList = odds;
    },

    initWinlose(indexCounts, odds) {
        this.setSymboIndexList(indexCounts);
        this.setsymbolOddsList(odds);
    },

    resetSymbolWinLoseList() {
        this.symbolWinLoseList = this.symboIndexList.map((value, index) => ({
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
        const winSymbolIndexList = this.symboIndexList.filter((value) => {
            let rowCounts = 0;
            this.getSymbolPosOfRowList(symbolResult).forEach((positions) => {
                const result = positions.find(pos => symbolResult[pos] === value);
                if (result !== undefined) ++rowCounts;
            });
            return rowCounts === this.symbolRow;
        });
        cc.log(`winSymbolIndexList:${winSymbolIndexList}`);

        // const winSymbolIndexPosList = [];
        // winSymbolIndexList.forEach((value) => {
        //     symbolResult.forEach((symbl, pos) => {
        //         if (value === symbl) {
        //             winSymbolIndexPosList.push(pos + this.symbolRow);
        //         }
        //     });
        // });
        // cc.log(`winSymbolIndexPosList:${winSymbolIndexPosList}`);

        this.symbolWinLoseList.forEach((symbol) => {
            if (winSymbolIndexList.includes(symbol.index)) {
                symbol.isWin = true;

                let symbolCounts = 0;
                symbolResult.forEach((value, pos) => {
                    if (value === symbol.index) {
                        symbol.positions.push(pos + this.symbolRow);
                        ++symbolCounts;
                    }
                });

                symbol.winScore = totalBet * symbolCounts * this.symbolOddsList[symbol.index];
            }
        });
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

    getWinPositions() {
        let winPositions = [];
        this.symbolWinLoseList.forEach((symbol) => {
            if (symbol.isWin) {
                winPositions = winPositions.concat(symbol.positions);
            }
        });
        return winPositions;
    },
});
