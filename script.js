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

myDirection = 'ROLL UNDER';

function addDelay(seconds) {
    for(a=0; a < seconds*2 ;a++) {
        actionArr.push('skip');
    }
}

function setDummyBet() {
    while(ele.betAmountInput.value!=0) {
        ele.btnBetInputHalf.click();
    }
    for(a=0;a<1;a++) {
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
                lastRollResult = ele.lastRollResult.innerText;
                console.log(lastRollResult);
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

