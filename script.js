let scoreA = 0, scoreB = 0, quarter = 1;
const MAX_QUARTER = 4, MIN_QUARTER = 1, TIMER_START = 10 * 60;
let commonTimer = TIMER_START, timerInterval = null, gameStarted = false, gameEnded = false;
let foulsA = 0, foulsB = 0;

// Timeout logic
let timeoutActive = false, timeoutTimer = 0, timeoutTeam = null, timeoutInterval = null;
const TIMEOUT_LENGTH = 90; // 1:30 in seconds

// Player objects
let playersA = ["Alice", "Bob"], playersB = ["Charlie", "David"];
let playerAScores = {}, playerBScores = {};
playersA.forEach(p => playerAScores[p] = 0);
playersB.forEach(p => playerBScores[p] = 0);

function updateTeamUI() {
  document.getElementById('labelA').textContent = document.getElementById('teamAName').value || "TEAM 1";
  document.getElementById('labelB').textContent = document.getElementById('teamBName').value || "TEAM 2";
}
// LOGO CHANGE
function setupLogoUpload(idInput, idImg) {
  document.getElementById(idInput).addEventListener('change', function (e) {
    if (!e.target.files.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (ev) {
      document.getElementById(idImg).src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}
// PLAYER ADD/REMOVE
function addPlayer(team) {
  let val = document.getElementById(team === 'A' ? "addPlayerA" : "addPlayerB").value.trim();
  if (!val) return;
  if (team === "A") {
    if (playersA.includes(val)) return alert("Player exists!");
    playersA.push(val); playerAScores[val]=0;
  } else {
    if (playersB.includes(val)) return alert("Player exists!");
    playersB.push(val); playerBScores[val]=0;
  }
  updatePlayerDropdowns(); updatePlayerScoresDisplay(); updateHistoryPanel();
  document.getElementById(team === 'A' ? "addPlayerA" : "addPlayerB").value = "";
}
function removePlayer(team, name) {
  if (!confirm(`Remove player "${name}" from Team ${team === 'A' ? 1:2}?`)) return;
  if (team === 'A') {
    playersA = playersA.filter(p=>p!==name); delete playerAScores[name];
  } else {
    playersB = playersB.filter(p=>p!==name); delete playerBScores[name];
  }
  updatePlayerDropdowns(); updatePlayerScoresDisplay();
}
window.removePlayer = removePlayer;
function updatePlayerScoresDisplay() {
  let htmlA = "", htmlB = "";
  playersA.forEach(p => { htmlA += `<span class="player-chip">${p}<span class="score">${playerAScores[p]}</span><button onclick="removePlayer('A','${p.replace(/'/g, "\\'")}')">✖</button></span>`; });
  playersB.forEach(p => { htmlB += `<span class="player-chip">${p}<span class="score">${playerBScores[p]}</span><button onclick="removePlayer('B','${p.replace(/'/g, "\\'")}')">✖</button></span>`; });
  document.getElementById('playerAScores').innerHTML = htmlA;  document.getElementById('playerBScores').innerHTML = htmlB;
}

// ---- FIX: Keep select value and make new player auto-selected ----
function updatePlayerDropdowns() {
  // For Team A
  const selA = document.getElementById('selPlayerA');
  const prevA = selA.value; // Save currently selected player
  selA.innerHTML = playersA.map(p => `<option value="${p}">${p}</option>`).join('');
  // Restore selection if possible, or select the newest player if added
  if (playersA.length > 0) {
    selA.value = playersA.includes(prevA) ? prevA : playersA[playersA.length - 1];
  }

  // For Team B
  const selB = document.getElementById('selPlayerB');
  const prevB = selB.value;
  selB.innerHTML = playersB.map(p => `<option value="${p}">${p}</option>`).join('');
  if (playersB.length > 0) {
    selB.value = playersB.includes(prevB) ? prevB : playersB[playersB.length - 1];
  }
}
// ---- END select dropdown fix ----

function updateDisplay() {
  document.getElementById('scoreA').textContent = scoreA;
  document.getElementById('scoreB').textContent = scoreB;
  document.getElementById('quarterNum').textContent = quarter;
  document.getElementById('commonTimer').textContent = formatTime(commonTimer);
  document.getElementById('foulsA').textContent = foulsA;
  document.getElementById('foulsB').textContent = foulsB;
  updatePlayerScoresDisplay();  updatePlayerDropdowns(); updateTeamUI();
  document.getElementById('startGameBtn').disabled = gameStarted || gameEnded || timeoutActive;
  document.getElementById('endGameBtn').disabled = !gameStarted || gameEnded || timeoutActive;
  document.getElementById('resetBtn').disabled = (gameStarted && !gameEnded) || timeoutActive;
  document.getElementById('timeoutA').disabled = !gameStarted || gameEnded || timeoutActive;
  document.getElementById('timeoutB').disabled = !gameStarted || gameEnded || timeoutActive;
  let winnerMsg = document.getElementById('winnerMsg');
  if (gameEnded) {
    winnerMsg.innerHTML = (scoreA>scoreB) ? `🏆 ${document.getElementById('teamAName').value} WON!` : (scoreB>scoreA) ? `🏆 ${document.getElementById('teamBName').value} WON!` : '🤝 TIED GAME!';
  } else winnerMsg.innerHTML = '';
  updateHistoryPanel();
}
function formatTime(seconds) {
  let min = Math.floor(seconds / 60), sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}
function startTimer() {
  if (!gameStarted || gameEnded || timeoutActive) return;
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (commonTimer > 0) {
      commonTimer--; updateDisplay();
    } else {
      clearInterval(timerInterval); timerInterval = null;
    }
    document.getElementById('commonTimer').textContent = formatTime(commonTimer);
  }, 1000);
}
function pauseTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
function resetTimer() { if (!gameStarted || gameEnded || timeoutActive) return; pauseTimer(); commonTimer = TIMER_START; updateDisplay(); }
function startGame() { if (gameStarted || gameEnded || timeoutActive) return; gameStarted = true; updateDisplay(); }
function endGame() { if (!gameStarted || gameEnded || timeoutActive) return; gameEnded = true; pauseTimer(); if(timeoutActive) endTimeout(); saveMatchToHistory(); updateDisplay(); }
function resetScores() {
  if (gameStarted && !gameEnded) return;
  if(timeoutActive) endTimeout();
  scoreA = 0; scoreB = 0; quarter = 1; foulsA = 0; foulsB = 0;
  commonTimer = TIMER_START; gameStarted = false; gameEnded = false;
  pauseTimer();
  playersA = [...playersA]; playersB = [...playersB];
  playerAScores = {}; playerBScores = {};
  playersA.forEach(p=>playerAScores[p]=0); playersB.forEach(p=>playerBScores[p]=0);
  updateDisplay();
}
function changeQuarter(delta) { if (!gameStarted || gameEnded || timeoutActive) return;
  quarter = Math.min(MAX_QUARTER, Math.max(MIN_QUARTER, quarter + delta));
  updateDisplay();
}
function changeScore(team, points) {
  if (!gameStarted || gameEnded || timeoutActive) return;
  if (team === 'A') {
    scoreA = Math.max(0, scoreA + points);
    let s = document.getElementById('selPlayerA').value;
    if(s&&playerAScores.hasOwnProperty(s)) playerAScores[s]=Math.max(0,(playerAScores[s]||0)+points);
  } else {
    scoreB = Math.max(0, scoreB + points);
    let s = document.getElementById('selPlayerB').value;
    if(s&&playerBScores.hasOwnProperty(s)) playerBScores[s]=Math.max(0,(playerBScores[s]||0)+points);
  }
  updateDisplay();
}
function incrementFouls(team) { if (!gameStarted || gameEnded || timeoutActive) return; if (team === 'A') foulsA++; else foulsB++; updateDisplay(); }
function decrementFouls(team) { if (!gameStarted || gameEnded || timeoutActive) return; if (team === 'A' && foulsA > 0) foulsA--; if (team === 'B' && foulsB > 0) foulsB--; updateDisplay(); }


// ==== Timeout Logic ====
function callTimeout(team) {
  if (timeoutActive || !gameStarted || gameEnded) return;
  timeoutActive = true;
  timeoutTeam = team;
  timeoutTimer = TIMEOUT_LENGTH;
  pauseTimer(); // Pause main timer
  document.getElementById("timeoutTimer").style.display = "";
  updateTimeoutDisplay();
  timeoutInterval = setInterval(()=>{
    if(timeoutTimer > 0) {
      timeoutTimer--;
      updateTimeoutDisplay();
    } else {
      endTimeout();
    }
  }, 1000);
  document.getElementById("timeoutA").disabled = true;
  document.getElementById("timeoutB").disabled = true;
}
function endTimeout() {
  timeoutActive = false;
  timeoutTeam = null;
  document.getElementById("timeoutTimer").style.display = "none";
  clearInterval(timeoutInterval); timeoutInterval = null;
  startTimer();
  updateDisplay();
}
function updateTimeoutDisplay() {
  let min = Math.floor(timeoutTimer / 60), sec = timeoutTimer % 60;
  document.getElementById("timeoutTimer").textContent = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

// ==== End Timeout logic ====


function saveMatchToHistory() {
  let history = JSON.parse(localStorage.getItem('matchHistory') || "[]");
  history.push({
    date: new Date().toLocaleString(),
    teamAName: document.getElementById('teamAName').value,
    teamBName: document.getElementById('teamBName').value,
    logoA: document.getElementById('logoA').src,
    logoB: document.getElementById('logoB').src,
    scoreA, scoreB, quarter,
    foulsA, foulsB,
    playerAScores: {...playerAScores},
    playerBScores: {...playerBScores}
  });
  localStorage.setItem('matchHistory', JSON.stringify(history));
}
function updateHistoryPanel() {
  let history = JSON.parse(localStorage.getItem('matchHistory') || "[]");
  let panel = document.getElementById('historyPanel');
  if (!panel) return;
  if (!history.length) { panel.innerHTML = "<i>No history yet</i>"; return; }
  panel.innerHTML = history.slice(-8).reverse().map(match =>
    `<div style="margin-bottom:7px;border-bottom:1px solid #f0d99c8a;">
      <div style="display:flex;align-items:center;">
        <img src="${match.logoA}" style="width:25px;height:25px;border-radius:50%">&nbsp;
        <b>${match.teamAName}</b> <span style="color:#2bc2ff;font-weight:600;">${match.scoreA}</span> - 
        <span style="color:#ffd800;">${match.scoreB}</span> <b>${match.teamBName}</b>
        &nbsp;<img src="${match.logoB}" style="width:25px;height:25px;border-radius:50%">
      </div>
      <div style="font-size:.97em;opacity:0.84">
        <b>Q:</b> ${match.quarter}, 
        <b>Fouls:</b> <span style="color:#2bc2ff">${match.foulsA}</span>-<span style="color:#ffd800">${match.foulsB}</span>
        <br>
        <b>${match.teamAName} Players:</b> ${Object.entries(match.playerAScores).map(([n,s])=>`${n}(${s})`).join(', ')}<br>
        <b>${match.teamBName} Players:</b> ${Object.entries(match.playerBScores).map(([n,s])=>`${n}(${s})`).join(', ')}
      </div>
      <div style="font-size:.92em;color:#aaa">${match.date}</div>
    </div>`
  ).join('');
}
function clearHistory() {
  if(confirm("Clear all match history?")) {localStorage.removeItem('matchHistory'); updateHistoryPanel();}
}

// Initial setup
window.onload = function(){
  updatePlayerScoresDisplay(); updatePlayerDropdowns(); updateDisplay();
  updateTeamUI();
  document.getElementById('teamAName').addEventListener('input',()=>{updateTeamUI();updateDisplay();});
  document.getElementById('teamBName').addEventListener('input',()=>{updateTeamUI();updateDisplay();});
  setupLogoUpload('uploadLogoA','logoA'); setupLogoUpload('uploadLogoB','logoB');
  document.getElementById("timeoutTimer").style.display = "none";
};