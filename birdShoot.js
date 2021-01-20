/*
ECE 4525 Virginia Tech Fall 2020
Project 5
Kevin Kleinegger
Khan Academy
*/

angleMode = "radians";
rectMode(CENTER);
textAlign(CENTER, CENTER);

//object for cannonballs
var cBallObj = function()
{
    this.position = new PVector(0, 0);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0,0);
    this.step = new PVector(0,0);
    this.gravity = new PVector(0,0.1);
    this.bounceCoeff = -0.7;
    this.fire = 0;
    this.bounceCount =0;
    this.shot = false;
    this.birdHit = [false, false, false, false];
};


//object for cannon
//f parameter is just to draw the backwards cannon on the main screen
var cannonObj = function(x, y, f)
{
    this.x = x;
    this.y = y;
    this.angle = radians(-45);
    this.size = 40;
    this.flag = f;
};

//explosion for fireworks on game win screen
var explosionObj = function(a) {
    this.position = new PVector(0, 0);
    this.direction = new PVector(0, 0);
    this.size = random(1, 3);
    if (a === 0) {
        this.c1 = random(0, 250);
    }
    else {
        this.c1 = random(100, 255);
    }
    if (a === 1) {
        this.c2 = random(0, 250);
    }
    else {
        this.c2 = random(100, 255);
    }
    if (a === 3) {
        this.c3 = random(0, 250);
    }
    else {
        this.c3 = random(100, 255);
    }
    this.timer = 0;
};    

//firework object for win screen
var fireworkObj = function(a) {
    this.position = new PVector(200, 380);
    this.direction = new PVector(0, 0);
    this.target = new PVector(mouseX, mouseY);
    this.step = 0;
    this.explosions = [];
    for (var i = 0; i < 200; i++) {
        this.explosions.push(new explosionObj(a));   
    }    
};  

//game object for global variables
var gameObj = function()
{
    this.gameState = 0;
    this.keyArray = [];
    this.cannon = 0;
    this.cannonBalls =  [new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj()];
    this.cBallIndex = 0;
    this.prevFrameCount = 0;
    this.birds = [];
    this.score = 0;
    this.difficulty = "Normal";
    this.birdVelocity = -1;
    this.firework = [new fireworkObj(0), new fireworkObj(1), new fireworkObj(2), new fireworkObj(0)];
    this.animatedCannon = 0;
    this.animateFrameCount = 0;
    this.frameSet = false;
};

var game = new gameObj();

//two state objects for the birds
var moveState = function()
{};

var avoidState = function()
{
    this.vector = new PVector(0, 0);
};

//object for birds
var birdObj = function(x, y)
{
    this.position = new PVector(x, y);
    this.velocity = new PVector(game.birdVelocity, 0);
    this.angle = 0;
    this.whisker1 = new PVector(0, 0);
    this.whisker2 = new PVector(0, 0);
    this.whisker3 = new PVector(0, 0);
    this.whisker4 = new PVector(0, 0);
    this.states = [new moveState(), new avoidState()];
    this.currState = 0;
    this.hitCount = 0;
};

//used for Game Over animation;
var GOcannonObj = function(x ,y)
{
    this.x = x;
    this.y = y;
    this.fireX = x - 5;
    this.fireY = y - 45;
    this.size = 30;
};

//draws game over animation
GOcannonObj.prototype.draw = function() 
{
    noStroke();
    fill(99, 99, 99);
    ellipse(this.x, this.y, 60, 60);
    stroke(118, 71, 0);
    strokeWeight(5);
    noFill();
    line(230, 200, 230, 230);
    line(170, 200, 170, 230);
    stroke(235, 230, 230);
    strokeWeight(2);
    line(200, 170, 195, 155);
    stroke(206, 32, 41);
    line(this.fireX-5, this.fireY-5, this.fireX+5, this.fireY+5);
    line(this.fireX+5, this.fireY-5, this.fireX-5, this.fireY+5);
    stroke(227, 140, 45);
    line(this.fireX, this.fireY-5, this.fireX, this.fireY+5);
    line(this.fireX-5, this.fireY, this.fireX+5, this.fireY);
    noStroke();
    fill(0, 0, 0);
    ellipse(this.x, this.y, this.size, this.size);
};
  
