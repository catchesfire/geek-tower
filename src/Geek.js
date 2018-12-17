const FacingLeft = 13;
const FacingRight = 14;
const FacingUp = 11;
const FacingDown = 12;

class Geek extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.collideWorldBounds = true;
        //this.body.onWorldBounds = true;

        this.isJumping = false;
        this.tempTime = null;
        this.isInvulnerable = false;
        this.lastTimeInvulnerable = -10000;
        this.setScale(0.77);
        this.speedModifierY = 1;
        this.mass = 80;
        this.maxSpeed = 600;
        this.currentSpeed= 0;
        this.jumpSpeed = -1000;
        this.isSliding = { left: false, right: false };
        this.isBouncing = { left: false, right: false };
        this.flag = false;
    }

    update(time, delta, cursors) {  
        this.flipX = false;

        if(time >= this.lastTimeInvulnerable + 5000) {
            this.isInvulnerable = false;
        }
 
        if(this.body.position.y >= 720 - this.body.height) {
            this.scene.gameOver();
        }
        if(this.body.position.y < 400 && !this.scene.isTimerStarted) {
            //this.scene.addPlatform();
            //this.scene.time.addEvent({loop: true, delay:2533, callback: this.scene.addPlatform, callbackScope:this.scene});
            this.scene.isTimerStarted = true;
        }

        this.scene.isTurbo = false;

        if(this.body.position.y < 300 && this.scene.isTimerStarted) {
            this.scene.isTurbo = true;
        }
        
        //console.log(this.body.velocity.y);
        let controlStage = 0;
        this.isJumping = false;
        this.isSliding = { left: false, right: false }
        
        if(cursors.right.isUp && this.body.velocity.x > 0 && this.body.wasTouching.down){
            this.isSliding.right = true;
        }
        if(cursors.left.isUp && this.body.velocity.x < 0 && this.body.wasTouching.down){
            this.isSliding.left = true;
        }
        if (!this.body.wasTouching.down){
            this.isJumping = true;
        }
        if (this.tempTime < time) {
            this.isBouncing.left = false;
            this.isBouncing.right = false;
            this.flag = false;
            this.speedModifierY = 1;
        }
        if (this.body.blocked.left){
            this.isBouncing.left = true;
            this.tempTime = time + 10 * delta;
        } 
        if(this.body.blocked.right) {
            this.isBouncing.right = true;
            this.tempTime = time + 10 * delta;
        }
        if(this.isBouncing.left){
            if(!this.flag){
                this.flag = true;
                this.currentSpeed = Math.abs(this.body.velocity.x);
                if(this.currentSpeed > this.maxSpeed){
                    this.currentSpeed =this.maxSpeed * 0.8;
                }
                this.speedModifierY = 1.2;
                if(this.body.velocity.y < 0){
                    this.body.setVelocityY(this.body.velocity.y *this.speedModifierY);
                }
            }
            this.body.setVelocityX(this.currentSpeed);
        }else if(this.isBouncing.right){
            if(!this.flag){
                this.flag = true;
                this.currentSpeed = Math.abs(this.body.velocity.x);
                if(this.currentSpeed > this.maxSpeed){
                    this.currentSpeed =this.maxSpeed * 0.8;
                }
                this.speedModifierY = 1.2;
                if(this.body.velocity.y < 0){
                    this.body.setVelocityY(this.body.velocity.y *this.speedModifierY);
                }
            }
            this.body.setVelocityX(-this.currentSpeed);
        }else{
            if(this.isSliding.left){
                this.currentSpeed = Math.abs(this.body.velocity.x) - 200;
                if(this.currentSpeed <= 0){
                    this.currentSpeed = 0
                }
                this.body.setVelocityX(-this.currentSpeed);
            }else if(this.isSliding.right){
                this.currentSpeed = Math.abs(this.body.velocity.x) - 200;
                if(this.currentSpeed <= 0){
                    this.currentSpeed = 0
                }
                this.body.setVelocityX(this.currentSpeed);
            }else{
                if (cursors.left.isDown ){
                    this.currentSpeed = Math.abs(this.body.velocity.x) + 100;
                    if(this.currentSpeed > this.maxSpeed){
                        this.currentSpeed =this.maxSpeed;
                    }
                    this.body.setVelocityX(-this.currentSpeed);
                }
                if (cursors.right.isDown ){
                    this.currentSpeed = Math.abs(this.body.velocity.x) + 100;
                    if(this.currentSpeed > this.maxSpeed){
                        this.currentSpeed =this.maxSpeed;
                    }
                    this.body.setVelocityX(this.currentSpeed);
                }
            }
        }
        if (cursors.up.isDown ){
            if(!this.isJumping ){
                this.body.setVelocityY(this.jumpSpeed * this.speedModifierY);
            }
        }



        // ======= ANIM
        if(this.isJumping){
            if(this.body.velocity.x < 0){
                this.flipX = true;
                this.anims.play("geek_jump_right", true);
            }else if(this.body.velocity.x > 0){
                this.anims.play("geek_jump_right", true);
            }else{
                this.anims.play("geek_jump", true);
            }
        }else if(this.isSliding.left){
            this.flipX = true;
            this.anims.play("geek_slide_right", true);
        }else if(this.isSliding.left){
            this.anims.play("geek_slide_right", true);
        }else if(this.body.velocity.x > 0){
            this.anims.play("geek_walk_right", true);
        }else if(this.body.velocity.x < 0){
            this.flipX = true;
            this.anims.play("geek_walk_right", true);
        }else{
            this.anims.play("geek_stand", true);
            
        }
    }
}