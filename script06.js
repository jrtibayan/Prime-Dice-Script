/*
 * Reason for making this bot
 *     8/3/2017 script05 is kinda okay
 *     no major bet loss yet but it is very slow
 *     1 Bet in 2-3 maybe upto 7 days so thats 10% income
 *     so in a month could win minimum of 40% if bet every 7 days
 *     if lucky 100% or more if betted every 2-3 days
 *     So if I have P1000 to start with,
 *         thats only 1000 income a month at best
 *
 * Bot Behavior
 *     This behavior is based on martingale
 *     You double the bet every lost
 *     until you win
 *     And most people wait for 3-4 loss before start the strategy
 *
 *     For this improved version
 *     Always wait for 3-4 loss
 *     Before every bet and double bet
 *     for example
 *     3 loss bet 2
 *     if you lost wait for 3 loss again bet 4
 *     if you win wait for 3 loss then bet base bet
 *
 * Status
 *
 *
 *
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
};

records = {
    rolls: [] // will contain dice rolls
};

restCount = 0;

actionArr = [];
lastRollResult = null;

consecLossBeforeBet = 3;
baseBetClicks = 5; // 4
addedClicksToBaseBet = 0;
dummyx2Clicks = 1; // 1
currentBetClicks = 0;
realBet = false;
lv1Loss = 0;
myBet = 0;

lv1LossOnBetOver = 0;
lv1LossOnBetUnder = 0;
realLoss = 0;
realLossLimit = 4;

UNDER = 'ROLL UNDER';
OVER =  'ROLL OVER';

function recordRoll(rolledNum) {
    records.rolls.push(rolledNum);
}

function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}

function getMyBal() { return parseFloat(ele.myBal.innerText.split(" ")[0]).toFixed(8); }
function getBetInput() { return parseFloat(ele.betInput.value).toFixed(8); }

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function setBetZero() {
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
}

function resetBetToBase() {
    currentBetClicks = baseBetClicks;
}

function setBetAmount() {
    setBetZero();
    for(a=0;a<currentBetClicks;a++) {
        ele.x2Btn.click();
    }
    for(a=0;a<addedClicksToBaseBet;a++) {
        ele.x2Btn.click();
    }
    myBet = parseFloat(getBetInput()).toFixed(8);
    //console.log('set bet to '+myBet);
}

function setDummyAmount() {
    setBetZero();
    for(a=0;a<dummyx2Clicks;a++) {
        ele.x2Btn.click();
    }
}

function ifTargetReachedEndBetting() {
    //actionIndex+=1000;
}

function iLost() {
    return (hasClass( ele.lastRollContainer, 'is-negative'));
}

function setDirection(direction) {
    if(direction != ele.directionSpan.innerText) {
        ele.directionSpan.click();
    }
}

function setAppropriateBet() {
    if(lv1LossOnBetUnder === consecLossBeforeBet || lv1LossOnBetOver === consecLossBeforeBet) {
        lv1LossOnBetUnder = 0;
        lv1LossOnBetOver = 0;
        if(lv1LossOnBetUnder===consecLossBeforeBet) {
            setDirection(UNDER);
        } else {
            setDirection(OVER);
        }
        setBetAmount();
        realBet = true;
    } else {
        setDummyAmount();
        realBet = false;
    }
}

function mainLoop() {
    switch(actionArr[actionIndex]) {
        case "init":
            console.log('START');
            console.log('Improved Martingale');
            lv1Loss = 0;
            resetBetToBase();

            lastRollResult = ele.lastRollSpan.innerText; // record last result


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
                recordRoll(lastRollResult);

                restCount = 0; // used for restarting when idle


                if(realBet === true) {
                    if( iLost() ) {
                        console.log('Lost '+myBet);
                        realLoss++;
                        currentBetClicks++;
                    } else {
                        console.log('Won '+myBet);
                        console.log('Reset to base.');
                        console.log('');
                        realLoss = 0;
                        resetBetToBase();
                    }
                }

                if(realLoss%realLossLimit===0 && realLoss!=0) {
                    console.log('Limit Reached Back To Base \n\n.');
                    resetBetToBase();
                }


                if( parseFloat(lastRollResult) > 50.49) {
                    // bet over win
                    lv1LossOnBetOver = 0;
                } else {
                    // bet over loss
                    lv1LossOnBetOver++;
                }

                if( parseFloat(lastRollResult) < 49.5) {
                    lv1LossOnBetUnder = 0;
                    // bet under win
                } else {
                    // bet under win
                    lv1LossOnBetUnder++;
                }

                setAppropriateBet();


                ifTargetReachedEndBetting();
                if(actionIndex===actionArr.length-1) {
                    actionArr.push("click bet");
                    actionArr.push("wait new result");
                }
                actionIndex++;
            } else {
                restCount++;
                if(restCount===10) {
                    restCount = 0;
                    ele.betBtn.click();
                }
            }
        break;
    }
}

actionArr.push('init');
actionIndex = 0;

setInterval(function() { mainLoop(); }, 1000);