//animates game over screen  
GOcannonObj.prototype.animate = function()
{
    if(!game.frameSet)
    {
        //this is getting the frameRate when we first enter this function so we
        //can wait a bit in between animations
        game.animateFrameCount = frameCount;
        game.frameSet = true;
    }
    var timeElapsed = frameCount - game.animateFrameCount;
    var busy = false;
    if (this.size < 400)
    {
        busy = true;
        if(timeElapsed >= 60)
        {
            //after 2 seconds of pass we change the size of the cannonball to make it look
            //like it was shot at the player
            this.size += 5;
        }
        else
        {
            //for the first second we move the flame towards the cannon
            this.fireY += 0.2;
            this.fireX += 0.06667;
        }
    }
    return busy;
};

//draws the cannon
cannonObj.prototype.draw = function() 
{
    noStroke();
    fill(99, 99, 99);
    ellipse(this.x, this.y, 60, 60);
    pushMatrix();
    translate(this.x, this.y);
    if(this.flag === 1){this.angle = radians(45);}
    rotate(this.angle);
    if(this.flag === 1){rect(-30, 0, 60, 30);}
    else{ rect(30, 0, 60, 30);}
    fill(0, 0, 0);
    if(this.flag === 1){ellipse(-58, 0, 5, 30);}
    else{ ellipse(58, 0, 5, 30);}
    popMatrix();
    stroke(118, 71, 0);
    strokeWeight(5);
    noFill();
    ellipse(this.x, this.y+20, 30, 30);
    strokeWeight(3);
    line(this.x, this.y+5, this.x, this.y+35);
    line(this.x-15, this.y+20, this.x+15, this.y+20);
    line(this.x-10, this.y+10, this.x+10, this.y+30);
    line(this.x+10, this.y+10, this.x-10, this.y+30);
};

//checks for user input and changes the cannon angle if needed
cannonObj.prototype.changeAngle = function()
{
    if(game.keyArray[39] === 1 && this.angle < radians(90))
    {
        this.angle += radians(2);
    }
    else if (game.keyArray[37] === 1 && this.angle > radians(-90))
    {
        this.angle -= radians(2);
    }
};

//draws the cannonball and checks for collisions with birds
cBallObj.prototype.draw = function() 
{
    fill(0, 0, 0);
    noStroke(); 
    ellipse(this.position.x, this.position.y, 30, 30);
    
    for(var i=0; i<game.birds.length;i++)
    {
        if(!this.birdHit[i])
        {
            if(dist(this.position.x, this.position.y, game.birds[i].position.x, game.birds[i].position.y)<25)
            {
                game.birds[i].hitCount++; 
                if(game.birds[i].hitCount === 2)
                {
                    game.score++;
                }
                this.birdHit[i] = true;
            }    
        }
    }
};

//updates the position of the cannonball, this is where the physics is enabled
cBallObj.prototype.updatePosition = function() 
{
    this.acceleration.set(0,0);//reset our acceleration
    if(this.shot === false)//only enter once
    {
        //this.step is used to set a PVector in the direction of the cannon
        //it is then added to our velocity
        this.step.set(cos(game.cannon.angle), sin(game.cannon.angle)); 
        this.step.normalize();
        this.step.mult(8);
        this.velocity.add(this.step);
        this.shot = true;
    }
    this.acceleration.add(this.gravity);//adds gravity to our acceleration
    this.velocity.add(this.acceleration); //adds the acceleration to velocity
    this.position.add(this.velocity); //updates the position based on velocity
    //when the ball reaches the bottom it bounces
    if (this.position.y > (385)) { 
        this.position.y = 385;
        this.velocity.y *= this.bounceCoeff;
        this.bounceCount++;
    }
    
    //if the cannonball leaves the playable area or bounces 3 times it is no longer being fired (this.fire = 0) and all other variables are reset.
    if (this.bounceCount >= 3 || this.position.x > 415) 
    {
        this.fire = 0;
        this.position = new PVector(0, 0);
        this.velocity = new PVector(0, 0);
        this.acceleration = new PVector(0,0.1);
        this.step = new PVector(0,0);
        this.gravity = new PVector(0,0.1);
        this.fire = 0;
        this.bounceCount = 0;
        this.shot = false;
        this.birdHit = [false, false, false, false];
    }
};

