/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  //Classes
  // This class creates nodes of the snake (body pieces)
  class SnakeNode{
    constructor(x, y){
      this.pos = [x, y];
      this.next = null;
      this.prev = null;
      $("#board").append('<div class="snake temp"></div>');
      this.$element = $(".temp").removeClass("temp");
    }
  }

  // This class contains the entire snake
  class Snake{
    constructor(x, y){
      $("#board").append('<div id="snakeHead" class="temp"></div>');
      this.head = {
        pos: [x, y],
        next: null,
        prev: null,
        $element: $(".temp").removeClass("temp")
      }
      this.len = 1;
      this.tail = this.head;
      redrawSnakeHead();
    }

    // Add one more node (body piece) to the snake
    grow(){
      let newNode = new SnakeNode(-50, -50);
      this.tail.next = newNode;
      newNode.prev = this.tail;
      let tempX = this.tail.pos[0];
      let tempY = this.tail.pos[1];
      redrawSnake(newNode, tempX, tempY)
      this.tail = newNode;
      this.len++;
    }

    // Moves the head of the snake
    move(spdX, spdY){
      var current = this.head;
      var currentLastPos = current.pos;
      positionX = current.pos[0] + spdX;
      positionY = current.pos[1] + spdY;
      current.pos = [positionX, positionY];
      var others = current.next;
      // Checks if snake has bit itself
      while(others != null && others != current){
        if(others.pos[0] == positionX){
          if(others.pos[1] == positionY){
            endGame("Chomp.");
          }
        }
        others = others.next;
      }
      redrawSnakeHead(positionX, positionY);
      this.follow(currentLastPos);
    }
    
    // Moves each node/body piece of the snake to the position of the previous node, then updates the previous node to the current node, then moves the current node to the previous node's position, etc.
    follow(headLast){
      var current = this.tail;
      var localEleNums = this.len;
      while(current.prev != null){
        if(current.prev.prev != null){
          var currentPrev = current.prev;
          var currentPrevPos = currentPrev.pos;
          current.pos = currentPrevPos;
        } else {
          current.pos = headLast;
        }
        positionX = current.pos[0];
        positionY = current.pos[1];
        redrawSnake(current, positionX, positionY);
        current = current.prev;
      }
      
    }
  }


  // Constant Variables
  var FRAME_RATE = 10;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
    "LEFT": 37,
    "RIGHT": 39,
    "UP": 38,
    "DOWN": 40,
  }
  var positionX = 200;
  var positionY = 200;
  var speedX = 0;
  var speedY = 0;
  var inputLimit = false;
  var boardWidth = (($("#board").width())-50);
  var boardHeight = (($("#board").height())-50);
  var score = 0;
  var bombList = [];
  // Game Item Objects
  var apple = {
    "x": 100,
    "y": 100
  } 
  var snakeList = new Snake(positionX, positionY);

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  var bombInterval = setInterval(createBomb, 20000); // Creates a bomb (createBomb) every 20 seconds
  $(document).on('keydown', handleKeyDown);                         
  repositionApple();
  redrawApple();

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    inputLimit = false;
    snakeList.move(speedX, speedY);
    checkStatus();
    updateScore();
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    if(inputLimit != true){
      switch(event.which){
        case KEY.LEFT:
          if(speedX == 0){
            speedX = -20;
            speedY = 0;
          }
          break;
        case KEY.UP:
          if(speedY == 0){
            speedY = -20;
            speedX = 0;
          }
          break;
        case KEY.RIGHT:
          if(speedX == 0){
            speedX = 20;
            speedY = 0;
          }
          break;
        case KEY.DOWN:
          if(speedY == 0){
            speedY = 20;
            speedX = 0;
          }
          break;
        default:
          console.log("Idk some other key lol");
          break;
      }
      inputLimit = true;
    }
  }

  // Creates bombs for the field randomly
  function createBomb(){
    var tempBomb = {
      "x": ((Math.floor((Math.random() * 21)))+1)*20,
      "y": ((Math.floor((Math.random() * 21)))+1)*20
    }
    bombList.push(tempBomb);
    $("<div>").addClass("bomb")
              .appendTo("#board")
              .css("left", tempBomb.x)
              .css("top", tempBomb.y);
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function checkStatus(){
    //////////////////////////////////////////////////////////////
    // Checks if an apple has been touched in the present frame //
    //////////////////////////////////////////////////////////////
    if(positionX == apple.x && positionY == apple.y){
      repositionApple();
      redrawApple();
      score += 1;
      snakeList.grow()
    }

    ////////////////////////////////////////////////////////////////////////
    // Checks if the snake has left the board bounds in the present frame //
    ////////////////////////////////////////////////////////////////////////
    if(positionX < 0){
      endGame("Bonk!");
      positionX = 0;
    }
    if(positionX > 420){
      endGame("Bonk!");
      positionX = 0;
    }
    if(positionY < 0){
      endGame("Bonk!");
      positionY = 0;
    }
    if(positionY > 420){
      endGame("Bonk!");
      positionY = 0;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Checks if any bomb has been touched in the present frame OR if any bomb overlaps with an apple //
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    for(var i = 0; i < bombList.length; i++){
      bombList.forEach(function(element){
        if(positionX == element.x && positionY == element.y){
          endGame("Boom!");
        }
        if(apple.x == element.x && apple.y == element.y){
          repositionApple();
          redrawApple();
        }
      });
    }
  }

  function redrawSnake(ele, x, y){
    ele.$element.css("left", x);
    ele.$element.css("top", y);
  }

  function redrawSnakeHead(x, y){
    $("#snakeHead").css("left", x);
    $("#snakeHead").css("top", y);
  }

  function repositionApple(){
    apple.x = ((Math.floor((Math.random() * 21)))+1)*20;
    apple.y = ((Math.floor((Math.random() * 21)))+1)*20;
  }

  function redrawApple(){
    $("#apple").css("left", apple.x);
    $("#apple").css("top", apple.y);
  }

  function updateScore(){
    // Updates Score
    $("#scorekeep").text("Score: " + score);
  }

  function endGame(message) {
    // stop the interval timer
    clearInterval(bombInterval);
    clearInterval(interval);
    alert(message + " Game over!");
    // turn off event handlers
    $(document).off();
  }
  
}
