import { gameService } from './model/game-service.js';

// startpage elements
const slider = document.getElementById('slider');
const startButton = document.getElementById("startButton");

// gamepage elements
const selectSection = document.getElementById("selectSection");
const returnButton = document.getElementById("returnButton");

let playerName;

async function loadRanking() {
    const leaderboard = document.getElementById('leaderboard')
    const rankings = await gameService.getRankings();
    leaderboard.replaceChildren();
    Object.values(rankings).forEach((x) => {
        const li = document.createElement('li');
        li.innerHTML = `<span id="rank">${x.rank}.</span> ${x.user} (${x.wins}W, ${x.lost}L)`;
        leaderboard.appendChild(li);
    });
}

function showStartpage() {
    loadRanking();
    const mode = document.getElementById("slider").checked ? "Online" : "Lokale";
    document.getElementById("titleContent").textContent = `Startseite — ${mode} Rangliste (Top 10)`;
    document.getElementById("switch").style.display = "block";
    document.getElementById("startpage").style.display = "block";
    document.getElementById("gamepage").style.display = "none";
}

function showGamepage() {
    document.getElementById("titleContent").textContent = "Neue Runde";
    document.getElementById("switch").style.display = "none";
    document.getElementById("startpage").style.display = "none";
    document.getElementById("gamepage").style.display = "block";
}

slider.addEventListener('change', () => {
    gameService.isOnline = slider.checked;
    const mode = slider.checked ? "Online" : "Lokale";
    document.getElementById("titleContent").textContent = `Startseite — ${mode} Rangliste (Top 10)`;
    loadRanking();
});

startButton.addEventListener("click", () => {
    playerName = document.getElementById("nameField").value.trim();
    if (!playerName) {
        alert("Bitte gib einen Namen ein!");
        return;
    }
    document.getElementById("playerNameDisplay").textContent = playerName;
    showGamepage();
});

returnButton.addEventListener("click", () => {
    showStartpage();
});

selectSection.addEventListener("click", async (event) => {
    event.preventDefault();
    const playerHand = event.target.dataset.hand;  // read data-hand
    const result = await gameService.evaluate(playerName, playerHand);
    const resultMessage = document.getElementById("resultMessage");

    // display winner
    const winnerMessage = { 1: `${playerName} won`, "-1": "Computer won", 0: "draw"};
    resultMessage.innerHTML = winnerMessage[result.gameEval];

    // disable Button temporally
    selectSection.querySelectorAll('button').forEach((el => {el.disabled = true;}));
    setTimeout(() => {
        selectSection.querySelectorAll('button').forEach((el => {el.disabled = false;}));

        // remove winner message
        resultMessage.innerHTML = null;

        // add to history
        const historyTable = document.getElementById("historyTable").querySelector("tbody");
        const row = historyTable.insertRow(0);
        const resultText = { 1: "W", 0: "Draw", "-1": "L" };
        row.insertCell().textContent = result.playerName;
        row.insertCell().textContent = resultText[result.gameEval];
        row.insertCell().textContent = result.playerHand;
        row.insertCell().textContent = result.systemHand;

    }, 3000);
});

showStartpage();