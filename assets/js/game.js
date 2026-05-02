const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID = 20;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;

let snake, direction, nextDirection, food, score, highScore, gameLoop, running;

highScore = 0;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9,  y: 10 },
        { x: 8,  y: 10 }
    ];
    direction     = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    updateScore();
    placeFood();
    drawFrame();
}

function placeFood() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('highscore').textContent = highScore;
}

function drawFrame() {
    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#f87171';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
        food.x * GRID + GRID / 2,
        food.y * GRID + GRID / 2,
        GRID / 2 - 2, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
        const ratio = i / snake.length;
        ctx.fillStyle = i === 0 ? '#34d399' : `hsl(${160 - ratio * 40}, 70%, ${55 - ratio * 15}%)`;
        ctx.shadowColor = i === 0 ? '#34d399' : 'transparent';
        ctx.shadowBlur = i === 0 ? 8 : 0;
        ctx.fillRect(seg.x * GRID + 1, seg.y * GRID + 1, GRID - 2, GRID - 2);
        ctx.shadowBlur = 0;
    });
}

function step() {
    direction = { ...nextDirection };

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        return gameOver();
    }

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        return gameOver();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > highScore) highScore = score;
        updateScore();
        placeFood();
    } else {
        snake.pop();
    }

    drawFrame();
}

function gameOver() {
    clearInterval(gameLoop);
    running = false;

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 32px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '18px Segoe UI';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    document.getElementById('restartBtn').style.display = 'inline-block';
    document.getElementById('startBtn').style.display = 'none';
}

function startGame() {
    if (running) return;
    running = true;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'none';
    initGame();
    gameLoop = setInterval(step, 120);
}

function restartGame() {
    clearInterval(gameLoop);
    running = false;
    document.getElementById('restartBtn').style.display = 'none';
    startGame();
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':    if (direction.y !== 1)  nextDirection = { x: 0, y: -1 }; e.preventDefault(); break;
        case 'ArrowDown':  if (direction.y !== -1) nextDirection = { x: 0, y: 1 };  e.preventDefault(); break;
        case 'ArrowLeft':  if (direction.x !== 1)  nextDirection = { x: -1, y: 0 }; e.preventDefault(); break;
        case 'ArrowRight': if (direction.x !== -1) nextDirection = { x: 1, y: 0 };  e.preventDefault(); break;
    }
});

// Draw initial screen
window.addEventListener('load', () => {
    initGame();

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 28px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('🐍 Snake', canvas.width / 2, canvas.height / 2 - 15);

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '16px Segoe UI';
    ctx.fillText('Press Start to play', canvas.width / 2, canvas.height / 2 + 20);
});