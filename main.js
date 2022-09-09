document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startBtn");
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score')
    let squares = Array.from(grid.querySelectorAll('.grid div'))
    const width = 10
    let timerID
    let score=0
    let gameOverStatus = false;

    //ascII value of key
    const KeySpace = 32
    const KeyLeft = 37
    const KeyUp = 38
    const KeyRight = 39
    const KeyDown = 40
//Declarando as teclas de controle
function control(e){
    if(timerID != null){
        if(e.keyCode === KeyLeft){
            moveLeft()
        } else if(e.keyCode === KeyRight){
            moveRight()
        } else if(e.keyCode === KeyDown){ 
            moveDown()
        } else if(e.keyCode === KeyUp){
            rotate()
        } else if(e.keyCode === KeySpace){
            hardDrop()
        }
    }
}

document.addEventListener('keyup', control)

// Possíveis cores dos tetrominos
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

// Declaração dos tetromino básicos (Straight, Square, T, L, Z)
const L_Tetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const Z_Tetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
]

const T_Tetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]

const O_Tetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]

const I_Tetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

const Tetrominoes = [L_Tetromino, Z_Tetromino, T_Tetromino, O_Tetromino, I_Tetromino]

//Selecionar o Tetromino
let currentRotation = 0
let currentPosition = 4

//Selecionar randomicamente o primeiro Tetromino
let random = Math.floor(Math.random()*Tetrominoes.length)
let current = Tetrominoes[random][currentRotation]

//Desenhar o Tetromino
function draw(){
    current.forEach( index => {
        squares[currentPosition + index].classList.add('tetromino')    
        squares[currentPosition + index].style.backgroundColor = colors[random]  
    })
}

//Apagar o Tetromino
function undraw(){
    current.forEach( index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

//Mover o Tetromino
function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze() 
}

function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition+index) % width === width -1)
    if(!isAtRightEdge) currentPosition += 1
    if(current.some(index => squares[currentPosition+index].classList.contains('taken')))
    {
        currentPosition -=1
    }
    draw()
}

function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition+index) % width === 0)
    if(!isAtLeftEdge) currentPosition -= 1
    if(current.some(index => squares[currentPosition+index].classList.contains('taken')))
    {
        currentPosition +=1
    }
    draw()
}

function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0);  
}
function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0);
}
function checkRotatedPosition(P){
    P = P || currentPosition;        
    if ((P+1) % width < 4) {         
        if (isAtRight()){            
            currentPosition += 1;    
            checkRotatedPosition(P); 
        }
    }
    else if (P % width > 5) {
        if (isAtLeft()){
            currentPosition -= 1;
            checkRotatedPosition(P);
        }
    }
}

//Rodar Tetromino
function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0
    }
    current = Tetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw () 
}

//descer rapidamente o Tetromino
function hardDrop(){
    undraw()
    while(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        currentPosition+=width;
    }
    draw()
    freeze();
}

//Mostrar o tetromino anterior
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0
let nextRandom = 0

const smallTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], /* L_Tetromino */
    [0, displayWidth, displayWidth+1, displayWidth*2+1 ], /* Z_Tetromino */
    [1, displayWidth, displayWidth+1, displayWidth+2], /* T_Tetromino */
    [0, 1, displayWidth, displayWidth+1], /* O_Tetromino */
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] /* I_Tetromino */ 
]

function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino') 
        square.style.backgroundColor = ''
    })

    smallTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition+index].classList.add('taken'))

        random = nextRandom
        nextRandom = Math.floor(Math.random()*Tetrominoes.length)
        current = Tetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        gameOver()
        addScore()
    }
}

function restartGame() {
    for (let index = 0; index < squares.length; index++) {
        squares[index].classList.remove('tetromino')
        
        if(index < (squares.length - 10)){
            squares[index].classList.remove('taken')
        }
        squares[index].style.backgroundColor = ''
        score = 0
        scoreDisplay.innerHTML = score
    }    
    nextRandom = Math.floor(Math.random()*Tetrominoes.length)
    current = Tetrominoes[random][currentRotation]
}

function pauseGame() {
    clearInterval(timerID);
    timerID = null;
    startBtn.value = "Start";
    startBtn.blur(); //não manter o foco no botão após clique
}

function StartGame() {
    startBtn.value= "Pause";  
    if(gameOverStatus)
        restartGame()
    draw()
    timerID=setInterval(moveDown, 600)
    nextRandom=Math.floor(Math.random()*Tetrominoes.length)
    displayShape()
    startBtn.blur();
}

startBtn.addEventListener('click', () => {
    if(timerID) {
        pauseGame();
    } else {
        StartGame();
    }
})

function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoreDisplay = document.querySelector('#highScores');
  
    highScoreDisplay.innerHTML = highScores
}
  
  function saveHighScore() {  
    localStorage.setItem('highScores', JSON.stringify(score));
}

  function checkHighScore() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  
    if (score > highScores) {
      const newScore = score;
      saveHighScore(newScore, highScores);
      showHighScores();
    }
}  

function gameOver(){
    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
        checkHighScore()
        clearInterval(timerID);
        console.log("GameOver");
        startBtn.value = "Start";
        gameOverStatus = true;
    }
}

function addScore(){
    for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
        if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=100;
        scoreDisplay.innerHTML = score

        row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
        })

        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        }
    }      
}

showHighScores()

})

