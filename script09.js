/* Bet on SAME after 3 consecutive OPPOSITE */

/*

    test:
    9/10/2017 bet:256 balance: 30,000 -> 46,736 highestOpposite: 8 highestSame: 4
    9/11/2017 bet:4096 balance: 1,000,000 -> 1,965,000 -> 96%
    9/12/2017 lost 1,000,000 using Same Pattern bet set to 4,000

    Same:
        HighestOppo: 10
        HighestSame: 8
    ZigZag
        HighestOppo: 8
        HighestSame: 1

    todo:
        record more stat to help decide on bet amount, balance and lStreakLimit
        add settings to set increase on loss to true or false

    idea:
        make lower bets
        then on
        add another variable originalBaseClick
            increase baseClick whever


 */

ele = {
    betBtn: document.querySelector(".index__home__dice__wrap__cta.btn"),
    halfBtn: document.querySelector(".dice__control__content").children[1],
    x2Btn: document.querySelector(".dice__control__content").children[2],
    betInput: document.getElementById("betSize"),
    lastRollContainer: document.querySelector(".index__home__indicator__inner__number__roll"),
    lastRollSpan: document.querySelector(".index__home__indicator__inner__number__roll").children[1],
    directionSpan: document.querySelector(".index__home__dice__card__bet-ui").children[1].children[1].children[0].children[0].children[0].children[1].children[0],
    myBal: document.querySelector(".index__home__header__balance__btc").children[1],
    getLastRollResult: document.querySelector(".index__game-stats__table").children[1].children[1].children[0]
};


model = {
    actionArr: [],
    actionIndex: null,
    lastRollResult: null,
    currentConsecLoss: null,
    betting: false,

    settings: {
        betClicks: {
            base: 13,
            dummy: 0,
            current: null
        },
        patternZigZag: false,
        targetIncome: 0,
        zigZagCountBeforeBet: 3
    },

    stats: {
        rolls: [], // {direction, rollNumber}
        realBetSameCount: 0,
        realBetOppositeCount: 0,
        realBetMissCount: 0,
        same: {
            win: 0,
            loss: 0,
            lossStreak: 0,
            winStreak: 0,

            miss: 0,
            same: 0,
            opposite: 0,

            missStreak: 0,
            sameStreak: 0,
            oppositeStreak: 0,

            highestMiss: 0,
            highestSame: 0,
            highestOpposite: 0
        },
        zigzag: {
            win: 0,
            loss: 0,
            lossStreak: 0,
            winStreak: 0,

            miss: 0,
            same: 0,
            opposite: 0,

            missStreak: 0,
            sameStreak: 0,
            oppositeStreak: 0,

            highestMiss: 0,
            highestSame: 0,
            highestOpposite: 0
        }
    }
};

wStreakCounter = 0;
lStreakCounter = 0;
wStreak = 0;
lStreak = 0;

helper = {

};

