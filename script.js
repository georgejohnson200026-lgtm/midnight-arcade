const gameRoutes = [
  {
    path: "index.html",
    title: "Home",
    aliases: ["home", "homepage", "midnight arcade"],
  },
  {
    path: "favorite-games.html",
    title: "Favorite Games",
    aliases: ["favorite games", "favorites", "saved games"],
  },
  {
    path: "login.html",
    title: "Login",
    aliases: ["login", "sign in", "account"],
  },
  {
    path: "number-guess.html",
    title: "Number Guess",
    aliases: ["number guess", "guess", "guessing game", "number guessing"],
  },
  {
    path: "rock-paper-scissors.html",
    title: "Rock Paper Scissors",
    aliases: ["rock paper scissors", "rps", "rock paper", "scissors"],
  },
  {
    path: "chess.html",
    title: "Chess",
    aliases: ["chess", "checkmate", "strategy board"],
  },
  {
    path: "snake.html",
    title: "Snake",
    aliases: ["snake", "snake game", "apples"],
  },
  {
    path: "tic-tac-toe.html",
    title: "Tic-Tac-Toe",
    aliases: ["tic tac toe", "tictactoe", "tic tac", "xo"],
  },
  {
    path: "hangman.html",
    title: "Hangman",
    aliases: ["hangman"],
  },
  {
    path: "crazy-taxi.html",
    title: "Crazy Taxi",
    aliases: ["crazy taxi", "taxi", "driving game"],
  },
];

const favoriteGameCatalog = {
  "number-guess.html": {
    path: "number-guess.html",
    title: "Number Guess",
    tag: "Classic",
    description: "Guess the hidden number between 1 and 100.",
  },
  "rock-paper-scissors.html": {
    path: "rock-paper-scissors.html",
    title: "Rock Paper Scissors",
    tag: "Quick Match",
    description: "Challenge the CPU in a fast reaction round.",
  },
  "chess.html": {
    path: "chess.html",
    title: "Chess",
    tag: "Strategy",
    description: "Classic checkmate game with full legal move rules.",
  },
  "snake.html": {
    path: "snake.html",
    title: "Snake",
    tag: "Arcade",
    description: "Eat apples, grow longer, and survive as speed ramps up.",
  },
  "tic-tac-toe.html": {
    path: "tic-tac-toe.html",
    title: "Tic-Tac-Toe",
    tag: "Multiplayer",
    description: "Two players, one board, and three in a row wins.",
  },
  "hangman.html": {
    path: "hangman.html",
    title: "Hangman",
    tag: "Word Play",
    description: "Pick a theme and difficulty, then solve the word.",
  },
  "crazy-taxi.html": {
    path: "crazy-taxi.html",
    title: "Crazy Taxi",
    tag: "Skilled",
    description: "Drive, dodge, and jump through traffic on the highway.",
  },
};

function normalizeGameSearch(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function resolveGameRoute(value) {
  const query = normalizeGameSearch(value);

  if (!query) {
    return null;
  }

  return (
    gameRoutes.find((route) =>
      [route.title, ...route.aliases]
        .map((entry) => normalizeGameSearch(entry))
        .some((entry) => entry === query || entry.includes(query) || query.includes(entry))
    ) || null
  );
}

const sidebarSearchInput = document.getElementById("sidebar-search-input");

if (sidebarSearchInput) {
  sidebarSearchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    const route = resolveGameRoute(sidebarSearchInput.value);

    if (!route) {
      sidebarSearchInput.setCustomValidity("Game not found. Try Chess, Snake, Number Guess, Hangman, Crazy Taxi, Tic-Tac-Toe, or Rock Paper Scissors.");
      sidebarSearchInput.reportValidity();
      return;
    }

    sidebarSearchInput.setCustomValidity("");
    window.location.href = route.path;
  });

  sidebarSearchInput.addEventListener("input", () => {
    sidebarSearchInput.setCustomValidity("");
  });
}

const guessInput = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const resetGuessBtn = document.getElementById("reset-guess-btn");
const guessFeedback = document.getElementById("guess-feedback");
const guessAttempts = document.getElementById("guess-attempts");

let secretNumber = randomNumber();
let attemptCount = 0;

function randomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function updateGuessStatus(message, cssClass = "") {
  guessFeedback.textContent = message;
  guessFeedback.className = `status-text ${cssClass}`.trim();
}

if (guessInput && guessBtn && resetGuessBtn && guessFeedback && guessAttempts) {
  guessBtn.addEventListener("click", () => {
    const value = Number(guessInput.value);

    if (!value || value < 1 || value > 100) {
      updateGuessStatus("Enter a number from 1 to 100.", "lose");
      return;
    }

    attemptCount += 1;
    guessAttempts.textContent = `Attempts: ${attemptCount}`;

    if (value === secretNumber) {
      updateGuessStatus("Correct! You cracked it.", "win");
      return;
    }

    updateGuessStatus(value < secretNumber ? "Too low. Try higher." : "Too high. Try lower.");
  });

  resetGuessBtn.addEventListener("click", () => {
    secretNumber = randomNumber();
    attemptCount = 0;
    guessInput.value = "";
    guessAttempts.textContent = "Attempts: 0";
    updateGuessStatus("New secret number generated.");
  });
}

const rpsButtons = document.querySelectorAll(".rps-btn");
const rpsFeedback = document.getElementById("rps-feedback");
const rpsScore = document.getElementById("rps-score");
const options = ["rock", "paper", "scissors"];

let playerScore = 0;
let cpuScore = 0;

function resultForRound(player, cpu) {
  if (player === cpu) {
    return "draw";
  }

  if (
    (player === "rock" && cpu === "scissors") ||
    (player === "paper" && cpu === "rock") ||
    (player === "scissors" && cpu === "paper")
  ) {
    return "win";
  }

  return "lose";
}

if (rpsButtons.length && rpsFeedback && rpsScore) {
  rpsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const playerChoice = button.dataset.choice;
      const cpuChoice = options[Math.floor(Math.random() * options.length)];
      const outcome = resultForRound(playerChoice, cpuChoice);

      rpsFeedback.className = "status-text";

      if (outcome === "draw") {
        rpsFeedback.textContent = `Draw. Both picked ${playerChoice}.`;
      }

      if (outcome === "win") {
        playerScore += 1;
        rpsFeedback.textContent = `You win this round. CPU picked ${cpuChoice}.`;
        rpsFeedback.classList.add("win");
      }

      if (outcome === "lose") {
        cpuScore += 1;
        rpsFeedback.textContent = `CPU wins this round with ${cpuChoice}.`;
        rpsFeedback.classList.add("lose");
      }

      rpsScore.textContent = `You ${playerScore} : ${cpuScore} CPU`;
    });
  });
}

const ticCells = document.querySelectorAll(".tic-cell");
const ticFeedback = document.getElementById("tic-feedback");
const resetTicBtn = document.getElementById("reset-tic-btn");

let board = Array(9).fill("");
let currentPlayer = "X";
let ticOver = false;

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function findWinner() {
  for (const [a, b, c] of winningPatterns) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function updateTicFeedback(message, cssClass = "") {
  ticFeedback.textContent = message;
  ticFeedback.className = `status-text ${cssClass}`.trim();
}

if (ticCells.length && ticFeedback && resetTicBtn) {
  ticCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (ticOver) {
        return;
      }

      const index = Number(cell.dataset.index);

      if (board[index]) {
        return;
      }

      board[index] = currentPlayer;
      cell.textContent = currentPlayer;

      const winner = findWinner();

      if (winner) {
        ticOver = true;
        updateTicFeedback(`${winner} wins!`, "win");
        return;
      }

      if (board.every(Boolean)) {
        ticOver = true;
        updateTicFeedback("Draw game. Reset for another round.");
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateTicFeedback(`${currentPlayer}'s turn.`);
    });
  });

  resetTicBtn.addEventListener("click", () => {
    board = Array(9).fill("");
    currentPlayer = "X";
    ticOver = false;

    ticCells.forEach((cell) => {
      cell.textContent = "";
    });

    updateTicFeedback("X starts.");
  });
}

