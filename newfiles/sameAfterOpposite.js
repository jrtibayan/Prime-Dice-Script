// set a pattern

// wait for that pattern then real bet and go back to waiting for next pattern

// reset to base bet after win

model = {
	settings: {
		targetIncome: 0.00020000,
		bet: {
			baseClicks: 11,
			dummyClicks: 3
		},
		pattern: ['OUUUO','UOOOU'],
		betDirection: 'SAME',
		betPatternLength: 7,
		increaseBetUptoNumLoss: 100
	},
	actionArr: [],
	actionIndex: null,
	ele: {
		myBal: document.querySelector(".index__home__header__balance__btc").children[1],
		x2Btn: document.querySelector(".dice__control__content").children[2],
		halfBtn: document.querySelector(".dice__control__content").children[1],
		betInput: document.getElementById("betSize"),
		rollBtn: document.querySelector(".index__home__dice__wrap__cta.btn"),
		lastRollSpan: document.querySelector(".index__home__indicator__inner__number__roll").children[1],
		lastRollContainer: document.querySelector(".index__home__indicator__inner__number__roll"),
		directionSpan: document.querySelector(".index__home__dice__card__bet-ui").children[1].children[1].children[0].children[0].children[0].children[1].children[0],
		lastBetId: document.querySelector(".index__game-stats__table").children[1].children[0].children[0].children[0]
	},
	startBal: null,
	targetBal: null,
	betIsReal: null,
	patternFound: null,
	fillerBetCounter: 0,
	currentBetClicks: null,
	betDirection: null,
	lastRollResult: null,
	lastBetId: null,
	rolls: {
		num: [],
		dir: []
	},
	realBets: [],
	clicked: false,
	largeDelayOnZero: 400,
	largeDelayBaseCount: 400,
	delayOnWaitForResult: 300,
	consecLoss: 0,
	consecLossList: []
};

view = {};

