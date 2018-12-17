
var config = {
    type: Phaser.AUTO,
    width: 720,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
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
