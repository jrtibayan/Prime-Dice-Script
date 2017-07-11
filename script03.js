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

startBal = 0;

stat = {
    lossBeforeWinOnx10Bot: {},
    winLoss: []
};
lossBeforeWinOnx10BotCounter = 0;

actionArr = [];
consecLost = 0;
lastRollResult = null;
betting =  null;
waitForLoss = 24;
waitForWin = 20;

function recordStartBal() {
    startBal = getMyBal();
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function getMyBal() {
    return parseFloat(ele.myBal.innerText.split(" ")[0]).toFixed(8);
}

function getBetInput() { return parseFloat(ele.betInput.value).toFixed(8); }

function getCurrentDirection() { return ele.directionSpan.innerText; }

function setDummyBet() {
    betting = false;
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
    for(a=0;a<1;a++) {
        ele.x2Btn.click();
    }
    console.log('Dummy Bet Set to ' + ele.betInput.value + ' till WIN');
}

function setRealBet() {
    betting = true;
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
    for(a=0;a<5;a++) {
        ele.x2Btn.click();
    }
    console.log('Real Bet Set to ' + ele.betInput.value + ' till ' + waitForWin + ' LOSS');
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

    actionArr.push("click bet");
    actionArr.push("wait new result");
}

function iWon() { return (!hasClass(ele.lastRollContainer, 'is-negative')); }

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

function newRollFound() {
    return (lastRollResult != ele.lastRollSpan.innerText);
}

function mainLoop() {
    switch(actionArr[actionIndex]) {
        case "init":
            console.log('init start')
            console.log('start');
            recordStartBal(); // store my start bal so i can compare for income
            setDummyBet(); // dummy bet first and find the first win and start betting there
            actionArr.push("wait new result");
            actionIndex++;
            console.log('init end');
            console.log('');
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

        case "set dummy":
            //console.log('set dummy start');
            ele.onLossResetBtn.click();
            setDummyBet();
            actionIndex++;
            //console.log('set dummy end');
            //console.log('');
        break;

        case "wait new result":
            if( newRollFound() ) {
                //console.log('new roll found ' + ele.lastRollSpan.innerText);
                lastRollResult = ele.lastRollSpan.innerText;

                //check how many rolls before hit < 9.90
                recordHitsOnLess990();

                if( betting === false ) {
                    //console.log('Dummy only. My Bet now is ' + getBetInput())
                    if( iWon() ) {
                        console.log('Dummy win')
                        consecLost=0;
                        pushStopAuto();
                        pushStartRealAuto();
                        actionIndex++;
                    } else {
                        consecLost++;
                    }
                }
                else {
                    //console.log('Real bet. My Bet now is ' + getBetInput())
                    if( iWon() ) {
                    // win
                        consecLost=0;
                        stat.winLoss.push('won');
                        console.log("Real Win");
                        console.log('');
                        console.log("restart real bet");

                        pushStopAuto();
                        pushStartRealAuto();
                        actionIndex++;
                    } else {
                    // loss
                        console.log("real loss");
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

actionArr.push('init');
actionIndex = 0;

myInterval = setInterval(mainLoop, 100);
