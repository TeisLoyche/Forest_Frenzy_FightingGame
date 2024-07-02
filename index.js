// Selects the canvas element and stores it within a constant, so that size can be changed.
const canvas = document.querySelector("canvas");

// Context.
const c = canvas.getContext("2d");

// Sets the canvas width and height.
canvas.width = 1024;
canvas.height = 576;

// Creates a rectangle that fills the canvas, acting as background.
c.fillRect(0, 0, canvas.width, canvas.height);

// Gravity constant, pulls the sprite down +0.2 speed every frame.
const gravity = 0.5;

// Background.
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/levelBackground.png",
});

// Creates player 1 from the fighter class, spawning the player on the screen at a given location.
const player = new Fighter({
  position: { x: 0, y: 366 },
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
  },
});

// Creates player 2 from the fighter class, spawning the player on the screen at a given location.
const enemy = new Fighter({
  position: { x: 400, y: 150 },
  velocity: { x: 0, y: 5 },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
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

// Calls the method for making the round-timer decrease from 60 to 0.
decreaseTimer();

// Animations
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player.update();
  // enemy.update();

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

  // Jumping.
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Player 2 movement.
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -4;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 4;
  }

  // Detect collision when player 1 is attacking.
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // Detect collision when player 2 is attacking.
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // If a player's health reaches 0, end the round.
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// Calls the animation function.
animate();

// Event listener for keys pressed for both players, performing action based on pressed key.
window.addEventListener("keydown", (e) => {
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
      player.velocity.y = -12;
      break;
    case " ":
      player.attack();
      break;
  }
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
      enemy.velocity.y = -10;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
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
