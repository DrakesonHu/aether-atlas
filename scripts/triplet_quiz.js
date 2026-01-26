const fs = require('fs');
const path = require('path');
const readline = require('readline');

const APP_PATH = path.join('src', 'App.js');
const CSV_PATH = path.join('data', 'triplets.csv');
const TOTAL_QUESTIONS = 50;

/*
 * Response codes (chosen,strength):
 *   A + high   = A is MUCH more similar
 *   A + low    = A is SLIGHTLY more similar
 *   B + high   = B is MUCH more similar
 *   B + low    = B is SLIGHTLY more similar
 *   close + equal = both equally CLOSE (similar to anchor)
 *   far + equal   = both equally FAR (dissimilar from anchor)
 */

function readSongDatabase() {
    if (!fs.existsSync(APP_PATH)) return [];
    const txt = fs.readFileSync(APP_PATH, 'utf8');
    const match = txt.match(/const\s+SONG_DATABASE\s*=\s*(\[[\s\S]*?\]);/m);
    if (!match) return [];
    try {
        return new Function('"use strict"; return ' + match[1])();
    } catch (err) {
        console.error('Failed to parse SONG_DATABASE:', err.message);
        return [];
    }
}


function ensureCSV() {
    const dir = path.dirname(CSV_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(CSV_PATH)) {
        fs.writeFileSync(CSV_PATH, 'participant,anchor,optionA,optionB,chosen,strength,timestamp\n');
    }
}

function appendResponse(row) {
    fs.appendFileSync(CSV_PATH, row + '\n', 'utf8');
}

const songs = readSongDatabase();
if (!songs.length) {
    console.error('No songs found in SONG_DATABASE. Make sure src/App.js exports the data.');
    process.exit(1);
}

ensureCSV();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

function pickTriplet() {
    const ids = new Set();
    while (ids.size < 3) {
        ids.add(Math.floor(Math.random() * songs.length));
    }
    const [anchorIndex, optionAIndex, optionBIndex] = Array.from(ids);
    return {
        anchor: songs[anchorIndex],
        optionA: songs[optionAIndex],
        optionB: songs[optionBIndex]
    };
}

function formatSong(song) {
    return `${song.title} by ${song.artist}`;
}

async function runQuiz() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║           AETHER_ATLAS  —  Similarity Survey              ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    console.log('For each question, pick ONE of the following:\n');
    console.log('  1  =  A is MUCH more similar');
    console.log('  2  =  A is SLIGHTLY more similar');
    console.log('  3  =  B is MUCH more similar');
    console.log('  4  =  B is SLIGHTLY more similar');
    console.log('  5  =  Both equally CLOSE (similar to reference)');
    console.log('  6  =  Both equally FAR (neither is similar)\n');
    console.log('  s  =  skip this question');
    console.log('  q  =  quit and save\n');

    const participant = await ask('Participant handle (press enter for anonymous): ');
    const participantId = participant.trim() || `p${Date.now()}`;
    let answered = 0;

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const triplet = pickTriplet();
        console.log(`\n─────────────────────────────────────────────────────────────`);
        console.log(`  Question ${i + 1} of ${TOTAL_QUESTIONS}`);
        console.log(`─────────────────────────────────────────────────────────────`);
        console.log(`  Reference:  ${formatSong(triplet.anchor)}`);
        console.log(`\n      A)  ${formatSong(triplet.optionA)}`);
        console.log(`      B)  ${formatSong(triplet.optionB)}`);

        console.log('\n  Quick map (so you don\'t have to memorize):');
        console.log('    1 = A is MUCH more similar');
        console.log('    2 = A is SLIGHTLY more similar');
        console.log('    3 = B is MUCH more similar');
        console.log('    4 = B is SLIGHTLY more similar');
        console.log('    5 = Both are CLOSE (equally similar)');
        console.log('    6 = Both are FAR (equally dissimilar)');
        console.log('    s = skip,   q = quit and save');

        // Re-prompt until we get a valid response (or skip/quit)
        let answer = '';
        while (true) {
            answer = (await ask('\n  Your choice (1-6, s, q) — pick the number shown above: ')).trim().toLowerCase();
            if (!answer) {
                console.log('  → No input detected. Please enter 1-6, s, or q.');
                continue;
            }
            if (answer === 'q') {
                console.log('\nExiting and saving progress...');
                i = TOTAL_QUESTIONS; // break outer loop
                break;
            }
            if (answer === 's') {
                console.log('  → Skipped.');
                break;
            }
            if (/^[1-6]$/.test(answer)) {
                break; // valid numeric choice
            }
            console.log('  → Invalid input. Enter a number 1-6, s to skip, or q to quit.');
        }

        if (!answer || answer === 's') continue;
        if (answer === 'q') break;

        let chosen, strength;
        switch (answer) {
            case '1': chosen = triplet.optionA.id; strength = 'high'; break;
            case '2': chosen = triplet.optionA.id; strength = 'low'; break;
            case '3': chosen = triplet.optionB.id; strength = 'high'; break;
            case '4': chosen = triplet.optionB.id; strength = 'low'; break;
            case '5': chosen = 'close'; strength = 'equal'; break;
            case '6': chosen = 'far'; strength = 'equal'; break;
        }

        const timestamp = new Date().toISOString();
        const row = [
            participantId,
            triplet.anchor.id,
            triplet.optionA.id,
            triplet.optionB.id,
            chosen,
            strength,
            timestamp
        ].join(',');
        appendResponse(row);
        answered++;
        console.log('  → Recorded.');
    }

    console.log(`\n═══════════════════════════════════════════════════════════════`);
    console.log(`  Done! ${answered} responses saved to data/triplets.csv`);
    console.log(`═══════════════════════════════════════════════════════════════\n`);
    rl.close();
}

runQuiz().catch(err => {
    console.error('Quiz failed:', err);
    rl.close();
});