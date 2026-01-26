#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function loadSongDatabase() {
    const appPath = path.join(__dirname, '..', 'src', 'App.js');
    const content = fs.readFileSync(appPath, 'utf8');
    const match = content.match(/const SONG_DATABASE = (\[[\s\S]*?\n\]);/);
    if (!match) throw new Error('Could not find SONG_DATABASE in App.js');
    return eval(match[1]);
}

function loadTargetPairs() {
    const targetPath = path.join(__dirname, '..', 'data', 'target_pairs.json');
    if (!fs.existsSync(targetPath)) {
        console.error('\n⚠️  No target pairs found. Run the pipeline first:');
        console.error('   node scripts/run_adaptive_pipeline.js\n');
        process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    return data.targetPairs || [];
}

function shuffleArray(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function formatTrack(song) {
    const artist = song.featuring ? `${song.artist} (feat. ${song.featuring})` : song.artist;
    return `${song.title} by ${artist}`;
}

function saveTriplet(participant, anchor, optionA, optionB, chosen, strength) {
    const csvPath = path.join(__dirname, '..', 'data', 'triplets.csv');
    const timestamp = new Date().toISOString();
    const row = `${participant},${anchor},${optionA},${optionB},${chosen},${strength},${timestamp}\n`;

    if (!fs.existsSync(csvPath)) {
        fs.writeFileSync(csvPath, 'participant,anchor,optionA,optionB,chosen,strength,timestamp\n');
    }
    fs.appendFileSync(csvPath, row);
}

async function runAdaptiveQuiz() {
    console.clear();
    console.log('\n' + '='.repeat(70));
    console.log('  ADAPTIVE TRIPLET QUIZ');
    console.log('  Focus on high-uncertainty comparisons');
    console.log('='.repeat(70));

    const songs = loadSongDatabase();
    const targetPairs = loadTargetPairs();

    console.log(`\n  Loaded ${songs.length} tracks`);
    console.log(`  Target pairs for refinement: ${targetPairs.length}`);

    const name = await question('\n  Enter your name: ');
    if (!name.trim()) {
        console.log('\n  Name required. Exiting.\n');
        rl.close();
        return;
    }

    const numQuestions = await question('  How many comparisons? (default: 20): ');
    const total = parseInt(numQuestions) || 20;

    console.log('\n' + '-'.repeat(70));
    console.log('  Instructions:');
    console.log('  - Each question shows 3 tracks: an anchor and two options (A/B)');
    console.log('  - Choose which option (A or B) sounds more similar to the anchor');
    console.log('  - Rate your confidence: 1=guess, 2=unsure, 3=confident');
    console.log('  - Type "q" or "s" to quit and save');
    console.log('-'.repeat(70) + '\n');

    await question('  Press Enter to start...');

    let count = 0;
    const shuffledPairs = shuffleArray(targetPairs);

    for (let i = 0; i < Math.min(total, shuffledPairs.length); i++) {
        const [id1, id2] = shuffledPairs[i];

        // Find a third track as anchor (not in the pair)
        const availableAnchors = songs.filter(s => s.id !== id1 && s.id !== id2);
        if (availableAnchors.length === 0) continue;

        const anchor = availableAnchors[Math.floor(Math.random() * availableAnchors.length)];
        const optA = songs.find(s => s.id === id1);
        const optB = songs.find(s => s.id === id2);

        if (!optA || !optB) continue;

        // Randomly assign A/B
        const swap = Math.random() < 0.5;
        const [trackA, trackB] = swap ? [optB, optA] : [optA, optB];

        console.clear();
        console.log('\n' + '='.repeat(70));
        console.log(`  Question ${i + 1}/${Math.min(total, shuffledPairs.length)}`);
        console.log('='.repeat(70) + '\n');

        console.log(`  🎵 ANCHOR: ${formatTrack(anchor)}\n`);
        console.log(`     A) ${formatTrack(trackA)}`);
        console.log(`     B) ${formatTrack(trackB)}\n`);
        console.log('  Which sounds more similar to the anchor? (A/B)');

        let choice, confidence;
        while (true) {
            const answer = (await question('  Your choice: ')).trim().toLowerCase();

            if (answer === 'q' || answer === 's') {
                console.log(`\n  ✓ Saved ${count} comparisons. Exiting.\n`);
                rl.close();
                return;
            }

            if (answer === 'a' || answer === 'b' || answer === '1' || answer === '2') {
                choice = answer === 'a' || answer === '1' ? trackA.id : trackB.id;

                const confAnswer = (await question('  Confidence (1=guess, 2=unsure, 3=confident): ')).trim();
                const conf = parseInt(confAnswer);
                if (conf >= 1 && conf <= 3) {
                    confidence = conf;
                    break;
                } else {
                    console.log('  Invalid confidence. Try again.');
                }
            } else {
                console.log('  Invalid choice. Enter A, B, 1, 2, q, or s.');
            }
        }

        saveTriplet(name.trim(), anchor.id, trackA.id, trackB.id, choice, confidence);
        count++;
    }

    console.log('\n' + '='.repeat(70));
    console.log(`  ✓ COMPLETE: Saved ${count} adaptive comparisons`);
    console.log('='.repeat(70));
    console.log('\n  Run the pipeline again to refine the atlas:');
    console.log('    node scripts/run_adaptive_pipeline.js\n');

    rl.close();
}

runAdaptiveQuiz().catch(err => {
    console.error('\n  Error:', err.message);
    rl.close();
    process.exit(1);
});
