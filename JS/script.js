// GAME CONSTANTS
let inputDir = {x: 0, y: 0}
const foodSound = new Audio('../music/food.mp3')
const gmaeOverSound = new Audio('../music/gameover.mp3')
const moveSound = new Audio('../music/move.mp3')
const music = new Audio('../music/music.mp3')

const board = document.querySelector('.board')
const scoreEl = document.querySelector('.score')
const hiScoreEl = document.querySelector('.highScore')

let score = 0;
let speed = 10;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 13},
]
let food = {x: 7, y: 7}



// GAME FUNCTIONS
function main(currentTime){
    window.requestAnimationFrame(main)
    if((currentTime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = currentTime;
    gameEngine()
}

function isCollide(snake){
    // If you bump into yourself
    for(let i=1; i<snakeArr.length; i++){
        if((snake[i].x === snake[0].x) && (snake[i].y === snake[0].y)){
            return true;
        }
    }

    // If you bump into the wall
    if(snake[0].x >= 25 || snake[0].x <= 0 || snake[0].y >= 25 || snake[0].y <= 0){
        return true;
    }
}

function gameEngine(){
    // Updating the Snake & Food variable (array)
    if(isCollide(snakeArr)){
        gmaeOverSound.play();
        music.pause();
        alert('Game Over. Press any key to play again')
        inputDir = {x: 0, y: 0}
        snakeArr = [{x: 13, y:15}];
        // music.play();
        score = 0;
        scoreEl.innerHTML = `Score: ${score}`
    }

    // If you eaten the food, increment the score and regenerate the food
    if((snakeArr[0].y === food.y) && (snakeArr[0].x === food.x)){
        foodSound.play()
        score++
        if(score>parseInt(localStorage.getItem('hiScore'))){
            hiScore = score
            localStorage.setItem('hiScore', hiScore);
            hiScoreEl.innerHTML = `High Score: ${hiScore}`;
        }
        scoreEl.innerHTML = `Score: ${score}`
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())}
    }

    // Moving the snake
    for (let i = snakeArr.length-2; i>=0; i--) {
        // const element = array[i];
        snakeArr[i+1] = {...snakeArr[i]};
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    
    // Display the Snake
    board.innerHTML = ''
    snakeArr.forEach((e, idx)=>{
        snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(idx === 0){
            snakeElement.classList.add('head')
            snakeElement.style.borderRadius = borr(inputDir.x, inputDir.y)
        } else{
            snakeElement.classList.add('snake')
        }
        board.append(snakeElement)
    })

    // Display the Food
    foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.append(foodElement)
}

function borr(x, y){
    if(x == 0 && y == -1){
        return `99px 99px 0px 0px`    
    }else if(x == 0 && y == 1){
        return `0px 0px 99px 99px`
    }else if(x == -1 && y == 0){
        return `99px 0px 0px 99px`
    }else if(x == 1 && y == 0){
        return `0px 99px 99px 0px`
    }
}



// MAIN LOGIC STARTS HERE
window.requestAnimationFrame(main);

window.addEventListener('keydown', (e)=>{
    inputDir = {x: 0, y:1} // Starts the game
    moveSound.play()

    switch (e.key) {
        case 'ArrowUp':
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case 'ArrowDown':
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case 'ArrowLeft':
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case 'ArrowRight':
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    
        default:
            break;
    }
})



// SETTING HIGH SCORE
let hiScore = localStorage.getItem('hiScore')
if(!hiScore){
    localStorage.setItem('hiScore', 0)
}else{
    hiScoreEl.innerHTML = `High Score: ${hiScore}`
}