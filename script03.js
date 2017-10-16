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
 *         007 09/03/2017 start 4,000,000 lowest 2,664,413 which is (4,096x327) bet 4,096 OKAY <SO MANY LOSS I LOST COUNT> recovered after 4hours 9AM - 1PM
 *         008 09/04/2017 start 4,000,000 OKAY <2 LOSS>
 *         009 09/05/2017 start 4,000,000 OKAY
 *         010 09/06/2017 start 4,000,000 OKAY <7 Consecutive WIN No LOSS>
 *         011 09/07/2017 start 4,000,000 lowest 2,804,781 OKAY 9AM - 2PM
 *         012 09/08/2017 start 4,000,000 lowest 2,405,747 8:30AM - BUST <MAYBE BECAUSE OF ERRORS or BUG that bets base during dummy bets>
 *         013 09/10/2017 start 20,000 bet 16 OKAY <9 WIN NO LOSS>
 *         014 09/12/2017 start 20,000 bet 16 OKAY
 *         015 09/13/2017 start 20,000 bet 16 OKAY
 *         016 09/17/2017 start 20,000 bet 16 OKAY
 *         017 09/18/2017 start 20,000 bet 16 OKAY
 *
 *      Testing Summary
 *          From 4,000,000 Balance
 *          Lowest Balance: 2,664,413
 *          Which is about 10-11 on 21 loss
 *          Min Balance Required:
 *          Longest Losing Streak:
 *          Longest Run Time: 5 hours
 *          Last Server Seed: 4d96e587cf8b5a2538c1b603ebdcda5e208c7d63be0bf91344995c11c639a6fe
 *
 */

/*      TO DO
 *      []  Clean Manageable Code
 *      []  Record time of Highest  Balance Reached
 *      []  Record time when user WON
 *      []  Add functionality to stop after certain time passed
 *      []  Record the following
 *          [x] Round Result
 *              [x] Number of Loss before win
 *              [x] Won/Lost
 *              [x] Difference in time of Start to Round Win
 *              [x] Round Number
 *              [x] Roll Number
 *
 *
 *      BUGS FOUND ON THIS VERSION
 *          [x] roundCount is not increased when you lost the round
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

currentRound = {
    roundNo: 0,
    rollCountEndOfRound: 0,
    win: false,
    runDuration: 0,
    lossBeforeWin: 0
};

helper = {
    addMinutes: function (date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }
};

stat = {
    lossBeforeWinOnx10Bot: {},
    winLoss: [],
    lowestBal: 1000,
    rounds: {},
    currentNewRounds: [], /* array containing the rounds of the day */
    history: [] /* after the day is finished push all round here */
};