mv = {
	pushToActionArr: function(actionStr) {
		model.actionArr.push(actionStr);
		if( model.actionArr.length > 200 ) {
			model.actionArr.shift();
			model.actionIndex--;
		}
	},
	resetCurrentBetClicksToBase: function() {
		model.currentBetClicks = model.settings.bet.baseClicks;
	},
	increaseCurrentBetClicks: function() {
		model.currentBetClicks++;
	},
	nextAction: function() {
		model.actionIndex++
	},
	recordStartTime: function() {
		stats.current.startTime = new Date();
		//console.log('Start Time: ' + stats.current.startTime);
	},
	recordStartBal: function() {
		model.startBal = this.getMyBal();
		//console.log('Start Balance: ' + model.startBal);
	},
	getMyBal: function() {
		return parseFloat( parseFloat( model.ele.myBal.innerText.split(" ")[0] ).toFixed(8) );
	},
	setBetToZeroAmount: function() {
		for(a=0;a<50;a++) {
			model.ele.halfBtn.click();
		}
	},
	setBetToCurrentBetAmount: function()  {
		this.setBetToZeroAmount();
		var expectedBet = 0;

		for(a=0;a<model.currentBetClicks;a++) {
			if(expectedBet===0) expectedBet = 0.00000001;
			else expectedBet *= 2;
			model.ele.x2Btn.click();
		}
		////console.log('real bet');
		////console.log( this.checkIfSameAsBetAmount(expectedBet) );
	},
	setBetToDummyAmount: function() {
		this.setBetToZeroAmount();
		var expectedBet = 0;
		for(a=0;a<model.settings.bet.dummyClicks;a++) {
			if(expectedBet===0) expectedBet = 0.00000001;
			else expectedBet *= 2;
			model.ele.x2Btn.click();
		}		
		////console.log( this.checkIfSameAsBetAmount(expectedBet) );
	},
	getCurrentBetAmount() { 
		return parseFloat(model.ele.betInput.value).toFixed(8);
	},
	checkIfSameAsBetAmount: function(amount) {
		if( this.getCurrentBetAmount() === amount.toFixed(8) )
			return true
		else 
			return false
	},
	realBetON: function() {
		model.betIsReal = true;
	},
	realBetOFF: function() {
		model.betIsReal = false;
	},
	betReal: function( isBetReal ) {
		if( isBetReal===true || isBetReal===undefined ) {
			////console.log('Betting Real Amount');
			this.realBetON();
		}
		else {
			////console.log('Dummy Bet. Betting ZERO 0');
			this.realBetOFF();
		}
		this.pushToActionArr('set bet amount');
		this.pushToActionArr('set direction');
		this.pushToActionArr('roll dice');
		this.pushToActionArr('wait for new result');
	},
	betDummy: function() {
		this.betReal(false);
	}, 
	getLastBetId: function() {
		return document.querySelector(".index__game-stats__table").children[1].children[0].children[0].children[0].innerText;
	},
	newRollFound: function() {
		//return (model.lastRollResult != model.ele.lastRollSpan.innerText);
		return (model.lastBetId != this.getLastBetId());
	},
	recordLastRollResult: function() {
		model.lastBetId = this.getLastBetId();
		console.log(model.lastBetId);
		model.lastRollResult = model.ele.lastRollSpan.innerText;
		if( model.rolls.num.length >= model.settings.pattern[0].length*3 ) {
			model.rolls.num.shift();
			model.rolls.dir.shift();
		}
		model.rolls.num.push(model.lastRollResult);
		model.rolls.dir.push(this.checkDirection(model.lastRollResult));
		if(model.rolls.num.length>200) {
			model.rolls.num.shift();
			model.rolls.dir.shift();
		}
		////console.log(model.rolls.num);
		////console.log(model.rolls.dir);
	},
	recordRealBets: function() {
		var lastRollIndex = model.rolls.num.length-1;
		model.realBets.push({
			pattern: model.patternFound,
        	rollNum: model.rolls.num[lastRollIndex], 
        	rollDir: model.rolls.dir[lastRollIndex]
		});
	},
	patternFound: function() {
		var startIndex = model.rolls.dir.length - model.settings.pattern[0].length;
		var endIndex = model.rolls.dir.length-1;
		var lastPattern = [];
		for(a=startIndex;a<=endIndex;a++) {
			lastPattern.push(model.rolls.dir[a]);
		}
		if( lastPattern.join('') === model.settings.pattern[0] ){
			model.patternFound = model.settings.pattern[0];
			return true;
		}
		if( lastPattern.join('') === model.settings.pattern[1] ) {
			model.patternFound = model.settings.pattern[1];
			return true;
		}
		return false;
	},
	checkIfIWon: function() {
		return (!this.hasClass(model.ele.lastRollContainer, 'is-negative')); 
	},
	hasClass: function(element, cls) { 
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	},
	checkDirection: function(roll) {
		roll = parseFloat(roll);
		if(roll > 50.49) {
			return 'O';
		} else if(roll < 49.50) {
			return 'U';
		} else {
			return 'M';
		}
	},
	pushFillerBets: function() {
		var lenghtOfPattern = model.settings.pattern[0].length;
		for(a=0;a<lenghtOfPattern;a++) {
			this.betDummy();
		}
		model.fillerBetCounter = lenghtOfPattern;
	},
	randomDirection: function() {
		if( Math.floor(Math.random()*(1-0+1))+0 === 1) {
			this.betOver();
		} else {
			this.betUnder();
		}
	},
	betOver: function() {
		//console.log('betting over');
		var dir = model.ele.directionSpan.innerText;
		model.betDirection = 'ROLL OVER';
		if(dir==='ROLL UNDER') 
			model.ele.directionSpan.click();

	},
	betUnder: function() {
		//console.log('betting under');
		var dir = model.ele.directionSpan.innerText;
		model.betDirection = 'ROLL UNDER';
		if(dir==='ROLL OVER') 
			model.ele.directionSpan.click();
	},
	targetBalanceReached: function() {
		if( mv.getMyBal() >= model.targetBal ) 
			return true;
		return false;
	},
	recordTargetBal: function() {
		model.targetBal = model.startBal + model.settings.targetIncome;
	},
	increaseDelayOnWaitForResult: function() {
		model.delayOnWaitForResult += 50;
	},
	pushToConsecLossList: function(loss) {
		model.consecLossList.push(loss);
	},
	resetConsecLoss: function() {
		model.consecLoss = 0;
	},
	consecLossIncrease: function() {
		model.consecLoss++;
	},
	tallyConsecLoss: function() {
		var lossCount = [];
		var indexOfLoss = null
		for(a=0;a<model.consecLossList.length;a++) {
			indexOfLoss=null;
			for(b=0;b<lossCount.length;b++) {
				if(lossCount[b][0]===model.consecLossList[a]) {
					indexOfLoss = b;
				}
			}
			//console.log(indexOfLoss);
			if(indexOfLoss === null) {
				lossCount.push([model.consecLossList[a], 1]);
			} else {
				//console.log(lossCount[indexOfLoss]);
				lossCount[indexOfLoss][1]++;
			}
		}
		console.log(lossCount);
	}
};

stats = {
	current: {
		startTime: null,
		endTime: null
	},
	history: []
};


