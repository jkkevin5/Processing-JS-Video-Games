/*
ECE 4525 Virginia Tech Fall 2020
Project 3
Kevin Kleinegger
Khan Academy
*/

//global settings
angleMode = "radians";
rectMode(CENTER);
imageMode(CENTER);

//object for bullets
var bulletObj = function(x, y)
{
    this.x = 0;
    this.y = 0;
    this.fire = 0;
    this.newDirection = true;
    this.shootDirection = "east";
};

//game object to store 'global' variables
var gameObj = function()
{
    this.tilemap = [
        "cttttttttttttttttttttttttttttttwttttttttttttttttto",
        "m                    w   f     w              f  r",
        "m      e       e     w     e   w   e             r",
        "m                    w         w f           e   r",
        "m         e          w  e      w                 r",
        "m                              wwwwwwwwww        r",
        "m            w                 w           e     r",
        "m    e       w                 w   e             r",
        "m          f w                 w                 r",
        "wwwwwwww     w     e       e                     r",
        "m            w                          e        r",
        "m    e       w                 f                 r",
        "m            w     e                             r",
        "m  w   wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww       e   r",
        "m            w                                   r",
        "m        e   w                        e          r",
        "m   e        w  f               e                r",
        "m            w           e                       r",
        "m            w     f                             r",
        "m            w                   e     e         r",
        "m f          w  f        e                       r",
        "m  e         w                                   r",
        "m     wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        "m            w                                   r",
        "m            w e                     e     f     r",
        "m    e       w                                   r",
        "m          f w     e                       f     r",
        "m       e    w                                   r",
        "m            w                    e              r",
        "m f          w   e f                             r",
        "m   e        w                                   r",
        "m            wwwwwwwwwwwwwwwwwwwwwwwwwww         r",
        "m            w                         w         r",
        "m   e        w   e              w      w    e    r",
        "m            w     f                f  w         r",
        "m            w         w               w    e    r",
        "m      e     w     w                   w         r",
        "m            w     w           e                 r",
        "m          f w  f     e                          r",
        "m  e         w            w                      r",
        "m            w                         w         r",
        "m     wwwwwwww         ww      w       w   e     r",
        "m            w   e                     w         r",
        "m     e      w      e   w     e        w         r",
        "m            w                         w    e    r",
        "m            w     w       w      w    w         r",
        "m                        w    f        w  f  f   r",
        "m                   e                  wwwwwwwwwww",
        "m    e        w          w      e                r",
        "m                                                r",
        "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",];
    this.gameState = 0;
    this.walls = [];
    this.fruits = [];
    this.image = 0;
    this.enemies = [];
    this.player = 0;
    this.keyArray = [];
    this.bullets = [new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj()];
    this.bulletIndex = 0;
    this.score = 0;
    this.xCor = -290;
    this.yCor = -290;
    this.currFrameCount  = 0;
    this.magicCircles = [];
    this.enemySpeed = 1.5;
    this.difficulty = "Normal";
    this.winningPlayer = 0;
    this.losingEnemy = 0;
    this.mainScreenFruits = [];
    this.mainScreenPlayer = 0;
};

//game variable
var game = new gameObj();

//object for playable character
//x, y - position
//s - size, used for animation and main screen
var playerObj = function(x, y, s)
{
    this.x = x;
    this.y = y;
    this.dead = false;
    this.xDir = 0;
    this.yDir = 0;
    this.shootDir = "east";
    this.size = s;
};

//object for walls/bricks
var wallObj = function(x,y,b)
{
    this.position = new PVector(x, y);
};

//moveState and turnState are 'objects' that are used as states for enemy movement
//moveState moves the enemy and turnState turns the enemy whenever it's angle is changed
var moveState = function()
{
    this.wanderDist = 0;
    this.angle = 0;
    this.changeStates = false;
    this.stuckCount = 0;
};

var turnState = function()
{
    this.angle = 0;
    this.angleDir = 0;
    this.vec = new PVector(0,0);
};