stat.history = [[{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":279,"rollCountEndOfRound":3297,"win":true,"runDuration":269.85095,"lossBeforeWin":1},{"roundNo":26,"rollCountEndOfRound":248,"lossBeforeWin":8,"win":true},{"roundNo":27,"rollCountEndOfRound":281,"lossBeforeWin":32,"win":false},{"roundNo":27,"rollCountEndOfRound":290,"lossBeforeWin":8,"win":true},{"roundNo":28,"rollCountEndOfRound":291,"lossBeforeWin":0,"win":true},{"roundNo":29,"rollCountEndOfRound":296,"lossBeforeWin":4,"win":true},{"roundNo":30,"rollCountEndOfRound":303,"lossBeforeWin":6,"win":true},{"roundNo":31,"rollCountEndOfRound":312,"lossBeforeWin":8,"win":true},{"roundNo":32,"rollCountEndOfRound":324,"lossBeforeWin":11,"win":true},{"roundNo":33,"rollCountEndOfRound":330,"lossBeforeWin":5,"win":true},{"roundNo":34,"rollCountEndOfRound":341,"lossBeforeWin":10,"win":true},{"roundNo":35,"rollCountEndOfRound":380,"lossBeforeWin":38,"win":false},{"roundNo":35,"rollCountEndOfRound":382,"lossBeforeWin":1,"win":true},{"roundNo":36,"rollCountEndOfRound":387,"lossBeforeWin":4,"win":true},{"roundNo":37,"rollCountEndOfRound":396,"lossBeforeWin":8,"win":true},{"roundNo":38,"rollCountEndOfRound":397,"lossBeforeWin":0,"win":true},{"roundNo":39,"rollCountEndOfRound":402,"lossBeforeWin":4,"win":true},{"roundNo":40,"rollCountEndOfRound":444,"lossBeforeWin":41,"win":false},{"roundNo":40,"rollCountEndOfRound":454,"lossBeforeWin":9,"win":true},{"roundNo":41,"rollCountEndOfRound":456,"lossBeforeWin":1,"win":true},{"roundNo":42,"rollCountEndOfRound":457,"lossBeforeWin":0,"win":true},{"roundNo":43,"rollCountEndOfRound":458,"lossBeforeWin":0,"win":true},{"roundNo":44,"rollCountEndOfRound":503,"lossBeforeWin":44,"win":false},{"roundNo":44,"rollCountEndOfRound":511,"lossBeforeWin":7,"win":true},{"roundNo":45,"rollCountEndOfRound":514,"lossBeforeWin":2,"win":true},{"roundNo":46,"rollCountEndOfRound":548,"lossBeforeWin":33,"win":false},{"roundNo":46,"rollCountEndOfRound":555,"lossBeforeWin":6,"win":true},{"roundNo":47,"rollCountEndOfRound":580,"lossBeforeWin":24,"win":false},{"roundNo":47,"rollCountEndOfRound":590,"lossBeforeWin":9,"win":true},{"roundNo":48,"rollCountEndOfRound":605,"lossBeforeWin":14,"win":true},{"roundNo":49,"rollCountEndOfRound":606,"lossBeforeWin":0,"win":true},{"roundNo":50,"rollCountEndOfRound":608,"lossBeforeWin":1,"win":true},{"roundNo":51,"rollCountEndOfRound":650,"lossBeforeWin":41,"win":false},{"roundNo":51,"rollCountEndOfRound":664,"lossBeforeWin":13,"win":true},{"roundNo":52,"rollCountEndOfRound":670,"lossBeforeWin":5,"win":true},{"roundNo":53,"rollCountEndOfRound":676,"lossBeforeWin":5,"win":true},{"roundNo":54,"rollCountEndOfRound":680,"lossBeforeWin":3,"win":true},{"roundNo":55,"rollCountEndOfRound":689,"lossBeforeWin":8,"win":true},{"roundNo":56,"rollCountEndOfRound":693,"lossBeforeWin":3,"win":true},{"roundNo":57,"rollCountEndOfRound":777,"runDuration":38.53023333333333,"lossBeforeWin":83,"win":false},{"roundNo":57,"rollCountEndOfRound":794,"runDuration":39.546683333333334,"lossBeforeWin":16,"win":true},{"roundNo":58,"rollCountEndOfRound":815,"runDuration":40.98011666666666,"lossBeforeWin":20,"win":true},{"roundNo":59,"rollCountEndOfRound":819,"runDuration":41.5302,"lossBeforeWin":3,"win":true},{"roundNo":60,"rollCountEndOfRound":820,"runDuration":41.929966666666665,"lossBeforeWin":0,"win":true},{"roundNo":61,"rollCountEndOfRound":866,"runDuration":45.09681666666667,"lossBeforeWin":45,"win":false},{"roundNo":61,"rollCountEndOfRound":878,"runDuration":45.7067,"lossBeforeWin":11,"win":true},{"roundNo":62,"rollCountEndOfRound":880,"runDuration":45.795033333333336,"lossBeforeWin":1,"win":true},{"roundNo":63,"rollCountEndOfRound":902,"runDuration":46.54838333333333,"lossBeforeWin":21,"win":false},{"roundNo":63,"rollCountEndOfRound":903,"runDuration":46.60171666666667,"lossBeforeWin":0,"win":true},{"roundNo":64,"rollCountEndOfRound":908,"runDuration":46.77355,"lossBeforeWin":4,"win":true},{"roundNo":65,"rollCountEndOfRound":932,"runDuration":48.3634,"lossBeforeWin":23,"win":false},{"roundNo":65,"rollCountEndOfRound":948,"runDuration":49.513400000000004,"lossBeforeWin":15,"win":true},{"roundNo":66,"rollCountEndOfRound":965,"runDuration":50.8634,"lossBeforeWin":16,"win":true},{"roundNo":67,"rollCountEndOfRound":979,"runDuration":51.9968,"lossBeforeWin":13,"win":true},{"roundNo":68,"rollCountEndOfRound":981,"runDuration":52.46333333333334,"lossBeforeWin":1,"win":true},{"roundNo":69,"rollCountEndOfRound":992,"runDuration":53.46335,"lossBeforeWin":10,"win":true},{"roundNo":70,"rollCountEndOfRound":1031,"runDuration":56.34675,"lossBeforeWin":38,"win":false},{"roundNo":70,"rollCountEndOfRound":1043,"runDuration":57.313449999999996,"lossBeforeWin":11,"win":true},{"roundNo":71,"rollCountEndOfRound":1081,"runDuration":60.08003333333333,"lossBeforeWin":37,"win":false},{"roundNo":71,"rollCountEndOfRound":1082,"runDuration":60.4467,"lossBeforeWin":0,"win":true},{"roundNo":72,"rollCountEndOfRound":1088,"runDuration":61.16343333333334,"lossBeforeWin":5,"win":true},{"roundNo":73,"rollCountEndOfRound":1090,"runDuration":61.663850000000004,"lossBeforeWin":1,"win":true},{"roundNo":74,"rollCountEndOfRound":1094,"runDuration":62.330016666666666,"lossBeforeWin":3,"win":true},{"roundNo":75,"rollCountEndOfRound":1098,"runDuration":62.89683333333333,"lossBeforeWin":3,"win":true},{"roundNo":76,"rollCountEndOfRound":1099,"runDuration":63.3305,"lossBeforeWin":0,"win":true},{"roundNo":77,"rollCountEndOfRound":1100,"runDuration":63.72998333333333,"lossBeforeWin":0,"win":true},{"roundNo":78,"rollCountEndOfRound":1109,"runDuration":64.54681666666667,"lossBeforeWin":8,"win":true},{"roundNo":80,"rollCountEndOfRound":1131,"runDuration":197.23851666666667,"lossBeforeWin":21,"win":false},{"roundNo":81,"rollCountEndOfRound":1138,"runDuration":197.48291666666668,"lossBeforeWin":6,"win":true},{"roundNo":82,"rollCountEndOfRound":1150,"runDuration":197.87018333333333,"lossBeforeWin":11,"win":true},{"roundNo":83,"rollCountEndOfRound":1157,"runDuration":198.1102,"lossBeforeWin":6,"win":true},{"roundNo":84,"rollCountEndOfRound":1159,"runDuration":198.19351666666668,"lossBeforeWin":1,"win":true},{"roundNo":85,"rollCountEndOfRound":1166,"runDuration":198.43186666666668,"lossBeforeWin":6,"win":true},{"roundNo":86,"rollCountEndOfRound":1174,"runDuration":198.70523333333333,"lossBeforeWin":7,"win":true},{"roundNo":87,"rollCountEndOfRound":1178,"runDuration":198.85186666666667,"lossBeforeWin":3,"win":true},{"roundNo":88,"rollCountEndOfRound":1185,"runDuration":199.07685,"lossBeforeWin":6,"win":true},{"roundNo":89,"rollCountEndOfRound":1195,"runDuration":199.41355000000001,"lossBeforeWin":9,"win":true},{"roundNo":90,"rollCountEndOfRound":1200,"runDuration":199.58048333333332,"lossBeforeWin":4,"win":true},{"roundNo":91,"rollCountEndOfRound":1205,"runDuration":199.74855,"lossBeforeWin":4,"win":true},{"roundNo":92,"rollCountEndOfRound":1225,"runDuration":200.39373333333333,"lossBeforeWin":19,"win":true},{"roundNo":93,"rollCountEndOfRound":1244,"runDuration":201.01188333333332,"lossBeforeWin":18,"win":true},{"roundNo":94,"rollCountEndOfRound":1251,"runDuration":201.24519999999998,"lossBeforeWin":6,"win":true},{"roundNo":95,"rollCountEndOfRound":1263,"runDuration":201.63855,"lossBeforeWin":11,"win":true},{"roundNo":96,"rollCountEndOfRound":1268,"runDuration":201.81689999999998,"lossBeforeWin":4,"win":true},{"roundNo":97,"rollCountEndOfRound":1311,"runDuration":203.20856666666666,"lossBeforeWin":42,"win":false},{"roundNo":97,"rollCountEndOfRound":1323,"runDuration":203.82021666666665,"lossBeforeWin":11,"win":true},{"roundNo":98,"rollCountEndOfRound":1326,"runDuration":203.92526666666666,"lossBeforeWin":2,"win":true},{"roundNo":99,"rollCountEndOfRound":1327,"runDuration":203.97856666666667,"lossBeforeWin":0,"win":true},{"roundNo":100,"rollCountEndOfRound":1348,"runDuration":204.73875,"lossBeforeWin":20,"win":true},{"roundNo":101,"rollCountEndOfRound":1349,"runDuration":204.78356666666664,"lossBeforeWin":0,"win":true},{"roundNo":102,"rollCountEndOfRound":1367,"runDuration":205.37195,"lossBeforeWin":17,"win":true},{"roundNo":103,"rollCountEndOfRound":1368,"runDuration":205.41856666666666,"lossBeforeWin":0,"win":true},{"roundNo":104,"rollCountEndOfRound":1386,"runDuration":206.002,"lossBeforeWin":17,"win":true},{"roundNo":105,"rollCountEndOfRound":1411,"runDuration":206.81528333333333,"lossBeforeWin":24,"win":false},{"roundNo":105,"rollCountEndOfRound":1418,"runDuration":207.04713333333333,"lossBeforeWin":6,"win":true},{"roundNo":106,"rollCountEndOfRound":1432,"runDuration":207.51191666666668,"lossBeforeWin":13,"win":true},{"roundNo":107,"rollCountEndOfRound":1434,"runDuration":207.58861666666664,"lossBeforeWin":1,"win":true},{"roundNo":108,"rollCountEndOfRound":1452,"runDuration":208.1753,"lossBeforeWin":17,"win":true},{"roundNo":109,"rollCountEndOfRound":1458,"runDuration":208.37876666666668,"lossBeforeWin":5,"win":true},{"roundNo":110,"rollCountEndOfRound":1479,"runDuration":209.06716666666668,"lossBeforeWin":20,"win":true},{"roundNo":111,"rollCountEndOfRound":1488,"runDuration":209.36721666666665,"lossBeforeWin":8,"win":true},{"roundNo":112,"rollCountEndOfRound":1491,"runDuration":209.48875,"lossBeforeWin":2,"win":true},{"roundNo":113,"rollCountEndOfRound":1505,"runDuration":209.94216666666668,"lossBeforeWin":13,"win":true},{"roundNo":114,"rollCountEndOfRound":1512,"runDuration":210.18696666666668,"lossBeforeWin":6,"win":true},{"roundNo":115,"rollCountEndOfRound":1525,"runDuration":210.6038333333333,"lossBeforeWin":12,"win":true},{"roundNo":116,"rollCountEndOfRound":1532,"runDuration":210.84558333333334,"lossBeforeWin":6,"win":true},{"roundNo":117,"rollCountEndOfRound":1533,"runDuration":210.89198333333334,"lossBeforeWin":0,"win":true},{"roundNo":118,"rollCountEndOfRound":1587,"runDuration":212.64386666666667,"lossBeforeWin":53,"win":false},{"roundNo":118,"rollCountEndOfRound":1612,"runDuration":213.447,"lossBeforeWin":24,"win":false},{"roundNo":118,"rollCountEndOfRound":1615,"runDuration":213.55698333333333,"lossBeforeWin":2,"win":true},{"roundNo":119,"rollCountEndOfRound":1622,"runDuration":213.79365,"lossBeforeWin":6,"win":true},{"roundNo":120,"rollCountEndOfRound":1646,"runDuration":214.56201666666666,"lossBeforeWin":23,"win":false},{"roundNo":120,"rollCountEndOfRound":1647,"runDuration":214.60533333333333,"lossBeforeWin":0,"win":true},{"roundNo":121,"rollCountEndOfRound":1664,"runDuration":215.15866666666668,"lossBeforeWin":16,"win":true},{"roundNo":122,"rollCountEndOfRound":1670,"runDuration":215.3554,"lossBeforeWin":5,"win":true},{"roundNo":123,"rollCountEndOfRound":1673,"runDuration":215.46034999999998,"lossBeforeWin":2,"win":true},{"roundNo":124,"rollCountEndOfRound":1679,"runDuration":215.65548333333334,"lossBeforeWin":5,"win":true},{"roundNo":125,"rollCountEndOfRound":1680,"runDuration":215.70201666666665,"lossBeforeWin":0,"win":true},{"roundNo":126,"rollCountEndOfRound":1688,"runDuration":215.97701666666666,"lossBeforeWin":7,"win":true},{"roundNo":127,"rollCountEndOfRound":1695,"runDuration":216.21214999999998,"lossBeforeWin":6,"win":true},{"roundNo":128,"rollCountEndOfRound":1699,"runDuration":216.35866666666666,"lossBeforeWin":3,"win":true},{"roundNo":129,"rollCountEndOfRound":1711,"runDuration":216.74203333333335,"lossBeforeWin":11,"win":true},{"roundNo":130,"rollCountEndOfRound":1714,"runDuration":216.85871666666665,"lossBeforeWin":2,"win":true},{"roundNo":131,"rollCountEndOfRound":1735,"runDuration":217.53368333333336,"lossBeforeWin":20,"win":true},{"roundNo":132,"rollCountEndOfRound":1741,"runDuration":217.73703333333333,"lossBeforeWin":5,"win":true},{"roundNo":133,"rollCountEndOfRound":1745,"runDuration":217.88203333333334,"lossBeforeWin":3,"win":true},{"roundNo":134,"rollCountEndOfRound":1747,"runDuration":217.95870000000002,"lossBeforeWin":1,"win":true},{"roundNo":135,"rollCountEndOfRound":1748,"runDuration":218.00368333333333,"lossBeforeWin":0,"win":true},{"roundNo":136,"rollCountEndOfRound":1754,"runDuration":218.21201666666667,"lossBeforeWin":5,"win":true},{"roundNo":137,"rollCountEndOfRound":1759,"runDuration":218.38703333333333,"lossBeforeWin":4,"win":true},{"roundNo":138,"rollCountEndOfRound":1774,"runDuration":218.87203333333335,"lossBeforeWin":14,"win":true},{"roundNo":139,"rollCountEndOfRound":1777,"runDuration":218.98388333333332,"lossBeforeWin":2,"win":true},{"roundNo":140,"rollCountEndOfRound":1787,"runDuration":219.3188166666667,"lossBeforeWin":9,"win":true},{"roundNo":141,"rollCountEndOfRound":1792,"runDuration":219.48536666666666,"lossBeforeWin":4,"win":true},{"roundNo":142,"rollCountEndOfRound":1806,"runDuration":219.94208333333333,"lossBeforeWin":13,"win":true},{"roundNo":143,"rollCountEndOfRound":1835,"runDuration":220.88705,"lossBeforeWin":28,"win":false},{"roundNo":143,"rollCountEndOfRound":1865,"runDuration":221.85205,"lossBeforeWin":29,"win":false},{"roundNo":143,"rollCountEndOfRound":1875,"runDuration":222.18538333333333,"lossBeforeWin":9,"win":true},{"roundNo":144,"rollCountEndOfRound":1880,"runDuration":222.34893333333332,"lossBeforeWin":4,"win":true},{"roundNo":145,"rollCountEndOfRound":1916,"runDuration":223.51540000000003,"lossBeforeWin":35,"win":false},{"roundNo":145,"rollCountEndOfRound":1922,"runDuration":223.71873333333332,"lossBeforeWin":5,"win":true},{"roundNo":146,"rollCountEndOfRound":1938,"runDuration":224.23706666666666,"lossBeforeWin":15,"win":true},{"roundNo":147,"rollCountEndOfRound":1940,"runDuration":224.31873333333334,"lossBeforeWin":1,"win":true},{"roundNo":148,"rollCountEndOfRound":1951,"runDuration":224.67753333333334,"lossBeforeWin":10,"win":true},{"roundNo":149,"rollCountEndOfRound":1959,"runDuration":224.94208333333333,"lossBeforeWin":7,"win":true},{"roundNo":150,"rollCountEndOfRound":1962,"runDuration":225.0570833333333,"lossBeforeWin":2,"win":true},{"roundNo":151,"rollCountEndOfRound":1966,"runDuration":225.19903333333332,"lossBeforeWin":3,"win":true},{"roundNo":152,"rollCountEndOfRound":1972,"runDuration":225.40208333333334,"lossBeforeWin":5,"win":true},{"roundNo":153,"rollCountEndOfRound":1989,"runDuration":225.94736666666668,"lossBeforeWin":16,"win":true},{"roundNo":154,"rollCountEndOfRound":1990,"runDuration":226.00039999999998,"lossBeforeWin":0,"win":true},{"roundNo":155,"rollCountEndOfRound":2011,"runDuration":226.68876666666665,"lossBeforeWin":20,"win":true},{"roundNo":156,"rollCountEndOfRound":2012,"runDuration":226.73541666666668,"lossBeforeWin":0,"win":true},{"roundNo":157,"rollCountEndOfRound":2021,"runDuration":227.0371,"lossBeforeWin":8,"win":true},{"roundNo":158,"rollCountEndOfRound":2031,"runDuration":227.37376666666665,"lossBeforeWin":9,"win":true},{"roundNo":159,"rollCountEndOfRound":2040,"runDuration":227.67875,"lossBeforeWin":8,"win":true},{"roundNo":160,"rollCountEndOfRound":2042,"runDuration":227.75543333333331,"lossBeforeWin":1,"win":true},{"roundNo":161,"rollCountEndOfRound":2059,"runDuration":228.30731666666668,"lossBeforeWin":16,"win":true},{"roundNo":162,"rollCountEndOfRound":2082,"runDuration":229.05396666666667,"lossBeforeWin":22,"win":false},{"roundNo":162,"rollCountEndOfRound":2084,"runDuration":229.12553333333332,"lossBeforeWin":1,"win":true},{"roundNo":163,"rollCountEndOfRound":2097,"runDuration":229.55238333333332,"lossBeforeWin":12,"win":true},{"roundNo":164,"rollCountEndOfRound":2103,"runDuration":229.74881666666667,"lossBeforeWin":5,"win":true},{"roundNo":165,"rollCountEndOfRound":2106,"runDuration":229.85379999999998,"lossBeforeWin":2,"win":true},{"roundNo":166,"rollCountEndOfRound":2123,"runDuration":230.4038,"lossBeforeWin":16,"win":true},{"roundNo":167,"rollCountEndOfRound":2133,"runDuration":230.73579999999998,"lossBeforeWin":9,"win":true},{"roundNo":168,"rollCountEndOfRound":2137,"runDuration":230.8805833333333,"lossBeforeWin":3,"win":true},{"roundNo":169,"rollCountEndOfRound":2143,"runDuration":231.08406666666667,"lossBeforeWin":5,"win":true},{"roundNo":170,"rollCountEndOfRound":2188,"runDuration":232.53885,"lossBeforeWin":44,"win":false},{"roundNo":170,"rollCountEndOfRound":2189,"runDuration":232.58213333333333,"lossBeforeWin":0,"win":true},{"roundNo":171,"rollCountEndOfRound":2193,"runDuration":232.71725,"lossBeforeWin":3,"win":true},{"roundNo":172,"rollCountEndOfRound":2200,"runDuration":232.94218333333336,"lossBeforeWin":6,"win":true},{"roundNo":173,"rollCountEndOfRound":2212,"runDuration":233.34575,"lossBeforeWin":11,"win":true},{"roundNo":174,"rollCountEndOfRound":2218,"runDuration":233.5538,"lossBeforeWin":5,"win":true},{"roundNo":175,"rollCountEndOfRound":2235,"runDuration":234.10048333333333,"lossBeforeWin":16,"win":true},{"roundNo":176,"rollCountEndOfRound":2238,"runDuration":234.21555,"lossBeforeWin":2,"win":true},{"roundNo":177,"rollCountEndOfRound":2247,"runDuration":234.51251666666667,"lossBeforeWin":8,"win":true},{"roundNo":178,"rollCountEndOfRound":2255,"runDuration":234.7771833333333,"lossBeforeWin":7,"win":true},{"roundNo":179,"rollCountEndOfRound":2286,"runDuration":235.78383333333335,"lossBeforeWin":30,"win":false},{"roundNo":179,"rollCountEndOfRound":2297,"runDuration":236.15388333333334,"lossBeforeWin":10,"win":true},{"roundNo":180,"rollCountEndOfRound":2304,"runDuration":236.38881666666666,"lossBeforeWin":6,"win":true},{"roundNo":181,"rollCountEndOfRound":2305,"runDuration":236.43383333333335,"lossBeforeWin":0,"win":true},{"roundNo":182,"rollCountEndOfRound":2309,"runDuration":236.58216666666667,"lossBeforeWin":3,"win":true},{"roundNo":183,"rollCountEndOfRound":2313,"runDuration":236.7255166666667,"lossBeforeWin":3,"win":true},{"roundNo":184,"rollCountEndOfRound":2325,"runDuration":237.11216666666667,"lossBeforeWin":11,"win":true},{"roundNo":185,"rollCountEndOfRound":2335,"runDuration":237.4605,"lossBeforeWin":9,"win":true},{"roundNo":186,"rollCountEndOfRound":2338,"runDuration":237.56578333333334,"lossBeforeWin":2,"win":true},{"roundNo":187,"rollCountEndOfRound":2356,"runDuration":238.1522,"lossBeforeWin":17,"win":true},{"roundNo":188,"rollCountEndOfRound":2358,"runDuration":238.22885,"lossBeforeWin":1,"win":true},{"roundNo":189,"rollCountEndOfRound":2368,"runDuration":238.55553333333333,"lossBeforeWin":9,"win":true},{"roundNo":190,"rollCountEndOfRound":2403,"runDuration":239.68551666666664,"lossBeforeWin":34,"win":false},{"roundNo":190,"rollCountEndOfRound":2421,"runDuration":240.26721666666666,"lossBeforeWin":17,"win":true},{"roundNo":191,"rollCountEndOfRound":2436,"runDuration":240.75071666666665,"lossBeforeWin":14,"win":true},{"roundNo":192,"rollCountEndOfRound":2445,"runDuration":241.04721666666669,"lossBeforeWin":8,"win":true},{"roundNo":193,"rollCountEndOfRound":2452,"runDuration":241.28055,"lossBeforeWin":6,"win":true},{"roundNo":194,"rollCountEndOfRound":2458,"runDuration":241.49388333333334,"lossBeforeWin":5,"win":true},{"roundNo":195,"rollCountEndOfRound":2459,"runDuration":241.54055000000002,"lossBeforeWin":0,"win":true},{"roundNo":196,"rollCountEndOfRound":2474,"runDuration":242.02553333333333,"lossBeforeWin":14,"win":true},{"roundNo":197,"rollCountEndOfRound":2494,"runDuration":242.68223333333333,"lossBeforeWin":19,"win":true},{"roundNo":198,"rollCountEndOfRound":2497,"runDuration":242.78740000000002,"lossBeforeWin":2,"win":true},{"roundNo":199,"rollCountEndOfRound":2504,"runDuration":243.0372833333333,"lossBeforeWin":6,"win":true},{"roundNo":200,"rollCountEndOfRound":2514,"runDuration":243.3738666666667,"lossBeforeWin":9,"win":true},{"roundNo":201,"rollCountEndOfRound":2519,"runDuration":243.54888333333335,"lossBeforeWin":4,"win":true},{"roundNo":202,"rollCountEndOfRound":2528,"runDuration":243.8539,"lossBeforeWin":8,"win":true},{"roundNo":203,"rollCountEndOfRound":2540,"runDuration":244.24245000000002,"lossBeforeWin":11,"win":true},{"roundNo":204,"rollCountEndOfRound":2546,"runDuration":244.44888333333336,"lossBeforeWin":5,"win":true},{"roundNo":205,"rollCountEndOfRound":2555,"runDuration":244.75723333333332,"lossBeforeWin":8,"win":true},{"roundNo":206,"rollCountEndOfRound":2556,"runDuration":244.8092,"lossBeforeWin":0,"win":true},{"roundNo":207,"rollCountEndOfRound":2558,"runDuration":244.88558333333333,"lossBeforeWin":1,"win":true},{"roundNo":208,"rollCountEndOfRound":2566,"runDuration":245.15393333333336,"lossBeforeWin":7,"win":true},{"roundNo":209,"rollCountEndOfRound":2571,"runDuration":245.32558333333333,"lossBeforeWin":4,"win":true},{"roundNo":210,"rollCountEndOfRound":2612,"runDuration":246.64225,"lossBeforeWin":40,"win":false},{"roundNo":210,"rollCountEndOfRound":2617,"runDuration":246.81893333333335,"lossBeforeWin":4,"win":true},{"roundNo":211,"rollCountEndOfRound":2622,"runDuration":246.9906,"lossBeforeWin":4,"win":true},{"roundNo":212,"rollCountEndOfRound":2641,"runDuration":247.59891666666667,"lossBeforeWin":18,"win":true},{"roundNo":213,"rollCountEndOfRound":2659,"runDuration":248.18725,"lossBeforeWin":17,"win":true},{"roundNo":214,"rollCountEndOfRound":2675,"runDuration":248.7039166666667,"lossBeforeWin":15,"win":true},{"roundNo":215,"rollCountEndOfRound":2720,"runDuration":250.1573,"lossBeforeWin":44,"win":false},{"roundNo":215,"rollCountEndOfRound":2725,"runDuration":250.33228333333332,"lossBeforeWin":4,"win":true},{"roundNo":216,"rollCountEndOfRound":2727,"runDuration":250.40561666666665,"lossBeforeWin":1,"win":true},{"roundNo":217,"rollCountEndOfRound":2733,"runDuration":250.60895,"lossBeforeWin":5,"win":true},{"roundNo":218,"rollCountEndOfRound":2739,"runDuration":250.82395,"lossBeforeWin":5,"win":true},{"roundNo":219,"rollCountEndOfRound":2748,"runDuration":251.11395,"lossBeforeWin":8,"win":true},{"roundNo":220,"rollCountEndOfRound":2760,"runDuration":251.55755,"lossBeforeWin":11,"win":true},{"roundNo":221,"rollCountEndOfRound":2764,"runDuration":251.69395,"lossBeforeWin":3,"win":true},{"roundNo":222,"rollCountEndOfRound":2768,"runDuration":251.829,"lossBeforeWin":3,"win":true},{"roundNo":223,"rollCountEndOfRound":2770,"runDuration":251.90408333333335,"lossBeforeWin":1,"win":true},{"roundNo":224,"rollCountEndOfRound":2840,"runDuration":254.154,"lossBeforeWin":69,"win":false},{"roundNo":224,"rollCountEndOfRound":2856,"runDuration":254.68400000000003,"lossBeforeWin":15,"win":true},{"roundNo":225,"rollCountEndOfRound":2858,"runDuration":254.76063333333335,"lossBeforeWin":1,"win":true},{"roundNo":226,"rollCountEndOfRound":2866,"runDuration":255.02898333333331,"lossBeforeWin":7,"win":true},{"roundNo":227,"rollCountEndOfRound":2867,"runDuration":255.07398333333333,"lossBeforeWin":0,"win":true},{"roundNo":228,"rollCountEndOfRound":2872,"runDuration":255.25065,"lossBeforeWin":4,"win":true},{"roundNo":229,"rollCountEndOfRound":2891,"runDuration":255.87401666666668,"lossBeforeWin":18,"win":true},{"roundNo":230,"rollCountEndOfRound":2898,"runDuration":256.12735,"lossBeforeWin":6,"win":true},{"roundNo":231,"rollCountEndOfRound":2918,"runDuration":256.779,"lossBeforeWin":19,"win":true},{"roundNo":232,"rollCountEndOfRound":2925,"runDuration":257.029,"lossBeforeWin":6,"win":true},{"roundNo":233,"rollCountEndOfRound":2945,"runDuration":257.7090333333333,"lossBeforeWin":19,"win":true},{"roundNo":234,"rollCountEndOfRound":2957,"runDuration":258.1123666666667,"lossBeforeWin":11,"win":true},{"roundNo":235,"rollCountEndOfRound":2969,"runDuration":258.4976,"lossBeforeWin":11,"win":true},{"roundNo":236,"rollCountEndOfRound":2972,"runDuration":258.6158,"lossBeforeWin":2,"win":true},{"roundNo":237,"rollCountEndOfRound":2973,"runDuration":258.6623333333333,"lossBeforeWin":0,"win":true},{"roundNo":238,"rollCountEndOfRound":3021,"runDuration":260.19738333333333,"lossBeforeWin":47,"win":false},{"roundNo":238,"rollCountEndOfRound":3025,"runDuration":260.3373666666667,"lossBeforeWin":3,"win":true},{"roundNo":239,"rollCountEndOfRound":3042,"runDuration":260.88401666666664,"lossBeforeWin":16,"win":true},{"roundNo":240,"rollCountEndOfRound":3049,"runDuration":261.10915,"lossBeforeWin":6,"win":true},{"roundNo":241,"rollCountEndOfRound":3053,"runDuration":261.24403333333333,"lossBeforeWin":3,"win":true},{"roundNo":242,"rollCountEndOfRound":3056,"runDuration":261.34905,"lossBeforeWin":2,"win":true},{"roundNo":243,"rollCountEndOfRound":3064,"runDuration":261.6257166666667,"lossBeforeWin":7,"win":true},{"roundNo":244,"rollCountEndOfRound":3080,"runDuration":262.14905,"lossBeforeWin":15,"win":true},{"roundNo":245,"rollCountEndOfRound":3088,"runDuration":262.41403333333335,"lossBeforeWin":7,"win":true},{"roundNo":246,"rollCountEndOfRound":3098,"runDuration":262.73905,"lossBeforeWin":9,"win":true},{"roundNo":247,"rollCountEndOfRound":3108,"runDuration":263.07738333333333,"lossBeforeWin":9,"win":true},{"roundNo":248,"rollCountEndOfRound":3111,"runDuration":263.1824,"lossBeforeWin":2,"win":true},{"roundNo":249,"rollCountEndOfRound":3115,"runDuration":263.3257,"lossBeforeWin":3,"win":true},{"roundNo":250,"rollCountEndOfRound":3122,"runDuration":263.56905,"lossBeforeWin":6,"win":true},{"roundNo":251,"rollCountEndOfRound":3130,"runDuration":263.8373833333333,"lossBeforeWin":7,"win":true},{"roundNo":252,"rollCountEndOfRound":3140,"runDuration":264.16406666666666,"lossBeforeWin":9,"win":true},{"roundNo":253,"rollCountEndOfRound":3150,"runDuration":264.50073333333336,"lossBeforeWin":9,"win":true},{"roundNo":254,"rollCountEndOfRound":3151,"runDuration":264.5457333333333,"lossBeforeWin":0,"win":true},{"roundNo":255,"rollCountEndOfRound":3154,"runDuration":264.6624166666667,"lossBeforeWin":2,"win":true},{"roundNo":256,"rollCountEndOfRound":3164,"runDuration":265.0007166666667,"lossBeforeWin":9,"win":true},{"roundNo":257,"rollCountEndOfRound":3170,"runDuration":265.21073333333334,"lossBeforeWin":5,"win":true},{"roundNo":258,"rollCountEndOfRound":3178,"runDuration":265.49906666666664,"lossBeforeWin":7,"win":true},{"roundNo":259,"rollCountEndOfRound":3191,"runDuration":265.94075,"lossBeforeWin":12,"win":true},{"roundNo":260,"rollCountEndOfRound":3192,"runDuration":265.99275,"lossBeforeWin":0,"win":true},{"roundNo":261,"rollCountEndOfRound":3193,"runDuration":266.03908333333334,"lossBeforeWin":0,"win":true},{"roundNo":262,"rollCountEndOfRound":3196,"runDuration":266.16408333333334,"lossBeforeWin":2,"win":true},{"roundNo":263,"rollCountEndOfRound":3197,"runDuration":266.2090666666667,"lossBeforeWin":0,"win":true},{"roundNo":264,"rollCountEndOfRound":3200,"runDuration":266.33265,"lossBeforeWin":2,"win":true},{"roundNo":265,"rollCountEndOfRound":3203,"runDuration":266.4390833333333,"lossBeforeWin":2,"win":true},{"roundNo":266,"rollCountEndOfRound":3208,"runDuration":266.62575,"lossBeforeWin":4,"win":true},{"roundNo":267,"rollCountEndOfRound":3210,"runDuration":266.7107833333333,"lossBeforeWin":1,"win":true},{"roundNo":268,"rollCountEndOfRound":3212,"runDuration":266.79245000000003,"lossBeforeWin":1,"win":true},{"roundNo":269,"rollCountEndOfRound":3219,"runDuration":267.0824333333333,"lossBeforeWin":6,"win":true},{"roundNo":270,"rollCountEndOfRound":3223,"runDuration":267.23575,"lossBeforeWin":3,"win":true},{"roundNo":271,"rollCountEndOfRound":3239,"runDuration":267.76576666666665,"lossBeforeWin":15,"win":true},{"roundNo":272,"rollCountEndOfRound":3241,"runDuration":267.8474166666667,"lossBeforeWin":1,"win":true},{"roundNo":273,"rollCountEndOfRound":3244,"runDuration":267.96575,"lossBeforeWin":2,"win":true},{"roundNo":274,"rollCountEndOfRound":3247,"runDuration":268.0824333333333,"lossBeforeWin":2,"win":true},{"roundNo":275,"rollCountEndOfRound":3253,"runDuration":268.32576666666665,"lossBeforeWin":5,"win":true},{"roundNo":276,"rollCountEndOfRound":3259,"runDuration":268.53243333333336,"lossBeforeWin":5,"win":true},{"roundNo":277,"rollCountEndOfRound":3279,"runDuration":269.21743333333336,"lossBeforeWin":19,"win":true},{"roundNo":278,"rollCountEndOfRound":3295,"runDuration":269.76576666666665,"lossBeforeWin":15,"win":true},{"roundNo":279,"rollCountEndOfRound":3297,"runDuration":269.85095,"lossBeforeWin":1,"win":true}],[{"roundNo":1,"rollCountEndOfRound":4,"runDuration":0.12666666666666665,"lossBeforeWin":3,"win":true},{"roundNo":2,"rollCountEndOfRound":6,"runDuration":0.20001666666666665,"lossBeforeWin":1,"win":true},{"roundNo":3,"rollCountEndOfRound":14,"runDuration":0.495,"lossBeforeWin":7,"win":true},{"roundNo":4,"rollCountEndOfRound":17,"runDuration":0.6016833333333333,"lossBeforeWin":2,"win":true},{"roundNo":5,"rollCountEndOfRound":23,"runDuration":0.8283333333333334,"lossBeforeWin":5,"win":true},{"roundNo":6,"rollCountEndOfRound":53,"runDuration":1.84,"lossBeforeWin":29,"win":false},{"roundNo":7,"rollCountEndOfRound":55,"runDuration":1.91835,"lossBeforeWin":1,"win":true},{"roundNo":8,"rollCountEndOfRound":66,"runDuration":2.30835,"lossBeforeWin":10,"win":true},{"roundNo":9,"rollCountEndOfRound":80,"runDuration":2.7867,"lossBeforeWin":13,"win":true},{"roundNo":10,"rollCountEndOfRound":92,"runDuration":3.2066833333333333,"lossBeforeWin":11,"win":true},{"roundNo":11,"rollCountEndOfRound":108,"runDuration":3.7600333333333333,"lossBeforeWin":15,"win":true},{"roundNo":12,"rollCountEndOfRound":109,"runDuration":3.8119500000000004,"lossBeforeWin":0,"win":true},{"roundNo":13,"rollCountEndOfRound":128,"runDuration":5.0434,"lossBeforeWin":18,"win":true},{"roundNo":14,"rollCountEndOfRound":143,"runDuration":5.5217,"lossBeforeWin":14,"win":true},{"roundNo":15,"rollCountEndOfRound":147,"runDuration":5.6667000000000005,"lossBeforeWin":3,"win":true},{"roundNo":16,"rollCountEndOfRound":148,"runDuration":5.713399999999999,"lossBeforeWin":0,"win":true},{"roundNo":17,"rollCountEndOfRound":165,"runDuration":6.256716666666667,"lossBeforeWin":16,"win":true},{"roundNo":18,"rollCountEndOfRound":170,"runDuration":6.4333833333333335,"lossBeforeWin":4,"win":true},{"roundNo":19,"rollCountEndOfRound":182,"runDuration":6.826716666666667,"lossBeforeWin":11,"win":true}],[{"roundNo":1,"rollCountEndOfRound":10,"runDuration":0.3551,"lossBeforeWin":9,"win":true},{"roundNo":2,"rollCountEndOfRound":42,"runDuration":2.7361666666666666,"lossBeforeWin":31,"win":false},{"roundNo":3,"rollCountEndOfRound":43,"runDuration":3.102733333333333,"lossBeforeWin":0,"win":true},{"roundNo":4,"rollCountEndOfRound":66,"runDuration":5.036033333333333,"lossBeforeWin":22,"win":false},{"roundNo":5,"rollCountEndOfRound":71,"runDuration":5.619266666666666,"lossBeforeWin":4,"win":true},{"roundNo":6,"rollCountEndOfRound":73,"runDuration":5.8028,"lossBeforeWin":1,"win":true},{"roundNo":7,"rollCountEndOfRound":80,"runDuration":6.553116666666667,"lossBeforeWin":6,"win":true},{"roundNo":8,"rollCountEndOfRound":84,"runDuration":7.11935,"lossBeforeWin":3,"win":true},{"roundNo":9,"rollCountEndOfRound":87,"runDuration":7.636116666666666,"lossBeforeWin":2,"win":true},{"roundNo":10,"rollCountEndOfRound":97,"runDuration":8.6028,"lossBeforeWin":9,"win":true},{"roundNo":11,"rollCountEndOfRound":98,"runDuration":9.0028,"lossBeforeWin":0,"win":true},{"roundNo":12,"rollCountEndOfRound":108,"runDuration":9.902733333333334,"lossBeforeWin":9,"win":true},{"roundNo":13,"rollCountEndOfRound":135,"runDuration":11.686100000000001,"lossBeforeWin":26,"win":false},{"roundNo":14,"rollCountEndOfRound":145,"runDuration":12.519416666666666,"lossBeforeWin":9,"win":true},{"roundNo":15,"rollCountEndOfRound":147,"runDuration":12.969433333333335,"lossBeforeWin":1,"win":true},{"roundNo":16,"rollCountEndOfRound":149,"runDuration":13.4194,"lossBeforeWin":1,"win":true},{"roundNo":17,"rollCountEndOfRound":170,"runDuration":14.886116666666668,"lossBeforeWin":20,"win":true},{"roundNo":18,"rollCountEndOfRound":184,"runDuration":15.83605,"lossBeforeWin":13,"win":true},{"roundNo":19,"rollCountEndOfRound":199,"runDuration":16.969433333333335,"lossBeforeWin":14,"win":true},{"roundNo":20,"rollCountEndOfRound":204,"runDuration":17.602683333333335,"lossBeforeWin":4,"win":true},{"roundNo":21,"rollCountEndOfRound":231,"runDuration":19.852683333333335,"lossBeforeWin":26,"win":false},{"roundNo":22,"rollCountEndOfRound":243,"runDuration":20.80278333333333,"lossBeforeWin":11,"win":true},{"roundNo":23,"rollCountEndOfRound":248,"runDuration":21.40266666666667,"lossBeforeWin":4,"win":true},{"roundNo":24,"rollCountEndOfRound":249,"runDuration":21.45835,"lossBeforeWin":0,"win":true},{"roundNo":25,"rollCountEndOfRound":256,"runDuration":21.9527,"lossBeforeWin":6,"win":true},{"roundNo":26,"rollCountEndOfRound":276,"runDuration":23.336066666666667,"lossBeforeWin":19,"win":true},{"roundNo":27,"rollCountEndOfRound":288,"runDuration":24.33615,"lossBeforeWin":11,"win":true},{"roundNo":28,"rollCountEndOfRound":290,"runDuration":24.786,"lossBeforeWin":1,"win":true},{"roundNo":29,"rollCountEndOfRound":292,"runDuration":25.236066666666666,"lossBeforeWin":1,"win":true},{"roundNo":30,"rollCountEndOfRound":299,"runDuration":25.969416666666667,"lossBeforeWin":6,"win":true},{"roundNo":31,"rollCountEndOfRound":307,"runDuration":26.75275,"lossBeforeWin":7,"win":true},{"roundNo":32,"rollCountEndOfRound":324,"runDuration":28.036083333333334,"lossBeforeWin":16,"win":true},{"roundNo":33,"rollCountEndOfRound":342,"runDuration":29.336483333333334,"lossBeforeWin":17,"win":true},{"roundNo":34,"rollCountEndOfRound":349,"runDuration":30.069383333333334,"lossBeforeWin":6,"win":true},{"roundNo":35,"rollCountEndOfRound":352,"runDuration":30.569366666666667,"lossBeforeWin":2,"win":true},{"roundNo":36,"rollCountEndOfRound":364,"runDuration":31.569416666666665,"lossBeforeWin":11,"win":true},{"roundNo":37,"rollCountEndOfRound":370,"runDuration":32.252766666666666,"lossBeforeWin":5,"win":true},{"roundNo":38,"rollCountEndOfRound":383,"runDuration":33.30271666666667,"lossBeforeWin":12,"win":true},{"roundNo":39,"rollCountEndOfRound":408,"runDuration":35.33618333333333,"lossBeforeWin":24,"win":false},{"roundNo":40,"rollCountEndOfRound":411,"runDuration":35.85288333333333,"lossBeforeWin":2,"win":true},{"roundNo":41,"rollCountEndOfRound":414,"runDuration":36.369299999999996,"lossBeforeWin":2,"win":true},{"roundNo":42,"rollCountEndOfRound":447,"runDuration":38.785999999999994,"lossBeforeWin":32,"win":false},{"roundNo":43,"rollCountEndOfRound":478,"runDuration":41.05276666666667,"lossBeforeWin":30,"win":false},{"roundNo":44,"rollCountEndOfRound":506,"runDuration":43.452733333333335,"lossBeforeWin":27,"win":false},{"roundNo":45,"rollCountEndOfRound":519,"runDuration":44.586083333333335,"lossBeforeWin":12,"win":true},{"roundNo":46,"rollCountEndOfRound":528,"runDuration":45.68615,"lossBeforeWin":8,"win":true},{"roundNo":47,"rollCountEndOfRound":529,"runDuration":46.11945,"lossBeforeWin":0,"win":true},{"roundNo":48,"rollCountEndOfRound":536,"runDuration":46.969433333333335,"lossBeforeWin":6,"win":true},{"roundNo":49,"rollCountEndOfRound":541,"runDuration":47.65271666666667,"lossBeforeWin":4,"win":true},{"roundNo":50,"rollCountEndOfRound":546,"runDuration":48.33611666666666,"lossBeforeWin":4,"win":true},{"roundNo":51,"rollCountEndOfRound":552,"runDuration":49.15271666666667,"lossBeforeWin":5,"win":true},{"roundNo":52,"rollCountEndOfRound":553,"runDuration":49.61943333333333,"lossBeforeWin":0,"win":true},{"roundNo":53,"rollCountEndOfRound":566,"runDuration":50.802749999999996,"lossBeforeWin":12,"win":true},{"roundNo":54,"rollCountEndOfRound":569,"runDuration":50.98003333333334,"lossBeforeWin":2,"win":true},{"roundNo":55,"rollCountEndOfRound":573,"runDuration":51.193666666666665,"lossBeforeWin":3,"win":true},{"roundNo":56,"rollCountEndOfRound":580,"runDuration":51.60015,"lossBeforeWin":6,"win":true},{"roundNo":57,"rollCountEndOfRound":594,"runDuration":52.68605,"lossBeforeWin":13,"win":true},{"roundNo":58,"rollCountEndOfRound":609,"runDuration":54.25275,"lossBeforeWin":14,"win":true},{"roundNo":59,"rollCountEndOfRound":610,"runDuration":54.68606666666667,"lossBeforeWin":0,"win":true},{"roundNo":60,"rollCountEndOfRound":623,"runDuration":56.019400000000005,"lossBeforeWin":12,"win":true},{"roundNo":61,"rollCountEndOfRound":626,"runDuration":56.585966666666664,"lossBeforeWin":2,"win":true},{"roundNo":62,"rollCountEndOfRound":648,"runDuration":58.26933333333333,"lossBeforeWin":21,"win":false},{"roundNo":63,"rollCountEndOfRound":652,"runDuration":58.71841666666667,"lossBeforeWin":3,"win":true},{"roundNo":64,"rollCountEndOfRound":655,"runDuration":58.83176666666667,"lossBeforeWin":2,"win":true},{"roundNo":65,"rollCountEndOfRound":660,"runDuration":59.086083333333335,"lossBeforeWin":4,"win":true},{"roundNo":66,"rollCountEndOfRound":666,"runDuration":59.736216666666664,"lossBeforeWin":5,"win":true},{"roundNo":67,"rollCountEndOfRound":668,"runDuration":60.1862,"lossBeforeWin":1,"win":true},{"roundNo":68,"rollCountEndOfRound":673,"runDuration":60.68006666666667,"lossBeforeWin":4,"win":true},{"roundNo":69,"rollCountEndOfRound":678,"runDuration":61.152966666666664,"lossBeforeWin":4,"win":true},{"roundNo":70,"rollCountEndOfRound":690,"runDuration":62.20278333333333,"lossBeforeWin":11,"win":true},{"roundNo":71,"rollCountEndOfRound":694,"runDuration":62.78605,"lossBeforeWin":3,"win":true},{"roundNo":72,"rollCountEndOfRound":710,"runDuration":64.08606666666667,"lossBeforeWin":15,"win":true},{"roundNo":73,"rollCountEndOfRound":723,"runDuration":65.2031,"lossBeforeWin":12,"win":true},{"roundNo":74,"rollCountEndOfRound":729,"runDuration":65.86945,"lossBeforeWin":5,"win":true},{"roundNo":75,"rollCountEndOfRound":730,"runDuration":66.26946666666667,"lossBeforeWin":0,"win":true},{"roundNo":76,"rollCountEndOfRound":737,"runDuration":67.00271666666667,"lossBeforeWin":6,"win":true},{"roundNo":77,"rollCountEndOfRound":746,"runDuration":67.81943333333334,"lossBeforeWin":8,"win":true},{"roundNo":78,"rollCountEndOfRound":749,"runDuration":68.31951666666667,"lossBeforeWin":2,"win":true},{"roundNo":79,"rollCountEndOfRound":781,"runDuration":70.65236666666667,"lossBeforeWin":31,"win":false},{"roundNo":80,"rollCountEndOfRound":795,"runDuration":71.70223333333334,"lossBeforeWin":13,"win":true},{"roundNo":81,"rollCountEndOfRound":797,"runDuration":72.15249999999999,"lossBeforeWin":1,"win":true},{"roundNo":82,"rollCountEndOfRound":803,"runDuration":72.80223333333333,"lossBeforeWin":5,"win":true},{"roundNo":83,"rollCountEndOfRound":806,"runDuration":73.30228333333334,"lossBeforeWin":2,"win":true},{"roundNo":84,"rollCountEndOfRound":811,"runDuration":73.90231666666666,"lossBeforeWin":4,"win":true},{"roundNo":85,"rollCountEndOfRound":820,"runDuration":75.06901666666666,"lossBeforeWin":8,"win":true},{"roundNo":86,"rollCountEndOfRound":828,"runDuration":75.70953333333334,"lossBeforeWin":7,"win":true},{"roundNo":87,"rollCountEndOfRound":829,"runDuration":75.7562,"lossBeforeWin":0,"win":true},{"roundNo":88,"rollCountEndOfRound":831,"runDuration":75.83953333333334,"lossBeforeWin":1,"win":true},{"roundNo":89,"rollCountEndOfRound":833,"runDuration":75.91619999999999,"lossBeforeWin":1,"win":true},{"roundNo":90,"rollCountEndOfRound":839,"runDuration":76.2189,"lossBeforeWin":5,"win":true}]];

rolls = [];

startBal = 0;
startTime = null;
betx2Clicks = 5; //5 //13

targetIncome = 0.00001000; // 1k // 240k
targetBal = 0;
waitForWin = 21;

lossBeforeWinOnx10BotCounter = 0;
roundCount = 1;
rollCount = 0;
consecLost = 0;
actionArr = [];
lastRollResult = null;
betting =  null;


function getMyBal() { return parseFloat(ele.myBal.innerText.split(" ")[0]).toFixed(8); }
function getBetInput() { return parseFloat(ele.betInput.value).toFixed(8); }
function getCurrentDirection() { return ele.directionSpan.innerText; }

function recordStartBal() { startBal = parseFloat(getMyBal()); }
function recordStartTime() { startTime = new Date(); }

function getDifferenceFromStartTime() {
    var timeNow = new Date();
    var diffInMins = (timeNow.getTime()-startTime.getTime())/1000/60;
    return diffInMins;
}

function findConsecLoss(){
    var highestConsec = 0;
    var consec=[];
    for(a = 0; a < stat.history.length; a++) {
        for(b = 0, consecLossCount = 0; b < stat.history[a].length; b++) {
            if(stat.history[a][b].win === false) {
                consecLossCount++;
            }
            else {
                if(highestConsec < consecLossCount) {
                    highestConsec = consecLossCount;
                    consec = [];
                }
                if(highestConsec == consecLossCount) {
                    consec.push({consec:highestConsec,dayIndex:a,roundIndex:b-1});
                }
                consecLossCount = 0;
            }
        }
    }
    return consec;
}

function recordTargetBal() { targetBal = startBal + targetIncome; }
function recordLowestBalIfItIsLowest() { if( stat.lowestBal > parseFloat(getMyBal()) ) { stat.lowestBal = parseFloat(getMyBal()); } }

function copyHistory() { copy(JSON.stringify(stat.history)) };
function copyTodayRounds() { copy(JSON.stringify(stat.currentNewRounds)) };

function hasClass(element, cls) { return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1; }

function iWon() { return (!hasClass(ele.lastRollContainer, 'is-negative')); }

function newRollFound() { return (lastRollResult != ele.lastRollSpan.innerText); }

function recordRoundResult(wOrL) {
    stat.rounds['round'+roundCount] = wOrL + '-' + getMyBal();
    console.log('Round ' + roundCount + ' result [' + stat.rounds['round'+roundCount] + ']' );
    roundCount++; // new round
}

function pushToCurrentNewRounds(round) {
    stat.currentNewRounds.push({
        roundNo: round.roundNo,
        rollCountEndOfRound: round.rollCountEndOfRound,
        runDuration: round.runDuration,
        lossBeforeWin: round.lossBeforeWin,
        win: round.win
    });
}

function pushToHistory(todaysRounds) {
    stat.history.push(todaysRounds);
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
    pushToHistory(stat.currentNewRounds);
    console.log("Stopping.. Reached target balance");
    console.log("Started with " + parseFloat(startBal).toFixed(8));
    console.log("Current Bal  " + getMyBal());
    console.log("\n\n Please use copyTodayRounds or copyHistory function and add stat to your code.");
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

        currentRound.roundNo = currentRound.roundNo+1;
        currentRound.rollCountEndOfRound = rollCount;
        currentRound.runDuration = getDifferenceFromStartTime();
        currentRound.lossBeforeWin = lossBeforeWinOnx10BotCounter;
        currentRound.win = (lossBeforeWinOnx10BotCounter>=21) ? false:true;

        pushToCurrentNewRounds(currentRound);

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
            recordStartTime();
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
                rollCount++;

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
