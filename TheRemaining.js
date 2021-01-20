//Final Project 
//Virginia Tech ECE 4525
//Fall 2020
//Kevin Kleinegger
//Jamahl Savage
//Kevin Chea
//Khan Academy

angleMode = "radians";

//Menu Screen Variables//////////////////////////////////
var keyArray = [];
var gameState = "mainScreen";
var isInstruction3Init = false;
var useArrowKeys = true; //the toggle for using the arrow keys or wasd for movement

//Dims the user selection
var easyDimmer = 0;
var normalDimmer = -88; //By default we start in normal difficulty
var hardDimmer = 0;
var wasdDimmer = 0;
var arrowsDimmer = -88; //By default we will use arrow keys

var difficultySelect = false; //difficulty selection screen
var difficultyMode = 2; //Difficulty set to NORMAL(2) by default.EASY is (1) and HARD is (3)
var currentLevel = 0; //stores the selected level chosen
var gameStart = false; //start the game screen

//Variables for determining if a level was beaten or not along with prompts
var beatLevel1 = false;
var beatLevel2 = false;
var beatLevel3 = false;
var beatLevel4 = false;
var gameLost = false;

var clickLocX = 0;
var clickLocY = 0;

var start_prompt_timer = false;
var prompt_timer = 0;
var prompt_timer_passed = 0;
var prompt = "";

var a=random(1500); //Used for perlin noise sky with clouds
///////////////////////////////////////////////////////////////////////////////////

var initialize_tilemap = false; //we only want to initialize the tile map for the level we want to play
//////////////////////////////////////////////////////////////////////

//Just alternative and less costly distance function
var dist2 = function(x1, y1, x2, y2)
{
    return ( (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1) );
};

var keyPressed = function() {
    keyArray[keyCode] = 1;
};

var keyReleased = function() {
    keyArray[keyCode] = 0;
};

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////Kevin Chea's characters////////////////////////////////////
//custom images array
var images = [];

//point arrays for duck
var points = [];
var points2 = [];
var points3 = [];
var points4 = [];
var points5 = [];
var points6 = [];
var points7 = [];
var points8 = [];

//point arrays for bat
var points9 = [];
var points10 = [];
var points11 = [];
var points12 = [];
var points13 = [];
var points14 = [];

//point arrays for subdividing
var p2 = [];
var p3 = [];
var p4 = [];
var p5 = [];
var p6 = [];
var p7 = [];
var p8 = [];
var p9 = [];
var p10 = [];
var p11 = [];
var p12 = [];
var p13 = [];
var p14 = [];
var p15 = [];

//functions that will split points
var splitPoints = function(points, p2) {
    p2.splice(0, p2.length);
    for (var i = 0; i < points.length - 1; i++) {
        p2.push(new PVector(points[i].x, points[i].y));
        p2.push(new PVector((points[i].x + points[i+1].x)/2, (points[i].y +
points[i+1].y)/2));
    }
    p2.push(new PVector(points[i].x, points[i].y));
    p2.push(new PVector((points[0].x + points[i].x)/2, (points[0].y +
points[i].y)/2));
};

//function that takes the averages of points
var average = function(points, p2) {
    for (var i = 0; i < p2.length - 1; i++) {
        var x = (p2[i].x + p2[i+1].x)/2;
        var y = (p2[i].y + p2[i+1].y)/2;
        p2[i].set(x, y);
    }
    var x = (p2[i].x + points[0].x)/2;
    var y = (p2[i].y + points[0].y)/2;
    points.splice(0, points.length);
    for (i = 0; i < p2.length; i++) {
        points.push(new PVector(p2[i].x, p2[i].y));
    }
};

//function to subdivide all points
var subdivide = function(points, p2) {
    splitPoints(points, p2);
    average(points, p2);
};

//duck object
var duckObj = function(x, y){
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDist = random(70, 100);
    this.size = 200;
    this.c = 0;
};

///draw duck
duckObj.prototype.draw = function(){
    pushMatrix();
    noStroke();
    //move duck to proper position
    translate(this.position.x, this.position.y);
    
    //rotate duck to heading
    rotate(PI/2 + this.wanderAngle);
    
    //switch cases of duck images for animation
    switch (this.c){
        case 1:
        image(images[0], -this.size/2, -this.size/2, this.size, this.size);
        break;
        case 0:
        image(images[1], -this.size/2, -this.size/2, this.size, this.size);
        break;
    }
    
    popMatrix();
};

//duck wanders across the screen
duckObj.prototype.wander = function() {
    switch (this.c) {
        case 0:
            this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
            this.position.add(this.step);
            break;
        case 1:
            this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
            this.position.add(this.step);
            break;
    }
    this.wanderDist--;
    if (this.wanderDist < 0) {
        this.wanderDist = random(50, 100);
        this.wanderAngle += random(0, PI/2);
    }
            
    if (this.position.x > 420) {this.position.x = -20;}
    else if (this.position.x < -20) {this.position.x = 420;}
    if (this.position.y > 420) {this.position.y = -20;}
    else if (this.position.y < -20) {this.position.y = 420;}
};

//bat object
var batObj = function(x, y){
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDist = random(70, 100);
    this.c = 1;
    this.size = 300;
};

//draw bat
batObj.prototype.draw = function(){
    pushMatrix();
    
    //move bat to proper position
    translate(this.position.x, this.position.y);
    
    //switch cases of bat for animation
    switch (this.c){
        case 1:
        image(images[2], -this.size/3, -this.size/2, this.size, this.size);
        break;
        case 0:
        image(images[3], -this.size/3, -this.size/2, this.size, this.size);
        break;
    }

    popMatrix();
};

//bat wanders across the screen
batObj.prototype.wander = function() {

    //update bat's position
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    this.position.add(this.step);

    //update wander angle and distance if distance becomes 0
    this.wanderDist--;
    if (this.wanderDist < 0) {
        this.wanderDist = random(50, 100);
        this.wanderAngle += random(0, PI/2);
    }
    
    //bounds for bat to move
    if (this.position.x > 300) {this.position.x = 300;}
    else if (this.position.x < 100) {this.position.x = 100;}
    if (this.position.y > 300) {this.position.y = 300;}
    else if (this.position.y < 100) {this.position.y = 100;}
};

//draw points for duck
var drawDuckPoints = function(){
    //draw tail
    points.push(new PVector(200, 370));
    points.push(new PVector(209, 367));
    points.push(new PVector(212, 351));
    points.push(new PVector(216, 366));
    points.push(new PVector(224, 366));
    points.push(new PVector(231, 362));
    points.push(new PVector(232, 351));
    points.push(new PVector(238, 352));
    points.push(new PVector(248, 350));
    points.push(new PVector(256, 330));
    points.push(new PVector(259, 331));
    points.push(new PVector(254, 321));
    points.push(new PVector(235, 309));
    points.push(new PVector(224, 293));
    points.push(new PVector(216, 275));
    points.push(new PVector(213, 255));
    points.push(new PVector(200, 255));
    points.push(new PVector(187, 255));
    points.push(new PVector(184, 275));
    points.push(new PVector(176, 293));
    points.push(new PVector(165, 309));
    points.push(new PVector(146, 321));
    points.push(new PVector(141, 331));
    points.push(new PVector(144, 330));
    points.push(new PVector(152, 350));
    points.push(new PVector(162, 352));
    points.push(new PVector(168, 351));
    points.push(new PVector(169, 362));
    points.push(new PVector(176, 366));
    points.push(new PVector(184, 366));
    points.push(new PVector(188, 351));
    points.push(new PVector(191, 367));
    
    //draw right wing up
    points2.push(new PVector(212, 250));
    points2.push(new PVector(221, 230));
    points2.push(new PVector(233, 227));
    points2.push(new PVector(240, 218));
    points2.push(new PVector(250, 218));
    points2.push(new PVector(259, 207));
    points2.push(new PVector(272, 207));
    points2.push(new PVector(280, 197));
    points2.push(new PVector(296, 200));
    points2.push(new PVector(308, 200));
    points2.push(new PVector(311, 195));
    points2.push(new PVector(326, 200));
    points2.push(new PVector(336, 195));
    points2.push(new PVector(338, 190));
    points2.push(new PVector(352, 195));
    points2.push(new PVector(360, 189));
    points2.push(new PVector(366, 183));
    points2.push(new PVector(383, 174));
    points2.push(new PVector(390, 165));
    points2.push(new PVector(360, 150));
    points2.push(new PVector(340, 135));
    points2.push(new PVector(320, 125));
    points2.push(new PVector(305, 119));
    points2.push(new PVector(298, 115));
    points2.push(new PVector(280, 109));
    points2.push(new PVector(256, 111));
    points2.push(new PVector(240, 117));
    points2.push(new PVector(228, 133));
    points2.push(new PVector(212, 115));
    points2.push(new PVector(205, 110));
    
    //draw left wing up
    points3.push(new PVector(188, 250));
    points3.push(new PVector(179, 230));
    points3.push(new PVector(167, 227));
    points3.push(new PVector(160, 218));
    points3.push(new PVector(150, 218));
    points3.push(new PVector(141, 207));
    points3.push(new PVector(128, 207));
    points3.push(new PVector(120, 197));
    points3.push(new PVector(104, 200));
    points3.push(new PVector(92, 200));
    points3.push(new PVector(89, 195));
    points3.push(new PVector(74, 200));
    points3.push(new PVector(64, 195));
    points3.push(new PVector(62, 190));
    points3.push(new PVector(48, 195));
    points3.push(new PVector(40, 189));
    points3.push(new PVector(34, 183));
    points3.push(new PVector(17, 174));
    points3.push(new PVector(10, 165));
    points3.push(new PVector(40, 150));
    points3.push(new PVector(60, 135));
    points3.push(new PVector(80, 125));
    points3.push(new PVector(95, 119));
    points3.push(new PVector(102, 115));
    points3.push(new PVector(120, 109));
    points3.push(new PVector(144, 111));
    points3.push(new PVector(160, 117));
    points3.push(new PVector(172, 133));
    points3.push(new PVector(188, 115));
    points3.push(new PVector(195, 110));
    
    //draw body
    points4.push(new PVector(213, 110));
    points4.push(new PVector(215, 111));
    points4.push(new PVector(223, 153));
    points4.push(new PVector(225, 179));
    points4.push(new PVector(225, 216));
    points4.push(new PVector(223, 216));
    points4.push(new PVector(220, 234));
    points4.push(new PVector(214, 253));
    points4.push(new PVector(218, 278));
    points4.push(new PVector(200, 278));
    points4.push(new PVector(182, 278));
    points4.push(new PVector(186, 253));
    points4.push(new PVector(180, 234));
    points4.push(new PVector(177, 216));
    points4.push(new PVector(175, 216));
    points4.push(new PVector(175, 179));
    points4.push(new PVector(177, 153));
    points4.push(new PVector(185, 111));
    points4.push(new PVector(187, 110));
    
    //draw body
    points6.push(new PVector(200, 54));
    points6.push(new PVector(208, 55));
    points6.push(new PVector(210, 60));
    points6.push(new PVector(215, 70));
    points6.push(new PVector(216, 85));
    points6.push(new PVector(214, 90));
    points6.push(new PVector(212, 105));
    points6.push(new PVector(213, 110));
    points6.push(new PVector(215, 111));
    points6.push(new PVector(185, 111));
    points6.push(new PVector(187, 110));    
    points6.push(new PVector(188, 105));
    points6.push(new PVector(186, 90));
    points6.push(new PVector(184, 85));
    points6.push(new PVector(185, 70));
    points6.push(new PVector(190, 60));
    points6.push(new PVector(192, 55));
    
    //draw beak
    points5.push(new PVector(208, 57));
    points5.push(new PVector(208, 55));
    points5.push(new PVector(208, 53));
    points5.push(new PVector(208, 30));
    points5.push(new PVector(192, 30));
    points5.push(new PVector(192, 53));
    points5.push(new PVector(192, 55));
    points5.push(new PVector(192, 57));
    
    //draw right wing down
    points7.push(new PVector(205, 110));
    points7.push(new PVector(205, 110));
    points7.push(new PVector(212, 115));
    points7.push(new PVector(228, 133));
    points7.push(new PVector(240, 117));
    points7.push(new PVector(254, 120));
    points7.push(new PVector(272, 128));
    points7.push(new PVector(292, 141));
    points7.push(new PVector(304, 158));
    points7.push(new PVector(317, 180));
    points7.push(new PVector(332, 214));
    points7.push(new PVector(342, 239));
    points7.push(new PVector(348, 253));
    points7.push(new PVector(358, 278));
    points7.push(new PVector(358, 292));
    points7.push(new PVector(357, 304));
    points7.push(new PVector(329, 301));
    points7.push(new PVector(317, 297));
    points7.push(new PVector(302, 278));
    points7.push(new PVector(278, 274));
    points7.push(new PVector(273, 260));
    points7.push(new PVector(250, 256));
    points7.push(new PVector(245, 244));
    points7.push(new PVector(217, 246));
    
    //draw left wing down
    points8.push(new PVector(195, 110));
    points8.push(new PVector(195, 110));
    points8.push(new PVector(188, 115));
    points8.push(new PVector(172, 133));
    points8.push(new PVector(160, 117));
    points8.push(new PVector(146, 120));
    points8.push(new PVector(128, 128));
    points8.push(new PVector(108, 141));
    points8.push(new PVector(96, 158));
    points8.push(new PVector(83, 180));
    points8.push(new PVector(68, 214));
    points8.push(new PVector(58, 239));
    points8.push(new PVector(52, 253));
    points8.push(new PVector(42, 278));
    points8.push(new PVector(42, 292));
    points8.push(new PVector(43, 304));
    points8.push(new PVector(71, 301));
    points8.push(new PVector(83, 297));
    points8.push(new PVector(98, 278));
    points8.push(new PVector(122, 274));
    points8.push(new PVector(127, 260));
    points8.push(new PVector(150, 256));
    points8.push(new PVector(155, 244));
    points8.push(new PVector(183, 246));

    //subdivide all point arrays for smoothing
    for (var k = 0; k < 5; k++){
        subdivide(points, p2);
        subdivide(points2, p3);
        subdivide(points3, p4);
        subdivide(points4, p5);
        subdivide(points5, p6);
        subdivide(points6, p7);
        subdivide(points7, p8);
        subdivide(points8, p9);
    }

};

//draw duck points
drawDuckPoints();

//draw bat points
var drawBatPoints = function(){
    //draw head
    points9.push(new PVector(200, 150));
    points9.push(new PVector(210, 145));
    points9.push(new PVector(230, 130));
    points9.push(new PVector(230, 155));
    points9.push(new PVector(235, 160));
    points9.push(new PVector(240, 175));
    points9.push(new PVector(235, 190));
    points9.push(new PVector(225, 200));
    points9.push(new PVector(205, 210));
    points9.push(new PVector(195, 210));
    points9.push(new PVector(175, 200));
    points9.push(new PVector(165, 190));
    points9.push(new PVector(160, 175));
    points9.push(new PVector(165, 160));
    points9.push(new PVector(170, 155));
    points9.push(new PVector(170, 130));
    points9.push(new PVector(190, 145));
    
    //draw body
    points10.push(new PVector(230, 155));
    points10.push(new PVector(220, 144));
    points10.push(new PVector(166, 139));
    points10.push(new PVector(130, 140));
    points10.push(new PVector(109, 151));
    points10.push(new PVector(91, 168));
    points10.push(new PVector(82, 184));
    points10.push(new PVector(71, 196));
    points10.push(new PVector(57, 201));
    points10.push(new PVector(68, 204));
    points10.push(new PVector(63, 212));
    points10.push(new PVector(75, 208));
    points10.push(new PVector(75, 216));
    points10.push(new PVector(87, 201));
    points10.push(new PVector(104, 205));
    points10.push(new PVector(104, 211));
    points10.push(new PVector(96, 220));
    points10.push(new PVector(107, 217));
    points10.push(new PVector(108, 222));
    points10.push(new PVector(115, 216));
    points10.push(new PVector(117, 221));
    points10.push(new PVector(123, 216));
    points10.push(new PVector(116, 206));
    points10.push(new PVector(128, 210));
    points10.push(new PVector(144, 211));
    points10.push(new PVector(170, 212));
    points10.push(new PVector(220, 207));
    
    //draw left wing up
    points11.push(new PVector(161, 152));
    points11.push(new PVector(131, 148));
    points11.push(new PVector(102, 135));
    points11.push(new PVector(77, 124));
    points11.push(new PVector(48, 136));
    points11.push(new PVector(27, 152));
    points11.push(new PVector(11, 176));
    points11.push(new PVector(3, 200));
    points11.push(new PVector(30, 186));
    points11.push(new PVector(47, 181));
    points11.push(new PVector(63, 187));
    points11.push(new PVector(76, 171));
    points11.push(new PVector(104, 178));
    points11.push(new PVector(123, 169));
    points11.push(new PVector(160, 168));
    
    //draw right wing up
    points12.push(new PVector(190, 150));
    points12.push(new PVector(212, 130));
    points12.push(new PVector(232, 116));
    points12.push(new PVector(266, 126));
    points12.push(new PVector(292, 136));
    points12.push(new PVector(315, 155));
    points12.push(new PVector(292, 152));
    points12.push(new PVector(271, 153));
    points12.push(new PVector(262, 156));
    points12.push(new PVector(254, 166));
    points12.push(new PVector(237, 162));
    points12.push(new PVector(230, 162));
    
    //draw left wing down
    points13.push(new PVector(148, 181));
    points13.push(new PVector(130, 204));
    points13.push(new PVector(125, 210));
    points13.push(new PVector(115, 220));
    points13.push(new PVector(105, 233));
    points13.push(new PVector(105, 243));
    points13.push(new PVector(36, 240));
    points13.push(new PVector(20, 231));
    points13.push(new PVector(42, 224));
    points13.push(new PVector(70, 215));
    points13.push(new PVector(67, 212));
    points13.push(new PVector(81, 184));
    points13.push(new PVector(100, 182));
    points13.push(new PVector(109, 157));
    points13.push(new PVector(134, 153));
    points13.push(new PVector(165, 156));
    points13.push(new PVector(150, 177));
    
    //draw right wing down
    points14.push(new PVector(211, 183));
    points14.push(new PVector(216, 199));
    points14.push(new PVector(225, 220));
    points14.push(new PVector(230, 230));
    points14.push(new PVector(210, 235));
    points14.push(new PVector(200, 240));
    points14.push(new PVector(175, 239));
    points14.push(new PVector(146, 239));
    points14.push(new PVector(120, 235));
    points14.push(new PVector(178, 217));
    points14.push(new PVector(164, 212));
    points14.push(new PVector(160, 205));
    
    //subdivide all point arrays for smoothing
    for (var k = 0; k < 5; k++){
        subdivide(points9, p10);
        subdivide(points10, p11);
        subdivide(points11, p12);
        subdivide(points12, p13);
        subdivide(points13, p14);
        subdivide(points14, p15);
    }

};

//draw bat points
drawBatPoints();

//draw shape of custom points
var drawShape = function(points){
    beginShape();
        for (var i = 0; i < points.length; i++) {
            vertex(points[i].x, points[i].y);
        }
        vertex(points[0].x, points[0].y);
    endShape();
};

//draw custom characters
var drawCustomChar = function() {
    background(255, 255, 255, 0);
    fill(140, 119, 92);
    beginShape();
    //tail
    drawShape(points);
    //right wing
    drawShape(points2);
    //left wing
    drawShape(points3);
    
    //body
    fill(107, 74, 30);
    drawShape(points4);
    
    //head
    fill(60, 94, 31);
    drawShape(points6);
    
    //beak
    fill(255, 255, 0);
    drawShape(points5);
    
    //eyes
    fill(255, 0, 0);
    ellipse(208, 67, 6, 6);
    ellipse(192, 67, 6, 6);
    
    images.push(get(0,0,width,height));
    
    background(255, 255, 255, 0);
    fill(140, 119, 92);
    //tail
    drawShape(points);
    //right wing
    drawShape(points7);
    //left wing
    drawShape(points8);
    
    //body
    fill(107, 74, 30);
    drawShape(points4);
    
    //head
    fill(60, 94, 31);
    drawShape(points6);
    
    //beak
    fill(255, 255, 0);
    drawShape(points5);

    //eyes
    fill(255, 0, 0);
    ellipse(208, 67, 6, 6);
    ellipse(192, 67, 6, 6);
    
    images.push(get(0,0,width,height));
    
    background(255, 255, 255, 0);

    stroke(0, 0, 0);
    fill(169, 169, 169);
    //right wing
    drawShape(points12);
    
    //body
    drawShape(points10);
    
    //left wing
    drawShape(points11);
    
    //head
    drawShape(points9);
    
    //eyes
    fill(0, 0, 0);
    ellipse(215, 170, 10, 10);
    ellipse(185, 170, 10, 10);
    
    fill(255, 0, 0);
    ellipse(217, 170, 4, 4);
    ellipse(187, 170, 4, 4);
    
    //teeth
    noStroke();
    fill(255, 255, 255);
    triangle(180, 190, 190, 200, 200, 190);
    triangle(220, 190, 210, 200, 200, 190);
    
    images.push(get(0,0,width,height));
    
    
    background(255, 255, 255, 0);
    
    fill(169, 169, 169);

    stroke(0, 0, 0);
    //right wing
    drawShape(points14);
    
    //body
    drawShape(points10);
    
    //left wing
    drawShape(points13);
    
    //head
    drawShape(points9);
    
    //eyes
    fill(0, 0, 0);
    ellipse(215, 170, 10, 10);
    ellipse(185, 170, 10, 10);
    
    fill(255, 0, 0);
    ellipse(217, 170, 4, 4);
    ellipse(187, 170, 4, 4);
    
    //teeth
    noStroke();
    fill(255, 255, 255);
    triangle(180, 190, 190, 200, 200, 190);
    triangle(220, 190, 210, 200, 200, 190);
    
    images.push(get(0,0,width,height));
    
};

//initialize custom character
drawCustomChar();

//initialize character objects
var duck = new duckObj(200, 200);
var bat = new batObj(200, 200);

//stores custom images
var duckHunt_images = [];

//stores visual objects
var tree = [];
var water = [];
var duckHunt_a = [];
var duckHunt_b = [];
var duckHunt_c = [];
var duckHunt_d = [];
var duckHunt_m = [];
var duckHunt_n = [];
var duckHunt_k = [];
var duckHunt_l = [];
var duckHunt_player;
var duckHunt_enemy = [];

//player and duck health
var duckHunt_pHealth = 1;
var duckHunt_eHealth = 2;  

//settings for bullets
var duckHunt_bulletFrame = 0;
var duckHunt_liveBullets = 0;
var duckHunt_bulletsMax = 10; //max number of bullets allowed in game
var duckHunt_fired = false; //checks to see if player already fired
var duckHunt_bullets = [];

//tile map settings
var tileWidth = 40;
var tileHeight = 40;
var charWidth = 20;
var charHeight = 20;

//game settings
var duckHunt_enemyCnt = 0;
var duckHunt_gameOver = false;

//hitBoxes
var hitWidth = tileWidth/2 + charWidth/2;
var hitHeight = tileHeight/2 + charHeight/2;

//1000pixel by 1000pixel (50 by 50 tilemap)
var duckHunt_tilemap = [
    
        "                                                  ",
        "       t  e                        t          t   ",
        "            t     t dwwwc t    e           e      ",
        "   t e             dwwwwwc  dwwwwc   t            ",
        "         t     e t wwwwwwwwwwwwwww         t      ",
        "   t               wwwwwwwwwwwwwww     e          ",
        "           t       wwwwwwwwwwwwwww           t    ",
        "       t   e     t awwwwwwwwwwwwwb     t          ",
        "   e                awwwwwwwwwwwb      e          ",
        "            t      t      w  t     t        t     ",
        "   t             f    t   w        e   t          ",
        "       e               dwwwwwwc t            et   ",
        "       t      t     t dwwwwwwwwwwwwwwwc           ",
        "           e          wwwwwwwwwwwwwwwwwc          ",
        "         t            wwwwwwwwwwwwwwwwww e     t  ",
        "  e          e      t wwwwwwwwwwwwwwwwww          ",
        "   t           t      awwwwwwwwwwwwwwwww   t   e  ",
        "       t              eawwwwwwwwwwwwwwwb          ",
        "                      t mwwwwwwwwwwwwwb        t  ",
        "  t        e    t  e    nwwwwwwwwwwwwk            ",
        "     t     t             awwwwwwwwwwwl e   t      ",
        "               e        t awwwwwwwwwb          t  ",
        "   t   e           t       mwwwwwwwk     t     e  ",
        "       t      t          t nwwwwwwwl          t   ",
        "           t       e        mwwwwwk    t          ",
        "   t   e             t e    nwwwwwl            t  ",
        "             t e           t awwwb      p  t      ",
        "       t               t           t          e t ",
        "                               e      t      t    ",
        "                                                  "];

//create custom characters
var duckHunt_customChar = function() {
    noStroke();
    
    //draw tree
    background(255, 255, 255, 0);
    fill(112, 64, 2);
    rect(170, 250, 60, 150);
    triangle(170, 400, 150, 400, 170, 300);
    triangle(230, 400, 250, 400, 230, 300);
    quad(170, 260, 230, 260, 300, 210, 100, 210);
    fill(83, 207, 0);
    ellipse(100, 150, 200, 200);
    ellipse(200, 150, 200, 200);
    ellipse(300, 150, 200, 200);
    ellipse(150, 100, 200, 200);
    ellipse(250, 100, 200, 200);
    duckHunt_images.push(get(0,0,width,height));
    
    background(255, 255, 255, 0);
    fill(61, 194, 255);
    rect(0, 0, width, height);
    duckHunt_images.push(get(0, 0, width, height));

    background(255, 255, 255, 0);
    fill(61, 194, 255);
    triangle(0, 0, 400, 400, 400, 0);
    duckHunt_images.push(get(0, 0, width, height));
    
    background(255, 255, 255, 0);
    fill(61, 194, 255);
    triangle(400, 0, 0, 400, 0, 0);
    duckHunt_images.push(get(0, 0, width, height));
    
    background(255, 255, 255, 0);
    fill(61, 194, 255);
    triangle(0, 0, 400, 400, 0, 400);
    duckHunt_images.push(get(0, 0, width, height));
    
    background(255, 255, 255, 0);
    fill(61, 194, 255);
    triangle(400, 0, 0, 400, 400, 400);
    duckHunt_images.push(get(0, 0, width, height));

    background(255, 255, 255, 0);
    fill(61, 194, 255);
    quad(0, 0, 200, 400, 400, 400, 400, 0);
    duckHunt_images.push(get(0, 0, width, height));
    
    background(255, 255, 255, 0);
    fill(61, 194, 255);
    triangle(200, 0, 400, 400, 400, 0);
    duckHunt_images.push(get(0, 0, width, height));
    
    background(255, 255, 255, 0);
    fill(61, 194, 255);
    quad(400, 0, 200, 400, 0, 400, 0, 0);
    duckHunt_images.push(get(0, 0, width, height));
    
    background(255, 255, 255, 0);
    fill(61, 194, 255);
    triangle(200, 0, 0, 400, 0, 0);
    duckHunt_images.push(get(0, 0, width, height));
};

//initialize custom characters
duckHunt_customChar();

//create visual objects
var treeObj = function(x, y){
    this.position = new PVector(x, y);
};

var waterObj = function(x, y){
    this.position = new PVector(x, y);
};

var aObj = function(x, y){
    this.position = new PVector(x, y);
};

var bObj = function(x, y){
    this.position = new PVector(x, y);
};

var cObj = function(x, y){
    this.position = new PVector(x, y);
};

var dObj = function(x, y){
    this.position = new PVector(x, y);
};

var mObj = function(x, y){
    this.position = new PVector(x, y);
};

var nObj = function(x, y){
    this.position = new PVector(x, y);
};

var kObj = function(x, y){
    this.position = new PVector(x, y);
};

var lObj = function(x, y){
    this.position = new PVector(x, y);
};

var duckHunt_playerObj = function(x, y){
    this.position = new PVector(x, y);
    
    this.health = duckHunt_pHealth;
    
    //step vector
    this.step = new PVector(0, 0);
    
    //speed vector
    this.speed = new PVector(2, 2);
    
    //used for animation of player
    this.currFrame = frameCount;
    this.i = 0;    

    //direction player is facing
    this.direction = 0;
    
    this.swimming = 0;
    
    this.hurt = false;
    this.hurtFrame = frameCount;
};

var duckHunt_bulletObj = function(x, y){
    //coordinates before getting shot
    this.position1 = new PVector(x, y);
    
    //coordinates after getting shot
    this.position2 = new PVector(x, y);
    
    //step vector to move bullet
    this.step = new PVector(0, 0);
    
    //speed of bullet
    this.speed = new PVector(8, 8);
    
    this.active = false; //if fired
};

var duckHunt_enemyObj = function(x, y, c){
    this.position = new PVector(x, y);
    
    this.health = duckHunt_eHealth;
    
    //used for animation of enemy
    this.currFrame = frameCount;
    this.i = 0;
    
    //this is state mode from wandering to avoiding    
    this.c = c;
    
    //for wandering
    this.step = new PVector(0, 0);
    this.angle = random(0, PI);
    this.wanderDist = random(150, 200);
    
    //for avoiding
    this.velocity = new PVector(0, -1);
    this.blocked = false;
    
    this.hurt = false;
    this.hurtFrame = frameCount;
};


//draw tree object
treeObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[0], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);

    //check to see if player is colliding with tree
    if (PVector.dist(this.position, duckHunt_player.position) <= charWidth){
        duckHunt_player.position.sub(duckHunt_player.step);
    }
};

//draw pond objects
waterObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[1], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

aObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[2], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

bObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[3], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

cObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[4], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

dObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[5], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

mObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[6], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

nObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[7], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

kObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[8], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

lObj.prototype.draw = function() {
    noStroke();
    image(duckHunt_images[9], this.position.x - tileWidth/2, this.position.y - tileHeight/2, tileWidth, tileHeight);
};