//object for the enemy
var enemyObj = function(x, y, s)
{
    this.position = new PVector(x, y);
    this.state = [new moveState(), new turnState()];
    this.currState = 0;
    this.angle = 0;
    this.step = new PVector(0, 0);
    this.size = s;
    this.dead = false;
};

//Game over screen enemy for animation purposes
var GOenemyObj = function(x, y)
{
    this.x = x;
    this.y = y;
    this.size = 20;
};

//game over animation
GOenemyObj.prototype.draw = function() 
{
    noStroke();
    rectMode(CENTER);
    fill(255, 0, 0);
    rect(this.x, this.y, this.size, this.size);
    fill(255, 255, 255);
    ellipse(this.x+(this.size/4),  this.y-(this.size/4), (this.size/4), (this.size/4));
    ellipse(this.x-(this.size/4), this.y-(this.size/4), (this.size/4), (this.size/4));
    arc(this.x, this.y+(this.size*0.3), (this.size*0.75), (this.size*0.5),PI, 2*PI);
};

//game over animation
GOenemyObj.prototype.animate = function()
{
    var busy = false;
    if (this.size < 400)
    {
        this.size += 5;
        busy = true;
    }
    return busy;
};

//function to change the enemy's state
enemyObj.prototype.changeState = function(x)
{
    this.currState = x;
};

//executes the moveState
moveState.prototype.execute = function(me)
{
    //wandering function to decide a random direction to travel every 200 movements
    if(this.wanderDist <= 0)
    {
        this.wanderDist = 200;
        this.angle = random(0, PI*2);
        me.step.set(cos(this.angle), sin(this.angle));
        me.step.normalize();
        me.step.mult(game.enemySpeed);
        me.changeState(1);
    }
    this.wanderDist--;
    
    //checks for wall collisions
    //if the enemy is coming close to a wall it reverses it's direction
    for (var i=0; i<game.walls.length; i++) 
    {
        if (dist(me.position.x, me.position.y, game.walls[i].position.x, game.walls[i].position.y) < 25) 
        {
            me.step.mult(-1);
            me.position.add(me.step);
            me.changeState(1);
        }
    }
    
    me.position.add(me.step); //moves the character


    //if blocks for teleporting
    if (me.position.x < 10)
    {
       me.position.x = 990;
    }
    else if (me.position.x > 990)
    {
        me.position.x = 10;
    }
    
    if (me.position.y < 10)
    {
       me.position.y = 990;
    }
    else if (me.position.y > 990)
    {
        me.position.y = 10;
    }    
};

//executes the turn state
turnState.prototype.execute = function(me)
{
    this.angle = me.step.heading(); //angle to be turned to
    
    //difference of wanted angle and current angle of the enemy
    var angleDiff = abs(this.angle - me.angle); 
    
    if(angleDiff > PI/90) //allows the angle to be off by 2 degrees or PI/90 radians
    {
        //sets the direction to turn
        if (this.angle > me.angle)
        {
            this.angleDir = (3*PI)/180;
        }
        else
        {
            this.angleDir = -(3*PI)/180;
        }
        if(angleDiff > PI)
        {
            this.angleDir = -this.angleDir;
        }
        
        me.angle += this.angleDir; //increments angle so the enemy turns slowly
        if(me.angle > PI)
        {
            me.angle = -(179*PI)/180;
        }
        else if (me.angle < -PI)
        {
            me.angle = (179*PI)/180;
        }
    }
    else
    {
        me.changeState(0);//once done turning we go back to the moveState
    }
};

//object for the collectable fruits
var fruitObj = function(x, y, f)
{ 
    this.x = x;
    this.y = y;
    this.collected = false;
    this.fruit = f;
};

//border
var magicCircleObj = function(x, y, s)
{
    this.x = x;
    this.y = y;
    this.side = s;
};

