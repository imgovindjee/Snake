// Defining Constants

// sounds
const foodSound = new Audio('assests/food.mp3');
const moveSound = new Audio('assests/move.mp3');
const gameOverSound = new Audio('assests/gameOver.mp3');

// repainting parameters
let lastPaintTime = 0;
let speed = 9;

// food and snake parameters
let food = { x: 6, y: 9 };
let snakeArray = [{ x: 13, y: 15 }];

// control
let start = false;
let inputDirection = { x: 0, y: -1 };
let a = 2;
let b = 16;


// dom elements
const board = document.getElementById('board');
const menuCard = document.getElementById('menu');


// Main function
const main = (currTime) => {
    window.requestAnimationFrame(main);
    if ((currTime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = currTime;
    gameEngine(start);
    start && (menuCard.style.display = 'none');
    if (!start) {
        menuCard.style.display = 'flex';
    }
};

// collision checker

const hasCollided = (snakeArr) => {
    const head = snakeArr[0];
    if (head.x > 17 || head.x < 0 || head.y > 17 || head.y < 0) {
        return true;
    }
    for (let i = 1; i < snakeArr.length; i++) {
        const segment = snakeArr[i];
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    return false;
};


// Game Funtion - this creates the food and snake - add controls in this

const gameEngine = (continueGame) => {

    // check if snake is collided or not

    if (continueGame) {
        if (hasCollided(snakeArray)) {
            // assign random locations and initiate the snake size with 1
            start = false;
            food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
            snakeArray.length = 0;
            snakeArray.push({ x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) });
        }

        // eating logic
        if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
            foodSound.play();
            snakeArray.unshift({ x: inputDirection.x + snakeArray[0].x, y: inputDirection.y + snakeArray[0].y });
            food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        }



        // moving the snake - 2 parts
        // 1st - Move the body parts to prev part 
        // 2nd - Move head in user direction

        for (let i = snakeArray.length - 2; i >= 0; i--) {
            snakeArray[i + 1] = { ...snakeArray[i] };
        }
        snakeArray[0].x += inputDirection.x;
        snakeArray[0].y += inputDirection.y;

    }


    // board should be reset for every repaint - else - childs get appended
    board.innerHTML = '';

    // Render snake
    snakeArray.forEach((ele, i) => {
        let snakeSegment = document.createElement('div');
        snakeSegment.style.gridRowStart = ele.y;
        snakeSegment.style.gridColumnStart = ele.x;
        // differentiate head and body
        snakeSegment.classList.add(i === 0 ? 'head' : 'snakeBody');
        board.appendChild(snakeSegment);
    });


    //  Render food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

};



// Run Logic

// control with arrow keys
window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (!(inputDirection.x === 0 && inputDirection.y === 1 && snakeArray.length > 1)) {
                moveSound.play();
                inputDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (!(inputDirection.x === 0 && inputDirection.y === -1 && snakeArray.length > 1)) {
                moveSound.play();
                inputDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (!(inputDirection.x === 1 && inputDirection.y === 0 && snakeArray.length > 1)) {
                moveSound.play();
                inputDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (!(inputDirection.y === 0 && inputDirection.x === -1 && snakeArray.length > 1)) {
                moveSound.play();
                inputDirection = { x: 1, y: 0 };
            }
            break;
        case 'Enter':
            // start the game
            start = true;
            break;
        default:
            // pause the game
            start = false;
            break;
    }
});