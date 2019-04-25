// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 545;
canvas.height = 416;

var mapheight = canvas.height; //416px
var mapwidth = canvas.width; //545 px

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

//image bonus addbomb
var b_addbombReady = false;
var b_addbombImage = new Image();
b_addbombImage.onload = function () {
	b_addbombReady = true;
};
b_addbombImage.src = "ressources/images/bonuses/more.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;

};
var imageWidth = 240;
var imageHeight = 36;
var frameWidth = 20;
var frameHeight = 36;
heroImage.src = "ressources/images/smallhero.png";

var current_state = 'down';
var current_frame = 0;

var animations = {
        down: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
        left: [{x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}],
        right: [{x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}],
        up: [{x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}],
};

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


const jsonPath = "ressources/json/hero1Config.json";
var hero = deserialiseJSON(jsonPath);

const jsonPathHero2 = "ressources/json/hero2Config.json";
var hero2 = deserialiseJSON(jsonPathHero2);


const distance = 32;

//indice matrice
//0 => nothing
//1 => indestructible bloc
//2 => destrusctible bloc
//3 => bonus de vitesse !
//4 = >bonus de rayon d'explosion !
//5 = >bonus...
//6 => bonus de vitesse !
//7 = >bonus de dégât !
//8 = >bonus de rayon d'explosion !
//9 => bombe

// index                  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
const indestructibleMap = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ,1 ],  // 0
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


(function placeBonus() {
    for (var k = 3;  k<= 4; k++) {
        for (var j = 0; j < 6; j++) {
            let aleaX = Math.floor(Math.random() * 11) + 3;
            let aleaY = Math.floor(Math.random() * 7) + 3;

            if(indestructibleMap[aleaY][aleaX] === 1)
                aleaY+=1;
            else
                indestructibleMap[aleaY][aleaX]=k;
        }
    }

}());


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


function explosion(colonne, ligne){
    //haut - droite - bas - gauche
    let col = [0, 1, 0, -1];
    let lig = [-1,0, 1, 0];


    let numblocX = parseInt((hero.x+hero.middlePos)/distance);
    let numblocY = parseInt((hero.y+hero.middlePos)/distance);


    //joueur est sur la bombe
    if(ligne === numblocY && colonne === numblocX){
        alert('mort !');
        hero.cptLife--;
    }


    for(let j=0;j<4;j++){
        let i=1;
        do{
            //c'est un bloc indestructible, on sort de la boucle
            if ((indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] === 1) ||
                (indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] === 9) ){
                break;
            }

            //c'est une bloc destructible sans bonus derrière, on le casse
            else if(indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] === 2){
                indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] = 0;
                i++;
            }
            //joueur est dans le rayon de la bombe
            else if(ligne + (1*i*lig[j]) === numblocY && colonne +(1*i*col[j]) === numblocX){
                alert('mort');
                hero.cptLife--;
                i++;
            }
            //c'est du gazon, on étend le rayon de l'explosion
            else if(indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] === 0 ||
                    indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] === 6 ||
                    indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] === 7 ){
                i++;
            }

            //si c'est un bonus, on remplace par le bonus affiche
            else if(indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])]===3){
                indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])]=6;
                i++;
            }

            //si c'est un bonus, on remplace par le bonus affiche
            else if(indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] === 4){
                indestructibleMap[ligne + (1*i*lig[j])][colonne +(1*i*col[j])] = 7;
                i++;
            }
            else{
                break;
            }
        }while(i <= hero.rayon);
    }
}

// Update game objects
var update = function (modifier) {
    let XBefore = hero.x;
    let YBefore = hero.y;
    
    if (38 in keysDown){ // Player holding up
        current_state = 'up';
        hero.y -= hero.speed * modifier;
    }
	if (37 in keysDown){ // Player holding left
        current_state = 'left';
        hero.x -= hero.speed * modifier;
    }
	if (40 in keysDown){ // Player holding down
        current_state = 'down';
        hero.y += hero.speed * modifier;
    }
	if (39 in keysDown){ // Player holding right
        current_state = 'right';
        hero.x += hero.speed * modifier;
    }
    if (32 in keysDown){

        if(!hero.droppedBomb){
            //incrementation du cpt depose bomb
            hero.deposedBomb++;
            console.log(hero.deposedBomb);
            hero.droppedBomb = true;

            let numblocX = parseInt((hero.x+hero.middlePos)/distance);
            let numblocY = parseInt((hero.y+hero.middlePos)/distance);


            //placer la bombe dans la matrice
            indestructibleMap[numblocY][numblocX] = 9;

            setTimeout(function(){
                if(!(indestructibleMap[numblocY][numblocX] === 0)){
                    explosion(numblocX, numblocY);
                    indestructibleMap[numblocY][numblocX] = 0;
                    hero.droppedBomb = false;
                    let bombExplosion = new Audio("/ressources/sound/8bitbomb.mp3");
                    bombExplosion.play();
                }
            }, 3000);
        }
    }




    //teste la position du joueur sur la matrice
    var index_colonne = parseInt((hero.x+hero.middlePos)/distance);
    var index_ligne = parseInt((hero.y+hero.middlePos)/distance);


    //si la case active est un bonus de vitesse, alors on le remplace par du gazon et on augmente la vitesse du joueur
    if ((indestructibleMap[index_ligne][index_colonne]) === 6){
        let bonuSound = new Audio("/ressources/sound/bonus.mp3");
        bonuSound.play();

        //incrémente le cpt bonus speed
        hero.bonusSpeed++;
        console.log("cpt speed: " + hero.bonusSpeed);
        indestructibleMap[index_ligne][index_colonne] = 0; //on la fait depop
        hero.speed+=25;

    }


    //si la case active est un bonus de dégât, alors on le remplace par du gazon et on augmente la puissance du joueur
    if ((indestructibleMap[index_ligne][index_colonne])===7){
        let bonuSound = new Audio("/ressources/sound/bonus.mp3");
        bonuSound.play();

        //incrémente le cpt bonus rayon
        hero.bonusRayon++;
        console.log("cpt rayon: " + hero.bonusRayon);
        indestructibleMap[index_ligne][index_colonne]=0; //on la fait depop
        hero.rayon += 1; //on augmente le rayon d'explosion de la bombe
    }

    checkCollision(XBefore, YBefore);

};

