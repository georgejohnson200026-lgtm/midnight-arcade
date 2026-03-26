// Multiplayer engine â€” powered by PeerJS (free WebRTC, no server setup needed)
(function () {
  "use strict";
  var page = document.body.dataset.page;
  var isMultiplayerPage = page === "hangman" || page === "tic-tac-toe";
  if (!isMultiplayerPage) { return; }

  if (typeof Peer === "undefined") {
    var s = document.getElementById("mp-room-status");
    if (s) { s.textContent = "Multiplayer offline. PeerJS script failed to load."; s.className = "status-text lose"; }
    return;
  }

  // --- Identity ---------------------------------------------------------------
  var CLIENT_KEY = "ma-client-id";
  var AUTH_KEY   = "ma-auth";

  function clientId() {
    var id = sessionStorage.getItem(CLIENT_KEY);
    if (!id) { id = "c_" + Math.random().toString(36).slice(2, 10); sessionStorage.setItem(CLIENT_KEY, id); }
    return id;
  }
  function readAuth() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch (e) { return null; }
  }

  var myId        = clientId();
  var auth        = readAuth();
  var currentName = (auth && auth.username) ? auth.username : ("Guest-" + myId.slice(2, 6));

  // --- DOM refs ----------------------------------------------------------------
  var roomMeta        = document.getElementById("mp-room-meta");
  var roomStatus      = document.getElementById("mp-room-status");
  var inviteInput     = document.getElementById("mp-invite-link");
  var createInviteBtn = document.getElementById("mp-create-invite-btn");
  var copyInviteBtn   = document.getElementById("mp-copy-invite-btn");
  var acceptInviteBtn = document.getElementById("mp-accept-invite-btn");
  var chatLog         = document.getElementById("mp-chat-log");
  var chatInput       = document.getElementById("mp-chat-input");
  var chatSendBtn     = document.getElementById("mp-chat-send-btn");
  var switchLinks     = document.querySelectorAll("[data-room-switch]");

  // --- State -------------------------------------------------------------------
  var peer           = null;
  var hostConn       = null;
  var guestConns     = [];
  var isHost         = false;
  var acceptedInvite = false;

  var url    = new URL(window.location.href);
  var roomId = url.searchParams.get("room") || null;

  function defaultRoom(id) {
    return {
      id: id || "?",
      participants: {},
      chat: [],
      games: {
        hangman: {
          started: false, round: 0, setterId: null, secretWord: "",
          guesses: [], wrong: 0, maxWrong: 6, winner: "",
          message: "Waiting for invite acceptance.",
        },
        ticTacToe: {
          started: false, round: 0, players: { X: null, O: null },
          board: Array(9).fill(""), turn: "X", winner: "",
          message: "Waiting for invite acceptance.",
        },
      },
    };
  }
  var roomState = defaultRoom(roomId);

  // --- Render ------------------------------------------------------------------
  function render() {
    updateRoomMeta();
    updateInviteInput();
    renderChat();
    if (page === "hangman")     { renderHangman(); }
    if (page === "tic-tac-toe") { renderTicTacToe(); }
    switchLinks.forEach(function (link) {
      var target = link.dataset.roomSwitch;
      if (roomId) { link.href = target + "?room=" + roomId; }
    });
  }

  function updateInviteInput() {
    if (!inviteInput) { return; }
    if (!roomId) { inviteInput.value = ""; return; }
    var linkUrl = new URL(window.location.origin + window.location.pathname);
    linkUrl.searchParams.set("room", roomId);
    inviteInput.value = linkUrl.toString();
  }

  function playerCount() { return Object.keys(roomState.participants).length; }

  function updateRoomMeta() {
    if (!roomMeta || !roomStatus) { return; }
    if (!roomId) {
      roomMeta.textContent = "No multiplayer room yet.";
      roomStatus.textContent = "Create an invite link for the game you want to play.";
      roomStatus.className = "status-text";
      return;
    }
    var count = playerCount();
    roomMeta.textContent = "Room \u2022 You: " + currentName + " \u2022 Players online: " + count;
    if (!acceptedInvite) {
      roomStatus.textContent = "Invite link detected. Click Accept Invite to join.";
      roomStatus.className = "status-text";
      return;
    }
    if (count < 2) {
      roomStatus.textContent = "Invite accepted. Waiting for the other player to accept.";
      roomStatus.className = "status-text";
      return;
    }
    roomStatus.textContent = "Both players are in. The host starts the first round.";
    roomStatus.className = "status-text win";
  }

  function renderChat() {
    if (!chatLog) { return; }
    chatLog.innerHTML = "";
    if (!roomState.chat.length) {
      var item = document.createElement("p");
      item.className = "meta-text";
      item.textContent = "No chat yet. Messages here follow you across games in this room.";
      chatLog.appendChild(item);
      return;
    }
    roomState.chat.slice(-120).forEach(function (entry) {
      var row = document.createElement("p");
      row.className = "mp-chat-row";
      var stamp = new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      row.textContent = "[" + stamp + "] " + entry.user + " (" + entry.game + "): " + entry.text;
      chatLog.appendChild(row);
    });
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function renderHangman() {
    var wrap = document.getElementById("mp-hangman-wrap");
    if (!wrap) { return; }
    var state        = roomState.games.hangman;
    var statusEl     = document.getElementById("mp-hangman-status");
    var wordText     = document.getElementById("mp-hangman-word");
    var metaEl       = document.getElementById("mp-hangman-meta");
    var setWordInput = document.getElementById("mp-hangman-set-word");
    var setWordBtn   = document.getElementById("mp-hangman-set-btn");
    var startBtn     = document.getElementById("mp-hangman-start-btn");
    var letters      = document.getElementById("mp-hangman-letters");
    var count        = playerCount();
    var setterIsMe   = (state.setterId === myId);

    if (setWordInput) { setWordInput.disabled = !acceptedInvite || !isHost; }
    if (setWordBtn)   { setWordBtn.disabled   = !acceptedInvite || !isHost; }
    if (startBtn)     { startBtn.disabled     = !acceptedInvite || !isHost || count < 2 || !state.secretWord; }

    var masked = state.secretWord
      ? state.secretWord.split("").map(function (l) { return state.guesses.includes(l) ? l : "_"; }).join(" ")
      : "_ _ _ _";
    if (wordText) { wordText.textContent = masked; }
    if (metaEl)   { metaEl.textContent   = "Round " + (state.round || 0) + " \u2022 Wrong: " + state.wrong + "/" + state.maxWrong; }

    if (statusEl) {
      if (!acceptedInvite) {
        statusEl.textContent = "Accept invite to join this multiplayer room."; statusEl.className = "status-text";
      } else if (!state.started) {
        statusEl.textContent = state.message || "Set the word and click Start First Game."; statusEl.className = "status-text";
      } else if (state.winner) {
        statusEl.textContent = state.message; statusEl.className = "status-text " + (state.winner === "Guesser" ? "win" : "lose");
      } else if (setterIsMe) {
        statusEl.textContent = "You set the word. Wait while the other player guesses."; statusEl.className = "status-text";
      } else {
        statusEl.textContent = "Your turn to guess letters."; statusEl.className = "status-text win";
      }
    }

    if (!letters) { return; }
    letters.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (letter) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "letter-btn"; btn.textContent = letter;
      btn.disabled = !acceptedInvite || !state.started || !!state.winner || setterIsMe || state.guesses.includes(letter);
      btn.addEventListener("click", function () { playerAction({ type: "hangman-guess", letter: letter, fromId: myId }); });
      letters.appendChild(btn);
    });
  }

  function renderTicTacToe() {
    var wrap = document.getElementById("mp-tic-wrap");
    if (!wrap) { return; }
    var state    = roomState.games.ticTacToe;
    var statusEl = document.getElementById("mp-tic-status");
    var board    = document.getElementById("mp-tic-board");
    var startBtn = document.getElementById("mp-tic-start-btn");
    var count    = playerCount();
    var myMark   = state.players.X === myId ? "X" : state.players.O === myId ? "O" : "";

    if (startBtn) { startBtn.disabled = !acceptedInvite || !isHost || count < 2; }

    if (statusEl) {
      if (!acceptedInvite) {
        statusEl.textContent = "Accept invite to join."; statusEl.className = "status-text";
      } else if (!state.started) {
        statusEl.textContent = state.message || "Host starts when both players are ready."; statusEl.className = "status-text";
      } else if (state.winner) {
        statusEl.textContent = state.message; statusEl.className = "status-text win";
      } else if (!myMark) {
        statusEl.textContent = "Room full. Spectating this match."; statusEl.className = "status-text";
      } else {
        statusEl.textContent = "You are " + myMark + ". " + state.turn + "s turn."; statusEl.className = "status-text";
      }
    }

    if (!board) { return; }
    board.querySelectorAll("button").forEach(function (cell) {
      var index = Number(cell.dataset.index);
      cell.textContent = state.board[index] || "";
      cell.disabled = !acceptedInvite || !state.started || !!state.winner || !myMark || state.turn !== myMark || !!state.board[index];
      cell.onclick = function () { playerAction({ type: "ttt-move", index: index, fromId: myId }); };
    });
  }

  // --- P2P messaging -----------------------------------------------------------
  function broadcast(msg) {
    var data = JSON.stringify(msg);
    guestConns = guestConns.filter(function (c) { return c.open; });
    guestConns.forEach(function (c) { try { c.send(data); } catch (e) {} });
  }
  function sendToHost(msg) {
    if (hostConn && hostConn.open) { try { hostConn.send(JSON.stringify(msg)); } catch (e) {} }
  }
  function playerAction(action) {
    if (isHost) { applyAction(action); } else { sendToHost(action); }
  }

  // --- Game logic (authoritative on host) -------------------------------------
  function applyAction(action) {
    if (!isHost) { return; }
    var state  = JSON.parse(JSON.stringify(roomState));
    var fromId = action.fromId || myId;
    var ids, g, letter, solved, won, patterns, winnerName, mark, setterName;

    switch (action.type) {

      case "join":
        state.participants[fromId] = { name: action.name || "Player", page: action.page || page };
        ids = Object.keys(state.participants);
        if (!state.games.ticTacToe.players.X) { state.games.ticTacToe.players.X = ids[0]; }
        if (!state.games.ticTacToe.players.O && ids[1]) { state.games.ticTacToe.players.O = ids[1]; }
        break;

      case "leave":
        delete state.participants[fromId];
        break;

      case "chat":
        state.chat.push({
          id: Date.now() + "-" + Math.random().toString(36).slice(2, 5),
          user: action.user || currentName, text: action.text, game: page, time: Date.now(),
        });
        state.chat = state.chat.slice(-200);
        break;

      case "set-word":
        g = state.games.hangman;
        g.secretWord = action.word; g.setterId = fromId;
        g.guesses = []; g.wrong = 0; g.winner = ""; g.started = false;
        g.message = "Word set. Host can start when both players are ready.";
        break;

      case "start-hangman":
        g = state.games.hangman;
        if (!g.secretWord || Object.keys(state.participants).length < 2) { break; }
        g.started = true; g.round = (g.round || 0) + 1;
        g.guesses = []; g.wrong = 0; g.winner = "";
        g.message = "Round started. Guesser can pick letters now.";
        break;

      case "hangman-guess":
        g = state.games.hangman;
        letter = action.letter;
        if (!g.started || g.winner || g.guesses.includes(letter) || g.setterId === fromId) { break; }
        g.guesses.push(letter);
        if (!g.secretWord.includes(letter)) { g.wrong += 1; }
        solved = g.secretWord.split("").every(function (c) { return g.guesses.includes(c); });
        if (solved) {
          setterName = (state.participants[g.setterId] || {}).name || "Setter";
          g.winner = "Guesser"; g.started = false;
          g.message = "Round complete. " + setterName + " set the word and the guesser solved it.";
        } else if (g.wrong >= g.maxWrong) {
          g.winner = "Setter"; g.started = false;
          g.message = "Round complete. Setter wins. Word was " + g.secretWord + ".";
        }
        break;

      case "start-ttt":
        if (Object.keys(state.participants).length < 2) { break; }
        g = state.games.ticTacToe;
        g.started = true; g.round = (g.round || 0) + 1;
        g.board = Array(9).fill(""); g.turn = "X"; g.winner = "";
        g.message = "Round started. X goes first.";
        break;

      case "ttt-move":
        g = state.games.ticTacToe;
        mark = g.players.X === fromId ? "X" : g.players.O === fromId ? "O" : "";
        if (!mark || !g.started || g.winner || g.turn !== mark || g.board[action.index]) { break; }
        g.board[action.index] = mark;
        patterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        won = patterns.some(function (p) { return g.board[p[0]] && g.board[p[0]] === g.board[p[1]] && g.board[p[1]] === g.board[p[2]]; });
        if (won) {
          winnerName = (state.participants[fromId] || {}).name || mark;
          g.winner = mark; g.started = false; g.message = winnerName + " wins this round.";
        } else if (g.board.every(Boolean)) {
          g.winner = "draw"; g.started = false; g.message = "Round ended in a draw.";
        } else {
          g.turn = mark === "X" ? "O" : "X";
        }
        break;

      default: break;
    }

    roomState = state;
    broadcast({ type: "state", state: roomState });
    render();
  }

  // --- PeerJS room management -------------------------------------------------
  function createRoom() {
    if (peer) { peer.destroy(); peer = null; guestConns = []; }
    isHost = true;
    peer = new Peer();

    peer.on("open", function (peerId) {
      roomId = peerId;
      roomState = defaultRoom(roomId);
      roomState.participants[myId] = { name: currentName, page: page };
      roomState.games.ticTacToe.players.X = myId;
      acceptedInvite = true;

      var newUrl = new URL(window.location.href);
      newUrl.searchParams.set("room", roomId);
      window.history.replaceState({}, "", newUrl.toString());

      render();
      if (roomStatus) {
        roomStatus.textContent = "Invite created. Share this link. The other player must click Accept Invite.";
        roomStatus.className = "status-text win";
      }
    });

    peer.on("connection", function (conn) {
      conn.on("open", function () {
        guestConns.push(conn);
        conn.send(JSON.stringify({ type: "state", state: roomState }));
      });
      conn.on("data", function (raw) {
        try { applyAction(JSON.parse(raw)); } catch (e) {}
      });
      conn.on("close", function () {
        applyAction({ type: "leave", fromId: conn.peer });
        guestConns = guestConns.filter(function (c) { return c !== conn; });
      });
    });

    peer.on("error", function (err) {
      if (roomStatus) {
        roomStatus.textContent = "Connection error (" + err.type + "). Please try again.";
        roomStatus.className = "status-text lose";
      }
    });
  }

  function joinRoom(hostPeerId) {
    if (peer) { peer.destroy(); peer = null; hostConn = null; }
    isHost = false;
    peer = new Peer();

    peer.on("open", function () {
      hostConn = peer.connect(hostPeerId, { reliable: true });

      hostConn.on("open", function () {
        acceptedInvite = true;
        hostConn.send(JSON.stringify({ type: "join", fromId: myId, name: currentName, page: page }));
        if (roomStatus) {
          roomStatus.textContent = "Connected! Waiting for the host to start the first game.";
          roomStatus.className = "status-text win";
        }
      });

      hostConn.on("data", function (raw) {
        try {
          var msg = JSON.parse(raw);
          if (msg.type === "state") { roomState = msg.state; render(); }
        } catch (e) {}
      });

      hostConn.on("close", function () {
        if (roomStatus) {
          roomStatus.textContent = "Host disconnected. This room is gone.";
          roomStatus.className = "status-text lose";
        }
      });
    });

    peer.on("error", function (err) {
      if (roomStatus) {
        roomStatus.textContent = "Could not connect (" + err.type + "). Check the invite link and try again.";
        roomStatus.className = "status-text lose";
      }
    });
  }

  // --- Events -----------------------------------------------------------------
  function sendChat() {
    if (!acceptedInvite || !chatInput || !chatInput.value.trim()) { return; }
    var text = chatInput.value.trim();
    chatInput.value = "";
    playerAction({ type: "chat", user: currentName, text: text, fromId: myId });
  }

  function setupEvents() {
    if (createInviteBtn) { createInviteBtn.addEventListener("click", createRoom); }

    if (copyInviteBtn) {
      copyInviteBtn.addEventListener("click", function () {
        if (!inviteInput || !inviteInput.value) { return; }
        navigator.clipboard.writeText(inviteInput.value).then(function () {
          if (roomStatus) { roomStatus.textContent = "Invite link copied."; roomStatus.className = "status-text win"; }
        }).catch(function () {
          if (roomStatus) { roomStatus.textContent = "Copy failed â€” copy the link from the box manually."; roomStatus.className = "status-text lose"; }
        });
      });
    }

    if (acceptInviteBtn) {
      acceptInviteBtn.addEventListener("click", function () {
        if (!roomId) {
          if (roomStatus) { roomStatus.textContent = "Open the invite link first (?room=... must be in the URL)."; roomStatus.className = "status-text lose"; }
          return;
        }
        joinRoom(roomId);
      });
    }

    if (chatSendBtn) { chatSendBtn.addEventListener("click", sendChat); }
    if (chatInput) {
      chatInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); sendChat(); } });
    }

    var setWordBtn = document.getElementById("mp-hangman-set-btn");
    if (setWordBtn) {
      setWordBtn.addEventListener("click", function () {
        var input = document.getElementById("mp-hangman-set-word");
        if (!input || !acceptedInvite) { return; }
        var word = input.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 16);
        if (!word) {
          if (roomStatus) { roomStatus.textContent = "Word must contain letters only."; roomStatus.className = "status-text lose"; }
          return;
        }
        playerAction({ type: "set-word", word: word, fromId: myId });
        input.value = "";
      });
    }

    var startHangmanBtn = document.getElementById("mp-hangman-start-btn");
    if (startHangmanBtn) {
      startHangmanBtn.addEventListener("click", function () {
        playerAction({ type: "start-hangman", fromId: myId });
      });
    }

    var startTicBtn = document.getElementById("mp-tic-start-btn");
    if (startTicBtn) {
      startTicBtn.addEventListener("click", function () {
        playerAction({ type: "start-ttt", fromId: myId });
      });
    }
  }

  window.addEventListener("beforeunload", function () {
    if (peer) {
      if (!isHost && acceptedInvite) { sendToHost({ type: "leave", fromId: myId }); }
      peer.destroy();
    }
  });

  setupEvents();
  render();

  // Auto-switch to multiplayer tab if there is a room or create=1 param
  var urlParams = new URLSearchParams(window.location.search);
  if (roomId || urlParams.get("create") === "1") {
    var multiTab = document.querySelector('.mode-tab[data-tab="multi"]');
    if (multiTab && !multiTab.classList.contains("active")) { multiTab.click(); }
  }

  // If page was opened via an invite link, prompt the user to accept
  if (roomId && roomStatus && !acceptedInvite) {
    roomStatus.textContent = "Invite link detected. Click Accept Invite to join this room.";
    roomStatus.className = "status-text";
  }

  // If opened with ?create=1, automatically start creating a room
  if (urlParams.get("create") === "1" && !roomId) {
    createRoom();
  }
}());