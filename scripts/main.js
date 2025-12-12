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
    leaderboard.replaceChildren();
    try{
        const rankings = await gameService.getRankings();
        Object.values(rankings).forEach((x) => {
            const li = document.createElement('li');
            li.innerHTML = `<span id="rank">${x.rank}.</span> ${x.user} (${x.wins}W, ${x.lost}L)`;
            leaderboard.appendChild(li);
        });
    } catch (error) {
        const li = document.createElement('li');
        li.id = "rankings-not-loaded-error";
        li.textContent = "Rankings could not be loaded";
        leaderboard.appendChild(li);
    }
}

function showPage(page) {
    const pagesTitleContent = {
        startpage: `${slider.checked ? "Online" : "Lokale"} Rangliste`,
        gamepage: `Neue ${slider.checked ? "Online" : "Lokale"} Runde`,
    };

    // perform page-specific actions
    if (page === "startpage") {
        loadRanking();
        document.getElementById("no-name-alert-section").style.display = "none";
    }

    // show switch only on startpage
    document.getElementById("switch").style.display = page === "startpage" ? "block" : "none";

    // set the page title
    document.getElementById("title-content").textContent = pagesTitleContent[page];

    // hide all other pages, show the selected page
    Object.keys(pagesTitleContent).forEach(id => {
        document.getElementById(id).style.display = id === page ? "block" : "none";
    });
}

slider.addEventListener('change', () => {
    gameService.isOnline = slider.checked;
    showPage("startpage");
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
    showPage("gamepage");
});

nameField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startButton.click();
    }
});

returnButton.addEventListener("click", () => {
    showPage("startpage");
});

selectSection.addEventListener("click", async (event) => {
    event.preventDefault();
    const playerHand = event.target.dataset.hand;  // read data-hand
    try {
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

            // map labels to german
            const handLabelGerman = {
                scissors: "Schere",
                rock: "Stein",
                paper: "Papier",
                spock: "Brunnen",
                lizard: "Streichholz"
            };

            // add to history
            const historyTable = document.getElementById("history-table").querySelector("tbody");
            const row = historyTable.insertRow(0);
            const resultText = { 1: "W", 0: "Draw", "-1": "L" };
            row.insertCell().textContent = result.playerName;
            row.insertCell().textContent = resultText[result.gameEval];
            row.insertCell().textContent = handLabelGerman[result.playerHand];
            row.insertCell().textContent = handLabelGerman[result.systemHand];

        }, 3000);
    } catch (error) {
        const resultMessage = document.getElementById("result-message");
        resultMessage.textContent = "Error with online Service. Try again later.";
        resultMessage.classList.add("online-error");
        setTimeout(() => {
            resultMessage.innerHTML = null;
            resultMessage.classList.remove("online-error");
        }, 3000);
    }
});

showPage("startpage");