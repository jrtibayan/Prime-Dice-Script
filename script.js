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
waitForLoss = 10;
waitForLoss = 10;

myDirection = 'ROLL UNDER';

function addDelay(seconds) {
    for(a=0; a < seconds*2 ;a++) {
        actionArr.push('skip');
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function setDummyBet() {
    while(ele.betAmountInput.value!=0) {
        ele.btnBetInputHalf.click();
    }
    for(a=0;a<1;a++) {
        ele.btnBetInputX2.click();
    }
}

function setRealBet() {
    while(ele.betAmountInput.value!=0) {
        ele.btnBetInputHalf.click();
    }
    for(a=0;a<5;a++) {
        ele.btnBetInputX2.click();
    }
}

function init() {
    // set to auto
    actionArr.push('set to auto');

    // set dummy bet amount
    actionArr.push('set dummy bet');

    /* pay out will have to be set manually before script starts */

    // change direction to under
    if(ele.btnDirection.innerText.toUpperCase()!==myDirection) {
        actionArr.push('change direction');
    }

    /* set increase percentage manually before script starts */

    // set on loss to reset bet
    actionArr.push('on loss reset');

    actionArr.push('roll click');

    actionArr.push('wait for result');
}

function mainLoop() {
    switch(actionArr[actionIndex]) {
        case 'wait for result':
            if( lastRollResult != ele.lastRollResult.innerText ) {
                // Roll Result
                lastRollResult = ele.lastRollResult.innerText;
                //console.log(lastRollResult);

                if(betting===false) {
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

                        // stop rolling
                        actionArr.push('roll click');
                        actionArr.push('skip');

                        // set real betInput
                        actionArr.push('set real bet');
                        actionArr.push('skip');


                        //set increase percent
                        //actionArr.push('on loss increase');
                        //actionArr.push('skip');

                        //console.log("start auto");
                        //betting = true;
                        //actionArr.push('roll click');
                        //actionArr.push('wait for result');

                        actionIndex++;
                    }

                }
                else {
                    if( hasClass( ele.lastRollContainer, 'is-negative') ) {
                    // loss
                        consecLost++;
                        if(consecLost>=waitForWin) {
                            console.log("quiting... restart dummy bet");
                            console.log('');
                            actionArr.push("click bet");
                            betting=false;
                            actionArr.push("set dummy");
                            actionArr.push("skip");
                            actionArr.push("click bet");
                            actionArr.push("wait new result");
                            consecLost=0;
                            actionIndex++;
                        }
                    } else {
                    // win
                        console.log("win2");
                        console.log('');
                        console.log("restart dummy bet");
                        actionArr.push("click bet");
                        betting=false;
                        actionArr.push("set dummy");
                        actionArr.push("skip");
                        actionArr.push("click bet");
                        actionArr.push("wait new result");
                        actionIndex++;
                        consecLost=0;
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

        case 'set to auto':
            console.log(actionArr[actionIndex]);
            ele.btnAutoBetting.click();
            actionIndex++;
        break;

        case 'on loss reset':
            console.log(actionArr[actionIndex]);
            ele.btnOnLossReset.click();
            actionIndex++;
        break;

        case 'on loss increase':
            ele.btnOnLossIncrease.click();
            actionIndex++;
        break;

        case 'change direction':
            console.log(actionArr[actionIndex]);
            ele.btnDirection.click();
            actionIndex++;
        break;
        case 'set to manual':
            console.log(actionArr[actionIndex]);
            ele.btnManualBetting.click();
            actionIndex++;
        break;
        case 'roll click':
            ele.btnRoll.click();
            actionIndex++;
        break;
        case 'skip':
            console.log(actionArr[actionIndex]);
            actionIndex++;
        break;
    }
}

actionArr.push('init');
actionIndex = 0;

myInterval = setInterval(mainLoop, 500);

