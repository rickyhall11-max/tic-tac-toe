// --- Audio Synthesis via Web Audio API (No external assets required) ---
const audioCtx = (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined')
  ? new (window.AudioContext || window.webkitAudioContext)()
  : null;

function playSound(type) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'x') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'o') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.1);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'win') {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const noteOsc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      noteOsc.connect(noteGain);
      noteGain.connect(audioCtx.destination);
      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(freq, now + i * 0.08);
      noteGain.gain.setValueAtTime(0.1, now + i * 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
      noteOsc.start(now + i * 0.08);
      noteOsc.stop(now + i * 0.08 + 0.25);
    });
  } else if (type === 'tie') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.25);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

// --- Confetti Animation Canvas ---
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a855f7'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 12,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  render();
}

// --- Player Image Assets ---
const PLAYER_IMAGES = {
  X: 'player-x.png',
  O: 'player-o.png'
};

// --- Game Logic ---
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const state = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  gameActive: true,
  mode: 'pvp', // 'pvp' or 'ai'
  scores: {
    X: 0,
    O: 0,
    ties: 0
  }
};

// DOM Elements
const cells = document.querySelectorAll('.cell');
const currentPlayerEl = document.getElementById('current-player');
const valXEl = document.getElementById('val-x');
const valOEl = document.getElementById('val-o');
const valTiesEl = document.getElementById('val-ties');
const restartBtn = document.getElementById('restart-btn');
const resetScoresBtn = document.getElementById('reset-scores-btn');
const modePvpBtn = document.getElementById('mode-pvp');
const modeAiBtn = document.getElementById('mode-ai');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalIcon = document.getElementById('modal-icon');
const modalPlayAgain = document.getElementById('modal-play-again');

// Load stored scores if available
function loadScores() {
  const saved = localStorage.getItem('ttt_scores');
  if (saved) {
    try {
      state.scores = JSON.parse(saved);
      updateScoreboard();
    } catch (e) {
      console.warn('Could not load saved scores');
    }
  }
}

function saveScores() {
  localStorage.setItem('ttt_scores', JSON.stringify(state.scores));
}

function updateScoreboard() {
  valXEl.textContent = state.scores.X;
  valOEl.textContent = state.scores.O;
  valTiesEl.textContent = state.scores.ties;
}

function setTurnIndicator(player) {
  currentPlayerEl.className = player === 'X' ? 'player-x' : 'player-o';
  currentPlayerEl.innerHTML = `
    <img src="${PLAYER_IMAGES[player]}" alt="${player}" class="indicator-avatar">
    Player ${player}
  `;
}

function handleCellClick(e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const index = parseInt(cell.dataset.index, 10);
  if (!state.gameActive || state.board[index] !== null) return;

  makeMove(index, state.currentPlayer);

  if (state.gameActive && state.mode === 'ai' && state.currentPlayer === 'O') {
    // Disable board briefly for AI thinking simulation
    cells.forEach(c => (c.disabled = true));
    setTimeout(() => {
      aiMove();
      cells.forEach((c, idx) => {
        if (!state.board[idx]) c.disabled = false;
      });
    }, 380);
  }
}

function makeMove(index, player) {
  state.board[index] = player;
  const cell = cells[index];
  
  cell.innerHTML = `
    <img src="${PLAYER_IMAGES[player]}" alt="Player ${player}" class="cell-token">
  `;
  cell.classList.add(player.toLowerCase());
  cell.disabled = true;

  playSound(player.toLowerCase());

  const winningCombo = checkWin(state.board, player);
  if (winningCombo) {
    handleWin(player, winningCombo);
    return;
  }

  if (checkTie(state.board)) {
    handleTie();
    return;
  }

  state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  setTurnIndicator(state.currentPlayer);
}

function checkWin(board, player) {
  return WINNING_COMBOS.find(combo =>
    combo.every(idx => board[idx] === player)
  );
}

function checkTie(board) {
  return board.every(cell => cell !== null);
}

function handleWin(winner, combo) {
  state.gameActive = false;
  combo.forEach(idx => cells[idx].classList.add('winning'));
  state.scores[winner]++;
  saveScores();
  updateScoreboard();

  playSound('win');
  launchConfetti();

  setTimeout(() => {
    modalIcon.innerHTML = `
      <img src="${PLAYER_IMAGES[winner]}" alt="Winner ${winner}" class="modal-winner-avatar">
    `;
    modalTitle.textContent = `Player ${winner} Wins!`;
    modalMessage.textContent = state.mode === 'ai' && winner === 'O' 
      ? 'The AI outsmarted you this round! Try again?'
      : 'Masterful play! Ready for the next round?';
    modalBackdrop.classList.add('show');
  }, 450);
}

function handleTie() {
  state.gameActive = false;
  state.scores.ties++;
  saveScores();
  updateScoreboard();

  playSound('tie');

  setTimeout(() => {
    modalIcon.innerHTML = '<span style="font-size: 3rem;">🤝</span>';
    modalTitle.textContent = "It's a Draw!";
    modalMessage.textContent = 'Both sides matched evenly. Next game decides!';
    modalBackdrop.classList.add('show');
  }, 450);
}

// --- Smart AI using Minimax Algorithm ---
function aiMove() {
  if (!state.gameActive) return;

  // With a small probability (15%), pick random move to allow human wins occasionally
  const makeSuboptimalMove = Math.random() < 0.15;
  const availableMoves = state.board
    .map((val, idx) => (val === null ? idx : null))
    .filter(val => val !== null);

  let bestMove;
  if (makeSuboptimalMove && availableMoves.length > 0) {
    bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  } else {
    bestMove = getBestMoveMinimax(state.board);
  }

  if (bestMove !== undefined && bestMove !== null) {
    makeMove(bestMove, 'O');
  }
}

function getBestMoveMinimax(board) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWin(board, 'O')) return 10 - depth;
  if (checkWin(board, 'X')) return depth - 10;
  if (checkTie(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Reset match without clearing total scores
function resetMatch() {
  state.board.fill(null);
  state.gameActive = true;
  state.currentPlayer = 'X';
  setTurnIndicator('X');

  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.className = 'cell';
    cell.disabled = false;
  });

  modalBackdrop.classList.remove('show');
}

// Reset all match scores
function resetScores() {
  state.scores = { X: 0, O: 0, ties: 0 };
  saveScores();
  updateScoreboard();
  resetMatch();
}

// Set mode
function setMode(mode) {
  state.mode = mode;
  if (mode === 'pvp') {
    modePvpBtn.classList.add('active');
    modeAiBtn.classList.remove('active');
  } else {
    modeAiBtn.classList.add('active');
    modePvpBtn.classList.remove('active');
  }
  resetMatch();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetMatch);
resetScoresBtn.addEventListener('click', resetScores);
modalPlayAgain.addEventListener('click', resetMatch);

modePvpBtn.addEventListener('click', () => setMode('pvp'));
modeAiBtn.addEventListener('click', () => setMode('ai'));

// Close modal if clicking outside
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) {
    resetMatch();
  }
});

// Initialize
loadScores();
setTurnIndicator('X');