// ── Chess ──────────────────────────────────────────────────────────────
(function initChessGame() {
  const boardEl = document.getElementById("chess-board");
  const statusEl = document.getElementById("chess-status");
  const turnEl = document.getElementById("chess-turn");
  const newBtn = document.getElementById("chess-new-btn");
  const flipBtn = document.getElementById("chess-flip-btn");
  const modeSelect = document.getElementById("chess-mode-select");
  const aiLevelSelect = document.getElementById("chess-ai-level");
  const aiLevelLabel = document.querySelector('label[for="chess-ai-level"]');
  const createLinkBtn = document.getElementById("chess-create-link-btn");
  const copyLinkBtn = document.getElementById("chess-copy-link-btn");
  const linkInput = document.getElementById("chess-link-input");
  const linkControls = document.getElementById("chess-link-controls");
  const puzzleControls = document.getElementById("chess-puzzle-controls");
  const puzzleNextBtn = document.getElementById("chess-puzzle-next-btn");

  if (!boardEl || !statusEl || !turnEl || !newBtn || !flipBtn || !modeSelect || !aiLevelSelect) {
    return;
  }

  const pieceGlyphs = {
    wK: "\u2654",
    wQ: "\u2655",
    wR: "\u2656",
    wB: "\u2657",
    wN: "\u2658",
    wP: "\u2659",
    bK: "\u265A",
    bQ: "\u265B",
    bR: "\u265C",
    bB: "\u265D",
    bN: "\u265E",
    bP: "\u265F",
  };

  const knightOffsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  const kingOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const pieceValues = {
    P: 100,
    N: 320,
    B: 330,
    R: 500,
    Q: 900,
    K: 20000,
  };

  const chessPuzzles = [
    {
      title: "Win the Queen",
      prompt: "White to move. Find the move that wins the queen.",
      fen: "4k3/8/8/8/4q3/8/4Q3/4K3 w - - 0 1",
      solution: "e2e4",
    },
    {
      title: "Castle to Safety",
      prompt: "White to move. Play the king-side castling move.",
      fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
      solution: "e1g1",
    },
    {
      title: "Rook Lift",
      prompt: "White to move. Find the precise rook move.",
      fen: "6k1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1",
      solution: "f1e1",
    },
  ];

  let gameState = null;
  let selected = null;
  let legalMoves = [];
  let flipped = false;
  let currentMode = "local";
  let aiLevel = aiLevelSelect.value || "medium";
  let aiColor = "b";
  let aiTimer = null;
  let puzzleIndex = 0;
  let currentPuzzle = null;

  function createInitialBoard() {
    return [
      ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
      ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
      ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
    ];
  }

  function createInitialState() {
    return {
      board: createInitialBoard(),
      turn: "w",
      castling: { wK: true, wQ: true, bK: true, bQ: true },
      enPassant: null,
      gameOver: false,
    };
  }

  function parseSquare(square) {
    if (!square || square === "-") {
      return null;
    }
    const file = square.charCodeAt(0) - 97;
    const rank = Number(square[1]);
    if (file < 0 || file > 7 || rank < 1 || rank > 8) {
      return null;
    }
    return { r: 8 - rank, c: file };
  }

  function toSquare(r, c) {
    return `${String.fromCharCode(97 + c)}${8 - r}`;
  }

  function parseFen(fen) {
    const parts = String(fen || "").trim().split(/\s+/);
    if (parts.length < 4) {
      return null;
    }

    const rows = parts[0].split("/");
    if (rows.length !== 8) {
      return null;
    }

    const board = [];
    for (const rowText of rows) {
      const row = [];
      for (const char of rowText) {
        if (/\d/.test(char)) {
          const empties = Number(char);
          for (let i = 0; i < empties; i += 1) {
            row.push(null);
          }
        } else {
          const color = char === char.toUpperCase() ? "w" : "b";
          const type = char.toUpperCase();
          if (!pieceValues[type]) {
            return null;
          }
          row.push(`${color}${type}`);
        }
      }
      if (row.length !== 8) {
        return null;
      }
      board.push(row);
    }

    const castlingText = parts[2] || "-";
    const castling = {
      wK: castlingText.includes("K"),
      wQ: castlingText.includes("Q"),
      bK: castlingText.includes("k"),
      bQ: castlingText.includes("q"),
    };

    return {
      board,
      turn: parts[1] === "b" ? "b" : "w",
      castling,
      enPassant: parseSquare(parts[3]),
      gameOver: false,
    };
  }

  function boardToFen(board) {
    return board
      .map((row) => {
        let text = "";
        let emptyCount = 0;
        for (const piece of row) {
          if (!piece) {
            emptyCount += 1;
            continue;
          }
          if (emptyCount > 0) {
            text += String(emptyCount);
            emptyCount = 0;
          }
          const char = typeOf(piece);
          text += colorOf(piece) === "w" ? char : char.toLowerCase();
        }
        if (emptyCount > 0) {
          text += String(emptyCount);
        }
        return text;
      })
      .join("/");
  }

  function stateToFen(state) {
    const castlingText = `${state.castling.wK ? "K" : ""}${state.castling.wQ ? "Q" : ""}${state.castling.bK ? "k" : ""}${state.castling.bQ ? "q" : ""}` || "-";
    const enPassantText = state.enPassant ? toSquare(state.enPassant.r, state.enPassant.c) : "-";
    return `${boardToFen(state.board)} ${state.turn} ${castlingText} ${enPassantText} 0 1`;
  }

  function cloneState(state) {
    return {
      board: state.board.map((row) => [...row]),
      turn: state.turn,
      castling: { ...state.castling },
      enPassant: state.enPassant ? { ...state.enPassant } : null,
      gameOver: state.gameOver,
    };
  }

  function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  function colorOf(piece) {
    return piece ? piece[0] : null;
  }

  function typeOf(piece) {
    return piece ? piece[1] : null;
  }

  function enemy(color) {
    return color === "w" ? "b" : "w";
  }

  function setStatus(message, cssClass = "") {
    statusEl.textContent = message;
    statusEl.className = `status-text ${cssClass}`.trim();
  }

  function setTurnLabel() {
    turnEl.textContent = `Turn: ${gameState.turn === "w" ? "White" : "Black"}`;
  }

  function moveKey(move) {
    return `${toSquare(move.fromR, move.fromC)}${toSquare(move.toR, move.toC)}`;
  }

  function findKing(board, color) {
    for (let r = 0; r < 8; r += 1) {
      for (let c = 0; c < 8; c += 1) {
        if (board[r][c] === `${color}K`) {
          return { r, c };
        }
      }
    }
    return null;
  }

  function isSquareAttacked(state, targetR, targetC, byColor) {
    const board = state.board;

    const pawnDir = byColor === "w" ? -1 : 1;
    const pawnAttackRow = targetR - pawnDir;
    for (const dc of [-1, 1]) {
      const c = targetC + dc;
      if (inBounds(pawnAttackRow, c) && board[pawnAttackRow][c] === `${byColor}P`) {
        return true;
      }
    }

    for (const [dr, dc] of knightOffsets) {
      const r = targetR + dr;
      const c = targetC + dc;
      if (inBounds(r, c) && board[r][c] === `${byColor}N`) {
        return true;
      }
    }

    const rookDirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const bishopDirs = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [dr, dc] of rookDirs) {
      let r = targetR + dr;
      let c = targetC + dc;
      while (inBounds(r, c)) {
        const piece = board[r][c];
        if (piece) {
          if (colorOf(piece) === byColor && (typeOf(piece) === "R" || typeOf(piece) === "Q")) {
            return true;
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }

    for (const [dr, dc] of bishopDirs) {
      let r = targetR + dr;
      let c = targetC + dc;
      while (inBounds(r, c)) {
        const piece = board[r][c];
        if (piece) {
          if (colorOf(piece) === byColor && (typeOf(piece) === "B" || typeOf(piece) === "Q")) {
            return true;
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }

    for (const [dr, dc] of kingOffsets) {
      const r = targetR + dr;
      const c = targetC + dc;
      if (inBounds(r, c) && board[r][c] === `${byColor}K`) {
        return true;
      }
    }

    return false;
  }

  function isKingInCheck(state, color) {
    const kingPos = findKing(state.board, color);
    if (!kingPos) return false;
    return isSquareAttacked(state, kingPos.r, kingPos.c, enemy(color));
  }

  function pushMove(moves, fromR, fromC, toR, toC, extra = {}) {
    moves.push({ fromR, fromC, toR, toC, ...extra });
  }

  function generatePseudoMoves(state, r, c) {
    const board = state.board;
    const piece = board[r][c];
    if (!piece) return [];

    const color = colorOf(piece);
    const type = typeOf(piece);
    const moves = [];

    if (type === "P") {
      const dir = color === "w" ? -1 : 1;
      const startRow = color === "w" ? 6 : 1;
      const promotionRow = color === "w" ? 0 : 7;

      const oneR = r + dir;
      if (inBounds(oneR, c) && !board[oneR][c]) {
        pushMove(moves, r, c, oneR, c, { promotion: oneR === promotionRow });
        const twoR = r + dir * 2;
        if (r === startRow && !board[twoR][c]) {
          pushMove(moves, r, c, twoR, c, { pawnDouble: true });
        }
      }

      for (const dc of [-1, 1]) {
        const tr = r + dir;
        const tc = c + dc;
        if (!inBounds(tr, tc)) continue;

        const target = board[tr][tc];
        if (target && colorOf(target) !== color) {
          pushMove(moves, r, c, tr, tc, { capture: true, promotion: tr === promotionRow });
        }

        if (state.enPassant && state.enPassant.r === tr && state.enPassant.c === tc) {
          pushMove(moves, r, c, tr, tc, { enPassant: true, capture: true });
        }
      }
    }

    if (type === "N") {
      for (const [dr, dc] of knightOffsets) {
        const tr = r + dr;
        const tc = c + dc;
        if (!inBounds(tr, tc)) continue;
        const target = board[tr][tc];
        if (!target || colorOf(target) !== color) {
          pushMove(moves, r, c, tr, tc, { capture: !!target });
        }
      }
    }

    if (type === "B" || type === "R" || type === "Q") {
      const dirs = [];
      if (type === "B" || type === "Q") {
        dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
      }
      if (type === "R" || type === "Q") {
        dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);
      }

      for (const [dr, dc] of dirs) {
        let tr = r + dr;
        let tc = c + dc;
        while (inBounds(tr, tc)) {
          const target = board[tr][tc];
          if (!target) {
            pushMove(moves, r, c, tr, tc);
          } else {
            if (colorOf(target) !== color) {
              pushMove(moves, r, c, tr, tc, { capture: true });
            }
            break;
          }
          tr += dr;
          tc += dc;
        }
      }
    }

    if (type === "K") {
      for (const [dr, dc] of kingOffsets) {
        const tr = r + dr;
        const tc = c + dc;
        if (!inBounds(tr, tc)) continue;
        const target = board[tr][tc];
        if (!target || colorOf(target) !== color) {
          pushMove(moves, r, c, tr, tc, { capture: !!target });
        }
      }

      const homeRow = color === "w" ? 7 : 0;
      if (r === homeRow && c === 4 && !isKingInCheck(state, color)) {
        const kingSide = color === "w" ? state.castling.wK : state.castling.bK;
        const queenSide = color === "w" ? state.castling.wQ : state.castling.bQ;

        if (kingSide && !board[homeRow][5] && !board[homeRow][6] && board[homeRow][7] === `${color}R`) {
          if (!isSquareAttacked(state, homeRow, 5, enemy(color)) && !isSquareAttacked(state, homeRow, 6, enemy(color))) {
            pushMove(moves, r, c, homeRow, 6, { castle: "K" });
          }
        }

        if (queenSide && !board[homeRow][1] && !board[homeRow][2] && !board[homeRow][3] && board[homeRow][0] === `${color}R`) {
          if (!isSquareAttacked(state, homeRow, 3, enemy(color)) && !isSquareAttacked(state, homeRow, 2, enemy(color))) {
            pushMove(moves, r, c, homeRow, 2, { castle: "Q" });
          }
        }
      }
    }

    return moves;
  }

  function applyMoveToState(state, move, promotionChoice = "Q") {
    const board = state.board;
    const piece = board[move.fromR][move.fromC];
    const color = colorOf(piece);
    const type = typeOf(piece);
    const target = board[move.toR][move.toC];

    board[move.fromR][move.fromC] = null;

    if (move.enPassant) {
      const capturedRow = move.toR + (color === "w" ? 1 : -1);
      board[capturedRow][move.toC] = null;
    }

    board[move.toR][move.toC] = piece;

    if (move.castle === "K") {
      const row = color === "w" ? 7 : 0;
      board[row][5] = board[row][7];
      board[row][7] = null;
    }
    if (move.castle === "Q") {
      const row = color === "w" ? 7 : 0;
      board[row][3] = board[row][0];
      board[row][0] = null;
    }

    if (move.promotion) {
      const promotionType = ["Q", "R", "B", "N"].includes(promotionChoice) ? promotionChoice : "Q";
      board[move.toR][move.toC] = `${color}${promotionType}`;
    }

    if (type === "K") {
      if (color === "w") {
        state.castling.wK = false;
        state.castling.wQ = false;
      } else {
        state.castling.bK = false;
        state.castling.bQ = false;
      }
    }

    if (type === "R") {
      if (color === "w" && move.fromR === 7 && move.fromC === 0) state.castling.wQ = false;
      if (color === "w" && move.fromR === 7 && move.fromC === 7) state.castling.wK = false;
      if (color === "b" && move.fromR === 0 && move.fromC === 0) state.castling.bQ = false;
      if (color === "b" && move.fromR === 0 && move.fromC === 7) state.castling.bK = false;
    }

    if (target && typeOf(target) === "R") {
      if (move.toR === 7 && move.toC === 0) state.castling.wQ = false;
      if (move.toR === 7 && move.toC === 7) state.castling.wK = false;
      if (move.toR === 0 && move.toC === 0) state.castling.bQ = false;
      if (move.toR === 0 && move.toC === 7) state.castling.bK = false;
    }

    if (type === "P" && move.pawnDouble) {
      state.enPassant = {
        r: (move.fromR + move.toR) / 2,
        c: move.fromC,
      };
    } else {
      state.enPassant = null;
    }

    state.turn = enemy(color);
  }

  function getLegalMovesForSquare(state, r, c) {
    const piece = state.board[r][c];
    if (!piece || colorOf(piece) !== state.turn) {
      return [];
    }

    const color = colorOf(piece);
    const pseudoMoves = generatePseudoMoves(state, r, c);
    return pseudoMoves.filter((move) => {
      const testState = cloneState(state);
      applyMoveToState(testState, move, "Q");
      return !isKingInCheck(testState, color);
    });
  }

  function getAllLegalMoves(state, color) {
    const moves = [];
    for (let r = 0; r < 8; r += 1) {
      for (let c = 0; c < 8; c += 1) {
        const piece = state.board[r][c];
        if (piece && colorOf(piece) === color) {
          const pieceMoves = getLegalMovesForSquare({ ...state, turn: color }, r, c);
          pieceMoves.forEach((move) => moves.push(move));
        }
      }
    }
    return moves;
  }

  function evaluateState(state) {
    const legal = getAllLegalMoves(state, state.turn);
    const inCheck = isKingInCheck(state, state.turn);
    if (legal.length === 0 && inCheck) {
      return state.turn === "w" ? -999999 : 999999;
    }
    if (legal.length === 0 && !inCheck) {
      return 0;
    }

    let score = 0;
    for (let r = 0; r < 8; r += 1) {
      for (let c = 0; c < 8; c += 1) {
        const piece = state.board[r][c];
        if (!piece) continue;
        const value = pieceValues[typeOf(piece)] || 0;
        score += colorOf(piece) === "w" ? value : -value;
      }
    }
    return score;
  }

  function searchMoveScore(state, depth, alpha, beta) {
    if (depth === 0) {
      return evaluateState(state);
    }

    const moves = getAllLegalMoves(state, state.turn);
    if (!moves.length) {
      return evaluateState(state);
    }

    if (state.turn === "w") {
      let best = -Infinity;
      for (const move of moves) {
        const next = cloneState(state);
        applyMoveToState(next, move, "Q");
        const score = searchMoveScore(next, depth - 1, alpha, beta);
        if (score > best) {
          best = score;
        }
        alpha = Math.max(alpha, best);
        if (beta <= alpha) {
          break;
        }
      }
      return best;
    }

    let best = Infinity;
    for (const move of moves) {
      const next = cloneState(state);
      applyMoveToState(next, move, "Q");
      const score = searchMoveScore(next, depth - 1, alpha, beta);
      if (score < best) {
        best = score;
      }
      beta = Math.min(beta, best);
      if (beta <= alpha) {
        break;
      }
    }
    return best;
  }

  function chooseComputerMove(state, level) {
    const moves = getAllLegalMoves(state, aiColor);
    if (!moves.length) return null;

    if (level === "easy") {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    const depth = level === "hard" ? 2 : 1;
    let scored = moves.map((move) => {
      const next = cloneState(state);
      applyMoveToState(next, move, "Q");
      const score = searchMoveScore(next, depth, -Infinity, Infinity);
      return { move, score };
    });

    scored.sort((a, b) => (aiColor === "w" ? b.score - a.score : a.score - b.score));

    if (level === "medium") {
      const top = scored.slice(0, Math.min(3, scored.length));
      return top[Math.floor(Math.random() * top.length)].move;
    }

    return scored[0].move;
  }

  function toBoardCoords(displayRow, displayCol) {
    if (!flipped) {
      return { r: displayRow, c: displayCol };
    }
    return { r: 7 - displayRow, c: 7 - displayCol };
  }

  function squareHasLegalMove(r, c) {
    return legalMoves.some((move) => move.toR === r && move.toC === c);
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    for (let dr = 0; dr < 8; dr += 1) {
      for (let dc = 0; dc < 8; dc += 1) {
        const { r, c } = toBoardCoords(dr, dc);
        const piece = gameState.board[r][c];
        const square = document.createElement("button");
        square.type = "button";
        square.className = `chess-square ${(r + c) % 2 === 0 ? "light" : "dark"}`;
        if (selected && selected.r === r && selected.c === c) {
          square.classList.add("selected");
        }
        if (squareHasLegalMove(r, c)) {
          square.classList.add("legal");
        }
        square.dataset.row = String(r);
        square.dataset.col = String(c);

        const pieceSpan = document.createElement("span");
        pieceSpan.className = `chess-piece ${piece ? (colorOf(piece) === "w" ? "white" : "black") : ""}`;
        pieceSpan.textContent = piece ? pieceGlyphs[piece] : "";
        square.appendChild(pieceSpan);

        if (dr === 7) {
          const file = document.createElement("span");
          file.className = "coord-file";
          file.textContent = String.fromCharCode(97 + c);
          square.appendChild(file);
        }

        if (dc === 0) {
          const rank = document.createElement("span");
          rank.className = "coord-rank";
          rank.textContent = String(8 - r);
          square.appendChild(rank);
        }

        square.addEventListener("click", () => handleSquareClick(r, c));
        boardEl.appendChild(square);
      }
    }
  }

  function askPromotionChoice() {
    const answer = prompt("Promote pawn to: Q, R, B, or N", "Q");
    const upper = String(answer || "Q").trim().toUpperCase();
    if (["Q", "R", "B", "N"].includes(upper)) {
      return upper;
    }
    return "Q";
  }

  function updateInviteLink() {
    if (!linkInput || currentMode !== "link") return;
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("mode", "link");
    nextUrl.searchParams.set("fen", stateToFen(gameState));
    linkInput.value = nextUrl.toString();
  }

  function updateModeUI() {
    const isComputer = currentMode === "computer";
    const isLink = currentMode === "link";
    const isPuzzle = currentMode === "puzzle";

    if (aiLevelSelect) {
      aiLevelSelect.classList.toggle("hidden", !isComputer);
      aiLevelSelect.disabled = !isComputer;
    }
    if (aiLevelLabel) {
      aiLevelLabel.classList.toggle("hidden", !isComputer);
    }
    if (linkControls) {
      linkControls.classList.toggle("hidden", !isLink);
    }
    if (linkInput) {
      linkInput.classList.toggle("hidden", !isLink);
    }
    if (puzzleControls) {
      puzzleControls.classList.toggle("hidden", !isPuzzle);
    }
  }

  function stopComputerTimer() {
    if (aiTimer) {
      clearTimeout(aiTimer);
      aiTimer = null;
    }
  }

  function scheduleComputerMove() {
    if (currentMode !== "computer" || gameState.gameOver || gameState.turn !== aiColor) {
      return;
    }

    stopComputerTimer();
    setStatus("Computer is thinking...");
    aiTimer = setTimeout(() => {
      const aiMove = chooseComputerMove(gameState, aiLevel);
      if (!aiMove) {
        updateGameOutcome();
        return;
      }
      performMove(aiMove, { isComputer: true, promotionChoice: "Q" });
    }, aiLevel === "hard" ? 450 : 300);
  }

  function loadPuzzle(index) {
    puzzleIndex = ((index % chessPuzzles.length) + chessPuzzles.length) % chessPuzzles.length;
    currentPuzzle = chessPuzzles[puzzleIndex];
    const parsed = parseFen(currentPuzzle.fen);
    if (!parsed) {
      return;
    }
    gameState = parsed;
    selected = null;
    legalMoves = [];
    setTurnLabel();
    setStatus(`Puzzle: ${currentPuzzle.prompt}`);
    renderBoard();
  }

  function updateFromUrlIfPresent() {
    const params = new URLSearchParams(window.location.search);
    const requestedMode = params.get("mode");
    if (["local", "computer", "link", "puzzle"].includes(requestedMode)) {
      currentMode = requestedMode;
      modeSelect.value = requestedMode;
    }

    if (currentMode === "link") {
      const fen = params.get("fen");
      const parsed = fen ? parseFen(fen) : null;
      if (parsed) {
        gameState = parsed;
      }
    }
  }

  function updateGameOutcome() {
    const color = gameState.turn;
    const allMoves = getAllLegalMoves(gameState, color);
    const checked = isKingInCheck(gameState, color);

    if (allMoves.length === 0 && checked) {
      gameState.gameOver = true;
      setStatus(`Checkmate. ${color === "w" ? "Black" : "White"} wins.`, "win");
      return;
    }

    if (allMoves.length === 0 && !checked) {
      gameState.gameOver = true;
      setStatus("Stalemate. Draw game.", "");
      return;
    }

    if (checked) {
      setStatus(`${color === "w" ? "White" : "Black"} is in check.`, "lose");
      return;
    }

    setStatus(`${color === "w" ? "White" : "Black"} to move.`);
  }

  function performMove(move, options = {}) {
    if (gameState.gameOver) {
      return;
    }

    const piece = gameState.board[move.fromR][move.fromC];
    if (!piece) {
      return;
    }

    if (currentMode === "puzzle" && !options.isComputer && currentPuzzle) {
      const expected = currentPuzzle.solution.toLowerCase();
      if (moveKey(move).toLowerCase() !== expected) {
        setStatus("Not the puzzle move. Try again.", "lose");
        selected = null;
        legalMoves = [];
        renderBoard();
        return;
      }
    }

    const promotionChoice = options.promotionChoice || (move.promotion ? askPromotionChoice() : "Q");
    applyMoveToState(gameState, move, promotionChoice);

    selected = null;
    legalMoves = [];
    setTurnLabel();

    if (currentMode === "puzzle" && currentPuzzle && !options.isComputer) {
      gameState.gameOver = true;
      setStatus("Correct move. Puzzle solved!", "win");
    } else {
      updateGameOutcome();
    }

    renderBoard();

    if (currentMode === "link") {
      updateInviteLink();
      if (!gameState.gameOver) {
        setStatus("Move made. Copy and send the updated invite link to your opponent.", "win");
      }
    }

    scheduleComputerMove();
  }

  function handleSquareClick(r, c) {
    if (gameState.gameOver) {
      return;
    }

    const piece = gameState.board[r][c];

    if (selected && squareHasLegalMove(r, c)) {
      const move = legalMoves.find((entry) => entry.toR === r && entry.toC === c);
      if (move) {
        performMove(move);
        return;
      }
    }

    if (piece && colorOf(piece) === gameState.turn) {
      selected = { r, c };
      legalMoves = getLegalMovesForSquare(gameState, r, c);
      renderBoard();
      return;
    }

    selected = null;
    legalMoves = [];
    renderBoard();
  }

  function resetGame() {
    stopComputerTimer();

    if (currentMode === "puzzle") {
      loadPuzzle(puzzleIndex);
      return;
    }

    gameState = createInitialState();
    selected = null;
    legalMoves = [];
    setTurnLabel();
    if (currentMode === "computer") {
      setStatus("White vs computer. White to move.");
    } else if (currentMode === "link") {
      setStatus("Link multiplayer ready. Make a move, then share the generated link.");
    } else {
      setStatus("White to move.");
    }
    renderBoard();

    if (currentMode === "link") {
      updateInviteLink();
    }

    scheduleComputerMove();
  }

  newBtn.addEventListener("click", () => {
    resetGame();
  });

  flipBtn.addEventListener("click", () => {
    flipped = !flipped;
    renderBoard();
  });

  modeSelect.addEventListener("change", () => {
    currentMode = modeSelect.value;
    updateModeUI();
    resetGame();
  });

  aiLevelSelect.addEventListener("change", () => {
    aiLevel = aiLevelSelect.value;
    if (currentMode === "computer") {
      scheduleComputerMove();
    }
  });

  if (createLinkBtn) {
    createLinkBtn.addEventListener("click", () => {
      if (currentMode !== "link") {
        setStatus("Switch to Link Multiplayer mode first.", "lose");
        return;
      }
      updateInviteLink();
      setStatus("Invite link generated. Send it to your opponent.", "win");
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", async () => {
      if (!linkInput || !linkInput.value) {
        setStatus("Create an invite link first.", "lose");
        return;
      }
      try {
        await navigator.clipboard.writeText(linkInput.value);
        setStatus("Invite link copied.", "win");
      } catch (error) {
        setStatus("Copy failed. Select and copy the link manually.", "lose");
      }
    });
  }

  if (puzzleNextBtn) {
    puzzleNextBtn.addEventListener("click", () => {
      if (currentMode !== "puzzle") {
        setStatus("Switch to Chess Puzzles mode first.", "lose");
        return;
      }
      loadPuzzle(puzzleIndex + 1);
    });
  }

  updateFromUrlIfPresent();
  updateModeUI();
  if (currentMode === "link" && gameState) {
    selected = null;
    legalMoves = [];
    setTurnLabel();
    setStatus("Invite position loaded. Continue the game and share the updated link each turn.", "win");
    renderBoard();
    updateInviteLink();
  } else if (currentMode === "puzzle") {
    loadPuzzle(puzzleIndex);
  } else {
    resetGame();
  }
})();

// ── Snake ──────────────────────────────────────────────────────────────
(function initSnakeGame() {
  const snakeCanvas = document.getElementById("snake-canvas");
  const snakeScore = document.getElementById("snake-score");
  const snakeStatus = document.getElementById("snake-status");
  const snakeStartBtn = document.getElementById("snake-start-btn");
  const snakeResetBtn = document.getElementById("snake-reset-btn");

  if (!snakeCanvas || !snakeScore || !snakeStatus || !snakeStartBtn || !snakeResetBtn) {
    return;
  }

  const ctx = snakeCanvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const GRID_SIZE = 20;
  const CELL_SIZE = Math.floor(snakeCanvas.width / GRID_SIZE);
  const BASE_TICK_MS = 200;

  let snake = [];
  let direction = { x: 1, y: 0 };
  let queuedDirection = { x: 1, y: 0 };
  let food = { x: 0, y: 0 };
  let score = 0;
  let loopTimer = null;
  let gameOver = false;
  let gameRunning = false;

  function setSnakeStatus(message, cssClass = "") {
    snakeStatus.textContent = message;
    snakeStatus.className = `status-text ${cssClass}`.trim();
  }

  function updateSnakeScore() {
    snakeScore.textContent = `Score: ${score}`;
  }

  function randomCell() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  function positionOnSnake(position) {
    return snake.some((segment) => segment.x === position.x && segment.y === position.y);
  }

  function spawnFood() {
    let candidate = randomCell();
    while (positionOnSnake(candidate)) {
      candidate = randomCell();
    }
    food = candidate;
  }

  function directionToAngle(dir) {
    if (dir.x === 1) return 0;
    if (dir.x === -1) return Math.PI;
    if (dir.y === -1) return -Math.PI / 2;
    return Math.PI / 2;
  }

  function segmentCenter(segment) {
    return {
      x: segment.x * CELL_SIZE + CELL_SIZE / 2,
      y: segment.y * CELL_SIZE + CELL_SIZE / 2,
    };
  }

  function drawGrid() {
    const bg = ctx.createRadialGradient(
      snakeCanvas.width * 0.3,
      snakeCanvas.height * 0.25,
      24,
      snakeCanvas.width * 0.5,
      snakeCanvas.height * 0.5,
      snakeCanvas.width * 0.75
    );
    bg.addColorStop(0, "#14233a");
    bg.addColorStop(1, "#060c16");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    ctx.strokeStyle = "rgba(140, 170, 210, 0.13)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i += 1) {
      const offset = i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset, snakeCanvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, offset);
      ctx.lineTo(snakeCanvas.width, offset);
      ctx.stroke();
    }
  }

  function drawFood() {
    const centerX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = food.y * CELL_SIZE + CELL_SIZE / 2;

    // Ground shadow to anchor the apple on the board.
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + CELL_SIZE * 0.32, CELL_SIZE * 0.32, CELL_SIZE * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Apple body silhouette (two-lobed top, tapered bottom).
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - CELL_SIZE * 0.36);
    ctx.bezierCurveTo(
      centerX - CELL_SIZE * 0.32,
      centerY - CELL_SIZE * 0.43,
      centerX - CELL_SIZE * 0.45,
      centerY - CELL_SIZE * 0.07,
      centerX - CELL_SIZE * 0.2,
      centerY + CELL_SIZE * 0.2
    );
    ctx.bezierCurveTo(
      centerX - CELL_SIZE * 0.15,
      centerY + CELL_SIZE * 0.38,
      centerX + CELL_SIZE * 0.15,
      centerY + CELL_SIZE * 0.38,
      centerX + CELL_SIZE * 0.2,
      centerY + CELL_SIZE * 0.2
    );
    ctx.bezierCurveTo(
      centerX + CELL_SIZE * 0.45,
      centerY - CELL_SIZE * 0.07,
      centerX + CELL_SIZE * 0.32,
      centerY - CELL_SIZE * 0.43,
      centerX,
      centerY - CELL_SIZE * 0.36
    );

    const appleGradient = ctx.createRadialGradient(
      centerX - CELL_SIZE * 0.14,
      centerY - CELL_SIZE * 0.2,
      CELL_SIZE * 0.08,
      centerX,
      centerY,
      CELL_SIZE * 0.5
    );
    appleGradient.addColorStop(0, "#ffe1c9");
    appleGradient.addColorStop(0.45, "#ff7f3f");
    appleGradient.addColorStop(1, "#9a2f10");

    ctx.fillStyle = appleGradient;
    ctx.fill();

    // Apple top dimple.
    ctx.fillStyle = "rgba(60, 20, 7, 0.45)";
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - CELL_SIZE * 0.28, CELL_SIZE * 0.09, CELL_SIZE * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stem.
    ctx.strokeStyle = "#6b4320";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(centerX - CELL_SIZE * 0.02, centerY - CELL_SIZE * 0.29);
    ctx.lineTo(centerX + CELL_SIZE * 0.04, centerY - CELL_SIZE * 0.48);
    ctx.stroke();

    // Leaf.
    ctx.fillStyle = "#6ecf58";
    ctx.beginPath();
    ctx.ellipse(centerX + CELL_SIZE * 0.16, centerY - CELL_SIZE * 0.4, CELL_SIZE * 0.11, CELL_SIZE * 0.055, -0.45, 0, Math.PI * 2);
    ctx.fill();

    // Gloss highlight.
    ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
    ctx.beginPath();
    ctx.ellipse(centerX - CELL_SIZE * 0.13, centerY - CELL_SIZE * 0.16, CELL_SIZE * 0.09, CELL_SIZE * 0.05, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSnake() {
    if (!snake.length) return;

    const points = snake.map(segmentCenter);
    const bodyWidth = CELL_SIZE * 0.58;
    const headWidth = CELL_SIZE * 0.84;

    // Draw one continuous snake body path.
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    if (points.length > 1) {
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
    }

    // Body shadow for depth.
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = bodyWidth + 6;
    ctx.stroke();

    const bodyGradient = ctx.createLinearGradient(points[0].x, points[0].y - bodyWidth, points[0].x, points[0].y + bodyWidth);
    bodyGradient.addColorStop(0, "#8bd18b");
    bodyGradient.addColorStop(0.45, "#4f9b53");
    bodyGradient.addColorStop(1, "#2f5f34");

    ctx.strokeStyle = bodyGradient;
    ctx.lineWidth = bodyWidth;
    ctx.stroke();

    // Top highlight strip across the body.
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = bodyWidth * 0.25;
    ctx.stroke();

    const head = snake[0];
    const angle = directionToAngle(direction);
    const centerX = head.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = head.y * CELL_SIZE + CELL_SIZE / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    // Wider head with depth.
    const headSkin = ctx.createLinearGradient(-headWidth * 0.6, -headWidth * 0.5, headWidth * 0.6, headWidth * 0.5);
    headSkin.addColorStop(0, "#9ee09d");
    headSkin.addColorStop(0.5, "#5ca85d");
    headSkin.addColorStop(1, "#345f36");
    ctx.fillStyle = headSkin;
    ctx.beginPath();
    ctx.ellipse(headWidth * 0.1, 0, headWidth * 0.54, headWidth * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (larger and obvious).
    ctx.fillStyle = "#fdf9f0";
    ctx.beginPath();
    ctx.ellipse(headWidth * 0.24, -headWidth * 0.18, headWidth * 0.13, headWidth * 0.1, 0, 0, Math.PI * 2);
    ctx.ellipse(headWidth * 0.24, headWidth * 0.18, headWidth * 0.13, headWidth * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#18150f";
    ctx.beginPath();
    ctx.arc(headWidth * 0.28, -headWidth * 0.18, headWidth * 0.05, 0, Math.PI * 2);
    ctx.arc(headWidth * 0.28, headWidth * 0.18, headWidth * 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Mouth and teeth.
    ctx.fillStyle = "#172221";
    ctx.beginPath();
    ctx.ellipse(headWidth * 0.42, 0, headWidth * 0.18, headWidth * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    for (let i = -2; i <= 2; i += 1) {
      const toothY = i * headWidth * 0.06;
      ctx.beginPath();
      ctx.moveTo(headWidth * 0.38, toothY - headWidth * 0.02);
      ctx.lineTo(headWidth * 0.44, toothY);
      ctx.lineTo(headWidth * 0.38, toothY + headWidth * 0.02);
      ctx.fill();
    }

    ctx.restore();

    // Tapered tail that narrows down visibly.
    const tail = snake[snake.length - 1];
    const beforeTail = snake[snake.length - 2] || tail;
    const tailDir = {
      x: tail.x - beforeTail.x,
      y: tail.y - beforeTail.y,
    };
    const tailAngle = directionToAngle(tailDir.x === 0 && tailDir.y === 0 ? direction : tailDir);
    const tailX = tail.x * CELL_SIZE + CELL_SIZE / 2;
    const tailY = tail.y * CELL_SIZE + CELL_SIZE / 2;

    ctx.save();
    ctx.translate(tailX, tailY);
    ctx.rotate(tailAngle);
    const tailGrad = ctx.createLinearGradient(-bodyWidth * 0.8, 0, bodyWidth * 0.4, 0);
    tailGrad.addColorStop(0, "#3f7e43");
    tailGrad.addColorStop(1, "#284f2b");
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(-bodyWidth * 0.9, 0);
    ctx.lineTo(bodyWidth * 0.25, -bodyWidth * 0.2);
    ctx.lineTo(bodyWidth * 0.25, bodyWidth * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderSnake() {
    drawGrid();
    drawFood();
    drawSnake();
  }

  function stopSnakeLoop() {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
    gameRunning = false;
  }

  function startSnakeLoop() {
    if (gameRunning || gameOver) {
      return;
    }
    gameRunning = true;
    loopTimer = setInterval(stepSnake, BASE_TICK_MS);
  }

  function setDirection(nextDirection) {
    if (gameOver) {
      return;
    }

    const reversing = direction.x === -nextDirection.x && direction.y === -nextDirection.y;
    if (reversing && snake.length > 1) {
      return;
    }

    queuedDirection = nextDirection;
    if (!gameRunning) {
      startSnakeLoop();
    }
  }

  function endSnakeGame(reason) {
    gameOver = true;
    stopSnakeLoop();
    setSnakeStatus(`Game over: ${reason}`, "lose");
  }

  function stepSnake() {
    direction = queuedDirection;
    const head = snake[0];
    const newHead = {
      x: head.x + direction.x,
      y: head.y + direction.y,
    };

    const hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID_SIZE || newHead.y >= GRID_SIZE;
    if (hitWall) {
      endSnakeGame("you hit a wall");
      return;
    }

    const hitSelf = snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y);
    if (hitSelf) {
      endSnakeGame("you hit yourself");
      return;
    }

    snake.unshift(newHead);

    const ateFood = newHead.x === food.x && newHead.y === food.y;
    if (ateFood) {
      score += 1;
      updateSnakeScore();
      spawnFood();
      setSnakeStatus("Apple eaten. Keep going!", "win");
    } else {
      snake.pop();
      setSnakeStatus("Use arrow keys or WASD. Eat apples and avoid collisions.");
    }

    renderSnake();
  }

  function resetSnakeGame() {
    stopSnakeLoop();
    snake = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ];
    direction = { x: 1, y: 0 };
    queuedDirection = { x: 1, y: 0 };
    score = 0;
    gameOver = false;
    spawnFood();
    updateSnakeScore();
    setSnakeStatus("Press Start or move with arrow keys to begin.");
    renderSnake();
  }

  snakeStartBtn.addEventListener("click", () => {
    if (!gameRunning && !gameOver) {
      startSnakeLoop();
      setSnakeStatus("Snake is moving. Eat apples and avoid walls/body.");
      return;
    }
    if (gameOver) {
      resetSnakeGame();
      startSnakeLoop();
      setSnakeStatus("New run started.");
    }
  });

  snakeResetBtn.addEventListener("click", () => {
    resetSnakeGame();
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "arrowup" || key === "w") {
      event.preventDefault();
      setDirection({ x: 0, y: -1 });
    } else if (key === "arrowdown" || key === "s") {
      event.preventDefault();
      setDirection({ x: 0, y: 1 });
    } else if (key === "arrowleft" || key === "a") {
      event.preventDefault();
      setDirection({ x: -1, y: 0 });
    } else if (key === "arrowright" || key === "d") {
      event.preventDefault();
      setDirection({ x: 1, y: 0 });
    }
  });

  resetSnakeGame();
})();

const hangmanTheme = document.getElementById("hangman-theme");
const hangmanDifficulty = document.getElementById("hangman-difficulty");
const hangmanNewBtn = document.getElementById("hangman-new-btn");
const hangmanHint = document.getElementById("hangman-hint");
const hangmanWord = document.getElementById("hangman-word");
const hangmanFeedback = document.getElementById("hangman-feedback");
const hangmanLives = document.getElementById("hangman-lives");
const hangmanGuessed = document.getElementById("hangman-guessed");
const hangmanLetters = document.getElementById("hangman-letters");
const hangmanStage = document.getElementById("hangman-stage");
const hangmanBanner = document.getElementById("hangman-banner");
const hangmanConfetti = document.getElementById("hangman-confetti");

const hangmanParts = [
  document.getElementById("hangman-head"),
  document.getElementById("hangman-body"),
  document.getElementById("hangman-left-arm"),
  document.getElementById("hangman-right-arm"),
  document.getElementById("hangman-left-leg"),
  document.getElementById("hangman-right-leg"),
];

const MAX_HANGMAN_MISSES = 6;
const confettiColors = ["#42e8b4", "#ffcc66", "#ff6f87", "#5ec8ff", "#ffffff"];

const hangmanWords = {
  sports: {
    easy: ["golf", "ball", "race", "coach", "tennis"],
    medium: ["stadium", "baseball", "referee", "fitness", "cycling"],
    hard: ["badminton", "decathlon", "gymnastics", "waterski", "triathlon"],
  },
  movies: {
    easy: ["jaws", "rocky", "shrek", "frozen", "avatar"],
    medium: ["titanic", "inception", "gladiator", "goodfellas", "casablanca"],
    hard: ["interstellar", "godfather", "oppenheimer", "ratatouille", "jurassicpark"],
  },
  entertainment: {
    easy: ["music", "dance", "radio", "album", "comic"],
    medium: ["festival", "karaoke", "broadway", "podcast", "concert"],
    hard: ["orchestra", "headliner", "streaming", "television", "celebrity"],
  },
  everyday: {
    easy: ["chair", "plate", "phone", "socks", "brush"],
    medium: ["backpack", "microwave", "notebook", "blanket", "charger"],
    hard: ["headphones", "flashlight", "bookshelf", "toothbrush", "refrigerator"],
  },
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let currentHangmanWord = "";
let hangmanGuesses = [];
let wrongGuessCount = 0;
let hangmanOver = false;

function formatThemeLabel(theme) {
  if (theme === "movies") {
    return "Movies";
  }

  if (theme === "entertainment") {
    return "Entertainment";
  }

  if (theme === "everyday") {
    return "Everyday Items";
  }

  return "Sports";
}

function updateHangmanMessage(message, cssClass = "") {
  hangmanFeedback.textContent = message;
  hangmanFeedback.className = `status-text ${cssClass}`.trim();
}

function renderHangmanWord() {
  const maskedWord = currentHangmanWord
    .split("")
    .map((letter) => (hangmanGuesses.includes(letter) ? letter : "_"))
    .join(" ");

  hangmanWord.textContent = maskedWord;
}

function updateHangmanMeta() {
  hangmanHint.textContent = `Theme: ${formatThemeLabel(hangmanTheme.value)} • Difficulty: ${hangmanDifficulty.value}`;
  hangmanLives.textContent = `Mistakes left: ${MAX_HANGMAN_MISSES - wrongGuessCount}`;
  hangmanGuessed.textContent = `Guessed: ${hangmanGuesses.length ? hangmanGuesses.join(", ") : "None"}`;
}

function updateHangmanDrawing() {
  hangmanParts.forEach((part, index) => {
    part.classList.toggle("visible", index < wrongGuessCount);
  });
}

function setHangmanBanner(text = "", cssClass = "") {
  hangmanBanner.textContent = text;
  hangmanBanner.className = `hangman-banner ${cssClass}`.trim();

  if (text) {
    hangmanBanner.classList.add("visible");
  }
}

function createConfetti() {
  hangmanConfetti.innerHTML = "";

  for (let index = 0; index < 24; index += 1) {
    const piece = document.createElement("span");
    const drift = `${Math.floor(Math.random() * 80) - 40}px`;
    const delay = `${Math.floor(Math.random() * 500)}ms`;
    const left = `${Math.floor(Math.random() * 100)}%`;
    const color = confettiColors[index % confettiColors.length];

    piece.className = "confetti-piece";
    piece.style.left = left;
    piece.style.background = color;
    piece.style.setProperty("--delay", delay);
    piece.style.setProperty("--drift", drift);
    hangmanConfetti.appendChild(piece);
  }
}

function resetHangmanCelebration() {
  hangmanStage.classList.remove("won");
  hangmanStage.classList.remove("lost");

  void hangmanStage.offsetWidth;
}

function triggerHangmanWinCelebration() {
  createConfetti();
  resetHangmanCelebration();
  hangmanStage.classList.add("won");
}

function triggerHangmanLossState() {
  hangmanStage.classList.remove("won");
  hangmanStage.classList.add("lost");
}

function setLetterButtonsDisabled(disabled) {
  const buttons = hangmanLetters.querySelectorAll(".letter-btn");
  buttons.forEach((button) => {
    button.disabled = disabled || hangmanGuesses.includes(button.dataset.letter);
  });
}

function handleHangmanGuess(letter) {
  if (hangmanOver || hangmanGuesses.includes(letter)) {
    return;
  }

  hangmanGuesses.push(letter);

  if (!currentHangmanWord.includes(letter)) {
    wrongGuessCount += 1;
    updateHangmanMessage(`${letter} is not in the word.`, "lose");
  } else {
    updateHangmanMessage(`${letter} is in the word. Keep going.`, "win");
  }

  updateHangmanDrawing();
  renderHangmanWord();
  updateHangmanMeta();
  setLetterButtonsDisabled(false);

  const isSolved = currentHangmanWord.split("").every((letterInWord) => hangmanGuesses.includes(letterInWord));

  if (isSolved) {
    hangmanOver = true;
    triggerHangmanWinCelebration();
    setHangmanBanner("You win", "win-text");
    updateHangmanMessage("You win", "win");
    setLetterButtonsDisabled(true);
    return;
  }

  if (wrongGuessCount === MAX_HANGMAN_MISSES) {
    hangmanOver = true;
    hangmanWord.textContent = currentHangmanWord.split("").join(" ");
    triggerHangmanLossState();
    setHangmanBanner("Game Over", "lose-text");
    updateHangmanMessage("Game Over", "lose");
    setLetterButtonsDisabled(true);
  }
}

function createLetterButtons() {
  hangmanLetters.innerHTML = "";

  alphabet.forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-btn";
    button.dataset.letter = letter;
    button.textContent = letter;
    button.addEventListener("click", () => handleHangmanGuess(letter));
    hangmanLetters.appendChild(button);
  });
}

function startHangmanRound() {
  const words = hangmanWords[hangmanTheme.value][hangmanDifficulty.value];
  currentHangmanWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  hangmanGuesses = [];
  wrongGuessCount = 0;
  hangmanOver = false;
  hangmanConfetti.innerHTML = "";
  hangmanStage.classList.remove("won");
  hangmanStage.classList.remove("lost");

  updateHangmanDrawing();
  setHangmanBanner();
  renderHangmanWord();
  updateHangmanMeta();
  updateHangmanMessage("Choose a letter to begin.");
  setLetterButtonsDisabled(false);
}

if (
  hangmanTheme &&
  hangmanDifficulty &&
  hangmanNewBtn &&
  hangmanHint &&
  hangmanWord &&
  hangmanFeedback &&
  hangmanLives &&
  hangmanGuessed &&
  hangmanLetters &&
  hangmanStage &&
  hangmanBanner &&
  hangmanConfetti &&
  hangmanParts.every(Boolean)
) {
  hangmanTheme.addEventListener("change", startHangmanRound);
  hangmanDifficulty.addEventListener("change", startHangmanRound);
  hangmanNewBtn.addEventListener("click", startHangmanRound);

  createLetterButtons();
  startHangmanRound();
}

const taxiCanvas = document.getElementById("taxi-canvas");
const taxiStatus = document.getElementById("taxi-status");
const taxiSpeed = document.getElementById("taxi-speed");
const taxiSpeedFill = document.getElementById("taxi-speed-fill");
const taxiDistance = document.getElementById("taxi-distance");
const taxiResetBtn = document.getElementById("taxi-reset-btn");
const taxiMenuBtn = document.getElementById("taxi-menu-btn");
const taxiMenu = document.getElementById("taxi-menu");
const taxiResumeBtn = document.getElementById("taxi-resume-btn");
const taxiCloseMenuBtn = document.getElementById("taxi-close-menu-btn");

if (taxiCanvas) {
  const taxiContext = taxiCanvas.getContext("2d");
  const taxiKeys = {
    ArrowUp: false,
    ArrowDown: false,
  };

  const jumpSpeedThreshold = 70;
  const stageDistanceMeters = 3000;
  const runTimeSeconds = 63;
  const bonusTimeSeconds = 60;
  const finishLineRevealDistance = 800;
  const horizonY = 126;
  const roadTopWidth = 110;
  const roadBottomWidth = 760;
  const playerBaseY = 430;
  const taxiPalette = ["#e12b1a", "#6f3cff", "#ff9f1c", "#1f9cff", "#1fb86c"];
  const maxTaxiSpeed = 130;

  const taxiState = {
    player: {
      lane: 1,
      laneVisual: 1,
      speed: 0,
      jumpOffset: 0,
      jumpVelocity: 0,
      jumping: false,
      crashTimer: 0,
      knockback: 0,
    },
    traffic: [],
    roadsideItems: [],
    spawnTimer: 0,
    dashOffset: 0,
    startLineOffset: 0,
    distanceMeters: stageDistanceMeters,
    timeLeft: runTimeSeconds,
    level: 1,
    score: 0,
    message: "Press the arrow keys to drive. Space jumps once you have enough speed.",
    messageTimer: 0,
    paused: false,
    lastTime: 0,
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function setTaxiMessage(message, duration = 0) {
    taxiState.message = message;
    taxiState.messageTimer = duration;
  }

  function createRoadsideItem(side, type, depth = randomBetween(0.05, 0.95)) {
    return {
      side,
      type,
      depth,
      variant: Math.floor(randomBetween(0, 3)),
      tint: randomBetween(0.88, 1.08),
    };
  }

  function targetTrafficCount() {
    return taxiState.level === 1 ? 4 : 7;
  }

  function minLaneTrafficGap() {
    return taxiState.level === 1 ? 0.31 : 0.27;
  }

  function trafficSpawnInterval() {
    return taxiState.level === 1 ? randomBetween(1.2, 1.8) : randomBetween(0.8, 1.15);
  }

  function resetRoadsideItems() {
    taxiState.roadsideItems = [];

    for (let index = 0; index < 34; index += 1) {
      taxiState.roadsideItems.push(createRoadsideItem("left", index % 10 === 0 ? "house" : "grass", 0.03 + index * 0.04));
      taxiState.roadsideItems.push(createRoadsideItem("right", index % 11 === 0 ? "house" : "grass", 0.05 + index * 0.04));
    }
  }

  function respawnRoadsideItem(item) {
    const nextType = Math.random() > 0.9 ? "house" : "grass";
    const sameSideItems = taxiState.roadsideItems
      .filter((entry) => entry !== item && entry.side === item.side && entry.type === nextType)
      .map((entry) => entry.depth);
    const nearestDepth = sameSideItems.length ? Math.min(...sameSideItems) : 0.12;
    const gap = nextType === "house" ? 0.34 : 0.045;

    Object.assign(item, createRoadsideItem(item.side, nextType, nearestDepth - gap));
  }

  function canPlaceTrafficCar(lane, depth) {
    return taxiState.traffic.every((car) => car.lane !== lane || Math.abs(car.depth - depth) >= minLaneTrafficGap());
  }

  function beginNextTaxiLevel() {
    taxiState.level += 1;
    taxiState.distanceMeters = stageDistanceMeters;
    taxiState.timeLeft += bonusTimeSeconds;
    taxiState.startLineOffset = taxiCanvas.height + 120;
    taxiState.score += 1000 * taxiState.level;
    taxiState.spawnTimer = trafficSpawnInterval();
    setTaxiMessage(`Level ${taxiState.level}. +${bonusTimeSeconds} seconds. Traffic is getting busier.`, 2.1);

    while (taxiState.traffic.length < targetTrafficCount()) {
      spawnTrafficCar(randomBetween(0.08, 0.4));
    }
  }

  function clearTaxiKeys() {
    taxiKeys.ArrowUp = false;
    taxiKeys.ArrowDown = false;
  }

  function openTaxiMenu() {
    taxiState.paused = true;
    clearTaxiKeys();
    taxiMenu.hidden = false;
    taxiMenuBtn.setAttribute("aria-expanded", "true");
  }

  function closeTaxiMenu() {
    taxiState.paused = false;
    taxiMenu.hidden = true;
    taxiMenuBtn.setAttribute("aria-expanded", "false");
    taxiState.lastTime = 0;
  }

  function isTaxiCrashed() {
    return taxiState.player.crashTimer > 0;
  }

  function perspectiveWidth(depth) {
    return lerp(roadTopWidth, roadBottomWidth, depth);
  }

  function screenYForDepth(depth) {
    return lerp(horizonY, playerBaseY, depth);
  }

  function laneCenterAtDepth(laneIndex, depth) {
    const width = perspectiveWidth(depth);
    const left = taxiCanvas.width / 2 - width / 2;
    return left + (width / 3) * (laneIndex + 0.5);
  }

  function spawnTrafficCar(initialDepth = randomBetween(0.08, 0.42)) {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const depth = attempt === 0 ? initialDepth : randomBetween(0.08, 0.36);
      const laneOrder = [0, 1, 2].sort(() => Math.random() - 0.5);
      const lane = laneOrder.find((candidateLane) => canPlaceTrafficCar(candidateLane, depth));

      if (lane === undefined) {
        continue;
      }

      taxiState.traffic.push({
        lane,
        depth,
        speed: randomBetween(18, 42),
        color: taxiPalette[Math.floor(Math.random() * taxiPalette.length)],
        number: Math.floor(randomBetween(10, 99)),
        roofSign: Math.random() > 0.72,
      });

      return true;
    }

    return false;
  }

  function enforceTrafficSpacing() {
    const laneGap = minLaneTrafficGap();

    for (let lane = 0; lane < 3; lane += 1) {
      const laneCars = taxiState.traffic.filter((car) => car.lane === lane).sort((first, second) => first.depth - second.depth);

      for (let index = 1; index < laneCars.length; index += 1) {
        const leadCar = laneCars[index - 1];
        const trailingCar = laneCars[index];
        const currentGap = trailingCar.depth - leadCar.depth;

        if (currentGap < laneGap) {
          trailingCar.depth = leadCar.depth + laneGap;
        }
      }
    }
  }

  function resetTaxiGame() {
    taxiState.player.lane = 1;
    taxiState.player.laneVisual = 1;
    taxiState.player.speed = 0;
    taxiState.player.jumpOffset = 0;
    taxiState.player.jumpVelocity = 0;
    taxiState.player.jumping = false;
    taxiState.player.crashTimer = 0;
    taxiState.player.knockback = 0;
    taxiState.traffic = [];
    taxiState.spawnTimer = trafficSpawnInterval();
    taxiState.dashOffset = 0;
    taxiState.startLineOffset = 0;
    taxiState.distanceMeters = stageDistanceMeters;
    taxiState.timeLeft = runTimeSeconds;
    taxiState.level = 1;
    taxiState.score = 0;
    taxiState.messageTimer = 0;
    taxiState.paused = false;
    taxiState.lastTime = 0;
    clearTaxiKeys();
    taxiMenu.hidden = true;
    taxiMenuBtn.setAttribute("aria-expanded", "false");

    for (let index = 0; index < targetTrafficCount(); index += 1) {
      spawnTrafficCar(0.12 + index * 0.17);
    }

    resetRoadsideItems();

    setTaxiMessage("Press the arrow keys to drive. Space jumps once you have enough speed.");
    taxiSpeed.textContent = "0";
    taxiDistance.textContent = (stageDistanceMeters / 1609).toFixed(1);
  }

  function updateTaxiStatus(deltaTime) {
    if (taxiState.paused) {
      taxiStatus.textContent = "Game paused. Resume when you are ready to drive again.";
      taxiStatus.className = "status-text";
      return;
    }

    if (taxiState.messageTimer > 0) {
      taxiState.messageTimer = Math.max(0, taxiState.messageTimer - deltaTime);
      taxiStatus.textContent = taxiState.message;
      taxiStatus.className = "status-text";

      if (isTaxiCrashed() || taxiState.timeLeft <= 0) {
        taxiStatus.classList.add("lose");
      }

      return;
    }

    taxiStatus.className = "status-text";

    if (isTaxiCrashed()) {
      taxiStatus.textContent = "Crash. You got shoved back and lost speed, but the run is still live.";
      taxiStatus.classList.add("lose");
      return;
    }

    if (taxiState.distanceMeters <= 0) {
      taxiStatus.textContent = "Finish line crossed. Next level is loading in.";
      taxiStatus.classList.add("win");
      return;
    }

    if (taxiState.timeLeft <= 0) {
      taxiStatus.textContent = "Out of time. Restart the run and keep your speed up.";
      taxiStatus.classList.add("lose");
      return;
    }

    if (taxiState.player.jumping) {
      taxiStatus.textContent = "Airborne. Clear the traffic and line up the landing.";
      taxiStatus.classList.add("win");
      return;
    }

    if (taxiState.player.speed >= jumpSpeedThreshold) {
      taxiStatus.textContent = "Jump is live. Space launches the taxi over slower cars.";
      taxiStatus.classList.add("win");
      return;
    }

    taxiStatus.textContent = "Build to 70 mph, then use space to jump traffic.";
  }

  function updateTaxiGame(deltaTime) {
    if (taxiState.paused) {
      updateTaxiStatus(0);
      return;
    }

    const player = taxiState.player;
    const runActive = taxiState.timeLeft > 0 && taxiState.distanceMeters > 0;

    player.crashTimer = Math.max(0, player.crashTimer - deltaTime);
    player.knockback = Math.max(0, player.knockback - 90 * deltaTime);

    if (runActive) {
      if (taxiKeys.ArrowUp) {
        player.speed = Math.min(130, player.speed + 74 * deltaTime);
      }

      if (taxiKeys.ArrowDown) {
        player.speed = Math.max(0, player.speed - 108 * deltaTime);
      } else {
        player.speed = Math.max(0, player.speed - 26 * deltaTime);
      }

      const worldSpeed = player.speed;

      player.laneVisual += (player.lane - player.laneVisual) * Math.min(1, deltaTime * 8);
      taxiState.timeLeft = Math.max(0, taxiState.timeLeft - deltaTime);
      taxiState.distanceMeters = Math.max(0, taxiState.distanceMeters - ((worldSpeed * deltaTime) / 2.2) * 3);
      taxiState.score += worldSpeed * deltaTime * 3;
      taxiState.dashOffset = (taxiState.dashOffset - worldSpeed * deltaTime * 3.2 + 86) % 86;
      taxiState.startLineOffset += worldSpeed * deltaTime * 0.9;

      if (player.jumping) {
        player.jumpOffset += player.jumpVelocity * deltaTime;
        player.jumpVelocity -= 1400 * deltaTime;

        if (player.jumpOffset <= 0) {
          player.jumpOffset = 0;
          player.jumpVelocity = 0;
          player.jumping = false;
        }
      }

      if (worldSpeed > 0) {
        taxiState.spawnTimer -= deltaTime;
      }

      if (taxiState.spawnTimer <= 0 && taxiState.traffic.length < targetTrafficCount()) {
        spawnTrafficCar();
        taxiState.spawnTimer = trafficSpawnInterval();
      }

      taxiState.traffic.forEach((car) => {
        car.depth += Math.max(0, (worldSpeed - car.speed + 14) / 170) * deltaTime;
      });

      enforceTrafficSpacing();

      taxiState.roadsideItems.forEach((item) => {
        item.depth += Math.max(0, worldSpeed / 2900) * deltaTime;

        if (item.depth > 1.08) {
          respawnRoadsideItem(item);
        }
      });

      taxiState.traffic = taxiState.traffic.filter((car) => {
        if (car.depth > 1.12) {
          if (!isTaxiCrashed()) {
            taxiState.score += 120;
          }

          return false;
        }

        return true;
      });

      for (const car of taxiState.traffic) {
        if (car.lane === player.lane && car.depth > 0.78 && car.depth < 0.95 && player.jumpOffset < 95 && player.crashTimer === 0) {
          player.crashTimer = 0.9;
          player.speed = Math.max(18, player.speed * 0.45);
          player.knockback = 38;
          car.depth = 1.08;
          setTaxiMessage("Crash. You got knocked back and lost speed. Floor it to recover.", 1.4);
          break;
        }
      }

      if (taxiState.distanceMeters <= 0) {
        beginNextTaxiLevel();
      }

      if (taxiState.timeLeft <= 0 && taxiState.distanceMeters > 0) {
        player.speed = 0;
        setTaxiMessage("Out of time. Restart the run and keep your pace up.", 1.8);
      }
    } else {
      player.laneVisual += (player.lane - player.laneVisual) * Math.min(1, deltaTime * 8);
    }

    taxiSpeed.textContent = Math.round(player.speed).toString();
    taxiSpeedFill.style.width = `${(player.speed / maxTaxiSpeed) * 100}%`;
    taxiDistance.textContent = Math.max(0, taxiState.distanceMeters / 1609).toFixed(1);
    updateTaxiStatus(deltaTime);
  }

  function drawOutlinedText(text, x, y, size, align = "left") {
    taxiContext.font = `700 ${size}px "Bungee", "Segoe UI", sans-serif`;
    taxiContext.textAlign = align;
    taxiContext.lineJoin = "round";
    taxiContext.lineWidth = Math.max(3, size * 0.18);
    taxiContext.strokeStyle = "#7aa6de";
    taxiContext.strokeText(text, x, y);
    taxiContext.fillStyle = "#ffffff";
    taxiContext.fillText(text, x, y);
  }

  function drawHouse(x, y, scale, bodyColor, roofColor) {
    const sideColor = roofColor === "#b25b32" ? "#cf8d54" : roofColor === "#7f5d51" ? "#d3c1b9" : "#f4cf7b";

    taxiContext.save();
    taxiContext.translate(x, y);
    taxiContext.scale(scale, scale);
    taxiContext.fillStyle = bodyColor;
    taxiContext.strokeStyle = "#1b1b1b";
    taxiContext.lineWidth = 2;
    taxiContext.beginPath();
    taxiContext.moveTo(34, -26);
    taxiContext.lineTo(50, -36);
    taxiContext.lineTo(50, 16);
    taxiContext.lineTo(34, 26);
    taxiContext.closePath();
    taxiContext.fillStyle = sideColor;
    taxiContext.fill();
    taxiContext.stroke();

    taxiContext.fillRect(-34, -26, 68, 52);
    taxiContext.strokeRect(-34, -26, 68, 52);
    taxiContext.fillStyle = roofColor;
    taxiContext.beginPath();
    taxiContext.moveTo(-40, -24);
    taxiContext.lineTo(0, -52);
    taxiContext.lineTo(40, -24);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();
    taxiContext.beginPath();
    taxiContext.moveTo(40, -24);
    taxiContext.lineTo(54, -34);
    taxiContext.lineTo(14, -62);
    taxiContext.lineTo(0, -52);
    taxiContext.closePath();
    taxiContext.fillStyle = roofColor;
    taxiContext.fill();
    taxiContext.stroke();
    taxiContext.fillStyle = "#f9f2b4";
    taxiContext.fillRect(-22, -12, 12, 14);
    taxiContext.fillRect(10, -12, 12, 14);
    taxiContext.fillRect(36, -6, 8, 12);
    taxiContext.fillStyle = "#6f4e37";
    taxiContext.fillRect(-6, 4, 12, 22);
    taxiContext.restore();
  }

  function drawShrub(x, y, scale) {
    const bladeColor = "#2ea941";
    const edgeColor = "#126225";

    taxiContext.save();
    taxiContext.translate(x, y);
    taxiContext.scale(scale, scale);
    taxiContext.fillStyle = "rgba(17, 81, 28, 0.25)";
    taxiContext.beginPath();
    taxiContext.ellipse(0, 14, 26, 6, 0, 0, Math.PI * 2);
    taxiContext.fill();
    taxiContext.fillStyle = bladeColor;
    taxiContext.strokeStyle = edgeColor;
    taxiContext.lineWidth = 2;

    for (const xOffset of [-16, -8, 0, 8, 16]) {
      taxiContext.beginPath();
      taxiContext.moveTo(xOffset, 14);
      taxiContext.lineTo(xOffset - 4, -10);
      taxiContext.lineTo(xOffset + 2, -2);
      taxiContext.lineTo(xOffset + 6, -16);
      taxiContext.lineTo(xOffset + 8, 14);
      taxiContext.closePath();
      taxiContext.fill();
      taxiContext.stroke();
    }

    taxiContext.restore();
  }

  function drawRoadsideItem(item) {
    const depth = clamp(item.depth, 0.02, 1);
    const y = screenYForDepth(depth);
    const roadHalf = perspectiveWidth(depth) / 2;
    const sideOffset = item.side === "left" ? -1 : 1;
    const grassTuftScale = 0.54;
    const roadClearance = item.type === "house" ? lerp(170, 280, depth) : lerp(44, 110, depth);
    const x =
      taxiCanvas.width / 2 +
      sideOffset * (roadHalf + roadClearance);
    const scale = item.type === "house" ? lerp(1.25, 4.05, depth) : grassTuftScale;

    if (item.type === "house") {
      const palettes = [
        ["#ffc86b", "#b25b32"],
        ["#c7e0ff", "#7f5d51"],
        ["#ffe5a9", "#8f6a44"],
      ];
      const [bodyColor, roofColor] = palettes[item.variant % palettes.length];
      drawHouse(x, y - lerp(4, 18, depth), scale, bodyColor, roofColor);
      return;
    }

    drawShrub(x, y + 20, scale);
  }

  function drawPerspectiveCar(centerX, baseY, scale, color, isPlayer = false, crashed = false, jumpOffset = 0, roofSign = false) {
    taxiContext.save();
    taxiContext.translate(centerX, baseY - jumpOffset);

    if (crashed) {
      taxiContext.rotate(-0.08);
    }

    const bodyWidth = 130 * scale;
    const bodyHeight = 76 * scale;
    const darkColor = "#111111";
    const lowerBodyColor = isPlayer ? "#b11412" : "#2e247d";
    const sidePanelColor = isPlayer ? "#d71d17" : "#4539a3";
    const windowColor = isPlayer ? "#3b65ff" : "#6b5bdf";

    taxiContext.fillStyle = "rgba(0, 0, 0, 0.22)";
    taxiContext.beginPath();
    taxiContext.ellipse(0, 18 * scale + Math.min(12, jumpOffset * 0.08), 56 * scale, 16 * scale, 0, 0, Math.PI * 2);
    taxiContext.fill();

    const bodyGradient = taxiContext.createLinearGradient(0, -bodyHeight * 0.44, 0, bodyHeight * 0.5);
    bodyGradient.addColorStop(0, color);
    bodyGradient.addColorStop(0.58, color);
    bodyGradient.addColorStop(1, lowerBodyColor);
    taxiContext.fillStyle = bodyGradient;
    taxiContext.strokeStyle = darkColor;
    taxiContext.lineWidth = 4 * scale;

    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.52, bodyHeight * 0.48);
    taxiContext.lineTo(-bodyWidth * 0.58, -bodyHeight * 0.02);
    taxiContext.lineTo(-bodyWidth * 0.22, -bodyHeight * 0.44);
    taxiContext.lineTo(bodyWidth * 0.22, -bodyHeight * 0.44);
    taxiContext.lineTo(bodyWidth * 0.58, -bodyHeight * 0.02);
    taxiContext.lineTo(bodyWidth * 0.52, bodyHeight * 0.48);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();

    taxiContext.fillStyle = sidePanelColor;
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.56, bodyHeight * 0.11);
    taxiContext.lineTo(-bodyWidth * 0.36, bodyHeight * 0.26);
    taxiContext.lineTo(-bodyWidth * 0.18, bodyHeight * 0.18);
    taxiContext.lineTo(-bodyWidth * 0.28, -bodyHeight * 0.02);
    taxiContext.lineTo(-bodyWidth * 0.5, -bodyHeight * 0.01);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();
    taxiContext.beginPath();
    taxiContext.moveTo(bodyWidth * 0.56, bodyHeight * 0.11);
    taxiContext.lineTo(bodyWidth * 0.36, bodyHeight * 0.26);
    taxiContext.lineTo(bodyWidth * 0.18, bodyHeight * 0.18);
    taxiContext.lineTo(bodyWidth * 0.28, -bodyHeight * 0.02);
    taxiContext.lineTo(bodyWidth * 0.5, -bodyHeight * 0.01);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();

    taxiContext.fillStyle = windowColor;
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.18, -bodyHeight * 0.36);
    taxiContext.lineTo(bodyWidth * 0.18, -bodyHeight * 0.36);
    taxiContext.lineTo(bodyWidth * 0.3, -bodyHeight * 0.04);
    taxiContext.lineTo(-bodyWidth * 0.3, -bodyHeight * 0.04);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();

    taxiContext.fillStyle = "rgba(255, 255, 255, 0.18)";
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.12, -bodyHeight * 0.31);
    taxiContext.lineTo(0, -bodyHeight * 0.29);
    taxiContext.lineTo(-bodyWidth * 0.06, -bodyHeight * 0.09);
    taxiContext.lineTo(-bodyWidth * 0.2, -bodyHeight * 0.12);
    taxiContext.closePath();
    taxiContext.fill();

    taxiContext.fillStyle = lowerBodyColor;
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.34, -bodyHeight * 0.04);
    taxiContext.lineTo(bodyWidth * 0.34, -bodyHeight * 0.04);
    taxiContext.lineTo(bodyWidth * 0.24, bodyHeight * 0.08);
    taxiContext.lineTo(-bodyWidth * 0.24, bodyHeight * 0.08);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();

    if (isPlayer || roofSign) {
      taxiContext.fillStyle = "#f3f1d1";
      taxiContext.fillRect(-bodyWidth * 0.14, -bodyHeight * 0.56, bodyWidth * 0.28, bodyHeight * 0.12);
      taxiContext.strokeRect(-bodyWidth * 0.14, -bodyHeight * 0.56, bodyWidth * 0.28, bodyHeight * 0.12);
    }

    taxiContext.fillStyle = darkColor;
    taxiContext.font = `${Math.max(8, 14 * scale)}px "Space Grotesk", sans-serif`;
    taxiContext.textAlign = "center";
    if (isPlayer || roofSign) {
      taxiContext.fillText(isPlayer ? "TAXI" : "CAB", 0, -bodyHeight * 0.47);
    }

    taxiContext.fillStyle = color;
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.56, bodyHeight * 0.12);
    taxiContext.lineTo(-bodyWidth * 0.34, bodyHeight * 0.28);
    taxiContext.lineTo(bodyWidth * 0.34, bodyHeight * 0.28);
    taxiContext.lineTo(bodyWidth * 0.56, bodyHeight * 0.12);
    taxiContext.lineTo(bodyWidth * 0.5, bodyHeight * 0.22);
    taxiContext.lineTo(-bodyWidth * 0.5, bodyHeight * 0.22);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();

    taxiContext.fillStyle = "rgba(255, 255, 255, 0.12)";
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.43, bodyHeight * 0.08);
    taxiContext.lineTo(0, bodyHeight * 0.14);
    taxiContext.lineTo(bodyWidth * 0.36, bodyHeight * 0.09);
    taxiContext.lineTo(bodyWidth * 0.24, bodyHeight * 0.03);
    taxiContext.lineTo(-bodyWidth * 0.28, bodyHeight * 0.02);
    taxiContext.closePath();
    taxiContext.fill();

    taxiContext.fillRect(-bodyWidth * 0.6, bodyHeight * 0.08, bodyWidth * 1.2, bodyHeight * 0.11);
    taxiContext.strokeRect(-bodyWidth * 0.6, bodyHeight * 0.08, bodyWidth * 1.2, bodyHeight * 0.11);

    taxiContext.fillStyle = "#101010";
    taxiContext.fillRect(-bodyWidth * 0.47, bodyHeight * 0.06, bodyWidth * 0.06, bodyHeight * 0.15);
    taxiContext.fillRect(bodyWidth * 0.41, bodyHeight * 0.06, bodyWidth * 0.06, bodyHeight * 0.15);

    taxiContext.fillStyle = "#ffef00";
    taxiContext.fillRect(-bodyWidth * 0.18, -bodyHeight * 0.02, bodyWidth * 0.36, bodyHeight * 0.14);
    taxiContext.strokeRect(-bodyWidth * 0.18, -bodyHeight * 0.02, bodyWidth * 0.36, bodyHeight * 0.14);

    taxiContext.fillStyle = "#ffeaa0";
    taxiContext.fillRect(-bodyWidth * 0.42, bodyHeight * 0.03, bodyWidth * 0.12, bodyHeight * 0.08);
    taxiContext.fillRect(bodyWidth * 0.3, bodyHeight * 0.03, bodyWidth * 0.12, bodyHeight * 0.08);
    taxiContext.strokeRect(-bodyWidth * 0.42, bodyHeight * 0.03, bodyWidth * 0.12, bodyHeight * 0.08);
    taxiContext.strokeRect(bodyWidth * 0.3, bodyHeight * 0.03, bodyWidth * 0.12, bodyHeight * 0.08);

    taxiContext.fillStyle = "#be1010";
    taxiContext.fillRect(-bodyWidth * 0.48, bodyHeight * 0.2, bodyWidth * 0.96, bodyHeight * 0.12);
    taxiContext.strokeRect(-bodyWidth * 0.48, bodyHeight * 0.2, bodyWidth * 0.96, bodyHeight * 0.12);

    taxiContext.fillStyle = "#ff3b30";
    taxiContext.fillRect(-bodyWidth * 0.37, bodyHeight * 0.23, bodyWidth * 0.09, bodyHeight * 0.07);
    taxiContext.fillRect(bodyWidth * 0.28, bodyHeight * 0.23, bodyWidth * 0.09, bodyHeight * 0.07);
    taxiContext.strokeRect(-bodyWidth * 0.37, bodyHeight * 0.23, bodyWidth * 0.09, bodyHeight * 0.07);
    taxiContext.strokeRect(bodyWidth * 0.28, bodyHeight * 0.23, bodyWidth * 0.09, bodyHeight * 0.07);

    taxiContext.fillStyle = "#cc2a2a";
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.58, -bodyHeight * 0.02);
    taxiContext.lineTo(-bodyWidth * 0.48, bodyHeight * 0.16);
    taxiContext.lineTo(-bodyWidth * 0.2, bodyHeight * 0.16);
    taxiContext.lineTo(-bodyWidth * 0.3, -bodyHeight * 0.02);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();
    taxiContext.beginPath();
    taxiContext.moveTo(bodyWidth * 0.58, -bodyHeight * 0.02);
    taxiContext.lineTo(bodyWidth * 0.48, bodyHeight * 0.16);
    taxiContext.lineTo(bodyWidth * 0.2, bodyHeight * 0.16);
    taxiContext.lineTo(bodyWidth * 0.3, -bodyHeight * 0.02);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.stroke();

    taxiContext.fillStyle = "rgba(0, 0, 0, 0.24)";
    taxiContext.fillRect(-bodyWidth * 0.44, bodyHeight * 0.32, bodyWidth * 0.88, bodyHeight * 0.07);

    taxiContext.strokeStyle = "rgba(255, 255, 255, 0.2)";
    taxiContext.lineWidth = 2 * scale;
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.2, -bodyHeight * 0.42);
    taxiContext.lineTo(-bodyWidth * 0.28, -bodyHeight * 0.03);
    taxiContext.moveTo(bodyWidth * 0.2, -bodyHeight * 0.42);
    taxiContext.lineTo(bodyWidth * 0.28, -bodyHeight * 0.03);
    taxiContext.stroke();

    taxiContext.fillStyle = darkColor;
    taxiContext.fillRect(-bodyWidth * 0.55, bodyHeight * 0.33, bodyWidth * 0.18, bodyHeight * 0.22);
    taxiContext.fillRect(bodyWidth * 0.37, bodyHeight * 0.33, bodyWidth * 0.18, bodyHeight * 0.22);

    taxiContext.fillStyle = "rgba(255, 255, 255, 0.14)";
    taxiContext.beginPath();
    taxiContext.moveTo(-bodyWidth * 0.18, -bodyHeight * 0.3);
    taxiContext.lineTo(0, -bodyHeight * 0.22);
    taxiContext.lineTo(0, bodyHeight * 0.12);
    taxiContext.lineTo(-bodyWidth * 0.24, bodyHeight * 0.02);
    taxiContext.closePath();
    taxiContext.fill();
    taxiContext.beginPath();
    taxiContext.moveTo(bodyWidth * 0.08, -bodyHeight * 0.28);
    taxiContext.lineTo(bodyWidth * 0.22, -bodyHeight * 0.21);
    taxiContext.lineTo(bodyWidth * 0.24, bodyHeight * 0.04);
    taxiContext.lineTo(bodyWidth * 0.08, bodyHeight * 0.1);
    taxiContext.closePath();
    taxiContext.fill();

    taxiContext.restore();
  }

  function drawRoad() {
    taxiContext.clearRect(0, 0, taxiCanvas.width, taxiCanvas.height);

    const skyGradient = taxiContext.createLinearGradient(0, 0, 0, horizonY);
    skyGradient.addColorStop(0, "#73d1d6");
    skyGradient.addColorStop(1, "#d6f7ff");
    taxiContext.fillStyle = skyGradient;
    taxiContext.fillRect(0, 0, taxiCanvas.width, horizonY);

    taxiContext.fillStyle = "#7fcb5a";
    taxiContext.fillRect(0, horizonY, taxiCanvas.width, taxiCanvas.height - horizonY);
    taxiContext.fillStyle = "#68b74a";
    for (let strip = 0; strip < taxiCanvas.width; strip += 18) {
      taxiContext.fillRect(strip, horizonY + 12, 10, taxiCanvas.height - horizonY - 12);
    }
    taxiContext.fillStyle = "#5da341";
    for (let strip = 8; strip < taxiCanvas.width; strip += 22) {
      taxiContext.fillRect(strip, horizonY + 20, 6, taxiCanvas.height - horizonY - 20);
    }

    taxiContext.fillStyle = "#73bf53";
    taxiContext.beginPath();
    taxiContext.moveTo(0, taxiCanvas.height);
    taxiContext.lineTo(taxiCanvas.width / 2 - roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.lineTo(taxiCanvas.width / 2 - roadTopWidth / 2, horizonY);
    taxiContext.lineTo(0, horizonY);
    taxiContext.closePath();
    taxiContext.fill();

    taxiContext.beginPath();
    taxiContext.moveTo(taxiCanvas.width, taxiCanvas.height);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width, horizonY);
    taxiContext.closePath();
    taxiContext.fill();

    taxiContext.fillStyle = "#aeaeae";
    taxiContext.beginPath();
    taxiContext.moveTo(taxiCanvas.width / 2 - roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.lineTo(taxiCanvas.width / 2 - roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.closePath();
    taxiContext.fill();

    taxiContext.save();
    taxiContext.beginPath();
    taxiContext.moveTo(taxiCanvas.width / 2 - roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.lineTo(taxiCanvas.width / 2 - roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.closePath();
    taxiContext.clip();


    taxiContext.strokeStyle = "#ececec";
    taxiContext.lineWidth = 4;
    taxiContext.beginPath();
    taxiContext.moveTo(taxiCanvas.width / 2 - roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 - roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.moveTo(taxiCanvas.width / 2 + roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.stroke();

    taxiContext.strokeStyle = "#ffffff";
    for (let y = horizonY + 18 - taxiState.dashOffset; y < taxiCanvas.height; y += 86) {
      const depth = clamp((y - horizonY) / (playerBaseY - horizonY), 0, 1);
      const nextDepth = clamp((y + 34 - horizonY) / (playerBaseY - horizonY), 0, 1);
      const roadWidth = perspectiveWidth(depth);
      const laneWidth = roadWidth / 3;
      const dashWidth = lerp(3, 9, depth);

      taxiContext.lineWidth = dashWidth;

      for (let divider = 1; divider <= 2; divider += 1) {
        const x1 = taxiCanvas.width / 2 - roadWidth / 2 + laneWidth * divider;
        const nextRoadWidth = perspectiveWidth(nextDepth);
        const nextLaneWidth = nextRoadWidth / 3;
        const x2 = taxiCanvas.width / 2 - nextRoadWidth / 2 + nextLaneWidth * divider;
        const nextY = y + 34;
        taxiContext.beginPath();
        taxiContext.moveTo(x1, y);
        taxiContext.lineTo(x2, nextY);
        taxiContext.stroke();
      }
    }

    taxiContext.restore();

    const startLineY = 424 + taxiState.startLineOffset;

    if (startLineY < taxiCanvas.height + 50) {
      const startLineWidth = perspectiveWidth(0.97);
      const startLineLeft = taxiCanvas.width / 2 - startLineWidth / 2;
      const squareSize = 20;

      for (let row = 0; row < 2; row += 1) {
        for (let column = 0; column < Math.ceil(startLineWidth / squareSize); column += 1) {
          taxiContext.fillStyle = (row + column) % 2 === 0 ? "#ffffff" : "#111111";
          taxiContext.fillRect(startLineLeft + column * squareSize, startLineY + row * squareSize, squareSize, squareSize);
        }
      }
    }

    taxiContext.strokeStyle = "#ff8e00";
    taxiContext.lineWidth = 4;
    taxiContext.beginPath();
    taxiContext.moveTo(10, 180);
    taxiContext.lineTo(10, 460);
    taxiContext.stroke();
    taxiContext.beginPath();
    taxiContext.moveTo(taxiCanvas.width - 10, 180);
    taxiContext.lineTo(taxiCanvas.width - 10, 460);
    taxiContext.stroke();

    taxiContext.fillStyle = "#ffec2f";
    taxiContext.strokeStyle = "#0f0f0f";
    taxiContext.lineWidth = 3;
    taxiContext.save();
    taxiContext.translate(taxiCanvas.width - 72, 256);
    taxiContext.rotate(Math.PI / 4);
    taxiContext.beginPath();
    taxiContext.roundRect(-34, -34, 68, 68, 10);
    taxiContext.fill();
    taxiContext.stroke();
    taxiContext.restore();
    drawOutlinedText("10", taxiCanvas.width - 72, 266, 28, "center");
  }

  function drawTaxiHud() {
    drawOutlinedText(`SCORE: ${Math.round(taxiState.score)}`, 18, 34, 22);
    drawOutlinedText(`LEVEL: ${taxiState.level}`, 18, 142, 18);
    drawOutlinedText(`DISTANCE LEFT: ${Math.max(0, Math.round(taxiState.distanceMeters))} M`, 18, 70, 20);
    drawOutlinedText(`TIME LEFT: ${Math.max(0, Math.ceil(taxiState.timeLeft))} S`, 18, 106, 20);
  }

  function drawFinishLine() {
    if (taxiState.distanceMeters > finishLineRevealDistance) {
      return;
    }

    const progress = 1 - clamp(taxiState.distanceMeters / finishLineRevealDistance, 0, 1);
    const depth = lerp(0.18, 0.96, progress);
    const lineY = screenYForDepth(depth);
    const lineHeight = lerp(6, 24, depth);
    const lineWidth = perspectiveWidth(depth);
    const left = taxiCanvas.width / 2 - lineWidth / 2;
    const squareSize = Math.max(10, lineHeight);

    taxiContext.save();
    taxiContext.beginPath();
    taxiContext.moveTo(taxiCanvas.width / 2 - roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadTopWidth / 2, horizonY);
    taxiContext.lineTo(taxiCanvas.width / 2 + roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.lineTo(taxiCanvas.width / 2 - roadBottomWidth / 2, taxiCanvas.height);
    taxiContext.closePath();
    taxiContext.clip();

    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < Math.ceil(lineWidth / squareSize); column += 1) {
        taxiContext.fillStyle = (row + column) % 2 === 0 ? "#ffffff" : "#111111";
        taxiContext.fillRect(left + column * squareSize, lineY + row * lineHeight, squareSize, lineHeight);
      }
    }

    taxiContext.restore();
  }

  function drawTaxiScene() {
    drawRoad();

    taxiState.roadsideItems
      .slice()
      .sort((first, second) => first.depth - second.depth)
      .forEach((item) => drawRoadsideItem(item));

    drawFinishLine();

    taxiState.traffic
      .slice()
      .sort((first, second) => first.depth - second.depth)
      .forEach((car) => {
        const depth = clamp(car.depth, 0.02, 0.98);
        const y = screenYForDepth(depth);
        const scale = lerp(0.22, 0.9, depth);
        const x = laneCenterAtDepth(car.lane, depth);
        drawPerspectiveCar(x, y, scale, car.color, false, false, 0, car.roofSign);
      });

    const playerX = laneCenterAtDepth(taxiState.player.laneVisual, 0.97);
    drawPerspectiveCar(
      playerX,
      playerBaseY + taxiState.player.knockback,
      1,
      isTaxiCrashed() ? "#ff6f87" : "#ef2b1b",
      true,
      isTaxiCrashed(),
      taxiState.player.jumpOffset,
      true
    );
    drawTaxiHud();
  }

  function taxiLoop(timestamp) {
    if (!taxiState.lastTime) {
      taxiState.lastTime = timestamp;
    }

    const deltaTime = Math.min(0.033, (timestamp - taxiState.lastTime) / 1000);
    taxiState.lastTime = timestamp;

    updateTaxiGame(deltaTime);
    drawTaxiScene();
    requestAnimationFrame(taxiLoop);
  }

  function handleTaxiKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
      if (event.code === "Escape" && !taxiMenu.hidden) {
        event.preventDefault();
        closeTaxiMenu();
      }

      return;
    }

    event.preventDefault();

    if (taxiState.paused) {
      return;
    }

    if (event.code === "ArrowUp") {
      taxiKeys.ArrowUp = true;
      return;
    }

    if (event.code === "ArrowDown") {
      taxiKeys.ArrowDown = true;
      return;
    }

    if (taxiState.timeLeft <= 0 || taxiState.distanceMeters <= 0 || event.repeat) {
      return;
    }

    if (event.code === "ArrowLeft") {
      taxiState.player.lane = Math.max(0, taxiState.player.lane - 1);
      return;
    }

    if (event.code === "ArrowRight") {
      taxiState.player.lane = Math.min(2, taxiState.player.lane + 1);
      return;
    }

    if (event.code === "Space") {
      if (taxiState.player.jumping) {
        return;
      }

      if (taxiState.player.speed < jumpSpeedThreshold) {
        setTaxiMessage("Need at least 70 mph before the taxi can jump.", 1.1);
        return;
      }

      taxiState.player.jumping = true;
      taxiState.player.jumpVelocity = 680;
      setTaxiMessage("Jump! Clear the taxi ahead.", 0.8);
    }
  }

  function handleTaxiKeyUp(event) {
    if (taxiState.paused) {
      return;
    }

    if (event.code === "ArrowUp") {
      taxiKeys.ArrowUp = false;
      return;
    }

    if (event.code === "ArrowDown") {
      taxiKeys.ArrowDown = false;
    }
  }

  document.addEventListener("keydown", handleTaxiKeyDown);
  document.addEventListener("keyup", handleTaxiKeyUp);
  taxiResetBtn.addEventListener("click", resetTaxiGame);
  taxiMenuBtn.addEventListener("click", openTaxiMenu);
  taxiResumeBtn.addEventListener("click", closeTaxiMenu);
  taxiCloseMenuBtn.addEventListener("click", closeTaxiMenu);
  taxiMenu.addEventListener("click", (event) => {
    if (event.target === taxiMenu) {
      closeTaxiMenu();
    }
  });

  resetTaxiGame();
  requestAnimationFrame(taxiLoop);
}

// ── Solo / Multiplayer mode tabs ──────────────────────────────────────
(function initModeTabs() {
  const tabs = document.querySelectorAll(".mode-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.tab;
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== `tab-${target}`);
      });
    });
  });

  // If URL has ?create=1, auto-switch to the multiplayer tab and trigger create
  const params = new URLSearchParams(window.location.search);
  if (params.get("create") === "1") {
    const multiTab = document.querySelector('.mode-tab[data-tab="multi"]');
    if (multiTab) multiTab.click();
  }
})();

