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
    log: [],
    logStyle: []
};

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


lastBalLog = null;

restCount = 0;
targetConsec = 3;

winsBeforeLoss = [];
actionArr = [];
consecLost = 1;
setBet = 0;
winCount = 0;
revenge = false;
waitForNewIncome = false;



model = {
    startBalance: 0,
    dummyx2Clicks: 0,
    minorx2Clicks: 15,
    majorx2Clicks: 22,
    lastRoll : null,
    lastBalance: null,
    winBeforeDummy: 2,
    targetIncomeBeforeStop: 0.001
};


viewResults = {
    init: function() {
        console.log('viewResults init start');
        /* ADD THE STYLING */
        css = '.report-tab {'
            +'background: lightgrey;'
            +'color: black;'
            +'display: block;'
            +' position: fixed;'
            +'top: 0;'
            +'right: 0;'
            +'width: 100%;'
            +'height: 100vh;'
            +'z-index: 9000000000;'
            +'-webkit-transition: left 10s;'
            +'transition: left 10s;'
        +'} '
        +'.report-tab.hidden {'
            +'left: 100vw;'
        +'} '
        +'.menu {'
            +'height: 40px;'
            +'background: black;'
        +'} '
        +'.show-report {'
            +'background: red;'
            +'position: absolute;'
            +'width: 60px;'
            +'height: 40px;'
            +'top: calc(50vh - 20px);'
            +'left: -60px;'
        +'} '
        +'.hide-report {'
            +'background: blue;'
            +'position: absolute;'
            +'width: 40px;'
            +'height: 40px;'
            +'top: 0;'
            +'right: 0;'
        +'} '
        +'.set-bets {'
            +'float: left;'
            +'width: 50%;'
            +'border: 1px solid #000;'
        +'} '
        +'.set-bets p .prop{'
            +'width: 100px;'
            +'text-align: right;'
            +'display: inline-block;'
            +'padding: 0 5px;'
        +'} '
        +'.set-bets p .value{'
            +'background: #fff;'
            +'padding: 0 5px;'
            +'width: calc(100% - 100px);'
            +'text-align: left;'
            +'display: inline-block;'
        +'} '


        +'.balance-and-target {'
            +'float: left;'
            +'width: 50%;'
            +'border: 1px solid #000;'
        +'} '
        +'.balance-and-target p .prop{'
            +'width: 100px;'
            +'text-align: right;'
            +'display: inline-block;'
            +'padding: 0 5px;'
        +'} '
        +'.balance-and-target p .value{'
            +'background: #fff;'
            +'padding: 0 5px;'
            +'width: calc(100% - 100px);'
            +'text-align: left;'
            +'display: inline-block;'
        +'} '


        +'.wins-before-lost{'
            +'float: right;'
            +'width: 25%;'
            +'border: 1px solid #000;'
        +'} '

        ,
        head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
        /* END ADD THE STYLING */


        theParent = document.body;
        theKid = document.createElement("div");
        theKid.className = "report-tab";
        //theKid.innerHTML = 'Are we there yet?';
        // append theKid to the end of theParent
        theParent.appendChild(theKid);

        document.querySelector('.report-tab').innerHTML += '<div class="menu"></div>';
        document.querySelector('.menu').innerHTML += '<div class="show-report">S</div>';
        document.querySelector('.menu').innerHTML += '<div class="hide-report">H</div>';

        viewSetBets.init();
        viewWinsBeforeLost.init();
        viewBalanceAndTarget.init();

        /****** LISTEN FOR CLICKS ******/

        var btnShowReport = document.querySelector('.show-report');
        btnShowReport.addEventListener('click', function() {
            document.querySelector('.report-tab').classList.remove("hidden");
        });

        var btnHideReport = document.querySelector('.hide-report');
        btnHideReport.addEventListener('click', function() {
            document.querySelector('.report-tab').classList.add("hidden");
        });
    }
};

