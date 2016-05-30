
/*Idea taken from [3] http://stackoverflow.com/questions/11349613/html5-canvas-not-working-in-external-javascript-file*/

document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){

/*Idea taken from [4] http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser*/
//Preveny arrow keys of game play scrolling actual web page
window.addEventListener("keydown", function(e) {
    //Arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
} , false);

/*Sounds structure only needed when active network connection
Taken from [2] http://cssdeck.com/labs/classic-snake-game-with-html5-canvas*/
var mainMusic = document.getElementById("main_music"),
    foodMusic = document.getElementById("food"), 
    goMusic = document.getElementById("gameOver"),
    files = [mainMusic, foodMusic, goMusic],
    counter = 0;
    highestscore =0;

var xhr = new XMLHttpRequest();//New http request for using the api
xhr.open('GET', 'http://localhost:3000/api/user_data', true);//Build the request


xhr.send();//Send the request

xhr.addEventListener("readystatechange", processRequest, false);//Check for when the objects state changes indicating it has received respon


function processRequest(e) {//Processing the first request to find the users username in the database
        if (xhr.readyState == 4 && xhr.status == 200) {//If the request was successful
        var response = JSON.parse(xhr.responseText);//JSON object returned from using request
        username = response.username//Setting the username for the program
        if (username!=[]){//New request for getting user score
            getHighscore = new XMLHttpRequest()
            getHighscore.open('GET', 'http://localhost:3000/api/highscores/'+username, true);
            getHighscore.send()
            getHighscore.addEventListener("readystatechange",getScore,false)//Event listener to then process that score
        }
    }
}
function getScore(e) {//Checks if user has a score in database. If not posts a score of 0 to database
    if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(getHighscore.responseText);
        if (response ==null){
            postScore(score);//Posting score of 0 to database
            highestscore =0;//Set highest score achieved to 0
        }
        else {highestscore = response.score;}//otherwise sets highest score as highscore
 }
}

function pushScore(score){//Send put request for when user does have score in database
    postHighscore = new XMLHttpRequest()
    postHighscore.open('PUT', 'http://localhost:3000/api/highscores/'+username, true);
    postHighscore.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    postHighscore.send('score='+score)
}
function postScore(score){//Send post request for when user doesnt have score in database
    postHighscore = new XMLHttpRequest()
    postHighscore.open('POST', 'http://localhost:3000/api/highscores/', true);
    postHighscore.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    postHighscore.send('score=0')

}

for(var i = 0; i < files.length; i++) {
    var file = files[i];
    file.addEventListener("loadeddata", function() {
        counter++;
        var percent = Math.floor((counter/files.length)*100);
        loading.innerHTML = "Loading " + percent + "%";
    });
}

/* Constants */
var 
COLS = 40,
ROWS = 30,
EMPTY = 0,
SNAKE = 1,
FRUIT = 2,
LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,
KEY_LEFT  = 37,
KEY_UP    = 38,
KEY_RIGHT = 39,
KEY_DOWN  = 40,

/* Game objects */

canvas,   // HTMLCanvas
ctx,      // CanvasRenderingContext2d
keystate, // Object, used for keyboard inputs
frames,   // number of frames used for animation purposes 
score;    /* number to keep track of the player score
/*Defining the Grid Object/datastructor
    - will be used when drawing grid of gameboard
*/
grid = {
    width: null,  // number of columns 
    height: null, // number of rows
    _grid: null,  // data representation of the grib that is inserted

    /*initiate Method
        d = direction
        c = number of columns
        r = number of rows    */    
    initiate: function(d, c, r) {
        this.width = c;
        this.height = r;
        this._grid = [];
        for (var x=0; x < c; x++) {
            this._grid.push([]);
            for (var y=0; y < r; y++) {
                this._grid[x].push(d);
            }
        }
    },

    /*Set Method
        Set the value(val) of the grid cell at (x, y)
    */
    set: function(val, x, y) {
        this._grid[x][y] = val;
    },

    //Get the value of the cell at (x, y)
    get: function(x, y) {
        return this._grid[x][y];
    }
}

/*  The snake, works as a queue (FIFO, first in first out) of data
    with all the current positions in the grid with the snake id */

snake = {
    direction: null, // direction of snake
    last: null,      // pointer to the last element in the queue
    _queue: null,    // Adata representation of queue

    //Clears the queue and sets the start position and direction    
    initiate: function(d, x, y) {
        this.direction = d;
        this._queue = [];
        this.insert(x, y);
    },

    //Adds an element to the queue
    insert: function(x, y) {
        // unshift prepends an element to an array
        this._queue.unshift({x:x, y:y});
        this.last = this._queue[0];
    },

    // Removes and returns the first element in the queue.
    remove: function() {
        // pop returns the last element of an array
        return this._queue.pop();
    }
};

