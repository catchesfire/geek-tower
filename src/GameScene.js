class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        })
        this.geek = null;
        this.cursors = null;
        this.isTimerStarted = false;
        this.arePlatformsGone = false;
        this.tiles = [];
    }

    addTile(x, y) {
        let tile = this.platforms.getFirstDead();
        // if(!this.isTimerStarted) {
        //     this.tiles.push(tile);
        // }
        this.tiles.push(tile);
        this.physics.world.enableBody(tile, 0);
        tile.body.reset(x, y);
        if(this.isTimerStarted) {
            tile.body.velocity.y = 75;
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
        this.scene.start('GameScene');
    }

    addFirstPlatform() {
        let tilesNeeded = Math.ceil(720 / this.tileWidth);
        for(let i = 0; i < tilesNeeded; i++) {
            this.addTile(i*this.tileWidth, 720 - this.tileHeight);
        }
    }

    addPlatform(y) {
        if(typeof(y) == 'undefined') {
            y = -this.tileHeight;
            this.incrementScore();
        }

        let directions = ['left', 'right'];
        let randDirection = Math.floor(Math.random() * 100);
        let tilesNeeded = Math.ceil(720 / this.tileWidth);
        let hole = Math.floor(Math.random() * 100);
        let outsideHole = Math.floor(Math.random() * 3);
        let platformLength;

        if(hole <= 10) {
            platformLength = 3;
        }else if(hole <= 40) {
            platformLength = 4;
        } else if(hole <= 90) {
            platformLength = 5;
        } else {
            platformLength = 6;
        }

        console.log(hole);


        /*
            3 - 10%,
            4 - 30%
            5 - 50%
            6 - 10%,
            +++++++++++

            +++++++
            +++

        */

        randDirection = randDirection < 50 ? 0 : 1;

        console.log(directions[randDirection]);

        if(directions[randDirection] == 'left') {
            for(let i = 0 + outsideHole; i < tilesNeeded - platformLength; i++ ){
                this.addTile(i * this.tileWidth, y);
            }
        } else {
            for(let i = tilesNeeded - 1 - outsideHole; i > platformLength; i--){
                // if(i < hole) continue;
                this.addTile(i * this.tileWidth, y);
            }
        }

        // console.log(tilesNeeded);

        // for(let i = 0; i < tilesNeeded; i++) {
        //     if (i != hole && i != hole + 1) {
        //         this.addTile(i * this.tileWidth, y);
        //     }
        // }
    }

    initPlatforms() {
        let bottom = 720 - this.tileHeight;
        let top = this.tileHeight;

        this.addFirstPlatform();

        for(let y = bottom; y > top - this.tileHeight; y = y - this.spacing) {
            this.addPlatform(y);
        }
    }

    createScore() {
        let scoreFont = "100px Arial";

        this.scoreLabel = this.add.text((this.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
        this.scoreLabel.anchor.setTo(0.5, 0.5);
        this.scoreLabel.align = 'center';
    }

    incrementScore() {
        this.score += 1;
        // this.scoreLabel.text = this.score;
    }

    preload(){
        this.load.image("background","../assets/geek_tower_background.png")
        this.load.image("ground", "../assets/blue-bar.gif");
        this.load.image("groundVertex", "../assets/blue-bar-vertex.gif");
        // this.load.image("geek", "../assets/red-rect.gif");
        this.load.tilemapCSV('test', "../assets/testMap2.csv");
        this.load.image('tileset', "../assets/bloczek65.jpg");
        

        this.load.spritesheet("geek", "../assets/geek.png", {frameWidth: 88, frameHeight: 95});
    }
    create(){
        let bcg = this.add.image(game.config.width / 2, game.config.height / 2, "background");
        bcg.setScrollFactor(0, 0);

        this.spacing = 150;
        this.score = 0;

        this.tileWidth = 65;
        this.tileHeight = 40;

        this.platforms = this.add.group();
        this.platforms.createMultiple({key: 'tileset', repeat: 250, active: false});

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
        this.geek.body.checkCollision.down = true;
        this.geek.body.checkCollision.up = false;
        this.geek.body.checkCollision.left = false;
        this.geek.body.checkCollision.right = false;
        this.geek.body.setBounceX(2);


        
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


        this.cursors = this.input.keyboard.createCursorKeys();

    }
    update(time, delta){
        this.geek.update(time, delta, this.cursors)
        if(!this.arePlatformsGone) {
            if(this.isTimerStarted) {
                // console.log(this.tiles);
                this.tiles.forEach((tile) => {
                    tile.body.velocity.y = 75;
                });
            }
        }

        this.tiles.forEach((tile) => {
            if(tile.body.position.y >= 720) {
                tile.active = false;
            }
        });
    }
}