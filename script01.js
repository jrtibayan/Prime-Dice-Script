/*
 * Bot Behavior
 *     Target is < 9.9 on x10 payout
 *     Auto bet 1 sat
 *     Wait for a certain number of loss
 *     When that is loss count reach that certain number stop betting 1
 *     Bet 16 and increase by 10 percent on loss
 *     Cut your losses after 10 loss
 *     If you win, repeat steps and bet 1 sat again
 */

/**************************************************
 *      BOT STATUS
 *      Behavior works perfectly
 *      but there is one bug
 *      on real bet, the starting amount is correct
 *      but on dummy bet, the starting amount should be 1
 *      and it is 1 but after clicking auto roll it becomes zer0
 *      ******** HELP PLEASE **********************
 **************************************************/

ele = {
    btnRoll : document.querySelector(".index__home__dice__wrap__cta.btn"),
    btnBetInputX2 : document.querySelector(".dice__control__content").children[2],
    btnBetInputHalf : document.querySelector(".dice__control__content").children[1],
    btnOnLossReset : document.querySelector(".index__home__dice__automated-switch").children[0].children[0].children[0].children[1].children[0].children[0],
    btnOnLossIncrease : document.querySelector(".index__home__dice__automated-switch").children[0].children[0].children[0].children[1].children[0].children[1],
    btnDirection : document.querySelector(".index__home__dice__card__bet-ui").children[1].children[1].children[0].children[0].children[0].children[1].children[0],
    btnManualBetting: document.querySelector(".index__home__dice__card__bet-ui").children[0].children[0].children[0].children[0],
    btnAutoBetting: document.querySelector(".index__home__dice__card__bet-ui").children[0].children[1].children[0].children[0],
    // OTHERS
    myBal : document.querySelector(".index__home__header__balance__btc").children[1],
    lastRollContainer : document.querySelector(".index__home__indicator__inner__number__roll"),
    lastRollResult : document.querySelector(".index__home__indicator__inner__number__roll").children[1],
    betAmountInput : document.getElementById("betSize")
};

actionArr = [];
actionIndex = null;
lastRollResult = null;
betting = false;
consecLost = 0;
waitForLoss = 24;
waitForWin = 10;

betX2Clicks = 0;
betX2ClicksDummy = 1;

myDirection = 'ROLL UNDER';

function addDelay(seconds) {
    for(a=0; a < seconds*2 ;a++) {
        actionArr.push('skip');
    }
}

function startBet(real) {
    if(real===true) {
        actionArr.push('set real bet');
        actionArr.push('skip');

        actionArr.push('on loss increase');
        actionArr.push('skip');

        betting = true;
    } else {
        //actionArr.push('set bet 0');
        //actionArr.push('set dummy amount');
        actionArr.push('set dummy bet');
        actionArr.push('skip');

        actionArr.push('on loss reset');
        actionArr.push('skip');

        betting = false;
    }
    actionArr.push('roll click');
    actionArr.push('wait for result');
}

function stop() {
    actionArr.push('roll click');
    actionArr.push('skip');
}

function startDummy() {
    startBet(false);
}

function startReal() {
    startBet(true);
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function setBet0() {
    while(ele.betAmountInput.value!=0) {
        ele.btnBetInputHalf.click();
    }
}

function setDummyBet() {
    setBet0();
    for(a=0;a<1;a++) {
        ele.btnBetInputX2.click();
    }
}

function setRealBet() {
    setBet0();
    for(a=0;a<5;a++) {
        ele.btnBetInputX2.click();
    }
}

function init() {
    // set to auto
    actionArr.push('set to auto');

    /* pay out will have to be set manually before script starts */

    // change direction to under
    if(ele.btnDirection.innerText.toUpperCase()!==myDirection) {
        actionArr.push('change direction');
    }

    /* set increase percentage manually before script starts */

    startDummy();
}

function mainLoop() {
    switch(actionArr[actionIndex]) {
        case 'wait for result':
            if( lastRollResult != ele.lastRollResult.innerText ) {
                // Roll Result
                lastRollResult = ele.lastRollResult.innerText;
                //console.log(lastRollResult);

                if(betting===false) {
                    // betting is false
                    if( hasClass( ele.lastRollContainer, 'is-negative') ) {
                    // dummy lost
                        console.log('dummy lost');
                        consecLost++;
                    } else {
                    //  dummy win
                        console.log('dummy win');
                        consecLost=0;
                    }
                    if(consecLost>=waitForLoss) {
                        consecLost=0;
                        stop();
                        startReal();
                        actionIndex++;
                    }
                }
                else {
                    // betting is true
                    if( hasClass( ele.lastRollContainer, 'is-negative') ) {
                        // loss
                        consecLost++;
                        if(consecLost>=waitForWin) {
                            //console.log("quiting... restart dummy bet");
                            //console.log('');
                            consecLost = 0;
                            stop();
                            startDummy();
                            actionIndex++;
                        }
                    }
                    else {
                        // win
                        //console.log("win2");
                        //console.log('');
                        //console.log("restart dummy bet");
                        consecLost=0;
                        stop();
                        startDummy();
                        actionIndex++;
                    }
                }
            }
        break;

        case 'init':
            console.log(actionArr[actionIndex]);
            init();
            actionIndex++;
        break;

        case 'set dummy bet':
            console.log(actionArr[actionIndex]);
            setDummyBet();
            actionIndex++;
        break;

        case 'set real bet':
            console.log(actionArr[actionIndex]);
            setRealBet();
            actionIndex++;
        break;

        case 'on loss reset':
            console.log(actionArr[actionIndex]);
            ele.btnOnLossReset.click();
            actionIndex++;
        break;
        case 'on loss increase':
            console.log(actionArr[actionIndex]);
            ele.btnOnLossIncrease.click();
            actionIndex++;
        break;
        case 'change direction':
            console.log(actionArr[actionIndex]);
            ele.btnDirection.click();
            actionIndex++;
        break;
        case 'set to auto':
            console.log(actionArr[actionIndex]);
            ele.btnAutoBetting.click();
            actionIndex++;
        break;
        case 'set to manual':
            console.log(actionArr[actionIndex]);
            ele.btnManualBetting.click();
            actionIndex++;
        break;
        case 'roll click':
            console.log(actionArr[actionIndex]);
            ele.btnRoll.click();
            actionIndex++;
        break;
        case 'skip':
            console.log(actionArr[actionIndex]);
            actionIndex++;
        break;
        /*
        case 'set bet 0':
            console.log(actionArr[actionIndex]);
            while(ele.betAmountInput.value!=0) {
                ele.btnBetInputHalf.click();
            }
            betX2Clicks = 0;
            actionIndex++;
        break;
        case 'set dummy amount':
            console.log(actionArr[actionIndex]);
            if(betX2Clicks < betX2ClicksDummy) {
                ele.btnBetInputX2.click();
                betX2Clicks++;
                actionIndex++;
            }
        break;
        */
    }
}

actionArr.push('init');
actionIndex = 0;

myInterval = setInterval(mainLoop, 500);

