import { gameService } from './model/game-service.js';

// Dummy Code
console.log('isOnline:', gameService.isOnline);
const slider = document.getElementById('slider');

let rankings = await gameService.getRankings();
const board = document.getElementById('board');

async function loadRanking() {
    rankings = await gameService.getRankings();
    board.replaceChildren();
    Object.values(rankings).forEach((x) => {
        const li = document.createElement('li');
        li.innerHTML = `<span id="rank">${x.rank}.</span> ${x.user} (${x.wins}W, ${x.lost}L)`;
        board.appendChild(li);
    });
}

loadRanking();

// Add an event listener
slider.addEventListener('change', function() {
    if (this.checked) {
        gameService.isOnline = true;
        loadRanking();
    } else {
        gameService.isOnline = false;
        loadRanking();
    }
});


// dummy
console.log(await gameService.evaluate('Michael', gameService.possibleHands[0]));

const title = document.getElementById("title");
const startBtn = document.getElementById("start");
const nameInput = document.getElementById("name");
const playerName = document.getElementById("player");
const startSection = document.getElementById("startSection");
const gameSection = document.getElementById("gameSection");
const  historySection = document.getElementById("historySection");
const historyTable = document.getElementById("historyTable").querySelector("tbody");

startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
        alert("Bitte gib einen Namen ein!");
        return;
    }

    // Set player name dynamically
    title.innerText = "Neue Runde";
    playerName.textContent = name;

    // Hide start page, show game section
    board.style.display = "none";
    startSection.style.display = "none";
    gameSection.style.display = "block";
    historySection.style.display = "block";
});

// All buttons inside #select
const buttons = document.querySelectorAll("#select button");
const gameWinner = document.getElementById("game-winner");

// Add click listeners
buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
        const playerHand = btn.dataset.hand;  // read data-hand
        const result = await gameService.evaluate(playerName.textContent, playerHand);
        if (result.gameEval === 1) {
            gameWinner.innerHTML = `${playerName.textContent} won`;
        }
        else if (result.gameEval === -1) {
            gameWinner.innerHTML = `Computer won`;
        }

        else {
            gameWinner.innerHTML = `draw`;
        }
        buttons.forEach((el => {el.disabled = true;}));
        setTimeout(() => {
            buttons.forEach((el => {el.disabled = false;}));
            gameWinner.innerHTML = null;
            const row = historyTable.insertRow(0);
            const resultText = { 1: "W", 0: "Draw", "-1": "L" };
            row.insertCell().textContent = result.playerName;
            row.insertCell().textContent = resultText[result.gameEval];
            row.insertCell().textContent = result.playerHand;
            row.insertCell().textContent = result.systemHand;

        }, 3000);
    });
});
