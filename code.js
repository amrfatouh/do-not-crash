var myCar = document.getElementById('my-car');
function moveCar() {
    myCar.classList.toggle("car-right");
    myCar.classList.toggle("car-left");

    /* checking crashing upon moving the car */
    if(isCrashUponMove()) {
        crashed();
    }
}

function isCrashUponMove() {
    var carPosition = parseInt(car.style.top);
    if (carPosition >= 350 && carPosition < 450) {
        return true;
    } else {
        return false;
    }
}

var car = document.createElement('div');
car.classList.add('car', 'opposite-car', 'car-left');
car.style.top = '0';
document.body.appendChild(car);

var oppCarMoving = setInterval(function () {
    /* moving car */
    car.style.top = (parseInt(car.style.top) + 2) + 'px';

    /*checking if the car crashed */
    checkCrashWhileStopping();

    /* removing the car at the end of the road */
    if (parseInt(car.style.top) >= 500) {
        removeCar();
    }

}, 25)

function checkCrashWhileStopping() {
    if (car.style.top === '350px') {
        if (car.classList.contains('car-left') && myCar.classList.contains('car-left')) {
            crashed();
        } else if (car.classList.contains('car-right') && myCar.classList.contains('car-right')) {
            crashed();
        }
    }
}

function removeCar() {
    document.body.removeChild(car);
}

function crashed() {
    var resultText = document.createElement('div');
    resultText.innerText = 'crashed!';
    document.body.appendChild(resultText);
    clearInterval(oppCarMoving);
}