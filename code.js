var MOVING_CAR_INTERVAL = 5;
var PXLS_MOVED_EACH_FRAME = 0.5;
var LVL_TIME = 8000;
var MAX_LVL = 11;
var INTERVALS_PER_SEC, PXLS_MOVED_PER_SEC, NEW_CAR_COMING_TIME;

const MY_CAR_STARTING_POSITION = 400;
const CAR_HEIGHT = 75;

var ROAD_REPITITION_ELEMENT = '-135px';

var TREE_CREATION_TIME, PXLS_BETWEEN_EACH_TREE, PXLS_MOVED_EACH_FRAME_BY_TREE, NUM_OF_TREE_INTERVALS_FOR_CREATION;

function setTimeRules() {
    INTERVALS_PER_SEC = 1000 / MOVING_CAR_INTERVAL;
    PXLS_MOVED_PER_SEC = INTERVALS_PER_SEC * PXLS_MOVED_EACH_FRAME;
    NEW_CAR_COMING_TIME = (CAR_HEIGHT * 4 / PXLS_MOVED_PER_SEC) * 1000;

    PXLS_BETWEEN_EACH_TREE = 200;
    PXLS_MOVED_EACH_FRAME_BY_TREE = PXLS_MOVED_EACH_FRAME / 2;
    NUM_OF_TREE_INTERVALS_FOR_CREATION = PXLS_BETWEEN_EACH_TREE / PXLS_MOVED_EACH_FRAME_BY_TREE;
    TREE_CREATION_TIME = NUM_OF_TREE_INTERVALS_FOR_CREATION * MOVING_CAR_INTERVAL;
    /* setting animation speed */
    currentLevel = parseInt(level.innerText.slice(7));
    MY_CAR_ANIMATION = 0.3 - currentLevel * 0.015;

}

var score = document.getElementById('score');
var level = document.getElementById('level');
var best = document.getElementById('best');
var moveBtn = document.getElementById('move-btn');
var myCar = document.getElementById('my-car');
var road = document.querySelector('.road');

var currentLevel = parseInt(level.innerText.slice(7));
var MY_CAR_ANIMATION = 0.3 - currentLevel * 0.015;

setTimeRules();

function moveCar(carArray) {
    var car = carArray[0];
    myCar.classList.toggle("car-right");
    myCar.classList.toggle("car-left");
    if(myCar.classList.contains('car-left')) {
        myCar.style.animation = `steerLeft ${MY_CAR_ANIMATION}s ease-in-out 1`;

    } else {
        myCar.style.animation = `steerRight ${MY_CAR_ANIMATION}s ease-in-out 1`;
    }

    /* checking crashing upon moving the car */
    if (isCrashUponMove(car)) {
        crashed();
    }
}

/* letting the user use the space button */
document.body.onkeydown = handleKeyDown;

function handleKeyDown() {
    moveBtn.blur();
    if (event.code == 'Space') {
        moveCar(carArray);
        /* deleting any shown menus */
        deleteMenuItem();
        deleteHowToPlay();
    }
}

function isCrashUponMove(car) {
    var carPosition = parseFloat(car.style.top);
    if (carPosition >= MY_CAR_STARTING_POSITION - CAR_HEIGHT && carPosition < MY_CAR_STARTING_POSITION + CAR_HEIGHT) {
        return true;
    } else {
        return false;
    }
}

function createCar() {
    var car = document.createElement('div');
    car.classList.add('car', 'opposite-car');
    car = addDirectionClass(car);
    car.style.top = -1 * CAR_HEIGHT + 'px';
    document.body.appendChild(car);
    return car;
}

function addDirectionClass(car) {
    var dice = Math.ceil(Math.random() * 2);
    switch (dice) {
        case 1:
            car.classList.add('car-left');
            break;
        case 2:
            car.classList.add('car-right');
            break;
    }
    return car
}

var intervalArray = [];
var carArray = [];
var createCarInterval = setInterval(createCarIntervalFunc, NEW_CAR_COMING_TIME);

var treeArray = [];
var treeMovingIntervalArray = [];
var treeCreationInterval = setInterval(treeCreationIntervalFunc, TREE_CREATION_TIME)


var speedUpInterval = setInterval(speedUpIntervalFunc, LVL_TIME);

function createCarIntervalFunc() {
    carArray.push(createCar());
    /* notice how the parameters are passed to the setInterval() function */
    intervalArray.push(setInterval(moveCarAndCheckCrash, MOVING_CAR_INTERVAL, carArray[carArray.length - 1]));
}

