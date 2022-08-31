document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('button')
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('.score-display')
    const linesDisplay = document.querySelector('.lines-display')
    const displaySquares = document.querySelectorAll('.previous-grid div')
    let squares = Array.from(grid.querySelectorAll('div'))
    const width = 10
    const height = 20
    let timerID
    let score = 0
    let lines = 0
    //ascII value of key
    const KeyLeft = 37
    const KeyUp = 38
    const KeyRight = 39
    const KeyDown = 40

//Declarando as teclas de controle
function control(e){
    if(e.keyCode === KeyLeft){
        moveLeft()
    } else if(e.keyCode === KeyRight){
        moveRight()
    } else if(e.keyCode === KeyDown){ 
        moveDown()
    } else if(e.keyCode === KeyUp){
        rotate()
    }
}

document.addEventListener('keyup', control)

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
    current.forEach( index => (
        squares[currentPosition + index].classList.add('block')      
    ))
}

//Apagar o Tetromino
function undraw(){
    current.forEach( index => (
        squares[currentPosition + index].classList.remove('block')
    ))
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
    if(current.some(index => squares[currentPosition+index].classList.contains('block2')))
    {
        currentPosition -=1
    }
    draw()
}

function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition+index) % width === 0)
    if(!isAtLeftEdge) currentPosition -= 1
    if(current.some(index => squares[currentPosition+index].classList.contains('block2')))
    {
        currentPosition +=1
    }
    draw()
}

//Rodar Tetromino
function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0
    }
    current = Tetrominoes[random][currentRotation]
    draw () 
}

//Mostrar o tetromino anterior
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
        square.classList.remove('block') 
    })
    smallTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('block')
    })
}

function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('block3')
    || squares[currentPosition+index+width].classList.contains('block2'))){
        current.forEach(index => squares[currentPosition+index].classList.add('block2'))

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

startBtn.addEventListener('click', () => {
    if(timerID) {
        clearInterval(timerID)
        timerID=null
    } else {
        draw()
        timerID=setInterval(moveDown, 1000)
        nextRandom=Math.floor(Math.random()*Tetrominoes.length)
        displayShape()
    }
})

function gameOver(){
    if(current.some(index => squares[currentPosition+index].classList.contains('block2'))) {
        scoreDisplay.innerHTML = 'End'
        clearInterval(timerID)
    }

}

function addScore(){
    for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        lines +=1
        scoreDisplay.innerHTML = score
        linesDisplay.innerHTML = lines

        row.forEach(index => {
            squares[index].classList.remove('block2')
            squares[index].classList.remove('block')
            squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        }
    }      
}

})