//draws our bird
birdObj.prototype.draw = function() 
{

    noStroke();
    fill(248, 148, 28);
    triangle(this.position.x-8, this.position.y+5, this.position.x-20, this.position.y, this.position.x-8, this.position.y-5);
    switch(this.hitCount) //changes color once it has been hit once
    {
        case 0:
            fill(255, 0, 0);
            break;
        case 1:
            fill(0,82,45);
            break;
    }
    noStroke();
    ellipse(this.position.x, this.position.y, 20, 20);
    fill(255, 250, 250);
    ellipse(this.position.x-4, this.position.y-3, 4, 4);
    stroke(0, 0, 0);
    strokeWeight(1);
    line(this.position.x-3, this.position.y+9, this.position.x-7, this.position.y+15);
    line(this.position.x+3, this.position.y+9, this.position.x+7, this.position.y+15);
    noFill();
    stroke(0);
    strokeWeight(1);
    arc(this.position.x+1, this.position.y+4, 5, 5, radians(1), radians(180));
    
    if(this.position.x < 0)
    {
        game.gameState = 4; //game Over, bird reached left border
    }
    if(this.position.y > 400)
    {
        this.position.y = 400;
    }
    else if (this.position.y < 0)
    {
        this.position.y = 0;
    }
};

//changes states for bird
birdObj.prototype.changeState = function(x)
{
    this.currState = x;
};

//used to find intersections between whiskers and cannonballs
var findIntersection = function(p) 
{
    var distance = 0;
    
    for (var i=0; i<game.cannonBalls.length; i++) 
    {
        if(game.cannonBalls[i].fire === 1)
        {
            var d = dist(p.x, p.y, game.cannonBalls[i].x, game.cannonBalls[i].y);
            if (d < 20) {
                distance += d;
            }    
        }
    }
    
    if (distance === 0) {
        distance = 100000;
    }
    
    return(distance);
};

//moves the birds when no cannballs are near
moveState.prototype.execute = function(me)
{
    if(this.collideBall(me) === 1)
    {
        me.changeState(1);//change to avoidState when a ball is near

    }
    else
    {
        me.velocity.set(game.birdVelocity, 0);
        me.position.add(me.velocity);
    }
    
};

var maxNumber = function(n1, n2, n3, n4) //used for finding max whisker
{
    if (n1 > n2 && n1 > n3 && n1 > n4)
    {
        return n1;
    }
    else if (n2 > n1 && n2 > n3 && n2 > n4)
    {
        return n2;
    }
    else if (n3 > n1 && n3 > n2 && n3 > n4)
    {
        return n3;
    }
    else
    {
        return n1;
    }
};

//function for checking if cannonballs are near any birds
//also will change velocities of the bird that will take affect in the avoidState
moveState.prototype.collideBall = function(me) 
{
    var collide = 0;
    this.vector = me.velocity;
    this.vector.normalize();
    this.vector.mult(15);
    var ahead = PVector.add(me.position, this.vector);
    for (var i=0; i<game.cannonBalls.length; i++) 
    {
        if (game.cannonBalls[i].fire === 1) 
        {
            var d = dist(ahead.x, ahead.y, game.cannonBalls[i].position.x, game.cannonBalls[i].position.y);
            if(d < 75)
            {
                collide = 1;
                
                me.whisker1.set(this.vector.x, this.vector.y);
                me.whisker2.set(this.vector.x, this.vector.y);
                me.whisker3.set(this.vector.x, this.vector.y);
                me.whisker4.set(this.vector.x, this.vector.y);
                me.whisker1.rotate(radians(45));
                me.whisker2.rotate(radians(90));
                me.whisker3.rotate(radians(-45));
                me.whisker4.rotate(radians(-90));
                me.whisker1.add(me.position);
                me.whisker2.add(me.position);
                me.whisker3.add(me.position);
                me.whisker4.add(me.position);
                var dist1 = findIntersection(me.whisker1);
                var dist2 = findIntersection(me.whisker2);
                var dist3 = findIntersection(me.whisker3);
                var dist4 = findIntersection(me.whisker4);
                var maxDist = maxNumber(dist1, dist2, dist3, dist4);
            
                if(maxDist === dist1)
                {
                    me.velocity = me.whisker1;
                }
                else if (maxDist === dist2)  
                {
                    me.velocity = me.whisker2;
                }
                else if (maxDist === dist3)  
                {
                    me.velocity = me.whisker3;
                }
                else if (maxDist === dist4)  
                {
                    me.velocity = me.whisker4;
                }                    
            }

        }
    }
    
    return(collide);
};

