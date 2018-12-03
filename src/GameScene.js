class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        })
        this.geek = null;
        this.cursors = null;

    }

    preload(){
        this.load.image("ground", "../assets/blue-bar.gif");
        this.load.image("groundVertex", "../assets/blue-bar-vertex.gif");
        // this.load.image("geek", "../assets/red-rect.gif");
        this.load.spritesheet("geek", "../assets/geek.png", {frameWidth: 88, frameHeight: 95});
    }
    create(){
        this.add.image('ground', 200, 200);
        let platform = this.physics.add.staticGroup();
        let platform2 = this.physics.add.staticGroup();
        platform2.create( 687 , 320, "groundVertex" );
        platform.create( 640 , 685, "ground" );
        platform.create( 640 , 450, "ground" );
        this.geek = new Geek(this,360,360,"geek");
        this.physics.add.collider(this.geek, platform);
        this.physics.add.collider(this.geek, platform2);
        this.geek.body.checkCollision.up = false;
        this.geek.body.checkCollision.left = false;
        this.geek.body.checkCollision.right = false;
        this.geek.body.setBounceX(2);

        // this.cameras.main.startFollow(this.geek);
        this.cameras.main.setDeadzone(720, 670);
        this.cameras.main.startFollow(this.geek);
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
    }
}