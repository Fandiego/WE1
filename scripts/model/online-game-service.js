export class OnlineGameService {
    #resultLookup = {
        scissors: {
            scissors: 0,
            rock: -1,
            paper: 1,
            spock: -1,
            lizard: 1,
        },
        rock: {
            scissors: 1,
            rock: 0,
            paper: -1,
            spock: -1,
            lizard: 1,
        },
        paper: {
            scissors: -1,
            rock: 1,
            paper: 0,
            spock: 1,
            lizard: -1,
        },
        spock: {
            scissors: 1,
            rock: 1,
            paper: -1,
            spock: 0,
            lizard: -1,
        },
        lizard: {
            scissors: -1,
            rock: -1,
            paper: 1,
            spock: 1,
            lizard: 0,
        },
    };

    async getRankings() {
        // TODO Server API CALL
        return fetch('https://stone.sifs0005.infs.ch/statistics', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((players) => {
                // Make sure we have an array
                const playerArray = Object.values(players);

                // Sort players by wins descending
                const sorted = playerArray.sort((a, b) => b.win - a.win);

                // Take top 10
                const topTen = sorted.slice(0, 10);

                let lastWins = null;
                let lastRank = 0;

                // Add ranks
                const rankings = topTen.map((player, index) => {
                    if (player.win !== lastWins) {
                        lastRank = index + 1;
                        lastWins = player.win;
                    }
                    return {
                        rank: lastRank,
                        user: player.user,
                        wins: player.win,
                        lost: player.lost,
                    };
                });

                return rankings;
            })
            .catch((error) => {
                console.error('Failed to fetch rankings:', error);
                return [];
            });
    }

    // TODO
    async evaluate(playerName, playerHand) {
        // TODO Server API CALL
        const url = `https://stone.sifs0005.infs.ch/play?playerName=${encodeURIComponent(playerName)}&playerHand=${encodeURIComponent(playerHand.charAt(0).toUpperCase() + playerHand.slice(1).toLowerCase())}&mode=spock`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Map API response to your method's return structure
            const systemHand = data.choice;
            let gameEval = 0;
            if (data.win != null) {
                if (data.win) {
                    gameEval = 1;
                }
                else {
                    gameEval = -1;
                }
            }
            gameEval = Number(gameEval);

            return { playerName, gameEval, playerHand, systemHand: systemHand.toLowerCase()};

        } catch (error) {
            console.error('Failed to evaluate game:', error);

            // Optional fallback to offline/local logic
            const systemHand = this.possibleHands[Math.floor(Math.random() * this.possibleHands.length)];
            const gameEval = this.#resultLookup[playerHand][systemHand];

            return { playerName, gameEval, playerHand, systemHand};
        }
    }
}
