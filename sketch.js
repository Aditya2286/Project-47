var PLAY = 1;
var END = 0;
var gameState = PLAY;
var database;
var attack,dead,idle,jump,jumpAttack,run,bladeImg;
var bg,ground,groundImg,inGround;
var rou;
var com,com2,com3;
var Com3Group, wallGroup,inWallGroup,zombieGroup,sideWallGroup;
var deadZ,attackZ,walkZ,idleZ;
var iArrow,iTomb,iTree;

var score = 0;
function preload(){
    attack=loadAnimation("Attack/Attack (1).png","Attack/Attack (2).png","Attack/Attack (4).png","Attack/Attack (6).png","Attack/Attack (9).png");
    dead=loadAnimation("Dead/Dead (1).png","Dead/Dead (2).png","Dead/Dead (3).png","Dead/Dead (5).png","Dead/Dead (7).png","Dead/Dead (8).png","Dead/Dead (10).png");
    idle=loadAnimation("Idle/Idle (1).png","Idle/Idle (2).png");
    jump=loadAnimation("Jump/Jump (1).png","Jump/Jump (3).png","Jump/Jump (5).png","Jump/Jump (7).png","Jump/Jump (9).png");
    jumpAttack=loadAnimation("JumpAttack/JumpAttack (2).png","JumpAttack/JumpAttack (3).png","JumpAttack/JumpAttack (5).png","JumpAttack/JumpAttack (7).png","JumpAttack/JumpAttack (9).png");
    run=loadAnimation("Run/Run (1).png","Run/Run (2).png","Run/Run (8).png","Run/Run (9).png","Run/Run (10).png");
    
    bg=loadImage("Background/BG.png");
    
    groundImg=loadImage("Background/Objects/Ground.png");
    
    com=loadImage("wall/Combine.png");
    com2=loadImage("wall/Combine2.png");
    com3=loadImage("wall/Combine3.png");

    //loadig the images for zombies
    attackZ=loadAnimation("The Zombie/Attack/Attack (1).png","The Zombie/Attack/Attack (3).png","The Zombie/Attack/Attack (5).png","The Zombie/Attack/Attack (7).png");
    deadZ=loadAnimation("The Zombie/Dead/Dead (1).png","The Zombie/Dead/Dead (3).png","The Zombie/Dead/Dead (7).png","The Zombie/Dead/Dead (10).png");
    idleZ=loadAnimation("The Zombie/Idle/Idle (1).png","The Zombie/Idle/Idle (5).png","The Zombie/Idle/Idle (11).png","The Zombie/Idle/Idle (14).png");
    walkZ=loadAnimation("The Zombie/Walk/Walk (1).png","The Zombie/Walk/Walk (3).png","The Zombie/Walk/Walk (5).png","The Zombie/Walk/Walk (9).png");

    iTree=loadImage("Background/Objects/Tree.png");
    iArrow=loadImage("Background/Objects/ArrowSign.png");
    iTomb=loadImage("Background/Objects/TombStone (2).png");
}

function setup(){
    canvas = createCanvas(displayWidth-20,displayHeight-30);
    database = firebase.database();

    rou=createSprite(150,600,200,200);
    rou.addAnimation("running",run);
    rou.scale=0.2;
    rou.setCollider("rectangle",0,0,rou.width-150,rou.height);
    rou.Visiblity=255;
    
    ground=createSprite(width/2,height-35);
    ground.addImage(groundImg);
    ground.scale=4.5;
    ground.velocityX=-7;

    inGround=createSprite(width/2,height-50,4100,20);
    inGround.velocityX=-7;
    inGround.visible=false;

    Com3Group = new Group();
    wallGroup = new Group();
    inWallGroup=new Group();
    zombieGroup= new Group();
    sideWallGroup= new Group();
}

function draw(){
    background(bg); 

    camera.position.x=rou.x+500;

    if(gameState === PLAY){

        if(keyDown("space")&& rou.y >= 161.5) {
            rou.velocityY = -12;
            //rou.changeAnimation("attacking",jumpAttack);
        }
        rou.velocityY = rou.velocityY + 0.8
    
        if (ground.x < 20){
            ground.x = ground.width/1;
        }
    
        if (inGround.x < 20){
            inGround.x = inGround.width/2;
        }

        if(sideWallGroup.isTouching(rou)){
            rou.Visiblity=rou.Visiblity-5;
            tint(255,rou.Visiblity);
            
        }

        if(rou.isTouching(zombieGroup)){
            score+=5;
            console.log(gameState);
        }

    }

    else if(gameState === END){
        rou.changeAnimation("attacking", attack);
    }

    fill("#EAF5FF");
    textSize(25);
    text("SCORE : " + score,950,200);
    
    rou.collide(inGround);
    rou.collide(inWallGroup);
    rou.collide(inGround);
    bgItem();
    spawnZombie();
    spawnWalls();
    drawSprites();

}

function spawnWalls(){
    if(frameCount % 100 === 0){
        var wall = createSprite(2000,450);
        wall.velocityX=-16;
        wall.y = Math.round(random(250,450));

        //generate random walls
        var rand = Math.round(random(1,2));
        switch(rand) {
        case 1: wall.addImage(com);
              break;
        case 2: wall.addImage(com2);
                break;
        default: break;
        }
        wallGroup.add(wall);

        var inWall=createSprite(wall.x);
        inWall.width=wall.width-15;
        inWall.height=5;
        inWall.velocityX=-16;
        inWall.y=wall.y-40;

        inWallGroup.add(inWall);

        var sideWall=createSprite(wall.x-190);
        sideWall.width=5;
        sideWall.height=wall.height;
        sideWall.velocityX=-16;
        sideWall.y=wall.y;

        sideWallGroup.add(sideWall);
        }
}

function spawnZombie(){
    if(frameCount %100 === 0){
        var zombie=createSprite(1500,600);
        zombie.addAnimation("walking",attackZ);
        zombie.velocityX=-12;
        zombie.scale=0.28;
        zombie.x = Math.round(random(1500,2000));
        zombie.setCollider("rectangle",0,10,zombie.width-150,zombie.height-50);

        zombieGroup.add(zombie);

        rou.depth=zombie.depth;
        rou.depth+=2;
    }
}

function bgItem(){
    if(frameCount%200 === 0){
        var item=createSprite(1500,620);
        item.velocityX=-10;
        item.x = Math.round(random(1500,2000));

        //generating random item in the background
        var rand = Math.round(random(1,3));
        switch(rand){
            case 1 : item.addImage(iArrow);
                    item.y=623;
                    break;
            case 2 : item.addImage(iTree);
                    item.y=550;
                    break;
            case 3 : item.addImage(iTomb);
                    item.y=630;
                    break;
            default: break;
        }

        rou.depth=item.depth;
        rou.depth+=2;
    }
}