//draw player object
duckHunt_playerObj.prototype.draw = function() {
    //draw players body in according to their direction
    
    if (this.hurt === false || (this.hurt === true && frameCount % 20 < 10)){
        switch (this.direction){
            case 0:
                stroke(0, 0, 0);
                fill(29, 224, 172);
                //backpack
                rect(this.position.x - 10, this.position.y - 5, 4, 8);
                
                fill(255, 0, 0);
                //left arm
                quad(this.position.x + 5, this.position.y - 4, this.position.x + 8, this.position.y - 3, this.position.x + 8, this.position.y + 1, this.position.x + 5, this.position.y + 3);
                
                //torso
                quad(this.position.x - 5, this.position.y - 5, this.position.x + 5, this.position.y - 5, this.position.x + 6, this.position.y + 5, this.position.x - 6, this.position.y + 5);
                
                noStroke();
                fill(248, 255, 181);
                //head
                ellipse(this.position.x, this.position.y - 9, 14, 12);
                
                fill(0, 0, 0);
                //eyes
                ellipse(this.position.x - 3, this.position.y - 9, 3, 3);
                ellipse(this.position.x + 3, this.position.y - 9, 3, 3);
                
                //hat
                ellipse(this.position.x, this.position.y - 13, 18, 4);
                arc(this.position.x, this.position.y - 12, 12, 16, PI, 2*PI);
                
                fill(255, 0, 0);
                stroke(0, 0, 0);
                //right arm
                quad(this.position.x - 5, this.position.y - 4, this.position.x + 4, this.position.y - 3, this.position.x + 5, this.position.y + 1, this.position.x - 5, this.position.y + 2);
                
                fill(248, 255, 181);
                //left hand
                ellipse(this.position.x + 4, this.position.y - 1, 5, 6);
                
                fill(143, 143, 143);
                //gun
                rect(this.position.x + 2, this.position.y - 4, 4, 3);
                rect(this.position.x + 2, this.position.y - 6, 8, 3); 
                
                fill(248, 255, 181);
                //right hand
                ellipse(this.position.x + 2, this.position.y - 1, 5, 6);
                
                noStroke();
                
            break;
            
            case 1:
                stroke(0, 0, 0);
                fill(29, 224, 172);
                //backpack
                rect(this.position.x + 5, this.position.y - 5, 4, 8);
                
                fill(255, 0, 0);
                //right arm
                quad(this.position.x - 5, this.position.y - 4, this.position.x - 8, this.position.y - 3, this.position.x - 8, this.position.y + 1, this.position.x - 5, this.position.y + 3);
                
                //torso
                quad(this.position.x - 5, this.position.y - 5, this.position.x + 5, this.position.y - 5, this.position.x + 6, this.position.y + 5, this.position.x - 6, this.position.y + 5);
                
                noStroke();
                fill(248, 255, 181);
                //head
                ellipse(this.position.x, this.position.y - 9, 14, 12);
                
                fill(0, 0, 0);
                //eyes
                ellipse(this.position.x - 3, this.position.y - 9, 3, 3);
                ellipse(this.position.x + 3, this.position.y - 9, 3, 3);
                
                //hat
                ellipse(this.position.x, this.position.y - 13, 18, 4);
                arc(this.position.x, this.position.y - 12, 12, 16, PI, 2*PI);
                
                fill(255, 0, 0);
                stroke(0, 0, 0);
                //left arm
                quad(this.position.x + 5, this.position.y - 4, this.position.x - 4, this.position.y - 3, this.position.x - 5, this.position.y + 1, this.position.x + 5, this.position.y + 2);
                
                fill(248, 255, 181);
                //left hand
                ellipse(this.position.x - 4, this.position.y - 1, 5, 6);
                
                fill(143, 143, 143);
                //gun
                rect(this.position.x - 6, this.position.y - 4, 4, 3);
                rect(this.position.x - 10, this.position.y - 6, 8, 3); 
                
                fill(248, 255, 181);
                //right hand
                ellipse(this.position.x - 2, this.position.y - 1, 5, 6);
                
                noStroke();
            break;
            
            case 2:
                stroke(0, 0, 0);
                fill(255, 0, 0);
                //torso
                quad(this.position.x - 5, this.position.y - 5, this.position.x + 5, this.position.y - 5, this.position.x + 6, this.position.y + 5, this.position.x - 6, this.position.y + 5);
                
                noStroke();
                fill(248, 255, 181);
                //head
                ellipse(this.position.x, this.position.y - 9, 14, 12);
                
                fill(0, 0, 0);
                //hat
                ellipse(this.position.x, this.position.y - 13, 18, 4);
                arc(this.position.x, this.position.y - 12, 12, 16, PI, 2*PI);
                
                fill(255, 0, 0);
                stroke(0, 0, 0);
                //right arm
                quad(this.position.x - 5, this.position.y - 4, this.position.x - 8, this.position.y - 3, this.position.x - 8, this.position.y + 1, this.position.x - 5, this.position.y + 3);
                
                //left arm
                quad(this.position.x + 5, this.position.y - 4, this.position.x + 8, this.position.y - 3, this.position.x + 8, this.position.y + 1, this.position.x + 5, this.position.y + 3);
                
                stroke(0, 0, 0);
                fill(29, 224, 172);
                //backpack
                rect(this.position.x - 5, this.position.y - 5, 10, 8);
                
                noStroke();
            break;
            
            case 3:
                stroke(0, 0, 0);
                fill(255, 0, 0);
                //torso
                quad(this.position.x - 5, this.position.y - 5, this.position.x + 5, this.position.y - 5, this.position.x + 6, this.position.y + 5, this.position.x - 6, this.position.y + 5);
                
                noStroke();
                fill(248, 255, 181);
                //head
                ellipse(this.position.x, this.position.y - 9, 14, 12);
                
                fill(0, 0, 0);
                //eyes
                ellipse(this.position.x - 3, this.position.y - 9, 3, 3);
                ellipse(this.position.x + 3, this.position.y - 9, 3, 3);
                
                //hat
                ellipse(this.position.x, this.position.y - 13, 18, 4);
                arc(this.position.x, this.position.y - 12, 12, 16, PI, 2*PI);
                
                fill(255, 0, 0);
                stroke(0, 0, 0);
                //right arm
                quad(this.position.x - 5, this.position.y - 4, this.position.x - 8, this.position.y - 3, this.position.x - 8, this.position.y + 1, this.position.x - 5, this.position.y + 3);
                
                //left arm
                quad(this.position.x + 5, this.position.y - 4, this.position.x + 8, this.position.y - 3, this.position.x + 8, this.position.y + 1, this.position.x + 5, this.position.y + 3);
                
                fill(248, 255, 181);
                //right hand
                ellipse(this.position.x - 2, this.position.y - 1, 5, 6);
                
                //left hand
                ellipse(this.position.x + 2, this.position.y - 1, 5, 6);
                
                fill(143, 143, 143);
                //gun
                rect(this.position.x - 3, this.position.y - 6, 4, 4); 
                
                noStroke();
            break;        
        }
    
        //draw legs moving
        if (this.swimming === 0){
            stroke(0, 0, 0);
            fill(0, 179, 219);
                
            if (useArrowKeys === true && (keyArray[37] === 1 || keyArray[38] === 1 || keyArray[39] === 1 || keyArray[40] === 1)){
                switch (this.i) {
                    case 0:
                        rect(this.position.x - 6, this.position.y + 6, 5, 3);
                        rect(this.position.x + 1, this.position.y + 6, 5, 6); 
                    break;
                    case 1:
                        rect(this.position.x - 6, this.position.y + 6, 5, 6);
                        rect(this.position.x + 1, this.position.y + 6, 5, 3); 
                    break;
                }
            }
            else if (useArrowKeys === false && (keyArray[65] === 1 || keyArray[87] === 1 || keyArray[68] === 1 || keyArray[83] === 1)){
                switch (this.i) {
                    case 0:
                        rect(this.position.x - 6, this.position.y + 6, 5, 3);
                        rect(this.position.x + 1, this.position.y + 6, 5, 6); 
                    break;
                    case 1:
                        rect(this.position.x - 6, this.position.y + 6, 5, 6);
                        rect(this.position.x + 1, this.position.y + 6, 5, 3); 
                    break;
                }
            }
            //draw legs standing
            else{
                rect(this.position.x - 6, this.position.y + 6, 5, 6);
                rect(this.position.x + 1, this.position.y + 6, 5, 6);
            }
            
            //pants
            rect(this.position.x - 6, this.position.y + 4, 12, 3);
            noStroke();
            rect(this.position.x - 5, this.position.y + 6, 4, 3);
            rect(this.position.x + 2, this.position.y + 6, 4, 3);
            
        }
        
        //frame count for leg animation
        if (this.currFrame < frameCount-10) {
            this.currFrame = frameCount;
            this.i++;
            if (this.i > 1) {
                this.i = 0;
            }
        }
    }
    
    if (frameCount - this.hurtFrame > 120){
        this.hurt = false;   
    }
};

//move player
duckHunt_playerObj.prototype.move = function() {
    //move up
    if (((useArrowKeys === true && keyArray[38] === 1) || (useArrowKeys === false && keyArray[87] === 1)) && this.position.y > 25){
        this.step.y = -1;
        this.direction = 2;
    }
    //move down
    else if (((useArrowKeys === true && keyArray[40] === 1) || (useArrowKeys === false && keyArray[83] === 1)) && this.position.y < tileHeight * duckHunt_tilemap.length - 20){
        this.step.y = 1;
        this.direction = 3;
    }
    //no change in y
    else{
        this.step.y = 0;
    }
    //move left
    if (((useArrowKeys === true && keyArray[37] === 1) || (useArrowKeys === false && keyArray[65] === 1)) && this.position.x > 15){
        this.step.x = -1;   
        this.direction = 1;
    }
    //move right
    else if (((useArrowKeys === true && keyArray[39] === 1) || (useArrowKeys === false && keyArray[68] === 1)) && this.position.x < tileWidth * duckHunt_tilemap[0].length - 15){
        this.step.x = 1;  
        this.direction = 0;
    }
    //no change in x
    else{
        this.step.x = 0;
    }
    
    //move player
    this.step.normalize();
    this.step.mult(this.speed);
    this.position = PVector.add(this.position, this.step);
        
    //checks to see if player is shooting (pressing space bar)
    if (keyArray[32] === 1){
           
        //checks to see if all 5 bullets are fired
        if (duckHunt_liveBullets < duckHunt_bulletsMax){
            
            for (var i = 0; i < duckHunt_bulletsMax; i++){
                
                //fires next available bullet
                if (duckHunt_fired === false && duckHunt_bullets[i].active === false){
                    
                    //set coordinates for bullet
                    duckHunt_bullets[i].position1.set(this.position);
                    duckHunt_bullets[i].position2.set(this.position);
                    
                    
                    //set bullet direction to player's direction
                    
                    //shoot in player's direction
                    if (this.step.x === 0 && this.step.y === 0){
                        switch (this.direction){
                            //shoot right
                            case 0:
                                duckHunt_bullets[i].step.set(new PVector(1, 0));
                            break;
                            //shoot left
                            case 1:
                                duckHunt_bullets[i].step.set(new PVector(-1, 0));
                            break;
                            //shoot up
                            case 2:
                                duckHunt_bullets[i].step.set(new PVector(0, -1));    
                            break;
                            //shoot down
                            case 3:
                                duckHunt_bullets[i].step.set(new PVector(0, 1));    
                            break;
                            
                            
                        }
                    }
                    //otherwise, shoot in players heading 
                    else{
                        duckHunt_bullets[i].step.set(this.step);
                    }
                    
                    //set bullet step vector
                    duckHunt_bullets[i].step.normalize();
                    duckHunt_bullets[i].step.mult(duckHunt_bullets[i].speed);
                    
                    //mark bullet as alive
                    duckHunt_bullets[i].active = true;
                    duckHunt_fired = true;
                    duckHunt_liveBullets++;
                    
                    //set bulletFrame to current frame
                    duckHunt_bulletFrame = frameCount;
                }
            }
            //set fired to false after 15 frames to limit the rate of fire
            if (frameCount - duckHunt_bulletFrame > 15){
                duckHunt_fired = false;
            }
        }
    }
    
    this.swimming = 0;
    
    for (var k = 0; k < water.length; k++){
        if (this.position.x > water[k].position.x - tileWidth/2 && this.position.x < water[k].position.x + tileWidth/2 && this.position.y > water[k].position.y - tileHeight/2 && this.position.y < water[k].position.y + tileHeight/2){
            this.swimming = 1;
        }
    }
    
    if (this.swimming === 1){
        this.speed.set(1, 1);   
    }
    else{
        this.speed.set(2, 2);   
    }
    
};

//draw bullet
duckHunt_bulletObj.prototype.draw = function() {
    //draw bullets if active
    if (this.active === true){
        
        //check to see bullet is out of range
        if (PVector.dist(this.position1, this.position2) < 200){
            this.position2.add(this.step);

            //used to draw x2, y2 of the bullet line
            var addX = 10*cos(this.step.heading());
            var addY = 10*sin(this.step.heading());
            
            //draw bullet
            stroke(255, 48, 48);
            line(this.position2.x, this.position2.y - 4, this.position2.x + addX, this.position2.y - 4 + addY);
        }
        //set bullet to inactive if out of range
        else{ 
            this.active = false;
            duckHunt_liveBullets--;
        }
    }
};

//draw enemy object
duckHunt_enemyObj.prototype.draw = function() {
    
    //checks to see if a bullet hits the enemy
    for (var i = 0; i < duckHunt_bulletsMax; i++){
            if (PVector.dist(this.position, duckHunt_bullets[i].position2) < 16 && duckHunt_bullets[i].active === true && this.health > 0){
                this.health--;
                
                this.hurt = true;
                this.hurtFrame = frameCount;
                
                if (this.health === 0){
                    duckHunt_enemyCnt--;
                }
                
                duckHunt_bullets[i].active = false;
                duckHunt_liveBullets--;
            }
    }
    
    if (duckHunt_enemyCnt <= 15){
        duckHunt_gameOver = true;
    }
    
    //draw if enemy is alive
    if (this.health > 0){
    pushMatrix();
    
    //rotate enemy in the direction it is facing
    translate(this.position.x, this.position.y);
    rotate(PI/2 + this.angle);
    
    if (!this.hurt){
        //draw animated enemy
        switch (this.i){
            case 0:
                image(images[0], -tileWidth/2, -tileHeight/2, tileWidth, tileHeight);
            break;
            case 1:
                image(images[1], -tileWidth/2, -tileHeight/2, tileWidth, tileHeight);
            break;
        }
    }
    
    if (frameCount - this.hurtFrame > 10){
        this.hurt = false;   
    }
    
    popMatrix();
    }
    
    //frame count is tracked for leg animation
    if (this.currFrame < frameCount-10) {
        this.currFrame = frameCount;
        this.i++;
        if (this.i > 1) {
            this.i = 0;
        }
    }    
};

//checks to see if there is an obstacle in front of enemy
duckHunt_enemyObj.prototype.checkObs = function() {
    
    this.blocked = false;
    
    for (var i=0; i<tree.length; i++) {
        var vec = PVector.sub(tree[i].position, this.position);
        var angle = this.angle - vec.heading();
        var y = vec.mag() * cos(angle);
        
        //updates angle of enemy if object is incoming
        if ((y > -1) && (y < 40)) {
            var x = vec.mag() * sin(angle);
            if ((x > 0) && (x < 20)) {
                this.blocked = true;
                this.angle += 0.05;
                this.c = 0;
            }
            else if ((x <= 0) && (x > -40)) {
                this.blocked = true;
                this.angle -= 0.05;
                this.c = 0;
            }
            //update velocity to avoid obstacle
            this.velocity.x = cos(this.angle);
            this.velocity.y = sin(this.angle);
        }
    }
    
    //update to enemy movement to wander if no obstacles are in the way
    if (this.blocked === false) {
        this.c = 1;   
    }
};

//move enemy
duckHunt_enemyObj.prototype.wander = function() {
    
    //checks for obstacles
    this.checkObs();
    
    //move to avoid or wander
    switch (this.c) {
        //enemy is avoiding obstacle
        case 0:
            this.wanderDist = random(40, 60);
            this.position.add(this.velocity);
        break;
        //enemy is wandering
        case 1:
            
            this.step.set(cos(this.angle), sin(this.angle));
            this.position.add(this.step);
            
            //reset wandering distance after every turn
            this.wanderDist--;
            if (this.wanderDist < 0) {
                var prevAngle = this.angle;
                this.wanderDist = random(70, 100);
                
                this.angle += random(-PI/2, PI/2);
                this.checkObs();
                if (this.blocked === true){
                    this.angle = prevAngle;   
                }
            }
            
            break;
    }
    
    //checks to see if player ran into enemy
    if (PVector.dist(this.position, duckHunt_player.position) < tileHeight*4/5 && this.health > 0 && duckHunt_player.health === 0 && duckHunt_player.hurt !== true){
        duckHunt_gameOver = true;   
    }
    else if (PVector.dist(this.position, duckHunt_player.position) < tileHeight*4/5 && this.health > 0 && duckHunt_player.hurt !== true){
        duckHunt_player.health--;
        duckHunt_player.hurt = true;
        duckHunt_player.hurtFrame = frameCount;
    }
    
    //move enemy back into magic circle
    if (this.position.x < -15) {
        this.position.x = tileHeight * duckHunt_tilemap[0].length + 20;
    }
    else if (this.position.x > tileHeight * duckHunt_tilemap[0].length + 20) {
        this.position.x = -15;
    }
    else if (this.position.y < -15) {
        this.position.y = tileHeight * duckHunt_tilemap.length + 20;
    }
    else if (this.position.y > tileHeight * duckHunt_tilemap.length + 20) {
        this.position.y = -15;
    }
};

//intialize objects from tile map
var duckHunt_initTilemap = function() {
    for (var i = 0; i < duckHunt_tilemap.length; i++) {
        for (var j =0; j < duckHunt_tilemap[i].length; j++) {
            switch (duckHunt_tilemap[i][j]) {
                case 't': 
                    tree.push(new treeObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'p': 
                    duckHunt_player = new duckHunt_playerObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2);
                break;
                case 'e':
                    duckHunt_enemy.push(new duckHunt_enemyObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2, 1));
                    duckHunt_enemyCnt++;
                break;
                case 'w':
                    water.push(new waterObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'a':
                    duckHunt_a.push(new aObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'b':
                    duckHunt_b.push(new bObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'c':
                    duckHunt_c.push(new cObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'd':
                    duckHunt_d.push(new dObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'm':
                    duckHunt_m.push(new mObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'n':
                    duckHunt_n.push(new nObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'k':
                    duckHunt_k.push(new kObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
                case 'l':
                    duckHunt_l.push(new lObj(j*tileWidth + tileWidth/2, i*tileHeight +  tileHeight/2));
                break;
            }
        }
    }
    
    //initialize bullets
    for (var i = 0; i < duckHunt_bulletsMax; i++){
        duckHunt_bullets.push(new duckHunt_bulletObj(0, 0));
    }
};

//variable for story mode of level 2
var story2Bool = true;

//draws game
var duckHunt_drawBackground = function() {
        //draw trees
        for (var i = 0; i < tree.length; i++){
           tree[i].draw();
        }
        
        //draw pond water objects
        for (var i = 0; i < water.length; i++){
            water[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_a.length; i++){
            duckHunt_a[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_b.length; i++){
            duckHunt_b[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_c.length; i++){
            duckHunt_c[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_d.length; i++){
            duckHunt_d[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_m.length; i++){
            duckHunt_m[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_n.length; i++){
            duckHunt_n[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_k.length; i++){
            duckHunt_k[i].draw();   
        }
        
        for (var i = 0; i < duckHunt_l.length; i++){
            duckHunt_l[i].draw();   
        }
        
        //draw bullets
        for (var i = 0; i < duckHunt_bulletsMax; i++){
            duckHunt_bullets[i].draw();
        }
        
        //draw player
        duckHunt_player.draw();
        if(!story2Bool)
        {duckHunt_player.move();}
        
        //draw enemies and move them
        for (var i = 0; i < duckHunt_enemy.length; i++){
            duckHunt_enemy[i].draw();
            
            if (duckHunt_enemy[i].health > 0 && !story2Bool){
                duckHunt_enemy[i].wander();
            }
        }
};

//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////Kevin K's characters////////////////////////////////////

//object for holding variables used in level 1 (named level 2 as it was initially level 2, then moved to level 1)
var level2Obj = function()
{
    this.tilemap = [
        "s         w    w    w    w    w    w    w    w    w    w    w    s   ",
        "                                                                     ",
        "                   z                                                 ",
        "                                               d                     ",
        "             d             d                                         ",
        "                                        z                  d         ",
        "               z                                                    ",
        "                                                             z       ",
        "                d                                   d                ",
        "                             z                                       ",
        "  p       d     z                 l                                 h",
        "                                             z                       ",
        "                                                                     ",
        "                                                                     ",
        "           z         z                                               ",
        "                                                             z       ",
        "                       d                              d              ",
        "                                                                     ",
        "             z              z             z                          ",
        "         d                                                           ",
        "                                                                     ",]; 
    this.gameX = 0; //used for map translation
    this.markers = [];
    this.endzones = [];
    this.player = 0;
    this.logo = 0;
    this.story = true; //variable to show story at beginning of level
    this.storyTranslate = -1100; //separate variable for story map translation
    this.heli = 0;
    this.debris = [];
    this.zombies = [];
    this.gameWin = false;
    this.zombieSpeed = 1;
    this.footballSpeed = 2;
    this.genRate = 60;
    this.currFrame = frameCount;
    this.footballs = [];
    this.startGame = false;
    this.playerHealth = 3;
    this.key = 0;
};

//object for debris scattered around map
//positions of debris are constant and determined using the tilemap
//however there are 6 different types of debris (different sizes and colors)
//that are randomly chosen upon declaration
var debrisObj = function(x, y)
{
    this.x = x;
    this.y = y;
    this.n = floor(random(0, 6));
};

//draws the debris object
debrisObj.prototype.draw = function() 
{
    noStroke();
    switch(this.n)
    {
        case 0:
            fill(86, 42, 30);
            rect(this.x, this.y, 20, 20);
            break;
        case 1:
            fill(86, 42, 30);
            rect(this.x, this.y, 20, 40);
            break;
        case 2:
            fill(86, 42, 30);
            rect(this.x, this.y, 40, 20);
            break;
        case 3:
            fill(46, 32, 22);
            rect(this.x, this.y, 20, 20);
            break;
        case 4:
            fill(46, 32, 22);
            rect(this.x, this.y, 40, 20);
            break;
        case 5:
            fill(46, 32, 22);
            rect(this.x, this.y, 20, 60);
            break;
    }
};

//object for the logo at the 50 yard line
var logoObj = function(x, y)
{
    this.x = x;
    this.y = y;
};

//draws the logo
logoObj.prototype.draw = function() 
{
    stroke(232, 119, 34);
    strokeWeight(14);
    line(this.x, this.y, this.x+10, this.y+30);
    line(this.x+10, this.y+30, this.x+20, this.y);
    line(this.x+20, this.y, this.x+60, this.y);
    line(this.x+40, this.y, this.x+30, this.y+30);
    stroke(255, 255, 255);
    strokeWeight(10);
    line(this.x, this.y, this.x+10, this.y+30);
    line(this.x+10, this.y+30, this.x+20, this.y);
    line(this.x+20, this.y, this.x+60, this.y);
    line(this.x+40, this.y, this.x+30, this.y+30);
    stroke(134, 31, 65);
    strokeWeight(6);
    line(this.x, this.y, this.x+10, this.y+30);
    line(this.x+10, this.y+30, this.x+20, this.y);
    line(this.x+20, this.y, this.x+60, this.y);
    line(this.x+40, this.y, this.x+30, this.y+30);
    strokeWeight(1);
};

//object for endzones on each side of field
var endzoneObj = function(x, y, s)
{
    this.x = x;
    this.y = y;
    this.side = s;
};

//draws the endzone
endzoneObj.prototype.draw = function() 
{
    stroke(255, 255, 255);
    strokeWeight(10);
    noFill();
    rect(this.x-10, this.y, 100, 450);
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(134, 31, 65);
    pushMatrix();
    translate(this.x+50, this.y+200);
    rotate(HALF_PI);
    for(var x = -1; x < 3; x++)
    {
        text("V I R G I N I A   T E C H", x, 0);
        text("V I R G I N I A   T E C H", 0, x);
    }
    fill(255, 255, 255);
    text("V I R G I N I A   T E C H", 0, 0);
    popMatrix();
    strokeWeight(1);
};

//object for lines on field
var lineMarkerObj = function(x, y)
{
    this.x = x;
    this.y = y;
};

lineMarkerObj.prototype.draw = function() 
{
    fill(255, 255, 255);
    noStroke();
    rect(this.x, this.y, 10, 400);
};

var l2 = new level2Obj(); //creates level object that holds game variables

//object for randomly placed key that the player must collect in order to win
var keyObj = function(x, y)
{
    this.x = x;
    this.y = y;
    this.size = 10;
    this.collected = false;
    this.animateSwitch = false; //used to animate the key upon collection
    this.once = false;
};

//draws the key
keyObj.prototype.draw = function() 
{
    stroke(212, 175, 48);
    noFill();
    strokeWeight(2);
    pushMatrix();
    translate(this.x, this.y);
    rotate(radians(-25));
    ellipse(0, 0, this.size, this.size);
    line(0, (this.size/2), 0, (this.size*1.5));
    line(0, (this.size*1.5), (this.size*0.4), (this.size*1.5));
    line(0, (this.size*1.1), (this.size*0.2), (this.size*1.1));
    popMatrix();
    strokeWeight(1);
};

//when the key is collected, this function is called which increments the size until the key is double the size then it decrements until the key is gone, once animation is over the collected flag is set to true
keyObj.prototype.animate = function()
{
    if(this.size < 20 && !this.animateSwitch)
    {
        this.size++;
    }
    else if (this.size  === 20)
    {
        this.animateSwitch = true;
    }
    if(this.animateSwitch)
    {
        this.size--;
        if(this.size === 0)
        {
            this.collected = true;
        }
    }
};

//object for scrolling textbox used to display story
var textBoxObj = function(x, y, s)
{
    this.x = x;
    this.y = y;
    this.string = s;
};

textBoxObj.prototype.draw = function() 
{
    fill(0, 0, 0);
    textSize(25);
    text(this.string, this.x, this.y, 350, 650);
};

//scrolls the text box
textBoxObj.prototype.move = function()
{
    this.y -= 0.4;
    l2.storyTranslate += 0.7;
};

textBoxObj.prototype.move1 = function()
{
    this.y -= 0.5;
};

//object for footballs thrown by zombies
//inputs are current zombie location and player location to calculate the line the football should travel
var footballObj = function(x1, y1, x2, y2)
{
    this.x1 = x1; 
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.position = new PVector(x1, y1);
    //direction football will move in
    this.step = new PVector(this.x2 - this.x1, this.y2 -this.y1); 
    //finds angle of direction for rotation in draw
    this.angle = this.step.heading();
    this.done = false;
};

//draws football
footballObj.prototype.draw = function() 
{
    fill(117, 24, 16);
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    noStroke();
    ellipse(0, 0, 15, 10);
    stroke(255, 255, 255);
    strokeWeight(2);
    line(-2, 0, 2, 0);
    strokeWeight(1);
    line(-2, -2, -2, 2);
    line(2, -2, 2, 2);
    popMatrix();
    strokeWeight(1);

};

//moves the football
footballObj.prototype.move = function()
{
    this.step.set(this.x2 - this.x1, this.y2 - this.y1);
    this.step.normalize();
    this.step.mult(l2.footballSpeed); //sets different speeds based on difficulty
    this.position.add(this.step);
    if(this.x < 0 || this.x > 1350 || this.y < 0 || this.y > 400)
    {
        this.done = true;
    }
};

//object for controllable player
var player2Obj = function(x, y)
{
    this.x = x;
    this.y = y;
    this.size = 20;
    //used for walking animation
    this.i = 0; 
    this.currFrame = frameCount; 
    this.direction = 0;
    this.moveBool = false;
    
    //used for energy levels
    this.energy = 10;
    //used for depleting energy
    this.eFrame = frameCount;
    this.eFrameSet = false;
    //used for regenerating energy
    this.reFrame = frameCount; 
    this.reFrameSet = false;
    //used for waiting after energy has been depleted
    this.zeroTime = 0;
    this.timeSet = false;
    
    //used to handle player collisions with debris
    this.collideWall = false;
    this.xDir = 0;
    this.yDir = 0;
    this.translateBounce = 0;
    this.speed = 2;
    
    this.dead = false;
    this.health = l2.playerHealth;
    //used for displaying Ow message after being hit by football
    this.hitText = false;
    this.hFrame = 0;
    
};

//draws the player facing the right direction
player2Obj.prototype.drawRight = function()
{
    textAlign(LEFT);
    //upper arm
    fill(255,215,174);
    noStroke();
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x+(this.size*0.3), this.y+(this.size*(2/3)), (this.size*(2/3)), (this.size*(1/6))); 
    
    //switch cases draws legs, if i is changing then this creates a walking animated effect
    stroke(255,215,174);
    strokeWeight((this.size*(1/6)));
    switch(this.i)
    {
        case 0:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(1/3)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(1/3)), this.y+(this.size*2));
            break;
        case 1:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
        case 2:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 3:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 4:
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            break;
        case 5:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 6:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 7:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
    }
    
    //body and clothes
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(65, 105, 225);
    stroke(0, 0, 0);
    strokeWeight(this.size/25);
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(168, 140, 96);
    arc(this.x, this.y+(this.size*1.28), (this.size*0.75), (this.size), radians(1), radians(180));
    //head
    fill(255,215,174);
    noStroke();
    ellipse(this.x, this.y, (this.size*0.875), this.size); 
    
    //lower arm
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x+(this.size*0.4), this.y+(this.size), (this.size*(2/3)), (this.size*(1/6))); 
    
    //eye and eyebrow
    fill(0, 0, 0);
    noStroke();
    ellipse(this.x+(this.size*0.3), this.y-(this.size*0.05), (this.size*0.1), (this.size*0.1));
    stroke(0, 0, 0);
    line(this.x+(this.size*0.35), this.y-(this.size*0.12), this.x+(this.size*0.25), this.y-(this.size*0.15));
    strokeWeight(1);
};

//draws player facing the left direction
player2Obj.prototype.drawLeft = function()
{
    textAlign(LEFT);
    //upper arm
    fill(255,215,174);
    noStroke();
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x-(this.size*0.3), this.y+(this.size*(2/3)), (this.size*(2/3)), (this.size*(1/6))); 
    
    //switch cases draws legs, if i is changing then this creates a walking animated effect
    stroke(255,215,174);
    strokeWeight((this.size*(1/6)));
    switch(this.i)
    {
        case 0:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(1/3)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(1/3)), this.y+(this.size*2));
            break;
        case 1:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
        case 2:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 3:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 4:
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            break;
        case 5:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 6:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 7:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
    }
    
   
    //body
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(65, 105, 225);
    stroke(0, 0, 0);
    strokeWeight(this.size/25);
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(168, 140, 96);
    arc(this.x, this.y+(this.size*1.28), (this.size*0.75), (this.size), radians(1), radians(180));
    //head
    fill(255,215,174);
    noStroke();
    ellipse(this.x, this.y, (this.size*0.875), this.size); 
    
    //lower arm
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x-(this.size*0.4), this.y+(this.size), (this.size*(2/3)), (this.size*(1/6))); 
    
    //eye and eyebrow
    fill(0, 0, 0);
    noStroke();
    ellipse(this.x-(this.size*0.3), this.y-(this.size*0.05), (this.size*0.1), (this.size*0.1));
    stroke(0, 0, 0);
    line(this.x-(this.size*0.35), this.y-(this.size*0.12), this.x-(this.size*0.25), this.y-(this.size*0.15));
    strokeWeight(1);

};

//large function that handles player movement, animation, collisions with debris, and energy levels
player2Obj.prototype.move = function()
{
    //draws energy bar
    noFill();
    stroke(0);
    strokeWeight(1);
    rect(this.x - 10, this.y -20, 20, 5);
    fill(255, 0, 0);
    rect(this.x - 10, this.y -20, this.energy*2, 5);
    
    //draws Health at bottom of player
    textAlign(CENTER, CENTER);
    textSize(15);
    text(("HP: " + this.health), this.x, this.y+50);
    text(("HP: " + this.health), this.x, this.y+50);
    
    //checks if hit message needs to be displayed
    var hTimeElapsed = frameCount - this.hFrame;
    if(hTimeElapsed > 120 && this.hitText)
    {
        this.hitText = false;
    }
    if(this.hitText)
    {
        text("Ow!", this.x+25, this.y+15);
    }
    textAlign(LEFT); //resets text align to default
    
    
    //for loops looks at all debris objects, checking x and y distances based on shape of debris to check for collisions, if collision happed, this.collideWall is set to true.
    this.collideWall = false;
    for(var i=0; i<l2.debris.length; i++)
    {
        var yDistance = 0;
        var xDistance = 0;

        switch(l2.debris[i].n)
        {
            case 0:
                xDistance = ((l2.debris[i].x+10) -this.x)*((l2.debris[i].x+10) -this.x);
                yDistance = ((l2.debris[i].y+10)-(this.y+15))*((l2.debris[i].y+10)-(this.y+15));
                if(xDistance < 400 && yDistance < 1225)
                {
                    this.collideWall = true;
                }
                break;
            case 1:
                xDistance = ((l2.debris[i].x+10) -this.x)*((l2.debris[i].x+10) -this.x);
                yDistance = ((l2.debris[i].y+20)-(this.y+15))*((l2.debris[i].y+20)-(this.y+15));
                if(xDistance < 400 && yDistance < 2025)
                {
                    this.collideWall = true;
                }
                break;
            case 2:
                xDistance = ((l2.debris[i].x+20) -this.x)*((l2.debris[i].x+20) -this.x);
                yDistance = ((l2.debris[i].y+10)-(this.y+15))*((l2.debris[i].y+10)-(this.y+15));
                if(xDistance < 900 && yDistance < 1225)
                {
                    this.collideWall = true;
                }
                break;
            case 3:
                xDistance = ((l2.debris[i].x+10) -this.x)*((l2.debris[i].x+10) -this.x);
                yDistance = ((l2.debris[i].y+10)-(this.y+15))*((l2.debris[i].y+10)-(this.y+15));
                if(xDistance < 400 && yDistance < 1225)
                {
                    this.collideWall = true;
                }
                break;
            case 4:
                xDistance = ((l2.debris[i].x+20) -this.x)*((l2.debris[i].x+20) -this.x);
                yDistance = ((l2.debris[i].y+10)-(this.y+15))*((l2.debris[i].y+10)-(this.y+15));
                if(xDistance < 900 && yDistance < 1225)
                {
                    this.collideWall = true;
                }
                break;
            case 5:
                xDistance = ((l2.debris[i].x+10) -this.x)*((l2.debris[i].x+10) -this.x);
                yDistance = ((l2.debris[i].y+30)-(this.y+15))*((l2.debris[i].y+30)-(this.y+15));
                if(xDistance < 400 && yDistance < 3025)
                {
                    this.collideWall = true;
                }
                break;
        }
    }
    
    //sets movement keys based on setting in options menu
    var u = 0;
    var d = 0;
    var l = 0;
    var r = 0;
    if(useArrowKeys)
    {
        u = 38;
        d = 40;
        l = 37;
        r = 39;
    }
    else
    {
        u = 87;
        d = 83;
        l = 65;
        r = 68;        
    }
    
    //if block for movement, if we are not colliding we simply check for movement, if we are colliding we bounce off the object
    if(!this.collideWall)
    {
        //resets bounce variables so movement can set them
        this.xDir = 0;
        this.yDir = 0;
        this.translateBounce = 0;
        
        if(keyArray[u] === 1)
        {
            if(this.y > 0)
            {
                this.y -= this.speed;
                this.moveBool = true;
                l2.gameStart= true;
                this.yDir = 4;
            }
        }
        if(keyArray[d] === 1)
        {
            if(this.y < 380)
            {
                this.y += this.speed;
                this.moveBool = true;
                l2.gameStart= true;
                this.yDir = -4;
            }
        }
        if(keyArray[l] === 1)
        {
            if(this.x > 0)
            {
                this.x -= this.speed;
                if(l2.gameX < 10 && this.x < 1040)
                {
                    l2.gameX += this.speed;
                    this.translateBounce = -4;
                }
                this.direction = 1;
                this.moveBool = true;
                l2.gameStart= true;
                this.xDir = 4;
            }
        }
        if(keyArray[r] === 1)
        {
            if(this.x < 1380)
            {
                this.x += this.speed;
                if(l2.gameX > -1005 && this.x > 20)
                {
                    l2.gameX -= this.speed;
                    this.translateBounce = 4;
                }
                this.direction = 0;
                this.moveBool = true;
                l2.gameStart= true;
                this.xDir = -4;
            }
        }
        if(keyArray[u]=== 0 && keyArray[d]=== 0 && keyArray[l]=== 0 && keyArray[r]=== 0)
        {
            this.moveBool = false; //used to stop animation if there is no movement
            this.i = 0;
        }        
    }
    else
    {
        //bounces player off of debris
        this.y += this.yDir;
        this.x += this.xDir;
        l2.gameX += this.translateBounce;   
    }

    //if spacebar is pressed, you have energy, and are moving we  boost speed and start depleting energy
    if(keyArray[32] === 1 && this.energy > 0 && this.moveBool)
    {
        this.reFrameSet = false;
        if(!this.eFrameSet)
        {        
            this.eFrame = frameCount;
            this.eFrameSet = true;
        }
        var timeElapsed = frameCount - this.eFrame;
        if(timeElapsed > 5)
        {
            this.energy--;
            this.eFrame = frameCount;
        }
        this.speed = 4;
    }
    else if(this.energy === 0) //if your energy has reached 0 we wait 2 sec before adding more energy
    {
        this.speed = 2;
        if(!this.timeSet)
        {
            this.zeroTime = millis();
            this.timeSet = true;
        }
        var timeElapsed = millis() - this.zeroTime;
        if(timeElapsed >= 2000)
        {
            this.energy++;
            this.timeSet = false;
        }
    }
    //else we regen energy if need be
    else
    {
        this.eFrameSet = false;
        if(!this.reFrameSet)
        {
            this.reFrame = frameCount;
            this.reFrameSet = true;
        }
        
        var timeElapsed = frameCount - this.reFrame;
        if(timeElapsed > 30 && this.energy < 10)
        {
            this.energy++;
            this.reFrame = frameCount;
        }
    }
    //checks for release of spacebar to put speed back to normal
    if(keyArray[32] === 0)
    {
        this.speed = 2;
    }
    
    //if we are moving animate legs
    if(this.moveBool)
    {
        if (this.currFrame < (frameCount - 5)) 
        {
            this.currFrame = frameCount;
            this.i++;
            if (this.i > 7) 
            {
            this.i = 0;
            }
        }
    }
};

//function that checks for all non-debris collisions including zombie collisions, football collisions, collecting the key, and gameWin scenario
player2Obj.prototype.checkCollisions = function()
{
    var xDistance = 0;
    var yDistance = 0;
    
    //for zombie collisions we only look at collisions of the heads of the zombies to the head of the player to account for 3d representations. If player's head visually passed over a zombie body it is not a collision.
    //zombie collision does not interact with health, player instantly dies regardless of health
    for(var i=0; i<l2.zombies.length;i++)
    {

        if(!l2.zombies[i].dead)
        {
            xDistance = ((l2.zombies[i].x) -this.x)*((l2.zombies[i].x) -this.x);
            yDistance = ((l2.zombies[i].y)-(this.y))*((l2.zombies[i].y)-(this.y));
            if(xDistance < 420 && yDistance < 420)
            {
                this.dead = true;
            }            
        }
    }
    
    //footballs can collide with any part of the player, however unlike the zombies it only takes off 1 health point
    for(var i=0; i <l2.footballs.length; i++)
    {
        if(!l2.footballs[i].done)
        {
            xDistance = ((l2.footballs[i].position.x) -this.x)*((l2.footballs[i].position.x) -this.x);
            yDistance = ((l2.footballs[i].position.y) -(this.y+15))*((l2.footballs[i].position.y) - (this.y+15));
            if(xDistance < 289 && yDistance < 900)
            {
                this.health--;
                if(this.health <= 0)
                {
                    this.dead = true;
                }
                l2.footballs[i].done = true;
                this.hitText = true;
                this.hFrame = frameCount;
            }
        }
    }
    
    xDistance = ((l2.key.x) - this.x)*((l2.key.x) -this.x);
    yDistance = ((l2.key.y) -(this.y+15))*((l2.key.y) - (this.y+15));
    
    if(xDistance < 225 && yDistance < 900 && !l2.key.once)
    {
        l2.key.once = true; //used to tell next if block to animate
    }
    
    if(l2.key.once && !l2.key.collected)
    {
        //animate the key when it is run over, once the animation is over l2.key.collected is set to true (in the animate function) which casues this if loop to stop 
        l2.key.animate();
    }
    
    //checks to see if player has reached helicoper
    if(this.x > 1290 && this.y < 225 && this.y > 150 )
    {
        l2.heli.spinRotors();
        if(l2.key.collected) //if player has key
        {
            l2.gameWin = true;//game win!
        }
        else //if player doesn't have key
        {
            //display message that user still needs to retrieve key
            fill(255, 0, 0);
            textSize(20);
            text("You Still Need\n     the Key!", 1250, 175);
        }
    }
};

//object for enemy zombie character
var footballZombieObj = function(x, y, s, a)
{
    this.x = x;
    this.y = y;
    this.size = s;
    //used for animation
    this.i = 0;
    this.currFrame = frameCount;
    this.direction = 1;
    
    //used for instruction screen animation
    this.animateDir = a;
    
    //used for wandering movement and debris avoidance
    this.wanderDist = 0;
    this.angle = 0;
    this.whisker1 = new PVector(0, 0);
    this.whisker2 = new PVector(0, 0);
    this.whisker3 = new PVector(0, 0);
    this.whisker4 = new PVector(0, 0);
    this.step = new PVector(0,0);
    this.aheadStep = new PVector(0, 0);
    
    this.dead = false;
    this.footballThrown = false; //each zombie can only throw one football
};

//draws the football player zombie from level 2
//draws the zombie facing left
footballZombieObj.prototype.drawLeft = function() 
{
    textAlign(LEFT);
    //upper arm
    fill(120, 193, 101);
    noStroke();
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x-(this.size*0.3), this.y+(this.size*(2/3)), (this.size*(2/3)), (this.size*(1/6))); 
    
    //switch cases draws legs, if i is changing then this creates a walking animated effect
    stroke(120, 193, 101);
    strokeWeight((this.size*(1/6)));
    switch(this.i)
    {
        case 0:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(1/3)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(1/3)), this.y+(this.size*2));
            break;
        case 1:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
        case 2:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 3:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 4:
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            break;
        case 5:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 6:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 7:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
    }
    
    //if zombie still can throw a football, one is drawn
    if(!this.footballThrown)
    {
        var x = this.x-8;
        var y = this.y+15;
        fill(117, 24, 16);
        noStroke();
        ellipse(x, y, 15, 10);
        stroke(255, 255, 255);
        strokeWeight(2);
        line(x-2, y, x+2, y);
        strokeWeight(1);
        line(x-2, y-2, x-2, y+2);
        line(x+2, y-2, x+2, y+2); 
    }
   
    //body
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(134, 31, 65);
    stroke(0, 0, 0);
    strokeWeight(this.size/25);
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(120, 193, 101);
    arc(this.x, this.y+(this.size*1.28), (this.size*0.75), (this.size), radians(1), radians(180));
    //head
    noStroke();
    ellipse(this.x, this.y, (this.size*0.875), this.size); 
    
    //lower arm
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x-(this.size*0.4), this.y+(this.size), (this.size*(2/3)), (this.size*(1/6))); 

    //football helmet
    fill(134, 31, 65);
    noStroke();
    ellipse(this.x+(this.size*0.225), this.y, this.size - (this.size/8), this.size + (this.size/8)); 
    ellipse(this.x+(this.size*0.03), this.y-(this.size*0.38), this.size, this.size*0.375);
    fill(232, 119, 34);
    textSize((this.size*0.375));
    text("VT", this.x, this.y+(this.size*0.1)); 
    text("VT", this.x, this.y+(this.size*0.1));
    
    //guard for football helmet
    stroke(117, 120, 123);
    strokeWeight(2);
    noFill();
    bezier(this.x-(this.size*0.125), this.y+(this.size*0.375), this.x-(this.size*0.5), this.y+(this.size*0.5), this.x-this.size, this.y, this.x-(this.size*0.45), this.y);
    bezier(this.x-(this.size*0.125), this.y+(this.size*0.375), this.x-(this.size*0.5), this.y+(this.size*0.5), this.x-this.size, this.y, this.x-(this.size*0.45), this.y); 
    
    //eye and eyebrow
    fill(0, 0, 0);
    noStroke();
    ellipse(this.x-(this.size*0.3), this.y-(this.size*0.05), (this.size*0.1), (this.size*0.1));
    stroke(0, 0, 0);
    line(this.x-(this.size*0.35), this.y-(this.size*0.12), this.x-(this.size*0.25), this.y-(this.size*0.15));
    strokeWeight(1);

};

//separate draw function to draw a right facing football player zombie
//only used for instructions/game over screens animations
footballZombieObj.prototype.drawRight = function() 
{
    textAlign(LEFT);
    //upper arm
    fill(120, 193, 101);
    noStroke();
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x+(this.size*0.3), this.y+(this.size*(2/3)), (this.size*(2/3)), (this.size*(1/6))); 
    
    //switch cases draws legs, if i is changing then this creates a walking animated effect
    stroke(120, 193, 101);
    strokeWeight((this.size*(1/6)));
    switch(this.i)
    {
        case 0:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(1/3)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(1/3)), this.y+(this.size*2));
            break;
        case 1:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
        case 2:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 3:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 4:
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x, this.y+(this.size*2));
            break;
        case 5:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.1), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.1), this.y+(this.size*2));
            break;
        case 6:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*0.2), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*0.2), this.y+(this.size*2));
            break;
        case 7:
            line(this.x, this.y+(this.size*(4/3)), this.x-(this.size*(4/15)), this.y+(this.size*2));
            line(this.x, this.y+(this.size*(4/3)), this.x+(this.size*(4/15)), this.y+(this.size*2));
            break;
    }
    
    //body and jersey
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(134, 31, 65);
    stroke(0, 0, 0);
    strokeWeight(this.size/25);
    ellipse(this.x, this.y+(this.size), (this.size*0.75), (this.size*1.5));
    fill(120, 193, 101);
    arc(this.x, this.y+(this.size*1.28), (this.size*0.75), (this.size), radians(1), radians(180));
    //head
    noStroke();
    ellipse(this.x, this.y, (this.size*0.875), this.size); 
    
    //lower arm
    stroke(0, 0, 0);
    strokeWeight((this.size/30));
    ellipse(this.x+(this.size*0.4), this.y+(this.size), (this.size*(2/3)), (this.size*(1/6))); 
    
    //football helmet
    fill(134, 31, 65);
    noStroke();
    ellipse(this.x-(this.size*0.225), this.y, this.size - (this.size/8), this.size + (this.size/8)); 
    ellipse(this.x-(this.size*0.03), this.y-(this.size*0.38), this.size, this.size*0.375);
    fill(232, 119, 34);
    textSize((this.size*0.375));
    text("VT", this.x-(this.size*0.4), this.y+(this.size*0.1)); 
    text("VT", this.x-(this.size*0.4), this.y+(this.size*0.1));
    
    //guard for football helmet
    stroke(117, 120, 123);
    strokeWeight(2);
    noFill();
    bezier(this.x+(this.size*0.125), this.y+(this.size*0.375), this.x+(this.size*0.5), this.y+(this.size*0.5), this.x+this.size, this.y, this.x+(this.size*0.45), this.y);
    bezier(this.x+(this.size*0.125), this.y+(this.size*0.375), this.x+(this.size*0.5), this.y+(this.size*0.5), this.x+this.size, this.y, this.x+(this.size*0.45), this.y);
    
    //eye and eyebrow
    fill(0, 0, 0);
    noStroke();
    ellipse(this.x+(this.size*0.3), this.y-(this.size*0.05), (this.size*0.1), (this.size*0.1));
    stroke(0, 0, 0);
    line(this.x+(this.size*0.35), this.y-(this.size*0.12), this.x+(this.size*0.25), this.y-(this.size*0.15));
    strokeWeight(1);
};