//draws player
playerObj.prototype.draw = function() 
{
    pushMatrix();
    translate(this.x, this.y);
    noStroke();
    fill(0, 0, 255);
    rect(0, 0, this.size, this.size);
    fill(255, 255, 255);
    ellipse(-(this.size/4),  -(this.size/4), (this.size/4), (this.size/4));
    ellipse((this.size/4), -(this.size/4), (this.size/4), (this.size/4)); 
    arc(0,  (this.size/10), (this.size*0.75), (this.size/2),0, PI);
    fill(0, 0, 0);
    if(game.gameState === 2)
    {
        //draws the gun and eyes on the player model for the game
        switch(this.shootDir)
        {
            case "north":
                rect(0, -12, 2, 4);
                ellipse(-5, -6.5, 2, 2);
                ellipse(5, -6.5, 2, 2);
                break;
            case "south":
                rect(0, 12, 2, 4);
                ellipse(-5, -3.5, 2, 2);
                ellipse(5, -3.5, 2, 2);
                break;
            case "east":
                ellipse(-3.5, -5, 2, 2);
                ellipse(6.5, -5, 2, 2);
                rect(12, 0, 4, 2);
                break;
            case "west":
                rect(-12, 0, 4, 2);
                ellipse(-6.5, -5, 2, 2);
                ellipse(3.5, -5, 2, 2);
                break;
        }        
    }
    popMatrix();
    
    if(game.gameState === 2)
    {
        //movement keys for character, changes player position and the map translate
        //coordinates
        //also sets the shoot direction
        if(game.keyArray[87] === 1)
        {
            if(this.y <= 10)
            {
                this.y +=5;
                game.yCor -= 5;
            }
            else
            {
                game.yCor += 2;
                this.y -= 2;
            }
            this.yDir = 5;
            this.shootDir = "north";
        }
        else if (game.keyArray[83] === 1)
        {
            if(this.y >= 990)
            {
                this.y -=5;
                game.yCor += 5;
            }
            else
            {
                game.yCor -= 2;
                this.y += 2;
            }
            this.yDir = -5;
            this.shootDir = "south";
        }
        else if (game.keyArray[65] === 1)
        {
            if(this.x <= 10)
            {
                this.x +=5;
                game.xCor -= 5;
            }
            else
            {
            game.xCor += 2;
            this.x -= 2;
            }
            this.shootDir = "west";
            this.xDir = 5;
        }
        else if(game.keyArray[68] === 1)
        {
            if(this.x >= 990)
            {
                this.x -= 5;
                game.xCor += 5;
            }
            else
            {
                game.xCor -= 2;
                this.x += 2;
            }
            this.xDir = -5;
            this.shootDir = "east";
        }        
    }
};

//function for checking for player collisions
playerObj.prototype.checkCollisions = function()
{
    var self = this;
    var checkBrickCollision = function()
    {
        var collide = false;
        for (var i=0; i < game.walls.length; i++)
        {
            if(dist(self.x, self.y, game.walls[i].position.x, game.walls[i].position.y) < 20)
            {
                collide = true;
            }
        }
        return collide;
    };
    
    var wallCollide = checkBrickCollision();
    
    if(wallCollide)
    {
        this.x += this.xDir;
        this.y += this.yDir;
        game.xCor -= this.xDir;
        game.yCor -= this.yDir;
        this.xDir = 0;
        this.yDir = 0;
    }
    
    //checks for fruit collisons
    for (var i=0; i < game.fruits.length;i++)
    {
        if(dist(this.x, this.y, game.fruits[i].x, game.fruits[i].y) < 15 && game.fruits[i].collected === false)
        {
            game.fruits[i].collected = true;
            game.score++;
        }
    }
    
    //enemy collisions
    for (var i=0;i < game.enemies.length;i++)
    {
        if((dist(this.x, this.y, game.enemies[i].position.x, game.enemies[i].position.y) < 20) && game.enemies[i].dead === false)
        {
            this.dead = true;
        }
    }
};

//for winning screen
playerObj.prototype.animate = function()
{
    var busy = false;
    if (this.size < 400)
    {
        this.size += 5;
        busy = true;
    }
    return busy;
};

