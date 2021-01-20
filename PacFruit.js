/*
ECE 4525 Virginia Tech Fall 2020
Project 7
Kevin Kleinegger
Khan Academy
*/

angleMode = "radians";

//object used in A* search
var qObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.fcost = 0;
};

qObj.prototype.set = function(a, b) {
    this.x = a;
    this.y = b;
};

//object for the target of an A* search
var targetObj = function(x, y) {
    this.x = x;
    this.y = y;
};

//game object for storing 'global' variables
var gameObj = function()
{
    this.tilemap = [
        "f      f            ",
        "f  e   f            ",
        "wwwwwwwwwwwwwww  f  ",
        "    f     fw        ",
        "           ww    www",
        "    www    w  e    f",
        "w  fw      w f      ",
        "    w f    wwwww    ",
        "    wwww    f w    w",
        "f   w  e      w     ",
        "   ww    w   fw    f",
        "    w               ",
        "wf  w f             ",
        "    wwwwwwwwwwwwwwww",
        "   ww    w    fw    ",
        " f   e              ",
        "                    ",
        "wwwwwwwwwwwwwwww    ",
        "                    ",
        " f    p             ",];
    this.gameState = 0;
    this.walls = [];
    this.fruits = [];
    this.image = 0;
    this.enemies = [];
    this.player = 0;
    this.keyArray = [];
    this.score = 0;
    this.winFruits = [];
    this.losingEnemy = 0;
    this.mainScreenPlayers = [];
    this.mainScreenEnemies = [];
    this.difficulty = "Normal";
    this.enemySpeed = 1;
    this.movementSetting = 0;
    this.upKey = 38;
    this.downKey = 40;
    this.leftKey = 37;
    this.rightKey = 39;
    this.frame = frameCount;
    this.sightSetting = 500;
};

var game = new gameObj();

//player object, this is the blue smiling square that the player controls
var playerObj = function(x, y)
{
    this.x = x;
    this.y = y;
    this.dead = false;
    this.xDir = 0;
    this.yDir = 0;
};

//object for the enemy
//the enemy moves in an a* seatch pattern and uses whiskers to avoid walls
var enemyObj = function(x, y)
{
    this.position = new PVector(x, y);
    this.angle = 0;
    this.size = 20;
    this.whisker1 = new PVector(0, 0);
    this.whisker2 = new PVector(0, 0);
    this.step = new PVector(0, 0);
    this.graph = new Array(20);
    this.cost = new Array(20);
    this.inq = new Array(20);
    this.comefrom = new Array(20);
    for (var i=0; i<20; i++) {
        this.graph[i] = new Array(20);
        this.cost[i] = new Array(20);
        this.inq[i] = new Array(20);
        this.comefrom[i] = new Array(20);
    }
    this.path = [];
    this.q = [];
    for (i=0; i<400; i++) {
        this.path.push(new PVector(0, 0));
        this.q.push(new qObj(0, 0));
    }
    for (i=0; i<20; i++) {
        for(var j=0; j<20; j++) {
            this.comefrom[i][j] = new PVector(0, 0);
        }
    }
    this.pathLen = 0;
    this.pathFound = 0;
    this.qLen = 0;
    this.qStart = 0;
    this.target = new targetObj(0, 0);
    this.targetPos = new targetObj(0, 0);
    this.finalDest = new targetObj(0, 0); 
};

//main screen animation
enemyObj.prototype.animate = function()
{
    this.position.x += 1.5;
    if (this.position.x > 400)
    {
        this.position.x = -20;
    }
};


//used to find intersections between whiskers and cannonballs
var findIntersection = function(p) 
{
    var distance = 0;
    
    for (var i=0; i<game.walls.length; i++) {
        var d = dist(p.x, p.y, game.walls[i].x+10, game.walls[i].y+10);
        if (d < 20) {
            distance += d;
        }
    }
    
    if (distance === 0) {
        distance = 100000;
    }
    
    return(distance);
};

