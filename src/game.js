
var config = {
    type: Phaser.CANVAS,
    width: 720,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 3300 }
        }
    },
    scene: [
        BeginScene,
        GameScene,
        EndScene
    ],
    pixelArt : true
};

var game = new Phaser.Game(config);
