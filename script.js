/**
 * Snake Game - A classic snake game implementation
 * Uses HTML5 Canvas for rendering
 */

// ===== Configuration =====
const CONFIG = {
    gridSize: 20,           // Size of each grid cell in pixels
    gridCount: 20,          // Number of cells in each row/column
    initialSpeed: 150,      // Starting game speed in milliseconds
    speedIncrease: 2,       // Speed increase per food eaten
    minSpeed: 50            // Minimum speed (fastest)
};

// ===== Game State =====
const gameState = {
    snake: [],              // Array of snake segments {x, y}
    food: { x: 0, y: 0 },   // Current food position
    direction: 'right',     // Current movement direction
    nextDirection: 'right', // Queued direction change
    score: 0,               // Current score
    highScore: 0,           // All-time high score
    speed: CONFIG.initialSpeed,
    isRunning: false,       // Is the game currently running
    isGameOver: false
};

// ===== DOM Elements =====
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    gameContainer: document.getElementById('game-container'),
    canvas: document.getElementById('game-canvas'),
    score: document.getElementById('score'),
    highScore: document.getElementById('high-score'),
    finalScore: document.getElementById('final-score'),
    highScoreDisplay: document.getElementById('high-score-display'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    mobileControls: {
        up: document.getElementById('btn-up'),
        down: document.getElementById('btn-down'),
        left: document.getElementById('btn-left'),
        right: document.getElementById('btn-right')
    }
};

// ===== Canvas Setup =====
const ctx = elements.canvas.getContext('2d');
const canvasSize = CONFIG.gridSize * CONFIG.gridCount;
elements.canvas.width = canvasSize;
elements.canvas.height = canvasSize;

// ===== Utility Functions =====

/**
 * Load high score from localStorage
 */
function loadHighScore() {
    const saved = localStorage.getItem('snakeHighScore');
    gameState.highScore = saved ? parseInt(saved, 10) : 0;
    elements.highScore.textContent = gameState.highScore;
}

/**
 * Save high score to localStorage
 */
function saveHighScore() {
    localStorage.setItem('snakeHighScore', gameState.highScore.toString());
}

/**
 * Generate random position for food within grid bounds
 */
function randomFoodPosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * CONFIG.gridCount),
            y: Math.floor(Math.random() * CONFIG.gridCount)
        };
    } while (isPositionOnSnake(position));
    return position;
}

/**
 * Check if a position overlaps with the snake
 */
function isPositionOnSnake(pos) {
    return gameState.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
}

/**
 * Get the opposite direction to prevent 180-degree turns
 */
function getOppositeDirection(dir) {
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    return opposites[dir];
}

// ===== Game Logic =====

/**
 * Initialize/reset the game to starting state
 */
function initGame() {
    // Create initial snake in the center
    const startX = Math.floor(CONFIG.gridCount / 2);
    const startY = Math.floor(CONFIG.gridCount / 2);
    
    gameState.snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
    ];
    
    gameState.direction = 'right';
    gameState.nextDirection = 'right';
    gameState.score = 0;
    gameState.speed = CONFIG.initialSpeed;
    gameState.isGameOver = false;
    
    elements.score.textContent = '0';
    gameState.food = randomFoodPosition();
}

/**
 * Update snake position based on current direction
 */
function updateSnake() {
    // Apply queued direction change
    gameState.direction = gameState.nextDirection;
    
    // Calculate new head position
    const head = { ...gameState.snake[0] };
    
    switch (gameState.direction) {
        case 'up':    head.y -= 1; break;
        case 'down':  head.y += 1; break;
        case 'left':  head.x -= 1; break;
        case 'right': head.x += 1; break;
    }
    
    // Check for wall collision
    if (head.x < 0 || head.x >= CONFIG.gridCount || 
        head.y < 0 || head.y >= CONFIG.gridCount) {
        endGame();
        return;
    }
    
    // Check for self collision (excluding tail which will move)
    for (let i = 0; i < gameState.snake.length - 1; i++) {
        if (gameState.snake[i].x === head.x && gameState.snake[i].y === head.y) {
            endGame();
            return;
        }
    }
    
    // Add new head
    gameState.snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        // Increase score
        gameState.score += 10;
        elements.score.textContent = gameState.score;
        
        // Increase speed (decrease interval)
        gameState.speed = Math.max(CONFIG.minSpeed, 
            gameState.speed - CONFIG.speedIncrease);
        
        // Generate new food
        gameState.food = randomFoodPosition();
    } else {
        // Remove tail if no food eaten (snake moves but doesn't grow)
        gameState.snake.pop();
    }
}

/**
 * Handle game over
 */
function endGame() {
    gameState.isRunning = false;
    gameState.isGameOver = true;
    
    // Update high score if needed
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        saveHighScore();
        elements.highScore.textContent = gameState.highScore;
    }
    
    // Show game over screen
    elements.finalScore.textContent = gameState.score;
    elements.highScoreDisplay.textContent = gameState.highScore;
    elements.gameContainer.classList.add('hidden');
    elements.gameOverScreen.classList.remove('hidden');
    
    document.body.classList.remove('game-active');
}

// ===== Rendering =====

/**
 * Clear canvas and draw grid
 */
function clearCanvas() {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= CONFIG.gridCount; i++) {
        const pos = i * CONFIG.gridSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvasSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvasSize, pos);
        ctx.stroke();
    }
}

/**
 * Draw the snake
 */
