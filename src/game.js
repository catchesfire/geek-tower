
var config = {
    type: Phaser.CANVAS,
    width: 720,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 4000 }
        }
    },
    scene: [
        BeginScene,
        GameScene
    ],
    pixelArt : true
};

var game = new Phaser.Game(config);
