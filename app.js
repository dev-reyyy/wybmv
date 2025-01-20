const button = document.querySelector("#sneaky-btn");
const column = button.closest(".col");
const gomaImage = document.querySelector("#goma-img");

["mouseover"].forEach((type) => {
  button.addEventListener(type, function () {
    if (hoverCount < limit) {
      hoverCount++; // Increment hover count
      const columnWidth = column.offsetWidth;

      const top = getRandomNum(window.innerHeight - this.offsetHeight);
      const left =
        getRandomNum(columnWidth - this.offsetWidth) +
        (columnWidth - this.offsetWidth) +
        this.offsetWidth;

      gomaImage.setAttribute("src", "assets/sad-goma-" + num + ".gif");

      num = (num % limit) + 1;

      moveElement(this, "left", left);
      moveElement(this, "top", top);
    }
  });
});

const moveElement = (element, animeType, pixels) => {
  anime({
    targets: element,
    [animeType]: `${pixels}px`,
    easing: "easeOutElastic(1, .5)",
  }).play();
};

const getRandomNum = (num) => {
  return Math.floor(Math.random() * num);
};

// ==========
// MODAL
// ==========

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const closeBtn2 = document.getElementById("close2");

let num = 1;
const limit = 6;
let hoverCount = 0;

// Open modal on click if hover limit reached
button.addEventListener("click", function () {
  if (hoverCount >= limit) {
    modal.style.display = "block";
  }
});

closeBtn.onclick = closeModal;
closeBtn2.onclick = closeModal;

function closeModal() {
  modal.style.display = "none";
  num = 1;
  hoverCount = 0;
  note.textContent = "";
}

// Close modal if click outside the modal-content
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    num = 1;
    hoverCount = 0;
    note.textContent = "";
  }
};

// ==========
// FINAL MESSAGE
// ==========

const yesButton = document.querySelector(".yes-btn");
const textHolder = document.querySelector(".card-text");
const successMsg = document.querySelector("#success-msg");
const note = document.getElementById("note");
const finalChance = document.getElementById("finalChance");

yesButton.onclick = function () {
  showFinalMessage("Yeheeeyyyy !!", "assets/labyu-goma.gif", false);
};

function showFinalMessage(message, img, btnShow) {
  gomaImage.setAttribute("src", img);

  textHolder.classList.add("d-none");
  successMsg.textContent = message; // Fixed this line
  successMsg.classList.remove("d-none");

  if (btnShow) {
    finalChance.classList.remove("d-none");
  }
}

finalChance.onclick = function () {
  location.reload();
};

// ==========
// MAZE
// ==========

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const rows = 10; // Number of rows
const cols = 22; // Number of columns
const cellSize = canvas.width / cols;

let maze = [];
let player = { x: 0, y: 0 };
let goal = { x: cols - 1, y: rows - 1 };

// Directions for movement in the maze
const directions = [
  { x: 0, y: -1 }, // Up
  { x: 0, y: 1 }, // Down
  { x: -1, y: 0 }, // Left
  { x: 1, y: 0 }, // Right
];

// Initialize maze with walls
function initializeMaze() {
  maze = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      visited: false,
      walls: [true, true, true, true],
    }))
  );
}

// Draw the maze
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = maze[row][col];

      const x = col * cellSize;
      const y = row * cellSize;

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      // Draw walls
      if (cell.walls[0]) ctx.strokeRect(x, y, cellSize, 0); // Top
      if (cell.walls[1]) ctx.strokeRect(x + cellSize, y, 0, cellSize); // Right
      if (cell.walls[2]) ctx.strokeRect(x, y + cellSize, cellSize, 0); // Bottom
      if (cell.walls[3]) ctx.strokeRect(x, y, 0, cellSize); // Left
    }
  }

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(
    player.x * cellSize + 5,
    player.y * cellSize + 5,
    cellSize - 10,
    cellSize - 10
  );

  // Draw goal
  ctx.fillStyle = "green";
  ctx.fillRect(
    goal.x * cellSize + 5,
    goal.y * cellSize + 5,
    cellSize - 10,
    cellSize - 10
  );
}

// Recursive Backtracking Algorithm for maze generation
function generateMaze(x, y) {
  const stack = [];
  maze[y][x].visited = true;
  stack.push({ x, y });

  while (stack.length > 0) {
    const current = stack.pop();
    const { x, y } = current;

    // Shuffle directions
    const shuffledDirections = directions.sort(() => Math.random() - 0.5);

    for (const dir of shuffledDirections) {
      const nx = x + dir.x;
      const ny = y + dir.y;

      // Check bounds and if the neighbor is unvisited
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < cols &&
        ny < rows &&
        !maze[ny][nx].visited
      ) {
        maze[ny][nx].visited = true;

        // Remove walls between current and neighbor
        if (dir.x === 1) {
          maze[y][x].walls[1] = false;
          maze[ny][nx].walls[3] = false;
        } else if (dir.x === -1) {
          maze[y][x].walls[3] = false;
          maze[ny][nx].walls[1] = false;
        } else if (dir.y === 1) {
          maze[y][x].walls[2] = false;
          maze[ny][nx].walls[0] = false;
        } else if (dir.y === -1) {
          maze[y][x].walls[0] = false;
          maze[ny][nx].walls[2] = false;
        }

        stack.push({ x: nx, y: ny });
      }
    }
  }
}

// Handle player movement
document.addEventListener("keydown", (e) => {
  let newX = player.x;
  let newY = player.y;

  if (e.key === "ArrowUp" && !maze[player.y][player.x].walls[0]) newY--;
  if (e.key === "ArrowDown" && !maze[player.y][player.x].walls[2]) newY++;
  if (e.key === "ArrowLeft" && !maze[player.y][player.x].walls[3]) newX--;
  if (e.key === "ArrowRight" && !maze[player.y][player.x].walls[1]) newX++;

  if (newX >= 0 && newY >= 0 && newX < cols && newY < rows) {
    player.x = newX;
    player.y = newY;

    note.textContent += "huhu";

    if (player.x === goal.x && player.y === goal.y) {
      player.x = 0; // Reset player position
      player.y = 0;
      initializeMaze();
      generateMaze(0, 0);
      drawMaze();
      closeModal();
      showFinalMessage(":(", "assets/cry-goma.gif", true);
    }

    drawMaze();
  }
});

initializeMaze();
generateMaze(0, 0);
drawMaze();