//animate function for zombie player, used in starting screen for display
footballZombieObj.prototype.animate = function()
{
    if(this.animateDir === 'l')
    {
        this.x--;
        if (this.x < -10) {
            this.x = 410;
        }
    }
    else
    {
        this.x++;
        if (this.x > 410) {
            this.x = -10;
        }            
    } 

    //changes what to draw for walking animation
    if (this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        this.i++;
        if (this.i > 7) {
            this.i = 0;
        }
    }
};

//used for whiskers to avoid debris
var findIntersection = function(p) 
{
    var distance = 0;
    var d = 0;

    for (var i=0; i<l2.debris.length; i++) 
    {
        switch(l2.debris[i].n)
        {
            case 0:
                var d = dist2(p.x, p.y, l2.debris[i].x+10, l2.debris[i].y+10);
                break;
            case 1:
                var d = dist2(p.x, p.y, l2.debris[i].x+10, l2.debris[i].y+20);
                break;
            case 2:
                var d = dist2(p.x, p.y, l2.debris[i].x+20, l2.debris[i].y+10);
                break;
            case 3:
                var d = dist2(p.x, p.y, l2.debris[i].x+10, l2.debris[i].y+10);
                break;
            case 4:
                var d = dist2(p.x, p.y, l2.debris[i].x+20, l2.debris[i].y+10);
                break;
            case 5:
                var d = dist2(p.x, p.y, l2.debris[i].x+10, l2.debris[i].y+30);
                break;
        }
        if (d < 160000) 
        {
            distance += d;
        }
    }
    
    if (distance === 0) {
        distance = 100000;
    }
    
    return(distance);
};

//checks for debris collisions and adjusts step based on whiskers if necessary
footballZombieObj.prototype.collideWall = function()
{
    this.aheadStep.set(-1, sin(this.angle));
    this.aheadStep.normalize();
    this.aheadStep.mult(15);
    var pos = new PVector(this.x, this.y);
    var ahead = new PVector((this.aheadStep.x + this.x), (this.aheadStep.y + this.y));
    var xDistance = 0;
    var yDistance = 0;
    for(var i=0; i<l2.debris.length; i++)
    {
        var collide = 0;
        switch(l2.debris[i].n)
        {
            case 0:
                xDistance = ((l2.debris[i].x+10) -ahead.x)*((l2.debris[i].x+10) -ahead.x);
                yDistance = ((l2.debris[i].y+10)-(ahead.y+15))*((l2.debris[i].y+10)-(ahead.y+15));
                if(xDistance < 400 && yDistance < 1225)
                {
                    collide = 1;
                }
                break;
            case 1:
                xDistance = ((l2.debris[i].x+10) -ahead.x)*((l2.debris[i].x+10) -ahead.x);
                yDistance = ((l2.debris[i].y+20)-(ahead.y+15))*((l2.debris[i].y+20)-(ahead.y+15));
                if(xDistance < 400 && yDistance < 2025)
                {
                    collide = 1;
                }
                break;
            case 2:
                xDistance = ((l2.debris[i].x+20) -ahead.x)*((l2.debris[i].x+20) -ahead.x);
                yDistance = ((l2.debris[i].y+10)-(ahead.y+15))*((l2.debris[i].y+10)-(ahead.y+15));
                if(xDistance < 900 && yDistance < 1225)
                {
                    collide = 1;
                }
                break;
            case 3:
                xDistance = ((l2.debris[i].x+10) -ahead.x)*((l2.debris[i].x+10) -ahead.x);
                yDistance = ((l2.debris[i].y+10)-(ahead.y+15))*((l2.debris[i].y+10)-(ahead.y+15));
                if(xDistance < 400 && yDistance < 1225)
                {
                    collide = 1;
                }
                break;
            case 4:
                xDistance = ((l2.debris[i].x+20) -ahead.x)*((l2.debris[i].x+20) -ahead.x);
                yDistance = ((l2.debris[i].y+10)-(ahead.y+15))*((l2.debris[i].y+10)-(ahead.y+15));
                if(xDistance < 900 && yDistance < 1225)
                {
                    collide = 1;
                }
                break;
            case 5:
                xDistance = ((l2.debris[i].x+10) -ahead.x)*((l2.debris[i].x+10) -ahead.x);
                yDistance = ((l2.debris[i].y+30)-(ahead.y+15))*((l2.debris[i].y+30)-(ahead.y+15));
                if(xDistance < 400 && yDistance < 3025)
                {
                    collide = 1;
                }
                break;            
        }
        
        //if the zombie is colliding with a wall we check whiskers
        if(collide === 1)
        {
            this.whisker1.set(this.aheadStep.x, this.aheadStep.y);
            this.whisker2.set(this.aheadStep.x, this.aheadStep.y);
            this.whisker3.set(this.aheadStep.x, this.aheadStep.y);
            this.whisker4.set(this.aheadStep.x, this.aheadStep.y);

            this.whisker1.add(pos);
            this.whisker2.add(pos);
            this.whisker3.add(pos);
            this.whisker4.add(pos);
            this.whisker1.normalize();
            this.whisker2.normalize();
            this.whisker3.normalize();
            this.whisker4.normalize();
            this.whisker1.rotate(radians(45));
            this.whisker2.rotate(radians(-45));
            this.whisker3.rotate(radians(90));
            this.whisker4.rotate(radians(-90));
            var dist1 = findIntersection(this.whisker1);
            var dist2 = findIntersection(this.whisker2);
            var dist3 = findIntersection(this.whisker3);
            var dist4 = findIntersection(this.whisker4);
            //find intersection finds best whisker then we change this.step to the appropriate whisker
            if (dist1 > dist2 && dist1 > dist3 && dist1 > dist4) 
            {
                this.step.x = this.whisker1.x;
                this.step.y = this.whisker1.y;
            }
            else if(dist2 > dist1 && dist2 > dist3 && dist2 > dist4)
            {
                this.step.x = this.whisker2.x;
                this.step.y = this.whisker2.y;
            }
            else if(dist3 > dist1 && dist3 > dist2 && dist3 > dist4)
            {
                this.step.x = this.whisker3.x;
                this.step.y = this.whisker3.y;
            }
            else 
            {
                this.step.x = this.whisker4.x;
                this.step.y = this.whisker4.y;
            }
        }
    }
};

//moves zombie
footballZombieObj.prototype.move = function()
{
    //sets a new direction after the zombie has moved the wanderDist
    if (this.wanderDist <= 0) {
        this.wanderDist = random(50, 80); //sets a new wanderDist
        this.angle = random(0, 360); //random direction
        //only use y as random direction so zombies continously move to the left
        this.step.set(-1, sin(this.angle)); 
        this.step.normalize();
        this.step.mult(l2.zombieSpeed);//sets speed based on difficulty
    }
    this.wanderDist--;
    this.collideWall();//updates whiskers
    this.x += this.step.x; 
    if((this.y + this.step.y) > 0 && (this.y + this.step.y) < 400)
    {
        this.y += this.step.y;
    }
    
    //changes what to draw for walking animation
    if (this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        this.i++;
        if (this.i > 7) {
            this.i = 0;
        }
    }
};

//checks if player is close to zombie, if so zombie throws a football
footballZombieObj.prototype.throwFootball = function()
{
    if(!this.footballThrown)
    {
        var d = dist2(this.x, this.y+15, l2.player.x, l2.player.y+15);
        if(d < 22500)
        {
            l2.footballs.push(new footballObj(this.x, this.y+15, l2.player.x, l2.player.y+15));
            this.footballThrown = true;
        }        
    }

};

//helicopter object
var heliObj = function(x,y,f)
{
    this.x = x;
    this.y = y;
    this.i = 0;
    this.currFrame = frameCount;
    this.rotorLength = 125; 
    this.angle = 0;
    this.wanderDist = 0;
    this.direction = new PVector(0,0);
    this.final = f;
};

//draws helicopter
heliObj.prototype.draw = function() 
{
    rectMode(CENTER);
    noStroke();
    fill(0, 0, 0);
    //body of heli
    ellipse(this.x, this.y, 120, 65);
    rect(this.x, this.y-30, 15, 50);//connection to rotor
    //back rotor
    rect(this.x + 45, this.y + 3, 127, 20);
    rect(this.x + 101, this.y + -16, 15, 18);
    fill(198, 226, 227);
    ellipse(this.x-30, this.y, 35, 30);//window
    strokeWeight(5);
    stroke(0, 0, 0);
    //bottom of helicopter
    line(this.x, this.y+20, this.x-40, this.y+60);
    line(this.x, this.y+20, this.x+40, this.y+60);
    line(this.x-50, this.y+60, this.x+50, this.y+60);
    line(this.x-50, this.y+60, this.x-55, this.y+55);
    line(this.x+50, this.y+60, this.x+55, this.y+55);
    noStroke();
    fill(80, 80, 80);
    rect(this.x, this.y-55, this.rotorLength, 5); //rotor
    if(this.final === true) //draws person if flag is true
    {
        fill(65, 105, 225);
        ellipse(this.x-25, this.y+10, 9, 10);
        fill(255,205,148);
        ellipse(this.x-25, this.y, 15, 15);
        fill(0, 0, 0);
        ellipse(this.x-27, this.y-2, 4, 4);
        noFill();
        stroke(0, 0, 0);
        strokeWeight(1);
        arc(this.x-28, this.y+3, 5, 5, radians(30), radians(100));        
    }
    strokeWeight(1);
    fill(255,223,0);
    rect(this.x+20, this.y+8, 40, 10, 10);
    stroke(80, 80, 80);
    fill(0, 0, 0);
    rect(this.x+20, this.y, 30, 10);

    rectMode(CORNER);
};

//changes rotorlength to make it look like rotors are spinning
heliObj.prototype.spinRotors = function()
{
    if(this.i === 0 && this.rotorLength <= 15)
    {
        this.i = 1;
    }
    else if(this.i === 1 && this.rotorLength >= 125)
    {
        this.i = 0;
    }
    if(this.i === 0)
    {
        this.rotorLength -= 10;
    }
    else
    {
        this.rotorLength += 10;
    }
};

//game win animation
heliObj.prototype.animate2 = function()
{
    this.spinRotors();
    if(this.y > -100)
    {
        this.y -= 0.5;
        this.x -= 0.2;
    }
};

//instruction screen animation
heliObj.prototype.animate = function()
{
    if (this.wanderDist <= 0) {
        this.wanderDist = random(50, 120);
        this.angle = random(radians(0), radians(360));
    }
    this.wanderDist--;
    
    //if block makes it so the helicopter is on screen 
    if(this.x > 420)
    {
        this.angle = radians(180);
    }
    else if(this.x < -20)
    {
        this.angle = radians(0);
    }
    else if(this.y > 420)
    {
        this.angle = radians(270);
    }
    else if (this.y < -20)
    {
        this.angle = radians(90);
    }
    
    this.direction.set(cos(this.angle), sin(this.angle));
    this.direction.normalize();
    this.x += this.direction.x;
    this.y += this.direction.y;
    
    if (this.x > 490) {
        this.x = -90;
    }
    else if (this.x < -90) {
        this.x = 490;
    }
    if (this.y > 490) {
        this.y = -90;
    }
    else if (this.y < -90) {
        this.y = 490;
    }
    
    this.spinRotors();
};

heliObj.prototype.animate_L4 = function()
{
    
    //if block makes it so the helicopter moves across the screen
    if(this.x > -110)
    {
        this.x += -1;
        this.spinRotors();
    }
    
};

//sets up game based off tilemap
level2Obj.prototype.initTilemap = function()
{
    for (var i = 0; i< this.tilemap.length; i++) {
        for (var j =0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
                case 'w': 
                    this.markers.push(new lineMarkerObj(j*20, i*20));
                    break;
                case 's':
                    this.endzones.push(new endzoneObj(j*20, i*20, 0));
                    break;
                case 'p':
                    this.player = new player2Obj(j*20+15, i*20);
                    break;
                case 'l':
                    this.logo = new logoObj(j*20, i*20);
                    break;
                case 'h':
                    this.heli = new heliObj(j*20, i*20, false);
                    break;
                case 'd':
                    this.debris.push(new debrisObj(j*20, i*20));
                    break;
                case 'z':
                    this.zombies.push(new footballZombieObj(j*20, i*20, 20, 'n'));
                    break;
            }
        }
    }
    
    var j = floor(random(20, this.tilemap[0].length-10));
    var i = floor(random(2, this.tilemap.length-2));
    this.key = new keyObj(j*20, i*20);
};

//draws all different objects in game
level2Obj.prototype.drawBackground = function()
{
    for(var i=0; i<this.markers.length;i++)
    {
        this.markers[i].draw();
    }
    for(var i=0; i<this.endzones.length;i++)
    {
        this.endzones[i].draw();
    }
    for(var i=0; i<this.debris.length;i++)
    {
        this.debris[i].draw();
    }
    this.logo.draw();
    this.heli.draw();
    if(!this.key.collected)
    {    
        this.key.draw();
    }
    strokeWeight(1);
};

//simple function that calls move for every zombie
level2Obj.prototype.moveZombies = function()
{
   for(var i=0; i<this.zombies.length; i++)
   {
       if(!this.zombies[i].dead)
       {this.zombies[i].move();}
   }
};

//draws zombies and footballs
level2Obj.prototype.drawZombies = function()
{
   for(var i=0; i<this.zombies.length; i++)
   {
       if(this.zombies[i].x > 0)
       {
            if(this.zombies[i].direction === 0)
            {this.zombies[i].drawRight();}
            else
            {this.zombies[i].drawLeft();}
            this.zombies[i].throwFootball();
       }
       else
       {
           this.zombies[i].dead = true;
       }
   }
   
   for(var i=0; i<l2.footballs.length;i++)
   {
       if(!l2.footballs[i].done)
       {
           l2.footballs[i].draw();
           l2.footballs[i].move();           
       }
   }
};

//spawns in new zombies based off player's location
level2Obj.prototype.generateZombies = function()
{
    var timeElapsed = frameCount - this.currFrame;
    if(timeElapsed > this.genRate)//based on difficulty
    {
        if(l2.player.x < 346)
        {
            this.zombies.push(new footballZombieObj(691, random(50, 350), 20, 'n'));
            this.currFrame = frameCount; 
        }
        else if(l2.player.x < 691)
        {
            this.zombies.push(new footballZombieObj(1038, random(50, 350), 20, 'n'));
            this.currFrame = frameCount;             
        }
        else if(l2.player.x < 1160)
        {
            this.zombies.push(new footballZombieObj(1350, random(50, 350), 20, 'n'));
            this.currFrame = frameCount;             
        }
    }
};

//resets game variables
level2Obj.prototype.resetVars = function()
{
    this.gameX = 0;
    this.markers = [];
    this.endzones = [];
    this.player = 0;
    this.logo = 0;
    this.heli = 0;
    this.debris = [];
    this.zombies = [];
    this.gameWin = false;
    this.currFrame = frameCount;
    this.footballs = [];
    this.gameStart = false;
    this.key = 0;
};

var instructionFBZombies = [];
var gameOverFBZombies = [];
instructionFBZombies.push(new footballZombieObj(100, 250, 25, 'l'));
instructionFBZombies.push(new footballZombieObj(100, 150, 25, 'r'));
gameOverFBZombies.push(new footballZombieObj(random(10, 390), 50, 25, 'l'));
gameOverFBZombies.push(new footballZombieObj(random(10, 390), 125, 25, 'r'));
gameOverFBZombies.push(new footballZombieObj(random(10, 390), 200, 25, 'l'));
gameOverFBZombies.push(new footballZombieObj(random(10, 390), 275, 25, 'r'));

var gameWinHeli = new heliObj(200, 200, true);
var instruction4Heli = new heliObj(200, 200, true);
var instruction4Heli_L4 = new heliObj(500, 200, true);

//variables used for stories at beginning of levels
var story1Text = "The zombie apocalypse has come to your college campus and few survivors are left. You heard that there is a helicopter at the football stadium, however you also heard it was overrun with the football team as zombies. In order to help you and your other friends nearby escape, you need to get the helicopter. Collect the key and make it to helicopter on the other side of the field to win the level!";

var s1TextBox = new textBoxObj(25, 350, story1Text);

var story2Text = "Another student is stranded at the duck pond, noticing that all the ducks are infected. Your friend from the football stadium is on stadby with the helicopter to rescue you, however there are too many zombie ducks to land. Eliminate 15 zombie ducks so your friend can land and rescue you.";

var s2TextBox = new textBoxObj(25, 350, story2Text);

var story3Bool = true;
var story3Text = "The last student to be rescued is stuck at the bottom of a tall building. Your friends in the helicopter are waiting at the top of the building. Collect all the antidotes in the building while avoiding any zombies or bats to escape!";

var s3TextBox = new textBoxObj(25, 350, story3Text);

var story4Bool = true;
var story4Text = "All three characters have made it to the helicopter; however, you are not in the clear yet. As you make your escape you notice a giant bat in the sky. Fight the giant bat avoiding the bat horde and lasers to win the game!";

var s4TextBox = new textBoxObj(25, 350, story4Text);

//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
///////////////////Jamahl's Characters//////////////////////////////////////////////////

//tilemap used for the instruction screen animations
var instructionpage_tilemap = [
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    " P                  ",
    "                    ",
    "                    ",
    "                    ",
    "    a               ",
    "fffffff             ",
    "       fff  g       ",
    "          fff       ",
    "             fff    ",
    "                fff ",];
    
    //The highest the player can jump from one level to the next is about 4 spaces from your initial f
var level3_tilemap = [
"                  a ",
"   ff            fff",
"                    ",
"         ffff       ",
"   e                ",
" a         a        ",
"ffff                ",
"    ff         fff  ",
"        E        E  ",
"            e       ",
"  g               a ",
"      ffffffffffffff",
"                    ",
"                    ",
"  fff         e     ",
"           E        ",
"                    ",
"                  a ",
"fff     fffffff  fff",
"                    ",
"                    ",
"     fff        g   ",
"               fff  ",
" a       e          ",
"fff                 ",
"                    ",
"      fff   a       ",
"   E              ff",
"                    ",
"  a                 ",
"fffffffffffff       ",
"                e   ",
"                 g  ",
"           a    fff ",
"   P            E   ",
"                    ",
"                   a",
"fffffff      fffffff",
"                    ",];
    
//////////////////////////////////////////////
////////////Game Stats - Health, Speed, etc.


///////////////////////////////////
//Nomal mode settings/////////////

var enemy1_speed = 1; //controls zombie move speed
var enemy2_speed = 1; //controls bat move speed
var enemy1_health = 2; //controls zombie's health
var enemy2_health = 1; //controls bat's health
var player_health = 3; //controls player's health
var player_speed = 1.5; //controls player's speed
var fall_speed = 8; //controls fall speed of platforms when they happen to fall

//////////////////////////////////////////////

var bulletIndex = 0; //index of bullets in the bullet array

//camera variables
var camera_x = 0;
var camera_y = 280;

//used for holding information about which platform, if any is in front of the player.
var next_platform = 0;

//a variable that is triggered when a collectable is picked up. This signal will cause a message to be displayed on the player character depending on the item picked up
var collected_signal = false;
var start_timer = false; //The flag used to start the timer for when collectables are picked up
var signal_timer = 0; //the intial time the timer is started
var signal_timer_passed = 0; //always contains the time that is being checked. The difference between signal_timer and this variable determine how much time has passed.

//Same timer deal here except its used for when the player is hurt and triggers a transparency effect on the player
var hurt_timer = 0;
var hurt_timer_passed = 0;
var start_hurt_timer = false;

//variable for keeping track of how many antidotes are picked up
var score = 0;
//Used to hold the current frame count and controls how many bullets can be fired when used in conjunction with the frameCount property
var bulletsCurrFrameCount = 0;

//The vectors used to control the physics of falling and jumping in the game
var gravity = new PVector(0, 0.1);
var jumpForce = new PVector(0, -4.0);

//The variables that will hold instances of the charcter models and special effects that are used in the game
var player = [];
var enemies1 = []; //normal zombie
var enemies2 = []; //bat that follows the player
var platforms = [];
var guns = [];
var antidotes = [];
var blood_splatter = [];

/////////////////////////////////FSM for bat movements////////////////////////////////////
//This function is used for when the player is currently not in the bat enemies' detection range
var batWanderState = function() {
    this.angle = 0;
    this.wanderDist = 0;
    this.step = new PVector(0,-1);
};

//This function is used for when the player comes within the bat's detection range. The bat will continue to chase the player until the player is out of range
var batChaseState = function() {
    this.step = new PVector(0,0);
};

//This function is used for when the player has been hurt, which temporarily grants invincibility, and causes the bat to flee from the player so that the player has a chance to recover from the damage they receiced
var batFleeState = function() {
    this.step = new PVector(0,0);
};

//state 0 is wander
batWanderState.prototype.execute = function(me) {
    
    me.pursue = false;
    
    if(player[0].active === true)
    {
        if (this.wanderDist <= 0) {
            this.wanderDist = random(50, 90);
            this.angle = random(0, 2*PI);
            this.step.set( cos( this.angle), sin( this.angle ) );
            
        }
        this.wanderDist--;
        me.position.add(this.step);
        
        
        //collision detection for screen border
        
        if (me.position.x > 382) {
            me.position.x = 382;
        }
        else if (me.position.x < 20) {
            me.position.x = 20;
        }
        if (me.position.y > 1000) {
            me.position.y = 1000;
        }
        else if (me.position.y < 20) {
            me.position.y = 20;
        }
        
        //Chase
        if (dist2(me.position.x, me.position.y, player[0].position.x, player[0].position.y) < (100*100) && player[0].active === true) 
        {
            me.changeState(1);
        }
        
        // //Flee
        if(dist2(player[0].position.x, player[0].position.y, me.position.x, me.position.y) < (100*100) && player[0].hurt === true && player[0].active === true)
        {
            me.changeState(2);
        }
    }
    
};