//checks for wall collision and changes the target based on the whisker with the shortest
//distance
enemyObj.prototype.collideWall = function()
{
    var collide = 0;
    this.step.set(this.target.x - this.position.x, this.target.y - this.position.y);
    this.step.normalize();
    this.step.mult(10);
    var ahead = PVector.add(this.position, this.step);
    for (var i=0; i<game.walls.length; i++)
    {
        if (dist(ahead.x, ahead.y, game.walls[i].x+10, game.walls[i].y+10) < 20) 
        {
            collide = 1;
            this.whisker1.set(this.step.x, this.step.y);
            this.whisker2.set(this.step.x, this.step.y);
            this.whisker1.rotate(radians(45));
            this.whisker2.rotate(radians(-45));
            this.whisker1.add(this.position);
            this.whisker2.add(this.position);
            var dist1 = findIntersection(this.whisker1);
            var dist2 = findIntersection(this.whisker2);

            if(dist1 > dist2)
            {
                this.target.x = this.whisker1.x;
                this.target.y = this.whisker1.y;
            }
            else
            {
                this.target.x = this.whisker2.x;
                this.target.y = this.whisker2.y;
            }
        }
    }
    return(collide);
};

//move function that moves enemy accoring to the path made from findAStarPath
enemyObj.prototype.move = function()
{
    if(this.collideWall() === 0)
    {
        if (dist(this.target.x, this.target.y, this.position.x, this.position.y) > 2) {
            this.step.set(this.target.x - this.position.x, this.target.y -this.position.y);
            this.step.normalize();
            this.step.mult(game.enemySpeed);
            this.position.add(this.step);
        }
        else 
        {
            this.pathLen--;
            if (this.pathLen > 0) {
                this.target.x = this.path[this.pathLen].x;
                this.target.y = this.path[this.pathLen].y;
            }
        }        
    }
};

//separate object for the enemy used in the Game OVer animation
var GOenemyObj = function(x, y)
{
    this.x = x;
    this.y = y;
    this.size = 20;
};

//object for the walls/bricks
var wallObj = function(x,y)
{
    this.x = x;
    this.y = y;
};

//object for the collectable fruits
var fruitObj = function(x, y, f)
{ 
    this.x = x;
    this.y = y;
    this.collected = false;
    this.fruit = f;
};

var drawApple = function(x, y)
{
    fill(255, 0, 0);
    ellipse(x, y, 20, 20);
    fill(139, 69, 19);
    rect(x-2, y-15, 3, 5);
    fill(58, 200, 11);
    quad(x-5, y-19, x-8, y-15, x-5, y-11, x-2, y-15);
};

//next three function are just for drawing the 3 different types of fruits
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

//initializes a graph for an enemy to use for its search algorithim
enemyObj.prototype.initGraphTilemap = function()
{
    for (var i=0; i<game.tilemap.length; i++) {
        for (var j=0; j<game.tilemap[i].length; j++) {
            if (game.tilemap[i][j] === 'w') {
                this.graph[i][j] = -1;
            }
            else
            {
                this.graph[i][j] = 0;
            }
        }
    }
};

//function is called in findAStarPath
enemyObj.prototype.initGraph = function(x, y)
{
    for (var i = 0; i< 20; i++) {
        for (var j = 0; j<20; j++) {
            if (this.graph[i][j] > 0) {
                this.graph[i][j] = 0;
            }
            this.inq[i][j] = 0;
            this.cost[i][j] = 0;
        }
    }
    
    this.graph[x][y] = 1;
};

