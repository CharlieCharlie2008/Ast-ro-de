//dimension zone de jeu
var LARGEUR = 600;
var HAUTEUR = 600;

var angle = 90;
var timer = 0;

var speed = 10;
var vie = 3;
var score = 0;
var best_score = 0;

var statut = "play";
//variables pour créer les sprites
var nebula, vaisseau, play, explosion;
//variables pour les images
var nebulaImg, vaisseauImg, thrustImg, rockImg, playImg, laserImg, explosionImg;
//variables pour les groupes
var rock_group;
var laser_group;

function preload() {
  //télécharger les images ici
  nebulaImg = loadImage("nebula.jpeg");
  vaisseauImg = loadImage("spaceship.png");
  thrustImg = loadImage("thrust.png");
  rockImg = loadImage("rock.png");
  playImg = loadImage("play.png");
  laserImg = loadImage("laser.png");
  explosionImg = loadAnimation(
    "e0.png",
    "e1.png",
    "e2.png",
    "e3.png",
    "e4.png",
    "e5.png",
    "e6.png",
    "e7.png",
    "e8.png",
    "e9.png",
    "e10.png",
    "e11.png",
    "e12.png",
    "e13.png",
    "e14.png",
    "e15.png"
  );
}

function setup() {
  createCanvas(LARGEUR, HAUTEUR);

  vaisseau = createSprite(LARGEUR / 2, HAUTEUR / 2, 20, 20);
  vaisseau.addAnimation("spaceship", vaisseauImg);
  vaisseau.addAnimation("thrust", thrustImg);
  vaisseau.scale = 0.15;
  vaisseau.debug = false;
  vaisseau.setCollider("rectangle", 0, 0, 500, 400);
  play = createSprite(LARGEUR / 2, HAUTEUR / 2);
  play.scale = 0.2;
  play.addImage(playImg);

  

  rock_group = createGroup();
  laser_group = createGroup();
}

function draw() {
  background(nebulaImg);
  drawSprites();


  speed += 0.01
  
  
  if (statut === "play") {
    timer++;
    play.visible = false;

    //tourner le vaisseau
    vaisseau.rotation = angle;

    if (keyDown("LEFT")) {
      angle -= 10;
    }
    if (keyDown("RIGHT")) {
      angle += 10;
    }
    //faire avancer le vaisseau
    if (keyDown("UP")) {
      vaisseau.velocityX += 5 * Math.cos(radians(angle));
      vaisseau.velocityY += 5 * Math.sin(radians(angle));
      vaisseau.changeAnimation("thrust");
    }
    if (keyWentUp("UP")) {
      vaisseau.changeAnimation("spaceship");
    }
    //faire ralentir le vaisseau
    vaisseau.velocityX *= 0.9;
    vaisseau.velocityY *= 0.9;

    //collision lasers rochers
    for (var k = 0; k < laser_group.length; k++) {
      for (var j = 0; j < rock_group.length; j++) {
        if (rock_group.get(j).isTouching(laser_group.get(k))) {
          score += 100;
          explosion = createSprite(rock_group.get(j).x, rock_group.get(j).y);
          explosion.scale = 4;
          explosion.addAnimation("explosion", explosionImg);
          explosion.lifetime =50;
          rock_group.get(j).destroy();
          
        }
      }
    }
    //collison rochers vaisseau
    for (var i = 0; i < rock_group.length; i++) {
      traverser(rock_group.get(i));
      if (vaisseau.isTouching(rock_group.get(i))) {
        explosion = createSprite(rock_group.get(i).x, rock_group.get(i).y);
        explosion.scale = 4;
        explosion.addAnimation("explosion", explosionImg);
        explosion.lifetime = 50;
        rock_group.get(i).destroy();
        vie -= 1;
      }
    }

    textFont("Georgia");
    //vie
    fill("BLACK");
    textSize(30);
    text("vie = " + vie, 25, 50);

    fill("BLACK");
    textSize(30);
    text("score = " + score, 25, 100);

    fill("RED");
    textSize(30);
    text("best score = " + best_score, 350, 50);
  

    if (vie === 0) {
      statut = "game_over";

    }


    //function
    laser_launcher();
    traverser(vaisseau);
    if (timer === 60) {
      rock_spawner();
      timer = 0;
    }
  }
    if (statut === "game_over") {
      if(score > best_score){
        best_score = score
        score = 0
      }
      textFont("Georgia");
      fill("White");
      textSize(60);
      text("Game Over", 150, 200);
      play.visible = true;
      vaisseau.visible = false;
      rock_group.destroyEach();
      if(mousePressedOver(play)){
        statut = "play";
        speed = 10;
        vie = 3
        vaisseau.visible = true;
        vaisseau.y = LARGEUR/2;
        vaisseau.x = HAUTEUR/2;

      }
    }
    

    
  
}

function traverser(sprite) {
  if (sprite.y < 1) {
    sprite.y = HAUTEUR;
  }
  if (sprite.y > HAUTEUR) {
    sprite.y = 1;
  }
  if (sprite.x < 1) {
    sprite.x = LARGEUR;
  }
  if (sprite.x > LARGEUR) {
    sprite.x = 1;
  }
}

function rock_spawner() {
  var posx = Math.random() * LARGEUR;
  var posy = Math.random() * HAUTEUR; 
  while (Math.abs(vaisseau.x - posx) < 100 && Math.abs(vaisseau.y - posy) < 100){
    posx = Math.random() * LARGEUR;
    posy = Math.random() * HAUTEUR;
  }
    var rock = createSprite(posx, posy);
  rock.addImage(rockImg);
  rock_group.add(rock);
  rock.scale = 0.3;
  rock.rotationSpeed = Math.random() * 6 - 3;
  rock.velocityX = Math.random() * speed - 5;
  rock.velocityY = Math.random() * speed - 5;
  rock.debug = false;
  rock.setCollider("circle", 0, 0, 210);
}
function laser_launcher() {
  if (keyDown("space") && statut === "play" && laser_group.length < 15) {
    var laser = createSprite(vaisseau.x + Math.cos(radians(angle)) *60, vaisseau.y +Math.sin(radians(angle)) *60);
    laser.addImage(laserImg);
    laser.rotation = angle;
    laser.debug = false;
    laser.setCollider("rectangle", -15, 0, 130, 70);
    laser.velocityX = 10 * Math.cos(radians(angle));
    laser.velocityY = 10 * Math.sin(radians(angle));
    laser.lifetime = 90;
    laser.scale = 0.5;
    laser_group.add(laser);
  }
}