//state 1 is chase
batChaseState.prototype.execute = function(me) {
    
    me.pursue = true;
    
    if (dist2(player[0].position.x, player[0].position.y, me.position.x, me.position.y) > (5*5) && player[0].active === true) 
    {
        this.step.set(player[0].position.x - me.position.x, player[0].position.y - me.position.y);
        this.step.normalize();
        this.step.mult(enemy2_speed);
        me.position.add(this.step);
    }
    
    if(dist2(player[0].position.x, player[0].position.y, me.position.x, me.position.y) > (5*5) && player[0].hurt === true && player[0].active === true)
    {
        me.changeState(2);
    }
    
    //Go wander
    if (dist2(me.position.x, me.position.y, player[0].position.x, player[0].position.y) > (100*100) && player[0].active === true) 
    {
        me.changeState(0);
    }
    
};

//state 2 is flee
batFleeState.prototype.execute = function(me) {
    
    
    if(dist2(player[0].position.x, player[0].position.y, me.position.x, me.position.y) < (150*150) && player[0].active === true && player[0].hurt === true)
    {
        this.step.set(me.position.x - player[0].position.x , me.position.y - player[0].position.y);
        this.step.normalize();
        this.step.mult(3);
        me.position.add(this.step);
    }
    
    else
    {
        me.changeState(1);   
    }
    
};
//////////////////////////////////////////////////////////////////////////////////////////

//The player varibale. Contains all properties belonging to the player model
var playerObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.ammo = 7; //Should display some type of ammo remaining indicator
    this.speech = "";
    this.walking = -1;
    this.health = player_health;
    this.Dir = "right"; //Facing right
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.force = new PVector(0, 0);
    this.initial_y = y;
    this.jump = 0;
    this.platform_im_on = 0;
    this.currFrameCount = 0;
    this.active = false;
    this.hurt = false; //used to tell when the player has been damaged
    this.check_platform = true;
    

};

//draws the player model
playerObj.prototype.draw = function() {
    
    //change the player's transparency based on if they have taken damage or not
    
    //draw player's body based on the state of their jump
    switch (this.jump) {
        case 0:
            
            //non jumping animations
            if(this.Dir === "right")
            {
                //legs walking animation
                strokeWeight(7);
                if(this.hurt === false)
                {
                    stroke(65, 53, 240);
                }
                else if(this.hurt === true) //Draw transparent hurt form
                {
                    stroke(65, 53, 240, 100);
                }
                
                switch(this.walking)
                {
                    //neutral stance
                    case -1:
                        
                        line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                        line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                        line(this.position.x + -11 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                        stroke(0, 0, 0);
                        break;
                    case 0:
                        
                        line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                        line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                        line(this.position.x + -11 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                        stroke(0, 0, 0);
                        break;
                    case 1:
                        
                        line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                        line(this.position.x + -8 , this.position.y+37, this.position.x+ -4, this.position.y+37);
                        stroke(0, 0, 0);
                        
                        break;
                    case 2:
                        
                        line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 7 , this.position.y+35, this.position.x+ 12, this.position.y+35);
                        line(this.position.x + -1 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                        stroke(0, 0, 0);
                        
                        break;
                    case 3:
                        
                        line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 5 , this.position.y+35, this.position.x+ 10, this.position.y+35);
                        line(this.position.x + 0 , this.position.y+37, this.position.x+ -3, this.position.y+37);
                        stroke(0, 0, 0);
                        
                        break;
                    case 4:
                        
                        line(this.position.x, this.position.y+20, this.position.x+0, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-0, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 4 , this.position.y+35, this.position.x+ 8, this.position.y+35);
                        line(this.position.x + -1 , this.position.y+37, this.position.x+ 7, this.position.y+37);
                        stroke(0, 0, 0);
                        
                        break;
                    case 5:
                        
                        line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 4 , this.position.y+35, this.position.x+ 9, this.position.y+35);
                        line(this.position.x + -4 , this.position.y+37, this.position.x+ 1, this.position.y+37);
                        stroke(0, 0, 0);
                        
                        break;
                    case 6:
                        
                        line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 6 , this.position.y+35, this.position.x+ 11, this.position.y+35);
                        line(this.position.x + -7 , this.position.y+37, this.position.x+ -3, this.position.y+37);
                        stroke(0, 0, 0);
                        
                        break;
                    case 7:
                        
                        line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                        line(this.position.x + -9 , this.position.y+37, this.position.x+ -4, this.position.y+37);
                        stroke(0, 0, 0);
                        
                        break;
                }
                strokeWeight(1);
                
                
                //Draw rest of player's body
                noStroke();
                //left arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + 15, this.position.y + 6, 17, 7);
                ellipse(this.position.x + 26, this.position.y + 6, 10, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -5, this.position.y + 3, 19, 9);
                noStroke();
                
                //head
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + 4, this.position.y + -8, 19, 22);
                noStroke();
                
                //eyes
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(255, 255, 255);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(255, 255, 255, 100);
                }
                
                ellipse(this.position.x + 1, this.position.y + -10, 5, 7);
                ellipse(this.position.x + 11, this.position.y + -10, 5, 7);
                noStroke();
                
                //pupils
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + 12, this.position.y + -10, 2, 2);
                ellipse(this.position.x + 2, this.position.y + -10, 2, 2);
                
                //nose
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(179, 170, 134);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(179, 170, 134, 100);
                }
                
                ellipse(this.position.x + 7, this.position.y + -8, 5, 4);
                noStroke();
                
                //hair
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                strokeWeight(5);
                beginShape();
                    vertex(this.position.x + -8, this.position.y + -6);
                    vertex(this.position.x + -15, this.position.y + -12);
                    vertex(this.position.x + -8, this.position.y + -15);
                    vertex(this.position.x + -5, this.position.y + -30);
                    vertex(this.position.x + 7, this.position.y + -27);
                    vertex(this.position.x + 7, this.position.y + -22);
                    vertex(this.position.x + 13, this.position.y + -20);
                    vertex(this.position.x + 17, this.position.y + -14);
                    vertex(this.position.x + 8, this.position.y + -15);
                    vertex(this.position.x + 4, this.position.y + -17);
                    vertex(this.position.x + -3, this.position.y + -15);
                    vertex(this.position.x + -5, this.position.y + -9);
                    vertex(this.position.x + -6, this.position.y + -5);
                    // vertex(this.position.x + -8, this.position.y + -6);
                
                endShape(CLOSE);
                strokeWeight(1);
                
                //ear
                if(this.hurt === false)
                {
                    fill(224, 217, 191);
                }
                else if(this.hurt === true)
                {
                    fill(224, 217, 191, 100);
                }
                
                ellipse(this.position.x + -6, this.position.y + -8, 5, 4);
                
                //mouth
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + 7, this.position.y + -1, 5, 4);
                
                
                //gun trigger
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + 25, this.position.y + -1, 7, 5);
                
                //gun ironsight
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + 36, this.position.y + -8, 2, 3);
                
                //gun underbarrel
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + 31, this.position.y + -1, 7, 2);
                
                //gun
                if(this.hurt === false)
                {
                    fill(102, 99, 99);
                }
                else if(this.hurt === true)
                {
                    fill(102, 99, 99, 100);
                }
                
                rect(this.position.x + 24, this.position.y + -5, 17, 4);
                
                //gun handle
                if(this.hurt === false)
                {
                    fill(38, 38, 38);
                }
                else if(this.hurt === true)
                {
                    fill(38, 38, 38, 100);
                }
                
                rect(this.position.x + 25, this.position.y + 4, 4, 5);
                noStroke();
                
                //right arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + 14, this.position.y + 3, 24, 7);
                ellipse(this.position.x + 27, this.position.y + 3, 9, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -5, this.position.y + 1, 12, 20);
                rect(this.position.x + -4, this.position.y + -2, 19, 10);
                noStroke();
            }
            
            else if(this.Dir === "left")
            {
                //legs walking animation
                strokeWeight(7);
                
                //Draw transparent form when hurt
                if(this.hurt === false)
                {
                    stroke(65, 53, 240);
                }
                else if(this.hurt === true)
                {
                    stroke(65, 53, 240, 100);
                }
                
                switch(this.walking)
                {
                    //neutral stance
                    case -1:
                        
                        line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                        line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 5 , this.position.y+37, this.position.x+ 11, this.position.y+37);
                        line(this.position.x + -14 , this.position.y+35, this.position.x+ -9, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 0:
                        
                        line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                        line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 5 , this.position.y+37, this.position.x+ 11, this.position.y+37);
                        line(this.position.x + -14 , this.position.y+35, this.position.x+ -9, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 1:
                        
                        line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 3 , this.position.y+37, this.position.x+ 9, this.position.y+37);
                        line(this.position.x + -13 , this.position.y+35, this.position.x+ -7, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 2:
                        
                        line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 1 , this.position.y+37, this.position.x+ 7, this.position.y+37);
                        line(this.position.x + -11 , this.position.y+35, this.position.x+ -6, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 3:
                        
                        line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + -2 , this.position.y+37, this.position.x+ 4, this.position.y+37);
                        line(this.position.x + -8 , this.position.y+35, this.position.x+ -3, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 4:
                        
                        line(this.position.x, this.position.y+20, this.position.x+0, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-0, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 0 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                        line(this.position.x + -8 , this.position.y+35, this.position.x+ -1, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 5:
                        
                        line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + -2 , this.position.y+37, this.position.x+ 4, this.position.y+37);
                        line(this.position.x + -7 , this.position.y+35, this.position.x+ -4, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 6:
                        
                        line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 2 , this.position.y+37, this.position.x+ 7, this.position.y+37);
                        line(this.position.x + -11 , this.position.y+35, this.position.x+ -6, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                    case 7:
                        
                        line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                        line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                        //shoes
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true) //Draw transparent hurt form
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 3 , this.position.y+37, this.position.x+ 8, this.position.y+37);
                        line(this.position.x + -12 , this.position.y+35, this.position.x+ -8, this.position.y+35);
                        stroke(0, 0, 0);
                        
                        break;
                }
                strokeWeight(1);
                
                //Draw rest of player's body
                noStroke();
                //left arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + -15, this.position.y + 6, 17, 7);
                ellipse(this.position.x + -26, this.position.y + 6, 10, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -15, this.position.y + 3, 19, 9);
                noStroke();
                
                //head
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + -4, this.position.y + -8, 19, 22);
                noStroke();
                
                //eyes
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(255, 255, 255);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(255, 255, 255, 100);
                }
                
                ellipse(this.position.x + -1, this.position.y + -10, 5, 7);
                ellipse(this.position.x + -11, this.position.y + -10, 5, 7);
                noStroke();
                
                //pupils
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + -12, this.position.y + -10, 2, 2);
                ellipse(this.position.x + -2, this.position.y + -10, 2, 2);
                
                //nose
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(179, 170, 134);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(179, 170, 134, 100);
                }
                
                ellipse(this.position.x + -7, this.position.y + -8, 5, 4);
                noStroke();
                
                //hair
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                strokeWeight(5);
                beginShape();
                    vertex(this.position.x + 8, this.position.y + -6);
                    vertex(this.position.x + 15, this.position.y + -12);
                    vertex(this.position.x + 8, this.position.y + -15);
                    vertex(this.position.x + 5, this.position.y + -30);
                    vertex(this.position.x + -7, this.position.y + -27);
                    vertex(this.position.x + -7, this.position.y + -22);
                    vertex(this.position.x + -13, this.position.y + -20);
                    vertex(this.position.x + -17, this.position.y + -14);
                    vertex(this.position.x + -8, this.position.y + -15);
                    vertex(this.position.x + -4, this.position.y + -17);
                    vertex(this.position.x + 3, this.position.y + -15);
                    vertex(this.position.x + 5, this.position.y + -9);
                    vertex(this.position.x + 6, this.position.y + -5);
                    // vertex(this.position.x + -8, this.position.y + -6);
                
                endShape(CLOSE);
                strokeWeight(1);
                
                //ear
                if(this.hurt === false)
                {
                    fill(224, 217, 191);
                }
                else if(this.hurt === true)
                {
                    fill(224, 217, 191, 100);
                }
                
                ellipse(this.position.x + 7, this.position.y + -8, 5, 4);
                
                //mouth
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + -7, this.position.y + -1, 5, 4);
                
                //gun trigger
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + -34, this.position.y + -1, 7, 5);
                
                //gun ironsight
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + -41, this.position.y + -8, 2, 3);
                
                //gun underbarrel
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + -39, this.position.y + -1, 7, 2);
                
                //gun
                if(this.hurt === false)
                {
                    fill(102, 99, 99);
                }
                else if(this.hurt === true)
                {
                    fill(102, 99, 99, 100);
                }
                
                rect(this.position.x + -43, this.position.y + -5, 17, 4);
                
                //gun handle
                if(this.hurt === false)
                {
                    fill(38, 38, 38);
                }
                else if(this.hurt === true)
                {
                    fill(38, 38, 38, 100);
                }
                
                rect(this.position.x + -30, this.position.y + 4, 4, 5);
                noStroke();
                
                //right arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + -14, this.position.y + 3, 24, 7);
                ellipse(this.position.x + -27, this.position.y + 3, 9, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -8, this.position.y + 1, 12, 20);
                rect(this.position.x + -16, this.position.y + -2, 19, 10);
                noStroke();
            }
            
            break;
            
        case 1:
            
            
            //jumping animations
            //legs
            if(this.Dir === "right")
            {
                noStroke();
                //left arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + 15, this.position.y + 6, 17, 7);
                ellipse(this.position.x + 26, this.position.y + 6, 10, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -5, this.position.y + 3, 19, 9);
                noStroke();
                
                //head
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + 4, this.position.y + -8, 19, 22);
                noStroke();
                
                //eyes
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(255, 255, 255);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(255, 255, 255, 100);
                }
                
                ellipse(this.position.x + 1, this.position.y + -10, 5, 7);
                ellipse(this.position.x + 11, this.position.y + -10, 5, 7);
                noStroke();
                
                //pupils
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + 12, this.position.y + -10, 2, 2);
                ellipse(this.position.x + 2, this.position.y + -10, 2, 2);
                
                //nose
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(179, 170, 134);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(179, 170, 134, 100);
                }
                
                ellipse(this.position.x + 7, this.position.y + -8, 5, 4);
                noStroke();
                
                //hair
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                strokeWeight(5);
                beginShape();
                    vertex(this.position.x + -8, this.position.y + -6);
                    vertex(this.position.x + -15, this.position.y + -12);
                    vertex(this.position.x + -8, this.position.y + -15);
                    vertex(this.position.x + -5, this.position.y + -30);
                    vertex(this.position.x + 7, this.position.y + -27);
                    vertex(this.position.x + 7, this.position.y + -22);
                    vertex(this.position.x + 13, this.position.y + -20);
                    vertex(this.position.x + 17, this.position.y + -14);
                    vertex(this.position.x + 8, this.position.y + -15);
                    vertex(this.position.x + 4, this.position.y + -17);
                    vertex(this.position.x + -3, this.position.y + -15);
                    vertex(this.position.x + -5, this.position.y + -9);
                    vertex(this.position.x + -6, this.position.y + -5);
                    // vertex(this.position.x + -8, this.position.y + -6);
                
                endShape(CLOSE);
                strokeWeight(1);
                
                //ear
                if(this.hurt === false)
                {
                    fill(224, 217, 191);
                }
                else if(this.hurt === true)
                {
                    fill(224, 217, 191, 100);
                }
                
                ellipse(this.position.x + -6, this.position.y + -8, 5, 4);
                
                //mouth
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + 7, this.position.y + -1, 5, 4);
                
                //gun trigger
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + 25, this.position.y + -1, 7, 5);
                
                //gun ironsight
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + 36, this.position.y + -8, 2, 3);
                
                //gun underbarrel
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + 31, this.position.y + -1, 7, 2);
                
                //gun
                if(this.hurt === false)
                {
                    fill(102, 99, 99);
                }
                else if(this.hurt === true)
                {
                    fill(102, 99, 99, 100);
                }
                
                rect(this.position.x + 24, this.position.y + -5, 17, 4);
                
                //gun handle
                if(this.hurt === false)
                {
                    fill(38, 38, 38);
                }
                else if(this.hurt === true)
                {
                    fill(38, 38, 38, 100);
                }
                rect(this.position.x + 25, this.position.y + 4, 4, 5);
                noStroke();
                
                //right arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + 14, this.position.y + 3, 24, 7);
                ellipse(this.position.x + 27, this.position.y + 3, 9, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -5, this.position.y + 1, 12, 20);
                rect(this.position.x + -4, this.position.y + -2, 19, 10);
                noStroke();
                
                
                strokeWeight(7);
                
                if(this.hurt === false)
                {
                    stroke(65, 53, 240);
                }
                else if(this.hurt === true)
                {
                    stroke(65, 53, 240, 100);
                }
                        //right leg
                        line(this.position.x + 0, this.position.y+20, this.position.x+9, this.position.y+16);
                        line(this.position.x + 11, this.position.y+18, this.position.x+8, this.position.y+27);
                        //left leg
                        line(this.position.x + 0, this.position.y+20, this.position.x+-4, this.position.y+39);
                        //shoes
                        //right foot
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true)
                        {
                            stroke(128, 72, 4, 100);
                        }
                        line(this.position.x + 7 , this.position.y+31, this.position.x+ 11, this.position.y+33);
                        //left foot
                        line(this.position.x + -5 , this.position.y+40, this.position.x+ -3, this.position.y+47);
                        //reset everything for other draw functions
                        stroke(0, 0, 0);
                        strokeWeight(1);
                
                
            }
            
            else if(this.Dir === "left")
            {
                noStroke();
                //left arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + -15, this.position.y + 6, 17, 7);
                ellipse(this.position.x + -26, this.position.y + 6, 10, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -15, this.position.y + 3, 19, 9);
                noStroke();
                
                //head
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + -4, this.position.y + -8, 19, 22);
                noStroke();
                
                //eyes
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(255, 255, 255);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(255, 255, 255, 100);
                }
                
                ellipse(this.position.x + -1, this.position.y + -10, 5, 7);
                ellipse(this.position.x + -11, this.position.y + -10, 5, 7);
                noStroke();
                
                //pupils
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + -12, this.position.y + -10, 2, 2);
                ellipse(this.position.x + -2, this.position.y + -10, 2, 2);
                
                //nose
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(179, 170, 134);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(179, 170, 134, 100);
                }
                
                ellipse(this.position.x + -7, this.position.y + -8, 5, 4);
                noStroke();
                
                //hair
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                strokeWeight(5);
                beginShape();
                    vertex(this.position.x + 8, this.position.y + -6);
                    vertex(this.position.x + 15, this.position.y + -12);
                    vertex(this.position.x + 8, this.position.y + -15);
                    vertex(this.position.x + 5, this.position.y + -30);
                    vertex(this.position.x + -7, this.position.y + -27);
                    vertex(this.position.x + -7, this.position.y + -22);
                    vertex(this.position.x + -13, this.position.y + -20);
                    vertex(this.position.x + -17, this.position.y + -14);
                    vertex(this.position.x + -8, this.position.y + -15);
                    vertex(this.position.x + -4, this.position.y + -17);
                    vertex(this.position.x + 3, this.position.y + -15);
                    vertex(this.position.x + 5, this.position.y + -9);
                    vertex(this.position.x + 6, this.position.y + -5);
                    // vertex(this.position.x + -8, this.position.y + -6);
                
                endShape(CLOSE);
                strokeWeight(1);
                
                //ear
                if(this.hurt === false)
                {
                    fill(224, 217, 191);
                }
                else if(this.hurt === true)
                {
                    fill(224, 217, 191, 100);
                }
                ellipse(this.position.x + 7, this.position.y + -8, 5, 4);
                
                //mouth
                if(this.hurt === false)
                {
                    fill(0, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(0, 0, 0, 100);
                }
                
                ellipse(this.position.x + -7, this.position.y + -1, 5, 4);
                
                //gun trigger
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    stroke(0, 0, 0, 100);
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + -34, this.position.y + -1, 7, 5);
                
                //gun ironsight
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + -41, this.position.y + -8, 2, 3);
                
                //gun underbarrel
                if(this.hurt === false)
                {
                    fill(82, 81, 81);
                }
                else if(this.hurt === true)
                {
                    fill(82, 81, 81, 100);
                }
                
                rect(this.position.x + -39, this.position.y + -1, 7, 2);
                
                //gun
                if(this.hurt === false)
                {
                    fill(102, 99, 99);
                }
                else if(this.hurt === true)
                {
                    fill(102, 99, 99, 100);
                }
                
                rect(this.position.x + -43, this.position.y + -5, 17, 4);
                
                //gun handle
                if(this.hurt === false)
                {
                    fill(38, 38, 38);
                }
                else if(this.hurt === true)
                {
                    fill(38, 38, 38, 100);
                }
                
                rect(this.position.x + -30, this.position.y + 4, 4, 5);
                noStroke();
                
                //right arm
                if(this.hurt === false)
                {
                    stroke(0, 0, 0);
                    fill(212, 204, 170);
                }
                else if(this.hurt === false)
                {
                    stroke(0, 0, 0, 100);
                    fill(212, 204, 170, 100);
                }
                
                ellipse(this.position.x + -14, this.position.y + 3, 24, 7);
                ellipse(this.position.x + -27, this.position.y + 3, 9, 7);
                
                if(this.hurt === false)
                {
                    fill(255, 0, 0);
                }
                else if(this.hurt === true)
                {
                    fill(255, 0, 0, 100);
                }
                
                rect(this.position.x + -8, this.position.y + 1, 12, 20);
                rect(this.position.x + -16, this.position.y + -2, 19, 10);
                noStroke();
                
                strokeWeight(7);
                
                if(this.hurt === false)
                {
                    stroke(65, 53, 240);
                }
                else if(this.hurt === true)
                {
                    stroke(65, 53, 240, 100);
                }
                
                        //right leg
                        line(this.position.x + 0, this.position.y+20, this.position.x+5, this.position.y+35);
                        //left leg
                        line(this.position.x + 0, this.position.y+20, this.position.x-10, this.position.y+16);
                        line(this.position.x + -10, this.position.y+20, this.position.x-10, this.position.y+23);
                        //shoes
                        //right foot
                        if(this.hurt === false)
                        {
                            stroke(128, 72, 4);
                        }
                        else if(this.hurt === true)
                        {
                            stroke(128, 72, 4, 100);
                        }
                        
                        line(this.position.x + 4 , this.position.y+42, this.position.x+ 5, this.position.y+37);
                        //left foot
                        line(this.position.x + -14 , this.position.y+29, this.position.x+ -9, this.position.y+26);
                        stroke(0, 0, 0);
                        strokeWeight(1);
            }
            
            
    
            break;
    }
        
    //Reset stroke and weight values to avoid affecting proceeding drawings.
    strokeWeight(1);
    stroke(0, 0, 0);
};

//used to check the collisions between the player, collectables, and enemies
playerObj.prototype.checkCollision = function() {
    
    //collision with antidotes
    for (var i=0; i < antidotes.length; i++) 
    {
        if ( (dist2(this.position.x, this.position.y, antidotes[i].x, antidotes[i].y) < (27*27) ) && antidotes[i].collected === false ) 
        {
           antidotes[i].collected = true;
           collected_signal = true;
           this.speech = "I'm going to need this!";
           start_timer = true;
           signal_timer = frameCount;
           score++;
           
        }
            
    }
    
    //collision with guns box
    for (var i=0; i < guns.length; i++) 
    {
        if ( (dist2(this.position.x, this.position.y, guns[i].x, guns[i].y) < (27*27) ) && guns[i].collected === false ) 
        {
           guns[i].collected = true;
           collected_signal = true;
           this.speech = "Lock and Loaded!";
           start_timer = true;
           signal_timer = frameCount;
           this.ammo += 7;
           
        }
            
    }
    
    //collision with bat
    for (var i=0; i < enemies2.length; i++) 
    {
        if ( (dist2(this.position.x, this.position.y, enemies2[i].position.x, enemies2[i].position.y) < (20*20) ) && player[0].hurt === false && enemies2[i].dead === false) 
        {
            this.speech = "Ouch!";
            start_timer = true;
            signal_timer = frameCount;
           
            hurt_timer = frameCount;
            start_hurt_timer = true;
            this.hurt = true;
            
            //deduct health
            if(this.health > 0)
            {
                this.health--;
            }
            
            //You died for the last time. Game over
            if(this.health === 0)
            {
                gameState = "gameOverScreen";
                gameStart = false;
            }
            
        }
        
        
            
    }
    
    //collision with zombie
    for (var i=0; i < enemies1.length; i++) 
    {
        if ( (dist2(this.position.x, this.position.y, enemies1[i].position.x, enemies1[i].position.y) < (20*20) ) && player[0].hurt === false && enemies1[i].dead === false) 
        {
            this.speech = "Ouch!";
            start_timer = true;
            signal_timer = frameCount;
           
            hurt_timer = frameCount;
            start_hurt_timer = true;
            this.hurt = true;
            
            //deduct health
            if(this.health > 0)
            {
                this.health--;
            }
            
            //You died for the last time. Game over
            if(this.health === 0)
            {
                gameState = "gameOverScreen";
                gameStart = false;
            }
        }
        
        
            
    }
    
    //collide with the bottom of the screen
    if(this.position.y > 1200)
    {
        gameState = "gameOverScreen";
        gameStart = false;
    }
    
};

//used to apply the physics used in the game (jumping or falling)
playerObj.prototype.applyForce = function(force) {
    this.acceleration.add(force);
};

