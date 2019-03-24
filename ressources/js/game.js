// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 545;
canvas.height = 416;

var mapheight = canvas.height; //416px
var mapwidth = canvas.width; //545 px

// Generate background Image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "ressources/images/background.png";


// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "ressources/images/smallhero.png";


//gazonbom Image
var grassReady = false;
var grassImage = new Image();
grassImage.onload = function () {
    grassReady = true;
}
grassImage.src = "ressources/images/grass.png";


//  blocs indestructibles Image
var blocReady = false;
var blocImage = new Image();
blocImage.onload = function () {
    blocReady = true;
}
blocImage.src = "ressources/images/indestructible.png";


//bloc destructible Image
var blocdestructibleReady = false;
var blocdestructibleImage = new Image();
blocdestructibleImage.onload = function () {
    blocdestructibleReady = true;
}
blocdestructibleImage.src = "ressources/images/destructible.png";


// Bombe Image
var bombReady = false;
var bombImage = new Image();
bombImage.onload = function () {
	bombReady = true;
};
bombImage.src = "ressources/images/test_bomb.png";


// hero
var hero = {
	speed: 100,// movement in pixels per second
    x: 0,
	y: 0
};

//bomb
var bomb = {
    speed: 0,
    x: 230,
    y: 195,
    depose: false
};

var posX = 0;
var posY = 0;

//map decor
//0 => nothing
//1 => indestructible bloc
//2 => destrusctible bloc
var indestructibleMap = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        [0,1,2,1,2,1,2,1,2,1,2,1,0,1,0],
                        [0,0,2,0,0,0,2,2,2,2,2,0,0,0,0],
                        [0,1,2,1,0,1,2,1,2,1,2,1,0,1,0],
                        [0,0,2,2,2,2,2,2,2,2,2,0,0,0,0],
                        [0,1,2,1,2,1,0,1,0,1,0,1,0,1,0],
                        [0,0,2,0,2,2,2,0,2,0,0,0,0,0,0],
                        [0,1,2,1,0,1,2,1,0,1,0,1,0,1,0],
                        [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
                        [0,1,2,1,0,1,0,1,0,1,0,1,0,1,0],
                        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];



// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



// Reset the game
var reset = function () {
    //todo
};


// Update game objects
var update = function (modifier) {
    var XBefore = hero.x;
    var YBefore = hero.y;
    
    if (38 in keysDown) // Player holding up
        hero.y -= hero.speed * modifier;

	if (37 in keysDown) // Player holding left
        hero.x -= hero.speed * modifier;

	if (40 in keysDown) // Player holding down
        hero.y += hero.speed * modifier;

	if (39 in keysDown) // Player holding right
        hero.x += hero.speed * modifier;

    if (32 in keysDown){ // release bomb
        posX = hero.x;
        posY = hero.y;
        bomb.depose = true;
    }


    //Collision avec les murs du terrain
    //mur droite
    if(hero.x+24 >= 545-32 )
        hero.x = 545-(32+24); // on fige le mouvement du joueur

    //mur gauche
    if(hero.x <= 32 )
        hero.x = 32;

    //plafond
    if(hero.y <= 32 )
        hero.y = 32;

    //bas de la map
    if(hero.y >= 416-64 )
        hero.y = 416-(32+28);
    
    //détection de collision avec les blocs indestructible
    for (var i = 64; i < mapwidth-64; i=i+64) {
        for (var j = 64; j< mapheight-64; j=j+64){
            var blocloop = {};
            blocloop.x = i;
            blocloop.y = j;
            if (hero.x <= (blocloop.x + 32) && blocloop.x <= (hero.x + 23) && hero.y <= (blocloop.y + 32) && blocloop.y <= (hero.y + 23)) {
                hero.x = XBefore;
                hero.y = YBefore;
	        }
        }
    }
    var AxeX = 0;
    var AxeY = 0;
    for (i = 0; i < indestructibleMap.length; i++) {
        AxeY += 32;
		for (j = 0; j<indestructibleMap[0].length; j++){
            var blocdes = {};
            AxeX += 32;
            blocdes.x = AxeX;
            blocdes.y = AxeY;
            if(indestructibleMap[i][j] == 2){
                if (hero.x <= (blocdes.x + 32) && blocdes.x <= (hero.x + 23) && hero.y <= (blocdes.y + 32) && blocdes.y <= (hero.y + 23)) {
                    hero.x = XBefore;
                    hero.y = YBefore;
                }
	        }
        }
            AxeX=0;
    }
};

// Draw everything
var render = function () {
    //on met en place le décor indestructible
    if(blocReady){
        var x = 0;
        while (x <= mapwidth) {
            //on place les blocs horizontaux en bord
            ctx.drawImage(blocImage,x,0);
            ctx.drawImage(blocImage,x,mapheight-32);
            x=x+32;
        }
        x = 0;
        while (x  <= mapheight) {
            //on place les blocs verticaux en bord
            ctx.drawImage(blocImage,0,x);
            ctx.drawImage(blocImage,mapwidth-32,x);
            x=x+32;
        }
    }

    //Place le décor
    if(blocdestructibleReady && blocReady && grassReady){
        var AxeX = 0;
        var AxeY = 0;
        //on place aléatoirement les blocs destructibles sur le terrain
        for (var i = 0; i < indestructibleMap.length; i++) {
            AxeY += 32;
			for (var j = 0; j<indestructibleMap[0].length; j++){
                AxeX += 32;
                switch(indestructibleMap[i][j]){
                    case 1:
                        ctx.drawImage(blocImage, AxeX, AxeY);
                        break;
                    case 2:
                        ctx.drawImage(blocdestructibleImage, AxeX, AxeY);
                        break;
                    case 0:
                        ctx.drawImage(grassImage, AxeX, AxeY);
                        break;
                }
			}
            AxeX=0;
		}
    }

    //Draw hero
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
    if(bombReady){
        ctx.drawImage(bombImage, bomb.x, bomb.y);
    }

    //Draw Bomb
    if(bomb.depose && bombReady){
        ctx.drawImage(bombImage, posX, posY);
    }

};







// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
