var game = new Phaser.Game(750, 750, Phaser.AUTO, "phaser-example", {
    preload: preload,
    create: create,
    update: update
});

var platform 
var cursors
var ball
var score = 0;
var text;
var text2;

var bricks
var brick
var broken = 0
var  lives = 3
var victory


function preload() {
game.load.image("platform","Untitled-1.png")
game.load.image("ball","ball.png")
game.load.image("brickBL","brickBL.png")
game.load.image("brickCm","brickCM.png")
game.load.image("brick","brick.png")

} 

function create(){
    game.scale.pageAlignHorizontally = true;
    //game.stage.backgroundColor = "#88AFC8"
    game.stage.backgroundColor = "#fff"
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    text = game.add.text(40, 690, score);
    text2 = game.add.text(600,690,"Lives: " + lives)

    //Platform
    platform= game.add.sprite(280,550, "platform")
    platform.scale.setTo(0.4)
    
    
    game.physics.enable(platform, Phaser.Physics.ARCADE);
    platform.enableBody = true
    platform.body.collideWorldBounds = true;
    platform.body.immovable = true;
    
    //Ball 
    ball = game.add.sprite(360, 400, "ball");
    ball.anchor.setTo(0.5, 0.5);
    ball.scale.set(0.1);
    
    game.physics.enable(ball, Phaser.Physics.ARCADE);

    
    ball.body.bounce.y = 0.2;
    ball.body.bounce.set(1);
    ball.body.collideWorldBounds = true;
    
    game.camera.follow(ball);

    //Bricks
    bricks = game.add.physicsGroup()
    bricks.enableBody = true
    bricks.scale.setTo(0.8)

    var brx = 0;
    var bry = 0;
    for(var i = 0; i<5;i++){
        for(var j = 0; j<7; j++){           
            if(i>=1&& i<=3){
                brick = bricks.create(brx,bry,"brickBL")                 
            } else if(i>=4){
                brick = bricks.create(brx,bry,"brickCm")
            } else {brick = bricks.create(brx,bry,"brick")}
            brick.body.immovable = true
            brx+=135
        }
        bry+=66
        brx = 0
    }
    
   
    
    cursors = game.input.keyboard.createCursorKeys();
    
    
}



 function update(){
    game.physics.arcade.collide(platform,ball);
    
    platform.body.velocity.set(0);
    
   if(score===350){
        var victory = game.add.text(game.world.centerX,game.world.centerY,"You Win!")
        ball.body.velocity.y = 0
        ball.body.velocity.x = 0
    }


    if(score>=120 && score<200){game.stage.backgroundColor = "#6A0DAD"}
    if(score>=60 && score<=119){game.stage.backgroundColor = "#50C878"}
    game.physics.arcade.collide(
        ball,
        bricks,

        function(sprite, brick) {
            brick.kill()
            score+=10
            text.setText( + score)
            
        },
        null,this
        )

 
    if (cursors.left.isDown) {
        platform.body.velocity.x = -400;
        
    } else if (cursors.right.isDown) {
        platform.body.velocity.x = 400;
    }
     
    if (cursors.down.isDown) {
        ball.body.velocity.y = 300;
        ball.body.velocity.x = 200;
        ball.body.velocity.x = -100;
    }

    if(ball.body.y>690){
        ball.kill()
    }

    if(ball.alive == false){//умиране
        if(lives>0){//има още животи
            ball.reset(game.world.centerX-200,300)//връща топката
            lives--//отнемаме живот
            text2.setText("Lives: " + lives)//актуализира текст
            game.time.events.add(Phaser.Timer.SECOND * 2, startAgain, this)//дава 2 секунди за позициониране
        }else{//няма още животи
            let defeat = game.add.text(300, 400,"You Lose!")//показваме текст за загуба
            
        }
    }
}
function startAgain() {
    ball.body.velocity.y = 300
    ball.body.velocity.x = 200
}

