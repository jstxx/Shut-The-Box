window.onload = function(){
var validcheck = [];
var openTitles = [];
var closedTitles = [];
var selectedThisTurnTiles = [];
var diceSum = 0;

var rollSingleDie = function () {
    disable('dice1');
    disable('dice2');
    disable('rollboth');
    enable('endturn');
    enableAllOpenTiles();
    var outcome = randomOutcome(1, 6);

    this.style.background = 'none';
    this.innerHTML = outcome;
    diceSum = outcome;
    setCurrentRoll(outcome);
};

var IsValid = function (number) {

    //possible combinations
var validSuperSets = [
        [[]], 
        [[1]], 
        [[2]],
        [[1,2],[3]],
        [[1,3],[4]],
        [[1,4],[2,3],[5]],
        [[1,5],[1,2,3],[2,4],[6]],
        [[1,6],[2,5],[1,2,4],[3,4],[7]],
        [[8],[7,1],[2,3,4],[1,2,5],[2,6],[5,3]],
        [[9],[8,1],[7,2],[6,3],[5,4],[1,2,6],[2,3,4]]
];
    //test for valid sums
    var validSets = validSuperSets[number];
    for (var i = 0; i < validSets.length; i++) {
        var set = validSets[i];
        var foundAll = true;
        for (var j = 0; j < set.length; j++) {
            if (openTiles.indexOf(set[j]) == -1) {
                console.log(set[j]);
                foundAll = false;
                break;
            }
        }
        if (foundAll) {
            return true;
        }
    }
    return false;
}

var rollBothDice = function (e) {
    disable(e.target.id);
    enable('endturn');
    enableAllOpenTiles();

    var outcome = randomOutcome(1, 6);
    var outcome2 = randomOutcome(1, 6);
    diceSum = sumDice(outcome, outcome2);
    setCurrentRoll(diceSum);

    clearBackground('dice1');
    clearBackground('dice2');
    setDieOneLabel(outcome);
    setDieTwoLabel(outcome2);

    if (IsValid(diceSum) == false) {
        endGame();
    }
}

var MoveTempClosedTilesToClosedTiles = function () {
    for (var i = 0; i < selectedThisTurnTiles.length; i++) {
        var id = selectedThisTurnTiles[i];
        closedTitles.push(id);
        disable(id);
    }
    selectedThisTurnTiles.length = 0;
}

var ClearSelectedTilesThisTurn = function () {
    for (var i = 0; i < selectedThisTurnTiles.length; i++) {
        var id = selectedThisTurnTiles[i];
        enable(id);
        unfold(id);
        openTiles.push(id);
    }
    selectedThisTurnTiles.length = 0;
}

var UpdateTurnCount = function () {
    var value = document.getElementById('turns').innerHTML;
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('turns').innerHTML = value;
}

var endTurn = function () {
    var sumSelectedTiles = sumArray(selectedThisTurnTiles);

    if (sumSelectedTiles == diceSum) {
        reEnableSingleDiceIfAllowed();
        MoveTempClosedTilesToClosedTiles();
        UpdateTurnCount();
        setOverallScore();
        enable('rollboth');
        enable('endgame');
    } else {
        ClearSelectedTilesThisTurn();
    }
};

var setOverallScore = function () {
    var total = sumArray(openTiles);
    setPlayerScore(total);

    if (total == 0) {
        alert('You Win! Congrats you shut the box!');
        endGame();
    }
};

var handleTileClick = function (event) {
    var value = parseInt(event.target.id, 10);
    var elementIndex = selectedThisTurnTiles.indexOf(value);
    if (elementIndex > -1) {
        selectedThisTurnTiles.splice(elementIndex, 1);
        openTiles.push(value);
        unfold(event.target.id);
        event.target.classList.remove('fold');
    } else {
        openTiles.splice(openTiles.indexOf(value), 1);
        selectedThisTurnTiles.push(value);
        fold(event.target.id);
    }

    if (sumArray(selectedThisTurnTiles) == diceSum && openTiles.length == 0) {
        endGame();
    }
    return false;
};

var checkWin = function () {
    var total = sumArray(openTiles);

    if (total == 0) {
        alert('congrats! you win');
    } else {
        alert('sorry you lost with a score of: ' + total);
    }
}

var endGame = function () {
    checkWin();
    openTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    selectedThisTurnTiles.length = 0;
    closedTitles.length = 0;

    for (var i = 1; i < 10; i++) {
        unfold(i);
    }

    validcheck.length = 0;

    document.getElementById('playerscore').innerHTML = '';
    document.getElementById('turns').innerHTML = '';
    document.getElementById('currentroll').innerHTML = '';
    document.getElementById('rollboth').removeAttribute('disabled');
    setBackgroundToDice('dice1');
    setBackgroundToDice('dice2');
    setDieOneLabel("");
    setDieTwoLabel("");
    return false;
};

//Helper Functions
var reEnableSingleDiceIfAllowed = function () {
    if (validcheck.indexOf(7) > -1 && validcheck.indexOf(8) > -1 && validcheck.indexOf(9) > -1) {
        var elements = document.getElementsByClassName('singlevalid');
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeAttribute('disabled');
        }
    }
};