// ── Account Storage Helpers ────────────────────────────────────────────
const ACCOUNTS_KEY = "ma-accounts-v1";
const PENDING_SIGNUPS_KEY = "ma-pending-signups-v1";
const SESSION_KEY = "user-login";
const MP_AUTH_KEY = "ma-auth";
const FAVORITES_LOCK_MESSAGE = "Please log in to look at your favorite games";

function readJsonStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanUsername(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 24);
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readAccounts() {
  return readJsonStorage(ACCOUNTS_KEY, {});
}

function saveAccounts(accounts) {
  writeJsonStorage(ACCOUNTS_KEY, accounts);
}

function readPendingSignups() {
  return readJsonStorage(PENDING_SIGNUPS_KEY, {});
}

function savePendingSignups(pending) {
  writeJsonStorage(PENDING_SIGNUPS_KEY, pending);
}

function readSession() {
  return readJsonStorage(SESSION_KEY, null);
}

function setSession(account) {
  writeJsonStorage(SESSION_KEY, {
    email: account.email,
    username: account.username,
    loggedAt: Date.now(),
  });
  writeJsonStorage(MP_AUTH_KEY, {
    username: account.username,
    email: account.email,
    updatedAt: Date.now(),
  });
  window.dispatchEvent(new CustomEvent("ma-auth-changed"));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(MP_AUTH_KEY);
  window.dispatchEvent(new CustomEvent("ma-auth-changed"));
}

