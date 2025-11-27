import { gameService } from './model/game-service.js';

// startpage elements
const slider = document.getElementById('slider');
const nameField = document.getElementById("name-field");
const startButton = document.getElementById("start-button");

// gamepage elements
const selectSection = document.getElementById("select-section");
const returnButton = document.getElementById("return-button");

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
    document.getElementById("title-content").textContent = `${mode} Rangliste (Top 10)`;
    document.getElementById("switch").style.display = "block";
    document.getElementById("startpage").style.display = "block";
    document.getElementById("gamepage").style.display = "none";
    document.getElementById("no-name-alert-section").style.display = "none";
}

function showGamepage() {
    document.getElementById("title-content").textContent = "Neue Runde";
    document.getElementById("switch").style.display = "none";
    document.getElementById("startpage").style.display = "none";
    document.getElementById("gamepage").style.display = "block";
    document.getElementById("history-table").querySelector("tbody").innerHTML = "";
}

slider.addEventListener('change', () => {
    gameService.isOnline = slider.checked;
    const mode = slider.checked ? "Online" : "Lokale";
    document.getElementById("title-content").textContent = `${mode} Rangliste (Top 10)`;
    loadRanking();
});

startButton.addEventListener("click", (event) => {
    event.preventDefault();
    playerName = document.getElementById("name-field").value.trim();
    if (!playerName) {
        document.getElementById("no-name-alert-section").style.display = "block";
        setTimeout(() => {
            document.getElementById("no-name-alert-section").style.display = "none";
        }, 5000);
        return;
    }
    document.getElementById("player-name-display").textContent = playerName;
    showGamepage();
});

nameField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startButton.click();
    }
});

returnButton.addEventListener("click", () => {
    showStartpage();
});

selectSection.addEventListener("click", async (event) => {
    event.preventDefault();
    const playerHand = event.target.dataset.hand;  // read data-hand
    const result = await gameService.evaluate(playerName, playerHand);
    const resultMessage = document.getElementById("result-message");

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
        const historyTable = document.getElementById("history-table").querySelector("tbody");
        const row = historyTable.insertRow(0);
        const resultText = { 1: "W", 0: "Draw", "-1": "L" };
        row.insertCell().textContent = result.playerName;
        row.insertCell().textContent = resultText[result.gameEval];
        row.insertCell().textContent = result.playerHand;
        row.insertCell().textContent = result.systemHand;

    }, 3000);
});

showStartpage();