//calculates a path based on to a target given a certain location by using graphs
enemyObj.prototype.findAStarPath = function(x, y)
{
    var i1, j1, a, b;
    this.qLen = 0;
    this.graph[x][y] = 1;
    this.inq[x][y] = 1;
    this.q[this.qLen].set(x, y);
    this.q[this.qLen].fcost = 0;
    this.qLen++;
    this.pathLen = 0;
    this.qStart = 0;
    
    var self = this;

    var findMinInQ = function() {
        var min = self.q[self.qStart].fcost;
        var minIndex = self.qStart;
        for (var i = self.qStart+1; i<self.qLen; i++) {
            if (self.q[i].fcost < min) {
                min = self.q[i].fcost;
                minIndex = i;
            }
        }
        if (minIndex !== this.qStart) {  // swap
            var t1 = self.q[minIndex].x;
            var t2 = self.q[minIndex].y;
            var t3 = self.q[minIndex].fcost;
            self.q[minIndex].x = self.q[self.qStart].x;
            self.q[minIndex].y = self.q[self.qStart].y;
            self.q[minIndex].fcost = self.q[self.qStart].fcost;
            self.q[self.qStart].x = t1;
            self.q[self.qStart].y = t2;
            self.q[self.qStart].fcost = t3;
        }
    };
    
    while ((this.qStart < this.qLen) && (this.pathFound === 0)) {
	    findMinInQ();
        i1 = this.q[this.qStart].x;
        j1 = this.q[this.qStart].y;
        this.graph[i1][j1] = 1;
        this.qStart++;
        
        if ((i1 === this.targetPos.x) && (j1 === this.targetPos.y)) {
            this.pathFound = 1;
            this.path[this.pathLen].set(j1*20+10, i1*20+10);
            this.pathLen++;
        }
        

        
        a = i1+1;
        b = j1;
        if ((a < 20) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.inq[a][b] = 1;
                this.comefrom[a][b].set(i1, j1);
                this.q[this.qLen].set(a, b);
                this.cost[a][b] = this.cost[i1][j1] + 10;
                this.q[this.qLen].fcost = this.cost[a][b] + dist(b*20+10, a*20+10,
this.finalDest.x, this.finalDest.y);
                this.qLen++;
            }
        }
        a = i1-1;
        b = j1;
        if ((a >= 0) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.inq[a][b] = 1;
                this.comefrom[a][b].set(i1, j1);
                this.q[this.qLen].set(a, b);
                this.cost[a][b] = this.cost[i1][j1] + 10;
                this.q[this.qLen].fcost = this.cost[a][b] + dist(b*20+10, a*20+10,
this.finalDest.x, this.finalDest.y);
                this.qLen++;
            }
        }
        a = i1;
        b = j1+1;
        if ((b < 20) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.inq[a][b] = 1;
                this.comefrom[a][b].set(i1, j1);
                this.q[this.qLen].set(a, b);
                this.cost[a][b] = this.cost[i1][j1] + 10;
                this.q[this.qLen].fcost = this.cost[a][b] + dist(b*20+10, a*20+10,
this.finalDest.x, this.finalDest.y);
                this.qLen++;
            }
        }
        a = i1;
        b = j1-1;
        if ((b >= 0) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.inq[a][b] = 1;
                this.comefrom[a][b].set(i1, j1);
                this.q[this.qLen].set(a, b);
                this.cost[a][b] = this.cost[i1][j1] + 10;
                this.q[this.qLen].fcost = this.cost[a][b] + dist(b*20+10, a*20+10,
this.finalDest.x, this.finalDest.y);
                this.qLen++;
            }
        }
    }   // while
    
    while ((i1 !== x) || (j1 !== y)) {
        a = this.comefrom[i1][j1].x;
        b = this.comefrom[i1][j1].y;
        this.path[this.pathLen].set(b*20 + 10, a*20+10);
        this.pathLen++;
        i1 = a;
        j1 = b;
    }   
};

//sets targets and calls findAStarPath
enemyObj.prototype.findNewPath = function()
{
    this.target.x = game.player.x+10;
    this.target.y = game.player.y+10;
    this.finalDest.x = this.target.x;
    this.finalDest.y = this.target.y;
    this.targetPos.x = floor(this.finalDest.y / 20);
    this.targetPos.y = floor(this.finalDest.x / 20);
    var i = floor(this.position.y / 20);
    var j = floor(this.position.x / 20);
    this.initGraph(i, j);
    this.pathFound = 0;
    this.pathLen = 0;
    this.findAStarPath(i, j);
    this.pathLen--;
    this.target.x = this.path[this.pathLen].x;
    this.target.y = this.path[this.pathLen].y;
};

