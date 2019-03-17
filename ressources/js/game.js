// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 545;
canvas.height = 416;
document.body.appendChild(canvas);

mapheight = canvas.height; //416px
mapwidth = canvas.width; //545 px


// Generate background
var bgReady = false;
var bgImage = new Image();

bgImage.onload = function () {
	bgReady = true;
};

bgImage.src = "images/background.png";


function generateBackground() {
  var img = "";

  var i;
  for (i = 0; i < 17; i++) {

  }
}




// Hero image
var heroReady = false;
var heroImage = new Image();

heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/smallhero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";


//gazon
var grassReady = false;
var grassImage = new Image();
grassImage.onload = function () {
    grassReady = true;
}
grassImage.src = "images/grass.png";

//  blocs indestructibles
var blocReady = false;
var blocImage = new Image();
blocImage.onload = function () {
    blocReady = true;
}
blocImage.src = "images/indestructible.png";




//bloc destructible
var blocdestructibleReady = false;
var blocdestructibleImage = new Image();
blocdestructibleImage.onload = function () {
    blocdestructibleReady = true;
}
blocdestructibleImage.src = "images/destructible.png";







// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;



var bloc = {};





// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);




// Reset the game when the player catches a monster
var reset = function () {



    hero.x = 100;
    hero.y = 100;



	// Throw the monster somewhere on the screen randomly
	//monster.x = 32 + (Math.random() * (canvas.width - 64));
	//monster.y = 32 + (Math.random() * (canvas.height - 64));


};



// Update game objects
var update = function (modifier) {



	if (38 in keysDown) { // Player holding up


            hero.y -= hero.speed * modifier;

    }


	if (37 in keysDown) { // Player holding left


            hero.x -= hero.speed * modifier;

	}





	if (40 in keysDown) { // Player holding down

            hero.y += hero.speed * modifier;

	}



	if (39 in keysDown) { // Player holding right

            hero.x += hero.speed * modifier;

	}


    /*
    //collision avec le bloc
    if(hero.y + 24 <= bloc.y && hero.y >= bloc.y+32 && hero.x +24 <= bloc.x +32){

        //il y a collision
        //droite
        if(hero.x + 24 > bloc.x+32){
            hero.x = bloc.x + 32;
        }
        //gauche
        if(hero.x < bloc.x){
            hero.x = bloc.x-32;
        }
        //haut
        if(hero.y < bloc.y){
            hero.y = bloc.y -32;
        }
        if(hero.x + 24 > bloc.y + 32){
           hero.y = bloc.y + 32;
        }
    }
    */












    //Collision avec les murs du terrain

    //mur droite
    if(hero.x+24 >= 545-32 )
    {
        hero.x = 545-(32+24); // on fige le mouvement du joueur

    }

    //mur gauche
    if(hero.x <= 32 )
    {
        hero.x = 32
    }

    //plafond
    if(hero.y <= 32 )
    {
        hero.y = 32
    }

    //bas de la map
    if(hero.y >= 416-64 )
    {
        hero.y = 416-(32+28)
    }



    //Collisions avec les autres blocs sur le terrain

        //on place les blocs sur le terrain
        for (i = 64; i < mapwidth-64; i=i+64) {

			for (j = 64; j< mapheight-64; j=j+64){



                var blocloop = {};

                blocloop.x = i;
                blocloop.y = j;



                 //COLLISION MUR GAUCHE
                if(

                    (hero.x+24 > blocloop.x && hero.x+24 <blocloop.x+16)  //on fige que quand il est dans la partie gauche de l'écran

                        &&
                        (
                            hero.y >= blocloop.y && hero.y < blocloop.y+32

                            || hero.y+24 > blocloop.y && hero.y+24 < blocloop.y+32
                        )
                )
                {
                    hero.x = blocloop.x-24; // on fige le mouvement du joueur

                }

                //COLLISION MUR DROITE
                if(

                    (hero.x < blocloop.x+32 && hero.x > blocloop.x+16)  //on fige que quand il est dans la partie droite de l'écran

                        &&
                        (
                            hero.y >= blocloop.y && hero.y < blocloop.y+32

                            || hero.y+24 > blocloop.y && hero.y+24 < blocloop.y+32
                        )
                )
                {
                    hero.x = blocloop.x+32; // on fige le mouvement du joueur
                }


                //COLLISION PLAFOND
                if(

                    (hero.y+24 > blocloop.y && hero.y+24 < blocloop.y+16 )  //on fige que quand il est dans la partie haute de l'écran

                        &&
                        (
                            hero.x >= blocloop.x && hero.x <= blocloop.x+32 //pied gauche

                            || hero.x+24 >= blocloop.x && hero.x+24 <= blocloop.x + 32 //pied droite
                        )
                )
                {
                    hero.y = blocloop.y-24; // on fige le mouvement du joueur
                }

                //COLLISION BAS
                if(

                    (hero.y < blocloop.y+32 && hero.y > blocloop.y + 16 )  //on fige que quand il est dans la partie bas de l'écran

                        &&
                        (
                            hero.x >= blocloop.x && hero.x <= blocloop.x+32 //pied gauche

                            || hero.x+24 >= blocloop.x && hero.x+24 <= blocloop.x + 32 //pied droite
                        )
                )
                {

                        hero.y = blocloop.y+32; // on fige le mouvement du joueur

                }











			}
		}















};

// Draw everything

var render = function () {


    /*
    //place bloc
    bloc.x = canvas.width / 3;
    bloc.y = canvas.height / 2;
    */



    if(grassReady){
       	for (i = 0; i < mapwidth; i=i+32) {

			for (j = 0; j< mapheight; j=j+32){
                ctx.drawImage(grassImage, i,j);
			}
		}
    }


    //on met en place le décor indestructible
    if(blocReady){



        var x = 0;

        while (x <= mapwidth) {

            //on place les blocs horizontaux en bord
            ctx.drawImage(blocImage,x,0)
            ctx.drawImage(blocImage,x,mapheight-32)



            x=x+32;

        }

        var x = 0;

        while (x  <= mapheight) {



            //on place les blocs verticaux en bord
            ctx.drawImage(blocImage,0,x)
            ctx.drawImage(blocImage,mapwidth-32,x)



            x=x+32;

        }









        //on place les blocs sur le terrain
        for (i = 64; i < mapwidth-64; i=i+64) {

			for (j = 64; j< mapheight-64; j=j+64){
                ctx.drawImage(blocImage, i,j);
			}
		}






        //on place le block sur le terrain

        ctx.drawImage(blocImage, bloc.x, bloc.y)



    }

    if(blocdestructibleReady){

        //on place aléatoirement les blocs destructibles sur le terrain
        /*
        for (i = 32; i < 481; i=i+64) {

			for (j = 32; j< 352; j=j+64){
                ctx.drawImage(blocdestructibleImage, i,j);
			}
		}
        */

    }

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}


    /*
	if (blockReady) {
		ctx.drawImage(blockImage, 200, 200);
	}
    */


	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
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