// Draw everything
var render = function () {

    //Place le décor
    if(blocdestructibleReady && blocReady && grassReady && b_speedReady){
        let AxeX = 0;
        let AxeY = 0;

        for (let i = 0; i < indestructibleMap.length; i++) {

			for (let j = 0; j<indestructibleMap[0].length; j++){

                switch(indestructibleMap[i][j]){
                    case 0:
                        ctx.drawImage(grassImage, AxeX, AxeY);
                        break;
                    case 1:
                        ctx.drawImage(blocImage, AxeX, AxeY);
                        break;
                    case 2:
                    case 3:
                    case 4:
                        ctx.drawImage(blocdestructibleImage, AxeX, AxeY);
                        break;
                    case 6:
                        ctx.drawImage(b_speedImage, AxeX, AxeY);
                        break;
                    case 7:
                        ctx.drawImage(b_damageImage, AxeX, AxeY);
                        break;
                    //la bombe
                    case 9:
                        ctx.drawImage(bombImage, AxeX, AxeY);
                        break;

                }
                AxeX += distance;
			}
            AxeY += distance;
            AxeX=0;
		}
    }

    //Draw hero
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

};

/*var compteur = (function() {
    var i =0; // propriété privée

    return{ // méthodes publiques
        obtenir:function() {
            return hero.deposedBomb;
        }
        ,incrementer:function() {
            hero.deposedBomb++;
        }
    };
})();*/

function deserialiseJSON(file){
    var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': file,
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
}

/*setInterval(function(){
            console.log('tes');
            ctx.drawImage(heroImage, animations[current_state][current_frame].x * frameWidth, animations[current_state][current_frame].y * frameHeight, frameWidth, frameHeight, hero.x, hero.y, frameWidth, frameHeight);
            current_frame += 1;
                if (current_frame > 2) {
                    current_frame = 0;
                }
    }, 500);*/

function checkCollision(XBefore, YBefore){
    //mur droite
    if(hero.x+24 >= 513 )//545-32
        hero.x = 489 ; //545-(32+24) on fige le mouvement du joueur

    //mur gauche
    if(hero.x <= distance )
        hero.x = distance;

    //plafond
    if(hero.y <= distance )
        hero.y = distance;

    //bas de la map
    if(hero.y >= 358 )
        hero.y = 358;

    //détection de collision avec les blocs indestructibles et destructibles
    for (var i = 64; i < mapwidth-64; i=i+64) {
        for (var j = 64; j< mapheight-64; j=j+64){
            var blocloop = {};
            blocloop.x = i;
            blocloop.y = j;
            if (hero.x <= (blocloop.x + distance) && blocloop.x <= (hero.x + hero.heigthPx) && hero.y <= (blocloop.y + 32) && blocloop.y <= (hero.y + hero.heigthPx)) {
                hero.x = XBefore;
                hero.y = YBefore;
	        }
        }
    }
    let AxeX = 0;
    let AxeY = 0;
    for (i = 0; i < indestructibleMap.length; i++) {
		for (j = 0; j<indestructibleMap[0].length; j++){
            var blocdes = {};
            blocdes.x = AxeX;
            blocdes.y = AxeY;
            if(indestructibleMap[i][j] === 2){
                if (hero.x <= (blocdes.x + distance) && blocdes.x <= (hero.x + hero.heigthPx) && hero.y <= (blocdes.y + 32) && blocdes.y <= (hero.y + hero.heigthPx)) {
                    hero.x = XBefore;
                    hero.y = YBefore;
                }
	        }
            if(indestructibleMap[i][j] === 3 || indestructibleMap[i][j] === 4){
                if (hero.x <= (blocdes.x + distance) && blocdes.x <= (hero.x + hero.heigthPx) && hero.y <= (blocdes.y + 32) && blocdes.y <= (hero.y + hero.heigthPx)) {
                    hero.x = XBefore;
                    hero.y = YBefore;
                }
	        }

            if((indestructibleMap[i][j] === 9) && (hero.bloque)){
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
}


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
