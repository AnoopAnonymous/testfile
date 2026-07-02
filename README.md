# 🐍 Snake Game

A classic Snake game built with vanilla HTML, CSS, and JavaScript. Features a polished UI with smooth animations, responsive design, and mobile support.

![Snake Game Preview](https://img.shields.io/badge/Status-Live-brightgreen)

## 🎮 How to Play

- Use **Arrow Keys** or **WASD** to control the snake
- Eat the red food to grow and score points
- Avoid hitting the walls or your own tail
- Try to beat your high score!

## 🚀 Run Locally

Simply open `index.html` in any modern web browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Using a local server (Python)
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using Node.js
npx serve .
```

## 📱 Mobile Support

The game automatically shows touch controls on mobile devices. You can also swipe on the game canvas to change direction.

## 💾 High Score

Your high score is saved locally in your browser using `localStorage`. It persists between sessions.

## 🛠️ Tech Stack

- **HTML5** - Game structure and canvas
- **CSS3** - Styling with responsive design
- **JavaScript** - Game logic using `requestAnimationFrame`
- **No dependencies** - Pure vanilla implementation

## 📂 Project Structure

```
snake-game/
├── index.html    # Main HTML file
├── style.css     # Styles and responsive design
├── script.js     # Game logic and rendering
└── README.md     # This file
```

## 🎯 Features

- Smooth 60fps rendering
- Progressive speed increase
- Collision detection (walls & self)
- Animated food with pulsing effect
- Snake eyes that follow direction
- Gradient effects on snake body
- Persistent high score
- Touch controls for mobile
- Clean, modern UI

## 🌐 Deployment

This game is deployed using GitHub Pages. The `index.html`, `style.css`, and `script.js` files are served as static content.

---

Made with ❤️ using vanilla web technologies