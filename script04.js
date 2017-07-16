/*
 * Bot Behavior
 *     set to x1.1 Over
 *     wait for 1 loss when hit is < 9.9
 *     after that hit wait for 24 wins
 *     if there is loss, reset count till you count 24 wins
 *     on the 25th roll bet real bet
 *     if you win dummy bet till loss is found then wait again
 *     if lost you lost wait again
 * Reason for this behavior
 *     Since there will have a few hits below <9.9 that will result to a loss,
 *         Bet only on 25th roll even if you lose,
 *             on the long run the amount lost will be less than the amount won eventually
 *             r25: 30
 *             r26: 30
 *             r27: 30
 *             r28: 25
 *             ....
 *             ....
 *             r100: 10
 *         The hits on roll 26th to 100+ is virtually my win
 *         on 3076 rounds there was 2721 hits on the first 21 rolls
 * Status
 *     Will start this another day
 *
 */

ele = {
    betBtn: document.querySelector(".index__home__dice__wrap__cta.btn"),
    halfBtn: document.querySelector(".dice__control__content").children[1],
    x2Btn: document.querySelector(".dice__control__content").children[2],
    betInput: document.getElementById("betSize"),
    lastRollContainer: document.querySelector(".index__home__indicator__inner__number__roll"),
    lastRollSpan: document.querySelector(".index__home__indicator__inner__number__roll").children[1],
    directionSpan: document.querySelector(".index__home__dice__card__bet-ui").children[1].children[1].children[0].children[0].children[0].children[1].children[0]
};

winsBeforeLoss = [];
winCount = 0;
lastRollResult = null;
setBet = 0;

dummyx2Clicks = 11;
baseBetx2Clicks = 16;
specialBetx2Clicks = 21;
revenge = false;
// 5 = 0.000000016
// 10 = 0.00000500
// 14 = 0.00008000
// 18 = 0.00100000
// 21 = 0.01000000

winsCriticalLow = 7; // 7 or 13
winsCriticalHigh = 24; // DONT CHANGE

actionArr = [];

function setBetZero() {
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
}

function lossCount() {
    lCount = 0;
    bets = 0;
    for(a=1;a<winsBeforeLoss.length;a++) {
        if(winsBeforeLoss[a]===winsBeforeLoss[a-1] && winsBeforeLoss[a]>winsCriticalLow) {
            console.log('Lost at index ' + a + '. Wins: ' + winsBeforeLoss[a]);
            lCount++;
        }
        if(winsBeforeLoss[a]>=winsBeforeLoss[a-1] && winsBeforeLoss[a-1] > winsCriticalLow) {
            bets++;
        }
    }
    console.log('Total Bets ' + bets +'. Lost ' + lCount + ' times.');
    return lCount;
}

function setDummyAmount() {
    setBetZero();
    for(a=0;a<dummyx2Clicks;a++) {
        ele.x2Btn.click();
    }
    setBet = 1;
}

function setBetAmount() {
    setBetZero();
    for(a=0;a<baseBetx2Clicks;a++) {
        ele.x2Btn.click();
    }
    setBet = 2;
    console.log('betting NORMAL');
}

function setSpecialAmount() {
    setBetZero();
    for(a=0;a<specialBetx2Clicks;a++) {
        ele.x2Btn.click();
    }
    setBet = 3;
    console.log('betting SPECIAL');
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function setNewTargetBeforeSpecialBet(targetWins) {
    winsBeforeLoss.push(targetWins);
    if(targetWins > winsCriticalLow) {
        console.log('Valid Target Found. Will make bet after ' + winsBeforeLoss[winsBeforeLoss.length-1] + ' wins.');
    } else {
        console.log(winsBeforeLoss[winsBeforeLoss.length-1] + ' wins is NOT a VALID TARGET');
    }
}

function ifTargetReachedEndBetting() {

}

function mainLoop() {
    switch(actionArr[actionIndex]) {
        case "init":
            console.log('initializing...');
            lastRollResult = ele.lastRollSpan.innerText;
            setBetZero();
            setNewTargetBeforeSpecialBet(999);

            actionArr.push("click bet");
            actionArr.push("wait new result");
            actionIndex++;
        break;

        case "click bet":
            ele.betBtn.click();
            actionIndex++;
        break;

        case "wait new result":
            // do something only if new result is found
            if( lastRollResult != ele.lastRollSpan.innerText ) {
                lastRollResult = ele.lastRollSpan.innerText;
                if( hasClass( ele.lastRollContainer, 'is-negative') ) {
                    if(setBet!=1) {
                        console.log('Lost real bet! Make Revenge Bet')
                        revenge = true;
                    }
                    console.log('');
                    setNewTargetBeforeSpecialBet(winCount);
                    setDummyAmount();
                    winCount = 0;
                } else {
                    winCount++;
                    console.log('win');
                    setDummyAmount();
                    target = winsBeforeLoss[winsBeforeLoss.length-1];
                    if( target > winsCriticalLow ) {
                        if( winCount === target ) {
                            console.log('Target is ' + target + '.');
                            console.log('Wins is ' + winCount + '.');
                            if(revenge===true) {
                                console.log('revenge bet now!!!!!');
                                setSpecialAmount();
                                revenge = false;
                            } else {
                                setBetAmount();
                            }
                            /*
                            // dont bet after 18 wins 2x lost na
                            if(winCount === winsCriticalHigh) {
                                setSpecialAmount();
                            } else {
                                setBetAmount();
                            }
                            */
                        }
                    }
                }

                ifTargetReachedEndBetting();
                if(actionIndex===actionArr.length-1) {
                    actionArr.push("click bet");
                    actionArr.push("wait new result");
                }
                actionIndex++;
            }
        break;
    }
}

actionArr.push('init');
actionIndex = 0;

setInterval(function() { mainLoop(); }, 1000);