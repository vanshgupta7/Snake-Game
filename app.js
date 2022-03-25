let lastRenderTime=0
let SnakeSpeed =5
let expand_rate= 1;
let score_rate= 1;
let newsegment=0;
let score=0;
let Grid_Size= 21;
const snakeBody = [{ x: 11, y: 11 }]
let direction= {x:0,y:0}
let prevDirection= {x: 0,y:0}
let gameOver = false
let food = randomFoodPosition()

const mainbody = document.querySelector('.grid')
let allButtons=document.querySelector('.buttons')
let left = document.querySelector(".left");
let bottom = document.querySelector(".bottom");
let right = document.querySelector(".right");
let up = document.querySelector(".top");
let playAgain = document.querySelector('.playagain');
let total =document.querySelector('.total');
let fin= document.querySelector('.score');
let end = document.querySelector('.end');
playAgain.style.display='none'
function main(currentTime){

    if (gameOver) {
        // fin.="You Final Score"
        total.style.display='none'
        fin.innerHTML="Your final Score <br>" +score;
        mainbody.style.display='none'
        allButtons.style.display='none'
        playAgain.style.display='flex'
        playAgain.className='playagain'
        end.className='playagaingamefinish'
        fin.className='gamefinish'
        playAgain.addEventListener('click',() => {
          window.location = 'model.html'
        })
        // if (confirm('You lost. Press ok to restart.')) {
        //   window.location = 'model.html'
        // }
        return
    }
    window.requestAnimationFrame(main)
    const secondsLastRender = (currentTime-lastRenderTime)/1000
    if(secondsLastRender<1/SnakeSpeed) return
    lastRenderTime=currentTime

    update()
    draw()
}

window.requestAnimationFrame(main)

function update(){
    updateBody()
    updateFood()
    dead()

}
function draw(){
    mainbody.innerHTML=''
    drawBody(mainbody)
    drawFood(mainbody)
}

function updateBody(){

    addSegments()

    for(i=snakeBody.length-2;i>=0;i--){
        snakeBody[i+1]= {...snakeBody[i]}
    }
    snakeBody[0].x+=direction.x
    snakeBody[0].y+=direction.y
}


function drawBody(mainbody){
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
        mainbody.appendChild(snakeElement)
      })

}

//changing direction using buttons
left.addEventListener("click",() => {
    if (prevDirection.x !== 0) {
        direction=direction
    }
    else{
        direction={x:-1,y:0} 
        prevDirection=direction
    }
})
right.addEventListener("click",() => {
    if (prevDirection.x !== 0) 
        direction=direction

    else{
        direction={x:1,y:0}
        prevDirection=direction

    }
})
up.addEventListener("click",() => {
    if (prevDirection.y !== 0) 
        direction=direction

    else{
        direction={x:0,y:-1}
        prevDirection=direction
    }
})
bottom.addEventListener("click",() => {
    if (prevDirection.y !== 0) 
        direction=direction

    else{
        direction={x:0,y:1}
        prevDirection=direction
    }
})

//changing directions using keyboard
window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':
        if (prevDirection.y !== 0) break
        direction = { x: 0, y: -1 }
        updatePrevDirection()
        break
      case 'ArrowDown':
        if (prevDirection.y !== 0) break
        direction = { x: 0, y: 1 }
        updatePrevDirection()
        break
      case 'ArrowLeft':
        if (prevDirection.x !== 0) break
        direction = { x: -1, y: 0 }
        updatePrevDirection()
        break
      case 'ArrowRight':
        if (prevDirection.x !== 0) break
        direction = { x: 1, y: 0 }
        updatePrevDirection()
        break
    }
  })

function updatePrevDirection() {
    prevDirection= direction
}
function updateFood(){
    if(onSnake(food)){
        expandSnake(expand_rate)
        updateScore()
        food= randomFoodPosition()
    }
}

function drawFood(mainbody){
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    mainbody.appendChild(foodElement)
}

function randomFoodPosition(){
    let newPosition
    while (newPosition ==null || onSnake(newPosition)) {
        newPosition = getGridPosition()
    }
    return newPosition
}

function getGridPosition(){
    return {
        x: Math.floor(Math.random()*Grid_Size) +1,
        y: Math.floor(Math.random()*Grid_Size) +1

    }

}

function onSnake(position, { ignoreHead = false } = {}){
    return snakeBody.some((segment,index) => {
        if (ignoreHead && index === 0) return false
        return equalPosition(segment,position)
    })
}

function expandSnake(amount){
    newsegment +=amount
}


function equalPosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}


function addSegments() {
    for (let i = 0; i < newsegment; i++) {
      snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    }
  
    newsegment = 0
}


function dead(){
    gameOver= outsideGrid(snakeBody[0]) || snakeIntesect()
}



function outsideGrid(pos){
    return pos.x <1 || pos.x>Grid_Size || pos.y<1 || pos.y>Grid_Size
}

function snakeIntesect(){
    return onSnake(snakeBody[0], { ignoreHead: true })
}

function updateScore(){
    // if(onSnake(food)){
        score+= 1+ Math.floor(SnakeSpeed/10);
        SnakeSpeed+=1;
        total.innerHTML=score
    // }
}