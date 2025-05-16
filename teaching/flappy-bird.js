const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// Game variables
let bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 15,
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;
let pipeFrequency = 1500; // milliseconds
let lastPipeTime = 0;
let score = 0;
let gameRunning = true;

// Draw bird
function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0';
    ctx.fill();
    ctx.closePath();
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = '#0a0';
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

// Update bird position
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check if bird hits the ground or the ceiling
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver();
    }
}

// Update pipes
function updatePipes() {
    const currentTime = Date.now();
    if (currentTime - lastPipeTime > pipeFrequency) {
        const top = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
        pipes.push({ x: canvas.width, top });
        lastPipeTime = currentTime;
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;

        // Check for collision
        if (bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            (bird.y - bird.radius < pipe.top ||
             bird.y + bird.radius > pipe.top + pipeGap)) {
            gameOver();
        }

        // Check if bird passed the pipe
        if (bird.x > pipe.x + pipeWidth && !pipe.passed) {
            pipe.passed = true;
            score++;
        }

        // Remove pipes that are off screen
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }
    });
}

// Draw score
function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game over
function gameOver() {
    gameRunning = false;
    restartButton.style.display = 'block';
    ctx.fillStyle = '#000';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

// Restart game
function restartGame() {
    bird = {
        x: 50,
        y: canvas.height / 2,
        radius: 15,
        velocity: 0,
        gravity: 0.5,
        jump: -10
    };
    pipes = [];
    score = 0;
    gameRunning = true;
    restartButton.style.display = 'none';
    lastPipeTime = Date.now();
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    drawScore();

    updateBird();
    updatePipes();

    requestAnimationFrame(gameLoop);
}

// Handle jump
function handleJump() {
    if (gameRunning) {
        bird.velocity = bird.jump;
    }
}

// Event listeners
canvas.addEventListener('click', handleJump);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        handleJump();
    }
});

restartButton.addEventListener('click', restartGame);

// Start the game
gameLoop();
