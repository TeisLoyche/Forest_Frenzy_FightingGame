// Sprite class. Parent class for fighters.
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }

  // Draw method.
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  // Animation method for animating movement.
  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  // Update method. Updates the draw method with each frame.
  update() {
    this.draw();
    this.animateFrames();
  }
}

// Fighter class, inherits Sprite.
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;
    this.dead = false;
    this.tied = false;

    // Switching sprites depending on action.
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  // Update method, updating the draw method with each frame. If a player is dead, freeze all animations for that player.
  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    // Player attack boxes.
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Draw attack box, for checking hits.
    /* c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    ); */

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Gravity.
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 80) {
      this.velocity.y = 0;
      this.position.y = 420;
    } else this.velocity.y += gravity;

    console.log(this.position.y);
    console.log(this.position.x);
  }

  // Player attack.
  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  // Player hit method.
  hit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("hit");
    }
  }

  // Switch statements for each action, changing sprite and frames per second based on the animation.
  // Death, attack and hit animations override all other animations.
  // Also resets the animation loop to 0 each time a sprite is changed to avoid glitching.
  switchSprite(sprite) {
    // Death animation.
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    // Attack animation.
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    // Hit animation.
    if (
      this.image === this.sprites.hit.image &&
      this.framesCurrent < this.sprites.hit.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "walk":
        if (this.image !== this.sprites.walk.image) {
          this.image = this.sprites.walk.image;
          this.framesMax = this.sprites.walk.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "hit":
        if (this.image !== this.sprites.hit.image) {
          this.image = this.sprites.hit.image;
          this.framesMax = this.sprites.hit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