function deleteCurrentAccount() {
  const session = readSession();
  if (!session || !session.email) {
    return { ok: false, message: "You need to sign in before deleting your account." };
  }

  const email = normalizeEmail(session.email);
  const accounts = readAccounts();
  if (!accounts[email]) {
    clearSession();
    return { ok: false, message: "No saved account was found for this login." };
  }

  delete accounts[email];
  saveAccounts(accounts);

  const pending = readPendingSignups();
  if (pending[email]) {
    delete pending[email];
    savePendingSignups(pending);
  }

  clearSession();
  return { ok: true, message: "Your account has been deleted." };
}

function readCurrentAccount() {
  const session = readSession();
  if (!session || !session.email) {
    return null;
  }

  const email = normalizeEmail(session.email);
  const accounts = readAccounts();
  const account = accounts[email];
  if (!account) {
    return null;
  }

  return { email, account, accounts };
}

function getCurrentFavorites() {
  const current = readCurrentAccount();
  if (!current) {
    return [];
  }
  return Array.isArray(current.account.favorites) ? current.account.favorites.filter((path) => favoriteGameCatalog[path]) : [];
}

function isFavoriteGame(path) {
  return getCurrentFavorites().includes(path);
}

function saveCurrentFavorites(favorites) {
  const current = readCurrentAccount();
  if (!current) {
    return false;
  }

  current.account.favorites = [...new Set(favorites.filter((path) => favoriteGameCatalog[path]))];
  current.accounts[current.email] = current.account;
  saveAccounts(current.accounts);
  window.dispatchEvent(new CustomEvent("ma-favorites-changed"));
  return true;
}

