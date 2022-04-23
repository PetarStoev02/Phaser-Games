const game = new Phaser.Game(1024, 720, Phaser.AUTO, "", {
    preload,
    create,
    update
});

function preload() {
    game.load.spritesheet("player", "monekY.png", 576 / 12, 384 / 8);
    game.load.spritesheet("enema", "enemy1.png", 328 / 8, 336/ 8);
    game.load.spritesheet("shot", "spinning_banana.png", 500 / 10, 25 / 1);
    game.load.image("banana", "banana.png");
    game.load.spritesheet("portal","portal.960x960.5x5.png",960/5,960/5)
}

let player, enemies, enemy, shot, shots, cursors, shoot, text, text2,portal
let fireRate = 200;
let nextFire = 0;
let score = 0;
let enemySpeed = 0;
let lives = 3;
let banana;
let firingTimer=50;
var livingEnemies =[]

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.scale.pageAlignHorizontally = true;
    game.stage.backgroundColor = "#2d2d2d";

    //Add Text for Score and Lives
    text = game.add.text(20, 660, "Score: " + score);
    text.fill = "#FFFF";
    text2 = game.add.text(900, 660, "Lives: " + lives);
    text2.fill = "#FFFF";

    //Create Player
    player = game.add.sprite(game.world.centerX, 625, "player");
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5);
    player.scale.setTo(2);
    player.body.collideWorldBounds = true;

    //Add Animanions
    player.animations.add("idle", [90, 91, 92], 12, true);
    player.animations.add("left", [66, 67, 68], 12, true);
    player.animations.add("right", [77, 78, 79], 12, true);

    //Create Enemies
    enemies = game.add.group();
    enemies.enableBody = true;

    
    var enx = 7;
    var eny = 0;
    for(var i = 0; i<3;i++){
        for(var j = 0; j<6; j++){           
            enemy = enemies.create(enx,eny,'enema')
            enemy.scale.setTo(1)
            enemy.body.velocity.y = enemySpeed
            enemy.animations.add("stay", [], 12, true);
            enemy.animations.play("stay");
            enemy.animations.currentAnim.speed = 30
            enx+=120
        }
        eny+=100
        enx = 7
    }
    console.log(enemy)


  
    //Enemies go Left to Right
    var tween = game.add
        .tween(enemies)
        .to({ x: 380 }, 2000, Phaser.Easing.Linear.None, true, 400, 700, true);

    //Add Bulets
    shots = game.add.group();
    shots.enableBody = true;
    shots.setAll("checkWorldBounds", true);
    shots.setAll("outOfBoundsKill", true);

    cursors = game.input.keyboard.createCursorKeys();
    shoot = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    //Add Banana
    banana = game.add.sprite(590, 630, "shot");
    banana.scale.setTo(0.9);
    game.physics.arcade.enable(banana);
    banana.animations.add("spin", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 12, true);
    banana.animations.play("spin");
    banana.angle += 120;

    explosions = game.add.group();
    explosions.createMultiple(30, 'portal');
    explosions.forEach(enemy, this);

    
}

function update() {
    game.physics.arcade.collide(player, shoot);
    player.body.velocity.x = 0;
    

    let speed = 400;
    if (cursors.left.isDown) {
        player.body.velocity.x = -speed;
        player.animations.play("left");
    } else if (cursors.right.isDown) {
        player.body.velocity.x = speed;
        player.animations.play("right");
    } else {
        player.animations.play("idle");
    }

    if (shoot.isDown) {
        attack();
    }
    game.physics.arcade.overlap(
        shots,
        enemies,
        function(enemy, shot) {
            enemy.kill();
            shot.kill();
            score += 10;
            text.setText("Score: " + score);
            port()
        },
        null,
        this
    );
    
    game.physics.arcade.overlap(player, enemies, function(player) {
        player.kill();
        enemy.kill();
    });
    
    if (player.alive == false) {
        if (lives > 0) {
            player.reset(300, 625);
            player.enableBody = false;
            lives--;
            text2.setText("Lives: " + lives);
        } else {
            let defeat = game.add.text(460, game.world.centerY, "You Lose!");
            defeat.fill = "#FFFF";
        }
    }

    if (score === 180) {
        var victory = game.add.text(460, game.world.centerY, "You WIN!");
        victory.fill = "#FFFF";
    }
    
    game.physics.arcade.moveToObject(banana, player, 100, 600);
}

function attack() {
    if (game.time.now > nextFire) {
        shot = shots.create(player.body.x + 21, player.body.y - 20, "shot");
        shot.scale.setTo(1);
        shot.anchor.setTo(0.5, 0.5);
        shot.animations.add(
            "spin",
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            12,
            true
        );
        shot.animations.play("spin");
        shot.body.velocity.y = -500;
        shot.angle += 120;
        nextFire = game.time.now + fireRate;
    }
}
function port() {
    portal=explosions.create(enemy.body.x, enemy.body.y, "portal");
    portal.animations.add("ss", [], 12, true);
    portal.animations.play("ss", 12, false, true);
    portal.scale.setTo(0.4)
    portal.anchor.x = 0.5;
    portal.anchor.y = 0.5;
    
    portal.animations.currentAnim.speed = 40
    
}