viewBalanceAndTarget = {
    init: function() {
        document.querySelector('.report-tab').innerHTML += '<div class="balance-and-target"></div>';

        document.querySelector('.balance-and-target').innerHTML += '<p class="current-balance"><span class="prop">C.Balance: </span><span class="value">0</span></p><hr>';

        document.querySelector('.balance-and-target').innerHTML += '<p class="target-income"><span class="prop">T.Income: </span><span class="value">0</span></p>';
        document.querySelector('.balance-and-target').innerHTML += '<p class="current-income"><span class="prop">C.Income: </span><span class="value">0</span></p>';
        document.querySelector('.balance-and-target').innerHTML += '<p class="diff-income"><span class="prop">Diff: </span><span class="value">0</span></p>';
    },
    render: function() {
        document.querySelector('.current-balance .value').innerHTML = vm.getCurrentBalance().toFixed(8);
        document.querySelector('.target-income .value').innerHTML = model.targetIncomeBeforeStop.toFixed(8);
        document.querySelector('.current-income .value').innerHTML = vm.getCurrentIncome().toFixed(8);
        document.querySelector('.diff-income .value').innerHTML = (model.targetIncomeBeforeStop.toFixed(8)-vm.getCurrentIncome()).toFixed(8);
    }
};

viewWinsBeforeLost = {
    init: function() {
        document.querySelector('.report-tab').innerHTML += '<div class="wins-before-lost"><h4>W b4 L</h4></div>';
        viewWinsBeforeLost.render();
    },
    render: function() {
        list = [];
        for(a=winsBeforeLoss.length-1;a>winsBeforeLoss.length-11;a--) {
            list.push('<p>'+winsBeforeLoss[a]+'</p>');
        }
        document.querySelector('.wins-before-lost').innerHTML = list.join('');
    }
};

viewSetBets = {
    init: function() {
        document.querySelector('.report-tab').innerHTML += '<div class="set-bets"></div>';
        document.querySelector('.set-bets').innerHTML += '<p class="dummy"><span class="prop">Dummy: </span><span class="value">0</span></p>';
        document.querySelector('.set-bets').innerHTML += '<p class="minor"><span class="prop">Minor: </span><span class="value">0</span></p>';
        document.querySelector('.set-bets').innerHTML += '<p class="major"><span class="prop">Major: </span><span class="value">0</span></p>';
        viewSetBets.render();
    },
    render: function() {
        document.querySelector('.dummy .value').innerHTML = vm.getDummyBetAmount().toFixed(8);
        document.querySelector('.minor .value').innerHTML = vm.getMinorBetAmount().toFixed(8);
        document.querySelector('.major .value').innerHTML = vm.getMajorBetAmount().toFixed(8);
        if(parseFloat(document.querySelector('.major .value').innerHTML) > vm.getCurrentBalance()) {
            document.querySelector('.major .value').innerHTML = vm.getCurrentBalance().toFixed(8);
        }
    }
};

vm = {
    init: function() {

        // no more need to append
        // looks like PrimeDice already using JQuery
        // vm.appendJQuery();
        viewResults.init();
    },
    appendJQuery: function() {
        console.log('start appendJquery');
        /* inject javascript */
        var jq = document.createElement('script');
        jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
        //document.getElementsByTagName('head')[0].appendChild(jq);
        document.getElementsByTagName('head').insertBefore(jq,document.getElementsByTagName('head').childNodes[0]);
        // ... give time for script to load, then type (or see below for non wait option)
        window.setTimeout(function (){ jQuery.noConflict(); }, 5000);
        /* end - inject javascript */
        console.log('end appendJquery');
    },
    getDummyBetAmount: function() {
        return vm.calculateBetClicks(model.dummyx2Clicks);
    },
    getMinorBetAmount: function() {
        return vm.calculateBetClicks(model.minorx2Clicks);
    },
    getMajorBetAmount: function() {
        return vm.calculateBetClicks(model.majorx2Clicks);
    },
    calculateBetClicks: function(clicks) {
        if(clicks===0) return 0;

        betAmount = 0.00000001;
        for(a=1;a<clicks;a++) {
            betAmount*=2;
        }
        return betAmount;
    },
    setNewDummyAmout: function(clicks) {
        model.dummyx2Clicks = clicks;
        console.log('Changed Minor Bet Amount To: ' + vm.getDummyBetAmount());
        viewSetBets.render();
    },
    setNewMinorAmout: function(clicks) {
        model.minorx2Clicks = clicks;
        console.log('Changed Minor Bet Amount To: ' + vm.getMinorBetAmount());
        viewSetBets.render();
    },
    setNewMajorAmout: function(clicks) {
        model.majorx2Clicks = clicks;
        console.log('Changed Major Bet Amount To: ' + vm.getMajorBetAmount());
        viewSetBets.render();
    },
    getCurrentBalance: function() {
        return parseFloat(ele.myBal.innerText.split(" ")[0]);
    },
    getCurrentIncome: function() {
        return parseFloat((getMyBal()-model.startBalance).toFixed(8));
    }
};

