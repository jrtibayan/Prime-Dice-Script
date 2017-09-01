/*
 * Bot Behavior
 *     on x10 payout after a hit below 9.90 bet only on first 21 rolls
 *     If 21 rolls fail bet dummy till dummy will and bet again on first 21 rolls
 * Reason for this behavior
 *     My prevous stat result
 *         on 3076 rounds there was 2721 hits on the first 21 rolls
 *         that is 88%+ of total rounds
 *     I will add more stat later on
 * Status
 *     Behavior works fine.
 *     A little bug is found that needs fixing
 *         getMyBal() sometimes get the not updated value after win
 *             maybe because after win it records too fast and
 *                 didnt wait for bal to be updated before getting it
 *     Testing
 *         I will be testing this for 20 days
 *         If all goes well I'll use it with my current balance
 *         Starting Balance: 20,000
 *         Target Income: 5%
 *         Bet: 16
 *         001 08/27/2017 start 20,000 bet 16 OKAY
 *         002 08/28/2017 start 20,000 bet 16 OKAY <NO LOSS>
 *         003 08/29/2017 start 20,000 bet 16 OKAY <NO LOSS>
 *         004 08/30/2017 start 20,000 bet 16 OKAY <-4,000 but still got up and won>
 *         005 08/31/2017 start 20,000 bet 16 OKAY <NO LOSS>
 *         006 09/02/2017 start 4,400,000 lowest 4,164,959 which is (4,096x57) bet 4,096 OKAY <2 LOSS> recovered after 17 consecutive wins after the 2nd loss
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
    onLossResetBtn: document.querySelector(".index__home__dice__automated-switch").children[0].children[0].children[0].children[1].children[0].children[0],
    onLossIncreaseBtn: document.querySelector(".index__home__dice__automated-switch").children[0].children[0].children[0].children[1].children[0].children[1]
};

stat = {
    lossBeforeWinOnx10Bot: {},
    winLoss: [],
    lowestBal: 1000,
    rounds: {}
};

rolls = [];

startBal = 0;
betx2Clicks = 13; //5

targetIncome = 0.00240000;
targetBal = 0;
waitForWin = 21;

lossBeforeWinOnx10BotCounter = 0;
roundCount = 1;
consecLost = 0;
actionArr = [];
lastRollResult = null;
betting =  null;


function getMyBal() { return parseFloat(ele.myBal.innerText.split(" ")[0]).toFixed(8); }
function getBetInput() { return parseFloat(ele.betInput.value).toFixed(8); }
function getCurrentDirection() { return ele.directionSpan.innerText; }

function recordStartBal() { startBal = parseFloat(getMyBal()); }
function recordTargetBal() { targetBal = startBal + targetIncome; }
function recordLowestBalIfItIsLowest() { if( stat.lowestBal > parseFloat(getMyBal()) ) { stat.lowestBal = parseFloat(getMyBal()); } }

function hasClass(element, cls) { return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1; }

function iWon() { return (!hasClass(ele.lastRollContainer, 'is-negative')); }

function newRollFound() { return (lastRollResult != ele.lastRollSpan.innerText); }

function recordRoundResult(wOrL) {
    stat.rounds['round'+roundCount] = wOrL + '-' + getMyBal();
    console.log('Round ' + roundCount + ' result [' + stat.rounds['round'+roundCount] + ']' );
    roundCount++; // new round
}


function setDummyBet() {
    betting = false;
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
    for(a=0;a<0;a++) {
        ele.x2Btn.click();
    }
    console.log('Dummy Bet Set to ' + ele.betInput.value + ' till WIN');
}

function setRealBet() {
    betting = true;
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
    for(a=0;a<betx2Clicks;a++) {
        ele.x2Btn.click();
    }
    console.log('Real Bet Set to ' + ele.betInput.value + ' till ' + waitForWin + ' LOSS');
}

function finish() {
    console.log("Stopping.. Reached target balance");
    console.log("Started with " + parseFloat(startBal).toFixed(8));
    console.log("Current Bal  " + getMyBal());
    stop();
}

function targetIsReached() {
    if( parseFloat(getMyBal()) >= targetBal) {
        console.log('Target is Reached Please STOP');
        return true;
    }
    return false;
}

function pushStopAuto() {
    actionArr.push("click bet");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
    actionArr.push("skip");
}

function pushStartRealAuto() {
    actionArr.push("set real bet");
    actionArr.push("skip");

    actionArr.push("set increase");
    actionArr.push("skip");

    actionArr.push("click bet");
    actionArr.push("wait new result");
}

function pushStartDummyAuto() {
    actionArr.push("set dummy");
    actionArr.push("skip");

    actionArr.push("set reset");
    actionArr.push("skip");

    actionArr.push("click bet");
    actionArr.push("wait new result");
}



function recordHitsOnLess990() {
    if(parseFloat(ele.lastRollSpan.innerHTML)<9.90) {
        //win
        if(stat.lossBeforeWinOnx10Bot["l"+lossBeforeWinOnx10BotCounter]===undefined) {
            stat.lossBeforeWinOnx10Bot["l"+lossBeforeWinOnx10BotCounter] = 0;
        }
        stat.lossBeforeWinOnx10Bot["l"+lossBeforeWinOnx10BotCounter]++;
        //console.log(lossBeforeWinOnx10BotCounter+ " Loss before win");
        lossBeforeWinOnx10BotCounter = 0;
    }else {
        //loss
        lossBeforeWinOnx10BotCounter++;
    }
}

function mainLoop() {
    switch(actionArr[actionIndex]) {
        case "init":
            console.log('start');
            recordStartBal(); // store my start bal so i can compare for income
            recordTargetBal(); // compute target balance and store to stop after reaching desired win.
            recordLowestBalIfItIsLowest(); // record lowest bal just for stat


            setDummyBet(); // dummy bet first and find the first win and start betting there
            actionArr.push("wait new result");
            actionIndex++;
        break;

        case "skip":
            actionIndex++;
        break;

        case "click bet":
            //console.log('click bet start');
            ele.betBtn.click();
            actionIndex++;
            //console.log('click bet end');
            //console.log('');
        break;

        case "set real bet":
            //console.log("set real bet start");
            setRealBet();
            actionIndex++;
            //console.log('set real bet end');
            //console.log('');
        break;

        case "set increase":
            //console.log('set increase start');
            ele.onLossIncreaseBtn.click();
            actionIndex++;
            //console.log('set increase end');
            //console.log('');
        break;

        case "set reset":
            ele.onLossResetBtn.click();
            actionIndex++;
        break;

        case "record round result L":
            recordRoundResult('L');
            actionIndex++;
        break;

        case "record round result W":
            recordRoundResult('W');
            actionIndex++;
        break;

        case "check if target reached":
            if(targetIsReached()) {
                finish();
            }
            actionIndex++;
        break;

        case "set dummy":
            //console.log('set dummy start');
            setDummyBet();
            actionIndex++;
            //console.log('set dummy end');
            //console.log('');
        break;

        case "wait new result":
            if( newRollFound() ) {
                //console.log('new roll found ' + ele.lastRollSpan.innerText);
                lastRollResult = ele.lastRollSpan.innerText;
                rolls.push(parseFloat(lastRollResult));

                //check how many rolls before hit < 9.90
                recordHitsOnLess990();

                if( betting === false ) {
                    //console.log('Dummy only. My Bet now is ' + getBetInput())
                    if( iWon() ) {
                        console.log('Dummy win');
                        consecLost=0;
                        console.log('');
                        console.log("restart real bet");
                        pushStopAuto();
                        if(consecLost>=waitForWin) {
                            actionArr.push("record round result L");
                        }
                        pushStartRealAuto();
                        actionIndex++;
                    } else {
                        console.log('dummy loss');
                        recordLowestBalIfItIsLowest();
                        consecLost++;
                    }
                }
                else {
                    //console.log('Real bet. My Bet now is ' + getBetInput())
                    if( iWon() ) {
                    // win
                        stat.winLoss.push('won');
                        console.log("Real Win");
                        console.log('');
                        consecLost=0;
                        pushStopAuto();
                        actionArr.push("record round result W");
                        actionArr.push("check if target reached");
                        pushStartRealAuto();
                        actionIndex++;
                    } else {
                    // loss
                        console.log("real loss");
                        recordLowestBalIfItIsLowest();
                        consecLost++;
                        if(consecLost>=waitForWin) {
                            stat.winLoss.push('lost');
                            console.log("quiting real bet... dummy bet til win");
                            console.log('');

                            pushStopAuto();
                            pushStartDummyAuto();
                            actionIndex++;
                        }
                    }
                }
            }
            //console.log('waiting...');
        break;
    }
}


function stop() {
    clearTimeout(timer);
};

function start() {  // use a one-off timer
    timer = setInterval(mainLoop, 100);
};

actionArr.push('init');
actionIndex = 0;