function drawSnake() {
    gameState.snake.forEach((segment, index) => {
        const x = segment.x * CONFIG.gridSize;
        const y = segment.y * CONFIG.gridSize;
        
        // Head is brighter, body fades slightly
        const brightness = index === 0 ? 1 : 0.7 + (0.3 * (1 - index / gameState.snake.length));
        
        // Calculate green component based on brightness
        const green = Math.floor(255 * brightness);
        
        // Draw segment
        ctx.fillStyle = `rgb(0, ${green}, 100)`;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, CONFIG.gridSize - 4, CONFIG.gridSize - 4, 4);
        ctx.fill();
        
        // Draw eyes on head
        if (index === 0) {
            ctx.fillStyle = '#fff';
            const eyeSize = 4;
            let eyeX1, eyeY1, eyeX2, eyeY2;
            
            switch (gameState.direction) {
                case 'up':
                    eyeX1 = x + 6; eyeY1 = y + 6;
                    eyeX2 = x + CONFIG.gridSize - 6 - eyeSize; eyeY2 = y + 6;
                    break;
                case 'down':
                    eyeX1 = x + 6; eyeY1 = y + CONFIG.gridSize - 6 - eyeSize;
                    eyeX2 = x + CONFIG.gridSize - 6 - eyeSize; eyeY2 = y + CONFIG.gridSize - 6 - eyeSize;
                    break;
                case 'left':
                    eyeX1 = x + 6; eyeY1 = y + 6;
                    eyeX2 = x + 6; eyeY2 = y + CONFIG.gridSize - 6 - eyeSize;
                    break;
                case 'right':
                    eyeX1 = x + CONFIG.gridSize - 6 - eyeSize; eyeY1 = y + 6;
                    eyeX2 = x + CONFIG.gridSize - 6 - eyeSize; eyeY2 = y + CONFIG.gridSize - 6 - eyeSize;
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(eyeX1 + eyeSize/2, eyeY1 + eyeSize/2, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(eyeX2 + eyeSize/2, eyeY2 + eyeSize/2, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

/**
 * Draw the food
 */
function drawFood() {
    const x = gameState.food.x * CONFIG.gridSize + CONFIG.gridSize / 2;
    const y = gameState.food.y * CONFIG.gridSize + CONFIG.gridSize / 2;
    const radius = CONFIG.gridSize / 2 - 4;
    
    // Pulsing effect
    const pulse = Math.sin(Date.now() / 200) * 0.15 + 1;
    
    // Outer glow
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15 * pulse;
    
    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner highlight
    ctx.fillStyle = '#ffaa80';
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

/**
 * Main render function
 */
function render() {
    clearCanvas();
    drawFood();
    drawSnake();
}

// ===== Game Loop =====

let lastTime = 0;
let accumulator = 0;

/**
 * Main game loop using requestAnimationFrame with timing control
 */
function gameLoop(currentTime) {
    if (!gameState.isRunning) return;
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    accumulator += deltaTime;
    
    // Update game state at fixed intervals based on speed
    while (accumulator >= gameState.speed) {
        updateSnake();
        accumulator -= gameState.speed;
        
        if (gameState.isGameOver) {
            return; // Stop the loop if game ended
        }
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

/**
 * Start the game
 */
function startGame() {
    initGame();
    
    // Show game container, hide screens
    elements.startScreen.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');
    
    document.body.classList.add('game-active');
    gameState.isRunning = true;
    lastTime = performance.now();
    accumulator = 0;
    
    render();
    requestAnimationFrame(gameLoop);
}

// ===== Input Handling =====

/**
 * Change snake direction based on key press
 */
function handleDirectionChange(newDirection) {
    // Prevent 180-degree turns
    if (newDirection !== getOppositeDirection(gameState.direction)) {
        gameState.nextDirection = newDirection;
    }
}

/**
 * Keyboard input handler
 */
function handleKeydown(e) {
    const key = e.key.toLowerCase();
    
    let newDirection = null;
    
    // Arrow keys
    if (e.key === 'ArrowUp' || key === 'w') newDirection = 'up';
    else if (e.key === 'ArrowDown' || key === 's') newDirection = 'down';
    else if (e.key === 'ArrowLeft' || key === 'a') newDirection = 'left';
    else if (e.key === 'ArrowRight' || key === 'd') newDirection = 'right';
    
    if (newDirection) {
        e.preventDefault();
        handleDirectionChange(newDirection);
    }
}

/**
 * Mobile control button handlers
 */
function setupMobileControls() {
    const controls = elements.mobileControls;
    
    controls.up.addEventListener('click', () => handleDirectionChange('up'));
    controls.down.addEventListener('click', () => handleDirectionChange('down'));
    controls.left.addEventListener('click', () => handleDirectionChange('left'));
    controls.right.addEventListener('click', () => handleDirectionChange('right'));
    
    // Touch events for better mobile responsiveness
    ['touchstart', 'touchend'].forEach(event => {
        controls.up.addEventListener(event, e => e.preventDefault());
        controls.down.addEventListener(event, e => e.preventDefault());
        controls.left.addEventListener(event, e => e.preventDefault());
        controls.right.addEventListener(event, e => e.preventDefault());
    });
}

/**
 * Swipe detection for mobile
 */
function setupSwipeControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 30;
    
    elements.canvas.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    elements.canvas.addEventListener('touchend', e => {
        if (!gameState.isRunning) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                handleDirectionChange(deltaX > 0 ? 'right' : 'left');
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                handleDirectionChange(deltaY > 0 ? 'down' : 'up');
            }
        }
    }, { passive: true });
}

// ===== Event Listeners =====

elements.startBtn.addEventListener('click', startGame);
elements.restartBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeydown);

// ===== Initialize =====

loadHighScore();
setupMobileControls();
setupSwipeControls();