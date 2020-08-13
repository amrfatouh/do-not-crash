var MOVING_CAR_INTERVAL = 5;
var PXLS_MOVED_EACH_FRAME = 0.5;
var LVL_TIME = 8000;
var MAX_LVL = 11;
var INTERVALS_PER_SEC, PXLS_MOVED_PER_SEC, NEW_CAR_COMING_TIME;

const MY_CAR_STARTING_POSITION = 400;
const CAR_HEIGHT = 75;

setTimeRules();

function setTimeRules() {
    INTERVALS_PER_SEC = 1000 / MOVING_CAR_INTERVAL;
    PXLS_MOVED_PER_SEC = INTERVALS_PER_SEC * PXLS_MOVED_EACH_FRAME;
    NEW_CAR_COMING_TIME = (CAR_HEIGHT * 4 / PXLS_MOVED_PER_SEC) * 1000;
}

var score = document.getElementById('score');
var level = document.getElementById('level');
var best = document.getElementById('best');
var moveBtn = document.getElementById('move-btn');
var myCar = document.getElementById('my-car');

function moveCar(carArray) {
    var car = carArray[0];
    myCar.classList.toggle("car-right");
    myCar.classList.toggle("car-left");

    /* checking crashing upon moving the car */
    if (isCrashUponMove(car)) {
        crashed();
    }
}

/* letting the user use the space button */
document.body.onkeydown = handleKeyDown;

function handleKeyDown() {
    moveBtn.blur();
    if(event.code == 'Space') {
        moveCar(carArray);
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
    car.style.top = '0';
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

var speedUpInterval = setInterval(speedUpIntervalFunc, LVL_TIME);

function createCarIntervalFunc() {
    carArray.push(createCar());
    /* notice how the parameters are passed to the setInterval() function */
    intervalArray.push(setInterval(moveCarAndCheckCrash, MOVING_CAR_INTERVAL, carArray[carArray.length - 1]));
}

function speedUpIntervalFunc() {
    var currentLevel = parseInt(level.innerText.slice(7));
    PXLS_MOVED_EACH_FRAME += 0.25;
    setTimeRules();
    clearInterval(createCarInterval);
    createCarInterval = setInterval(createCarIntervalFunc, NEW_CAR_COMING_TIME);
    level.innerText = 'level: ' + (++currentLevel);
    if(currentLevel === MAX_LVL) {
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
    if (parseFloat(car.style.top) >= 500) {
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
    for(var i = 0; i < carArray.length; i++) {
        carArray[i].classList.add('transparent');
    }
    /* disabling inputs */
    moveBtn.disabled = true;
    document.body.onkeydown = reset;
    /* clearing all intervals */
    for (var i = 0; i < intervalArray.length; i++) {
        clearInterval(intervalArray[i]);
    }
    clearInterval(createCarInterval);
    clearInterval(speedUpInterval);
}

function reset () {
    PXLS_MOVED_EACH_FRAME = 0.5;
    setTimeRules();
    level.innerText = 'level: 1';
    /* delete cars */
    while (carArray.length !== 0) {
        removeCar(carArray[0]);
    }
    score.innerText = 'score: 0'; /* must be after removeCar() bec. it increases the score */
    intervalArray = [];
    createCarInterval = setInterval(createCarIntervalFunc, NEW_CAR_COMING_TIME);
    speedUpInterval = setInterval(speedUpIntervalFunc, LVL_TIME);
    /* removing 'crashed!' sign from the screen */
    document.body.removeChild(document.getElementsByClassName('result')[0]);
    /* removing retry button from screen */
    document.body.removeChild(document.getElementsByClassName('retry')[0]);
    /* removing transparency from cars */
    var transparentArray = document.getElementsByClassName('transparent');
    for (var i = 0; i< transparentArray.length; i++) {
        transparentArray[i].classList.remove('transparent');
    }
    /* re-enabling the inputs */
    moveBtn.disabled = false;
    document.body.onkeydown = handleKeyDown;
}