//this function sets the game up for us by initializing the tilemap
//and adding in all the objects that we will need to play
gameObj.prototype.setupGame = function()
{
    for (var i = 0; i< this.tilemap.length; i++) {
        for (var j =0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
                case 'w': 
                    this.walls.push(new wallObj(j*20, i*20));
                    break;
                case 'f': 
                    this.fruits.push(new fruitObj(j*20+10, i*20+10, floor(random(0,3))));
                    break;
                case 'p':
                    this.player = new playerObj(j*20, i*20);
                    break;
                case 'e':
                    this.enemies.push(new enemyObj(j*20, i*20));
            }
        }
    }
    
    //sets up the graphs for enemies
    for(var i=0; i<game.enemies.length;i++)
    {
        game.enemies[i].initGraphTilemap();
    }
    
    //winFruits are only for the winning animation, does not effect gameplay
    var x = 20;
    for(var i=0; i<10; i++)
    {
        this.winFruits.push(new fruitObj(x, floor(random(0,401)), floor(random(0,3))));
        this.winFruits.push(new fruitObj(x, floor(random(0,401)), floor(random(0,3))));
        this.winFruits.push(new fruitObj(x, floor(random(-400,401)), floor(random(0,3))));

        x += 40;
    }
    //losingEnemy is for animation purposes only
    this.losingEnemy = new GOenemyObj(200, 200);

    //main Screen animation objects
    this.mainScreenEnemies.push(new enemyObj(280, 265, 0));
    this.mainScreenEnemies.push(new enemyObj(200, 165, 0));
    this.mainScreenEnemies.push(new enemyObj(100, 365, 0));
    this.mainScreenPlayers.push(new playerObj(320, 265, 0));
    this.mainScreenPlayers.push(new playerObj(240, 165, 0));
    this.mainScreenPlayers.push(new playerObj(140, 365, 0));

};

//function is used to reset game variables in between games
gameObj.prototype.resetVars = function()
{
    this.fruits = [];
    this.enemies = [];
    this.walls = [];
    this.player = 0;
    this.keyArray = [];
    this.score = 0;
    this.winFruits = [];
    this.losingEnemy = 0;
    this.mainScreenPlayers = [];
    this.mainScreenEnemies = [];
};

var keyPressed = function()
{
    game.keyArray[keyCode] = 1;
};

var keyReleased = function()
{
    game.keyArray[keyCode] = 0;
};

