/*
 * Bot Behavior
 *     on x2 payout
 *     I am assuming the first n pattern will not be seen for a long time
 *     so bet the direction of the first pattern of results
 *     example if first rolls where under under over over
 *     I assume that the next four rolls will not be the same
 *     so just use that pattern to bet
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

pattern = 4;
rollDirs = [];
myDirs = [];
lastRollResult = null;
consecLoss = 0;

actionArr = [];
actionIndex = 0;

function setBetZero() {
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
}

function setBetAmount() {
    setBetZero();
    for(a=0;a<1;a++) {
        ele.x2Btn.click();
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


function mainLoop() {
    switch(actionArr[actionIndex]) {
        case "init":
            console.log('initializing...');
            setBetZero();
            for(a=0;a<pattern;a++) {
                actionArr.push("change dir");
                actionArr.push("click bet");
                actionArr.push("wait new result");
            }
            actionIndex++;
        break;

        case "click bet":
            ele.betBtn.click();
            actionIndex++;
        break;

        case "change dir":
            if(rollDirs.length>=pattern) {
                if(rollDirs[rollDirs.length-pattern] != ele.directionSpan.innerText) {
                    ele.directionSpan.click();
                }
            }
            actionIndex++;
        break;

        case "wait new result":
            if( lastRollResult != ele.lastRollSpan.innerText ) {
                    // new result found
                    console.log(ele.lastRollSpan.innerText);
                    lastRollResult = ele.lastRollSpan.innerText;
                    myDirs.push(ele.directionSpan.innerText);
                    if( parseFloat(lastRollResult) < 50 ) {
                        rollDirs.push("ROLL UNDER");
                    }
                    else {
                        rollDirs.push("ROLL OVER");
                    }

                    if( hasClass( ele.lastRollContainer, 'is-negative') ) {
                        // I lost
                        // double my bet
                        consecLoss++;
                        if(consecLoss>=pattern) {
                            consecLoss = 0;
                            setBetAmount();
                        }
                        else {
                            ele.x2Btn.click();
                        }
                    } else {
                        // I win
                        setBetAmount();
                    }

                    if(actionIndex===actionArr.length-1) {
                        actionArr.push("change dir");
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

setInterval(mainLoop, 1000);

ele.directionSpan.click();