mv = {
    setRandomDirection: function () {
        if(mv.getRandomInt(0,1)) {
            ele.directionSpan.click();
        }
    },

    setSameDirection: function() {
        lastDirection = mv.checkDirection(model.stats.rolls[model.stats.rolls.length-1]);
        if(ele.directionSpan.innerText !== lastDirection) {
            ele.directionSpan.click();
        }
        //console.log('last is: '+lastDirection+'\nbetting same:'+ele.directionSpan.innerText);
    },

    setOppositeDirection: function() {
        lastDirection = mv.checkDirection(model.stats.rolls[model.stats.rolls.length-1]);
        if(ele.directionSpan.innerText === lastDirection) {
            ele.directionSpan.click();
        }
        console.log('last is: '+lastDirection+'\nbetting opposite:'+ele.directionSpan.innerText);
    },

    setAmountZero: function () {
        for(a=0;a<100;a++) {
            ele.halfBtn.click();
        }
    },

    setDummyAmount: function () {
        mv.setAmountZero();
        for(a=0;a<model.settings.betClicks.dummy;a++) {
            ele.x2Btn.click();
        }
    },
    setDummyClick: function(num) {
        model.settings.betClicks.dummy = num;
    },

    setBaseClick: function(num) {
        model.settings.betClicks.base = num;
    },

    setBetAmount: function () {
        mv.setAmountZero();
        for(a=0;a<model.settings.betClicks.current;a++) {
            ele.x2Btn.click();
        }
    },

    increaseActionIndex: function () {
        model.actionIndex++;
    },

    updateLastRollResult: function() {
        model.lastRollResult = ele.lastRollSpan.innerText;
    },

    newRollFound: function () {
        return (model.lastRollResult != ele.lastRollSpan.innerText);
    },

    recordRoll: function () {
        // record the roll
        model.stats.rolls.push( parseFloat(ele.lastRollSpan.innerText) );

/*
        lastRollIndex = model.stats.rolls.length-1;
        // increase which direction it is in
        if( mv.checkDirection( model.stats.rolls[lastRollIndex] )==='MISS' ) {
            model.stats.realBetSameCount++;
        } else if() {

        }
*/

    },

    lastRollsZigZag: function() {

        if(model.settings.patternZigZag===true) {
            // 1, 91, 91, 1, 91, 1
            endIndex = model.stats.rolls.length-1; // 4
            //console.log('End: '+model.stats.rolls[endIndex]+ ' ' +endIndex);
            startIndex = endIndex-model.settings.zigZagCountBeforeBet; // 2
            //console.log('Start: '+model.stats.rolls[startIndex]+ ' ' + startIndex);
            indexBeforeZigZag = startIndex-1; // 1
            indexBeforeZigZag2 = startIndex-2; // 1

            if( mv.checkDirection( model.stats.rolls[indexBeforeZigZag] )==='MISS' ) {
                //console.log('MISS FOUND1');
                return false;
            }

            if( mv.checkDirection(model.stats.rolls[indexBeforeZigZag2] )==='MISS' ) {
                //console.log('MISS FOUND2');
                return false;
            }

            if( mv.checkDirection(model.stats.rolls[indexBeforeZigZag])===mv.checkDirection(model.stats.rolls[indexBeforeZigZag2]) ) {
                //console.log('index before zigzag === to zigzag2');
                return false;
            }

            if( mv.checkDirection(model.stats.rolls[indexBeforeZigZag] )!==mv.checkDirection(model.stats.rolls[startIndex]) ) {
                //console.log('index before zigzag != to start');
                return false;
            }

            lastDirection = mv.checkDirection(model.stats.rolls[startIndex]);
            for(a=startIndex+1;a<=endIndex;a++) {

                if(mv.checkDirection(model.stats.rolls[a])==='MISS') {
                    //console.log('MISS FOUND3');
                    return false;
                }

                if(lastDirection === mv.checkDirection(model.stats.rolls[a])) {
                    return false;
                }
                else {
                    lastDirection = mv.checkDirection(model.stats.rolls[a]);
                }
            }
        }
        else {
            lastIndex = model.stats.rolls.length-1;
            startOfSame = lastIndex-4;
            endOfSame = lastIndex-1 ;

            if( mv.checkDirection(model.stats.rolls[startOfSame] )==='MISS' ) return false;
            if( mv.checkDirection(model.stats.rolls[lastIndex] )==='MISS' ) return false;

            lastDirection = mv.checkDirection(model.stats.rolls[startOfSame]);
            for(a=startOfSame+1;a<=endOfSame;a++) {
                if(mv.checkDirection(model.stats.rolls[a])!==lastDirection) return false;
                lastDirection = mv.checkDirection(model.stats.rolls[a]);
            }

            if(mv.checkDirection(model.stats.rolls[lastIndex])===mv.checkDirection(model.stats.rolls[endOfSame]) ) return false;
        }

        return true;
    },

    setBetting: function ( bo ) {
        model.betting = bo;
    },

    getLastRollIncome: function() {
        return parseFloat(ele.lastRollIncome.innerText);
    },

    getLastRollResult: function() {

        result = {};
        result.income = parseFloat(ele.lastRollResult.children[7].innerText);
        if(result.income)
        result.winLoss = (result.income>0)
        return parseFloat(ele.lastRollIncome.innerText);
    },

    checkDirection: function( roll ) {
        if( roll < 49.50 )
            return 'ROLL UNDER';
        else if(roll > 50.49)
            return 'ROLL OVER';
        else
            return 'MISS';
    },

    betClickCurrentReset: function() {
        model.settings.betClicks.current = model.settings.betClicks.base;
    },

    betClickCurrentIncrease: function() {
        model.settings.betClicks.current++;
    },

    delay: function(n) {
        for(a=0;a<n;a++) {
            model.actionArr.push('delay');
        }
    },

    hasClass: function(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    },

    iWin: function() {
        return (!mv.hasClass(ele.lastRollContainer, 'is-negative'));
    },

    increaseWinCount: function() {
        if(model.settings.patternZigZag===true) {
            // zigzag
            model.stats.zigzag.win++;
            console.log('win: ' + model.stats.zigzag.win + ' loss: '+model.stats.zigzag.loss);
        } else {
            // same
            model.stats.same.win++;
            console.log('win: ' + model.stats.same.win + ' loss: '+model.stats.same.loss);
        }
    },

    increaseLossCount: function() {
        if(model.settings.patternZigZag===true) {
            // zigzag
            model.stats.zigzag.loss++;
            console.log('win: ' + model.stats.zigzag.win + ' loss: '+model.stats.zigzag.loss);
        } else {
            // same
            model.stats.same.loss++;
            console.log('win: ' + model.stats.same.win + ' loss: '+model.stats.same.loss);
        }
    },

    increaseDirectionCount: function() {

        if(model.settings.patternZigZag===true) {
            pattern = 'zigzag';
        } else {
            pattern = 'same';
        }

        lastDirection = mv.checkDirection(model.stats.rolls[model.stats.rolls.length-1]);
        directionBeforeLast = mv.checkDirection(model.stats.rolls[model.stats.rolls.length-2]);

        if(lastDirection==='MISS') {
            model.stats[pattern].miss++;

            model.stats[pattern].missStreak++;
            model.stats[pattern].sameStreak = 0;
            model.stats[pattern].oppositeStreak = 0;

            if(model.stats[pattern].missStreak>model.stats[pattern].highestMiss) {
                model.stats[pattern].highestMiss = model.stats[pattern].missStreak;
            }
        } else if(lastDirection === directionBeforeLast) {
            model.stats[pattern].same++;

            model.stats[pattern].missStreak = 0;
            model.stats[pattern].sameStreak++;
            model.stats[pattern].oppositeStreak = 0;

            if(model.stats[pattern].sameStreak>model.stats[pattern].highestSame) {
                model.stats[pattern].highestSame = model.stats[pattern].sameStreak;
            }
        } else {
            model.stats[pattern].opposite++;

            model.stats[pattern].missStreak = 0;
            model.stats[pattern].sameStreak = 0;
            model.stats[pattern].oppositeStreak++;

            if(model.stats[pattern].oppositeStreak>model.stats[pattern].highestOpposite) {
                model.stats[pattern].highestOpposite = model.stats[pattern].oppositeStreak;
            }
        }
    },

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};



