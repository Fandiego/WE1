import { Utils } from '../utils/utils.js';

export class OfflineGameService {
    static DELAY_MS = 1000;

    constructor() {
        this.possibleHands = Object.keys(this.#resultLookup);
    }

    // same data structure as server
    #playerState = {
        Markus: {
            user: 'Markus',
            win: 3,
            lost: 6,
        },
        Michael: {
            user: 'Michael',
            win: 4,
            lost: 5,
        },
        Lisa: {
            user: 'Lisa',
            win: 4,
            lost: 5,
        },
    };

    // Can be used to check if the selected hand wins/loses
    // TODO : complete structure
    #resultLookup = {
        scissors: {
            scissors: 0,
            rock: -1,
            paper: 1,
            spock: -1,
            lizard: 1
        },
        rock: {
            scissors: 1,
            rock: 0,
            paper: -1,
            spock: -1,
            lizard: 1
        },
        paper: {
            scissors: -1,
            rock: 1,
            paper: 0,
            spock: 1,
            lizard: -1
        },
        spock: {
            scissors: 1,
            rock: 1,
            paper: -1,
            spock: 0,
            lizard: -1
        },
        lizard: {
            scissors: -1,
            rock: -1,
            paper: 1,
            spock: 1,
            lizard: 0
        },
    };


    async getRankings() {
        // TODO create ranking from playerState for Example: [{rank: 1, wins: 10, players: ["Michael", "Lias"]}, {rank: 2, wins: 5, players: ["Max"]}]
        const players = Object.values(this.#playerState);

        // Sort players by wins (descending)
        const sorted = players.sort((a, b) => b.win - a.win);

        // Take only the first 10 entries
        const topTen = sorted.slice(0, 10);

        let lastWins = null;
        let lastRank = 0;

        // Add rank numbers
        const rankings = topTen.map((player, index) => {
            // If wins are same as previous, keep the same rank
            if (player.win !== lastWins) {
                lastRank = index + 1;  // new rank
                lastWins = player.win;
            }
            return {
                rank: lastRank,
                user: player.user,
                wins: player.win,
                lost: player.lost,
            };
        });

        return Promise.resolve(rankings);
    }

    // TODO
    async evaluate(playerName, playerHand) {
        const systemHand = this.possibleHands[Math.floor(Math.random() * this.possibleHands.length)];
        const gameEval = this.#resultLookup[playerHand][systemHand];

        // add player to Ranking
        (this.#playerState[playerName] ??= { user: playerName, win: 0, lost: 0 });
        if (gameEval) this.#playerState[playerName][gameEval === 1 ? 'win' : 'lost']++;

        await Utils.wait(OfflineGameService.DELAY_MS); // emulate async

        return {playerName, gameEval, playerHand, systemHand};
    }
}
