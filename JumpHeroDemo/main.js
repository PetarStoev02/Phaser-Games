"use strict";
const game = new Phaser.Game(1024, 750, Phaser.AUTO, "game", {
    preload,
    create,
    update
});

var char;
var facing = "left";
var jumpTimer = 0;
var cursors;
var jumpButton;
var facing = "left2";

var map;
var layer;
var layer2;
var chest;

var coins;
var coin;


const coinsCount = 11

var score = 0;

var stateText;
var text;

var bomb;
var bombs;

var kaboom;
var chaching;

function preload() {
    game.load.tilemap("proba", "game.json", null, Phaser.Tilemap.TILED_JSON);
    game.load.image("setname", "32x32_tileset_mario.png");
    game.load.spritesheet("dude1", "Dude1.png", 386 / 4, 512 / 4);
    game.load.spritesheet("chest", "chest.png", 184 / 3, 115 / 2);
    game.load.image("coin", "coin.png", 512, 501);
    game.load.image("bomb", "bomb1.png", 225, 225);
    game.load.audio("kaboom", "shotgun.wav");
    game.load.audio("chaching", "Super Mario Bros. - Coin Sound Effect.wav");
}
function createCoin() {
    coin = coins.create(game.world.randomX, game.world.randomY, "coin");
    game.physics.enable(coin, Phaser.Physics.ARCADE);
    coin.body.velocity.setTo(0, 200);
    coin.body.collideWorldBounds = true;
    coin.body.bounce.set(0.6);
    coin.body.gravity.set(0, 500);
    coin.scale.setTo(0.09);
}

function createBomb() {
    bomb = bombs.create(game.world.randomX, game.world.randomY, "bomb");
    game.physics.enable(bomb, Phaser.Physics.ARCADE);
    bomb.body.velocity.setTo(0, 200);
    bomb.body.collideWorldBounds = true;
    bomb.body.bounce.set(0.6);
    bomb.body.gravity.set(0, 500);
    bomb.scale.setTo(0.2);
}

function create() {
    game.stage.backgroundColor = "#24ACF2";

    game.scale.pageAlignHorizontally = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1024, 2000);

    text = game.add.text(40, 20, score);
    text.fixedToCamera = true;

    //add chest
    chest = game.add.button(650, 95, "chest", nukeButton, this, 2, 1, 0);
    chest.scale.setTo(1.67);

    //Coin Group
    coins = game.add.physicsGroup();

    // for (var i = 0; i < 1; i++) {
    //     createCoin();
    // }

    for (let i = 0; i < coinsCount; i++) createCoin() 

    //Bomb Group
    bombs = game.add.physicsGroup();
    for (var i = 0; i < 4; i++) {
        createBomb();
    }

    //Audio
    chaching = game.add.audio("chaching");
    kaboom = game.add.audio("kaboom");

    //Create map
    const map = game.add.tilemap("proba");
    map.addTilesetImage("32x32_tileset_mario", "setname");
    map.setCollisionBetween(1, 5);
    map.setCollisionBetween(20, 25);

    map.setCollisionByExclusion([0, -1]);

    layer = map.createLayer("Tile Layer 1");
    layer2 = map.createLayer("Tile Layer 2");
    map.createLayer("Tile Layer 3");

    //Create player and add animations,physics
    char = game.add.sprite(500, 1600, "dude1");
    game.physics.enable(char, Phaser.Physics.ARCADE);
    game.camera.follow(char, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    char.body.linearDamping = 1;
    char.body.bounce.y = 0.2;
    char.body.collideWorldBounds = true;
    char.scale.set(0.5);

    char.body.gravity.y = 1000;
    char.body.maxVelocity.y = 500;
    game.camera.follow(char);

    char.animations.add("left1", [8, 9, 10, 11], 12, true);

    char.animations.add("right1", [4, 5, 6, 7], 12, true);
    char.frame = cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

   
    createText()
   
}

function nukeButton() {
    chest.pendingDestroy = true;
    // 530 60 650 95
    for (let i = 0; i < 13; ++i) {
        coin = coins.create(
            Math.floor(Math.random() * (690 - 620)) + 620,
            Math.floor(Math.random() * (120 - 60)) + 60,
            "coin"
        );
        game.physics.enable(coin, Phaser.Physics.ARCADE);
        coin.body.velocity.setTo(0, 200);
        coin.body.collideWorldBounds = true;
        coin.body.bounce.set(0.6);
        coin.body.gravity.set(0, 500);
        coin.scale.setTo(0.09);
    }
}

function createText() {
    //  Text
    stateText = game.add.text(500, 400, "YOU WIN!", {
        font: "84px Arial",
        fill: "#ffff"
    });
    stateText.scale.setTo(2);
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
    stateText.fixedToCamera = true;
    stateText.font = 'Consolas'
}



function update() {
    //Coins collide
    game.physics.arcade.collide(
        coins,
        char,

        function (char, coin) {

            coin.destroy();
            chaching.play();
            score += 1;
            text.setText(score);
        },
        null,
        this
    );
    game.physics.arcade.collide(
        coins,
        layer,

        function (layer, coins) { },
        null,
        this
    );
   
    if (score >=10) {
        stateText.visible = true;
    }

    
    // Проверката може да бъде направена по два начина
    // ... дали точките са достигнали началния брой на монети, т.е. всички монети са дали по 1 точка (score === coinsCount)
    // ... или дали броят на монетите в станал 0 (coins.length === 0)
    // if (coins.length === 2) {
    //     stateText.visible = true;
    // }

    //Bombs collide
    game.physics.arcade.collide(
        bombs,
        layer,

        function (layer, bombs) { },
        null,
        this
    );

    game.physics.arcade.collide(
        bombs,
        char,

        function (char, bomb) {
            kaboom.play();
            bomb.kill();
            score -= 1;
            text.setText(score);
        },
        null,
        this
    );
    //Char Collide
    game.physics.arcade.collide(char, layer);
    char.body.velocity.x = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        char.body.velocity.x = -400;

        if (facing != "left1") {
            char.animations.play("left1");
            facing = "left1";
        }
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        char.body.velocity.x = 400;

        if (facing != "right1") {
            char.animations.play("right1");
            facing = "right1";
        }
    } else {
        char.frame = 1;
    }

    if (jumpButton.isDown && char.body.onFloor() && game.time.now > jumpTimer) {
        char.body.velocity.y = -650;
        jumpTimer = game.time.now + 750;
    }


  
}
