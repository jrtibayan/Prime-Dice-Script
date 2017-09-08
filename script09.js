/* Bet on SAME after 3 consecutive OPPOSITE */

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
            base: 5,
            dummy: 1,
            current: null
        },
        targetIncome: 0,
        zigZagCountBeforeBet: 3
    },

    stats: {
        rolls: [] // {direction, rollNumber}
    }
};

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
        console.log('last is: '+lastDirection+'\nbetting: ele.directionSpan.innerText');
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
        model.stats.rolls.push( parseFloat(ele.lastRollSpan.innerText) );
    },

    lastRollsZigZag: function() {
        okay = true;
        endIndex = model.stats.rolls.length-1; // 4
        //console.log('End: '+model.stats.rolls[endIndex]+ ' ' +endIndex);
        startIndex = endIndex-model.settings.zigZagCountBeforeBet; // 2
        //console.log('Start: '+model.stats.rolls[startIndex]+ ' ' + startIndex);
        indexBeforeZigZag = startIndex-1; // 1
        indexBeforeZigZag2 = startIndex-2; // 1

        if( mv.checkDirection(model.stats.rolls[indexBeforeZigZag] )==='MISS' ) {
            return false;
        }

        if( mv.checkDirection(model.stats.rolls[indexBeforeZigZag2] )==='MISS' ) {
            return false;
        }

        if( mv.checkDirection(model.stats.rolls[indexBeforeZigZag])===mv.checkDirection(model.stats.rolls[indexBeforeZigZag2]) ) {
            return false;
        }

        if( mv.checkDirection(model.stats.rolls[indexBeforeZigZag] )!==mv.checkDirection(model.stats.rolls[startIndex]) ) {
            return false;
        }

        lastDirection = mv.checkDirection(model.stats.rolls[startIndex]);
        for(a=startIndex+1;a<=endIndex;a++) {

            if(mv.checkDirection(model.stats.rolls[a])==='MISS') {
                return false;
            }

            if(lastDirection === mv.checkDirection(model.stats.rolls[a])) {
                return false;
            }
            else {
                lastDirection = mv.checkDirection(model.stats.rolls[a]);
            }
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

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};



function mainLoop() {
    console.log(model.actionArr[model.actionIndex]);
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
            mv.setSameDirection();

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
                    if( mv.iWin() ) {
                        mv.betClickCurrentReset();
                        mv.setBetting(false);
                    } else {
                        mv.betClickCurrentIncrease();
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
                mv.increaseActionIndex();
            }
        break;

    }
}

function stop() {
    clearTimeout(timer);
};

function start() {  // use a one-off timer
    model.actionArr.push('init');
    model.actionIndex = 0;
    timer = setInterval(mainLoop, 1000);
};

start();