//This function controls the player's movements
playerObj.prototype.move = function() {
    
    //calculate distances to nearest platforms if possible
    var near_platform = false;

    if(collected_signal === true || this.hurt === true) //If we have collected a item why not show it?? Cheers!!! Or sadly we've been wounded
    {
        fill(245, 52, 84);
        textSize(15);
        text(this.speech, this.position.x + 8, this.position.y + -30);
    }
    
    
    // fill(0, 0, 0);
    // textSize(15);
    // text("y: ", this.position.x + 57, this.position.y + 14);
    // text(this.position.y, this.position.x + 70, this.position.y + 15);
    
    // text("x: ", this.position.x + 57, this.position.y + 0);
    // text(this.position.x, this.position.x + 70, this.position.y + 0);
    
    //based on the setting selected in the options menu, the player will either use wasd or the arrow keys to control movement.
    if(useArrowKeys === true)
    {
        //Left, right, and up controls
        //D
        if (keyArray[LEFT] === 1 && this.position.x > 6) {
            
            this.Dir = "left";
            this.position.x -= player_speed;
            //slow down the walking animation a bit
            if (this.currFrameCount < (frameCount - 2)) {
                this.currFrameCount = frameCount;
                this.walking++;
            }
            //decide if platform will randomly fall
            if(difficultyMode === 1) //if mode is easy
            {
                platforms[this.platform_im_on].fall = round(random(0, 101));
            }
            else if(difficultyMode === 2) //if mode is normal
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
            else if(difficultyMode === 3) //if mode is hard
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
            
        }
        
        //A
        if (keyArray[RIGHT] === 1 && this.position.x < 390) {
            this.Dir = "right";
            this.position.x += player_speed;
            if (this.currFrameCount < (frameCount - 2)) {
                this.currFrameCount = frameCount;
                this.walking++;
            }
            //decide if platform will randomly fall
            if(difficultyMode === 1) //if mode is easy
            {
                platforms[this.platform_im_on].fall = round(random(0, 101));
            }
            else if(difficultyMode === 2) //if mode is normal
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
            else if(difficultyMode === 3)// if mode is hard
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
        }
        
        //W
        if (keyArray[UP] === 1 && this.jump === 0) {
            // //change to jump state and since we've jumped we also need to keep checking if we landed on a platform or not
            
            this.jump = 2;
            this.walking = -1;
            //this.active = true;
            this.check_platform = true; //we will continue to check for a platform
        }
        
        //I'm headed to the left
        if(this.Dir === "left")
        {
            //for every possible platform to the left of me, check to see if there is one very close to me (not requiring me to jump to it)
            for(var i = 0; i < this.platform_im_on + 1; i++)
            {
                
                if( dist(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < 50 && platforms[this.platform_im_on].y === platforms[i].y)
                {
                    near_platform = true;
                    next_platform = i;
                }
            }
        }
        
        //I'm headed to the right
        if(this.Dir === "right")
        {
            //for every possible platform to the left of me, check to see if there is one very close to me (not requiring me to jump to it)
            for(var i = this.platform_im_on; i < platforms.length; i++)
            {
                
                if( dist(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < 50 && platforms[this.platform_im_on].y === platforms[i].y)
                {
                    near_platform = true;
                    next_platform = i;
                }
            }
        }
        
        //if there was platform near within walking distance then I should fall
        if(near_platform === false)
        {
            this.jump = 1;
            this.walking = -1;
            this.check_platform = true;
        }
        
        //If there is a platform near me in the direction I am headed then we set the current platform I'm going to be on
        if(near_platform === true )
        {
            this.platform_im_on = next_platform;
        }
    
    }
    
    else if(useArrowKeys === false)
    {
        //A, D, and W controls
        //D
        if (keyArray[65] === 1 && this.position.x > 6) {
            
            this.Dir = "left";
            this.position.x -= player_speed;
            if (this.currFrameCount < (frameCount - 2)) {
                this.currFrameCount = frameCount;
                this.walking++;
            }
            //decide if platform will randomly fall
            if(difficultyMode === 1) //if mode is easy
            {
                platforms[this.platform_im_on].fall = round(random(0, 101));
            }
            else if(difficultyMode === 2) //if mode is normal
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
            else if(difficultyMode === 3) //if mode is hard
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
            
        }
        //A
        if (keyArray[68] === 1 && this.position.x < 390) {
            this.Dir = "right";
            this.position.x += player_speed;
            //slow down the walking animation a bit
            if (this.currFrameCount < (frameCount - 2)) {
                this.currFrameCount = frameCount;
                this.walking++;
            }
            //decide if platform will randomly fall
            if(difficultyMode === 1) //if mode is easy
            {
                platforms[this.platform_im_on].fall = round(random(0, 101));
            }
            else if(difficultyMode === 2) //if mode is normal
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
            else if(difficultyMode === 3) //if mode is hard
            {
                platforms[this.platform_im_on].fall = round(random(0, 51));
            }
        }
        
        //W
        if (keyArray[87] === 1 && this.jump === 0) {
            // //change to jump state and since we've jumped we also need to keep checking if we landed on a platform or not
            
            this.jump = 2;
            this.walking = -1;
            //this.active = true;
            this.check_platform = true;
        }
        
        
        //I'm headed to the left
        if(this.Dir === "left")
        {
            for(var i = 0; i < this.platform_im_on + 1; i++)
            {
                //for every possible platform to the left of me, check to see if there is one very close to me (not requiring me to jump to it)
                if( dist(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < 50 && platforms[this.platform_im_on].y === platforms[i].y)
                {
                    near_platform = true;
                    next_platform = i;
                }
            }
        }
        
        //I'm headed to the right
        if(this.Dir === "right")
        {
            for(var i = this.platform_im_on; i < platforms.length; i++)
            {
                //for every possible platform to the right of me, check to see if there is one very close to me (not requiring me to jump to it)
                if( dist(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < 50 && platforms[this.platform_im_on].y === platforms[i].y)
                {
                    near_platform = true;
                    next_platform = i;
                }
            }
        }
        
        //if there was platform near within walking distance then I should fall
        if( near_platform === false)
        {
            this.jump = 1;
            this.walking = -1;
            this.check_platform = true;
        }
        
        //If there is a platform near me in the direction I am headed then we set the current platform I'm going to be on
        if(near_platform === true )
        {
            this.platform_im_on = next_platform;
        }
    }
    
    //we reset the walking animation for the player if we've reached the end of it
    if(this.walking > 7)
    {
        this.walking = -1;
    }
        

};

//This fucntion is used to control the animation on the instructions screen for this level
playerObj.prototype.animate = function() {
    
    var near_platform = false;

    if(collected_signal === true) //If we have collected an item why not show it?? Cheers!!!
    {
        fill(245, 52, 84);
        textSize(15);
        text(this.speech, this.position.x + 4, this.position.y + -38);
    }
    
    this.Dir = "right";
    this.active = true;
    
    if (this.currFrameCount < (frameCount - 2)) {
        this.currFrameCount = frameCount;
        this.walking++;
    }
    
    this.position.x += player_speed*0.5;
    
    //I'm headed to the left
        if(this.Dir === "left")
        {
            for(var i = 0; i < this.platform_im_on + 1; i++)
            {
                
                if( dist(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < 50 && platforms[this.platform_im_on].y === platforms[i].y)
                {
                    near_platform = true;
                    next_platform = i;
                }
            }
        }
        
        //I'm headed to the right
        if(this.Dir === "right")
        {
            for(var i = this.platform_im_on; i < platforms.length; i++)
            {
                
                if( dist(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < 50 && platforms[this.platform_im_on].y === platforms[i].y)
                {
                    near_platform = true;
                    next_platform = i;
                }
            }
        }
        
        if( /*(this.position.x > platforms[this.platform_im_on].x + 20) || (this.position.x < platforms[this.platform_im_on].x - 20) &&*/ near_platform === false)
        {
            this.jump = 1;
            this.walking = -1;
            this.check_platform = true;
        }
        
        if(near_platform === true )
        {
            this.platform_im_on = next_platform;
        }
    
    
    if(this.walking > 7)
    {
        this.walking = -1;
    }
};

//This function is used to control the physics of the player model and trigger platform checking. When a platform is checked it will also caclculate whether that platform will fall or not
playerObj.prototype.update = function() {
    if(this.active === true)
    {
        this.acceleration.set(0, 0);
        if (this.jump === 2) {
            this.applyForce(jumpForce);
            this.jump = 1;
        }
        if (this.jump > 0) {
            this.applyForce(gravity);
        }
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
    
        //check if collide with platform, if not then keep falling
        for (var i=0; i < platforms.length; i++) 
        {
            if(this.check_platform === true && platforms[i].active === true)
            {
                if ( dist2(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < (29*29) )      
                {
                    
                    if(this.position.y < platforms[i].y - 20)
                    {
                        this.initial_y = platforms[i].y - 40;
                        this.platform_im_on = i;
                        
                        if (this.position.y >= this.initial_y - 0.01 ) 
                        {
                            this.position.y = this.initial_y;
                            this.velocity.y = 0;
                            this.jump = 0;
                            //decide if platform will randomly fall
                            platforms[i].fall = round(random(0, 1));

                            this.check_platform = false;
                        }
                    }
                }
            }
            
            else if(this.check_platform === false)
            {
                
                if(this.jump === 0)
                {
                    this.position.y = platforms[this.platform_im_on].y - 40;
                    this.initial_y = platforms[this.platform_im_on].y - 40;
                    //player[0].position.y++;
                    //player[0].initial_y++;
                }
                
                if(platforms[this.platform_im_on].active === false)
                {
                    this.jump = 1;
                    this.check_platform = true;
                }
    
            }
        }
    }   
};

//variable that holds all the properites of the gun crates in the game
var gunObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.currFrameCount = 0;
    this.gun_movement = 1;
    this.collected = false;
};

//this function draws the gun crates
gunObj.prototype.draw = function() {
    //Draw gun item icon
    //collecting gun box increases your gun mode by 10 counts,
    //each shot in gun mode decreases your akimbo mode counter.
    
    //gun box creation
    
    fill(143, 118, 19);
    //body of crate
    rect(this.x + -17,  this.y + 2, 33, 12);
    //base
    rect(this.x + -16, this.y + -10, 32, 20);
    //Bars
    rect(this.x + -2,  this.y + -7, 5, 17);
    rect(this.x + -12,  this.y + -7, 5, 17);
    rect(this.x + 9,  this.y + -7, 5, 17);
    //lid
    rect(this.x + -18, this.y + -11, 36, 4);
    
    //Label
    fill(0, 0, 0);
    ellipse(this.x + 0.5, this.y + 2, 28, 9);
    fill(255, 255, 255);
    textSize(8);
    text("GUNS",this.x + -11, this.y + 5);
    
    //fill(255, 0, 217);
    //ellipse(this.x, this.y, 3,3);
};

//this function creates a floating animation for the gun crates
gunObj.prototype.float = function() {
    
    if(this.collected === false)
    {
      if (this.currFrameCount < (frameCount - 14)) {
                this.currFrameCount = frameCount;
                
                if(this.gun_movement === 1)
                {
                    this.gun_movement = -1;
                    this.y += 2;
                }
                
                else if(this.gun_movement === -1)
                {
                    this.gun_movement = 1;
                    this.y -= 2;
                }
       }
    }
};

//this variable holds all properites for the platforms the player and zombies stand on in the game
var platformObj = function(x, y) {
  this.x = x;
  this.y = y;
  this.fall = 0;
  this.falling = false;
  this.active = true;
  this.currFrameCount = 0;
};

//this function draws the platforms
platformObj.prototype.draw = function() {
    //Draw the platform
    noStroke();
    //stroke(0, 0, 0);
    fill(41, 32, 26);
    rect(this.x - 20, this.y - 5, 40, 10, 0);
    fill(163, 116, 83);
    rect(this.x - 20, this.y - 8, 40, 10, 0);
    stroke(0, 0, 0);
    
    //center point
    // fill(255, 255, 255);
    // ellipse(this.x + 0, this.y + 0, 3, 3);
    
};

//This function controls the movement speed the platforms that have been toggled to fall
platformObj.prototype.move = function() {
    
    //If this platform has been toggled to fall and it's not already falling, then we should set it to fall
    if(this.active === true && this.fall === 1 && this.falling === false)
    {
        this.falling = true;
    }
    
    //If a platform is currently falling then we should make the platform fall down at a rate based on the difficulty selected for the game
    if(this.falling === true && this.y >= 0 && this.y <= 900)
    {
        if (this.currFrameCount < (frameCount - fall_speed)) 
        {
            this.currFrameCount = frameCount;
            this.y += 2;
        }
    }
    
    //if this platform has exited the game bounds then don't use it anymore
    else if(this.y > 900)
    {
        this.active = false;
    }
};

//this variable holds the properties of the zombie enemy 
var enemy1Obj = function(x, y) {
    this.x = x;
    this.y = y;
    this.position = new PVector(x, y);
    this.speed = enemy1_speed;
    this.health = enemy1_health;
    this.dead = false;
    
    this.walking = -1;
    this.Dir = "right"; //Facing right
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.force = new PVector(0, 0);
    this.initial_y = y;
    this.jump = 0;
    this.platform_im_on = 0;
    this.currFrameCount = 0;
    this.active = false;
    this.check_platform = true;
    
};

//this function draws the zombies with walking animation
enemy1Obj.prototype.draw = function() {
    
    //draw zombie's body based on the state of their jump
    //non jumping animations
    if(this.Dir === "right")
    {
        //legs walking animation
        strokeWeight(7);
        stroke(87, 51, 19);
        switch(this.walking)
        {
            //neutral stance
            case -1:
                
                line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                line(this.position.x + -11 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                stroke(0, 0, 0);
                break;
            case 0:
                
                line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                line(this.position.x + -11 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                stroke(0, 0, 0);
                break;
            case 1:
                
                line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                line(this.position.x + -8 , this.position.y+37, this.position.x+ -4, this.position.y+37);
                stroke(0, 0, 0);
                
                break;
            case 2:
                
                line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 7 , this.position.y+35, this.position.x+ 12, this.position.y+35);
                line(this.position.x + -1 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                stroke(0, 0, 0);
                
                break;
            case 3:
                
                line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 5 , this.position.y+35, this.position.x+ 10, this.position.y+35);
                line(this.position.x + 0 , this.position.y+37, this.position.x+ -3, this.position.y+37);
                stroke(0, 0, 0);
                
                break;
            case 4:
                
                line(this.position.x, this.position.y+20, this.position.x+0, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-0, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 4 , this.position.y+35, this.position.x+ 8, this.position.y+35);
                line(this.position.x + -1 , this.position.y+37, this.position.x+ 7, this.position.y+37);
                stroke(0, 0, 0);
                
                break;
            case 5:
                
                line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 4 , this.position.y+35, this.position.x+ 9, this.position.y+35);
                line(this.position.x + -4 , this.position.y+37, this.position.x+ 1, this.position.y+37);
                stroke(0, 0, 0);
                
                break;
            case 6:
                
                line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 6 , this.position.y+35, this.position.x+ 11, this.position.y+35);
                line(this.position.x + -7 , this.position.y+37, this.position.x+ -3, this.position.y+37);
                stroke(0, 0, 0);
                
                break;
            case 7:
                
                line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 8 , this.position.y+35, this.position.x+ 13, this.position.y+35);
                line(this.position.x + -9 , this.position.y+37, this.position.x+ -4, this.position.y+37);
                stroke(0, 0, 0);
                
                break;
        }
        strokeWeight(1);
        stroke(0, 0, 0);
        
        //Draw rest of zombie's body
        noStroke();
        //left arm
        stroke(0, 0, 0);
        fill(12, 128, 19);
        ellipse(this.position.x + 15, this.position.y + 6, 17, 7);
        ellipse(this.position.x + 26, this.position.y + 6, 10, 7);
        
        fill(0, 255, 255);
        rect(this.position.x + -5, this.position.y + 3, 19, 9);
        noStroke();
        
        //head
        stroke(0, 0, 0);
        fill(12, 128, 19);
        ellipse(this.position.x + 4, this.position.y + -8, 19, 22);
        noStroke();
        
        //eyes
        stroke(0, 0, 0);
        fill(255, 255, 255);
        ellipse(this.position.x + 1, this.position.y + -10, 5, 7);
        ellipse(this.position.x + 11, this.position.y + -10, 5, 7);
        noStroke();
        
        // // no pupils
        // fill(0, 0, 0);
        // ellipse(this.position.x + 12, this.position.y + -10, 2, 2);
        // ellipse(this.position.x + 2, this.position.y + -10, 2, 2);
        
        //nose
        stroke(0, 0, 0);
        fill(10, 105, 15);
        ellipse(this.position.x + 7, this.position.y + -8, 5, 4);
        noStroke();
        
        //hair
        fill(0, 0, 0);
        strokeWeight(5);
        beginShape();
            vertex(this.position.x + -8, this.position.y + -6);
            vertex(this.position.x + -4, this.position.y + -13);
            vertex(this.position.x + -6, this.position.y + -14);
            vertex(this.position.x + 2, this.position.y + -19);
            vertex(this.position.x + 7, this.position.y + -18);
        
        endShape(CLOSE);
        strokeWeight(1);
        
        //ear
        fill(12, 128, 19);
        ellipse(this.position.x + -6, this.position.y + -8, 5, 4);
        
        //mouth
        fill(0, 0, 0);
        ellipse(this.position.x + 7, this.position.y + -2, 5, 6);
        
        
        //right arm
        stroke(0, 0, 0);
        fill(12, 128, 19);
        ellipse(this.position.x + 14, this.position.y + 3, 24, 7);
        ellipse(this.position.x + 27, this.position.y + 3, 9, 7);
        
        fill(0, 255, 255);
        rect(this.position.x + -5, this.position.y + 1, 12, 20);
        rect(this.position.x + -4, this.position.y + -2, 19, 10);
        noStroke();
    }
    
    else if(this.Dir === "left")
    {
        //legs walking animation
        strokeWeight(7);
        stroke(87, 51, 19);
        switch(this.walking)
        {
            //neutral stance
            case -1:
                
                line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 5 , this.position.y+37, this.position.x+ 11, this.position.y+37);
                line(this.position.x + -14 , this.position.y+35, this.position.x+ -9, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 0:
                
                line(this.position.x, this.position.y+20, this.position.x+10, this.position.y+35);  // legs
                line(this.position.x, this.position.y+20, this.position.x-10, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 5 , this.position.y+37, this.position.x+ 11, this.position.y+37);
                line(this.position.x + -14 , this.position.y+35, this.position.x+ -9, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 1:
                
                line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 3 , this.position.y+37, this.position.x+ 9, this.position.y+37);
                line(this.position.x + -13 , this.position.y+35, this.position.x+ -7, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 2:
                
                line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 1 , this.position.y+37, this.position.x+ 7, this.position.y+37);
                line(this.position.x + -11 , this.position.y+35, this.position.x+ -6, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 3:
                
                line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + -2 , this.position.y+37, this.position.x+ 4, this.position.y+37);
                line(this.position.x + -8 , this.position.y+35, this.position.x+ -3, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 4:
                
                line(this.position.x, this.position.y+20, this.position.x+0, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-0, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 0 , this.position.y+37, this.position.x+ -6, this.position.y+37);
                line(this.position.x + -8 , this.position.y+35, this.position.x+ -1, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 5:
                
                line(this.position.x, this.position.y+20, this.position.x+3, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-3, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + -2 , this.position.y+37, this.position.x+ 4, this.position.y+37);
                line(this.position.x + -7 , this.position.y+35, this.position.x+ -4, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 6:
                
                line(this.position.x, this.position.y+20, this.position.x+6, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-6, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 2 , this.position.y+37, this.position.x+ 7, this.position.y+37);
                line(this.position.x + -11 , this.position.y+35, this.position.x+ -6, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
            case 7:
                
                line(this.position.x, this.position.y+20, this.position.x+8, this.position.y+35);
                line(this.position.x, this.position.y+20, this.position.x-8, this.position.y+35);
                //shoes
                stroke(12, 128, 19);
                line(this.position.x + 3 , this.position.y+37, this.position.x+ 8, this.position.y+37);
                line(this.position.x + -12 , this.position.y+35, this.position.x+ -8, this.position.y+35);
                stroke(0, 0, 0);
                
                break;
        }
        strokeWeight(1);
        stroke(0, 0, 0);
        
        //Draw rest of zombie's body
        noStroke();
        //left arm
        stroke(0, 0, 0);
        fill(12, 128, 19);
        ellipse(this.position.x + -15, this.position.y + 6, 17, 7);
        ellipse(this.position.x + -26, this.position.y + 6, 10, 7);
        
        fill(0, 255, 255);
        rect(this.position.x + -15, this.position.y + 3, 19, 9);
        noStroke();
        
        //head
        stroke(0, 0, 0);
        fill(12, 128, 19);
        ellipse(this.position.x + -4, this.position.y + -8, 19, 22);
        noStroke();
        
        //eyes
        stroke(0, 0, 0);
        fill(255, 255, 255);
        ellipse(this.position.x + -1, this.position.y + -10, 5, 7);
        ellipse(this.position.x + -11, this.position.y + -10, 5, 7);
        noStroke();
        
        // //No pupils
        // fill(0, 0, 0);
        // ellipse(this.position.x + -12, this.position.y + -10, 2, 2);
        // ellipse(this.position.x + -2, this.position.y + -10, 2, 2);
        
        //nose
        stroke(0, 0, 0);
        fill(10, 105, 15);
        ellipse(this.position.x + -7, this.position.y + -8, 5, 4);
        noStroke();
        
        //hair
        fill(0, 0, 0);
        strokeWeight(5);
        beginShape();
            vertex(this.position.x + 8, this.position.y + -6);
            vertex(this.position.x + 4, this.position.y + -13);
            vertex(this.position.x + 6, this.position.y + -14);
            vertex(this.position.x + -2, this.position.y + -19);
            vertex(this.position.x + -7, this.position.y + -18);
        
        endShape(CLOSE);
        strokeWeight(1);
        
        //ear
        fill(12, 128, 19);
        ellipse(this.position.x + 7, this.position.y + -8, 5, 4);
        
        //mouth
        fill(0, 0, 0);
        ellipse(this.position.x + -7, this.position.y + -2, 5, 6);
        
        
        //right arm
        stroke(0, 0, 0);
        fill(12, 128, 19);
        ellipse(this.position.x + -14, this.position.y + 3, 24, 7);
        ellipse(this.position.x + -27, this.position.y + 3, 9, 7);
        
        fill(0, 255, 255);
        rect(this.position.x + -8, this.position.y + 1, 12, 20);
        rect(this.position.x + -16, this.position.y + -2, 19, 10);
        noStroke();
    }
            
        
        
     
    //Reset everything
    strokeWeight(1);
    stroke(0, 0, 0);
};

//this function applies the physic forces on the zombies
enemy1Obj.prototype.applyForce = function(force) {
    this.acceleration.add(force);
};

//this function allows the zombies to have physics applied to them as well (mainly for just falling off platforms)
enemy1Obj.prototype.update = function() {
    if(player[0].active === true)
    {
        this.acceleration.set(0, 0);
        if (this.jump === 2) {
            this.applyForce(jumpForce);
            this.jump = 1;
        }
        if (this.jump > 0) {
            this.applyForce(gravity);
        }
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
    
        //check if collide with platform, if not then keep falling
        for (var i=0; i < platforms.length; i++) 
        {
            if(this.check_platform === true && platforms[i].active === true)
            {
                if ( dist2(this.position.x, this.position.y, platforms[i].x, platforms[i].y) < (29*29) )      
                {
                    
                    if(this.position.y < platforms[i].y - 20)
                    {
                        this.initial_y = platforms[i].y - 40;
                        this.platform_im_on = i;
                        
                        if (this.position.y >= this.initial_y - 0.01 ) 
                        {
                            this.position.y = this.initial_y;
                            this.velocity.y = 0;
                            this.jump = 0;

                            this.check_platform = false;
                        }
                    }
                }
            }
            
            else if(this.check_platform === false)
            {
                
                if(this.jump === 0)
                {
                    this.position.y = platforms[this.platform_im_on].y - 40;
                    this.initial_y = platforms[this.platform_im_on].y - 40;
                    //player[0].position.y++;
                    //player[0].initial_y++;
                }
                
                if(platforms[this.platform_im_on].active === false)
                {
                    this.jump = 1;
                    this.check_platform = true;
                }
    
            }
        }
    }   
};

//this function just makes the zombie count as dead if they fall beyond the game's lower boundary
enemy1Obj.prototype.checkCollision = function() {
    
    //collide with the bottom of the screen
    if(this.position.y > 1200)
    {
        this.dead = true;
    }
};

//This function makes each zombie move only in a specified area. So the zombies will always move the same way in the same place 
var zombieMovement = function() {
    //code similar to how the playerObj's animate function is done
    if(player[0].active === true)
    {
        if(enemies1[0] ) //Movements specific to only this enemy
        {
            var near_platform = false;
            
            enemies1[0].position.x += enemies1[0].speed;
            
            if(enemies1[0].currFrameCount < (frameCount - 2)) 
            {
                enemies1[0].currFrameCount = frameCount;
                enemies1[0].walking++;
            }
            
            if(enemies1[0].position.x > 380)
            {
                enemies1[0].Dir = "left";
                enemies1[0].speed = -enemies1[0].speed;
            }
            
            else if(enemies1[0].position.x < 115)
            {
                enemies1[0].Dir = "right";
                enemies1[0].speed = -enemies1[0].speed;
            }
            
            //zombie 1 headed to the left
            if(enemies1[0].Dir === "left")
            {
                for(var i = 0; i < enemies1[0].platform_im_on + 1; i++)
                {
                    
                    if( dist(enemies1[0].position.x, enemies1[0].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[0].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            //zombie 1 headed to the right
            if(enemies1[0].Dir === "right")
            {
                for(var i = enemies1[0].platform_im_on; i < platforms.length; i++)
                {
                    
                    if( dist(enemies1[0].position.x, enemies1[0].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[0].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            if( near_platform === false)
            {
                enemies1[0].jump = 1;
                enemies1[0].walking = -1;
                enemies1[0].check_platform = true;
            }
            
            if(near_platform === true )
            {
                enemies1[0].platform_im_on = next_platform;
            }
            
            if(enemies1[0].walking > 7)
            {
                enemies1[0].walking = -1;
            }
        }
        
        if(enemies1[1] ) //Ditto as with the first if statement
        {
            var near_platform = false;
            
            enemies1[1].position.x += enemies1[1].speed;
            
            if(enemies1[1].currFrameCount < (frameCount - 2)) 
            {
                enemies1[1].currFrameCount = frameCount;
                enemies1[1].walking++;
            }
            
            if(enemies1[1].position.x > 380)
            {
                enemies1[1].Dir = "left";
                enemies1[1].speed = -enemies1[1].speed;
            }
            
            else if(enemies1[1].position.x < 115)
            {
                enemies1[1].Dir = "right";
                enemies1[1].speed = -enemies1[1].speed;
            }
            
            //zombie 2 headed to the left
            if(enemies1[1].Dir === "left")
            {
                for(var i = 0; i < enemies1[1].platform_im_on + 1; i++)
                {
                    
                    if( dist(enemies1[1].position.x, enemies1[1].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[1].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            //zombie 2 headed to the right
            if(enemies1[1].Dir === "right")
            {
                for(var i = enemies1[1].platform_im_on; i < platforms.length; i++)
                {
                    
                    if( dist(enemies1[1].position.x, enemies1[1].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[1].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            if( near_platform === false)
            {
                enemies1[1].jump = 1;
                enemies1[1].walking = -1;
                enemies1[1].check_platform = true;
            }
            
            if(near_platform === true )
            {
                enemies1[1].platform_im_on = next_platform;
            }
            
            if(enemies1[1].walking > 7)
            {
                enemies1[1].walking = -1;
            }
        }
        
        if(enemies1[2] )
        {
            var near_platform = false;
            
            enemies1[2].position.x += enemies1[2].speed;
            
            if(enemies1[2].currFrameCount < (frameCount - 2)) 
            {
                enemies1[2].currFrameCount = frameCount;
                enemies1[2].walking++;
            }
            
            if(enemies1[2].position.x > 289)
            {
                enemies1[2].Dir = "left";
                enemies1[2].speed = -enemies1[2].speed;
            }
            
            else if(enemies1[2].position.x < 154)
            {
                enemies1[2].Dir = "right";
                enemies1[2].speed = -enemies1[2].speed;
            }
            
            //zombie 3 headed to the left
            if(enemies1[2].Dir === "left")
            {
                for(var i = 0; i < enemies1[2].platform_im_on + 1; i++)
                {
                    
                    if( dist(enemies1[2].position.x, enemies1[2].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[2].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            //zombie 3 headed to the right
            if(enemies1[2].Dir === "right")
            {
                for(var i = enemies1[2].platform_im_on; i < platforms.length; i++)
                {
                    
                    if( dist(enemies1[2].position.x, enemies1[2].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[2].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            if( near_platform === false)
            {
                enemies1[2].jump = 1;
                enemies1[2].walking = -1;
                enemies1[2].check_platform = true;
            }
            
            if(near_platform === true )
            {
                enemies1[2].platform_im_on = next_platform;
            }
            
            if(enemies1[2].walking > 7)
            {
                enemies1[2].walking = -1;
            }
        }
        
        if(enemies1[3] )
        {
            var near_platform = false;
            
            enemies1[3].position.x += enemies1[3].speed;
            
            if(enemies1[3].currFrameCount < (frameCount - 2)) 
            {
                enemies1[3].currFrameCount = frameCount;
                enemies1[3].walking++;
            }
            
            if(enemies1[3].position.x > 250)
            {
                enemies1[3].Dir = "left";
                enemies1[3].speed = -enemies1[3].speed;
            }
            
            else if(enemies1[3].position.x < 6)
            {
                enemies1[3].Dir = "right";
                enemies1[3].speed = -enemies1[3].speed;
            }
            
            //zombie 4 headed to the left
            if(enemies1[3].Dir === "left")
            {
                for(var i = 0; i < enemies1[3].platform_im_on + 1; i++)
                {
                    
                    if( dist(enemies1[3].position.x, enemies1[3].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[3].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            //zombie 4 headed to the right
            if(enemies1[3].Dir === "right")
            {
                for(var i = enemies1[3].platform_im_on; i < platforms.length; i++)
                {
                    
                    if( dist(enemies1[3].position.x, enemies1[3].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[3].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            if( near_platform === false)
            {
                enemies1[3].jump = 1;
                enemies1[3].walking = -1;
                enemies1[3].check_platform = true;
            }
            
            if(near_platform === true )
            {
                enemies1[3].platform_im_on = next_platform;
            }
            
            if(enemies1[3].walking > 7)
            {
                enemies1[3].walking = -1;
            }
        }
        
        if(enemies1[4] )
        {
            
            var near_platform = false;
            
            enemies1[4].position.x += enemies1[4].speed;
            
            if(enemies1[4].currFrameCount < (frameCount - 2)) 
            {
                enemies1[4].currFrameCount = frameCount;
                enemies1[4].walking++;
            }
            
            if(enemies1[4].position.x > 380)
            {
                enemies1[4].Dir = "left";
                enemies1[4].speed = -enemies1[4].speed;
            }
            
            else if(enemies1[4].position.x < 275)
            {
                enemies1[4].Dir = "right";
                enemies1[4].speed = -enemies1[4].speed;
            }
            
            //zombie 5 headed to the left
            if(enemies1[4].Dir === "left")
            {
                for(var i = 0; i < enemies1[4].platform_im_on + 1; i++)
                {
                    
                    if( dist(enemies1[4].position.x, enemies1[4].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[4].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            //zombie 5 headed to the right
            if(enemies1[4].Dir === "right")
            {
                for(var i = enemies1[4].platform_im_on; i < platforms.length; i++)
                {
                    
                    if( dist(enemies1[4].position.x, enemies1[4].position.y, platforms[i].x, platforms[i].y) < 50 && platforms[enemies1[4].platform_im_on].y === platforms[i].y)
                    {
                        near_platform = true;
                        next_platform = i;
                    }
                }
            }
            
            if( near_platform === false)
            {
                enemies1[4].jump = 1;
                enemies1[4].walking = -1;
                enemies1[4].check_platform = true;
            }
            
            if(near_platform === true )
            {
                enemies1[4].platform_im_on = next_platform;
            }
            
            if(enemies1[4].walking > 7)
            {
                enemies1[4].walking = -1;
            }
        }
        
    
    }
    
};

//this variable holds all properties of the bat enemies
var enemy2Obj = function(x, y) {
    this.x = x;
    this.y = y;
    this.position = new PVector(x, y);
    this.state = [new batWanderState(), new batChaseState(), new batFleeState()];
    this.currState = 0;
    this.speed = enemy2_speed;
    this.health = enemy2_health;
    this.dead = false;
    this.flap = 0;
    this.pursue = false;
    this.currFrameCount = 0;
    
};

//this function allows the switching between states in the bat enemy's fsm
enemy2Obj.prototype.changeState = function(x) {
    this.currState = x;
};

//this function draws the bat enemy. If the bat enters it's chasing state, it's eyes will glow red!
enemy2Obj.prototype.draw = function() {
    //draw a bat that has flapping wings
    
    switch(this.flap)
    {
        //neutral position
        case 0:
            //right wing
            pushMatrix();
                translate(this.position.x + 14, this.position.y + -10);
                rotate( radians(-15) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                    curveVertex(93,72); 
                    curveVertex(4,52); 
                    curveVertex(-84,58); 
                    curveVertex(-143,76); 
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            //left wing
            pushMatrix();
                translate(this.position.x + -14, this.position.y + -10);
                rotate( radians(15) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                    curveVertex(-93,72); 
                    curveVertex(-4,52); 
                    curveVertex(84,58); 
                    curveVertex(143,76); 
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            break;
        
        //flapping position    
        case 1:
            //right wing
            pushMatrix();
                translate(this.position.x + 15, this.position.y + 1);
                rotate( radians(40) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                    curveVertex(93,72); 
                    curveVertex(4,52); 
                    curveVertex(-84,58); 
                    curveVertex(-143,76); 
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            //left wing
            pushMatrix();
                translate(this.position.x + -15, this.position.y + 1);
                rotate( radians(-40) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                    curveVertex(-93,72); 
                    curveVertex(-4,52); 
                    curveVertex(84,58); 
                    curveVertex(143,76); 
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            break;
    }
    
    //Right ear of bat
    pushMatrix();
    translate(this.position.x + 5, this.position.y + -13);
    rotate( radians(30) );
        fill(0, 0, 0);
        ellipse(0, 0, 5, 7);
        
        //Inner ear
        fill(245, 174, 206);
        ellipse(0, 0, 2, 5);
    popMatrix();
    
    //Left ear of bat
    pushMatrix();
    translate(this.position.x + -5, this.position.y + -13);
    rotate( radians(-30) );
        fill(0, 0, 0);
        ellipse(0, 0, 5, 8);
        
        //Inner ear
        fill(245, 174, 206);
        ellipse(0, 0, 2, 5);
    popMatrix();
    
        
    
    //bat's right foot
    pushMatrix();
    translate(this.position.x + 3, this.position.y + 4);
    rotate( radians(-20) );
        fill(0, 0, 0);
        ellipse(0, 0, 3, 5);
    popMatrix();
    
    //bat's left foot
    pushMatrix();
    translate(this.position.x + -3, this.position.y + 4);
    rotate( radians(20) );
        fill(0, 0, 0);
        ellipse(0, 0, 3, 5);
    popMatrix();
    
    //body of bat
    fill(0, 0, 0);
    ellipse(this.position.x + 0, this.position.y + -1, 8, 10);
    
    //bat's head
    fill(0, 0, 0);
    ellipse(this.position.x + 0, this.position.y + -7, 10, 11);
    
    //control the color of bat's eyes' when they see or don't see the player
    if(this.pursue === false)
    {
        fill(255, 255, 255);
    }
    else
    {
        fill(255, 0, 0);
    }
    
    //bat's right eye
    pushMatrix();
        translate(this.position.x + 2, this.position.y + -8);
        rotate( radians(-30) );
        ellipse(0, 0, 6, 3);
        
        
    popMatrix();
    
    //bat's left eye
    pushMatrix();
        translate(this.position.x + -3, this.position.y + -8);
        rotate( radians(30) );
        ellipse(0, 0, 6, 3);
        
        
    popMatrix();
     
    //bat's teeth
    fill(255, 255, 255);
    //right fang
    pushMatrix();
        translate(this.position.x + 0, this.position.y + -6);
        scale(0.2);
        
        triangle(0, 0, 8, 14, 15, 0); 
    popMatrix();
    
    //left fang
    pushMatrix();
        translate(this.position.x + -3, this.position.y + -6);
        scale(0.2);
        
        triangle(0, 0, 8, 14, 15, 0);
    popMatrix();
    
    // //bat's nose
    // fill(255, 110, 168);
    // ellipse(this.position.x + 0, this.position.y + -5, 3, 3);
    
    // //center point
    // fill(255, 255, 255);
    // ellipse(this.position.x + 0, this.position.y + 0, 3, 3);
    
};

//bat wing flapping animation control
enemy2Obj.prototype.animateWings = function() {
    if(player[0].active === true)
    {
      if (this.currFrameCount < (frameCount - 10)) 
      {
                this.currFrameCount = frameCount;
                
                if(this.flap === 0)
                {
                    this.flap = 1;
                }
                
                else if(this.flap === 1)
                {
                    this.flap = 0;
                }
       }
    }
    
};

//this variable holds the properties of the antidote object
var antidoteObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collected = false;
    this.antidote_movement = 1;
    this.currFrameCount = 0;
};

//This function draws the antidote object
antidoteObj.prototype.draw = function() {
    //Antidote creation
    
    //The contents
    noStroke();
    fill(255, 0, 0, 180);
    rect(this.x + -7, this.y + -4, 14, 13, 2);
    stroke(0, 0, 0);
    
    //The plug
    fill(199, 173, 126);
    rect(this.x + -3, this.y + -17, 5,8);
    
    //The bottle body
    fill(255, 255, 255, 50);
    //neck
    rect(this.x + -3, this.y + -12, 5,5);
    //body
    rect(this.x+-8, this.y+-7, 15, 15, 5);
    
    //Bottle Label
    fill(255, 255, 255);
    rect(this.x + -7, this.y + -2, 14, 8);
    
    fill(0, 0, 0);
    textSize(8);
    text("Rx", this.x + -5, this.y + 5);
    text("Rx", this.x + -5, this.y + 5);
    
    // fill(0, 0, 0);
    // ellipse(this.x, this.y, 3, 3);
};

//This function creates a floating animation
antidoteObj.prototype.float = function() {
    if(this.collected === false)
    {
      if (this.currFrameCount < (frameCount - 30)) {
                this.currFrameCount = frameCount;
                
                if(this.antidote_movement === 1)
                {
                    this.antidote_movement = -1;
                    this.y += 2;
                }
                
                else if(this.antidote_movement === -1)
                {
                    this.antidote_movement = 1;
                    this.y -= 2;
                }
       }
    }
};

//This variable holds all the properties for an explosion object
var explodeObj = function(x, y) {
    this.position = new PVector(x, y);
    //this.velocity = new PVector(random(-0.5, 0.5), random(-0.5, 0.5));    // cartesian
    this.velocity = new PVector(random(0, TWO_PI), random(-0.5, 0.5));
    this.size = random(1, 6);
    this.c1 = random(128, 255);
    this.c2 = random(0, 81);
    this.c3 = random(0, 81);
    this.timeLeft = 20;
};

//This function controls the movement of the particles when they explode
explodeObj.prototype.move = function() {
    var v = new PVector(this.velocity.y*cos(this.velocity.x),
    this.velocity.y*sin(this.velocity.x));

    this.position.add(v);
    this.position.add(v);
    this.position.add(v);
    //this.position.add(this.velocity); // cartesian
    this.timeLeft--;
};

//This function draws the explosion and it eventually fades away after a certain amount of time
explodeObj.prototype.draw = function() {
    noStroke();
    fill(this.c1, this.c2, this.c3);
    ellipse(this.position.x, this.position.y, this.size, this.size);
};

//This variable contains all the properties for a bullet object
var bulletObj = function() {
    this.x = 0;
    this.y = 0;
    this.fire = 0;
    this.bulletDir = "right";
};

//This function draws and checks for bullet collisions with both enemies in the game
bulletObj.prototype.draw = function() {
    fill(189, 173, 0);
    ellipse(this.x, this.y, 6, 2);
    if(this.bulletDir === "left")
    {
        this.x -= 5;
    }
    
    else if(this.bulletDir === "right")
    {
        this.x += 5;
    }
    
    //bullets disappear if they leave the boundary
    if (this.x < -10) {
        this.fire = 0;
    }
    
    if(this.x > 410)
    {
        this.fire = 0;
    }
    
    for(var i = 0; i < enemies1.length; i++)
    {
        if((enemies1[i].health > 0) && (dist(this.x, this.y, enemies1[i].position.x, enemies1[i].position.y) < 20) )
        {
            this.fire = 0;
            enemies1[i].health--;
            
            //blood splatter effect
            for (var n=0; n<10; n++) 
            {
                blood_splatter.push(new explodeObj(enemies1[i].position.x, enemies1[i].position.y));
            }
            
            if(enemies1[i].health === 0)
            {
                enemies1[i].dead = true;
            }
        }
        
    }
    
    for(var i = 0; i < enemies2.length; i++)
    {
        if((enemies2[i].health > 0) && (dist(this.x, this.y, enemies2[i].position.x, enemies2[i].position.y) < 16) )
        {
            this.fire = 0;
            enemies2[i].health--;
            
            //blood splatter effect
            for (var n=0; n<10; n++) 
            {
                blood_splatter.push(new explodeObj(enemies2[i].position.x, enemies2[i].position.y));
            }
            
            if(enemies2[i].health === 0)
            {
                enemies2[i].dead = true;
            }
        }
        
    }
    
    
};

//an array of bullets
var bullets = [new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj()];

//This function controls how many bullets are shot at a time based on the frameCount and how many bullets are currently available
var checkFire = function() {
    if (keyArray[32] === 1 && player[0].active === true && player[0].ammo > 0) 
    {
        
        if (bulletsCurrFrameCount < (frameCount - 10)) 
        {
            bulletsCurrFrameCount = frameCount;
            
            bullets[bulletIndex].fire = 1;
            bullets[bulletIndex].bulletDir = player[0].Dir;
            
            if(bullets[bulletIndex].bulletDir === "right")
            {
                bullets[bulletIndex].x = player[0].position.x + 43;
            }
            
            else
            {
                bullets[bulletIndex].x = player[0].position.x + -43;
            }
            
            bullets[bulletIndex].y = player[0].position.y + -2;
                
            //every time a bullet is shot, we should decrease the amount of ammo available to us   
            bulletIndex++;
            player[0].ammo--;
            
            //if we reached the max size of the bullet array, just recycle back to the first index
            if (bulletIndex > 6) 
            {
                bulletIndex = 0;
                
            }
        }
    }
};

//A function used to initialize all game objects' positions
var initTilemap = function(tilemap) {
    for (var i = 0; i< tilemap.length; i++) {
        for (var j =0; j < tilemap[i].length; j++) {
            switch (tilemap[i][j]) {
                case 'g': guns.push(new gunObj(j*20, i*20));
                    break;
                case 'a': antidotes.push(new antidoteObj(j*20, i*20));
                    break;
                case 'P': player.push(new playerObj(j*20, i*20));
                    break;
                case 'f': platforms.push(new platformObj(j*20, i*20));
                    break;
                case 'E': enemies1.push(new enemy1Obj(j*20, i*20));
                    break;
                case 'e': enemies2.push(new enemy2Obj(j*20, i*20));
                    break;
            }
        }
    }
};

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////Final Level///////////////////////////////////////////////

//This variable contains all the properties for a bullet object
var bulletObj = function() {
    this.x = 0;
    this.y = 0;
    this.fire = 0;
};

//object for lasers that come out of bats eyes, n is used to distinguish which eye the laser should come from
var laserObj = function(n) {
    if(n === 0)
    {this.position = new PVector(190, 45);}
    else{this.position = new PVector(210, 45);}
    this.fire = 0;
    this.step = new PVector(0, 0);
    this.x2 = 0;
    this.y2 = 0;
    this.x1 = 200;
    this.y1 = 45;
    this.angle = 0;
};

//object for final boss enemy (large bat)
var bossObj = function(x, y) {
    this.position = new PVector(x, y);
    this.health = 200;
    this.maxHealth = this.health;
    this.dead = false;
    this.flap = 0;
    this.currFrameCount = 0;
    this.lasers = [new laserObj(0), new laserObj(0), new laserObj(0), new laserObj(0), new laserObj(0), new laserObj(0), new laserObj(0), new laserObj(0), new laserObj(0), new laserObj(0)];
    this.lasers2 = [new laserObj(1), new laserObj(1), new laserObj(1), new laserObj(1), new laserObj(1), new laserObj(1), new laserObj(1), new laserObj(1), new laserObj(1), new laserObj(1)];
    this.laserIndex = 0;
    this.fireFrameCount = frameCount;
};

//this controls the explosion properties for game over screen
var fireExplodeObj = function(x, y) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(random(0, TWO_PI), random(-0.5, 0.5));
    this.size = random(1, 75);
    this.c1 = random(155, 255);
    this.c2 = random(0, 255);
    this.timeLeft = 100;
};

//moves particles of explosion
fireExplodeObj.prototype.move = function() {
    var v = new PVector(this.velocity.y*cos(this.velocity.x),
    this.velocity.y*sin(this.velocity.x));

    this.position.add(v);
    this.position.add(v);
    this.position.add(v);
    this.position.add(v);
    this.position.add(v);
    
    this.timeLeft--;
};

fireExplodeObj.prototype.draw = function() {
    noStroke();
    fill(this.c1, this.c2, 0, this.timeLeft);
    ellipse(this.position.x, this.position.y, this.size, this.size);
};

//explosion object
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

//object for fireworks used on game win screen
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

var fire_explosion = [];
var firework = [new fireworkObj(0), new fireworkObj(1), new fireworkObj(2), new fireworkObj(0)];

//controls the explosions
fireworkObj.prototype.draw = function() {
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
explosionObj.prototype.draw = function() {
    fill(this.c1, this.c2, this.c3, this.timer);    // 4th value fader
    noStroke();
    ellipse(this.position.x, this.position.y, this.size, this.size);
    
    this.position.x += this.direction.y*cos(this.direction.x);
    this.position.y += this.direction.y*sin(this.direction.x);
    this.position.y += (90/(this.timer + 100));    //gravity
    this.timer--;
};

//draws large bat
bossObj.prototype.draw = function() {
    //draw a bat that has flapping wings
    pushMatrix();
    scale(3); //makes bat large
    translate(-133, 0);
        switch(this.flap)
        {
            //neutral position
            case 0:
                //right wing
                pushMatrix();
                    translate(this.position.x + 14, this.position.y + -10);
                    rotate( radians(-15) );
                    scale(0.1);
                    fill(0, 0, 0);
                    beginShape();
                        curveVertex(-104,26); 
                        curveVertex(-58,5); 
                        curveVertex(3,-46); 
                        curveVertex(93,72); 
                        curveVertex(4,52); 
                        curveVertex(-84,58); 
                        curveVertex(-143,76); 
                        curveVertex(-104,26); 
                        curveVertex(-58,5); 
                        curveVertex(3,-46); 
                    endShape(CLOSE);
                    
                popMatrix();
                
                //left wing
                pushMatrix();
                    translate(this.position.x + -14, this.position.y + -10);
                    rotate( radians(15) );
                    scale(0.1);
                    fill(0, 0, 0);
                    beginShape();
                        curveVertex(104,26); 
                        curveVertex(58,5); 
                        curveVertex(-3,-46); 
                        curveVertex(-93,72); 
                        curveVertex(-4,52); 
                        curveVertex(84,58); 
                        curveVertex(143,76); 
                        curveVertex(104,26); 
                        curveVertex(58,5); 
                        curveVertex(-3,-46); 
                    endShape(CLOSE);
                    
                popMatrix();
                
                break;
            
            //flapping position    
            case 1:
                //right wing
                pushMatrix();
                    translate(this.position.x + 15, this.position.y + 1);
                    rotate( radians(40) );
                    scale(0.1);
                    fill(0, 0, 0);
                    beginShape();
                        curveVertex(-104,26); 
                        curveVertex(-58,5); 
                        curveVertex(3,-46); 
                        curveVertex(93,72); 
                        curveVertex(4,52); 
                        curveVertex(-84,58); 
                        curveVertex(-143,76); 
                        curveVertex(-104,26); 
                        curveVertex(-58,5); 
                        curveVertex(3,-46); 
                    endShape(CLOSE);
                    
                popMatrix();
                
                //left wing
                pushMatrix();
                    translate(this.position.x + -15, this.position.y + 1);
                    rotate( radians(-40) );
                    scale(0.1);
                    fill(0, 0, 0);
                    beginShape();
                        curveVertex(104,26); 
                        curveVertex(58,5); 
                        curveVertex(-3,-46); 
                        curveVertex(-93,72); 
                        curveVertex(-4,52); 
                        curveVertex(84,58); 
                        curveVertex(143,76); 
                        curveVertex(104,26); 
                        curveVertex(58,5); 
                        curveVertex(-3,-46); 
                    endShape(CLOSE);
                    
                popMatrix();
                
                break;
        }
        
        //Right ear of bat
        pushMatrix();
        translate(this.position.x + 5, this.position.y + -13);
        rotate( radians(30) );
            fill(0, 0, 0);
            ellipse(0, 0, 5, 7);
            
            //Inner ear
            fill(245, 174, 206);
            ellipse(0, 0, 2, 5);
        popMatrix();
        
        //Left ear of bat
        pushMatrix();
        translate(this.position.x + -5, this.position.y + -13);
        rotate( radians(-30) );
            fill(0, 0, 0);
            ellipse(0, 0, 5, 8);
            
            //Inner ear
            fill(245, 174, 206);
            ellipse(0, 0, 2, 5);
        popMatrix();
        
            
        
        //bat's right foot
        pushMatrix();
        translate(this.position.x + 3, this.position.y + 4);
        rotate( radians(-20) );
            fill(0, 0, 0);
            ellipse(0, 0, 3, 5);
        popMatrix();
        
        //bat's left foot
        pushMatrix();
        translate(this.position.x + -3, this.position.y + 4);
        rotate( radians(20) );
            fill(0, 0, 0);
            ellipse(0, 0, 3, 5);
        popMatrix();
        
        //body of bat
        fill(0, 0, 0);
        ellipse(this.position.x + 0, this.position.y + -1, 8, 10);
        
        //bat's head
        fill(0, 0, 0);
        ellipse(this.position.x + 0, this.position.y + -7, 10, 11);
        
        //control the color of bat's eyes' when they see or don't see the player
        fill(255, 0, 0);

        //bat's right eye
        pushMatrix();
            translate(this.position.x + 2, this.position.y + -8);
            rotate( radians(-30) );
            ellipse(0, 0, 6, 3);
            
            
        popMatrix();
        
        //bat's left eye
        pushMatrix();
            translate(this.position.x + -3, this.position.y + -8);
            rotate( radians(30) );
            ellipse(0, 0, 6, 3);
            
            
        popMatrix();
         
        //bat's teeth
        fill(255, 255, 255);
        //right fang
        pushMatrix();
            translate(this.position.x + 0, this.position.y + -6);
            scale(0.2);
            
            triangle(0, 0, 8, 14, 15, 0); 
        popMatrix();
        
        //left fang
        pushMatrix();
            translate(this.position.x + -3, this.position.y + -6);
            scale(0.2);
            
            triangle(0, 0, 8, 14, 15, 0);
        popMatrix();
        
        // //bat's nose
        // fill(255, 110, 168);
        // ellipse(this.position.x + 0, this.position.y + -5, 3, 3);
        
        // //center point
        // fill(255, 255, 255);
        // ellipse(this.position.x + 0, this.position.y + 0, 3, 3);
    popMatrix();

    stroke(255, 0, 0);
};

//bat wing flapping animation control
bossObj.prototype.animateWings = function() {
  if (this.currFrameCount < (frameCount - 10)) 
  {
        this.currFrameCount = frameCount;
        
        if(this.flap === 0)
        {
            this.flap = 1;
        }
        
        else if(this.flap === 1)
        {
            this.flap = 0;
        }
   }
};

//object to hold level 4 variables
var l4Obj = function()
{
    this.heli = 0;
    this.do_explosion = true;
    this.bulletIndex = 0;
    this.bullets = [new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj()];
    this.bullets2 = [new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj(), new bulletObj()];
    this.currFrameCount = 0;
    this.blood_splatter = [];
    this.boss = 0; //big bat 
    
    //variables for larry (the smaller bats)
    this.larrys = [];
    this.larryFrame = 0;
    this.spawnRate = 15;
    this.maxLarrys = 5;
    
    //normal difficulty
    this.heliHealth = 3;
    this.laserSpeed = 3;
    this.laserSpawn = 20;
    this.laserSpread = 75;
    this.larrySpeed = 3;
    this.gameStart = false;
};

//initialize level 4 object
var l4 = new l4Obj();

//object for player-controlled helicopter
var topDownHeli = function(x, y, s)
{
    this.x = x;
    this.y = y;
    this.size = s;
    this.health = l4.heliHealth;
    this.rl = s*0.8; //rotor length
    this.srl = (s*0.8)*(sqrt(2)/2);//secondary rotor length
    this.currFrame = frameCount;
    this.i = 0;
    this.angle = 0;
    
    this.hit = false;
    this.hitFrame = 0;
    this.hurt = 60;
};

//draws the player controlled helicopter
topDownHeli.prototype.draw = function()
{
    //resets hit frame for visual effect
    if (frameCount - this.hitFrame > this.hurt){
        this.hit = false;
    }
    
    //only draws the heli when it hasn't been hit or creates a flashing effect when it has been hit
    if (this.hit === false || (this.hit === true && (frameCount - this.hitFrame) % 10 < 5)){
        pushMatrix();
        translate(this.x, this.y);
        rotate(this.angle);
        //draws HP
        textAlign(CENTER);
        fill(255, 0, 0);
        textSize(15);
        text("HP: " + this.health, 40, 0);
        textAlign(LEFT);
        rectMode(CENTER);
        
        //guns
        fill(255,223,0);
        rect(-(this.size*0.40),-(this.size*0.04),(this.size*0.1),(this.size*0.3),(this.size*0.1));
        rect((this.size*0.40),-(this.size*0.04),(this.size*0.1),(this.size*0.3),(this.size*0.1));
        
        fill(0, 0, 0);
        noStroke();
        //wings
        rect((this.size*0.30), 0, (this.size*0.30), (this.size*0.15));
        rect(-(this.size*0.30), 0, (this.size*0.30), (this.size*0.15));
        //body
        ellipse(0, 0, (this.size/2), this.size);
        //tail
        rect(0, (this.size/2), (this.size/8), this.size*0.7);
        rect((this.size*0.08), (this.size*0.8), this.size*0.15, this.size*0.1);
    
        //draws rotors
        stroke(80, 80, 80);
        strokeWeight(this.size*0.08);
        switch(this.i)
        {
            case 0:
                line(0, -this.rl, 0, this.rl);
                line(-this.rl, 0, this.rl, 0);
                break;
            case 1:
                line(-this.srl, -this.srl, this.srl,this.srl);
                line(-this.srl, this.srl, this.srl, -this.srl);
                break;
            case 2:
                line(-this.rl, 0, this.rl, 0);
                line(0, -this.rl, 0, this.rl);
                break;
            case 3:
                line(-this.srl, this.srl, this.srl, -this.srl);
                line(-this.srl, -this.srl, this.srl, this.srl);
                break;
        }
        
        //switches position of rotor for animation effect
        if (this.currFrame < (frameCount - 7 )) 
        {
            this.currFrame = frameCount;
            this.i++;
            if (this.i > 3) 
            {
                this.i = 0;
            }
        }
        
        noStroke();
        rectMode(LEFT);
        popMatrix();
    }
};

//moves helicopter according to global movement settings, also sets gamestart bool to true
topDownHeli.prototype.move = function()
{
    var u = 0;
    var d = 0;
    var l = 0;
    var r = 0;
    if(useArrowKeys)
    {
        u = 38;
        d = 40;
        l = 37;
        r = 39;
    }
    else
    {
        u = 87;
        d = 83;
        l = 65;
        r = 68;        
    }
    
    if(keyArray[u] === 1 && this.y > (this.size/2))
    {
        this.y -= 2;
        l4.gameStart = true;
    }
    if(keyArray[d] === 1 && this.y  < 400-(this.size/2))//down
    {
        this.y += 2;
        l4.gameStart = true;
    }
    if(keyArray[l] === 1 && this.x > (this.size/3))//left
    {
        this.x -= 2;
        l4.gameStart = true;
    }
    if(keyArray[r] === 1 && this.x < 400-(this.size/3))//right
    {
        this.x += 2;
        l4.gameStart = true;
    }
};

//smaller bat objects moving in the game
var larryObj = function(x, y) {
    this.position = new PVector(x, y);
    this.speed = l4.larrySpeed;
    this.dead = true;
    this.flap = 0;
    this.currFrameCount = 0;
};

//sets up game variables between plays
l4Obj.prototype.setUpGame = function()
{
    this.heli = new topDownHeli(200, 350, 40);
    this.boss = new bossObj(200, 20);
    
    for (var k = 0; k < this.maxLarrys; k++){
        this.larrys.push(new larryObj(0, 0));   
    }
};

//resets game variables between plays
l4Obj.prototype.resetVars = function()
{
    this.heli = 0;
    this.boss = 0;
    this.do_explosion = true;
    this.gameStart = false;
    
    this.larrys = [];
    
    for (var k = 0; k < this.larrys.length; k++){
        this.larrys[k].dead = true;  
    }
    
    for (var k = 0; k < this.bullets.length; k++){
        this.bullets[k].fire = 0;
        this.bullets2[k].fire = 0;
    }
};

//draw larry
larryObj.prototype.draw = function() {
    noStroke();
    //draw a bat that has flapping wings
    switch(this.flap)
    {
        //neutral position
        case 0:
            //right wing
            pushMatrix();
                translate(this.position.x + 14, this.position.y + -10);
                rotate( radians(-15) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                    curveVertex(93,72); 
                    curveVertex(4,52); 
                    curveVertex(-84,58); 
                    curveVertex(-143,76); 
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            //left wing
            pushMatrix();
                translate(this.position.x + -14, this.position.y + -10);
                rotate( radians(15) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                    curveVertex(-93,72); 
                    curveVertex(-4,52); 
                    curveVertex(84,58); 
                    curveVertex(143,76); 
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            break;
        
        //flapping position    
        case 1:
            //right wing
            pushMatrix();
                translate(this.position.x + 15, this.position.y + 1);
                rotate( radians(40) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                    curveVertex(93,72); 
                    curveVertex(4,52); 
                    curveVertex(-84,58); 
                    curveVertex(-143,76); 
                    curveVertex(-104,26); 
                    curveVertex(-58,5); 
                    curveVertex(3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            //left wing
            pushMatrix();
                translate(this.position.x + -15, this.position.y + 1);
                rotate( radians(-40) );
                scale(0.1);
                fill(0, 0, 0);
                beginShape();
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                    curveVertex(-93,72); 
                    curveVertex(-4,52); 
                    curveVertex(84,58); 
                    curveVertex(143,76); 
                    curveVertex(104,26); 
                    curveVertex(58,5); 
                    curveVertex(-3,-46); 
                endShape(CLOSE);
                
            popMatrix();
            
            break;
    }
    
    //Right ear of bat
    pushMatrix();
    translate(this.position.x + 5, this.position.y + -13);
    rotate( radians(30) );
        fill(0, 0, 0);
        ellipse(0, 0, 5, 7);
        
        //Inner ear
        fill(245, 174, 206);
        ellipse(0, 0, 2, 5);
    popMatrix();
    
    //Left ear of bat
    pushMatrix();
    translate(this.position.x + -5, this.position.y + -13);
    rotate( radians(-30) );
        fill(0, 0, 0);
        ellipse(0, 0, 5, 8);
        
        //Inner ear
        fill(245, 174, 206);
        ellipse(0, 0, 2, 5);
    popMatrix();
    
        
    
    //bat's right foot
    pushMatrix();
    translate(this.position.x + 3, this.position.y + 4);
    rotate( radians(-20) );
        fill(0, 0, 0);
        ellipse(0, 0, 3, 5);
    popMatrix();
    
    //bat's left foot
    pushMatrix();
    translate(this.position.x + -3, this.position.y + 4);
    rotate( radians(20) );
        fill(0, 0, 0);
        ellipse(0, 0, 3, 5);
    popMatrix();
    
    //body of bat
    fill(0, 0, 0);
    ellipse(this.position.x + 0, this.position.y + -1, 8, 10);
    
    //bat's head
    fill(0, 0, 0);
    ellipse(this.position.x + 0, this.position.y + -7, 10, 11);
    
    //control the color of bat's eyes' when they see or don't see the player

    fill(255, 0, 0);
    
    //bat's right eye
    pushMatrix();
        translate(this.position.x + 2, this.position.y + -8);
        rotate( radians(-30) );
        ellipse(0, 0, 6, 3);
        
        
    popMatrix();
    
    //bat's left eye
    pushMatrix();
        translate(this.position.x + -3, this.position.y + -8);
        rotate( radians(30) );
        ellipse(0, 0, 6, 3);
        
        
    popMatrix();
     
    //bat's teeth
    fill(255, 255, 255);
    //right fang
    pushMatrix();
        translate(this.position.x + 0, this.position.y + -6);
        scale(0.2);
        
        triangle(0, 0, 8, 14, 15, 0); 
    popMatrix();
    
    //left fang
    pushMatrix();
        translate(this.position.x + -3, this.position.y + -6);
        scale(0.2);
        
        triangle(0, 0, 8, 14, 15, 0);
    popMatrix();
};

//move larry down the screen
larryObj.prototype.move = function() {
    //if larry is alive move down the screen
    if (this.dead === false){
        this.position.y += this.speed;
        
        //larry is dead if passes the bottom of the screen
        if (this.position.y > 420){
            this.dead = true;
        }
    }
};

//check to see if larry hits the heli or its bullets
larryObj.prototype.checkCollision = function(){
    //check to see if larry hit helicopter
    if (this.dead === false && l4.heli.hit === false && dist(this.position.x, this.position.y, l4.heli.x, l4.heli.y) < 30){
        this.dead = true;
        l4.heli.health--;
        l4.heli.hit = true;
        l4.heli.hitFrame = frameCount;
    }
    
    //check to see if larry is hit by a bullet
    for (var k = 0; k < l4.bullets.length; k++){
        if (this.dead === false && l4.bullets[k].fire === 1 && dist(this.position.x, this.position.y, l4.bullets[k].x, l4.bullets[k].y) < 30){
        this.dead = true;
        l4.bullets[k].fire = 0;
        }
    }
    
    for (var k = 0; k < l4.bullets2.length; k++){
        if (this.dead === false && l4.bullets2[k].fire === 1 && dist(this.position.x, this.position.y, l4.bullets2[k].x, l4.bullets2[k].y) < 30){
        this.dead = true;
        l4.bullets2[k].fire = 0;
        }
    }
};

//bat wing flapping animation control
larryObj.prototype.animateWings = function() {
    if(this.dead === false)
    {
      if (this.currFrameCount < (frameCount - 10)) 
      {
            this.currFrameCount = frameCount;
            
            if(this.flap === 0)
            {
                this.flap = 1;
            }
            
            else if(this.flap === 1)
            {
                this.flap = 0;
            }
       }
    }
    
};

//spawn larry
larryObj.prototype.spawnLarry = function() {
    //reset larry's position and larry is set to alive
    this.position.x = random(40, 360);
    this.position.y = 120;
    this.dead = false;
};

//draw bullets for the helicopter
bulletObj.prototype.draw = function() {
    noStroke();
    fill(181, 166, 66);
    ellipse(this.x, this.y, 4, 6);
    this.y -= 5;
    if (this.y < 0) {
        this.fire = 0;
    }
    
    //collisions here/////////////////
    if ((l4.boss.dead === false) && (l4.boss.health >= 1) &&
        (dist(this.x, this.y, l4.boss.position.x, l4.boss.position.y) < 65)) 
    {
        l4.boss.health --;
        this.fire = 0;
    }
};

//draws lasers and moves them at different speeds based off of difficulty
laserObj.prototype.draw = function() {
    fill(225, 0, 0);
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    ellipse(0, 0, 8, 3);
    this.step.normalize();
    this.step.mult(l4.laserSpeed);
    this.position.add(this.step);
    popMatrix();
};

//when the laser leaves the screen we reset the fire variable and it's position
laserObj.prototype.checkFire = function()
{
    if (this.position.y < 0 || this.position.y > 400 || this.position.x < 0 || this.position.x > 400) {
        this.fire = 0;
        if(this.n === 0)
        {this.position = new PVector(190, 45);}
        else{this.position = new PVector(210, 45);}
    }
};

//checks if the lasers have hit the helicopter, if ithas we deduct health from the heli and reset laser
laserObj.prototype.checkCollisions = function()
{
    var xDistance = (this.position.x - l4.heli.x)*(this.position.x - l4.heli.x);
    var yDistance = (this.position.y - l4.heli.y)*(this.position.y - l4.heli.y);
    if(l4.heli.hit === false && xDistance < 144 && yDistance < 484)
    {
        l4.heli.health--;
        l4.heli.hit = true;
        l4.heli.hitFrame = frameCount;
        this.fire = 0;
        if(this.n === 0)
        {this.position = new PVector(190, 45);}
        else{this.position = new PVector(210, 45);}
    }
};

//sets lasers fire variables to 1 after a certain amount of time (set by difficulty)
//it then calculates the line the lasers should travel in based off the heli's current loctaion, a laserSpread variable makes it so the lasers are randomly off from the heli center in the x direction.
bossObj.prototype.shootLasers = function()
{
    if ((frameCount - this.fireFrameCount) > l4.laserSpawn)
    {
        this.fireFrameCount = frameCount;
        
        this.lasers[this.laserIndex].fire = 1;
        this.lasers[this.laserIndex].x2 = l4.heli.x + random(-l4.laserSpread, l4.laserSpread);
        this.lasers[this.laserIndex].y2 = l4.heli.y;

        this.lasers[this.laserIndex].step.set(this.lasers[this.laserIndex].x2 - 190, l4.heli.y - 45);
        this.lasers[this.laserIndex].angle = this.lasers[this.laserIndex].step.heading();

        
        this.lasers2[this.laserIndex].fire = 1;
        this.lasers2[this.laserIndex].x2 = l4.heli.x + random(-l4.laserSpread, l4.laserSpread);
        this.lasers2[this.laserIndex].y2 = l4.heli.y;

        this.lasers2[this.laserIndex].step.set(this.lasers[this.laserIndex].x2 - 210, l4.heli.y - 45);
        this.lasers2[this.laserIndex].angle = this.lasers2[this.laserIndex].step.heading();
        
        this.laserIndex++;
        if (this.laserIndex > 9) {
            this.laserIndex = 0;
        }
    }
};

//draw active lasers and checks for collisons, we also check if any laser needs to be reset
bossObj.prototype.drawLasers = function()
{
    for(var i =0; i < this.lasers.length; i++)
    {
        if(this.lasers[i].fire === 1)
        {
            this.lasers[i].draw();
            this.lasers[i].checkCollisions();
        }
        this.lasers[i].checkFire();
    }
    
    for(var i =0; i < this.lasers.length; i++)
    {
        if(this.lasers2[i].fire === 1)
        {
            this.lasers2[i].draw();
            this.lasers2[i].checkCollisions();
        }
        this.lasers2[i].checkFire();
    }
};

//checks for fire from user, if spacebar is pressed bullets are fired from each side of the helicoper
var checkFire_4 = function() {
    if (keyArray[32] === 1) {
        if (l4.currFrameCount < (frameCount - 10)) {
            l4.currFrameCount = frameCount;
            
            l4.bullets[l4.bulletIndex].fire = 1;
            l4.bullets[l4.bulletIndex].x = l4.heli.x + 16;
            l4.bullets[l4.bulletIndex].y = l4.heli.y - 10;
            
            l4.bullets2[l4.bulletIndex].fire = 1;
            l4.bullets2[l4.bulletIndex].x = l4.heli.x - 16;
            l4.bullets2[l4.bulletIndex].y = l4.heli.y - 10;
            
            l4.bulletIndex++;
            if (l4.bulletIndex > 4) {
                l4.bulletIndex = 0;
            }
        }
    }
};


////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////Mouse click events////////////////////////////////////////
var mouseClicked = function() {
    var xCor= mouseX;
    var yCor= mouseY;

    switch(gameState)
    {
        case "mainScreen":
            if ((xCor > 21) && (xCor < 174) && (yCor > 273) && (yCor < 313))
            {
                gameState = "instructions";
            }
            else if ((xCor > 21) && (xCor < 174) && (yCor > 345) && (yCor < 385))
            {
                gameState = "options";
            }
            else if ((xCor > 221) && (xCor < 376) && (yCor > 345) && (yCor < 385)) 
            {
                //progress to the credits screen
                gameState = "credits";
            }
            //mainScreen mouse clicks play
            else if ((xCor > 221) && (xCor < 376) && (yCor > 272) && (yCor < 314)) 
            {
                //progress to the credits screen
                gameState = "levelSelectScreen";
            }
            break;
        case "instructions":
            //General Instruction Screen mouse clicks Back to Main Menu
            if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the main menu screen
                gameState = "mainScreen";
            }
            //General Instruction Screen mouse clicks Go to Page 1
            else if ((xCor > 289) && (xCor < 392) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the instructions2 screen
                gameState = "instructions1";
            }
            break;
        case "instructions1":
            //Instruction Screen 1 mouse clicks Back to Main Menu
            if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the main menu screen
                gameState = "mainScreen";
            }
            //Instruction Screen  1 mouse clicks Go to Page 2
            else if ((xCor > 289) && (xCor < 392) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the instructions2 screen
                gameState = "instructions2";
            }
            break;
        case "instructions2":
            //Instruction Screen 2 mouse clicks Back to Main Menu
            if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the main menu screen and reset all instruction pages
                gameState = "mainScreen";
            }
            //Instruction Screen 2 mouse clicks Go to Page 3
            else if ((xCor > 289) && (xCor < 392) && (yCor > 337) && (yCor < 390)) 
            {
                gameState = "instructions3";
            }            
            break;
        case "instructions3":
            //Instruction Screen 3 mouse clicks Back to Main Menu
            if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the main menu screen
                gameState = "mainScreen";
                isInstruction3Init = false;
                //Jamahl's variables to be reset
                player = [];
                enemies1 = [];
                enemies2 = [];
                platforms = [];
                antidotes = [];
                guns = [];
                signal_timer = 0;
                signal_timer_passed = 0;
                start_timer = false;
                collected_signal = false;
            }
            //Instruction Screen 3 mouse clicks Go to Page 4
            else if ((xCor > 289) && (xCor < 392) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the instructions4 screen
                gameState = "instructions4";
                isInstruction3Init = false;
                
                //Jamahl's variables to be reset
                player = [];
                enemies1 = [];
                enemies2 = [];
                platforms = [];
                antidotes = [];
                guns = [];
                signal_timer = 0;
                signal_timer_passed = 0;
                start_timer = false;
                collected_signal = false;
            }
            break;
        case "instructions4":
            //Instruction Screen 4 mouse clicks Back to Main Menu
            if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the main menu screen
                gameState = "mainScreen";
            }
            //Instruction Screen 4 mouse clicks Go to Page 1
            else if ((xCor > 289) && (xCor < 392) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the instructions screen
                gameState = "instructions";
            }
            break;
        case "options":
            //Options Screen click on easy button
            if ((xCor > 47) && (xCor < 119) && (yCor > 106) && (yCor < 136)) 
            {
                //set dim on easy button and set difficulty variable
                easyDimmer = -88;
                difficultyMode = 1;
                normalDimmer = 0;
                hardDimmer = 0;
                
                //set your game variables for EASY MODE DIFFICULTY///////////////
                ///Jamahl's Game Variables////////////////////////////////
                enemy1_speed = 0.5;
                enemy2_speed = 0.5;
                enemy1_health = 1;
                enemy2_health = 1;
                player_health = 10;
                player_speed = 1.5;
                fall_speed = 10;
                
                //Kevin K's Game Variables//////////////////////////////////
                l2.footballSpeed = 1.5;
                l2.zombieSpeed = 1;
                l2.genRate = 100;
                l2.playerHealth = 5;
                
                //Kevin C's Game Variables////////////////////////////////////
                duckHunt_pHealth = 2;
                duckHunt_eHealth = 1;
                
                //Final Level Variables
                l4.heliHealth = 5;
                l4.laserSpeed = 2;
                l4.laserSpawn = 30;
                l4.laserSpread = 75;
                l4.larrySpeed = 1;
            }
            //Options Screen click on normal button
            else if ((xCor > 167) && (xCor < 238) && (yCor > 106) && (yCor < 136)) 
            {
                //set dim on norma; button and set difficulty variable
                easyDimmer = 0;
                normalDimmer = -88;
                difficultyMode = 2;
                hardDimmer = 0;
                
                //set your game variables for NORMAL MODE DIFFICULTY///////////////
                ///Jamahl's Game Variables////////////////////////////////
                enemy1_speed = 1;
                enemy2_speed = 1;
                enemy1_health = 2;
                enemy2_health = 1;
                player_health = 3;
                player_speed = 1.5;
                fall_speed = 8;
                
                //Kevin K's Game Variables//////////////////////////////////
                l2.footballSpeed = 2;
                l2.zombieSpeed = 1;
                l2.genRate = 60;
                l2.playerHealth = 3;
                
                //Kevin C's Game Variables////////////////////////////////////
                duckHunt_pHealth = 1;
                duckHunt_eHealth = 2; 
                
                //Final Level Variables
                l4.heliHealth = 3;
                l4.laserSpeed = 3;
                l4.laserSpawn = 20;
                l4.laserSpread = 75;
                l4.larrySpeed = 3;
            }
            
            //Options Screen click on hard button
            else if ((xCor > 288) && (xCor < 359) && (yCor > 106) && (yCor < 136)) 
            {
                //set dim on hard button and set difficulty variable
                easyDimmer = 0;
                normalDimmer = 0;
                hardDimmer = -88;
                difficultyMode = 3;
                
                //set your game variables for HARD MODE DIFFICULTY///////////////
                ///Jamahl's Game Variables////////////////////////////////
                enemy1_speed = 2;
                enemy2_speed = 1;
                enemy1_health = 3;
                enemy2_health = 2;
                player_health = 3;
                player_speed = 1.5;
                fall_speed = 6;
                
                //Kevin K's Game Variables//////////////////////////////////
                l2.footballSpeed = 2.5;
                l2.zombieSpeed = 1.5;
                l2.genRate = 40;
                l2.playerHealth = 3;
                
                //Kevin C's Game Variables////////////////////////////////////
                duckHunt_pHealth = 0;
                duckHunt_eHealth = 3;  
                
                //Final Level Variables
                l4.heliHealth = 2;
                l4.laserSpeed = 3.5;
                l4.laserSpawn = 15;
                l4.laserSpread = 75;
                l4.larrySpeed = 3.5;
            }
            //Options Screen click on WASD button
            else if ((xCor > 32) && (xCor < 174) && (yCor > 225) && (yCor < 290)) 
            {
                //set dim on wasd button and set movement variable
                wasdDimmer = -88;
                arrowsDimmer = 0;
                useArrowKeys = false;
            }
            //Options Screen click on Arrow Keys Button
            else if ((xCor > 228) && (xCor < 368) && (yCor > 225) && (yCor < 290)) 
            {
                //set dim on wasd button and set movement variable
                wasdDimmer = 0;
                arrowsDimmer = -88;
                useArrowKeys = true;
            }
            //Options Screen click on Back to Menu Button
            else if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                //progress to the main menu screen and reset all options pages
                gameState = "mainScreen";
            }
            break;
        case "credits":
            //Credits Screen click on Back to Menu Button
            if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390))
            {
                //progress to the main menu screen
                gameState = "mainScreen";
            }
            break;
        case "levelSelectScreen":
            if ((xCor > 82) && (xCor < 320) && (yCor > 72) && (yCor < 115)) 
            {
                //progress to playing level 1
                currentLevel = 1;
                gameStart = true;
                gameState = "game";
            }
            //Level selection screen mouse clicks on level 2
            else if ((xCor > 82) && (xCor < 320) && (yCor > 135) && (yCor < 179)) 
            {
                prompt_timer = 0;
                prompt_timer_passed = 0;
                start_prompt_timer = false;
                clickLocX = xCor;
                clickLocY = yCor;
                    
                //We should notify the player that they need to beat the prior level
                if(beatLevel1 === true)
                {
                    //progress to playing level 2
                    currentLevel = 2;
                    gameStart = true;
                    gameState = "game";
                }
                else
                {
                    prompt = "Beat Level 1 \n  to Unlock!";
                    start_prompt_timer = true;
                    prompt_timer = second();
                }
            }
            //Level selection screen mouse clicks on level 3
            else if ((xCor > 82) && (xCor < 320) && (yCor > 196) && (yCor < 239)) 
            {
                prompt_timer = 0;
                prompt_timer_passed = 0;
                start_prompt_timer = false;
                clickLocX = xCor;
                clickLocY = yCor;
                    
                if(beatLevel1 === true && beatLevel2 === true)
                {
                    //progress to playing level 3
                    currentLevel = 3;
                    gameStart = true;
                    gameState = "game";
                }
                
                else
                {
                    prompt = "Beat Levels \n   1 and 2 \n  to Unlock!";
                    start_prompt_timer = true;
                    prompt_timer = second();
                }
            }
            
            //Level selection screen mouse clicks on level 4
            else if ((xCor > 82) && (xCor < 320) && (yCor > 259) && (yCor < 301)) 
            {
                
                prompt_timer = 0;
                prompt_timer_passed = 0;
                start_prompt_timer = false;
                clickLocX = xCor;
                clickLocY = yCor;
                
                if(beatLevel1 === true && beatLevel2 === true && beatLevel3 === true)
                {
                    //progress to playing level 4
                    currentLevel = 4;
                    gameStart = true;
                    gameState = "game";
                }
                
                else
                {
                    prompt = "Beat Levels \n 1, 2, and 3 \n  to Unlock!";
                    start_prompt_timer = true;
                    prompt_timer = second();
                }
            }
            
            //Level selection screen mouse clicks on Back to Menu
            else if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                gameState = "mainScreen";
                //reset the prompt variables
                prompt_timer = 0;
                prompt_timer_passed = 0;
                start_prompt_timer = false;
            }
            break;
        case "gameOverScreen":
            //Gameover Screen click on return to Menu Button
            if ((xCor > 9) && (xCor < 112) && (yCor > 337) && (yCor < 390)) 
            {
                //progress back to the main menu screen 
                gameState = "mainScreen";
                
                //prepare for level's tilemap to be reinitialized
                initialize_tilemap = false;
                
                //reset Jamahl's game components
                player = [];
                enemies1 = [];
                enemies2 = [];
                platforms = [];
                antidotes = [];
                guns = [];
                score = 0;
                instruction4Heli_L4 = new heliObj(500, 200, true);
                
                //reset Kevin Chea's variables
                tree = [];
                water = [];
                duckHunt_a = [];
                duckHunt_b = [];
                duckHunt_c = [];
                duckHunt_d = [];
                duckHunt_m = [];
                duckHunt_n = [];
                duckHunt_k = [];
                duckHunt_l = [];
                duckHunt_player = 0;
                duckHunt_enemy = [];
                
                //settings for bullets
                duckHunt_bulletFrame = 0;
                duckHunt_liveBullets = 0;
                duckHunt_fired = false; //checks to see if player already fired
                duckHunt_bullets = [];
                
                //game settings
                duckHunt_enemyCnt = 0;
                duckHunt_gameOver = false;
            
                //reset all bullets
                for(var i = 0; i < bullets.length; i++)
                {
                    bullets[i].fire = 0;
                    bullets[i].bulletDir = "right";
                }
                
                hurt_timer = 0;
                hurt_timer_passed = 0;
                start_hurt_timer = false;
                player[0].hurt = false;
                
                signal_timer = 0;
                signal_timer_passed = 0;
                start_timer = false;
                collected_signal = false;
            }
            //Gameover Screen click on retry level
            else if ((xCor > 289) && (xCor < 392) && (yCor > 337) && (yCor < 390) && gameLost === true) 
            {
                //Retry the level you were playing
                gameStart = true;
                
                //Prepare the level's tilemap to be reinitialized
                initialize_tilemap = false;
                
                //reset Jamahl's game components
                player = [];
                enemies1 = [];
                enemies2 = [];
                platforms = [];
                antidotes = [];
                guns = [];
                score = 0;
                
                //reset Kevin Chea's variables
                tree = [];
                water = [];
                duckHunt_a = [];
                duckHunt_b = [];
                duckHunt_c = [];
                duckHunt_d = [];
                duckHunt_m = [];
                duckHunt_n = [];
                duckHunt_k = [];
                duckHunt_l = [];
                duckHunt_player = 0;
                duckHunt_enemy = [];
                
                //settings for bullets
                duckHunt_bulletFrame = 0;
                duckHunt_liveBullets = 0;
                duckHunt_fired = false; //checks to see if player already fired
                duckHunt_bullets = [];
                
                //game settings
                duckHunt_enemyCnt = 0;
                duckHunt_gameOver = false;
                
                //reset all bullets
                for(var i = 0; i < bullets.length; i++)
                {
                    bullets[i].fire = 0;
                    bullets[i].bulletDir = "right";
                }
                
                hurt_timer = 0;
                hurt_timer_passed = 0;
                start_hurt_timer = false;
                player[0].hurt = false;
                
                signal_timer = 0;
                signal_timer_passed = 0;
                start_timer = false;
                collected_signal = false;
                /////////////////////////////////////////////////////////////////////////
                
                gameState = "game";
            }
            
            //Gameover Screen click on next level
            else if ((xCor > 289) && (xCor < 392) && (yCor > 337) && (yCor < 390) && gameLost === false && (currentLevel === 1 || currentLevel === 2 || currentLevel === 3)) 
            {
                gameState = "game";
                //Proceed to the next level you were playing
                currentLevel++;
                gameStart = true;
                
                //Prepare the level's tilemap to be reinitialized
                initialize_tilemap = false;
                
                //reset Jamahl's game components
                player = [];
                enemies1 = [];
                enemies2 = [];
                platforms = [];
                antidotes = [];
                guns = [];
                
                
                //reset Kevin Chea's variables
                tree = [];
                water = [];
                duckHunt_a = [];
                duckHunt_b = [];
                duckHunt_c = [];
                duckHunt_d = [];
                duckHunt_m = [];
                duckHunt_n = [];
                duckHunt_k = [];
                duckHunt_l = [];
                duckHunt_player = 0;
                duckHunt_enemy = [];
                
                //settings for bullets
                duckHunt_bulletFrame = 0;
                duckHunt_liveBullets = 0;
                duckHunt_fired = false; //checks to see if player already fired
                duckHunt_bullets = [];
                
                //game settings
                duckHunt_enemyCnt = 0;
                duckHunt_gameOver = false;
                
                //reset all bullets
                for(var i = 0; i < bullets.length; i++)
                {
                    bullets[i].fire = 0;
                    bullets[i].bulletDir = "right";
                }
                
                hurt_timer = 0;
                hurt_timer_passed = 0;
                start_hurt_timer = false;
                player[0].hurt = false;
                
                signal_timer = 0;
                signal_timer_passed = 0;
                start_timer = false;
                collected_signal = false;
                //////////////////////////////////////////////////////////////////////////
                

            }
            break;
    }
};

var level3StoryBackground = function()
{
    background(3, 102, 242);
    noStroke();
    
    //the moon
    fill(240, 240, 195);
    ellipse(49,38,40,40);
    // sky
    var n1 = a;
    for (var x=0; x<=400; x+=8) {
        var n2 = 0;
        for (var y=0; y<=429; y+=8) {
            var c = map(noise(n1,n2),0,1,0,255);
            fill(c, c, c + 0, 150);
            rect(x,y,8,8);
            n2 += 0.08; // step size in noise
        }
        n1 += 0.04; // step size in noise
    }
    a += 0.005;  // speed of clouds
    
    pushMatrix();

        if(player[0].position.y < 900)
        {
            translate(camera_x, camera_y - player[0].position.y);
        }
        else
        {
            translate(camera_x, camera_y - 900);
        }
        
        //Create building background and windows
        
        //building outlines
        stroke(82, 82, 82);
        //stroke(0, 0, 0);
        
        //left side of windows on far left
        fill(115, 115, 115);
        rect(0, -301, 85, 1500);
        
        //right and left side of widows on far left
        fill(115, 115, 115);
        rect(150, -301, 130, 1500);
        
        //right side of windows on far right
        fill(115, 115, 115);
        rect(345, -301, 85, 1500);
        
        //Top wall on FL 1
        fill(115, 115, 115);
        rect(0, -251, 400, 150);
        
        noStroke();
        
        //left side of windows on far left
        fill(115, 115, 115);
        rect(0, -300, 85, 1500);
        
        //right and left side of widows on far left
        fill(115, 115, 115);
        rect(150, -300, 130, 1500);
        
        //right side of windows on far right
        fill(115, 115, 115);
        rect(345, -300, 85, 1500);
        
        //Top wall on FL 1
        fill(115, 115, 115);
        rect(0, -250, 400, 150);
        
        //left window border on FL 1
        stroke(82, 82, 82);
        fill(255, 0, 0, 0);
        rect(85, -100, 65, 99);
        
        //right window border on FL 1
        rect(280, -100, 65, 99);
        noStroke();
        
        //Top wall on FL 2
        fill(115, 115, 115);
        rect(0, 0, 400, 100);
        //left window border on FL 2
        stroke(82, 82, 82);
        fill(255, 0, 0, 0);
        rect(85, 100, 65, 99);
        
        //right window border on FL 2
        rect(280, 100, 65, 99);
        noStroke();
        
        
        //Top wall on FL 3
        fill(115, 115, 115);
        rect(0, 200, 400, 100);
        
        //left window border on FL 3
        stroke(82, 82, 82);
        fill(255, 0, 0, 0);
        rect(85, 300, 65, 99);
        
        //right window border on FL 3
        rect(280, 300, 65, 99);
        noStroke();
        
        //Top wall on FL 4
        fill(115, 115, 115);
        rect(0, 400, 400, 100);
        
        //left window border on FL 4
        stroke(82, 82, 82);
        fill(255, 0, 0, 0);
        rect(85, 500, 65, 99);
        
        //right window border on FL 4
        rect(280, 500, 65, 99);
        noStroke();
        
        //Top wall on FL 5
        fill(115, 115, 115);
        rect(0, 600, 400, 100);
        
        //left window border on FL 5
        stroke(82, 82, 82);
        fill(255, 0, 0, 0);
        rect(85, 700, 65, 99);
        
        //right window border on FL 5
        rect(280, 700, 65, 99);
        noStroke();
        
        //Top wall on FL 6
        fill(115, 115, 115);
        rect(0, 800, 400, 100);
        
        //left window border on FL 6
        stroke(82, 82, 82);
        fill(255, 0, 0, 0);
        rect(85, 900, 65, 99);
        
        //right window border on FL 6
        rect(280, 900, 65, 99);
        noStroke();
        
        
        //Last FL (DEATH)
        fill(115, 115, 115);
        rect(0, 1000, 400, 400);
        
        //left window border on lowest FL
        stroke(82, 82, 82);
        fill(255, 0, 0, 0);
        rect(85, 1100, 65, 99);
        
        //right window border on lowest FL
        rect(280, 1100, 65, 99);
        noStroke();
        
        
        stroke(0, 0, 0);
    
        //Draw platforms
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].active === true)
            {
                platforms[i].draw();
            }
            
            platforms[i].move();
        }
        
        for (var i=0; i<player.length; i++) {
            player[i].update();
            player[i].draw();
        }
        
        for (var i=0; i<guns.length; i++) {
        
            if(guns[i].collected === false)
            {
                guns[i].draw();
                guns[i].float();
            }
        
        }
        
        for (var i=0; i<antidotes.length; i++) {
        
            if(antidotes[i].collected === false)
            {
                antidotes[i].draw();
                antidotes[i].float();
            }
        
        }
        
        for (var i=0; i<enemies1.length; i++) {
        
            if(enemies1[i].dead === false)
            {
                enemies1[i].update();
                enemies1[i].draw();
                enemies1[i].checkCollision();
            }
        }
        
        for (var i=0; i<enemies2.length; i++) {
        
            if(enemies2[i].dead === false)
            {
                enemies2[i].draw();
                enemies2[i].animateWings();
                
                enemies2[i].state[enemies2[i].currState].execute(enemies2[i]);
            }
        
        }
        popMatrix();
};
/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

draw = function() {
    if(gameStart === false)
    {
        background(3, 102, 242);
        noStroke();
        
        //the moon
        fill(240, 240, 195);
        ellipse(49,38,40,40);
        // sky
        var n1 = a;
        for (var x=0; x<=400; x+=8) {
            var n2 = 0;
            for (var y=0; y<=429; y+=8) {
                var c = map(noise(n1,n2),0,1,0,255);
                fill(c, c, c + 0, 150);
                rect(x,y,8,8);
                n2 += 0.08; // step size in noise
            }
            n1 += 0.04; // step size in noise
        }
        a += 0.005;  // speed of clouds
        
        switch(gameState)
        {
            case "mainScreen":
                //draw bat
                bat.draw();
                
                //update bat state
                if (frameCount % 10 === 0){
                    bat.c++;
                }
                if (bat.c === 2){
                    bat.c = 0;
                }
                
                //move bat
                bat.wander();
                
                fill(0, 0, 0);
                textSize(20);
                
                //create title background
                fill(102, 102, 102);
                rect(7, 88, 386, 82);
                fill(56, 48, 56);
                rect(15, 94, 368, 67);
                
                //blood splatter in bottom left corner
                noStroke();
                fill(125, 6, 6);
                ellipse(35, 154, 13,13);
                ellipse(42, 158, 11,6);
                ellipse(38, 162, 3,22);
                ellipse(38, 174, 4,5);
                
                //blood splatter on g
                fill(125, 6, 6);
                ellipse(361, 154, 13,13);
                ellipse(361, 158, 5,38);
                ellipse(361, 188, 3,7);
                ellipse(365, 148, 9,10);
                
                //blood splatter near R
                fill(125, 6, 6);
                ellipse(127, 109, 13,13);
                ellipse(122, 117, 11,10);
                ellipse(120, 108, 10,10);
                ellipse(127, 126, 4,17);
                ellipse(135, 100, 4,4);
                ellipse(118, 141, 2,4);
                ellipse(127, 153, 3,4);
                
                //blood under h
                fill(125, 6, 6);
                ellipse(65, 142, 12,11);
                ellipse(68, 153, 3,18);
                
                //blood specks
                fill(125, 6, 6);
                ellipse(23, 106, 3,4);
                
                ellipse(237, 106, 3,4);
                ellipse(242, 113, 3,4);
                
                ellipse(378, 123, 3,4);
                ellipse(373, 136, 3,7);
                ellipse(378, 149, 3,3);
                
                //Title and Instructions
                fill(0, 0, 0);
                textSize(50);
                text("The Remaining", 25, 145);
                fill(255, 0, 77);
                text("The Remaining", 28, 145);
                fill(158, 52, 87);
                text("The Remaining", 31, 145);
                
                //Play click box/////////////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(218, 271, 159, 46,50);
                fill(148, 148, 148);
                rect(223, 275, 150, 38,50);
                
                fill(0, 0, 0);
                textSize(25);
                text("Play", 271, 301);
                text("Play", 271, 301);
                
                //Instructions click box//////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(18, 271, 159, 46,50);
                fill(148, 148, 148);
                rect(22, 275, 150, 38,50);
                
                fill(0, 0, 0);
                textSize(25);
                text("Instructions", 36, 301);
                text("Instructions", 36, 301);
                
                //Options click box //////////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(18, 343, 159, 46,50);
                fill(148, 148, 148);
                rect(22, 347, 150, 38,50);
                
                fill(0, 0, 0);
                textSize(25);
                text("Options", 59, 372);
                text("Options", 59, 372);
                
                //Credits click box ///////////////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(218, 343, 159, 46,50);
                fill(148, 148, 148);
                rect(223, 347, 150, 38,50);
                
                fill(0, 0, 0);
                textSize(25);
                text("Credits", 258, 372);
                text("Credits", 258, 372);
                
                stroke(0, 0, 0);
                break;
            case "instructions":
                fill(0, 0, 0);
                textSize(20);
                
                //Instructions Title
                fill(0, 0, 0);
                textSize(40);
                text("Instructions", 102, 43);
                fill(255, 0, 77);
                text("Instructions", 105, 43);
                fill(158, 52, 87);
                text("Instructions", 108, 43);
                
                //Subtitle for level
                fill(0, 0, 0);
                textSize(20);
                text("General Instructions ", 113, 73);
                fill(255, 0, 77);
                text("General Instructions ", 115, 73);
                fill(158, 52, 87);
                text("General Instructions ", 117, 73);
                
                //Add text (All text spaced with 20 pixels in between each line)
                fill(0, 0, 0);
                textSize(20);
                text("Depending on the movement settings set \nin the options menu, the player will use \neither WASD or the arrow keys for the \nmovement of the player character. \n\nIf the level allows the player to shoot a \nweapon, the spacebar should be used to \nperform that action.", 14, 98);
                
                //Second copy of text is used to thicken the words written
                text("Depending on the movement settings set \nin the options menu, the player will use \neither WASD or the arrow keys for the \nmovement of the player character. \n\nIf the level allows the player to shoot a \nweapon, the spacebar should be used to \nperform that action.", 14, 98);
                
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                
                //Create the next button based on which instructions screen you're on
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(285, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(291, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Go to", 322, 358);
                text("Go to", 322, 358);
                text("Page 2", 318, 375);
                text("Page 2", 318, 375);
                break;
            case "instructions1":
                for(var i=0; i<instructionFBZombies.length; i++)
                {
                    if(instructionFBZombies[i].animateDir === 'l')
                    {
                        instructionFBZombies[i].drawLeft();
                    }
                    else
                    {
                        instructionFBZombies[i].drawRight();
                    }
                    instructionFBZombies[i].animate();
                }
        
                //Instructions Title
                fill(0, 0, 0);
                textSize(40);
                text("Instructions", 102, 43);
                fill(255, 0, 77);
                text("Instructions", 105, 43);
                fill(158, 52, 87);
                text("Instructions", 108, 43);
                
                textAlign(CENTER, CENTER);        
                fill(0, 0, 0);
                textSize(20);
                text("Level 1: Zombie Football", 198, 73);
                fill(255, 0, 77);
                text("Level 1: Zombie Football", 200, 73);
                fill(158, 52, 87);
                text("Level 1: Zombie Football", 202, 73);
                
                fill(0, 0, 0);
                textSize(15);
                text("A Helicopter is located on the far end of the football field, to win the level you must collect the randomly placed key on the map and then make it to the helicopter. The field is overrun with football player zombies that you must avoid. Each zombie will throw only 1 football at you when you come near. If a zombie hits you, you lose regardless of health however, if a football hits you, you only lose 1 point of health.\nYou are unarmed so your only defense is to dodge the zombies. Use SPACEBAR to sprint to help dodge, however it will use energy that must be regenerated. Zombies are generated every so often, but once you get close to endzone they stop spawning so get close as fast as you can! Good luck!\n(To skip the story at beginning press P)", 10, 75, 380, 250);
                text("A Helicopter is located on the far end of the football field, to win the level you must collect the randomly placed key on the map and then make it to the helicopter. The field is overrun with football player zombies that you must avoid. Each zombie will throw only 1 football at you when you come near. If a zombie hits you, you lose regardless of health however, if a football hits you, you only lose 1 point of health.\nYou are unarmed so your only defense is to dodge the zombies. Use SPACEBAR to sprint to help dodge, however it will use energy that must be regenerated. Zombies are generated every so often, but once you get close to endzone they stop spawning so get close as fast as you can! Good luck!\n(To skip the story at beginning press P)", 10, 75, 380, 250);
    
                textAlign(LEFT);
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                
                //Create the next button based on which instructions screen you're on
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(285, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(291, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Go to", 322, 358);
                text("Go to", 322, 358);
                text("Page 3", 318, 375);
                text("Page 3", 318, 375);
                textAlign(LEFT);
                break;
            case "instructions2":
                //draw duck
                duck.draw();
                
                //update duck state
                if (frameCount%10 === 0){
                    duck.c++;
                }
                if (duck.c === 2){
                    duck.c = 0;   
                }
                
                //move duck
                duck.wander();
                
                fill(0, 0, 0);
                
                //Add text (All text spaced with 20 pixels in between each line)
                fill(0, 0, 0);
                textSize(15);
                text("You are at the Duck Pond and you find yourself in the middle of a zombie apocalypse. Your friend is on his way to come pick you up with a helicopter. However, upon his arrival, he notices that there is nowhere safe to land the helicopter. It seems the pond is being overrun by zombie ducks.\n\n It is now up to you to clear out a landing zone for your friend so you can escape. Kill 15 ducks so that you can be picked up and beat the level. However, watch out for your health as touching a duck will decrease it. You and the ducks have different amounts of health depending on the difficulty of the game. Good luck and it's duck season!", 10, 75, 380, 250);
                text("You are at the Duck Pond and you find yourself in the middle of a zombie apocalypse. Your friend is on his way to come pick you up with a helicopter. However, upon his arrival, he notices that there is nowhere safe to land the helicopter. It seems the pond is being overrun by zombie ducks.\n\n It is now up to you to clear out a landing zone for your friend so you can escape. Kill 15 ducks so that you can be picked up and beat the level. However, watch out for your health as touching a duck will decrease it. You and the ducks have different amounts of health depending on the difficulty of the game. Good luck and it's duck season!", 10, 75, 380, 250);
                //Instructions Title
                fill(0, 0, 0);
                textSize(40);
                text("Instructions", 102, 43);
                fill(255, 0, 77);
                text("Instructions", 105, 43);
                fill(158, 52, 87);
                text("Instructions", 108, 43);
                
                //Subtitle for level
                fill(0, 0, 0);
                textSize(20);
                text("Level 2: Duck Hunt", 86, 73);
                fill(255, 0, 77);
                text("Level 2: Duck Hunt", 88, 73);
                fill(158, 52, 87);
                text("Level 2: Duck Hunt", 90, 73);
                
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                
                //Create the next button based on which instructions screen you're on
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(285, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(291, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Go to", 322, 358);
                text("Go to", 322, 358);
                text("Page 4", 318, 375);
                text("Page 4", 318, 375);                
                break;
            case "instructions3":
                //initialize the tilemap for the instructions menu. This will be reran if the user backs out of this instructions page.
                if(isInstruction3Init === false)
                {
                    initTilemap(instructionpage_tilemap);
                    isInstruction3Init = true;
                }
                
                player[0].active = true;
                //Draw platforms
                for(var i = 0; i < platforms.length; i++)
                {
                    platforms[i].draw();
                }
                
                //draw the player for the animation screen
                for (i=0; i<player.length; i++) 
                {
                    player[i].update();
                    player[i].animate();
                    player[i].draw();
                    player[i].checkCollision();
                    
                }
                //draw the gun crate
                for (var i=0; i<guns.length; i++) 
                {
                    if(guns[i].collected === false)
                    {
                        guns[i].draw();
                        guns[i].float();
                    }
                }
                //draw the antidote
                for (var i=0; i<antidotes.length; i++) 
                {
                
                    if(antidotes[i].collected === false)
                    {
                        antidotes[i].draw();
                        antidotes[i].float();
                    }
                
                }
                //if the player reaches the end of the screen then reset his position. This essentially just restarts the animation
                if(player[0].position.y > 410)
                {
                    player[0].position.x = 10;
                    player[0].position.y = 0;
                    
                    antidotes[0].collected = false;
                    guns[0].collected = false;
                }
                //if we have collected a collectable and we currently using a timer then we should continue to calculte how much time has passed
                if(start_timer === true)
                {
                    signal_timer_passed = second() - signal_timer;
                }
                
                //Counters used for displaying player object collection dialouge
                if(signal_timer_passed >= 5 && collected_signal === true)
                {
                    signal_timer = 0;
                    signal_timer_passed = 0;
                    start_timer = false;
                    collected_signal = false;
                }
                
                //Instructions Title
                fill(0, 0, 0);
                textSize(40);
                text("Instructions", 102, 43);
                fill(255, 0, 77);
                text("Instructions", 105, 43);
                fill(158, 52, 87);
                text("Instructions", 108, 43);
                
                //Subtitle for level
                fill(0, 0, 0);
                textSize(20);
                text("Level 3: Slaughter Heights", 86, 73);
                fill(255, 0, 77);
                text("Level 3: Slaughter Heights", 88, 73);
                fill(158, 52, 87);
                text("Level 3: Slaughter Heights", 90, 73);
                
                //Add text (All text spaced with 20 pixels in between each line)
                fill(0, 0, 0);
                textSize(15);
                text("Some of your fellow survivors have been stricken ill due \ndue to your group's shortage of medical supplies. You \nhave been tasked with retriving vital medicine scattered \naround a rundown building called Slaughter Heights. \n\nNavigate through Slaughter Heights to collect the \nmedicine while avoiding the loose platforms and the \nzombies that lurk within. Use the scattered ammo crates \nto resupply ammo and make the undead just dead.", 14, 98);
                text("Some of your fellow survivors have been stricken ill due \ndue to your group's shortage of medical supplies. You \nhave been tasked with retriving vital medicine scattered \naround a rundown building called Slaughter Heights. \n\nNavigate through Slaughter Heights to collect the \nmedicine while avoiding the loose platforms and the \nzombies that lurk within. Use the scattered ammo crates \nto resupply ammo and make the undead just dead.", 14, 98);
                
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                
                //Create the next button based on which instructions screen you're on
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(285, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(291, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Go to", 322, 358);
                text("Go to", 322, 358);
                text("Page 5", 318, 375);
                text("Page 5", 318, 375);
                break;
            case "instructions4":
                fill(0, 0, 0);
                textSize(20);
                instruction4Heli.draw();
                instruction4Heli.animate();
                
                //Instructions Title
                fill(0, 0, 0);
                textSize(40);
                text("Instructions", 102, 43);
                fill(255, 0, 77);
                text("Instructions", 105, 43);
                fill(158, 52, 87);
                text("Instructions", 108, 43);
                
                //Subtitle for level
                fill(0, 0, 0);
                textSize(20);
                text("Level 4: The Last Stand", 98, 73);
                fill(255, 0, 77);
                text("Level 4: The Last Stand", 100, 73);
                fill(158, 52, 87);
                text("Level 4: The Last Stand", 102, 73);
                
                //Add text (All text spaced with 20 pixels in between each line)
                fill(150, 150, 150);
                textSize(15);
                textAlign(CENTER, CENTER);
                text("Control the helicopter in this level fighting against a giant bat and it's smaller bat followers. The large bat shoots lasers from it's eyes that you must avoid. You can either shoot or avoid the smaller bats that spawn in. Once the large bat has no more health you have successfully escaped and won the game!", 50, 90, 300, 200);
                text("Control the helicopter in this level fighting against a giant bat and it's smaller bat followers. The large bat shoots lasers from it's eyes that you must avoid. You can either shoot or avoid the smaller bats that spawn in. Once the large bat has no more health you have successfully escaped and won the game!", 50, 90, 300, 200);
                textAlign(LEFT);
                
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                
                //Create the next button based on which instructions screen you're on
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(285, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(291, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Go to", 322, 358);
                text("Go to", 322, 358);
                text("Page 1", 318, 375);
                text("Page 1", 318, 375);
                break;
            case "options":
                fill(0, 0, 0);
                textSize(20);
                
                //Options Title
                fill(0, 0, 0);
                textSize(40);
                text("Options", 136, 43);
                fill(255, 0, 77);
                text("Options", 139, 43);
                fill(158, 52, 87);
                text("Options", 142, 43);
                
                //Difficulty Selection Title
                textSize(25);
                fill(0, 0, 0);
                text("Set Difficulty", 139, 89);
                fill(255, 0, 77);
                text("Set Difficulty", 141, 89);
                fill(158, 52, 87);
                text("Set Difficulty", 142, 89);
                
                //Movement Controls Selection Title
                textSize(25);
                fill(0, 0, 0);
                text("Set Controls", 139, 175);
                fill(255, 0, 77);
                text("Set Controls", 141, 175);
                fill(158, 52, 87);
                text("Set Controls", 142, 175);
                
                //Hard Difficulty Button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(285, 104, 77, 36,50);
                fill(148 + hardDimmer, 148 + hardDimmer, 148 + hardDimmer);
                rect(291, 108, 66, 28,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Hard", 307, 127);
                text("Hard", 307, 127);
                
                //Normal Difficulty Button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(163, 104, 77, 36,50);
                fill(148 + normalDimmer, 148 + normalDimmer, 148 + normalDimmer);
                rect(169, 108, 66, 28,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Normal", 178, 127);
                text("Normal", 178, 127);
                
                //Easy Difficulty Button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(43, 104, 77, 36,50);
                fill(148 + easyDimmer, 148 + easyDimmer, 148 + easyDimmer);
                rect(49, 108, 66, 28,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Easy", 66, 127);
                text("Easy", 66, 127);
                
                //Create Movement Control Buttons//////////////////////
                //Movement Subtitle
                textSize(20);
                fill(0, 0, 0);
                text("Movement Controls:", 15, 205);
                fill(255, 0, 77);
                text("Movement Controls:", 16, 205);
                fill(194, 70, 111);
                text("Movement Controls:", 17, 205);
                
                //WASD Controls Button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(30, 224, 146, 70,50);
                fill(148 + wasdDimmer, 148 + wasdDimmer, 148 + wasdDimmer);
                rect(36, 229, 135, 60,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Set Movement to", 49, 253);
                text("Set Movement to", 49, 253);
                text("Use WASD", 71, 277);
                text("Use WASD", 71, 277);
                
                //Arrow Keys Button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(225, 224, 146, 70,50);
                fill(148 + arrowsDimmer, 148 + arrowsDimmer, 148 + arrowsDimmer);
                rect(231, 229, 135, 60,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Set Movement to", 244, 253);
                text("Set Movement to", 244, 253);
                text("Use Arrow Keys", 247, 277);
                text("Use Arrow Keys", 247, 277);
                
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                break;
            case "credits":
                fill(0, 0, 0);
                textSize(20);
                
                //Credits Title
                fill(0, 0, 0);
                textSize(40);
                text("Credits", 132, 43);
                fill(255, 0, 77);
                text("Credits", 135, 43);
                fill(158, 52, 87);
                text("Credits", 138, 43);
                
                //List Credits
                stroke(0, 0, 0);
                fill(0, 0, 0);
                textSize(20);
                textAlign(CENTER, CENTER);
                //Name
                text("Jamahl Savage - Level 3 & 4 Designer", 200, 150);
                text("Jamahl Savage - Level 3 & 4 Designer", 200, 150);
                
                //Name
                text("Kevin Chea - Level 2 & 4 Designer", 200, 120);
                text("Kevin Chea - Level 2 & 4 Designer", 200, 120);
                
                //Name
                text("Kevin Kleinegger - Level 1 & 4 Designer", 200, 90);
                text("Kevin Kleinegger - Level 1 & 4 Designer", 200, 90);
                
                textAlign(LEFT);
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                break;
            case "levelSelectScreen":
                fill(0, 0, 0);
                textSize(20);
                
                //Level Selection Title
                fill(0, 0, 0);
                textSize(35);
                text("Select a Level to Play", 26, 43);
                fill(255, 0, 77);
                text("Select a Level to Play", 29, 43);
                fill(156, 51, 86);
                text("Select a Level to Play", 32, 43);
                
                //Different Level Buttons
                //Level 1////////////////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(78, 69, 245, 50,50);
                fill(148, 148, 148);
                rect(83, 74, 234, 39,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Level 1: Zombie Football", 94, 98);
                text("Level 1: Zombie Football", 94, 99);
                
                //Level 2////////////////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(78, 132, 245, 50,50);
                fill(148, 148, 148);
                rect(83, 138, 234, 39,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Level 2: Duck Hunt", 94, 163);
                text("Level 2: Duck Hunt", 94, 164);
                
                //Level 3////////////////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(78, 193, 245, 50,50);
                fill(148, 148, 148);
                rect(83, 199, 234, 39,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Level 3: Slaughter Heights", 94, 223);
                text("Level 3: Slaughter Heights", 94, 224);
                
                //Level 4////////////////////////////////
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(78, 256, 245, 50,50);
                fill(148, 148, 148);
                rect(83, 262, 234, 39,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Level 4: The Last Stand", 94, 287);
                text("Level 4: The Last Stand", 94, 288);
                
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                
                if(start_prompt_timer === true)
                {
                    prompt_timer_passed = second() - prompt_timer;
                    fill(255, 255, 255);
                    textSize(25);
                    text(prompt, clickLocX, clickLocY - 10);
                }
                
                //Counters used for displaying prompt dialouge. We're resetting them
                if(prompt_timer_passed >= 5 && start_prompt_timer === true)
                {
                    prompt_timer = 0;
                    prompt_timer_passed = 0;
                    start_prompt_timer = false;
                }
                break;
            case "gameOverScreen":
                //if playing level 1 and we won
                if(currentLevel === 1 && l2.gameWin)
                {
                    beatLevel1 = true;
                    gameLost = false;
                    background(144,116,89);
                    pushMatrix();
                    translate(-1000, 0);
                    l2.drawBackground();
                    l2.heli.final = true;
                    l2.heli.animate2();
                    popMatrix();
                    textAlign(CENTER, CENTER);
                    fill(6, 143, 26);
                    textSize(70);
                    text("You Win", 200, 152);
                    fill(35, 204, 26);
                    text("You Win", 200, 151);
                    fill(0, 0, 0);
                    textSize(20);
                    textAlign(CENTER, CENTER);
                    text("You Have Secured the Helicopter to Help Rescue Other Survivors", 0, 100, 400, 200);
                    textAlign(LEFT);
                    //Create the next button based on which instructions screen you're on
                    stroke(0, 0, 0);
                    fill(179, 179, 179);
                    rect(285, 335, 110, 58,50);
                    fill(148, 148, 148);
                    rect(291, 339, 99, 50,50);
                    
                    fill(0, 0, 0);
                    textSize(15);
                    text("Next", 322, 358);
                    text("Next", 322, 358);
                    text("Level", 323, 375);
                    text("Level", 323, 375);
                }
                // else we have lost the game on level 1
                else if(currentLevel === 1 && !l2.gameWin)
                {
                    gameLost = true;
                    for(var i=0; i<gameOverFBZombies.length; i++)
                    {
                        if(gameOverFBZombies[i].animateDir === 'l')
                        {
                            gameOverFBZombies[i].drawLeft();
                        }
                        else
                        {
                            gameOverFBZombies[i].drawRight();
                        }
                        gameOverFBZombies[i].animate();
                    }
                    
                    textAlign(CENTER, CENTER);
                    fill(255, 0, 0);
                    textSize(50);
                    text("Game Over", 200, 200);
                    textSize(20);
                    text("The zombies won this time, try again!", 200, 250);
                    stroke(0, 0, 0);
                    fill(179, 179, 179);
                    rect(285, 335, 110, 58,50);
                    fill(148, 148, 148);
                    rect(291, 339, 99, 50,50);
                    
                    textAlign(LEFT);
                    fill(0, 0, 0);
                    textSize(15);
                    text("Retry", 322, 358);
                    text("Retry", 322, 358);
                    text("Level", 323, 375);
                    text("Level", 323, 375);
                }
                if(currentLevel === 2)
                {
                    background(0, 0, 0);
                    fill(255, 255, 255);
                    textSize(100);
                    noStroke();
                    //lose screen
                    if (duckHunt_enemyCnt > 15){
                        fill(255, 0, 0);
                        text("YOU", width/2 - 105, height/2 - 40);
                        text("LOSE", width/2 - 120, height/2 + 40);
                        ellipse(150, 280, 20, 20);
                        ellipse(250, 280, 20, 20);
                        arc(200, 380, 150, 120, 7/6 * PI, 11/6*PI);
                        fill(0, 0, 0);
                        arc(200, 380, 140, 110, 7/6 * PI, 11/6*PI);
                        
                        gameLost = true;
                        duckHunt_gameOver = false;
                        
                        stroke(0, 0, 0);
                        fill(179, 179, 179);
                        rect(285, 335, 110, 58,50);
                        fill(148, 148, 148);
                        rect(291, 339, 99, 50,50);
                        
                        textAlign(LEFT);
                        fill(0, 0, 0);
                        textSize(15);
                        text("Retry", 322, 358);
                        text("Retry", 322, 358);
                        text("Level", 323, 375);
                        text("Level", 323, 375);
                    }
                    //win screen
                    else{
                        fill(255, 210, 61);
                        text("YOU", width/2 - 105, height/2 - 40);
                        text("WIN", width/2 - 95, height/2 + 40);
                        arc(200, 260, 100, 150, 0, PI);
                        rect(193, 310, 14, 50);
                        arc(200, 360, 40, 20, PI, 2*PI);
                        ellipse(170, 290, 60, 50);
                        ellipse(230, 290, 60, 50);
                        fill(0, 0, 0);
                        arc(155, 292, 16, 20, 1/3*PI, 4/3*PI);
                        arc(245, 292, 16, 20, 0, 2/3*PI);
                        arc(245, 292, 16, 20, 5/3*PI, 2*PI);
                        
                        beatLevel2 = true;
                        gameLost = false;
                        textAlign(LEFT);
                        
                        stroke(0, 0, 0);
                        fill(179, 179, 179);
                        rect(285, 335, 110, 58,50);
                        fill(148, 148, 148);
                        rect(291, 339, 99, 50,50);
                        
                        fill(0, 0, 0);
                        textSize(15);
                        text("Next", 322, 358);
                        text("Next", 322, 358);
                        text("Level", 323, 375);
                        text("Level", 323, 375);
                    }
                }
                //if playing level 3 and we won
                if(currentLevel === 3 && score === 10)
                {
                    beatLevel3 = true;
                    gameLost = false;
                    
                    fill(6, 143, 26);
                    textSize(70);
                    text("You Win", 62, 152);
                    fill(35, 204, 26);
                    text("You Win", 65, 151);
                    fill(255, 255, 255);
                    textSize(20);
                    text("Your Allies Will Survive the Night", 53, 200);
                    
                    //Create the next button based on which instructions screen you're on
                    stroke(0, 0, 0);
                    fill(179, 179, 179);
                    rect(285, 335, 110, 58,50);
                    fill(148, 148, 148);
                    rect(291, 339, 99, 50,50);
                    
                    fill(0, 0, 0);
                    textSize(15);
                    text("Next", 322, 358);
                    text("Next", 322, 358);
                    text("Level", 323, 375);
                    text("Level", 323, 375);
                    
                }
                //else we have lost the game on level 3
                else if(currentLevel === 3 && score !== 10)
                {
                    gameLost = true;
                    background(0, 0, 0);
                    fill(145, 5, 5);
                    textSize(50);
                    text("Game Over", 62, 152);
                    fill(222, 165, 165);
                    text("Game Over", 65, 151);
                    fill(255, 196, 196);
                    textSize(20);
                    text("You Died", 160, 200);
                
                    // fill(0, 0, 0);
                    // textSize(20);
                    // text(mouseX, 10, 118);
                    // text(mouseY, 90, 117);
                    
                    
                    //Create the next button based on which instructions screen you're on
                    stroke(0, 0, 0);
                    fill(179, 179, 179);
                    rect(285, 335, 110, 58,50);
                    fill(148, 148, 148);
                    rect(291, 339, 99, 50,50);
                    
                    
                    fill(0, 0, 0);
                    textSize(15);
                    text("Retry", 322, 358);
                    text("Retry", 322, 358);
                    text("Level", 323, 375);
                    text("Level", 323, 375);
                    
                }
                //if playing level 4 and we won
                if(currentLevel === 4 && l4.boss.health <= 0)
                {
                    //fireworks
                    for (var j = 0; j < firework.length; j++) {
                        if (firework[j].step === 0) {
                            firework[j].position.set(200, 450);
                            firework[j].target.set(random(100, 300), random(50, 120));
                            firework[j].direction.set(firework[j].target.x - firework[j].position.x, firework[j].target.y - firework[j].position.y);
                            var s = random(1, 2) / 100;
                            firework[j].direction.mult(s);
                            firework[j].step++;
                        } 
                        else if (firework[j].step === 1) {
                            firework[j].draw();
                        } 
                        else if (firework[j].step === 2) {
                            for (var i = 0; i < firework[j].explosions.length; i++) {
                                firework[j].explosions[i].draw();   
                            } 
                            if (firework[j].explosions[0].timer <= 0) {
                                firework[j].step = 0;   
                            }
                        }
                    }
                    
                    instruction4Heli_L4.draw();
                    instruction4Heli_L4.animate_L4();
                    
                    beatLevel4 = true;
                    gameLost = false;
                    fill(6, 143, 26);
                    textSize(70);
                    text("You Win", 62, 152);
                    fill(35, 204, 26);
                    text("You Win", 65, 151);
                    fill(255, 255, 255);
                    textSize(20);
                    textAlign(CENTER);
                    text("Congrats, you have escaped!", 200, 200);
                    textAlign(LEFT);
                }
                //else we have lost the game on level 4
                else if(currentLevel === 4 && l4.heli.health <= 0)
                {
                    gameLost = true;
                    background(0, 0, 0);
                    
                    //does an explosion
                    if(l4.do_explosion === true)
                    {
                        for (var i=0; i<100; i++) 
                        {
                            fire_explosion.push(new fireExplodeObj(200, 200));
                        }
                        l4.do_explosion = false;
                    }
                    for(var i = 0; i < fire_explosion.length; i++)
                    {
                        if(fire_explosion[i].timeLeft > 0)
                        {
                            fire_explosion[i].draw();
                            fire_explosion[i].move();
                        }
                        else
                        {
                            fire_explosion.splice(i,1);
                        }
                    }
                    
                    fill(145, 5, 5);
                    textSize(50);
                    text("Game Over", 62, 152);
                    fill(222, 165, 165);
                    text("Game Over", 65, 151);
                    fill(255, 196, 196);
                    textSize(20);
                    text("You Died", 160, 200);
                    
                    //Create the next button based on which instructions screen you're on
                    stroke(0, 0, 0);
                    fill(179, 179, 179);
                    rect(285, 335, 110, 58,50);
                    fill(148, 148, 148);
                    rect(291, 339, 99, 50,50);
                    
                    fill(0, 0, 0);
                    textSize(15);
                    text("Retry", 322, 358);
                    text("Retry", 322, 358);
                    text("Level", 323, 375);
                    text("Level", 323, 375);
                }
        
                //Create the back button
                stroke(0, 0, 0);
                fill(179, 179, 179);
                rect(4, 335, 110, 58,50);
                fill(148, 148, 148);
                rect(10, 339, 99, 50,50);
                
                fill(0, 0, 0);
                textSize(15);
                text("Back to", 33, 358);
                text("Back to", 33, 358);
                text("Main Menu", 24, 375);
                text("Main Menu", 24, 375);
                break;
        }
        
        //Unlock Level 2 hook
        //Press key 2
        if(keyArray[50] === 1)
        {
            beatLevel1 = true;
        }
        
        //Unlock Level 3 hook
        //Press key 3
        if(keyArray[51] === 1)
        {
            beatLevel1 = true;
            beatLevel2 = true;
        }
        
        //Unlock Level 4 hook
        //Press key 4
        if(keyArray[52] === 1)
        {
            beatLevel1 = true;
            beatLevel2 = true;
            beatLevel3 = true;
        }
    }
    else if(gameStart === true)
    {
        //Based on the user's selected level, we load that level's tile map only once
        if(initialize_tilemap === false)
        {
            if(currentLevel === 1)
            {
                l2.resetVars();
                l2.initTilemap(); 
            }
            else if(currentLevel === 2)
            {
                duckHunt_initTilemap();
            }
            else if(currentLevel === 3)
            {
                initTilemap(level3_tilemap);
            }
            else if(currentLevel === 4)
            {
                l4.resetVars();
                l4.setUpGame();
            }
            initialize_tilemap = true;
        }
        
        if(currentLevel === 1) //level 1
        {
            //displays story at beginning of game
            if(l2.story)
            {
                background(144,116,89);
                pushMatrix();
                translate(l2.storyTranslate, 0); //scrolls map as story is displayed
                l2.drawBackground();
                l2.drawZombies();
                popMatrix();
                s1TextBox.draw();
                s1TextBox.move();
                
                if(l2.storyTranslate > 0)
                {
                    l2.story = false;
                }
                if(keyArray[80] === 1) //press p to skip story
                {
                    l2.story = false;
                }
            }
            else
            {
                background(144,116,89);
                pushMatrix();
                translate(l2.gameX, 0);
                l2.drawBackground(); 
                l2.drawZombies();
                if(l2.player.direction === 0)
                {l2.player.drawRight();}
                else
                {l2.player.drawLeft();}
                l2.player.move();
                l2.player.checkCollisions();  
                if(l2.gameStart) //only moves zombies when game has started
                {
                    l2.generateZombies();
                    l2.moveZombies();
                }
                else
                {
                    fill(255, 0, 0);
                    textSize(30);
                    textAlign(CENTER, CENTER);
                    text("Move in any\ndirection to start", 200, 200);
                    textAlign(LEFT);
                }

                popMatrix();
                if(l2.player.dead === true || l2.gameWin) 
                {
                    gameState = "gameOverScreen";
                    gameStart = false;
                }
            } 
            strokeWeight(1);
        }
        else if(currentLevel === 2) //level 2
        {
            //displays story at beginning of game
            if(story2Bool)
            {
                background(31, 122, 13);
                pushMatrix();
                if (duckHunt_player.position.x > 1800){
                    translate(-1600, 0);
                }
                else if (duckHunt_player.position.x > 200 ){
                    translate(width/2 - duckHunt_player.position.x, 0);
                }
                
                if (duckHunt_player.position.y > 1000){
                    translate(0, -800);
                }
                else if (duckHunt_player.position.y > 200){
                    translate(0, height/2 - duckHunt_player.position.y);
                }
                //draws left road
                fill(94, 94, 94);
                stroke(94, 94, 94);
                quad(650, 0, 800, 0, 660, 140, 540, 100);
                rect(540, 100, 120, 310);
                quad(540, 410, 660, 360, 780, 480, 660, 530);
                rect(660, 480, 120, 220);
                quad(660, 700, 780, 660, 900, 800, 820, 900);
                quad(820, 900, 900, 800, 1010, 1000, 900, 1060);
                quad(900, 1060, 1010, 1000, 1160, 1215, 1020, 1215);
                quad(1020, 1215, 1100, 1135, 1220, 1240, 1200, 1215);
                
                //draws right path
                fill(158, 158, 158);
                stroke(158, 158, 158);
                rect(1800, 500, 200, 50);
                quad(1800, 500, 1850, 540, 1700, 610, 1670, 560);
                quad(1670, 560, 1730, 570, 1690, 680, 1640, 640);
                rect(1640, 640, 60, 110);
                quad(1640, 720, 1700, 750, 1610, 840, 1560, 800);
                quad(1560, 800, 1620, 820, 1560, 950, 1500, 920);
                rect(1500, 920, 60, 100);
                quad(1500, 1020, 1560, 1000, 1670, 1220, 1600, 1220);
                duckHunt_drawBackground();
                popMatrix();
                s2TextBox.draw();
                s2TextBox.move1();
                
                if(s2TextBox.y < -100)
                {
                    story2Bool = false;
                }
                if(keyArray[80] === 1)
                {
                    story2Bool = false;
                }  
            }
            else
            {
                background(31, 122, 13);
                pushMatrix();
                
                if (duckHunt_player.position.x > 1800){
                    translate(-1600, 0);
                }
                else if (duckHunt_player.position.x > 200 ){
                    translate(width/2 - duckHunt_player.position.x, 0);
                }
                
                if (duckHunt_player.position.y > 1000){
                    translate(0, -800);
                }
                else if (duckHunt_player.position.y > 200){
                    translate(0, height/2 - duckHunt_player.position.y);
                }
                
                //draws left road
                fill(94, 94, 94);
                stroke(94, 94, 94);
                quad(650, 0, 800, 0, 660, 140, 540, 100);
                rect(540, 100, 120, 310);
                quad(540, 410, 660, 360, 780, 480, 660, 530);
                rect(660, 480, 120, 220);
                quad(660, 700, 780, 660, 900, 800, 820, 900);
                quad(820, 900, 900, 800, 1010, 1000, 900, 1060);
                quad(900, 1060, 1010, 1000, 1160, 1215, 1020, 1215);
                quad(1020, 1215, 1100, 1135, 1220, 1240, 1200, 1215);
                
                //draws right path
                fill(158, 158, 158);
                stroke(158, 158, 158);
                rect(1800, 500, 200, 50);
                quad(1800, 500, 1850, 540, 1700, 610, 1670, 560);
                quad(1670, 560, 1730, 570, 1690, 680, 1640, 640);
                rect(1640, 640, 60, 110);
                quad(1640, 720, 1700, 750, 1610, 840, 1560, 800);
                quad(1560, 800, 1620, 820, 1560, 950, 1500, 920);
                rect(1500, 920, 60, 100);
                quad(1500, 1020, 1560, 1000, 1670, 1220, 1600, 1220);
                
                duckHunt_drawBackground();
                
                popMatrix();
            
                //draw score
                fill(96, 252, 234);
                textSize(12);
                text("Health: " + (duckHunt_player.health + 1), 320, 376);
                text("Score: " + (30 - duckHunt_enemyCnt), 320, 390);
            
                if(duckHunt_gameOver === true)
                {
                    gameState = "gameOverScreen";
                    gameStart = false;
                }    
            }

        }
        
        else if(currentLevel === 3) //level 3
        {
            //displays story at beginning of game
            if(story3Bool)
            {
                level3StoryBackground();
                s3TextBox.draw();
                s3TextBox.move1();
                
                if(s3TextBox.y < 0)
                {
                    story3Bool = false;
                }
                if(keyArray[80] === 1)
                {
                    story3Bool = false;
                }  
            }
            else
            {
                background(3, 102, 242);
                noStroke();
                
                //the moon
                fill(240, 240, 195);
                ellipse(49,38,40,40);
                // sky
                var n1 = a;
                for (var x=0; x<=400; x+=8) {
                    var n2 = 0;
                    for (var y=0; y<=429; y+=8) {
                        var c = map(noise(n1,n2),0,1,0,255);
                        fill(c, c, c + 0, 150);
                        rect(x,y,8,8);
                        n2 += 0.08; // step size in noise
                    }
                    n1 += 0.04; // step size in noise
                }
                a += 0.005;  // speed of clouds
                
                pushMatrix();
                    if(player[0].position.y < 900)
                    {
                        translate(camera_x, camera_y - player[0].position.y);
                    }
                    else
                    {
                        translate(camera_x, camera_y - 900);
                    }
                    
                    //Create building background and windows
                    
                    //building outlines
                    stroke(82, 82, 82);
                    
                    //left side of windows on far left
                    fill(115, 115, 115);
                    rect(0, -301, 85, 1500);
                    
                    //right and left side of widows on far left
                    fill(115, 115, 115);
                    rect(150, -301, 130, 1500);
                    
                    //right side of windows on far right
                    fill(115, 115, 115);
                    rect(345, -301, 85, 1500);
                    
                    //Top wall on FL 1
                    fill(115, 115, 115);
                    rect(0, -251, 400, 150);
                    
                    noStroke();
                    
                    //left side of windows on far left
                    fill(115, 115, 115);
                    rect(0, -300, 85, 1500);
                    
                    //right and left side of widows on far left
                    fill(115, 115, 115);
                    rect(150, -300, 130, 1500);
                    
                    //right side of windows on far right
                    fill(115, 115, 115);
                    rect(345, -300, 85, 1500);
                    
                    //Top wall on FL 1
                    fill(115, 115, 115);
                    rect(0, -250, 400, 150);
                    
                    //left window border on FL 1
                    stroke(82, 82, 82);
                    fill(255, 0, 0, 0);
                    rect(85, -100, 65, 99);
                    
                    //right window border on FL 1
                    rect(280, -100, 65, 99);
                    noStroke();
                    
                    //Top wall on FL 2
                    fill(115, 115, 115);
                    rect(0, 0, 400, 100);
                    //left window border on FL 2
                    stroke(82, 82, 82);
                    fill(255, 0, 0, 0);
                    rect(85, 100, 65, 99);
                    
                    //right window border on FL 2
                    rect(280, 100, 65, 99);
                    noStroke();
                    
                    
                    //Top wall on FL 3
                    fill(115, 115, 115);
                    rect(0, 200, 400, 100);
                    
                    //left window border on FL 3
                    stroke(82, 82, 82);
                    fill(255, 0, 0, 0);
                    rect(85, 300, 65, 99);
                    
                    //right window border on FL 3
                    rect(280, 300, 65, 99);
                    noStroke();
                    
                    //Top wall on FL 4
                    fill(115, 115, 115);
                    rect(0, 400, 400, 100);
                    
                    //left window border on FL 4
                    stroke(82, 82, 82);
                    fill(255, 0, 0, 0);
                    rect(85, 500, 65, 99);
                    
                    //right window border on FL 4
                    rect(280, 500, 65, 99);
                    noStroke();
                    
                    //Top wall on FL 5
                    fill(115, 115, 115);
                    rect(0, 600, 400, 100);
                    
                    //left window border on FL 5
                    stroke(82, 82, 82);
                    fill(255, 0, 0, 0);
                    rect(85, 700, 65, 99);
                    
                    //right window border on FL 5
                    rect(280, 700, 65, 99);
                    noStroke();
                    
                    //Top wall on FL 6
                    fill(115, 115, 115);
                    rect(0, 800, 400, 100);
                    
                    //left window border on FL 6
                    stroke(82, 82, 82);
                    fill(255, 0, 0, 0);
                    rect(85, 900, 65, 99);
                    
                    //right window border on FL 6
                    rect(280, 900, 65, 99);
                    noStroke();
                    
                    //Last FL (DEATH)
                    fill(115, 115, 115);
                    rect(0, 1000, 400, 400);
                    
                    //left window border on lowest FL
                    stroke(82, 82, 82);
                    fill(255, 0, 0, 0);
                    rect(85, 1100, 65, 99);
                    
                    //right window border on lowest FL
                    rect(280, 1100, 65, 99);
                    noStroke();
                
                    stroke(0, 0, 0);
                
                    //Draw platforms
                    for(var i = 0; i < platforms.length; i++)
                    {
                        if(platforms[i].active === true)
                        {
                            platforms[i].draw();
                        }
                        platforms[i].move();
                    }
                    
                    for (var i=0; i<player.length; i++) {
                        player[i].update();
                        player[i].move();
                        player[i].draw();
                        player[i].checkCollision();
                    }
                    
                    for (var i=0; i<guns.length; i++) {
                        if(guns[i].collected === false)
                        {
                            guns[i].draw();
                            guns[i].float();
                        }
                    }
                    
                    for (var i=0; i<antidotes.length; i++) {
                        if(antidotes[i].collected === false)
                        {
                            antidotes[i].draw();
                            antidotes[i].float();
                        }
                    }
                    
                    for (var i=0; i<enemies1.length; i++) {
                        if(enemies1[i].dead === false)
                        {
                            enemies1[i].update();
                            enemies1[i].draw();
                            enemies1[i].checkCollision();
                        }
                    }
                    
                    zombieMovement(); //Movement of zombies
                    
                    for (var i=0; i<enemies2.length; i++) {
                        if(enemies2[i].dead === false)
                        {
                            enemies2[i].draw();
                            enemies2[i].animateWings();
                            
                            enemies2[i].state[enemies2[i].currState].execute(enemies2[i]);
                        }
                    }
                    
                    for(var i = 0; i < blood_splatter.length; i++)
                    {
                        if(blood_splatter[i].timeLeft > 0)
                        {
                            blood_splatter[i].draw();
                            blood_splatter[i].move();
                        }
                        else
                        {
                            blood_splatter.splice(i,1);
                        }
                    }
                    
                    checkFire();
                    for (var i =0; i < bullets.length; i++) 
                    {
                        if (bullets[i].fire === 1) 
                        {
                            bullets[i].draw();
                        }
                    }
                
                popMatrix();
                
                //Timers and UI display
                if(start_timer === true)
                {
                    signal_timer_passed = frameCount - signal_timer;
                }
                
                //Counters used for displaying player item collection dialouge
                if(signal_timer_passed >= 300 && collected_signal === true)
                {
                    signal_timer = 0;
                    signal_timer_passed = 0;
                    start_timer = false;
                    collected_signal = false;
                }
                
                //timer for invulnerability period after being hurt
                if(start_hurt_timer === true)
                {
                    hurt_timer_passed = frameCount - hurt_timer;
                }
                
                //Counters used for displaying when the player is hurt
                if(hurt_timer_passed >= 300 && start_hurt_timer === true)
                {
                    hurt_timer = 0;
                    hurt_timer_passed = 0;
                    start_hurt_timer = false;
                    player[0].hurt = false;
                }
                
                if(player[0].active === false)
                {
                    fill(0, 0, 0);
                    textSize(40);
                    text("Move in Any ", 78, 148);
                    text("Direction To Start!", 32, 187);
                    
                    fill(250, 0, 83);
                    textSize(40);
                    text("Move in Any ", 81, 148);
                    text("Direction To Start!", 35, 187);
                    
                    if(useArrowKeys === true )
                    {
                        //Left, right, and up controls to activate
                        if (keyArray[LEFT] === 1 || keyArray[RIGHT] === 1 || keyArray[UP] === 1) {
                            player[0].active = true;
                            player[0].jump = 1;
                            for (var i = 0; i < enemies1.length; i++)
                            {
                                enemies1[i].jump = 1;
                            }
                        }
                    }
                    else if(useArrowKeys === false )
                    {
                        //A, D, and W controls to activate
                        if (keyArray[65] === 1 || keyArray[68] === 1 || keyArray[87] === 1) 
                        {
                            player[0].active = true;
                            player[0].jump = 1;
                            for (var i = 0; i < enemies1.length; i++)
                            {
                                enemies1[i].jump = 1;
                            }
                        }
                        
                    }
                }
                
                //Display Score
                fill(255, 255, 255);
                textSize(15);
                text("Antidotes Collected: ", 240, 19);
                textSize(15);
                text(score, 380, 19);
                
                if(score === 10)
                {
                    gameState = "gameOverScreen";
                    gameStart = false;
                }
                
                //Display player health
                if(player[0].health > 1)
                {
                    fill(255, 255, 255);
                    textSize(15);
                    text("HP: ", 15, 19);
                    textSize(15);
                    text(player[0].health, 45, 19);
                }
                else
                {
                    fill(245, 135, 135);
                    textSize(27);
                    text("HP: ", 10, 26);
                    textSize(37);
                    fill(255, 0, 0);
                    text(player[0].health, 60, 28);
                }
                
                //Display player's ammo
                if(player[0].ammo > 0)
                {
                    fill(255, 255, 255);
                    textSize(15);
                    text("Ammo: ", 100, 19);
                    textSize(15);
                    text(player[0].ammo, 150, 19);
                }
                else
                {
                    fill(255, 255, 255);
                    textSize(15);
                    text("Ammo: ", 100, 19);
                    fill(255, 161, 161);
                    textSize(15);
                    text("NO AMMO", 150, 19);
                }                
            }
        }
        
        else if(currentLevel === 4) //level 4
        {
            //displays story at beginning of game
            if(story4Bool)
            {
                background(3, 102, 242);
                noStroke();
                
                // sky
                var n1 = a;
                for (var x=0; x<=400; x+=8) {
                    var n2 = 0;
                    for (var y=0; y<=429; y+=8) {
                        var c = map(noise(n1,n2),0,1,0,255);
                        fill(c, c, c + 0, 150);
                        rect(x,y,8,8);
                        n2 += 0.08; // step size in noise
                    }
                    n1 += 0.04; // step size in noise
                }
                a += 0.005;  // speed of clouds
                l4.heli.draw();
                l4.boss.draw();
                l4.boss.animateWings();
                s4TextBox.draw();
                s4TextBox.move1();
                
                if(s4TextBox.y < 0)
                {
                    story4Bool = false;
                }
                if(keyArray[80] === 1)
                {
                    story4Bool = false;
                }                  
            }
            else
            {
                background(3, 102, 242);
                noStroke();
                
                // sky
                var n1 = a;
                for (var x=0; x<=400; x+=8) {
                    var n2 = 0;
                    for (var y=0; y<=429; y+=8) {
                        var c = map(noise(n1,n2),0,1,0,255);
                        fill(c, c, c + 0, 150);
                        rect(x,y,8,8);
                        n2 += 0.08; // step size in noise
                    }
                    n1 += 0.04; // step size in noise
                }
                a += 0.005;  // speed of clouds
                
                l4.heli.draw();
                l4.heli.move();
                l4.boss.draw();
                l4.boss.animateWings();

                if(l4.gameStart)
                {
                    l4.boss.shootLasers();
                    l4.boss.drawLasers();
                    if (frameCount - l4.larryFrame > l4.spawnRate)
                    {
                        for (var k = 0; k < l4.larrys.length; k++)
                        {
                            if (l4.larrys[k].dead === true)
                            {
                                l4.larrys[k].spawnLarry();
                                break;
                            }
                        }
                        l4.larryFrame = frameCount;
                    }
                    
                    for (var k = 0; k < l4.larrys.length; k++)
                    {
                        if (l4.larrys[k].dead === false)
                        {
                            l4.larrys[k].draw();
                            l4.larrys[k].move();
                            l4.larrys[k].animateWings();
                            l4.larrys[k].checkCollision();
                        }
                    }  
                    checkFire_4();
                    for (var i =0; i<5; i++) 
                    {
                        if (l4.bullets[i].fire === 1 ) 
                        {
                            l4.bullets[i].draw();
                        }
                    }
                    for (var i =0; i<5; i++) 
                    {
                        if (l4.bullets2[i].fire === 1 ) 
                        {
                            l4.bullets2[i].draw();
                        }
                    }
                }
                else
                {
                    fill(255, 0, 0);
                    textSize(30);
                    textAlign(CENTER, CENTER);
                    text("Move in any\ndirection to start", 200, 200);
                    textAlign(LEFT);
                }
                
                if(l4.heli.health <= 0 || l4.boss.health <= 0)
                {
                    gameState = "gameOverScreen";
                    gameStart = false;
                    strokeWeight(1);
                }
                
                //draws health bar for boss at bottom of screen
                fill(255, 0, 0);
                textSize(20);
                textAlign(CENTER);
                text("The Bat", 200, 380);
                textAlign(LEFT);
                rect(50, 390, 300/l4.boss.maxHealth * l4.boss.health, 5);
                stroke(0);
                strokeWeight(1);
                noFill();
                rect(50, 390, 300, 5);
            }
        }
        
        //hooks for navigating to game over screen
        if(keyArray[192] === 1) //navigate to gameover screen by pressing "`"(backquote)
        {
            gameState = "gameOverScreen";
            gameStart = false;
        }
        if(keyArray[53] === 1) //5 key is hook for game win screen
        {
            if(currentLevel === 1)
            {
                gameState = "gameOverScreen";
                gameStart = false;
                l2.gameWin = true;                
            }
            else if(currentLevel === 2)
            {
                gameState = "gameOverScreen";
                gameStart = false;
                duckHunt_enemyCnt = 0;            
            }
            else if(currentLevel === 3)
            {
                gameState = "gameOverScreen";
                gameStart = false;
                score = 10;    
            }
            else if(currentLevel === 4)
            {
                gameState = "gameOverScreen";
                gameStart = false;
                l4.boss.health = 0;    
            }
        }
    }
};



