var init = function (window) {
    'use strict';
    var 
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz,
        
        app = window.opspark.makeApp(),
        canvas = app.canvas, 
        view = app.view,
        fps = draw.fps('#000');
        
    
    window.opspark.makeGame = function() {
        
        window.opspark.game = {};
        var game = window.opspark.game;
        
        ////////////////////////////////////////////////////////////
        ///////////////// PROGRAM SETUP ////////////////////////////
        ////////////////////////////////////////////////////////////
        
        // TODO 1 : Declare and initialize our variables
        var circle;
        var circles = [];
        // TODO 2 : Create a function that draws a circle 
        function drawCircle(){
        	circle = draw.randomCircleInArea(canvas, true, true, '#999', 2);
    	    physikz.addRandomVelocity(circle, canvas, 10, 10);
	        view.addChild(circle);
	        circles.push(circle);
        }

        // TODO 3 / 8 : Call the drawCircle() function 
        for(var i = 0; i < 100; i++){
            drawCircle();
        }
        ////////////////////////////////////////////////////////////
        ///////////////// PROGRAM LOGIC ////////////////////////////
        ////////////////////////////////////////////////////////////
        
        /* 
        This Function is called 60 times/second producing 60 frames/second.
        In each frame, for every circle, it should redraw that circle
        and check to see if it has drifted off the screen.         
        */
        function update() {
            //These were deleted because we can simply iterate over the circles array
            //instead of explicitly coding the positions of each circle

            // TODO 9 : Iterate over the array
            for (var k = 0; k < circles.length; k++){
                physikz.updatePosition(circles[k]);
                game.checkCirclePosition(circles[k]);
            }    
            
        }
    
        /* 
        This Function should check the position of a circle that is passed to the 
        Function. If that circle drifts off the screen, this Function should move
        it to the opposite side of the screen.
        */
        game.checkCirclePosition = function(circle) {
            var circleREdge = circle.x + circle.radius;
            var circleLEdge = circle.x - circle.radius;
            var circleTEdge = circle.y - circle.radius;
            var circleBEdge = circle.y + circle.radius;
            // if the circle has gone past the RIGHT side of the screen then place it on the LEFT
            if ( circleREdge > canvas.width ) {
                circle.x = 0 + circle.radius;
            }
            // if the circle has gone past the LEFT side of the screen, then place it on the RIGHT
            if(circleLEdge < 0){
                circle.x = canvas.width - circle.radius;
            }
            // if the circle has gone below the BOTTOM side of the screen, then place it on the TOP
            if(circleBEdge > canvas.height){
                circle.y = 0 + circle.radius;
            }
            // if the circle has gone above the TOP side of the screen, then place it on the BOTTOM
            if(circleTEdge < 0){
                circle.y = canvas.height - circle.radius;
            }
            // TODO 7 : YOUR CODE STARTS HERE //////////////////////
            // This just asked me to code somewhere else so...
            // YOUR TODO 7 CODE ENDS HERE //////////////////////////
        }
        
        /////////////////////////////////////////////////////////////
        // --- NO CODE BELOW HERE  --- DO NOT REMOVE THIS CODE --- //
        /////////////////////////////////////////////////////////////
        
        view.addChild(fps);
        app.addUpdateable(fps);
        
        game.circle = circle;
        game.circles = circles;
        game.drawCircle = drawCircle;
        game.update = update;
        
        app.addUpdateable(window.opspark.game);
    }
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = init;
}
