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

//images des bonus

//image bonus vitesse
var b_speedReady = false;
var b_speedImage = new Image();
b_speedImage.onload = function () {
	b_speedReady = true;
};
b_speedImage.src = "ressources/images/bonuses/speed.png";

//image bonus damage
var b_damagedReady = false;
var b_damageImage = new Image();
b_damageImage.onload = function () {
	b_damagedReady = true;
};
b_damageImage.src = "ressources/images/bonuses/damage.png";




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


//blocs indestructibles Image
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
bombImage.src = "ressources/images/labombe.png";


// hero
var hero = {
	speed: 60,// movement in pixels per second
    x: 32,
	y: 32,
};

var speedbonus = {
    x:0,
    y:0,

}


//nombre de bombes posées sur le terrain
var bombsonmap = 0;

//nombre de bombes que le joueur a le droit de poser en même temps
var autorizedbombs = 2;



//bomb
var bomb = {
    speed: 0,
    depose: false

  };

var posX = 0;
var posY = 0;

var numblocX = 0;
var numblocY = 0;



//map decor
//0 => nothing
//1 => indestructible bloc
//2 => destrusctible bloc

//3 => bonus de vitesse !
//4 = >bonus de dégât !
//5 = >bonus de rayon d'explosion !


// index                  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
var indestructibleMap = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ,1 ],  // 0
                        [ 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1 ],  // 1
                        [ 1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 1 ],  // 2
                        [ 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ,1 ],  // 3
                        [ 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1 ],  // 4
                        [ 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1 ],  // 5
                        [ 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1 ],  // 6
                        [ 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1 ],  // 7
                        [ 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1 ],  // 8
                        [ 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1 ],  // 9
                        [ 1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 1 ],  // 10
                        [ 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1 ],  // 11
                        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ,1]]; //  12



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


    /*for the other player
    if (87 in keysDown) // Player holding up
        hero.y -= hero.speed * modifier;

	if (65 in keysDown) // Player holding left
        hero.x -= hero.speed * modifier;

	if (83 in keysDown) // Player holding down
        hero.y += hero.speed * modifier;

	if (68 in keysDown) // Player holding right
        hero.x += hero.speed * modifier;
    */


    if (32 in keysDown){ // place bomb

        //on vérifie si le joueur peut poser une bombe

        // il a le droit d'en poser 2, mais l'instanciation ne fonctionne pas
        //if(bombsonmap <= autorizedbombs){

            //on renseigne le bloc touché (va servir pour la matrice)
            numblocX = parseInt((hero.x+16)/32);
            numblocY = parseInt((hero.y+16)/32);

            //on centre la bombe
            posX = numblocX * 32;
            posY = numblocY * 32;

            bomb.depose = true;


            //EXPLOSION DE LA BOMBE - CODE A DEPLACER !!!
            //grace à la matrice, on contrôle si un bloc destructible se trouve à gauche, droite, haut ou bas

            var ligne   =   numblocY  ;
            var colonne =   numblocX  ;


            //bloc destructible à gauche ?
            if(indestructibleMap[ligne][colonne-1]==2){

                var alea = Math.floor((Math.random() * 10) + 1);

                if (alea==1){
                    //on casse le bloc, avec une chance d'avoir le bonus de vitesse
                    indestructibleMap[ligne][colonne-1]=3;
                }
                else{
                    //on teste ici les autres possibilités (bonus)
                    indestructibleMap[ligne][colonne-1]=0;
                }
            }

            //bloc destructible à droite ?
            if(indestructibleMap[ligne][colonne+1]==2){

                var alea = Math.floor((Math.random() * 10) + 1);

                if (alea==1){
                    //on casse le bloc, avec une chance d'avoir le bonus de vitesse
                    indestructibleMap[ligne][colonne+1]=3;
                }
                else{
                    //on teste ici les autres possibilités (bonus)
                    indestructibleMap[ligne][colonne+1]=0;
                }
            }

            //bloc destructible en haut ?
            if(indestructibleMap[ligne+1][colonne]==2){

                var alea = Math.floor((Math.random() * 10) + 1);

                if (alea==1){
                    //on casse le bloc, avec une chance d'avoir le bonus de vitesse
                    indestructibleMap[ligne+1][colonne]=3;
                }
                else{
                    //on teste ici les autres possibilités (bonus)
                    indestructibleMap[ligne+1][colonne]=0;
                }
            }

            //bloc destructible en bas ?
            if(indestructibleMap[ligne-1][colonne]==2){

                var alea = Math.floor((Math.random() * 10) + 1);

                if (alea==1){
                    //on casse le bloc, avec une chance d'avoir le bonus de vitesse
                    indestructibleMap[ligne-1][colonne]=3;
                }
                else{
                    //on teste ici les autres possibilités (bonus)
                    indestructibleMap[ligne-1][colonne]=0;
                }
            }





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
    if(hero.y >= 358 )
        hero.y = 358;


    //teste la position du joueur sur la matrice
            var index_colonne=parseInt((hero.x+16)/32);;
            var index_ligne=parseInt((hero.y+16)/32);;

            //si la case active est un bonus, alors on le remplace par du gazon et on augmente la vitesse du joueur
            if ((indestructibleMap[index_ligne][index_colonne])==3){

                indestructibleMap[index_ligne][index_colonne]=0; //on la fait depop

                hero.speed+=25;


            }

            //autres bonus
            /*
            if ((indestructibleMap[index_ligne][index_colonne])==3){

            }
            if ((indestructibleMap[index_ligne][index_colonne])==3){

            }
            */


    
    //détection de collision avec les blocs indestructibles et destructibles
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
        //AxeY += 32;
		for (j = 0; j<indestructibleMap[0].length; j++){
            var blocdes = {};
            //AxeX += 32;
            blocdes.x = AxeX;
            blocdes.y = AxeY;
            if(indestructibleMap[i][j] == 2){
                if (hero.x <= (blocdes.x + 32) && blocdes.x <= (hero.x + 23) && hero.y <= (blocdes.y + 32) && blocdes.y <= (hero.y + 23)) {
                    hero.x = XBefore;
                    hero.y = YBefore;
                }
	        }

            AxeX += 32;
        }
        AxeY += 32;
        AxeX=0;
    }
};

// Draw everything
var render = function () {

    //Place le décor
    if(blocdestructibleReady && blocReady && grassReady && b_speedReady){
        var AxeX = 0;
        var AxeY = 0;

        for (var i = 0; i < indestructibleMap.length; i++) {

			for (var j = 0; j<indestructibleMap[0].length; j++){

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

                    case 3:
                        ctx.drawImage(b_speedImage, AxeX, AxeY);
                        break;
                    case 4:
                        ctx.drawImage(b_damagedReady, AxeX, AxeY);
                        break;
                }
                AxeX += 32;
			}
            AxeY += 32;
            AxeX=0;
		}
    }



    //Draw hero
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

    //Draw bomb
    if(bombReady){
        ctx.drawImage(bombImage, bomb.x, bomb.y);
    }


    /*

    if(b_damageReady){
        ctx.drawImage(b_damageImage);
    }

    if(b_moreReady){
        ctx.drawImage(b_moreImage);
    }

    if(b_speedReady){
        ctx.drawImage(b_speedImage);
    }

*/



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
