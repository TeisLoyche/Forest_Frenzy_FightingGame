// Selects the canvas element and stores it within a constant, so that size can be changed.
const canvas = document.querySelector("canvas");

// Context.
const c = canvas.getContext("2d");

// Sets the canvas width and height.
canvas.width = 1144;
canvas.height = 644;

// Gravity constant, pulls the sprite down +0.2 speed every frame.
const gravity = 0.5;

// Background for the level.
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/levelBackground2.png",
});

// Sounds.
// Sword swing.
let swordSound = new Audio("./assets/sword.mp3");
swordSound.volume = 0.5;
// Sword hit.
let swordHit = new Audio("./assets/swordHit.mp3");
swordHit.volume = 0.4;
// Punch swing.
let punchSound = new Audio("./assets/punchMiss.mp3");
punchSound.volume = 0.1;
// Punch hit.
let punchHit = new Audio("./assets/punchHit.mp3");
punchHit.volume = 0.1;

// Creates player 1 from the fighter class, spawning the player on the screen at a given location.
const player = new Fighter({
  position: { x: 234, y: 420 },
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
      imageSrc: "./assets/savageIdle2.png",
      framesMax: 2,
    },
    walk: {
      imageSrc: "./assets/savageWalk2.png",
      framesMax: 6,
    },
    jump: {
      imageSrc: "./assets/savageJump2.png",
      framesMax: 1,
    },
    fall: {
      imageSrc: "./assets/savageFall2.png",
      framesMax: 1,
    },
    attack1: {
      imageSrc: "./assets/savagePunch2.png",
      framesMax: 3,
    },
    hit: {
      imageSrc: "./assets/savageHit2.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/savageDeath2.png",
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
const player2 = new Fighter({
  position: { x: 842, y: 420 },
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
      imageSrc: "./assets/elfIdle2.png",
      framesMax: 2,
    },
    walk: {
      imageSrc: "./assets/elfWalk2.png",
      framesMax: 6,
    },
    jump: {
      imageSrc: "./assets/elfJump2.png",
      framesMax: 1,
    },
    fall: {
      imageSrc: "./assets/elfFall2.png",
      framesMax: 1,
    },
    attack1: {
      imageSrc: "./assets/elfPunch2.png",
      framesMax: 3,
    },
    hit: {
      imageSrc: "./assets/elfHit2.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/elfDeath2.png",
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

// Calls the method for making the round-timer decrease to 0.
decreaseTimer();

// Animations
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();

  // Adds a slight white opacity filter to the background, making the fighters pop a bit more.
  c.fillStyle = "rgba(255, 255, 255, 0.05)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  player2.update();

  player.velocity.x = 0;
  player2.velocity.x = 0;

  // Player 1 movement.
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -4;
    if (player.position.x <= -15) {
      player.velocity.x = 0;
    }
    if (player.position.y === 420) {
      player.switchSprite("walk");
    }
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 4;
    if (player.position.x >= 1050) {
      player.velocity.x = 0;
    }
    if (player.position.y === 420) {
      player.switchSprite("walk");
    }
  } else {
    if (player.position.y === 420) player.switchSprite("idle");
  }

  // Player 1 Jumping.
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Player 2 movement.
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -4;
    if (player2.position.x <= -15) {
      player2.velocity.x = 0;
    }
    if (player2.position.y === 420) {
      player2.switchSprite("walk");
    }
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 4;
    if (player2.position.x >= 1050) {
      player2.velocity.x = 0;
    }
    if (player2.position.y === 420) {
      player2.switchSprite("walk");
    }
  } else {
    if (player2.position.y === 420) player2.switchSprite("idle");
  }

  // Player 2 jumping.
  if (player2.velocity.y < 0) {
    player2.switchSprite("jump");
  } else if (player2.velocity.y > 0) {
    player2.switchSprite("fall");
  }

  // Detect collision when player 1 is attacking.
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: player2,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 1
  ) {
    player2.hit();
    punchHit.play();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = player2.health + "%";
  }

  // Player 1 miss.
  if (player.isAttacking && player.framesCurrent === 1) {
    player.isAttacking = false;
  }

  // Detect collision when player 2 is attacking.
  if (
    rectangularCollision({
      rectangle1: player2,
      rectangle2: player,
    }) &&
    player2.isAttacking &&
    player2.framesCurrent === 1
  ) {
    player.hit();
    swordHit.play();
    player2.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // Player 2 miss.
  if (player2.isAttacking && player2.framesCurrent === 1) {
    player2.isAttacking = false;
  }

  // If a player's health reaches 0, end the round.
  if (player2.health <= 0 || player.health <= 0) {
    determineWinner({ player, player2, timerId });
  }
}

// Calls the animation function.
animate();

// Event listener for keys pressed for both players, performing action based on pressed key.
// If a player dies, the player's controls are frozen.
// In case there is a tie, both players controls are frozen so that the battle cannot continue.
window.addEventListener("keydown", (e) => {
  if (!player.tied)
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
          if (player.position.y !== 420) {
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
  if (!player2.tied)
    if (!player2.dead) {
      switch (e.key) {
        case "ArrowRight":
          keys.ArrowRight.pressed = true;
          player2.lastKey = "ArrowRight";
          break;
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true;
          player2.lastKey = "ArrowLeft";
          break;
        case "ArrowUp":
          if (player2.position.y !== 420) {
            keys.ArrowUp.presseed = false;
          } else {
            player2.velocity.y = -12;
          }
          break;
        case "ArrowDown":
          player2.attack();
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