//draws enemy character
enemyObj.prototype.draw = function() 
{
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    noStroke();
    fill(255, 0, 0);
    rect(0, 0, this.size, this.size);
    fill(255, 255, 255);
    arc((this.size/2), 0, this.size, (this.size/2), PI/2, (3*PI)/2);
    fill(0, 0, 0);
    triangle((this.size*0.3), -(this.size*0.2), (this.size/2), -4.5, (this.size*0.4), (this.size/20));
    popMatrix();
};

//draws bullets in correct direction
bulletObj.prototype.draw = function() 
{
    //we only want to switch the bullets directions on newly shot bullets, this assures
    //that we don't change the direction of a bullet after it has been shot
    if( this.newDirection ) 
    {
        this.shootDirection = game.player.shootDir;
        this.newDirection = false;
    }

    fill(255, 0, 0);
    ellipse(this.x, this.y, 2, 6);
    switch(this.shootDirection)
    {
        case "north":
            this.y -= 5;
            if (this.y < (game.player.y - 200)) 
            {
                this.fire = 0;
                this.newDirection = true;
            }
            break;
        case "south":
                this.y += 5;
                if (this.y > (game.player.y + 200)) 
                {
                    this.fire = 0;
                    this.newDirection = true;
                }
            
            break;
        case "east":
                this.x += 5;
                if (this.x > (game.player.x + 200)) 
                {
                    this.fire = 0;
                    this.newDirection = true;

                }
            
            break;
        case "west":
                this.x -= 5;
                if (this.x < (game.player.x - 200)) 
                {
                    this.fire = 0;
                    this.newDirection = true;
                }
            break;
    }
    
    //checks for enemy collisions and sets the enemy dead flag to true if it hits
    for(var i=0; i < game.enemies.length; i++)
    {
        if(game.enemies[i].dead === false && (dist(this.x, this.y, game.enemies[i].position.x, game.enemies[i].position.y) < 10))
        {
            game.enemies[i].dead = true;
        }
    }
    
    //blocks bullets from traveling through walls
    for(var i=0; i< game.walls.length; i++)
    {
        if(dist(this.x, this.y, game.walls[i].position.x, game.walls[i].position.y)<10)
        {
            this.fire = 0;
            this.newDirection = true;
        }
    }
};

//checks for spacebar input and fires if needed
var checkFire = function()
{
    if (game.keyArray[32] === 1 && game.difficulty !== "Hard") 
    {
        if (game.currFrameCount < (frameCount - 10)) 
        {
            game.currFrameCount = frameCount;
            game.bullets[game.bulletIndex].fire = 1;
            game.bullets[game.bulletIndex].x = game.player.x ;
            game.bullets[game.bulletIndex].y = game.player.y ;
            game.bulletIndex++;
            if (game.bulletIndex > 4) 
            {
                game.bulletIndex = 0;
            }
        }
    }
};

//next three function are just for drawing the 3 different types of fruits
var drawApple = function(x, y)
{
    rectMode(CORNER);
    fill(255, 0, 0);
    ellipse(x, y, 20, 20);
    fill(139, 69, 19);
    rect(x-2, y-15, 3, 5);
    fill(58, 200, 11);
    quad(x-5, y-19, x-8, y-15, x-5, y-11, x-2, y-15);
    rectMode(CENTER);
};

var drawOrange = function(x, y)
{
    fill(255, 127, 0);
    ellipse(x, y, 20, 20);
    stroke(0,0,0);
    strokeWeight(2);
    point(x, y-10);
    strokeWeight(1);
};

var drawCoconut = function(x, y)
{
    fill(150, 90, 62);
    ellipse(x, y, 20, 20);
    fill(0, 0, 0);
    ellipse(x, y-7, 2, 2);
    ellipse(x-3, y-5, 2, 2);
    ellipse(x+3, y-5, 2, 2);
};

//draws fruits
fruitObj.prototype.draw = function() 
{
    switch(this.fruit)
    {
        case 0:
            noStroke();
            drawApple(this.x, this.y);
            break;
        case 1:
            noStroke();
            drawCoconut(this.x, this.y);
            break;
        case 2:
            noStroke();
            drawOrange(this.x, this.y);
            break;
    }
};

