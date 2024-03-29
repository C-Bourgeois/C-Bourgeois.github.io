/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
    "LEFT": 37,
    "RIGHT": 39,
    "UP": 38,
    "DOWN": 40,
  }
  var positionX = 0;
  var positionY = 0;
  var speedX = 0;
  var speedY= 0;
  var boardWidth = (($("#board").width())-50);
  var boardHeight = (($("#board").height())-50);
  // Game Item Objects


  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keyup', handleKeyUp);
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    if(positionX >= boardWidth){
      speedX = 0;
      positionX = boardWidth-1;
    }
    if(positionX < 0){
      speedX = 0;
      positionX = 0;
    }
    if(positionY >= boardHeight){
      speedY = 0;
      positionY = boardHeight-1;
    }
    if(positionY < 0){
      speedY = 0;
      positionY = 0;
    }
    repositionGameItem();
    redrawGameItem();
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    switch(event.which){
      case KEY.LEFT:
        speedX = -5;
        break;
      case KEY.UP:
        speedY = -5;
        break;
      case KEY.RIGHT:
        speedX = 5;
        break;
      case KEY.DOWN:
        speedY = 5;
        break;
      default:
        console.log("Idk some other key lol");
        break;
    }
  }

  function handleKeyUp(event){
    if(event.which == KEY.UP || event.which == KEY.DOWN){
      speedY = 0;
    } else if(event.which == KEY.RIGHT || event.which == KEY.LEFT){
    speedX = 0;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function repositionGameItem(){
    positionX += speedX;
    positionY += speedY;
  }
  
  function redrawGameItem(){
    $("#walker").css("left", positionX);
    $("#walker").css("top", positionY);
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