function speedUpIntervalFunc() {
    PXLS_MOVED_EACH_FRAME += 0.25;
    setTimeRules();
    clearInterval(createCarInterval);
    createCarInterval = setInterval(createCarIntervalFunc, NEW_CAR_COMING_TIME);
    clearInterval(treeCreationInterval);
    treeCreationInterval = setInterval(treeCreationIntervalFunc, TREE_CREATION_TIME);
    level.innerText = 'level: ' + (++currentLevel);
    myCar.style.transition = `all ${MY_CAR_ANIMATION}s ease-in-out`
    if (currentLevel === MAX_LVL) {
        clearInterval(speedUpInterval);
        level.innerText = 'level: max';
    }
}
function moveCarAndCheckCrash(car) {
    /* moving car */
    car.style.top = (parseFloat(car.style.top) + PXLS_MOVED_EACH_FRAME) + 'px';

    /*checking if the car crashed */
    checkCrashWhileStopping(car);

    /* removing the car at the end of the road */
    if (parseFloat(car.style.top) >= window.innerHeight + CAR_HEIGHT) {
        removeCar(car);
    }
}
function checkCrashWhileStopping(car) {
    if (parseFloat(car.style.top) >= MY_CAR_STARTING_POSITION - CAR_HEIGHT && parseFloat(car.style.top) < MY_CAR_STARTING_POSITION + CAR_HEIGHT) {
        if (car.classList.contains('car-left') && myCar.classList.contains('car-left')) {
            crashed();
        } else if (car.classList.contains('car-right') && myCar.classList.contains('car-right')) {
            crashed();
        }
    }
}
function removeCar(car) {
    document.body.removeChild(car);
    clearInterval(intervalArray[0]);
    intervalArray.shift();
    carArray.shift();
    /* adding score */
    score.innerText = 'score: ' + (parseInt(score.innerText.slice(7)) + 1);
}

/* trees intervals functions */
function treeCreationIntervalFunc() {
    var tree = document.createElement('div');
    tree.className = 'tree';
    tree.classList.add(((Math.ceil(Math.random() * 2)) === 1) ? 'tree-left' : 'tree-right')
    tree.style.top = '-200';
    document.body.appendChild(tree);
    treeArray.push(tree)

    treeMovingIntervalArray.push(setInterval(moveTree, MOVING_CAR_INTERVAL, tree))
}
function moveTree(tree) {
    tree.style.top = (parseFloat(tree.style.top) + PXLS_MOVED_EACH_FRAME / 2) + 'px';
    if (parseFloat(tree.style.top) + tree.offsetHeight > window.innerHeight + 200) {
        removeTree(); 
    }
}
function removeTree() {
    clearInterval(treeMovingIntervalArray[0]);
    treeMovingIntervalArray.shift();
    document.body.removeChild(treeArray[0]);
    treeArray.shift();
}

road.style.top = ROAD_REPITITION_ELEMENT;
var roadInterval = setInterval(roadIntervalFunc, MOVING_CAR_INTERVAL);
function roadIntervalFunc() {
    road.style.top = (parseFloat(road.style.top) + PXLS_MOVED_EACH_FRAME / 2) + 'px';
    if(parseFloat(road.style.top) >= 0 ) {
        road.style.top = ROAD_REPITITION_ELEMENT;
    }
}

function crashed() {
    /* displaying crashed! Div */
    var resultText = document.createElement('div');
    resultText.className = 'result';
    resultText.innerText = 'crashed!';
    document.body.appendChild(resultText);

    /* displaying retry Div */
    var retry = document.createElement('div');
    retry.className = 'retry';
    retry.innerText = 'retry';
    retry.onclick = reset;
    document.body.appendChild(retry);

    /* setting best score */
    if (parseInt(best.innerText.slice(6)) < parseInt(score.innerText.slice(7))) {
        best.innerText = 'best: ' + parseInt(score.innerText.slice(7));
    }
    /* making cars in the background transparent */
    myCar.classList.add('transparent');
    for (var i = 0; i < carArray.length; i++) {
        carArray[i].classList.add('transparent');
    }
    road.classList.add('transparent');
    document.querySelectorAll('.tree').forEach(tree => {
        tree.classList.add('transparent');
    })
    /* disabling inputs */
    moveBtn.disabled = true;
    document.body.onkeydown = reset;
    /* clearing all intervals */
    for (var i = 0; i < intervalArray.length; i++) {
        clearInterval(intervalArray[i]);
    }
    clearInterval(createCarInterval);
    clearInterval(speedUpInterval);
    clearInterval(roadInterval);
    clearInterval(treeCreationInterval);
    treeMovingIntervalArray.forEach(interval => {
        clearInterval(interval);
    })
    clearInterval(checkingInterval);
}

