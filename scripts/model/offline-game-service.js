import { Utils } from '../utils/utils.js';

export class OfflineGameService {
    static DELAY_MS = 1000;

    constructor() {
        this.possibleHands = Object.keys(this.#resultLookup);
    }

    // rankings: same data structure as server
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
        return Object.values(this.#playerState);
    }

    async evaluate(playerName, playerHand) {
        const systemHand = this.possibleHands[Math.floor(Math.random() * this.possibleHands.length)];
        const gameEval = this.#resultLookup[playerHand][systemHand];

        // add player to ranking
        (this.#playerState[playerName] ??= { user: playerName, win: 0, lost: 0 });
        if (gameEval) this.#playerState[playerName][gameEval === 1 ? 'win' : 'lost']++;

        await Utils.wait(OfflineGameService.DELAY_MS); // emulate async

        return {playerName, gameEval, playerHand, systemHand};
    }
}