var randomOutcome = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var sumDice = function (dice1, dice2) {
    var score = dice1 + dice2;
    return score;
};

var enableAllOpenTiles = function () {
    for (var i = 0; i < openTiles.length; i++) {
        enable(openTiles[i]);
    }
}

    function sumArray(array) {
        return array.reduce(function (prev, cur) {
            return prev + cur;
        }, 0);
    }

    function disable(elementId) {
        document.getElementById(elementId).setAttribute('disabled','disabled');
    }

    function enable(elementId) {
        document.getElementById(elementId).removeAttribute('disabled');
    }

    function unfold(elementId) {
        document.getElementById(elementId).classList.remove('fold');
    }

    function fold(elementId) {
        document.getElementById(elementId).classList.add('fold');
    }

    //Set html element values
    function setPlayerScore(score) {
        document.getElementById('playerscore').innerHTML = score;
    }

    function setDieOneLabel(text) {
        document.getElementById('dice1label').innerHTML = text;
    }

    function setDieTwoLabel(text) {
        document.getElementById('dice2label').innerHTML = text;
    }

    function clearBackground(elementId) {
        document.getElementById(elementId).style.background = 'none';
    }

    function setBackgroundToDice(elementId) {
        document.getElementById(elementId).style.background = "";
        document.getElementById(elementId).style.backgroundImage = "url('http://i.imgur.com/dkaBmQf.png')";
    }

    function setCurrentRoll(text) {
        document.getElementById('currentroll').innerHTML = text;
    }

var init = function () {
    UpdateTurnCount();
    openTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    var el = document.getElementById("dice1");
    el.addEventListener("click", rollSingleDie, false);

    var el2 = document.getElementById("dice2");
    el2.addEventListener("click", rollSingleDie, false);

    var el3 = document.getElementById("rollboth");
    el3.addEventListener("click", rollBothDice, false);

    var el5 = document.getElementById("endgame");
    el5.addEventListener("click", endGame, true);

    var el4 = document.getElementById("endturn");
    el4.addEventListener("click", endTurn, false);

    document.querySelector('body').addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'input') {
            switch (event.target.id) {
                case '1':
                    handleTileClick(event);
                    break;
                case '2':
                    handleTileClick(event);
                    break;
                case '3':
                    handleTileClick(event);
                    break;
                case '4':
                    handleTileClick(event);
                    break;
                case '5':
                    handleTileClick(event);
                    break;
                case '6':
                    handleTileClick(event);
                    break;
                case '7':
                    { //check if a single dice can be thrown
                        validcheck.push(parseInt(event.target.id, 10));
                        handleTileClick(event);
                    }
                    break;
                case '8':
                    {
                        validcheck.push(parseInt(event.target.id, 10));
                        handleTileClick(event);
                    }
                    break;
                case '9':
                    {
                        validcheck.push(parseInt(event.target.id, 10));
                        handleTileClick(event);
                    }
                    break;
                default:
                    null;
            }
        }
    });
};

init();
}
