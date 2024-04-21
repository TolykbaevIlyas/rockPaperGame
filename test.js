function runGameWithParams(params) {
    console.log(`\nRunning game with parameters: ${params.join(' ')}`);
    const { execSync } = require('child_process');
    const result = execSync(`echo 1 | node main.js ${params.join(' ')}`, { encoding: 'utf-8' });
    console.log(result);
}

runGameWithParams(['rock', 'paper', 'scissors']);
runGameWithParams(['rock', 'paper', 'scissors', 'lizard', 'Spock', 'gun', 'water']);
runGameWithParams(['rock', 'paper', 'rock']);
runGameWithParams(['rock', 'paper', 'scissors', 'lizard', 'Spock', 'gun']);
runGameWithParams(['rock']);
runGameWithParams([]);
runGameWithParams(['rock', 'paper', 'scissors', 'lizard', 'Spock']);