document.body.addEventListener('contextmenu', function (event) {
    /* delete any previous menu items and how to play */
    deleteMenuItem();
    deleteHowToPlay();
    /* making new menu item */
    event.preventDefault();
    var menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerText = 'How to play?';
    menuItem.style.top = event.clientY + 'px';
    menuItem.style.left = event.clientX + 'px';
    document.body.appendChild(menuItem);
    /* showing how to play */
    menuItem.addEventListener('click', function () {
        var howToPlay = document.createElement('div');
        var image = document.createElement('img');
        image.src = 'assets/images/how-to-play.jpg';
        howToPlay.appendChild(image);
        howToPlay.classList.add('how-to-play');
        howToPlay.style.top = menuItem.style.top;
        howToPlay.style.left = menuItem.style.left;
        document.body.appendChild(howToPlay);
    })
})
document.body.addEventListener('click', function () {
    /* checking if the click is on the menu item */
    var menuItem = document.getElementsByClassName('menu-item')[0];
    /* if the menu item exists, check if the click is inside it, otherwise delete the how to play */
    if (menuItem) {
        var x1 = parseInt(menuItem.style.left),
            x2 = x1 + parseInt(menuItem.offsetWidth),
            y1 = parseInt(menuItem.style.top),
            y2 = y1 + parseInt(menuItem.offsetHeight),
            clickX = event.clientX,
            clickY = event.clientY;
        if (!(clickX >= x1 && clickX <= x2 && clickY >= y1 && clickY <= y2)) {
            deleteHowToPlay();
        }
    } else {
        deleteHowToPlay();
    }
    /* deleting menu item */
    deleteMenuItem();
})

function deleteMenuItem() {
    var menuItems = document.getElementsByClassName('menu-item');
    if (menuItems.length !== 0) {
        document.body.removeChild(menuItems[0]);
    }
}
function deleteHowToPlay() {
    var howToPlay = document.getElementsByClassName('how-to-play');
    if (howToPlay.length !== 0) {
        document.body.removeChild(howToPlay[0]);
    }
}


function reset() {
    PXLS_MOVED_EACH_FRAME = 0.5;
    setTimeRules();
    level.innerText = 'level: 1';
    /* delete cars */
    while (carArray.length !== 0) {
        removeCar(carArray[0]);
    }
    /* delete trees */
    while (treeArray.length !== 0) {
        removeTree(treeArray[0]);
    }
    score.innerText = 'score: 0'; /* must be after removeCar() bec. it increases the score */
    /* resetting interval-related variables */
    intervalArray = [];
    treeMovingIntervalArray = [];
    createCarInterval = setInterval(createCarIntervalFunc, NEW_CAR_COMING_TIME);
    speedUpInterval = setInterval(speedUpIntervalFunc, LVL_TIME);
    roadInterval = setInterval(roadIntervalFunc, MOVING_CAR_INTERVAL);
    treeCreationInterval = setInterval(treeCreationIntervalFunc, TREE_CREATION_TIME)
    checkingInterval = setInterval(checkingIntervalFunc, 1000);
    /* removing 'crashed!' sign from the screen */
    document.body.removeChild(document.getElementsByClassName('result')[0]);
    /* removing retry button from screen */
    document.body.removeChild(document.getElementsByClassName('retry')[0]);
    /* removing transparency from cars */
    var transparentArray = document.querySelectorAll('.transparent');
    for (var i = 0; i < transparentArray.length; i++) {
        transparentArray[i].classList.remove('transparent');
    }
    /* re-enabling the inputs */
    moveBtn.disabled = false;
    document.body.onkeydown = handleKeyDown;
    /* deleting any shown menus */
    deleteMenuItem();
    deleteHowToPlay();
}

/* check if the console is working (not enough screen space) */
var checkingInterval = setInterval(checkingIntervalFunc, 1000);
function checkingIntervalFunc() {
    if (window.innerHeight < 400 ) {
        crashed();
        alert('not sufficient screen space!');
    }
}