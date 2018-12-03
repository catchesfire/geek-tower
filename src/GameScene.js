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
        this.load.spritesheet("geek", "../assets/geek.png", {frameWidth: 88, frameHeight: 132});
    }
    create(){
        this.add.image('ground', 200, 200);
        let platform = this.physics.add.staticGroup();
        let platform2 = this.physics.add.staticGroup();
        platform2.create( 687 , 320, "groundVertex" );
        platform.create( 640 , 685, "ground" );
        platform.create( 640 , 450, "ground" );
        this.geek = new Geek(this,200,300,"geek");
        this.physics.add.collider(this.geek, platform);
        this.physics.add.collider(this.geek, platform2);
        this.geek.body.checkCollision.up = false;
        this.geek.body.checkCollision.left = false;
        this.geek.body.checkCollision.right = false;
        this.geek.body.setBounceX(2);
        

        this.anims.create({
            key : "geek_walk",
            frames: this.anims.generateFrameNumbers('geek',{start: 2, end: 4} ),
            frameRate: 8,
            repeat: -1
        })


        this.cursors = this.input.keyboard.createCursorKeys();

    }
    update(time, delta){
        this.geek.update(time, delta, this.cursors)
    }
}