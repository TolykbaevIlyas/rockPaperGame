const crypto = require('crypto');

class GameRules {
    constructor(moves) {
        this.moves = moves;
        this.rules = this.generateRules();
    }

    generateRules() {
        const n = this.moves.length;
        const half = Math.floor(n / 2);
        const rules = {};
        for (let i = 0; i < n; i++) {
            const move = this.moves[i];
            const winners = [];
            const losers = [];
            for (let j = 1; j <= half; j++) {
                winners.push(this.moves[(i + j) % n]);
                losers.push(this.moves[(i - j + n) % n]);
            }
            rules[move] = { wins: winners, loses: losers };
        }
        return rules;
    }

    getResult(playerMove, computerMove) {
        if (this.rules[playerMove].wins.includes(computerMove)) {
            return 'You win!';
        } else if (this.rules[playerMove].loses.includes(computerMove)) {
            return 'You lose!';
        } else {
            return "It's a draw!";
        }
    }
}

class Game {
    constructor(moves) {
        this.moves = moves;
        this.rules = new GameRules(moves);
    }

    generateKey() {
        return crypto.randomBytes(32);
    }

    generateHMAC(key, move) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(move);
        return hmac.digest('hex');
    }

    play() {
        const key = this.generateKey();
        const computerMove = this.moves[Math.floor(Math.random() * this.moves.length)];
        const hmacDigest = this.generateHMAC(key, computerMove);
        console.log('HMAC:', hmacDigest);

        console.log('\nAvailable moves:');
        this.moves.forEach((move, index) => console.log(`${index + 1} - ${move}`));
        console.log('0 - exit');
        console.log('? - help');

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('\nEnter your move: ', (playerChoice) => {
            readline.close();
            if (playerChoice === '0') {
                console.log('Exiting the game.');
            } else {
                const choiceIndex = parseInt(playerChoice);
                if (!Number.isNaN(choiceIndex) && choiceIndex >= 1 && choiceIndex <= this.moves.length) {
                    const playerMove = this.moves[choiceIndex - 1];
                    console.log(`\nYour move: ${playerMove}`);
                    console.log(`Computer's move: ${computerMove}`);
                    console.log(this.rules.getResult(playerMove, computerMove));
                    console.log(`HMAC key: ${key.toString('hex')}`);
                } else {
                    console.log('Invalid input. Please enter a number corresponding to the move.');
                }
            }
        });
    }
}

if (process.argv.length < 4 || process.argv.length % 2 === 0) {
    console.log('Error: Please provide an odd number of unique moves (at least 3) as command-line arguments.');
    console.log('Example: node game.js rock paper scissors');
} else {
    const moves = process.argv.slice(2);
    const game = new Game(moves);
    game.play();
}
