# 🎮 Antigravity Tic-Tac-Toe Demo (Custom Photo Edition)

A modern, responsive Tic-Tac-Toe web game created as a showcase demo for **Google Antigravity** in **VS Code**.

## ✨ Features Included

- **Custom Photo Avatars**:
  - Automatically converted from original high-resolution iPhone `.heic` photos (`IMG_3338.HEIC` & `IMG_3537.heic`) into web-optimized, centered square tokens (`player-x.png` & `player-o.png`).
  - Rendered across the live scoreboard, dynamic turn indicator, board cells with glowing neon rings, and victory modal.
- **Modern Glassmorphic Dark UI**: Custom neon styling for Player X (Cyan) and Player O (Rose/Coral) with smooth animations.
- **2-Player Local & AI Modes**:
  - **2P Local**: Classic hotseat multiplayer on one device.
  - **vs AI**: Built with the **Minimax decision algorithm** (with slight human-like variability) so it plays intelligently.
- **Zero-Dependency Web Audio Synthesis**: Generates crisp retro UI sound effects on click, win, and tie directly via Web Audio API oscillators—no external audio files required.
- **Canvas Confetti**: Pure Vanilla JS particle explosion upon victory.
- **Score Tracking & Persistence**: Real-time scoreboard saved in `localStorage`.
- **Responsive & Accessible**: Keyboard-navigable grid, clean layout adapting seamlessly to mobile and desktop screens.

## 🚀 How to Run in VS Code

You can run and preview this project in several ways:

1. **Directly in Browser**:
   - Right-click [`index.html`](file:///c:/Dev/tic-tac-toe/index.html) in VS Code's file explorer and choose **"Reveal in File Explorer"**.
   - Double-click `index.html` to open it in Chrome, Edge, or your preferred browser.

2. **Using VS Code Live Server**:
   - If you have the **Live Server** extension installed (`ritwickdey.LiveServer`), right-click [`index.html`](file:///c:/Dev/tic-tac-toe/index.html) and select **"Open with Live Server"**.

3. **Using VS Code Simple Browser**:
   - Press `Ctrl + Shift + P`, type `Simple Browser: Show`, and enter your local server URL to play directly inside a VS Code editor tab!

## 📂 Project Structure

```
tic-tac-toe/
├── index.html       # Semantic HTML5 layout and modal overlays
├── style.css        # Glassmorphic CSS styling, token rings, and animations
├── app.js           # Game engine, Minimax AI, Audio synth, and Confetti
├── player-x.png     # Converted & square-cropped avatar for Player X (from IMG_3338.HEIC)
├── player-o.png     # Converted & square-cropped avatar for Player O (from IMG_3537.heic)
├── IMG_3338.HEIC    # Source photo
├── IMG_3537.heic    # Source photo
└── README.md        # Documentation and demo guide
```