function mainLoop() {
    //console.log(model.actionArr[model.actionIndex]);
    switch(model.actionArr[model.actionIndex]) {
        case 'init':
            console.log('initializing script...');
            console.log('Strategy: Bet on SAME after n OPPOSITE');
            console.log('On Loss: Double Bet Amount');
            console.log('On Win : Back to Base Amount');

            mv.betClickCurrentReset();
            mv.updateLastRollResult();

            for(a=0;a<3;a++) {
                model.actionArr.push('set dummy bet');
                model.actionArr.push('click bet');
                model.actionArr.push('wait new result');
            }

            mv.increaseActionIndex(); // move to next action
        break;

        case 'set real bet':
            mv.setBetAmount();
            if(model.settings.patternZigZag===true) {
                mv.setSameDirection();
            } else {
                //mv.setSameDirection();
                mv.setOppositeDirection();
            }

            mv.increaseActionIndex(); // move to next action
        break;

        case 'set dummy bet':
            mv.setDummyAmount(); // set dummy amount
            mv.setRandomDirection(); // set random direction

            mv.increaseActionIndex(); // move to next action
        break;

        case 'click bet':
            ele.betBtn.click();
            mv.increaseActionIndex(); // move to next action
        break;

        case 'delay':
            mv.increaseActionIndex(); // move to next action
        break;

        case 'wait new result':
            if( mv.newRollFound() ) {
                mv.updateLastRollResult();
                mv.recordRoll();

                if( model.betting ) {
                    mv.increaseDirectionCount();
                    if( mv.iWin() ) {
                        lStreakCounter = 0;
                        wStreakCounter++;
                        if(wStreak<wStreakCounter) wStreak = wStreakCounter;

                        console.log('won');
                        mv.increaseWinCount();
                        mv.betClickCurrentReset();
                        mv.setBetting(false);
                    } else {
                        wStreakCounter = 0;
                        lStreakCounter++;
                        if(lStreak<lStreakCounter) lStreak = lStreakCounter;

                        console.log('lost');
                        mv.increaseLossCount();
                        mv.betClickCurrentIncrease();
                        mv.setBetting(false);
                    }
                } else {
                    if( mv.lastRollsZigZag() ) {
                        mv.setBetting(true);
                    }
                }

                if(model.actionIndex+1===model.actionArr.length) {
                    if( model.betting ) {
                        model.actionArr.push('set real bet');
                    }
                    else {
                        model.actionArr.push('set dummy bet');
                    }
                    model.actionArr.push('click bet');
                    model.actionArr.push('wait new result');
                }

                if(model.actionArr.length>100) {
                    for(a=0;a<10;a++)
                        model.actionArr.shift();
                    model.actionIndex-=10;
                }

                mv.increaseActionIndex();
            }
        break;

    }
}

function stop() {
    clearTimeout(timer);
};

function loop() {
    mainLoop();
}

function start() {  // use a one-off timer
    model.actionArr.push('init');
    model.actionIndex = 0;
    timer = setInterval(loop, 1000);
};

start();