function toggleFavoriteGame(path) {
  if (!favoriteGameCatalog[path]) {
    return { ok: false, message: "That game cannot be favorited." };
  }

  const current = readCurrentAccount();
  if (!current) {
    return { ok: false, message: "Please log in to save favorites." };
  }

  const favorites = getCurrentFavorites();
  const nextFavorites = favorites.includes(path) ? favorites.filter((entry) => entry !== path) : [...favorites, path];
  saveCurrentFavorites(nextFavorites);
  const action = favorites.includes(path) ? "removed from" : "saved to";
  return { ok: true, active: !favorites.includes(path), message: `${favoriteGameCatalog[path].title} ${action} favorite games.` };
}

function createFavoriteCard(game) {
  const card = document.createElement("article");
  card.className = "launcher-card";
  card.innerHTML = `
    <span class="launcher-tag">${game.tag}</span>
    <h2 class="launcher-title">${game.title}</h2>
    <p class="launcher-copy">${game.description}</p>
    <div class="launcher-card-actions">
      <a class="launcher-cta" href="${game.path}">Open game</a>
      <button class="launcher-favorite-btn ghost-btn is-active" type="button" data-game-path="${game.path}">Favorited</button>
    </div>
  `;
  return card;
}

(function initFavoritesNav() {
  const favoriteLinks = Array.from(document.querySelectorAll("[data-favorites-link]"));
  if (!favoriteLinks.length) return;

  function updateFavoriteLinks() {
    const signedIn = !!readSession();
    favoriteLinks.forEach((link) => {
      link.classList.toggle("is-locked", !signedIn);
      link.setAttribute("aria-disabled", signedIn ? "false" : "true");
      link.title = signedIn ? "" : FAVORITES_LOCK_MESSAGE;
    });
  }

  favoriteLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (readSession()) {
        return;
      }
      event.preventDefault();
      alert(FAVORITES_LOCK_MESSAGE);
    });
  });

  window.addEventListener("ma-auth-changed", updateFavoriteLinks);
  updateFavoriteLinks();
})();