// Set a food id at a random free cell in the grid
function setFood() {
    var empty = [];
    var foodCount = 0;
    // iterate through the grid and find all empty cells
    for (var x=0; x < grid.width; x++) {
        for (var y=0; y < grid.height; y++) {
            if (grid.get(x, y) === EMPTY) {
                empty.push({x:x, y:y});         //add to empty array
            }
            if (grid.get(x, y) === FRUIT) {
                foodCount += 1;
            }
        }
    }
    // chooses a random cell to place fruit max of 3 at all times
    var i = 0;
    if (foodCount == 0) {
        i = 3;
    }
    else{
        i = 4;
    }
    for (i; foodCount < i; i--) {
        var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
        grid.set(FRUIT, randpos.x, randpos.y);
    };

}

/*Starts the game*/
function main() {
    // create and initiateiate the canvas element
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = COLS*20;
    canvas.height = ROWS*20;

    frames = 0;
    keystate = {};

    // keeps track of the keybourd input
    document.addEventListener("keydown", function(evt) {
        keystate[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) {
        delete keystate[evt.keyCode];
    });

    startScreen();
}

function startScreen() {

    canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop,

    //Set up start instructions
    ctx.fillStyle = "grey";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    y = ctx.canvas.height / 2;                          //make center of y plane
    ctx.fillStyle = 'white';
    ctx.font = '30px monospace';
    centerText(ctx, 'Click to begin', y-30);
    ctx.fillStyle = "white";
    ctx.font = '24px monospace';
    centerText(ctx, 'Use the arrow keys to move your bacteria cell', y + 60);

    ArrowKeys()     //function to insert arrow symbols onto canvas

    ctx.font = '20px monospace';    //set for speed and score fonts

    // Add event listener for `click` events.

    /*Click event listener idea from 
        [5] http://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element 
        and [6] http://jsfiddle.net/BmeKr/*/
    canvas.addEventListener('click', function(event) {
            mainMusic.currentTime = 0;
            mainMusic.play();
            initiate();
            loop();
    }, false);
}


/*Idea from [7] https://dzone.com/articles/building-game-javascript-start*/
function centerText(ctx, text, y) {
        var measurement = ctx.measureText(text);
        var x = (ctx.canvas.width - measurement.width) / 2;
        ctx.fillText(text, x, y);
    }

/* Using downloaded images to print arrow keys onto canvas startscreen instructions 
    images saved from [8] http://designscrazed.org/free-glyph-icons/
    draw image idea inspired by [9] http://stackoverflow.com/questions/29572560/load-image-from-url-and-draw-to-html5-canvas.
*/
function ArrowKeys() {
    var up = document.createElement("img");
        left = document.createElement("img"),
        down = document.createElement("img"),
        right = document.createElement("img");

    up.src = 'images/Uparrow.png';
        up.onload = function() {
        ctx.drawImage(up, (ctx.canvas.width/2) -70, y);
    };

        left.onload = function() {
        ctx.drawImage(left, (ctx.canvas.width/2) -30 , y);
    };
    left.src = 'images/Leftarrow.png';

        down.onload = function() {
        ctx.drawImage(down, (ctx.canvas.width/2) +10, y);
    };
    down.src = 'images/Downarrow.png';

        right.onload = function() {
        ctx.drawImage(right, (ctx.canvas.width/2) +50, y);
    };
    right.src = 'images/Rightarrow.png';
}



/*Resets and initiates game objects*/
function initiate() {
    score = 0;
    grid.initiate(EMPTY, COLS, ROWS);
    var sp = {x:Math.floor(COLS/2), y:ROWS-1};      // where snake stars (at central bottom)
    snake.initiate(UP, sp.x, sp.y);
    grid.set(SNAKE, sp.x, sp.y);
    setFood();                                      // Place food in random spot
}

/*The game loop function, used for game updates and rendering*/
function loop() {
    update();
    // When ready to redraw the canvas call the loop function
    // first. Runs about 60 frames a second
    window.requestAnimationFrame(loop, canvas);
}

//message (string) determined by how snake dies
function deathScreen(message) {
    //reset the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "grey";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '60px monospace';
    centerText(ctx,'Oh no!', y -120);
    ctx.font = '24px monospace';
    centerText(ctx,message,y-60);
    centerText(ctx, 'You ate ' + score +' white blood cells', y);   // try customize message for different scores as additional feature
    if(score>highestscore){//Test is score acheived is greater than existing high score
        pushScore(score)//If so post high score
        highestscore = score//Update local highest score information
    }
    centerText(ctx, 'Your highest score is '+highestscore+ ' white blood cells', y+40); 
    centerText(ctx, 'Click to retry or refresh page to see start instruction', y+80);
    ctx.font = '15px monospace';                                        //for speed and score fonts

    ctx.addEventListener('click', function(event) {
        mainMusic.currentTime = 0;
        mainMusic.play();
        initiate();
        loop();
    }, false);
}

/*Updates the game logic*/
function update() {
    frames++;
    // idea for speed from [10] http://tutorialzine.com/2015/06/making-your-first-html5-game-with-phaser/
    speed = Math.min(10, Math.floor(score/5));
    var dead = '';
    // changing direction of the snake depending on which keys
    // that are pressed
    if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
        snake.direction = LEFT;
    }
    if (keystate[KEY_UP] && snake.direction !== DOWN) {
        snake.direction = UP;
    }
    if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
        snake.direction = RIGHT;
    }
    if (keystate[KEY_DOWN] && snake.direction !== UP) {
        snake.direction = DOWN;
    }
    // each five frames update the game state.
    if (frames%(8-speed) === 0) {
        // pop the last element from the snake queue i.e. the head
        var nx = snake.last.x;
        var ny = snake.last.y;
        // updates the position depending on the snake direction
        switch (snake.direction) {
            case LEFT:
                nx--; //decrease x by 1 - go left
                break;
            case UP:
                ny--; //decrease y by 1 - go up
                break;
            case RIGHT:
                nx++; //increase x by 1 - go right
                break;
            case DOWN:
                ny++; //increase y by 1 - go down
                break;
        }

        // checks all gameover conditions
            //if snake hits side
        if (0 > nx || nx > grid.width-1  || // check if hits left or right
            0 > ny || ny > grid.height-1 ){ // check if hits top or bottom

                mainMusic.pause();
                goMusic.play()
                dead = "You hit the cell wall and died!";   
                return deathScreen(dead);
        }
        //if snake eats itself
        else if(grid.get(nx, ny) === SNAKE){
            mainMusic.pause();
            goMusic.play()
            dead = "You ate yourself and died!";
            return deathScreen(dead);
        }
        else{
            // check wheter the new position are on the fruit item
            if (grid.get(nx, ny) === FRUIT) {
                // increment the score and sets a new fruit position
                foodMusic.pause();
                foodMusic.currentTime = 0;
                foodMusic.play();
                score++;
                setFood();
            } else {
                // take out the first item from the snake queue i.e
                // the tail and remove id from grid
                var tail = snake.remove();
                grid.set(EMPTY, tail.x, tail.y);
            }
            // add a snake id at the new position and append it to 
            // the snake queue
            grid.set(SNAKE, nx, ny);
            snake.insert(nx, ny);
            draw();
        }
    }
}