//animates frutis for main screen
fruitObj.prototype.animate = function() 
{
    this.y++;
    if(this.y > 410)
    {
        this.y = floor(random(-200, -10));
        this.fruit = floor(random(0,3));
    }
};

//sets up game variables/loads tilemap
gameObj.prototype.setupGame = function()
{
    for (var i = 0; i< this.tilemap.length; i++) {
        for (var j =0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
                case 'w': 
                    this.walls.push(new wallObj(j*20+10, i*20+10));
                    break;
                case 'f': 
                    this.fruits.push(new fruitObj(j*20+10, i*20+10, floor(random(0,3))));
                    break;
                case 'e':
                     this.enemies.push(new enemyObj(j*20, i*20, 20));
                     break;
                case 'm':
                    this.magicCircles.push(new magicCircleObj(j*20, i*20, 0));
                    break;
                case 'r':
                    this.magicCircles.push(new magicCircleObj(j*20, i*20, 1));
                    break;
                case 'b':
                    this.magicCircles.push(new magicCircleObj(j*20, i*20, 2));
                    break;
                case 't':
                    this.magicCircles.push(new magicCircleObj(j*20, i*20, 3));
                    break;
                case 'c':
                    this.magicCircles.push(new magicCircleObj(j*20, i*20, 4));
                    break;
                case 'o':
                    this.magicCircles.push(new magicCircleObj(j*20, i*20, 5));
                    break;

            }
        }
    } 
    
    this.player = new playerObj(500, 500, 20);
    this.winningPlayer = new playerObj(200, 200, 20);
    this.losingEnemy = new GOenemyObj(200, 200);
    var x = 20;
    for(var i=0; i<10; i++)
    {
        this.mainScreenFruits.push(new fruitObj(x, floor(random(0,401)), floor(random(0,3))));
        this.mainScreenFruits.push(new fruitObj(x, floor(random(0,401)), floor(random(0,3))));
        this.mainScreenFruits.push(new fruitObj(x, floor(random(-400,401)), floor(random(0,3))));

        x += 40;
    }
    
    this.mainScreenPlayer = new playerObj(200, 300, 100);
    
};

//draws fruits, walls and enemies on the map
gameObj.prototype.drawBackground = function()
{
    for (var i=0; i<game.walls.length; i++) 
    {
        game.walls[i].draw();
    }
    
    for(var i=0; i<game.fruits.length; i++)
    {
        if(game.fruits[i].collected === false)
        {
            game.fruits[i].draw();
        }
    }
    
    for (var i=0; i<game.enemies.length;i++)
    {
        var xDiff = abs(game.enemies[i].position.x - game.player.x);
        var yDiff = abs(game.enemies[i].position.y - game.player.y);
        if(game.enemies[i].dead === false)
        {
            if(game.difficulty === "Easy")
            {
                if(xDiff <= 205 && yDiff <= 205) {
                game.enemies[i].draw();
                game.enemies[i].state[game.enemies[i].currState].execute(game.enemies[i]);                 }
            }
            else
            {
                game.enemies[i].draw();
                game.enemies[i].state[game.enemies[i].currState].execute(game.enemies[i]);
            }

        }
    }
    
    
    for (var i=0; i<game.magicCircles.length; i++) 
    {
        rectMode(CORNER);
        game.magicCircles[i].draw();
        rectMode(CENTER);
    }
    
};


//resets game variables to allow multiple playthroughs
gameObj.prototype.resetVars = function()
{
    this.walls = [];
    this.fruits = [];
    this.enemies = [];
    this.player = 0;
    this.keyArray = [];
    this.bullets = [new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj()];
    this.bulletIndex = 0;
    this.score = 0;
    this.xCor = -290;
    this.yCor = -290;
    this.currFrameCount  = 0;
    this.magicCircles = [];
    this.mainScreenFruits = [];
};