(function initHomeFavorites() {
  const page = document.body ? document.body.dataset.page : "";
  if (page !== "home") return;

  const status = document.getElementById("home-favorite-status");
  const favoriteButtons = Array.from(document.querySelectorAll(".launcher-favorite-btn[data-game-path]"));
  if (!favoriteButtons.length) return;

  function setHomeStatus(message, cssClass) {
    if (!status) return;
    status.textContent = message;
    status.className = `status-text home-favorite-status ${cssClass || ""}`.trim();
  }

  function updateFavoriteButtons() {
    const signedIn = !!readSession();
    favoriteButtons.forEach((button) => {
      const gamePath = button.dataset.gamePath;
      const active = signedIn && isFavoriteGame(gamePath);
      button.textContent = active ? "Favorited" : "Favorite";
      button.classList.toggle("is-active", active);
    });

    if (signedIn) {
      setHomeStatus("Choose Favorite on any game to save it to your list.", "");
      return;
    }
    setHomeStatus("Log in to save games to your favorites list.", "");
  }

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const result = toggleFavoriteGame(button.dataset.gamePath);
      setHomeStatus(result.message, result.ok ? "win" : "lose");
      updateFavoriteButtons();
    });
  });

  window.addEventListener("ma-auth-changed", updateFavoriteButtons);
  window.addEventListener("ma-favorites-changed", updateFavoriteButtons);
  updateFavoriteButtons();
})();

