export class OnlineGameService {

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
            });
    }

    // TODO
    async evaluate(playerName, playerHand) {
        // TODO Server API CALL
        const url = `https://stone.sifs0005.infs.ch/play?playerName=${encodeURIComponent(playerName)}&playerHand=${encodeURIComponent(playerHand.charAt(0).toUpperCase() + playerHand.slice(1).toLowerCase())}&mode=spock`;

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

        const systemHand = data.choice;
        let gameEval = 0;
        if (data.win != null) gameEval = data.win ? 1 : -1;
        gameEval = Number(gameEval);

        return { playerName, gameEval, playerHand, systemHand: systemHand.toLowerCase()};

    }
}
