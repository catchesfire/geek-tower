class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        })
        this.geek = null;
        this.cursors = null;
        this.isTimerStarted = false;
        this.arePlatformsGone = false;
        this.platformsCount = 0;
        this.tiles = [];
        this.platformSpeed = 75;
        this.turboModifier = 2;
        this.lifeAmount = 3;
    }

    reset() {
        this.create();
    }

    addWire(x, y) {
        let wire = this.wires.getFirstDead();
        wire.body.reset(x, y);
        wire.active = true;
        wire.anims.play('wire_fire', true);
    }

    addBonus(x, y) {
        let bonus = this.bonuses.getFirstDead();
        bonus.body.reset(x, y);
        bonus.active = true;
    }

    addTile(x, y) {
        let tile = this.platforms.getFirstDead();
        // if(!this.isTimerStarted) {
        //     this.tiles.push(tile);
        // }
        tile.body.reset(x, y);
        if(this.isTimerStarted) {
            tile.body.velocity.y = this.platformSpeed;
        }
        tile.body.setAllowGravity(false);
        tile.body.setImmovable(true);
        tile.active = true;

        // tile.checkWorldsBounds = true;
        //tile.body.setCollideWorldBounds(true);

        // // Turning this on will allow you to listen to the 'worldbounds' event
        // tile.body.onWorldBounds = true;

        // tile.body.checkCollision.down = true;
        // tile.body.checkCollision.left = false;
        // tile.body.checkCollision.right = false;
        // tile.body.checkCollision.up = false;

        // // 'worldbounds' event listener
        // tile.body.world.on('worldbounds', function(body) {
        //     // console.log("DD");
        //     // Check if the body's game object is the sprite you are listening for
        //     if (body.gameObject === this) {
        //     // Stop physics and render updates for this object
        //     this.setActive(false);
        //     // this.setVisible(false);
        //     }
        // }, tile);
        // tile.outOfBoundsKill = true;

        // console.log(tile);
    }

    gameOver(){
        this.isTimerStarted = false;
        this.arePlatformsGone = false;
        this.scene.start('EndScene', {score: this.score});
        this.scene.stop('GameScene');

        this.sound.play("endingsound", {volume: 0.4});
        setTimeout(() => {
            this.sound.stopAll();
        }, 1000);
    }

    addFirstPlatform() {
        let tilesNeeded = Math.ceil(720 / this.tileWidth);
        for(let i = 0; i < tilesNeeded; i++) {
            this.addTile(i*this.tileWidth, 720 - this.tileHeight / 2);
        }
    }

    addPlatform(y) {
        if(typeof(y) == 'undefined') {
            y = -this.tileHeight;
        }

        this.platformsCount++;

        let directions = ['left', 'right'];
        let randDirection = Math.floor(Math.random() * 100);
        let tilesNeeded = Math.ceil(720 / this.tileWidth);
        let hole = Math.floor(Math.random() * 1000);
        let outsideHole = Math.floor(Math.random() * 3);
        let platformLength;

        if(hole <= 250) {
            platformLength = 3;
        }else if(hole <= 550) {
            platformLength = 4;
        } else if(hole <= 900) {
            platformLength = 5;
        } else {
            platformLength = 6;
        }


        /*
            3 - 25%,
            4 - 30%
            5 - 35%
            6 - 10%,
            +++++++++++

            +++++++
            +++

        */

        randDirection = randDirection < 50 ? 0 : 1;

        if(directions[randDirection] == 'left') {
            for(let i = 0 ; i < platformLength; i++ ){
                this.addTile(i * this.tileWidth + (this.tileWidth / 2), y);
            }
        } else {
            for(let i = tilesNeeded - 1; i > platformLength; i--){
                this.addTile(i * this.tileWidth + (this.tileWidth / 2), y);
            }
        }

        
        if(this.wires.countActive(false) > 0 && hole <= (100 + (this.platformsCount * 0.4)) && this.platformsCount > 10) {
            let rand = Math.floor(Math.random() * platformLength - 1);
            if(directions[randDirection] == 'left') {
                this.addWire(rand * 60 + 30, y - this.tileHeight / 2 - 30);
            } else {
                this.addWire((tilesNeeded - rand) * 60 + 30, y - this.tileHeight / 2 - 30);
            }
        }

        if(this.bonuses.countActive(false) > 0 && hole <= 60 && this.platformsCount > 10) {
            let rand = Math.floor(Math.random() * platformLength - 1);
            if(directions[randDirection] == 'left') {
                this.addBonus(rand * 60 + 30, y - this.tileHeight / 2 - 30);
            } else {
                this.addBonus((tilesNeeded - rand) * 60 + 30, y - this.tileHeight / 2 - 30);
            }
        }
    }

    initPlatforms() {
        let bottom = 720 - this.tileHeight / 2 - this.spacing;
        let top = this.tileHeight;

        this.addFirstPlatform();

        for(let y = bottom; y > top - this.tileHeight; y = y - this.spacing) {
            this.addPlatform(y);
        }
    }

    preload(){
        this.load.image("background","../assets/geek_tower_background.png")
        this.load.image("ground", "../assets/blue-bar.gif");
        this.load.image("groundVertex", "../assets/blue-bar-vertex.gif");
        // this.load.image("geek", "../assets/red-rect.gif");
        this.load.tilemapCSV('test', "../assets/testMap2.csv");
        this.load.image('tileset', "../assets/bloczek65.jpg");
        

        this.load.spritesheet("geek", "../assets/geek.png", {frameWidth: 88, frameHeight: 95});
        this.load.spritesheet("wire", "../assets/wire.png", {frameWidth: 60, frameHeight: 60});
        this.load.spritesheet("bonus", "../assets/present.png", {frameWidth: 60, frameHeight: 60});

        this.load.audio("soundtrack", ["../assets/MaxRiven - The Riddle.mp3"]);
        this.load.audio("jumpsound", ["../assets/sfx_movement_jump2.wav"]);
        this.load.audio("bouncesound", ["../assets/sfx_movement_jump18.wav"]);
        this.load.audio("endingsound", ["../assets/sfx_sounds_falling12.wav"]);
        this.load.audio("explosionsound", ["../assets/sfx_exp_various1.wav"]);
        this.load.audio("bonussound", ["../assets/sfx_sounds_powerup2.wav"])
    }
    create(){
        this.isTimerStarted = false;
        this.arePlatformsGone = false;
        this.lifeAmount = 3;
        this.platformsCount = 0;
        this.tiles = [];
        this.platformSpeed = 75;
        this.turboModifier = 2;
        this.sound.play('soundtrack', {
            volume: 0.25,
            loop: true
        });

        let bcg = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        bcg.setScrollFactor(0, 0);

        this.spacing = 150;
        this.score = 0;

        this.tileWidth = 65;
        this.tileHeight = 40;

        this.wires = this.add.group();
        this.wires.createMultiple({key: 'wire', repeat: 5, active: false});

        this.platforms = this.add.group();
        this.platforms.createMultiple({key: 'tileset', repeat: 250, active: false});

        this.bonuses = this.add.group();
        this.bonuses.createMultiple({key: 'bonus', repeat: 3, active: false});
        
        this.platforms.getChildren().forEach((tile) => {
            this.physics.world.enableBody(tile, 0);
            tile.body.reset(800, 800);
        });

        this.wires.getChildren().forEach((wire) => {
            this.physics.world.enableBody(wire, 0);   
            this.physics.add.collider(wire, this.platforms);
            wire.body.reset(800, 800);
        });

        this.bonuses.getChildren().forEach((bonus) => {
            this.physics.world.enableBody(bonus, 0);
            this.physics.add.collider(bonus, this.platforms);
            bonus.body.reset(800, 800);
        });

        this.scoreText = this.add.text(500, 20, 'SCORE: 0', { fontSize: '32px', fill: '#fff' });
        this.scoreText.setScrollFactor(0, 0);

        this.livesText = this.add.text(100, 20, 'LIVES: 3', { fontSize: '32px', fill: '#fff' });
        this.livesText.setText(`LIVES: ${this.lifeAmount}`);
        this.livesText.setScrollFactor(0, 0);


        this.initPlatforms();

        //this.timer = this.time.addEvent({loop: true, delay:2000, callback: this.addPlatform, callbackScope:this});

        // let map = this.add.tilemap('test', 65, 40, 720, 720);
        // map.addTilesetImage('tileset');
        // let layer = map.createStaticLayer(0, 'tileset');
        // map.setCollision([0], true, layer);



        //this.add.image('ground', 200, 200);
        //let platform = this.physics.add.staticGroup();
        //let platform2 = this.physics.add.staticGroup();
        //platform.create( 640 , 685, "ground" );
        //platform.create( 640 , 450, "ground" );
        this.geek = new Geek(this,360,500,"geek");
        this.physics.add.collider(this.geek, this.platforms);

        this.physics.add.overlap(this.geek, this.wires, (geek, wire) => {
            if(!this.geek.isInvulnerable) {
                wire.active = false;
                wire.body.reset(-200, -200);
                console.log("umarles lol");
                this.lifeAmount--;
                console.log(this.lifeAmount)
                this.setLivesView = true;
                if(this.lifeAmount == 0){
                    this.gameOver();
                }
                this.sound.play("explosionsound", {volume: 0.3});
            }
        });

        this.physics.add.overlap(this.geek, this.bonuses, (geek, bonus) => {
            this.setInvulnerable = true;
            bonus.active = false;
            bonus.body.reset(-200, -200);
            this.sound.play("bonussound", {volume: 0.3});
        });
        
        this.geek.body.checkCollision.down = true;
        this.geek.body.checkCollision.up = false;
        this.geek.body.checkCollision.left = false;
        this.geek.body.checkCollision.right = false;
        this.geek.body.setBounceX(2);

        // this.cameras.main.tint = 0x00800;

        
        // this.physics.add.collider(this.geek, layer);



        // this.cameras.main.startFollow(this.geek);
        this.cameras.main.setDeadzone(720, 720);
        // this.cameras.main.startFollow(this.geek);
        // this.cameras.main.setBounds(0,0,720,2000);

        this.anims.create({
            key : "geek_walk_right",
            frames: this.anims.generateFrameNumbers('geek',{start:1, end:7, frames:[1,2,3,7,4]} ),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key : "geek_stand",
            frames: this.anims.generateFrameNumbers('geek',{start:0, end:0} ),
            frameRate: 1,
            repeat: -1
            
        })
        this.anims.create({
            key : "geek_jump",
            frames: this.anims.generateFrameNumbers('geek',{start:5, end:5} ),
            frameRate: 1,
            repeat: -1
        })
        this.anims.create({
            key : "geek_jump_right",
            frames: this.anims.generateFrameNumbers('geek',{start:6, end:6} ),
            frameRate: 1,
            repeat: -1
            
        })
        this.anims.create({
            key : "geek_slide_right",
            frames: this.anims.generateFrameNumbers('geek',{start:8, end:8} ),
            frameRate: 1,
            repeat: -1            
        })
        this.anims.create({
            key : "wire_fire",
            frames: this.anims.generateFrameNumbers('wire',{start:0, end:5} ),
            frameRate: 15,
            repeat: -1            
        })


        this.cursors = this.input.keyboard.createCursorKeys();

    }
    update(time, delta){
        this.geek.update(time, delta, this.cursors)
        this.needNewPlatform = false;

        let activePlatforms = this.platforms.getChildren().filter((value) => value.active);
        let activeWires = this.wires.getChildren().filter((value) => value.active);
        let activeBonuses = this.bonuses.getChildren().filter((value) => value.active);

        if(this.setInvulnerable) {
            this.geek.lastTimeInvulnerable = time;
            this.geek.isInvulnerable = true;
            this.setInvulnerable = false;
        }



        if(!this.arePlatformsGone) {
            if(this.isTimerStarted) {
                activePlatforms.forEach((tile) => {
                    tile.body.velocity.y = this.platformSpeed;
                });
                this.arePlatformsGone = true;
                this.score += 100;
            }
        }
        console.log(this.score);

        if(this.isTimerStarted) {
            activePlatforms.forEach((tile) => {
                if(tile.body.position.y >= 720) {
                    tile.active = false;
                    this.needNewPlatform = true;
                }

                if(this.isTurbo) {
                    tile.body.velocity.y = this.platformSpeed * this.turboModifier;
                } else {
                    tile.body.velocity.y = this.platformSpeed;
                }
            });

            activeWires.forEach((wire) => {
                if(wire.body.position.y >= 720) {
                    wire.active = false;
                }
            });

            activeBonuses.forEach((bonus) => {
                if(bonus.body.position.y >= 720) {
                    bonus.active = false;
                }
            });
        }

        if(this.needNewPlatform) {
            // let x = this.platforms.getChildren().filter((value) => value.body).reduce((last, curr) => Math.min(last, curr.body.position.y));
            // let tiles = this.platforms.getChildren().filter((value) => value.active);
            let min = activePlatforms[0].body.position.y;

            activePlatforms.forEach((tile) => {
                if(tile.body.position.y < min) {
                    min = tile.body.position.y;
                }
            })

            this.addPlatform(min - this.spacing);
            this.score += 100;
            this.scoreText.setText(`SCORE: ${this.score}`);
            this.platformSpeed += 1.7;
        }

        if(this.setLivesView){
            this.livesText.setText(`LIVES: ${this.lifeAmount}`);
            this.setLivesView = false;
        }
    }
}