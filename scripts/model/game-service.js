import { OfflineGameService } from './offline-game-service.js';
import { OnlineGameService } from './online-game-service.js';

class GameService {
    isOnline = false;

    constructor() {
        this.offlineService = new OfflineGameService();
        this.onlineGameService = new OnlineGameService();
    }

    get service() {
        return this.isOnline ? this.onlineGameService : this.offlineService;
    }

    async getRankings() {
        const players = await this.service.getRankings();

        // sort players by wins (descending)
        const sorted = players.sort((a, b) => b.win - a.win);

        // take only the first 10 entries
        const topTen = sorted.slice(0, 10);

        let lastWins = null;
        let lastRank = 0;

        // add rank numbers
        return topTen.map((player, index) => {
            // if wins are same as previous, keep the same rank
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
    }

    async evaluate(playerName, playerHand) {
        return this.service.evaluate(playerName, playerHand);
    }

    get possibleHands() {
        return this.service.possibleHands;
    }
}

export const gameService = new GameService();
