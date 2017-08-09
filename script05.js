/*
 * Reason for making this bot
 *     A bust in script04 made me resulted in making this bot
 *     I am not sure how many times this will bot will be able to bet per day
 *     since I am not sure how many times the conditions to make bet will be met
 * Bot Behavior
 *     set to x1.1 Over
 *     bet after 3 consecutive loss on n number of wins
 *     for example
 *         bet 1: after 7 wins ZERO bet on 8th
           bet 2: if I lost wait for 7 wins again to make ZERO bet
 *         bet 3: if I lost wait for 7 wins again to make ZERO bet
 *         bet 4: if I lost wait for 7 wins again then ALL OR NOTHING bet
 *         if I won on any of the first three bets lossCount = 0
 * Status
 *     Works but is very slow
 *     1 bet every 2-7 days
 *     So in 30days thats 40% - 100%+ income
 *     So in P2000 starting balance
 *         income would be 800-2000 a month
 *     And in that slow income it may still be possible to lose
 *     I havent verified it yet
 */

records = {
    rolls: [],
    log: []
};

ele = {
    betBtn: document.querySelector(".index__home__dice__wrap__cta.btn"),
    halfBtn: document.querySelector(".dice__control__content").children[1],
    x2Btn: document.querySelector(".dice__control__content").children[2],
    betInput: document.getElementById("betSize"),
    lastRollContainer: document.querySelector(".index__home__indicator__inner__number__roll"),
    lastRollSpan: document.querySelector(".index__home__indicator__inner__number__roll").children[1],
    directionSpan: document.querySelector(".index__home__dice__card__bet-ui").children[1].children[1].children[0].children[0].children[0].children[1].children[0]
};


restCount = 0;
dummyx2Clicks = 0;
baseBetx2Clicks = 9;
specialBetx2Clicks = 13;
targetConsec = 3;

winsBeforeLoss = [];
actionArr = [];
consecLost = 1;
lastRollResult = null;
setBet = 0;
winCount = 0;
revenge = false;

function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}


function winCountSameAsPrevious(wins) {
    //console.log(wins + ' vs ' + winsBeforeLoss[winsBeforeLoss.length-2]);
    if(wins===winsBeforeLoss[winsBeforeLoss.length-2]) {
        return true;
    }
    return false;
}

function setBetZero() {
    while(ele.betInput.value!=0) {
        ele.halfBtn.click();
    }
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
    //console.log('betting NORMAL');
}

