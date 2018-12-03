const FacingLeft = 13;
const FacingRight = 14;
const FacingUp = 11;
const FacingDown = 12;

class Geek extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, key){
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.collideWorldBounds = true;
        this.isJumping = false;
        this.isBouncing = false;
        this.tempTime = null;
        this.setScale(0.5);
        this.direction = 0;
        this.speedModifierX = 1;
        this.speedModifierY = 1;
        this.speed = 800;
        this.currentSpeed = 0;
        this.jumpSpeed = -1300;
        // this.body.setMaxVelocity(650);
        
    }
    update(time, delta, cursors){
        if(!this.isBouncing) {
            this.direction = 0;
        }else if(this.tempTime < time){
            this.isBouncing = false;            
            this.speedModifierY = 1;
            this.speedModifierX = 1;
        }

        if(cursors.left.isDown && !this.isBouncing) {
            
            if(this.body.facing == FacingRight){
                this.currentSpeed = 0;
                
            }
            this.direction = -1;
        }

        if(cursors.right.isDown && !this.isBouncing) {
            if(this.body.facing == FacingLeft){
                this.currentSpeed = 0;
                
            }
            this.direction = 1;
        }

        if(this.body.blocked.down){
            this.isJumping= false;
        }

        if(this.body.blocked.left || this.body.blocked.right) {
            this.direction *= -1;
            this.isBouncing = true;
            this.speedModifierY *= 1.2;
            this.speedModifierX *= 0.8;
            this.tempTime = time + 10 * delta;
        }

        if(cursors.up.isDown) {
            if(!this.isJumping){
                this.body.setVelocityY(this.jumpSpeed * this.speedModifierY);
                this.isJumping= true;
            }
        }

        let tempSpeed;
        if(this.currentSpeed >= this.speed){
            this.currentSpeed = this.speed;
        }else{
            this.currentSpeed += 50;
        }
        this.body.setVelocityX(this.direction * this.currentSpeed * this.speedModifierX);

        
        switch(this.direction) {
            case -1:
                // go left
                break;
            case 0:
                break;
            case 1:
                // go right
                break;
        }

        
    }



}