(function initFavoritesPage() {
  const page = document.body ? document.body.dataset.page : "";
  if (page !== "favorites") return;

  const status = document.getElementById("favorites-status");
  const grid = document.getElementById("favorites-grid");
  if (!status || !grid) return;

  function setFavoritesStatus(message, cssClass) {
    status.textContent = message;
    status.className = `status-text ${cssClass || ""}`.trim();
  }

  function renderFavorites() {
    const session = readSession();
    grid.innerHTML = "";

    if (!session) {
      setFavoritesStatus(FAVORITES_LOCK_MESSAGE, "lose");
      return;
    }

    const favorites = getCurrentFavorites();
    if (!favorites.length) {
      setFavoritesStatus("No games in favorite games yet. Save some from the homepage.", "");
      return;
    }

    setFavoritesStatus(`You have ${favorites.length} favorite game${favorites.length === 1 ? "" : "s"}.`, "win");
    favorites.forEach((path) => {
      const game = favoriteGameCatalog[path];
      if (!game) return;
      const card = createFavoriteCard(game);
      const button = card.querySelector(".launcher-favorite-btn");
      if (button) {
        button.addEventListener("click", () => {
          const result = toggleFavoriteGame(path);
          setFavoritesStatus(result.message, result.ok ? "win" : "lose");
          renderFavorites();
        });
      }
      grid.appendChild(card);
    });
  }

  window.addEventListener("ma-auth-changed", renderFavorites);
  window.addEventListener("ma-favorites-changed", renderFavorites);
  renderFavorites();
})();

// ── Sidebar Account Login/Logout ──────────────────────────────────────
(function initSidebarLogin() {
  const loginBtn = document.getElementById("sidebar-login-btn");
  const userInfo = document.getElementById("sidebar-user-info");
  const usernameDisplay = document.getElementById("sidebar-username");
  const logoutBtn = document.getElementById("sidebar-logout-btn");

  if (!loginBtn || !userInfo || !usernameDisplay || !logoutBtn) return;

  function updateDisplay() {
    const session = readSession();
    if (session && session.username) {
      loginBtn.classList.add("hidden");
      userInfo.classList.remove("hidden");
      usernameDisplay.textContent = session.username;
      return;
    }
    loginBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
  }

  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  logoutBtn.addEventListener("click", () => {
    clearSession();
  });

  window.addEventListener("ma-auth-changed", updateDisplay);
  updateDisplay();
})();

// ── Multiplayer Name Panel ─────────────────────────────────────────────
(function initMultiplayerAccount() {
  const nameDisplay = document.getElementById("account-display-name");
  const changeNameBtn = document.getElementById("account-change-name-btn");
  const createAccountBtn = document.getElementById("account-create-btn");

  if (!nameDisplay || !changeNameBtn || !createAccountBtn) return;

  function readMultiplayerAuth() {
    return readJsonStorage(MP_AUTH_KEY, null);
  }

  function saveMultiplayerAuth(auth) {
    writeJsonStorage(MP_AUTH_KEY, auth);
  }

  function updateDisplay() {
    const session = readSession();
    const auth = readMultiplayerAuth();
    const name = (session && session.username) || (auth && auth.username) || "Guest";
    nameDisplay.textContent = name;
    createAccountBtn.textContent = session ? "Account Center" : "Create Account";
  }

  changeNameBtn.addEventListener("click", () => {
    const currentName = nameDisplay.textContent || "Guest";
    const entered = prompt("Enter your multiplayer display name:", currentName);
    if (!entered) return;
    const name = cleanUsername(entered).slice(0, 20);
    if (!name) {
      alert("Please use letters, numbers, underscores, or hyphens.");
      return;
    }

    const session = readSession();
    const auth = readMultiplayerAuth() || {};
    auth.username = name;
    saveMultiplayerAuth(auth);

    if (session && session.email) {
      const accounts = readAccounts();
      const account = accounts[session.email];
      if (account) {
        account.username = name;
        accounts[session.email] = account;
        saveAccounts(accounts);
      }
      setSession({ email: session.email, username: name });
    }

    updateDisplay();
  });

  createAccountBtn.addEventListener("click", () => {
    window.location.href = "login.html#create-account-form";
  });

  window.addEventListener("ma-auth-changed", updateDisplay);
  updateDisplay();
})();

