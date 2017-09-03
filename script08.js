/*              PRIMEDICE HELPER              */

/*
 *      A script to help me decide if I should bet on x2
 *          over or under
 *          opposite direction or same direction
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
    myBal: document.querySelector(".index__home__header__balance__btc").children[1]
};

records = {};

records.rolls = (rolls===undefined)? [] : rolls;

model = {};

function recordRoll(rolledNum) {
    records.rolls.push(rolledNum);
}

function checkDirection(roll) {
    if(roll>50.49) return 'ROLL OVER';
    if(roll<49.5) return 'ROLL UNDER';
    return 'MISS';
}

function getLastRoll() {
    return records.rolls[records.rolls.length-1];
}

function mainLoop() {
    if( model.lastRoll != ele.lastRollSpan.innerText ) {
        model.lastRoll = ele.lastRollSpan.innerText;
        recordRoll(parseFloat(model.lastRoll));

        console.log(showDirectionStat() +' '+ showStatSameOpposite());


        if(checkDirection(getLastRoll())==ele.directionSpan.innerHTML.toUpperCase()) {
            console.log('hello');
            //ele.directionSpan.click();
        }
        //ele.betBtn.click();
    }
}

function showStatSameOpposite() {
    same = 0;
    oppo = 0;
    miss = 0;
    missFUnder = 0;
    missFOver = 0;
    for(a=1;a<records.rolls.length;a++) {
        if(records.rolls[a]>50.49) {
            if(records.rolls[a-1]<49.50) {
                oppo++;
            }
            else if(records.rolls[a-1]>50.49)   {
                same++;
            }
            else {
                miss++;
            }
        }
        else if(records.rolls[a]<49.50) {
            if(records.rolls[a-1]<49.50) {
                same++;
            }
            else if(records.rolls[a-1]>50.49)   {
                oppo++;
            }
            else {
                miss++;
            }
        }

    }
    return 'same: '+same+' oppo: '+oppo+ ' diff: '+(same-oppo);
}

function showDirectionStat() {
    under = 0;
    over = 0;
    miss = 0;
    for(a=0;a<records.rolls.length;a++) {
        if(records.rolls[a]>50.49) {
            over++;
        }
        else if(records.rolls[a]<49.50) {
            under++;
        }
        else {
            miss++;
        }
    }
    return 'over:' + over + ' under: ' + under + ' miss: '+ miss + ' diff: '+(over-under);
}

setInterval(function() { mainLoop(); }, 1000);