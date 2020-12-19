let snakeSpeed = 3; // set how fast snake moves 1 = slow, 10 = very fast
let lastRender = 0;

// Snake starting place
let snakeBody = [{ x: 11, y: 11 }]
let inputDirection = { x: 0, y: 0 }

// Store last direction to prevent snake moving to another direction
let lastInputDirection = { x: 0, y: 0 }

// Store where food is
let foodBody = [{ x: 0, y: 0 }]

// Get Dom element for the gametapel
const board = document.getElementById('game-board');

// Direction codes from mobile devise to turn snake
document.getElementById('left').addEventListener('click', left, false)
document.getElementById('right').addEventListener('click', right, false)
document.getElementById('upp').addEventListener('click', upp, false)
document.getElementById('down').addEventListener('click', down, false)

function left() {
    if (lastInputDirection.x !== 0) return // Prevent  snake going backward
    inputDirection.x = -1
    inputDirection.y = 0
    lastInputDirection = inputDirection
}

function right() {
    if (lastInputDirection.x !== 0) return // Prevent  snake going backward
    inputDirection.x = 1
    inputDirection.y = 0
    lastInputDirection = inputDirection
}

function upp() {
    if (lastInputDirection.y !== 0) return // Prevent  snake going backward
    inputDirection.x = 0
    inputDirection.y = -1
    lastInputDirection = inputDirection
}

function down() {
    if (lastInputDirection.y !== 0) return // Prevent  snake going backward
    inputDirection.x = 0
    inputDirection.y = 1
    lastInputDirection = inputDirection
}


// Direction codes from the keyboard to turn snake
window.addEventListener('keydown', moveSnake, false);
function moveSnake(e) {
    switch (e.keyCode) {
        case 37:
            // left key pressed
            if (lastInputDirection.x !== 0) break // Prevent  snake going backward
            inputDirection = { x: -1, y: 0 }
            break;
        case 38:
            // up key pressed
            if (lastInputDirection.y !== 0) break // Prevent  snake going backward
            inputDirection = { x: 0, y: -1 }
            break;
        case 39:
            // right key pressed
            if (lastInputDirection.x !== 0) break // Prevent  snake going backward
            inputDirection = { x: 1, y: 0 }
            break;
        case 40:
            // down key pressed
            if (lastInputDirection.y !== 0) break // Prevent  snake going backward
            inputDirection = { x: 0, y: 1 }
            break;
    }

    // Store last key input to a lastInputDirection variable
    lastInputDirection = inputDirection
}


// loop for the game animation
function Main(currentTime) {
    window.requestAnimationFrame(Main)
    const sekondFromLast = (currentTime - lastRender) / 1000
    if (sekondFromLast < 1 / snakeSpeed) return
    // anything in here will be done forever in a gameloop
    Update();
    Draw();
    lastRender = currentTime
}

window.requestAnimationFrame(Main);

// Create random place for new food, so that food can't be where snake is
function CreateFood() {
    let deleteNumX, deleteNumY, a, b

    // Arrays to generate random food place
    let foodX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    let foodY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

    // Remove all snake places from the foodX array
    for (let i = 0; i < snakeBody.length; i++) {
        deleteNumX = snakeBody[i].x
        a = foodX.indexOf(deleteNumX)
        if (a >= 0) {
            foodX.splice(a, 1)
        }
    }

    // Remove all snake places from the foodY array
    for (let i = 0; i < snakeBody.length; i++) {
        deleteNumY = snakeBody[i].y
        b = foodY.indexOf(deleteNumY)
        if (b >= 0) {
            foodY.splice(b, 1)
        }
    }

    // Random place from foodX and foodY arrays where snake numbers is removed
    let numX = Math.floor(Math.random() * foodX.length);
    let numY = Math.floor(Math.random() * foodY.length);

    let x = foodX[numX]
    let y = foodY[numY]

    foodBody = [{ x: x, y: y }]

}

// Create first food on game start
CreateFood()

let gameEnded = false

function Update() {
    // Stop snake if it hit itself
    let snakeHead = snakeBody[0]
    let snakeWithoutHead = snakeBody.filter(function (x) { return x !== snakeHead; });
    if (snakeBody.length >= 3) {
        if (snakeWithoutHead.some(item => item.x === snakeBody[0].x & item.y === snakeBody[0].y)) {
            if (!gameEnded) {
                GameOver()
                gameEnded = true
            }
            return
        }

    }

    // Stop the snake if it hit the wall and end game
    if (gameEnded) return

    if (snakeBody[0].x == 1 && lastInputDirection.x == -1 && lastInputDirection.y == 0) {
        if (!gameEnded) {
            GameOver()
            gameEnded = true
        }
        return
    }

    if (snakeBody[0].x == 21 && lastInputDirection.x == 1 && lastInputDirection.y == 0) {
        if (!gameEnded) {
            GameOver()
            gameEnded = true
        }
        return
    }

    if (snakeBody[0].y == 21 && lastInputDirection.x == 0 && lastInputDirection.y == 1) {
        if (!gameEnded) {
            GameOver()
            gameEnded = true
        }
        return
    }

    if (snakeBody[0].y == 1 && lastInputDirection.x == 0 && lastInputDirection.y == -1) {
        if (!gameEnded) {
            GameOver()
            gameEnded = true
        }
        return
    }

    // Winning the game
    if (snakeBody.length == 441) {
        if (!gameEnded) {
            gameWin = true
            GameOver()
            gameEnded = true
        }
        return
    }

    // Move snake
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y

    // Eat food
    if (snakeBody[0].x == foodBody[0].x && snakeBody[0].y == foodBody[0].y) {
        // Make snake longer
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] })

        // Add speed
        snakeSpeed = snakeSpeed + 0.25

        // Add point
        addPoints()

        // Change food location
        CreateFood()
    }

}

function addPoints() {
    let point = snakeBody.length - 1
    let scoreBoard = document.getElementById('food_eaten')
    scoreBoard.innerHTML = 'Points: ' + point
}

// Activate "Game Over" screen
let gameWin = false
function GameOver() {
    document.getElementById('myNav').style.height = "100%";
    if (gameWin) {
        document.getElementById('game_end').innerHTML = 'YOU WIN!'
    } else {
        document.getElementById('game_end').innerHTML = 'Game Over'
    }
}

// Start new game
document.getElementById('new_game').addEventListener('click', function () {
    document.getElementById('myNav').style.height = "0";
    snakeBody = [{ x: 11, y: 11 }]
    inputDirection = { x: 0, y: 0 }
    lastInputDirection = { x: 0, y: 0 }
    snakeSpeed = 4
    gameEnded = false
    CreateFood()
    addPoints()
})


function Draw() {
    board.innerHTML = ''; // Emtyes the game board after snake has moved
    // Draw snake
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
        board.appendChild(snakeElement)

    })
    // Draw food
    foodBody.forEach(segment => {
        const foodElement = document.createElement('div')
        foodElement.style.gridRowStart = segment.y
        foodElement.style.gridColumnStart = segment.x
        foodElement.classList.add('food')
        board.appendChild(foodElement)
    })


}
