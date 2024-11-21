// גלןבלי
//----------------------------------------------------------------------------- 
let name=window.location.pathname;
 let countFood = 0;                                   //מספר תפוחים שהושגו
 
document.querySelector('#score').innerHTML = countFood;
debugger
console.log(localStorage.getItem('highScoreSnake'));

if(localStorage.getItem('highScoreSnake')==null)
    localStorage.setItem('highScoreSnake',0);
document.querySelector('#win').innerHTML = localStorage.getItem('highScoreSnake');
 
 
// דף פתיחה ומשחק חוזר 
//-----------------------------------------------------------------------------
window.onload = function() {

    if(name.substring(name.length-10,name.length) === "index.html"||name.substring(name.length-12,name.length) === "refresh.html")
    { 
        if(name.substring(name.length-12,name.length) === "refresh.html")
        {
        //אם זה דף refresh
        //לקרוא את כמות התפוחים
        document.querySelector('#score').innerHTML = localStorage.getItem('countFood');
        }
        var button =document.querySelector('#onclick');
        button.addEventListener("click", function(){
            window.location.href="snake.html";}) 
    };
    
    }



if(name.substring(name.length-10,name.length) === "snake.html"){
// משתנים
//-----------------------------------------------------------------------------
const canvas = document.querySelector('#gameCanvas');// לוח משחק
const cols = 28;
const rows =16;

let speed =300;                                      //מהירות
let snake = [{ x: cols / 2, y: rows / 2 },{ x: cols / 2+1, y: rows / 2 }];          //מיקום איברי הנחש
let food = {                                         //הגרלת מיקום לתפוח
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
};
let direction = 'RIGHT';                             //כיווני לחיצה
let audioStep = document.querySelector('#step');     //קולות רקע
let audioEat = document.querySelector('#eat');
let audioFail = document.querySelector('#fail');
//----------------------------------------------------------------------------- 

//אירועים
//-----------------------------------------------------------------------------
document.getElementById('speed').addEventListener("click", function(){
    speed-=50;
    clearInterval(game);
    game = setInterval(drawGame, speed);
})

document.addEventListener('keydown', directionControl);//אירוע לחיצה
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// יצירת רשת המשחק
let count = 0;
for (let i = 0; i < rows; i++) 
{
    for (let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        if (count % 2 === 0) {
            cell.classList.add('cell_1');
        }
        else {
            cell.classList.add('cell_2');
        }
        count++;
        cell.classList.add('cell');
        gameCanvas.appendChild(cell);
    }
    count++;
}

// מערך של כל התאים בלוח
const cells = document.querySelectorAll('.cell');

//מיקום הראש הקודם
let snakeX = snake[0].x;
let snakeY = snake[0].y;
//----------------------------------------------------------

//פונקציות
//----------------------------------------------------------
//יצירת תפוח
let appleIndex = food.y * cols + food.x;
function createApple()
{
   if (cells[appleIndex].children.length === 0)
    {
        let imgApple = document.createElement('img');
        imgApple.src = 'img/apple.png';
        imgApple.classList.add('food');
        cells[appleIndex].appendChild(imgApple);
    } 
}

//יצירת נחש
function createSnake()
{    
    for (let i = 0; i < snake.length; i++) {
        const snakeIndex = snake[i].y * cols + snake[i].x;
        cells[snakeIndex].classList.add('snake');
    }
}
//מחיקת אלמנטים 
function clearChild(indx)
{
    cells[indx].removeChild(cells[indx].lastChild);
}

//טיפול באכילה
function takeFood(indx) {
    audioEat.play();                                        //השמעת קול
    clearChild(indx);                                       //מחיקת התפוח מהמסך
    countFood++;                                            //עידכון ההישג
    document.querySelector('#score').innerHTML=countFood;
    
    if( localStorage.getItem('highScoreSnake')<countFood) //אם עקף את השיא -עדכון
    {
        localStorage.setItem('highScoreSnake', countFood);
        document.querySelector('#win').innerHTML = localStorage.getItem('highScoreSnake');
    }
}

//שינוי כיוון
function directionControl(event) 
{

    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
        audioStep.play();
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
        audioStep.play();
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
        audioStep.play();
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
        audioStep.play();
    }
}

//בדיקה האם הנחש נפגש בעצמו
function collision(head, array)
{
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y)
        {
            return true;
        }
    }
    return false;
}
createApple();
createSnake();
//---------------------------------------------------------------------
//פונקציית המשחק
function drawGame() {
    // הזזת הנחש
    if (direction === 'LEFT') snakeX -= 1;
    if (direction === 'UP') snakeY -= 1;
    if (direction === 'RIGHT') snakeX += 1;
    if (direction === 'DOWN') snakeY += 1;
    if (snakeX === food.x && snakeY === food.y) //אם הנחש אכל את התפוח
    {
        takeFood(appleIndex);
        food =
        {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
    }
    else 
    {
        cells[snake[snake.length - 1].y * cols + snake[snake.length - 1].x].classList.remove('snake');//הסרת החלק האחרון של הנחש מהמערך
        snake.pop();
    }
    //הוספת ראש
    const newHead = { x: snakeX, y: snakeY }

    //יצירת תפוח
    appleIndex = food.y * cols + food.x;
    createApple();
    snake.unshift(newHead);//הוספת הראש החדש לתחילת המערך

   //אם גלש מהגבולות או נפגש בעצמו
    if (snakeX < 0 || snakeY < 0 || snakeX > cols-1 || snakeY > rows-1 || collision(newHead, snake)) 
    {
        gameOver();
    }
    else{
    //יצירת נחש
    createSnake();    

    // שמירת מיקום הראש הקודם
    snakeX = snake[0].x;
    snakeY = snake[0].y;}
}

//פונקציית סיום משחק
function gameOver() 
{
    clearInterval(game);
    audioFail.play();
    localStorage.setItem('countFood',countFood);

    //window.location.href="refresh.html";
   // מעביר עמוד רק אחרי שסיים להשמיע את הקול
     audioFail.onended = function() {
         window.location.href = "refresh.html";
     };

    
}

//הפעלת המשחק
let game = setInterval(drawGame, speed);
 }
//שמירת שיא
localStorage.setItem('highScoreSnakeSnake', localStorage.getItem('highScoreSnake'));

   