function makeBet() {
	var myDelay = 100;
	model.largeDelayOnZero--;

	switch(model.actionArr[model.actionIndex]) {
        case 'init':
            //console.log('initializing...');

            mv.recordStartTime(); // record the time betting started

            mv.recordStartBal(); // store my start bal so i can compare for income

            mv.recordTargetBal();

            mv.recordLastRollResult(); // store starting last roll result

            mv.resetCurrentBetClicksToBase(); // set current bet clicks to base number of clicks

            // wait for pattern
            // set betting for wait for pattern

            mv.betDummy();


            //listenForKeyUp();
            
            
            //recordTargetBal(); // compute target balance and store to stop after reaching desired win.
            //recordLowestBalIfItIsLowest(); // record lowest bal just for stat


            //setDummyBet(); // dummy bet first and find the first win and start betting there
            //mv.pushToActionArr("wait new result");
            mv.nextAction();
        break;

        case 'set bet amount':
        	if( model.betIsReal ) {
        		// bet current real bet clicks
        		if(model.consecLoss<=model.settings.increaseBetUptoNumLoss) 
        			mv.setBetToCurrentBetAmount();
        		else 
        			mv.setBetToDummyAmount();
        		//console.log('real bet: index: '+model.actionIndex);
        	}
        	else {
        		// bet dummy
        		mv.setBetToDummyAmount();
        	}
        	mv.nextAction();
        break;

        case 'set direction':

        	if( model.clicked === false ) {
        		if( model.betIsReal ) {
	        		if( model.realBets.length >= model.settings.betPatternLength ) {
	        			
	        			var previousPatternDirection = mv.checkDirection(model.lastRollResult);
	        			console.log(previousPatternDirection);

	        			//console.log('Last Index of Real Bet : ' + (model.realBets.length-1));
	        			//console.log('Bet Direction Index Base : ' + directionIndex);
	        			//console.log('Bet Direction : ' + previousPatternDirection);

	        			if( model.settings.betDirection === 'SAME' ) {
	        				//console.log('Bettings SAME As Previous Pattern Direction');
	        			} else {
	        				//console.log('Bettings OPPOSITE As Previous Pattern Direction');
	        				if(previousPatternDirection === 'U')
	        					previousPatternDirection = 'O';
	        				else if(previousPatternDirection === 'O') 
	        					previousPatternDirection = 'U';
	        			}

	        			if( previousPatternDirection === 'O' ) {
	        				mv.betOver();
	        			} else if( previousPatternDirection === 'U' ) {
	        				mv.betUnder();
	        			} else {
	        				mv.randomDirection();
	        			}
	        		}

	        		else 
	        			mv.randomDirection();
	        	} else {
	        		mv.randomDirection();
	        	}
	        	model.clicked = true;
        	}
   

        	if( model.betDirection === model.ele.directionSpan.innerText && model.clicked === true ) {
				mv.nextAction();
				model.clicked = false;
        	} else {
        		//console.log('waiting for correct bet direction');
        	}
        	
        break;

        case 'roll dice':
        	model.ele.rollBtn.click();
        	myDelay = model.delayOnWaitForResult;
        	mv.nextAction();
        break;

        case 'wait for new result':
        	if( mv.newRollFound() ) {
        		mv.recordLastRollResult();

        		// check if previous bet is win or lose
    			var myBetWon = mv.checkIfIWon();

    			if( model.betIsReal ) {
    				mv.recordRealBets();
        			if( myBetWon ) {
        				//console.log('Real Bet Win');
        				mv.pushToConsecLossList(model.consecLoss);
        				mv.resetConsecLoss();
        				mv.resetCurrentBetClicksToBase();
        			} else {
        				mv.consecLossIncrease();
        				//console.log('Real Bet Loose');
        				mv.increaseCurrentBetClicks();
        			}

        			//mv.pushFillerBets();        			
        		} else {
        			//console.log('Dummy Bet W/L');
        			if( myBetWon ) {
        				////console.log('Dummy Win'); doesnt matter
        			} else {
        				////console.log('Dummy Lost'); doesnt matter
        			}
        			if( model.fillerBetCounter > 0 )
        				model.fillerBetCounter--;
        		}
        		
        		if( model.fillerBetCounter === 0 ) {

	        		// check if pattern is true
	        		if( mv.patternFound() ) {
	        			//console.log('pattern found');
	        			mv.betReal();
	        		} else {
	        			mv.betDummy();
	        		}

        		} else {
   					// do nothing on filler bets
   					//console.log('*************************filler bet');
        		}
        		mv.nextAction();
        	} else {
        		//mv.increaseDelayOnWaitForResult();
        		//console.log('waiting for new result...');
        	}
        break;
    }

    if( model.largeDelayOnZero === 0 ) {
    	//myDelay = 60000;
    	model.largeDelayOnZero = model.largeDelayBaseCount;
    	//console.log('Long Delay 1 Min');
    }


	if( mv.targetBalanceReached() ) {
		//console.log('Target Balance Reached. Function Will Now Stop Reccurring!');
		stats.current.endTime = new Date();
	} else {
		setTimeout(makeBet, myDelay);
	}
}


mv.pushToActionArr('init');
model.actionIndex = 0;
makeBet();