function setSpecialAmount() {
    setBetZero();
    for(a=0;a<specialBetx2Clicks;a++) {
        ele.x2Btn.click();
    }
    setBet = 3;
    //console.log('betting SPECIAL');
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function recordRoll(rolledNum) {
    records.rolls.push(rolledNum);
}

function ifTargetReachedEndBetting() {
    //actionIndex+=1000;
}

function allConditionForSpecialIsTrue(target) {
    if( winCount === target && consecLost === targetConsec && target > 1 ) {
        // major bet
        //console.log('Going to bet major');
        //console.log('because index[' + (winsBeforeLoss.length-1) + ' ' +  (winsBeforeLoss.length-2) + ' ' + (winsBeforeLoss.length-3) +'] are all ' + target);
        setSpecialAmount();
    } else if(winCount === target && consecLost === targetConsec-1 && target > 1 && revenge===false) {
        // minor bet
        // its okay to turn on minor bet as long as win on major bet can cover its loss
        //      plus income
        // no minor bet will be made if waiting for revenge bet

        //console.log('Going to bet minor');
        //console.log('because index[' + (winsBeforeLoss.length-1) + ' ' +  (winsBeforeLoss.length-2) + ' ' + (winsBeforeLoss.length-3) +'] are all ' + target);
        setBetAmount();

       //console.log('Real Bet Opportunity. PASS/SKIP');
    }
}

function consecutiveCounts(cons) {
    results = [];
    for(a=0;a<winsBeforeLoss.length;a++) {
        for(b=a+1, success = true;b<=(a+cons-1);b++) {
            if(winsBeforeLoss[a]!=winsBeforeLoss[b]) {
                success = false;
            }
        }

        if(success) {
            if(winsBeforeLoss[a]>1) {
                results.push(a);
                if(records.LostAbove4===undefined) {
                    records.LostAbove4 = '';
                }
                records.LostAbove4 = records.LostAbove4 + '\n' + cons + ' loss @ ' + winsBeforeLoss[a] + ' on record '+ a + ' - NO DATE';
            }
        }
    }
    return results;
}


function highestConsecutiveLosses() {
    highest = {count:0,index:[]};
    counter=0;
    results = [];
    for(a=0;a<winsBeforeLoss.length;a++){
        if(winsBeforeLoss[a]==0){
            counter++;
        }
        else {
            if(highest.count<counter) {
                highest.count = counter;
                highest.index = [];
                highest.index.push(a-1);
            }
            else if(highest.count===counter){
                highest.index.push(a-1);
            }
            if(counter>1){
                results.push({index:a-1,count:counter});
            }
            counter = 0;
        }
    }
    console.log(highest)
    return results;
}

function findLongestStreakHitBelow20() {
    results = {};
    counter = 0;
    highest = {index:[],count:0};
    for(a=0;a<winsBeforeLoss.length;a++) {
        if(winsBeforeLoss[a]<20) {
            counter++;
        } else {
            if(results['c'+counter]==undefined) {
                results['c'+counter] = 0;
                results['c'+counter+'Indexes']=[];
            }
            results['c'+counter]++;
            results['c'+counter+'Indexes'].push(a);

            if(counter>highest.count) {
                highest.count = counter;
                highest.index = [];
                highest.index.push(a);
            }
            else if(counter>=highest.count) {
                highest.index.push(a);
            }
            counter = 0;
        }
    }
    return results;
}


function mainLoop() {
    switch(actionArr[actionIndex]) {
        case "init":
            console.log('initializing...');
            lastRollResult = ele.lastRollSpan.innerText;
            setBetZero();
            winsBeforeLoss.push(999);

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
                restCount = 0;
                lastRollResult = ele.lastRollSpan.innerText;
                recordRoll(lastRollResult);

                if( hasClass( ele.lastRollContainer, 'is-negative') ) {
                    // record how many wins before lost
                    winsBeforeLoss.push(winCount);

                    //console.log('wincount ' + winCount);
                    if(winCountSameAsPrevious(winCount)) {
                        consecLost++;
                        //console.log('%c Consecutive! '+ winCount, 'font-size:16px; background: #222; color: #bada55');
                    } else {
                        consecLost = 1;
                        //console.log('reset consec ' + winCount + ' not equal to ' + winsBeforeLoss[winsBeforeLoss.length-2]);
                    }
                    //console.log('Consecutive Lost Count: '+consecLost+ ' @win: ' +winCount);


                    if(consecLost>=4) {
                        if(records['consec'+consecLost+'LostOn'+winCount]===undefined) {
                            records['consec'+consecLost+'LostOn'+winCount] = [];
                        }
                        records['consec'+consecLost+'LostOn'+winCount].push(winsBeforeLoss.length-1);
                        records.LostAbove4 = records.LostAbove4 + '\n' + consecLost + ' loss @ ' + winsBeforeLoss[winsBeforeLoss.length-1] + ' on record '+ (winsBeforeLoss.length-1) + ' - ' + getFormattedDate();
                        console.log(consecLost + ' loss @ ' + winsBeforeLoss[winsBeforeLoss.length-1] + ' on record '+ (winsBeforeLoss.length-1) + ' - ' + getFormattedDate());
                        records.log.push(consecLost + ' loss @ ' + winsBeforeLoss[winsBeforeLoss.length-1] + ' on record '+ (winsBeforeLoss.length-1) + ' - ' + getFormattedDate());
                    }

                    switch(setBet) {
                        case 2:
                            message = 'Lost minor bet! I will get my revenge! Record is on '+(winsBeforeLoss.length-1);
                            console.log(message);
                            records.log.push(message);
                            //revenge = true;
                        break;
                        case 3:
                            message = 'Lost major bet! Oh NOOOOO! Record is on '+(winsBeforeLoss.length-1);
                            console.log(message);
                            records.log.push(message);
                            console.log('');
                        break;
                    }

                    setDummyAmount();
                    winCount = 0;
                } else {
                    winCount++;
                    switch(setBet) {
                        case 2:
                            console.log('Won minor bet! Record is on '+(winsBeforeLoss.length-1));
                        break;
                        case 3:
                            console.log('Won major bet! Record is on '+(winsBeforeLoss.length-1));
                            revenge = false;
                        break;
                    }

                    //console.log('win');
                    // set default bet to dummy
                    setDummyAmount();
                    // only set real bet if below condion is true
                    target = winsBeforeLoss[winsBeforeLoss.length-1];
                    allConditionForSpecialIsTrue(target);
                }

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