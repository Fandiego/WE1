import { gameService } from './model/game-service.js';

// Dummy Code
console.log('isOnline:', gameService.isOnline);

const rankings = await gameService.getRankings();
const board = document.getElementById("board");

Object.values(rankings).forEach(x=> {
    const li = document.createElement('li');
    li.innerHTML = `<span id="rank">${x.rank}.</span> ${x.user} (${x.wins}W, ${x.lost}L)`;
    board.appendChild(li);
});

console.log(await gameService.evaluate('Michael', gameService.possibleHands[0]));
