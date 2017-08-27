/*              PRIMEDICE HELPER              */

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


viewReport = {
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

        //viewSetBets.init();
        //viewWinsBeforeLost.init();
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


vm = {
    init: function() {
        viewReport.init();
    },
    getCurrentBalance: function() {
        return parseFloat(ele.myBal.innerText.split(" ")[0]);
    }
};


viewBalanceAndTarget = {
    init: function() {
        document.querySelector('.report-tab').innerHTML += '<div class="balance-and-target"></div>';

        document.querySelector('.balance-and-target').innerHTML += '<p class="current-balance"><span class="prop">C.Balance: </span><span class="value">0</span></p><hr>';

        document.querySelector('.balance-and-target').innerHTML += '<p class="target-income"><span class="prop">T.Income: </span><span class="value">0</span></p>';
        document.querySelector('.balance-and-target').innerHTML += '<p class="current-income"><span class="prop">C.Income: </span><span class="value">0</span></p>';
        document.querySelector('.balance-and-target').innerHTML += '<p class="diff-income"><span class="prop">Diff: </span><span class="value">0</span></p>';
        viewBalanceAndTarget.render();
    },
    render: function() {
        document.querySelector('.current-balance .value').innerHTML = vm.getCurrentBalance().toFixed(8);
        document.querySelector('.target-income .value').innerHTML = model.targetIncomeBeforeStop.toFixed(8);
        document.querySelector('.current-income .value').innerHTML = vm.getCurrentIncome().toFixed(8);
        document.querySelector('.diff-income .value').innerHTML = (model.targetIncomeBeforeStop.toFixed(8)-vm.getCurrentIncome()).toFixed(8);
    }
};

vm.init();