/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
    "UP": 38,
    "DOWN": 40,
    "W": 87,
    "S": 83,
    "SPACE": 32,
  }
  var board = $("#board");
  var scoreBoard = $("#scoreBoard");
  var ballDefaults = {
    "element": $("#gameItem"),
    "x": 415, //415
    "y": 195, //195
    "spdX": 0,
    "spdY": 0,
  }


  // Other Variables
  var activeGame = false;

  // Game Item Objects

  var ball = {
    "element": $("#gameItem"),
    "x": 415, //415
    "y": 195, //195
    "spdX": 0,
    "spdY": 0,
  }
  var Lpaddle = {
    "name": "LEFT",
    "element": $("#leftPaddle"),
    "y": 157,
    "spdY": 0,
    "pts": 0,
  }
  var Rpaddle = {
    "name": "RIGHT",
    "element": $("#rightPaddle"),
    "y": 157,
    "spdY": 0,
    "pts": 0,
  }

  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keyup', handleKeyUp);                           // change 'eventType' to the type of event you want to handle
  $(document).on('keydown', handleKeyDown);
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    if(activeGame == true){
      checkCollision();
      repositionItems();
      redrawItems();
    }
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    if(activeGame != true){
      if(event.which == KEY.SPACE){
        activeGame = true;
        $("#alert").fadeOut();
        ball.spdX = (Math.random() * 2 + 3) * (Math.random() > 0.5 ? -1 : 1);
        ball.spdY = (Math.random() * 2 + 3) * (Math.random() > 0.5 ? -1 : 1);
      }
    } else {

      switch(event.which){
        case KEY.DOWN:
          Rpaddle.spdY = 10;
          break;
        case KEY.UP:
          Rpaddle.spdY = -10;
          break;
        case KEY.W:
          Lpaddle.spdY = -10;
          break;
        case KEY.S:
          Lpaddle.spdY = 10;
          break;
        default:
          console.log("uhhhh something else");
          break;
      }
    }
  }

  function handleKeyUp(event) {
    switch(event.which){
      case KEY.DOWN:
        Rpaddle.spdY = 0;
        break;
      case KEY.UP:
        Rpaddle.spdY = 0;
        break;
      case KEY.W:
        Lpaddle.spdY = 0;
        break;
      case KEY.S:
        Lpaddle.spdY = 0;
        break;
      default:
        console.log("uhhhh something else");
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function checkCollision(){
    if(ball.x <= 0 || ball.x >= 830){
      if(ball.spdX < 0){
        resetBoard();
        Rpaddle.pts += 1;
        handleScore(Rpaddle, Lpaddle);
      } else {
        resetBoard();
        Lpaddle.pts += 1;
        handleScore(Lpaddle, Rpaddle);
      }
    }
    if(ball.y <= 0 || ball.y >= 390){
      ball.spdY = ball.spdY * -1;
    }
    if(ball.x == 760) {ball.spdX = ball.spdX * -1}
    if(Lpaddle.y-30 <= ball.y && Lpaddle.y+156 >= ball.y && ball.x <= (70 - (ball.spdX)) && ball.x >= (70 + (ball.spdX))) {ball.spdX = ball.spdX * -1}
    if(Rpaddle.y-30 <= ball.y && Rpaddle.y+156 >= ball.y && ball.x <= (760 + (ball.spdX)) && ball.x >= (760 - (ball.spdX))) {ball.spdX = ball.spdX * -1}

    switch(true){
      case (Lpaddle.y < 0):
        Lpaddle.spdY = 0;
        Lpaddle.y = 0;
        break;
      case (Lpaddle.y > 314):
        Lpaddle.spdY = 0;
        Lpaddle.y = 314;
        break;
    }
    switch(true){
      case (Rpaddle.y < 0):
        Rpaddle.spdY = 0;
        Rpaddle.y = 0;
        break;

      case (Rpaddle.y > 314):
        Rpaddle.spdY = 0;
        Rpaddle.y = 314;
        break;
    }
    if(Lpaddle.y < 0 || Lpaddle.y > 314){
      Lpaddle.spdY = 0;
      Lpaddle
    }
    if(Rpaddle.y <= 0 || Rpaddle.y >= 314){
      Rpaddle.spdY = Rpaddle.spdY * -1}
  }

  function repositionItems(){
    Lpaddle.y += Lpaddle.spdY;
    Rpaddle.y += Rpaddle.spdY;
    ball.x += ball.spdX;
    ball.y += ball.spdY;
  }

  function redrawItems(){
    var itemArray = [Lpaddle, Rpaddle, ball];
    itemArray.forEach(item => {item.element.css("top", item.y)});
    itemArray.forEach(item => {item.element.css("left", item.x)});
  }

  function handleScore(scorer, scoree){
    $("#scoreBoard").text(Lpaddle.pts + " : " + Rpaddle.pts);
    $("#alert").text(scorer.name + " SCORED!").fadeIn(1000, resetBoard());
    if(scorer.pts > 6 && scorer.pts > (scoree.pts + 1)){endGame(scorer.name)}
    else{beginRound()}
  }

  //Moves the ball, beginning a new round
  function beginRound(){
    $("#alert").fadeOut(1000, redrawItems);
    ball.spdX = (Math.random() * 2 + 3) * (Math.random() > 0.5 ? -1 : 1);
    ball.spdY = (Math.random() * 2 + 3) * (Math.random() > 0.5 ? -1 : 1);
  }

  // resets the boards and each piece back to default positions
  function resetBoard(){
    ball = ballDefaults;
    ball.y = 195;
    ball.x = 415;
    Rpaddle.y = 157;
    Lpaddle.y = 157;
    Rpaddle.spdY = 0;
    Lpaddle.spdY = 0;
  }
  

  function endGame(victor) {
    // declare winner
    $("#alert").text(victor + " WON!");
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