vm.init();

function getMyBal() { return parseFloat(ele.myBal.innerText.split(" ")[0]); }

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
    for(a=0;a<model.dummyx2Clicks;a++) {
        ele.x2Btn.click();
    }
    setBet = 1;
}

function setBetAmount() {
    setBetZero();
    for(a=0;a<model.minorx2Clicks;a++) {
        ele.x2Btn.click();
    }
    setBet = 2;
    waitForNewIncome = true;
    //console.log('betting NORMAL');
}

function setSpecialAmount() {
    setBetZero();
    for(a=0;a<model.majorx2Clicks;a++) {
        ele.x2Btn.click();
    }
    setBet = 3;
    waitForNewIncome = true;
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
    if(target>1 && winCount === target) {
        if( consecLost === targetConsec-1 && revenge === true) {
            // major bet
            //console.log('Going to bet major');
            //console.log('because index[' + (winsBeforeLoss.length-1) + ' ' +  (winsBeforeLoss.length-2) + ' ' + (winsBeforeLoss.length-3) +'] are all ' + target);
            setSpecialAmount();
        } else if(consecLost === targetConsec-1 && revenge===false) {
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

function displayLog() {
    for(a=0;a<records.logStyle.length;a++) {
        for(b=0;b<10;b++){
            records.logStyle[a][b]=(records.logStyle[a][b]===undefined)? '':records.logStyle[a][b];
        }
        console.log(
            records.log[a],
            records.logStyle[a][0],
            records.logStyle[a][1],
            records.logStyle[a][2],
            records.logStyle[a][3],
            records.logStyle[a][4],
            records.logStyle[a][5],
            records.logStyle[a][6],
            records.logStyle[a][7],
            records.logStyle[a][8],
            records.logStyle[a][9]
        );
    }
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

function logCurrentBalanceAndIncome() {
    newDate = new Date();
    hoursInterval = 2;
    if(lastBalLog===null || lastBalLog.getTime()+(1000*60*60*hoursInterval) < newDate.getTime()) {
        // run every 24 hours
        console.log('Balance '+getMyBal().toFixed(8)+' Date: '+getFormattedDate()+' Income: '+vm.getCurrentIncome()+' Percent: '+getIncomePercent());
        records.log.push('Balance '+getMyBal().toFixed(8)+' Date: '+getFormattedDate()+' Income: '+vm.getCurrentIncome()+' Percent: '+getIncomePercent());
        records.logStyle.push([]);

        lastBalLog = newDate;
    }
}

function getIncomePercent() {
    return parseFloat((vm.getCurrentIncome()/(model.startBalance/100)).toFixed(2)).toFixed(2);
}

function logWinLoss(result,message) {
    if(result==='WIN') {
        console.log(
            message,
            'background: green; color: white;',
            'background: #222; color: #bada55;',
            'background: blue; color: yellow;',
            'background: grey; color: black;'
        );
    } else {
        console.log(
            message,
            'background: red; color: white;',
            'background: #222; color: #bada55;',
            'background: blue; color: yellow;',
            'background: grey; color: black;'
        );

    }
    records.log.push(message);
    records.logStyle.push([
        (result==='WIN') ? 'background: green; color: white;':'background: red; color: white;',
        'background: #222; color: #bada55;',
        'background: blue; color: yellow;',
        'background: grey; color: black;'
    ]);
}


function mainLoop() {
    switch(actionArr[actionIndex]) {
        case "init":
            console.log('initializing...');
            model.lastRoll = ele.lastRollSpan.innerText;
            model.startBalance = getMyBal();
            model.lastBalance = getMyBal();
            viewBalanceAndTarget.render();
            logCurrentBalanceAndIncome();
            setBetZero();

            winsBeforeLoss.push(999);
            viewWinsBeforeLost.render();

            actionArr.push("click bet");
            actionArr.push("wait new result");
            actionArr.push("process bet");
            actionIndex++;
        break;

        case "click bet":
            ele.betBtn.click();
            actionIndex++;
        break;

        case "wait new result":
            if( model.lastRoll != ele.lastRollSpan.innerText ) {
                if(waitForNewIncome===true) {
                    console.log('waiting for new income');
                    /*  Checks for new income
                     *  if new income is found
                     *  wait will run again but
                     *  it will go to else since
                     *  we are done waiting for new income */
                    if(model.lastBalance != getMyBal()) {
                        waitForNewIncome=false;
                    }
                } else {
                    restCount = 0;
                    // update lastRoll
                    model.lastRoll = ele.lastRollSpan.innerText;
                    recordRoll(model.lastRoll);
                    // update balance
                    model.lastBalance = getMyBal();
                    // log balance on set interval
                    logCurrentBalanceAndIncome();
                    actionIndex++;
                }
            } else {
                restCount++;
                if(restCount===10) {
                    restCount = 0;
                    ele.betBtn.click();
                }
            }
        break;


        case "process bet":
            if( hasClass( ele.lastRollContainer, 'is-negative') ) {
                // I LOST
                // record how many wins before lost
                winsBeforeLoss.push(winCount);
                viewWinsBeforeLost.render();

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
                    records.logStyle.push([]);

                }

                switch(setBet) {
                    case 2:
                        message = '%c Lost minor bet! %c Record is on '+(winsBeforeLoss.length-1)+' %c '+getFormattedDate()+' %c '+getIncomePercent()+'% ';
                        logWinLoss('LOSS',message);
                        revenge = true;
                        viewBalanceAndTarget.render();
                        viewSetBets.render();
                    break;
                    case 3:
                        message = '%c Lost major bet! Oh NOOOOO! %c Record is on '+(winsBeforeLoss.length-1)+' %c '+getFormattedDate()+' %c '+getIncomePercent()+'% ';
                        logWinLoss('LOSS',message);
                        console.log('');
                        revenge = true;
                        viewBalanceAndTarget.render();
                        viewSetBets.render();
                    break;
                }

                setDummyAmount();
                winCount = 0;
            } else {
                // I WIN
                winCount++;

                switch(setBet) {
                    case 2:
                        message = '%c Won minor bet! %c Record is on '+(winsBeforeLoss.length-1)+' %c '+getFormattedDate()+' %c '+getIncomePercent()+'% ';
                        logWinLoss('WIN',message);
                        viewBalanceAndTarget.render();
                        viewSetBets.render();
                    break;
                    case 3:
                        if(model.winBeforeDummy>0) {
                            model.winBeforeDummy--;
                        } else {
                            model.minorx2Clicks = 13;
                            model.majorx2Clicks = 17;
                        }

                        message = '%c Won major bet! %c Record is on '+(winsBeforeLoss.length-1)+' %c '+getFormattedDate()+' %c '+getIncomePercent()+'% ';
                        logWinLoss('WIN',message);
                        revenge = false;
                        viewBalanceAndTarget.render();
                        viewSetBets.render();
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
                actionArr.push("process bet");
            }
            actionIndex++;
        break;
    }
}

actionArr.push('init');
actionIndex = 0;

setInterval(function() { mainLoop(); }, 1000);