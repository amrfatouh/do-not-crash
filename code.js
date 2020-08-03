var MOVING_CAR_INTERVAL = 5;
var PXLS_MOVED_EACH_FRAME = 0.5;
var LVL_TIME = 7000;
var INTERVALS_PER_SEC, PXLS_MOVED_PER_SEC, NEW_CAR_COMING_TIME;
setTimeRules();

function setTimeRules() {
    INTERVALS_PER_SEC = 1000 / MOVING_CAR_INTERVAL;
    PXLS_MOVED_PER_SEC = INTERVALS_PER_SEC * PXLS_MOVED_EACH_FRAME;
    NEW_CAR_COMING_TIME = 200 / PXLS_MOVED_PER_SEC * 1000;
}


var score = document.getElementById('score');
var level = document.getElementById('level');
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

function isCrashUponMove(car) {
    var carPosition = parseFloat(car.style.top);
    if (carPosition >= 350 && carPosition < 450) {
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

var createCarInterval;
createCarInterval = setInterval(createCarIntervalFunc, NEW_CAR_COMING_TIME);

var speedupInterval = setInterval(function () {
    PXLS_MOVED_EACH_FRAME += 0.25;
    setTimeRules();
    clearInterval(createCarInterval);
    createCarInterval = setInterval(createCarIntervalFunc, NEW_CAR_COMING_TIME);
    level.innerText = 'level: ' + (parseInt(level.innerText.slice(7)) + 1);
}, LVL_TIME)

function createCarIntervalFunc() {
    carArray.push(createCar());
    /* notice how the parameters are passed to the setInterval() function */
    intervalArray.push(setInterval(moveCarAndCheckCrash, MOVING_CAR_INTERVAL, carArray[carArray.length - 1]));
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
    if (parseFloat(car.style.top) >= 350 && parseFloat(car.style.top) < 450) {
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
    var resultText = document.createElement('div');
    resultText.className = 'result';
    myCar.classList.add('transparent');
    for(var i = 0; i < carArray.length; i++) {
        carArray[i].classList.add('transparent');
    }
    resultText.innerText = 'crashed!';
    moveBtn.disabled = true;
    document.body.appendChild(resultText);
    for (var i = 0; i < intervalArray.length; i++) {
        clearInterval(intervalArray[i]);
    }
    clearInterval(createCarInterval);
    clearInterval(speedupInterval);
}