//executes our avoid state 
avoidState.prototype.execute = function(me)
{
    var changeState = true;
    //check through cannonballs to see if any are still close, if so we do not change states
    for(var i=0; i<game.cannonBalls.length;i++)
    {
        var d = dist(me.position.x, me.position.y, game.cannonBalls[i].position.x, game.cannonBalls[i].position.y);
        if (d < 40)
        {
            changeState = false;
        }
    }
    
    if(changeState) //check if the ball is close
    {
        me.changeState(0);
    }
    else
    {
        //if a cannonball is still close we add our velocity that was calculated in the collideBalls funciton
        me.velocity.normalize();
        me.velocity.mult(5);
        me.position.add(me.velocity);
    }
};

//checks for user input to fire a cannonBall and sets the initial position of the ball
var checkFire = function() 
{
    var currFrameCount = frameCount;
    var timeElapsed = currFrameCount - game.prevFrameCount;
    if (game.keyArray[32] === 1) 
    {
        //println(timeElapsed);
        if (timeElapsed >= (60)) //only able to shoot once a second
        {
            game.prevFrameCount = currFrameCount;
            game.cannonBalls[game.cBallIndex].fire = 1;
            var xAdjust = cos(game.cannon.angle)*60;
            var yAdjust = sin(game.cannon.angle)*60;
            game.cannonBalls[game.cBallIndex].position.x = game.cannon.x+xAdjust;
            game.cannonBalls[game.cBallIndex].position.y = game.cannon.y+yAdjust;
            game.cBallIndex++;
            if (game.cBallIndex > 4) 
            {
                game.cBallIndex = 0;
            }
        }
    }
};


//if the key is pressed 1 will be in the array
var keyPressed = function()
{
    game.keyArray[keyCode] = 1;
};

//assures that when you release a key the value goes back to 0
var keyReleased = function()
{
    game.keyArray[keyCode] = 0;
};

//interprets mouse clicks, mainly used to change game state or difficulty in options menu
var mouseClicked = function()
{
    var xCor = mouseX;
    var yCor = mouseY;
    switch(game.gameState)
    {
        case 0:
            if(xCor >= 150 && xCor <= 250)
            {
                if(yCor >= 125 && yCor <= 175)
                {
                    game.setupGame();
                    game.gameState = 1;
                }
                else if(yCor >= 225 && yCor <= 275)
                {
                    game.gameState = 2;
                }
                else if(yCor >= 325 && yCor <= 375)
                {
                    game.gameState = 3;
                }
            }
            break;
        case 2:
            if(xCor >= 150 && xCor <= 250 && yCor >= 325 && yCor <= 375)
            {
                game.gameState = 0;
            }
            break;
        case 3:
            if(xCor >= 150 && xCor <= 250 && yCor >= 300 && yCor <= 350)
            {
                game.gameState = 0;
            }
            
            if(yCor >= 162.5 && yCor <= 187.5)
            {
                if(xCor >= 112.5 && xCor <= 187.5)
                {
                    game.difficulty = "Easy";
                    game.birdVelocity = -0.5;
                }
                else if(xCor >= 212.5 && xCor <= 287.5)
                {
                    game.difficulty = "Normal";
                    game.birdVelocity = -1;
                }
                else if(xCor >= 312.5 && xCor <= 387.5)
                {
                    game.difficulty = "Hard";
                    game.birdVelocity = -1.5;
                }
            }
            break;
        case 4:
            game.resetVars();
            game.gameState = 0;
            break;
        case 5:
            game.resetVars();
            game.gameState = 0;
            break;
    }
};