/*Render the grid to the canvas*/
function draw() {
    // calculate tile-width and -height
    var tw = canvas.width/grid.width;
    var th = canvas.height/grid.height;
    // iterate through the grid and draw all cells
    for (var x=0; x < grid.width; x++) {
        for (var y=0; y < grid.height; y++) {
            // sets the fillstyle depending on the id of
            // each cell
            switch (grid.get(x, y)) {
                case EMPTY:
                // Colours from [11] http://www.w3schools.com/colors/colors_picker.asp
                    ctx.fillStyle = "rgb(255,51,51)";
                    ctx.fillRect(x*tw, y*th, tw, th); 
                    break;
                case SNAKE:
                    ctx.fillStyle = "black";
                    ctx.fillRect(x*tw, y*th, tw, th);
                    break;
                case FRUIT:
                    //make square behind circle same color as empty
                    ctx.fillStyle = "rgb(255,51,51)";
                    ctx.fillRect(x*tw, y*th, tw, th);
                    //draw white blood cell (circle)
                    ctx.beginPath();
                    ctx.arc((x*tw + tw/2),(y*th + th/2), (th/2-1), 0, 2 * Math.PI, false);
                    ctx.closePath();
                    ctx.fillStyle = "white";
                    ctx.fill();
                    ctx.lineWidth = 1;
                    //differnt shade of red for border of circles - blends into background better
                    ctx.strokeStyle = "rgb(153, 0, 0)"; 
                    break;
            }
        }
    }
    // changes the fillstyle once more and draws the score
    // message to the canvas
    ctx.fillStyle = "#000";
    ctx.fillText("SCORE: " + score, canvas.width-COLS*3, 30);  //bottom leftc hanf corner
    ctx.fillText("SPEED: " + speed, 10, 30);
}
// start and run the game
main();

} //end of DOMContentLoaded EventListener