//draws border
magicCircleObj.prototype.draw = function() 
{
    fill(250, 3, 40);
    noStroke();
    switch(this.side)
    {
        case 0:
            rect(this.x, this.y, 2, 20);
            break;
        case 1:
            rect(this.x+20,this.y, 2, 20);
            break;
        case 2:
            rect(this.x, this.y, 20, 2);
            break;
        case 3:
            rect(this.x, this.y, 20, 2);
            break;
        case 4:
            rect(this.x, this.y, 2, 20);
            rect(this.x, this.y, 20, 2);
            break;
        case 5:
            rect(this.x, this.y, 20, 2);
            rect(this.x+20,this.y, 2, 20);
            break;
            
    }
};


//draws walls
wallObj.prototype.draw = function() 
{
    image(game.image, this.position.x, this.position.y, 20, 20);
};


//creates custom block (brick) then takes a screenshot to store in game.image
var createBrick = function()
{
    fill(183, 53, 57);       // set background of the custom char
    rect(0, 0, 400, 400);
    fill(140, 123, 117);
    noStroke();
    rect(0, (368/3), 400, 16);
    rect(0, 2*(368/3)+16, 400, 16);
    rect(92, 0, 16, (368/3));
    rect(292, 0, 16, (368/3));
    rect(50, (368/3)+16, 16, (368/3));
    rect(250, (368/3)+16, 16, (368/3));
    rect(92, 400-(368/3), 16, (368/3));
    rect(292, 400-(368/3), 16, (368/3));
    game.image= get(0,0,width,height);
};