//sets up game variables
gameObj.prototype.setupGame = function()
{
    this.cannon = new cannonObj(35, 360, 0);
    var y = 50;
    for(var i=0;i<4;i++)
    {
        game.birds.push(new birdObj(380, y));
        y += 70;
    }
    this.animatedCannon = new GOcannonObj(200, 200);
};

//resets game variables in between playthroughs
gameObj.prototype.resetVars = function()
{
    this.cannon = 0;
    this.birds = [];
    this.cannonBalls =  [new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj(), new cBallObj()];
    this.cBallIndex = 0;
    this.prevFrameCount = 0;
    this.score = 0;
    this.animatedCannon = 0;
    this.animateFrameCount = 0;
    this.frameSet = false;
};

//draws fireworks
fireworkObj.prototype.draw = function() 
{
    fill(255, 255, 255);
    noStroke();
    ellipse(this.position.x, this.position.y, 2, 2);
    
    this.position.add(this.direction);
    if (dist(this.position.x, this.position.y, this.target.x, this.target.y) < 4) {
        this.step = 2;
        for (var i = 0; i < this.explosions.length; i++) {
            this.explosions[i].position.set(this.target.x, this.target.y);
            this.explosions[i].direction.set(random(0, 360), random(-0.3, 0.3));
            this.explosions[i].timer = 180;
        }
    }    
};

//draws explosion
explosionObj.prototype.draw = function() 
{
    fill(this.c1, this.c2, this.c3, this.timer);	// 4th value fader
    noStroke();
    ellipse(this.position.x, this.position.y, this.size, this.size);
    
    this.position.x += this.direction.y*cos(this.direction.x);
    this.position.y += this.direction.y*sin(this.direction.x);
/*  this.position.add(this.direction); // random cartesian direction */
    this.position.y += (90/(this.timer + 100));    //gravity
    this.timer--;
};

//two cannons on main screen
var mainScreenCannon = new cannonObj(35, 360, 0);
var mainScreenCannon2 = new cannonObj(365, 360, 1);

//function that draws a cloud
var drawCloud = function(x, y)
{
    noStroke();
    fill(255, 250, 250);
    ellipse(x, y, 100, 70);
    ellipse(x-20, y-20, 50, 50);  
    ellipse(x+20, y-20, 50, 50);
    ellipse(x-20, y+20, 50, 50);
    ellipse(x+20, y+20, 50, 50);
    ellipse(x-40, y, 50, 50);
    ellipse(x+40, y, 50, 50);    
};

