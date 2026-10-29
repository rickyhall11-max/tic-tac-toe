# 🎮 Antigravity Tic-Tac-Toe Demo

A modern, responsive Tic-Tac-Toe web game created as a showcase demo for **Google Antigravity** in **VS Code**.

## ✨ Features Included

- **Modern Glassmorphic Dark UI**: Custom neon styling for Player X (Cyan) and Player O (Rose/Coral) with smooth animations.
- **2-Player Local & AI Modes**:
  - **2P Local**: Classic hotseat multiplayer on one device.
  - **vs AI**: Built with the **Minimax decision algorithm** (with slight human-like variability) so it plays intelligently.
- **Zero-Dependency Web Audio Synthesis**: Generates crisp retro UI sound effects on click, win, and tie directly via Web Audio API oscillators—no external mp3/wav files required.
- **Canvas Confetti**: Pure Vanilla JS particle explosion upon victory.
- **Score Tracking & Persistence**: Real-time scoreboard saved in `localStorage`.
- **Responsive & Accessible**: Keyboard-navigable grid, clean layout adapting seamlessly to mobile and desktop screens.

## 🚀 How to Run in VS Code

You can run and preview this project in several ways:

1. **Directly in Browser**:
   - Right-click [`index.html`](file:///c:/Dev/tic-tac-toe/index.html) in VS Code's file explorer and choose **"Reveal in File Explorer"** (or press `Alt + B` if you have an open-in-browser shortcut).
   - Double-click `index.html` to open it in Chrome, Edge, or your preferred browser.

2. **Using VS Code Live Server**:
   - If you have the **Live Server** extension installed (`ritwickdey.LiveServer`), right-click [`index.html`](file:///c:/Dev/tic-tac-toe/index.html) and select **"Open with Live Server"**.

3. **Using VS Code Simple Browser**:
   - Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS), type `Simple Browser: Show`, and enter your local server URL to play directly inside a VS Code editor tab!

## 📂 Project Structure

```
tic-tac-toe/
├── index.html       # Semantic HTML5 layout and modal overlays
├── style.css        # Glassmorphic CSS styling, animations, and variables
├── app.js           # Game engine, Minimax AI, Audio synth, and Confetti
└── README.md        # Documentation and demo guide
```

