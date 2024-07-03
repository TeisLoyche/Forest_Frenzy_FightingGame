// Selects the canvas element and stores it within a constant, so that size can be changed.
const canvas = document.querySelector("canvas");

// Context.
const c = canvas.getContext("2d");

// Sets the canvas width and height.
canvas.width = 1024;
canvas.height = 576;

// Gravity constant, pulls the sprite down +0.2 speed every frame.
const gravity = 0.5;

// Background for the level.
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/levelBackground.png",
});

// Sounds & Music.
// Sword swing.
let swordSound = new Audio("./assets/sword.mp3");
swordSound.volume = 0.5;
// Sword hit.
let swordHit = new Audio("./assets/swordHit.mp3");
swordHit.volume = 0.4;
// Punch swing.
let punchSound = new Audio("./assets/punchMiss.mp3");
punchSound.volume = 0.2;
// Punch hit.
let punchHit = new Audio("./assets/punchHit.mp3");
punchHit.volume = 0.1;

// Creates player 1 from the fighter class, spawning the player on the screen at a given location.
const player = new Fighter({
  position: { x: 200, y: 366 },
  velocity: { x: 0, y: 10 },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/savageIdle.png",
  framesMax: 6,
  scale: 2.5,
  offset: {
    x: 14,
    y: 8,
  },

  // All player 1 spritesheets.
  sprites: {
    idle: {
      imageSrc: "./assets/savageIdle.png",
      framesMax: 2,
    },
    walk: {
      imageSrc: "./assets/savageWalk.png",
      framesMax: 6,
    },
    jump: {
      imageSrc: "./assets/savageJump.png",
      framesMax: 1,
    },
    fall: {
      imageSrc: "./assets/savageFall.png",
      framesMax: 1,
    },
    attack1: {
      imageSrc: "./assets/savagePunch.png",
      framesMax: 3,
    },
    hit: {
      imageSrc: "./assets/savageHit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/savageDeath.png",
      framesMax: 4,
    },
  },

  // Player 1 attack box.
  attackBox: {
    offset: {
      x: 63,
      y: 25,
    },
    width: 50,
    height: 20,
  },
});

// Creates player 2 from the fighter class, spawning the player on the screen at a given location.
const enemy = new Fighter({
  position: { x: 730, y: 366 },
  velocity: { x: 0, y: 5 },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/elfIdle.png",
  framesMax: 2,
  scale: 2.5,
  offset: {
    x: 14,
    y: 8,
  },

  // All spritesheets for player 2.
  sprites: {
    idle: {
      imageSrc: "./assets/elfIdle.png",
      framesMax: 2,
    },
    walk: {
      imageSrc: "./assets/elfWalk.png",
      framesMax: 6,
    },
    jump: {
      imageSrc: "./assets/elfJump.png",
      framesMax: 1,
    },
    fall: {
      imageSrc: "./assets/elfFall.png",
      framesMax: 1,
    },
    attack1: {
      imageSrc: "./assets/elfPunch.png",
      framesMax: 3,
    },
    hit: {
      imageSrc: "./assets/elfHit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/elfDeath.png",
      framesMax: 4,
    },
  },

  // Player 2 attack box.
  attackBox: {
    offset: {
      x: -20,
      y: 0,
    },
    width: 60,
    height: 60,
  },
});

// Controls for players.
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

// Calls the method for making the round-timer decrease from 40 to 0.
decreaseTimer();

// Animations
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();

  // Adds a white opacity filter to the background.
  c.fillStyle = "rgba(255, 255, 255, 0.05)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player 1 movement.
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -4;
    if (player.position.y === 366) {
      player.switchSprite("walk");
    }
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 4;
    if (player.position.y === 366) {
      player.switchSprite("walk");
    }
  } else {
    if (player.position.y === 366) player.switchSprite("idle");
  }

  // Player 1 Jumping.
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Player 2 movement.
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -4;
    if (enemy.position.y === 366) {
      enemy.switchSprite("walk");
    }
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 4;
    if (enemy.position.y === 366) {
      enemy.switchSprite("walk");
    }
  } else {
    if (enemy.position.y === 366) enemy.switchSprite("idle");
  }

  // Player 2 jumping.
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Detect collision when player 1 is attacking.
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 1
  ) {
    enemy.hit();
    punchHit.play();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // Player 1 miss.
  if (player.isAttacking && player.framesCurrent === 1) {
    player.isAttacking = false;
  }

  // Detect collision when player 2 is attacking.
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 1
  ) {
    player.hit();
    swordHit.play();
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // Player 2 miss.
  if (enemy.isAttacking && enemy.framesCurrent === 1) {
    enemy.isAttacking = false;
  }

  // If a player's health reaches 0, end the round.
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// Calls the animation function.
animate();

// Event listener for keys pressed for both players, performing action based on pressed key.
// If a player dies, do not allow any more response to key-presses.
window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch (e.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y !== 366) {
          keys.w.pressed = false;
        } else {
          player.velocity.y = -12;
        }
        break;
      case " ":
        player.attack();
        punchSound.play();
        break;
    }
  }
  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.position.y !== 366) {
          keys.ArrowUp.presseed = false;
        } else {
          enemy.velocity.y = -12;
        }
        break;
      case "ArrowDown":
        enemy.attack();
        swordSound.play();
        break;
    }
  }
});

// Event listener for when a player lets go of a key to stop a given action.
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }

  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