//main draw function ran 60 times a second
var draw = function() 
{
    switch(game.gameState)
    {
        //main menu
        case 0:
            background(240, 188, 212);
            mainScreenCannon.draw();
            mainScreenCannon2.draw();
            textSize(50);
            fill(168, 32, 26);
            text("Bird Shoot", 200, 50);
            fill(135, 206, 235);
            stroke(0, 0, 0);
            strokeWeight(1);
            rect(200, 150, 100, 50, 10);
            fill(230, 175, 46);
            rect(200, 250, 100, 50, 10);
            fill(113, 97, 239);
            rect(200, 350, 100, 50, 10);
            fill(0, 0, 0);
            textSize(20);
            text("PLAY", 200, 150);
            text("RULES", 200, 250);
            text("OPTIONS", 200, 350);
           break;
        //game
        case 1:
            background(135, 206, 235);
            textSize(15);
            drawCloud(300, 100);
            drawCloud(100, 50);
            drawCloud(175, 250);
            fill(255, 250, 250);
            game.cannon.draw();
            game.cannon.changeAngle();
            checkFire();
            for (var i =0; i<8; i++) 
            {
                if (game.cannonBalls[i].fire === 1) 
                {
                    game.cannonBalls[i].draw();
                    game.cannonBalls[i].updatePosition();
                }
            }
            for (var i=0; i<game.birds.length;i++)
            {
                if(game.birds[i].hitCount < 2)
                {
                    game.birds[i].draw();
                    game.birds[i].states[game.birds[i].currState].execute(game.birds[i]);
                }
            }
            if(game.score === 4)
            {
                game.gameState = 5; //you win!
            }
            break;
        //rules
        case 2:
            background(240, 188, 212);
            fill(113, 97, 239);
            textSize(50);
            text("Rules", 200, 30);
            textSize(15);
            fill(0, 0, 0);
            text("4 birds start on the right side of the screen moving towards the left. Use the cannon located in the bottom left of the screen to shoot down all the birds before they make it to the left border. The left and right arrow keys control the angle of the cannon, while spacebar will shoot a cannonball.\n\nEach bird most be shot twice before it disappears, shoot each bird twice and you win! Let a bird get to the left bordder and it's game over. Beware the birds will dodge the cannonballs.", 50, 55, 300, 250);
            fill(135, 206, 235);
            rect(200, 350, 100, 50, 10);
            fill(0, 0, 0);
            text("RETURN", 200, 350);
            break;
        //options
        case 3:
            background(240, 188, 212);
            fill(168, 32, 26);
            textSize(50);
            text("Options", 200, 50);
            textSize(20);
            text("Difficulty:", 50, 175);

            switch(game.difficulty)
            {
                case "Easy":
                    fill(135, 206, 235);
                    rect(150, 175, 75, 25);
                    noFill();
                    rect(250, 175, 75, 25);
                    rect(350, 175, 75, 25);
                    break;
                case "Normal":
                    noFill();
                    rect(150, 175, 75, 25);
                    fill(135, 206, 235);
                    rect(250, 175, 75, 25);
                    noFill();
                    rect(350, 175, 75, 25);
                    break;
                case "Hard":
                    noFill();
                    rect(150, 175, 75, 25);
                    rect(250, 175, 75, 25);
                    fill(135, 206, 235);
                    rect(350, 175, 75, 25);
            }
            fill(0, 0, 0);
            textSize(15);
            text("Easy", 150, 175);
            text("Normal", 250, 175);
            text("Hard", 350, 175);
            fill(230, 175, 46);
            rect(200, 325, 100, 50, 10);
            fill(255, 255, 255);
            text("RETURN", 200, 325);
            break;
        //game over
        case 4:
            background(135, 206, 235);
            game.animatedCannon.draw();
            var busy = game.animatedCannon.animate();
            if (!busy)
            {
                fill(255, 0, 0);
                textSize(50);
                text("Game Over", 200, 150);
                textSize(20);
                text("Click anywhere to continue", 200, 250);
            }
            break;
        case 5:
            fill(35, 106, 135, 60);
            rect(200, 200, 400, 400);
            for (var j = 0; j < game.firework.length; j++) 
            {
                if (game.firework[j].step === 0) 
                {
                    game.firework[j].position.set(200, 450);
                    game.firework[j].target.set(random(100, 300), random(50, 120));
                    game.firework[j].direction.set(game.firework[j].target.x - game.firework[j].position.x, game.firework[j].target.y - game.firework[j].position.y);
                    var s = random(1, 2) / 100;
                    game.firework[j].direction.mult(s);
                    game.firework[j].step++;
                } 
                else if (game.firework[j].step === 1) 
                {
                    game.firework[j].draw();
                } 
                else if (game.firework[j].step === 2) 
                {
                    for (var i = 0; i < game.firework[j].explosions.length; i++) 
                    {
                        game.firework[j].explosions[i].draw();   
                    } 
                    if (game.firework[j].explosions[0].timer <= 0) 
                    {
                        game.firework[j].step = 0;   
                    }
                }
            }
            fill(168, 32, 26);
            textSize(50);
            text("You Win!", 200, 200);
            textSize(20);
            text("Click the mouse to continue", 200, 300);
            break;
    }
};