//interprets mouse clicks, used to click buttons and switch game states
var mouseClicked = function()
{
    var xCor = mouseX;
    var yCor = mouseY;
    switch(game.gameState)
    {
        case 1:
            if (yCor >= 125 && yCor <= 175)
            {
                if (xCor >= 32.5 && xCor <= 122.5)
                {
                    game.gameState = 2;
                }
                else if (xCor >= 155 && xCor <= 245)
                {
                    game.gameState = 3;
                }
                else if (xCor >= 277.5 && xCor <= 367.5)
                {
                    game.gameState = 4;
                }
            }
            break;
        case 3:
            if(xCor >= 150 && xCor <= 250 && yCor >= 300 && yCor <= 350)
            {
                game.gameState = 1;
            }
            break;
        case 4:
            if(xCor >= 150 && xCor <= 250 && yCor >= 300 && yCor <= 350)
            {
                game.gameState = 1;
            }
            
            if(yCor >= 162.5 && yCor <= 187.5)
            {
                if(xCor >= 112.5 && xCor <= 187.5)
                {
                    game.difficulty = "Easy";
                    game.enemySpeed = 1;
                }
                else if(xCor >= 212.5 && xCor <= 287.5)
                {
                    game.difficulty = "Normal";
                    game.enemySpeed = 1.5;
                }
                else if(xCor >= 312.5 && xCor <= 387.5)
                {
                    game.difficulty = "Hard";
                    game.enemySpeed = 1.5;
                }
            }
            break;
        case 5:
            game.gameState = 1;
            game.resetVars();
            game.setupGame();
            break;
        case 6:
            game.gameState = 1;
            game.resetVars();
            game.setupGame();
            break;
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

//main draw function
var draw = function() 
{
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    switch(game.gameState)
    {
        //custom char generation
        case 0:
            rectMode(CORNER);
            createBrick();
            game.gameState = 1;
            game.setupGame();
            break;
        //main menu
        case 1:
            background(245, 193, 245);
            game.mainScreenPlayer.draw();
            for (var i=0; i < game.mainScreenFruits.length; i++)
            {
                game.mainScreenFruits[i].draw();
                game.mainScreenFruits[i].animate();
            }
            fill(249, 87, 56);
            textSize(45);
            text("Fruit Collector", 200, 50);
            stroke(249, 87, 56);
            fill(234, 196, 53);
            rect(77.5, 150, 90, 50);
            fill(104, 182, 132);
            rect(200, 150, 90, 50);
            fill(96, 73, 90);
            rect(322.5, 150, 90, 50);
            fill(255, 255, 255);
            textSize(18);
            text("PLAY", 77.5, 150);
            text("RULES", 200, 150);
            text("OPTIONS", 322.5, 150);
            break;
        //game
        case 2:
            background(245, 193, 245);
            //rectMode(CORNER);
            pushMatrix();
            translate(game.xCor, game.yCor);
            game.drawBackground();
            game.player.draw();
            game.player.checkCollisions();
            checkFire();
            for (var i =0; i<5; i++) 
            {
                if (game.bullets[i].fire === 1) 
                {
                    game.bullets[i].draw();
                }
            }
            popMatrix();
            if(game.player.dead === true)
            {
                game.gameState = 5; //game over
                
            }
            if(game.score >= 20)
            {
                game.gameState = 6; //you win!
            }
            fill(255, 0, 0);
            textSize(10);
            text(game.score, 210, 190); //score written over player's head
            break;
        //rules
        case 3:
            background(121, 173, 220);
            fill(249, 87, 56);
            textSize(50);
            text("Rules", 200, 50);
            textSize(15);
            fill(0, 0, 0);
            text("50 enemies and 20 fruits are scattered across the map. Move around using WASD, collect all 20 fruits while avioding enemies and you win!\n\nShoot enemies that are in your way using the SPACEBAR. The bullets will fire in whatever direction you are traveling.\n\nThe player character can not enter the magical circle border however, watch out!  Enemies can teleport to the other side of the map by going through the magical border. ", 50, 55, 300, 250);
            fill(104, 182, 132);
            rect(200, 325, 100, 50);
            fill(255, 255, 255);
            text("RETURN", 200, 325);
            break;
        //options
        case 4:
            background(121, 173, 220);
            fill(249, 87, 56);
            textSize(50);
            text("Options", 200, 50);
            textSize(20);
            text("Difficulty:", 50, 175);
            textSize(15);
            fill(96, 73, 90);
            text("Easy - only close enemies move, slow enemies", 200, 225);
            text("Normal - faster enemies, constant movement", 200, 250);
            text("Hard - same speed enemies but no shooting allowed", 200, 275);
            
            switch(game.difficulty)
            {
                case "Easy":
                    fill(239, 71, 111);
                    rect(150, 175, 75, 25);
                    noFill();
                    rect(250, 175, 75, 25);
                    rect(350, 175, 75, 25);
                    break;
                case "Normal":
                    noFill();
                    rect(150, 175, 75, 25);
                    fill(239, 71, 111);
                    rect(250, 175, 75, 25);
                    noFill();
                    rect(350, 175, 75, 25);
                    break;
                case "Hard":
                    noFill();
                    rect(150, 175, 75, 25);
                    rect(250, 175, 75, 25);
                    fill(239, 71, 111);
                    rect(350, 175, 75, 25);
            }
            fill(0, 0, 0);
            text("Easy", 150, 175);
            text("Normal", 250, 175);
            text("Hard", 350, 175);
            fill(104, 182, 132);
            rect(200, 325, 100, 50);
            fill(255, 255, 255);
            text("RETURN", 200, 325);
            break;
        //game over
        case 5:
            background(245, 193, 245);
            game.losingEnemy.draw();
            var busy = game.losingEnemy.animate();
            if(!busy)
            {
                fill(255, 0, 0);
                textSize(30);
                text("Game", 100, 100);
                text("Over", 300, 100);
                textSize(15);
                text("Click the mouse to return to main page", 200, 275);
            }
            break;
        //game win    
        case 6:
            background(121, 173, 220);
            game.winningPlayer.draw();
            var busy = game.winningPlayer.animate();
            if(!busy)
            {
                fill(0, 0, 255);
                textSize(30);
                text("You", 100, 100);
                text("Win!", 300, 100);
                textSize(15);
                text("Click the mouse to return to main page", 200, 275);
            }
            break;
    }
};
