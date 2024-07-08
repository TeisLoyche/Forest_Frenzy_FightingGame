// Collision function.
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

/* Function for determining winner when timer runs out. If both players are alive, but one player has more health
than the other, the player with the most health wins. If both players have same amount of health at the end of the round,
it's a tie. */
function determineWinner({ player, player2, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";

  if (player.health === player2.health) {
    document.querySelector("#displayText").innerHTML =
      "Tie! <br> <br> Press R to restart";
    player.tied = true;
    player2.tied = true;
    restartGame();
  } else if (player.health > player2.health) {
    document.querySelector("#displayText").innerHTML =
      "Savage Wins! <br> <br> Press R to restart";
    restartGame();
  } else if (player2.health > player.health) {
    document.querySelector("#displayText").innerHTML =
      "Elf Wins! <br> <br> Press R to restart";
    restartGame();
  }
}

// Function for decreasing the round timer. 30 seconds per round.
let timer = 30;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, player2, timerId });
  }
}

// Function to restart the game by pressing "r" whenever a player wins / if there is a tie.
function restartGame() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "r") {
      window.location.reload();
    } else {
      keys.r.pressed = false;
    }
  });
}
