class BeginScene extends Phaser.Scene {
    constructor() {
        super({
            key: "BeginScene"
        });

        this.text = null;
        this.visible = true;
    }

    preload() {
        this.load.image("start_background", "../assets/startScreen.jpg");
        this.load.image("text", "../assets/pressBtn.png");
    }

    create() {
        this.input.keyboard.on('keydown', () => {
            // var gameScene = this.scene.get('GameScene');
            // if(gameScene.geek == null) {
            //     gameScene.scene.restart();
            // } else {
            //     gameScene.scene.restart();
            // }
            // console.log(gameScene);
            this.scene.start('GameScene');
        });

        this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "start_background");
        this.text = this.add.image(this.game.canvas.width / 2, this.game.canvas.height * 0.5, "text");

        this.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.visible) {
                    this.text.setVisible(false);
                }
                else {
                    this.text.setVisible(true);
                }

                this.visible = !this.visible;
            },
            repeat: -1
        });
    }

    update(time, delta) {

    }
}