// ── Account Center (login page) ───────────────────────────────────────
(function initAccountCenter() {
  const page = document.body ? document.body.dataset.page : "";
  if (page !== "login") return;

  const signInPanel = document.getElementById("sign-in-panel");
  const createPanel = document.getElementById("create-panel");
  const verifyPanel = document.getElementById("verify-panel");
  const forgotPanel = document.getElementById("forgot-panel");
  const goCreateBtn = document.getElementById("go-create-account");
  const goForgotBtn = document.getElementById("go-forgot-password");
  const backFromCreateBtn = document.getElementById("back-to-sign-in-from-create");
  const backFromVerifyBtn = document.getElementById("back-to-sign-in-from-verify");
  const backFromForgotBtn = document.getElementById("back-to-sign-in-from-forgot");

  const loginForm = document.getElementById("login-form");
  const loginIdentifier = document.getElementById("login-identifier");
  const loginPassword = document.getElementById("login-password");
  const loginStatus = document.getElementById("login-status");
  const logoutBtn = document.getElementById("logout-btn");

  const createForm = document.getElementById("create-account-form");
  const createUsername = document.getElementById("create-username");
  const createEmail = document.getElementById("create-email");
  const createPassword = document.getElementById("create-password");
  const createPasswordConfirm = document.getElementById("create-password-confirm");
  const createStatus = document.getElementById("create-account-status");
  const createLink = document.getElementById("create-account-link");

  const verifyForm = document.getElementById("verify-account-form");
  const verifyEmail = document.getElementById("verify-email");
  const verifyCode = document.getElementById("verify-code");
  const verifyStatus = document.getElementById("verify-account-status");

  const forgotRequestForm = document.getElementById("forgot-password-request-form");
  const forgotEmail = document.getElementById("forgot-email");
  const forgotResetForm = document.getElementById("forgot-password-reset-form");
  const resetEmail = document.getElementById("reset-email");
  const resetCode = document.getElementById("reset-code");
  const resetPassword = document.getElementById("reset-password");
  const resetPasswordConfirm = document.getElementById("reset-password-confirm");
  const forgotStatus = document.getElementById("forgot-password-status");
  const forgotLinkPreview = document.getElementById("forgot-password-link-preview");

  function setStatus(node, text, cssClass) {
    if (!node) return;
    node.textContent = text;
    node.className = `status-text ${cssClass || ""}`.trim();
  }

  function showPanel(panelName) {
    if (signInPanel) signInPanel.classList.toggle("hidden", panelName !== "sign-in");
    if (createPanel) createPanel.classList.toggle("hidden", panelName !== "create");
    if (verifyPanel) verifyPanel.classList.toggle("hidden", panelName !== "verify");
    if (forgotPanel) forgotPanel.classList.toggle("hidden", panelName !== "forgot");
  }

  function updateLoginStatus() {
    const session = readSession();
    if (!session) {
      if (logoutBtn) {
        logoutBtn.classList.add("hidden");
      }
      setStatus(loginStatus, "Not signed in.", "");
      return;
    }
    if (loginIdentifier) {
      loginIdentifier.value = session.email || session.username || "";
    }
    if (logoutBtn) {
      logoutBtn.classList.remove("hidden");
    }
    setStatus(loginStatus, `Signed in as ${session.username}.`, "win");
  }

  if (goCreateBtn) {
    goCreateBtn.addEventListener("click", () => showPanel("create"));
  }
  if (goForgotBtn) {
    goForgotBtn.addEventListener("click", () => showPanel("forgot"));
  }
  if (backFromCreateBtn) {
    backFromCreateBtn.addEventListener("click", () => showPanel("sign-in"));
  }
  if (backFromVerifyBtn) {
    backFromVerifyBtn.addEventListener("click", () => showPanel("sign-in"));
  }
  if (backFromForgotBtn) {
    backFromForgotBtn.addEventListener("click", () => showPanel("sign-in"));
  }

  if (createForm) {
    createForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = cleanUsername(createUsername.value);
      const email = normalizeEmail(createEmail.value);
      const password = createPassword.value;
      const confirmPassword = createPasswordConfirm.value;

      if (username.length < 3) {
        setStatus(createStatus, "Username must be at least 3 valid characters.", "lose");
        return;
      }
      if (!email || !email.includes("@")) {
        setStatus(createStatus, "Enter a valid email address.", "lose");
        return;
      }
      if (password.length < 6) {
        setStatus(createStatus, "Password must be at least 6 characters.", "lose");
        return;
      }
      if (password !== confirmPassword) {
        setStatus(createStatus, "Passwords do not match.", "lose");
        return;
      }

      const accounts = readAccounts();
      const existing = accounts[email];
      if (existing && existing.verified) {
        setStatus(createStatus, "This email already has a verified account. Sign in or use Forgot Password.", "lose");
        return;
      }

      const verificationCode = generateCode();
      const verificationToken = generateToken();
      const pending = readPendingSignups();
      pending[email] = {
        username,
        email,
        password: btoa(password),
        verificationCode,
        verificationToken,
        createdAt: Date.now(),
      };
      savePendingSignups(pending);

      const verifyUrl = `${window.location.origin}${window.location.pathname}?verifyEmail=${encodeURIComponent(email)}&verifyCode=${verificationCode}`;
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Midnight Arcade verification")}&body=${encodeURIComponent(`Use this verification code: ${verificationCode}\nOr open this link: ${verifyUrl}`)}`;

      window.location.href = mailtoUrl;
      setStatus(createStatus, "Your email app has been opened with the verification code. Check your inbox and enter the code below.", "win");
      if (createLink) {
        createLink.innerHTML = `Didn't get it? <a href="${mailtoUrl}">Open email app again</a>`;
      }
      verifyEmail.value = email;
      verifyCode.value = "";
      showPanel("verify");
    });
  }

  if (verifyForm) {
    verifyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = normalizeEmail(verifyEmail.value);
      const code = String(verifyCode.value || "").trim();

      const pending = readPendingSignups();
      const signup = pending[email];
      if (!signup) {
        setStatus(verifyStatus, "No pending signup found for this email.", "lose");
        return;
      }
      if (signup.verificationCode !== code) {
        setStatus(verifyStatus, "Invalid verification code.", "lose");
        return;
      }

      const accounts = readAccounts();
      const account = {
        username: signup.username,
        email: signup.email,
        password: signup.password,
        verified: true,
        createdAt: signup.createdAt || Date.now(),
      };
      accounts[email] = account;
      saveAccounts(accounts);
      delete pending[email];
      savePendingSignups(pending);
      setStatus(verifyStatus, "Email verified and account activated. You can now sign in.", "win");
      showPanel("sign-in");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const identifier = String(loginIdentifier.value || "").trim();
      const password = loginPassword.value;
      const accounts = readAccounts();
      const byEmail = accounts[normalizeEmail(identifier)];
      const byUsername = Object.values(accounts).find((entry) => String(entry.username || "").toLowerCase() === identifier.toLowerCase());
      const account = byEmail || byUsername;

      if (!account) {
        setStatus(loginStatus, "No account found for this username or email.", "lose");
        return;
      }
      if (!account.verified) {
        setStatus(loginStatus, "Please verify your email before signing in.", "lose");
        return;
      }
      if (account.password !== btoa(password)) {
        setStatus(loginStatus, "Incorrect password.", "lose");
        return;
      }

      setSession(account);
      loginPassword.value = "";
      updateLoginStatus();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      setStatus(loginStatus, "Logged out.", "");
    });
  }

  window.addEventListener("ma-auth-changed", updateLoginStatus);

  if (forgotRequestForm) {
    forgotRequestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = normalizeEmail(forgotEmail.value);
      const accounts = readAccounts();
      const account = accounts[email];

      if (!account || !account.verified) {
        setStatus(forgotStatus, "No verified account found for this email.", "lose");
        return;
      }

      const resetCodeValue = generateCode();
      account.resetCode = resetCodeValue;
      account.resetToken = generateToken();
      account.resetRequestedAt = Date.now();
      accounts[email] = account;
      saveAccounts(accounts);

      const resetUrl = `${window.location.origin}${window.location.pathname}?resetEmail=${encodeURIComponent(email)}&resetCode=${resetCodeValue}`;
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Midnight Arcade password reset")}&body=${encodeURIComponent(`Use this reset code: ${resetCodeValue}\nOr open this reset link: ${resetUrl}`)}`;

      window.location.href = mailtoUrl;
      setStatus(forgotStatus, "Your email app has been opened with the reset code. Check your inbox and enter the code below.", "win");
      if (forgotLinkPreview) {
        forgotLinkPreview.innerHTML = `Didn't get it? <a href="${mailtoUrl}">Open email app again</a>`;
      }
      if (resetEmail) {
        resetEmail.value = email;
      }
      if (resetCode) {
        resetCode.value = "";
      }
    });
  }

  if (forgotResetForm) {
    forgotResetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = normalizeEmail(resetEmail.value);
      const code = String(resetCode.value || "").trim();
      const nextPassword = resetPassword.value;
      const confirmPassword = resetPasswordConfirm.value;

      if (nextPassword.length < 6) {
        setStatus(forgotStatus, "New password must be at least 6 characters.", "lose");
        return;
      }
      if (nextPassword !== confirmPassword) {
        setStatus(forgotStatus, "New passwords do not match.", "lose");
        return;
      }

      const accounts = readAccounts();
      const account = accounts[email];
      if (!account || !account.verified) {
        setStatus(forgotStatus, "No verified account found for this email.", "lose");
        return;
      }
      if (account.resetCode !== code) {
        setStatus(forgotStatus, "Invalid reset code.", "lose");
        return;
      }

      account.password = btoa(nextPassword);
      delete account.resetCode;
      delete account.resetToken;
      delete account.resetRequestedAt;
      accounts[email] = account;
      saveAccounts(accounts);
      setStatus(forgotStatus, "Password reset complete. You can sign in now.", "win");
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const verifyEmailParam = normalizeEmail(urlParams.get("verifyEmail"));
  const verifyCodeParam = String(urlParams.get("verifyCode") || "").trim();
  if (verifyEmailParam && verifyCodeParam && verifyEmail && verifyCode) {
    verifyEmail.value = verifyEmailParam;
    verifyCode.value = verifyCodeParam;
    setStatus(verifyStatus, "Verification link detected. Click Verify Account.", "");
    showPanel("verify");
  }

  const resetEmailParam = normalizeEmail(urlParams.get("resetEmail"));
  const resetCodeParam = String(urlParams.get("resetCode") || "").trim();
  if (resetEmailParam && resetCodeParam && resetEmail && resetCode) {
    resetEmail.value = resetEmailParam;
    resetCode.value = resetCodeParam;
    setStatus(forgotStatus, "Reset link detected. Enter your new password and submit.", "");
    showPanel("forgot");
  }

  if (!verifyEmailParam && !resetEmailParam) {
    showPanel("sign-in");
  }

  updateLoginStatus();
})();

// ── Settings Panel ───────────────────────────────────────────────────────
(function initSettings() {
  const settingsBtn = document.querySelector(".sidebar-settings");
  const settingsPanel = document.getElementById("settings-panel");
  const settingsClose = document.getElementById("settings-close");
  const lightModeToggle = document.getElementById("light-mode-toggle");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeDisplay = document.getElementById("volume-display");
  const settingsAuthBtn = document.getElementById("settings-auth-btn");
  const settingsDeleteBtn = document.getElementById("settings-delete-account-btn");
  const settingsAccountStatus = document.getElementById("settings-account-status");
  const deleteConfirm = document.getElementById("settings-delete-confirm");
  const cancelDeleteBtn = document.getElementById("settings-cancel-delete-btn");
  const confirmDeleteBtn = document.getElementById("settings-confirm-delete-btn");

  if (!settingsBtn || !settingsPanel || !settingsClose || !lightModeToggle || !volumeSlider) return;

  const PREFS_KEY = "app-prefs";

  function readPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function savePrefs(prefs) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }

  function applyLightMode(enabled) {
    document.body.classList.toggle("light-mode", !!enabled);
  }

  function applyVolume(vol) {
    document.documentElement.style.setProperty("--master-volume", vol / 100);
  }

  function setAccountStatus(message, cssClass) {
    if (!settingsAccountStatus) return;
    settingsAccountStatus.textContent = message;
    settingsAccountStatus.className = `status-text ${cssClass || ""}`.trim();
  }

  function updateAccountActions() {
    const session = readSession();
    if (settingsAuthBtn) {
      settingsAuthBtn.textContent = session ? "Logout" : "Login";
    }
    if (settingsDeleteBtn) {
      settingsDeleteBtn.disabled = !session;
      settingsDeleteBtn.classList.toggle("is-disabled", !session);
    }
    if (session && session.username) {
      setAccountStatus(`Signed in as ${session.username}.`, "win");
      return;
    }
    setAccountStatus("Not signed in.", "");
  }

  function hideDeleteConfirm() {
    if (deleteConfirm) {
      deleteConfirm.classList.add("hidden");
    }
  }

  function loadPreferences() {
    const prefs = readPrefs();
    lightModeToggle.checked = prefs.lightMode || false;
    volumeSlider.value = prefs.volume || 70;
    volumeDisplay.textContent = volumeSlider.value + "%";
    applyLightMode(lightModeToggle.checked);
    applyVolume(volumeSlider.value);
  }

  settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.remove("hidden");
  });

  settingsClose.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
    hideDeleteConfirm();
  });

  settingsPanel.addEventListener("click", (e) => {
    if (e.target === settingsPanel) {
      settingsPanel.classList.add("hidden");
      hideDeleteConfirm();
    }
  });

  if (deleteConfirm) {
    deleteConfirm.addEventListener("click", (event) => {
      if (event.target === deleteConfirm) {
        hideDeleteConfirm();
      }
    });
  }

  lightModeToggle.addEventListener("change", () => {
    const prefs = readPrefs();
    prefs.lightMode = lightModeToggle.checked;
    savePrefs(prefs);
    applyLightMode(lightModeToggle.checked);
  });

  volumeSlider.addEventListener("input", () => {
    const vol = volumeSlider.value;
    volumeDisplay.textContent = vol + "%";
    const prefs = readPrefs();
    prefs.volume = parseInt(vol, 10);
    savePrefs(prefs);
    applyVolume(vol);
  });

  if (settingsAuthBtn) {
    settingsAuthBtn.addEventListener("click", () => {
      if (readSession()) {
        clearSession();
        setAccountStatus("Logged out.", "");
        hideDeleteConfirm();
        return;
      }
      window.location.href = "login.html";
    });
  }

  if (settingsDeleteBtn) {
    settingsDeleteBtn.addEventListener("click", () => {
      if (!readSession()) {
        setAccountStatus("Sign in before deleting your account.", "lose");
        return;
      }
      if (deleteConfirm) {
        deleteConfirm.classList.remove("hidden");
      }
    });
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", hideDeleteConfirm);
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      const result = deleteCurrentAccount();
      hideDeleteConfirm();
      setAccountStatus(result.message, result.ok ? "win" : "lose");
    });
  }

  window.addEventListener("ma-auth-changed", updateAccountActions);

  loadPreferences();
  updateAccountActions();
})();
