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
        this.isJumping = false;
        this.isBouncing = false;
        this.tempTime = null;
        this.setScale(0.77);
        this.direction = 0;
        this.speedModifierX = 1;
        this.speedModifierY = 1;
        this.speed = 800;
        this.currentSpeed = 0;
        this.jumpSpeed = -1300;
        this.isSliding = { left: false, right: false }

        // this.body.setMaxVelocity(650);

    }
    update(time, delta, cursors) {  
        this.isSliding.left= false;
        this.isSliding.right = false;
        
        if (!this.isBouncing) {
            this.direction = 0;
            
        } else if (this.tempTime < time) {
            this.isBouncing = false;
            this.speedModifierY = 1;
            this.speedModifierX = 1;
        }
        
        if (cursors.right.isDown && !this.isBouncing) {
            if (this.body.facing == FacingLeft) {
                this.currentSpeed += 80;
                if(this.currentSpeed < 0){
                    this.isSliding.left = true;
                }else{
                    this.currentSpeed = 0;
                }

            }else{
                this.currentSpeed = 0;
            }
            this.direction = 1;
        }
        if (cursors.left.isDown && !this.isBouncing) {

            console.log("------")
            console.log(FacingRight)
            console.log(this.body.facing)
            console.log("------")
            if (this.body.facing == FacingRight) {
                this.currentSpeed -=80;
                if(this.currentSpeed > 0){
                    this.isSliding.right = true;
                }else{
                    this.currentSpeed = 0;
                }

            } else{
                this.currentSpeed = 0;
            }
            this.direction = -1;
        }


        if (this.body.blocked.down) {
            this.isJumping = false;
        }

        if (this.body.blocked.left || this.body.blocked.right) {
            this.direction *= -1;
            this.isBouncing = true;
            this.speedModifierY *= 1.2;
            this.speedModifierX *= 0.8;
            this.tempTime = time + 10 * delta;
        }

        if (cursors.up.isDown) {


            if (!this.isJumping) {
                this.body.setVelocityY(this.jumpSpeed * this.speedModifierY);
                this.isJumping = true;
            }
        }

        // if(!this.isSliding.left && !this.isSliding.right){
        //     this.currentSpeed = this.currentSpeed >= this.speed ? this.speed : this.currentSpeed + 1000;
        // }
        if(!this.isSliding.left && !this.isSliding.right){
            if(this.currentSpeed >= this.speed){
                this.currentSpeed = this.speed;
            }else{
                this.currentSpeed+= 500;
            }
        }
        


        if (this.direction == 0) {
            if (this.body.velocity.x < 0) {
                if (this.body.velocity.x + 50 > 0) {

                    this.body.setVelocityX(0)
                    
                } else {
                    this.body.setVelocityX(this.body.velocity.x + 80);
                    this.isSliding.left= true;
                }
            }
            if (this.body.velocity.x > 0) {
                if (this.body.velocity.x - 50 < 0) {

                    this.body.setVelocityX(0)
                } else {
                    this.body.setVelocityX(this.body.velocity.x - 80);
                    this.isSliding.right=true;
                }
            }

        } else {
            let tempSpeed = this.direction * this.currentSpeed * this.speedModifierX;
            console.log(tempSpeed)
            if(this.isSliding.right || this.isSliding.left){
                tempSpeed *= (-1);
                console.log(tempSpeed)
                
                this.body.setVelocityX(tempSpeed);

            }else{

                this.body.setVelocityX(tempSpeed);
            }
        }

        switch (this.direction) {
            case -1:
                // go left
                break;
            case 0:
                if (!this.isJumping) {
                    if(this.isSliding.left){
                        //to do
                    }else if(this.isSliding.right){
                        this.anims.play("geek_slide_right",true);
                    }else{
                        this.anims.play("geek_stand", true);
                    }

                } else {
                    this.anims.play("geek_jump", true);
                }
                break;
            case 1:
                // go right
                if (!this.isJumping) {
                    if(this.isSliding.left){
                        //to do
                    }else if(this.isSliding.right){
                        this.anims.play("geek_slide_right",true);
                    }else{
                        this.anims.play("geek_walk_right", true);
                    }

                } else {
                    this.anims.play("geek_jump_right", true);
                }
                break;
        }


    }



}