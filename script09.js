/* Bet on SAME after 3 consecutive OPPOSITE */

ele = {
    betBtn: document.querySelector(".index__home__dice__wrap__cta.btn"),
    halfBtn: document.querySelector(".dice__control__content").children[1],
    x2Btn: document.querySelector(".dice__control__content").children[2],
    betInput: document.getElementById("betSize"),
    lastRollContainer: document.querySelector(".index__home__indicator__inner__number__roll"),
    lastRollSpan: document.querySelector(".index__home__indicator__inner__number__roll").children[1],
    directionSpan: document.querySelector(".index__home__dice__card__bet-ui").children[1].children[1].children[0].children[0].children[0].children[1].children[0],
    myBal: document.querySelector(".index__home__header__balance__btc").children[1]
};

records = {
    rolls: []
};



model = {
    actionArr: [],
    actionIndex: null,
    lastRollResult: null,

    settings: {
        betClicks: {
            base: 5,
            dummy: 1
        },
        targetIncome: 0
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
    setBaseAmount: function () {
        mv.setAmountZero();
        for(a=0;a<model.settings.betClicks.base;a++) {
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

    delay: function(n) {
        for(a=0;a<n;a++) {
            model.actionArr.push('delay');
        }
    },

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};



function mainLoop() {
    switch(model.actionArr[model.actionIndex]) {
        case 'init':
            console.log('initializing script...');
            console.log('Strategy: Bet on SAME after n OPPOSITE');
            console.log('On Loss: Double Bet Amount');
            console.log('On Win : Back to Base Amount');

            mv.updateLastRollResult();

            for(a=0;a<3;a++) {
                model.actionArr.push('set dummy bet');
                model.actionArr.push('click bet');
                model.actionArr.push('wait new result');
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


                if(model.actionIndex+1===model.actionArr.length) {
                    lastRollIndex = model.stats.rolls.length-1;
                    if( lastRollsZigZagOver() || lastRollsZigZagUnder() ) {

                    } else {
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