//mouseClicked event, mainly used for changing screens and options
var mouseClicked = function()
{
    var xCor = mouseX;
    var yCor = mouseY;
    switch(game.gameState)
    {
        case 1:
            if(xCor > 150 && xCor < 250)
            {
                if(yCor > 100 && yCor < 150)
                {            
                    game.gameState = 2;
                }
                else if (yCor > 200 && yCor < 250)
                {
                    game.gameState = 5;
                }
                else if (yCor > 300 && yCor < 350)
                {
                    game.gameState = 6;
                }
            }
            break;
        case 3:
            game.gameState = 1;
            game.resetVars();
            game.setupGame();
            break;
        case 4:
            game.gameState = 1;
            game.resetVars();
            game.setupGame();            
            break;
        case 5:
            if(xCor > 150 && xCor < 250 && yCor > 300 && yCor < 350)
            {
                game.gameState = 1;
            }
            break;
        case 6:
            if(xCor > 150 && xCor < 250 && yCor > 325 && yCor < 375)
            {
                game.gameState = 1;
            }
            
            if(yCor > 142 && yCor < 167)
            {
                if(xCor > 100 && xCor < 175)
                {
                    game.difficulty = "Easy";
                    game.enemySpeed = 0.5;
                }
                else if(xCor > 200 && xCor < 275)
                {
                    game.difficulty = "Normal";
                    game.enemySpeed = 1;
                }
                else if(xCor > 300 && xCor < 375)
                {
                    game.difficulty = "Hard";
                    game.enemySpeed = 1.5;
                }
            }
            else if(yCor > 210 && yCor < 235)
            {
                if(xCor > 150 && xCor < 225)
                {
                    game.movementSetting = 0;
                    game.upKey = 40;
                    game.downKey = 38;
                    game.leftKey = 37;
                    game.rightKey = 39;
                }
                else if (xCor > 250 && xCor < 325)
                {
                    game.movementSetting = 1;
                    game.upKey = 87;
                    game.downKey = 83;
                    game.leftKey = 65;
                    game.rightKey = 68;
                }
            }
            else if(yCor > 280 && yCor < 305)
            {
                if(xCor > 100 && xCor < 175)
                {
                    game.sightSetting = 150;
                }
                else if(xCor > 200 && xCor < 275)
                {
                    game.sightSetting = 250;
                }
                else if(xCor > 300 && xCor < 375)
                {
                    game.sightSetting = 500;
                }
            }
            break;
    }
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


//draws player character
playerObj.prototype.draw = function() 
{
    noStroke();
    fill(0, 0, 255);
    rect(this.x, this.y, 20, 20);
    fill(255, 255, 255);
    ellipse(this.x+5,  this.y+5, 5, 5);
    ellipse(this.x+15, this.y+5, 5, 5);
    arc(this.x+10, this.y+12, 15, 10, radians(0), radians(180));   
};

//moves player 
playerObj.prototype.move = function()
{
    var self = this;
    
    //this will go through all the walls and return whether or not the player is colliding
    //with a wall
    var checkBrickCollision = function()
    {
        var collide = false;
        for (var i=0; i < game.walls.length; i++)
        {
            if(dist(self.x+10, self.y+10, game.walls[i].x+10, game.walls[i].y+10) < 20)
            {
                collide = true;
            }
        }
        return collide;
    };
    
    var wallCollide = checkBrickCollision();
    
    
    if(!wallCollide)
    {
        //resets xDir and yDir variables used to bounce player character off walls
        this.xDir = 0;
        this.yDir = 0;
        
        //if there is no collision detected then we look for user input and move
        //accordingly
        if (this.x > 0 && game.keyArray[game.leftKey] === 1)
        {
            this.x -= 2;
            //xDir and yDir for the player are used to back off from a wall after collision
            //we use the last known input to decide the direction to move back
            this.xDir = 2;
        }
        else if (this.x < 380 && game.keyArray[game.rightKey] === 1)
        {
            this.x += 2;
            this.xDir = -2;
        }
        else if (this.y > 0 && game.keyArray[game.upKey] === 1)
        {
            this.y -= 2;
            this.yDir = 2;
        }
        else if (this.y < 380 && game.keyArray[game.downKey] === 1)
        {
            this.y += 2;
            this.yDir = -2;
        }       
    }
    else
    {
        //moves us away from the wall
        this.x += this.xDir;
        this.y += this.yDir;
    }
};

//the move function above checks for wall collisions however this separte function will
//check for collisons with enemies and fruits.
//if an enemy is hit, the game is over
//if a fruit is hit the fruit is collected and the score is incremented
playerObj.prototype.checkCollisions = function()
{
    for (var i=0; i < game.enemies.length;i++)
    {
        if(dist(this.x+10, this.y+10, game.enemies[i].position.x+10, game.enemies[i].position.y+10) < 20)
        {
            this.dead = true;
        }
    }
    
    for (var i=0; i < game.fruits.length;i++)
    {
        if(dist(this.x+10, this.y+10, game.fruits[i].x, game.fruits[i].y) < 15 && game.fruits[i].collected === false)
        {
            game.fruits[i].collected = true;
            game.score++;
        }
    }
};

//used for main screen animation
playerObj.prototype.animate = function()
{
    this.x += 1.5;
    if (this.x > 400)
    {
        this.x = -20;
    }
};


//draws enemy character
enemyObj.prototype.draw = function() 
{
    noStroke();
    fill(255, 0, 0);
    rect(this.position.x, this.position.y, this.size, this.size);
    fill(255, 255, 255);
    ellipse(this.position.x+(this.size/4),  this.position.y+(this.size/4), (this.size/4), (this.size/4));
    ellipse(this.position.x+(this.size*0.75), this.position.y+(this.size/4), (this.size/4), (this.size/4));
    arc(this.position.x+(this.size*0.5), this.position.y+(this.size*0.80), (this.size*0.75), (this.size*0.5),radians(180), radians(360));
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
    arc(this.x, this.y+(this.size*0.3), (this.size*0.75), (this.size*0.5),radians(180), radians(360));
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

//draws custom character (brick/wall)
wallObj.prototype.draw = function() 
{
    image(game.image, this.x, this.y, 20, 20);
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

//used for winning screen animation
fruitObj.prototype.animate = function() 
{
    this.y++;
    if(this.y > 410)
    {
        this.y = floor(random(-200, -10));
        this.fruit = floor(random(0,3));
    }
};

//main draw function
var draw = function() 
{
    var newFrames = frameCount - game.frame;
    if(newFrames > 60)
    {
        newFrames = 0;
        game.frame = frameCount;
    }
    textAlign(CENTER, CENTER);
    switch(game.gameState)
    {
        //custom char generation
        case 0:
            createBrick();
            game.gameState = 1;
            game.setupGame();
            break;
        //main menu
        case 1:
            background(245, 193, 245);
            rectMode(CORNER);
            fill(66, 129, 164);
            textSize(50);
            text("PacFruit", 200, 50);
            for (var i=0; i < game.mainScreenEnemies.length;i++)
            {
                game.mainScreenEnemies[i].draw();
                game.mainScreenPlayers[i].draw();
                game.mainScreenEnemies[i].animate();
                game.mainScreenPlayers[i].animate();
            }
            textSize(15);
            stroke(0, 0, 0);
            fill(193, 102, 107);
            rect(150, 100, 100, 50);
            fill(239, 71, 111);
            rect(150, 200, 100, 50);
            fill(41, 31, 30);
            rect(150, 300, 100, 50);
            fill(255, 255, 255);
            text("PLAY", 200, 125);
            text("RULES", 200, 225);
            text("OPTIONS", 200, 325);
            break;
        //game
        case 2:
            background(245, 193, 245);
            rectMode(CORNER);
            fill(0, 0, 255);
            textSize(15);
            text(game.score, 380, 20);
            for (var i=0; i<game.walls.length; i++) 
            {
                game.walls[i].draw();
            }
            for (var i=0; i<game.fruits.length; i++) 
            {
                if(game.fruits[i].collected === false)
                {
                    game.fruits[i].draw(); //only draws non-collected fruits
                }
            }
            for (var i=0; i<game.enemies.length; i++) 
            {
                var move = true;

                if(game.sightSetting !== 500)
                {
                    var d = dist(game.enemies[i].position.x, game.enemies[i].position.y, game.player.x, game.player.y);
                    if(d > game.sightSetting){move=false;}
                }

                var frame = 15*i + 15;
                if(newFrames === frame && move)
                {
                    game.enemies[i].findNewPath();                
                }
                game.enemies[i].draw();
                if(move){game.enemies[i].move();}
            }
            game.player.draw();
            game.player.move();
            game.player.checkCollisions();
            if(game.player.dead === true)
            {
                game.gameState = 3; //game over
            }
            if(game.score === 20)
            {
                game.gameState = 4; // you win!
            }
            break;
        //game over
        case 3:
            background(245, 193, 245);
            game.losingEnemy.draw();
            var busy = game.losingEnemy.animate();
            //if statement below just makes it so the text does not appear until the 
            //end of the animation
            if(!busy)
            {
                fill(255, 0, 0);
                textSize(30);
                text("Game", 100, 100);
                text("Over", 300, 100);
                textSize(15);
                text("Click the mouse to return to main page", 200, 300);
            }
            break;
        //win case
        case 4:
            background(245, 193, 245);
            for (var i=0; i < game.winFruits.length; i++)
            {
                game.winFruits[i].draw();
                game.winFruits[i].animate();
            }
            fill(0, 0, 255);
            textSize(40);
            text("You Win!", 200, 200);
            textSize(20);
            text("Click the mouse to return to main page", 200, 300);
            break;
        //rules
        case 5:
            background(245, 193, 245);
            rectMode(CORNER);
            textSize(40);
            fill(41, 31, 30);
            text("Game Rules", 200, 50);
            textSize(15);
            text("Play as the smiling blue square, use the arrow keys (or WASD set in options) to move. Twenty fruits are scattered around the map, collect them all to win the game! Avoid the frowning red enemies, if one touches you it's game over!\n\nChange the speed of the enemies in the options menu to make the game harder or easier. Beware enemies are aware of your location and will chase you!", 50, 55, 300, 250);
            fill(193, 102, 107);
            rect(150, 300, 100, 50);
            fill(255, 255, 255);
            textSize(15);
            text("RETURN", 200, 325);
            break;
        //options
        case 6:
            background(245, 193, 245);
            rectMode(CORNER);
            textSize(40);
            fill(41, 31, 30);
            textAlign(CENTER, CENTER);
            text("OPTIONS", 200, 50);
            textSize(20);
            fill(239, 71, 111);
            text("Difficulty:", 50, 153);
            text("Controls:", 50, 220);
            text("Distance:", 50, 290);
            
            switch(game.sightSetting)
            {
                case 150:
                    fill(239, 71, 111);
                    rect(100, 280, 75, 25);
                    noFill();
                    rect(200, 280, 75, 25);
                    rect(300, 280, 75, 25);
                    break;
                case 250:
                    noFill();
                    rect(100, 280, 75, 25);
                    fill(239, 71, 111);
                    rect(200, 280, 75, 25);
                    noFill();
                    rect(300, 280, 75, 25);
                    break;
                case 500:
                    noFill();
                    rect(100, 280, 75, 25);
                    rect(200, 280, 75, 25);
                    fill(239, 71, 111);

                    rect(300, 280, 75, 25);
            }
            
            switch(game.movementSetting)
            {
                case 0:
                    fill(239, 71, 111);
                    rect(150, 210, 75, 25);
                    noFill();
                    rect(250, 210, 75, 25);
                    break;
                case 1:
                    noFill();
                    rect(150, 210, 75, 25);
                    fill(239, 71, 111);
                    rect(250, 210, 75, 25);
                    break;
            }

            
            switch(game.difficulty)
            {
                case "Easy":
                    fill(239, 71, 111);
                    rect(100, 142, 75, 25);
                    noFill();
                    rect(200, 142, 75, 25);
                    rect(300, 142, 75, 25);
                    break;
                case "Normal":
                    noFill();
                    rect(100, 142, 75, 25);
                    fill(239, 71, 111);
                    rect(200, 142, 75, 25);
                    noFill();
                    rect(300, 142, 75, 25);
                    break;
                case "Hard":
                    noFill();
                    rect(100, 142, 75, 25);
                    rect(200, 142, 75, 25);
                    fill(239, 71, 111);
                    rect(300, 142, 75, 25);
            }
            fill(193, 102, 107);
            rect(150, 325, 100, 50);
            fill(0, 0, 0);
            textSize(15);
            text("Easy", 137.5, 154.5);
            text("Normal", 237.5, 154.5);
            text("Hard", 337.5, 154.5);
            text("Arrows", 187.5, 222.5);
            text("WASD", 287.5, 222.5);
            text("150pixel", 137.5, 292.5);
            text("250pixel", 237.5, 292.5);
            textSize(12);
            text("always move", 337.5, 292.5);
            textSize(15);
            text("Distance setting will change how far away enemies can see you and will start chasing you. While the Difficulty setting changes the speed of the enemy. ", 0, 50, 400, 100);
            fill(255,255,255);
            text("RETURN", 200, 350);
            break;
    }
};
