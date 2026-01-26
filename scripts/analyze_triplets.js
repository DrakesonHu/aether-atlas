#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function splitCSVLine(line) {
    const re = /(?:(?:"([^"]*(?:""[^"]*)*)")|([^,]*))(?:,|$)/g;
    const res = [];
    let m;
    while ((m = re.exec(line)) !== null) {
        if (m[1] !== undefined) res.push(m[1].replace(/""/g, '"'));
        else res.push(m[2] || '');
        if (re.lastIndex >= line.length) break;
    }
    return res;
}

const filepath = process.argv[2] || path.join('data', 'triplets.csv');

if (!fs.existsSync(filepath)) {
    console.error(`Error: File not found: ${filepath}`);
    console.log('\nUsage: node scripts/analyze_triplets.js [triplets.csv]');
    process.exit(1);
}

const raw = fs.readFileSync(filepath, 'utf8');
const lines = raw.split(/\r?\n/).filter(l => l.trim());
const rows = lines.slice(1).map(l => splitCSVLine(l)).filter(r => r.length >= 5);

const total = rows.length;

if (total === 0) {
    console.log('\n' + '='.repeat(70));
    console.log('  TRIPLET DATA ANALYSIS');
    console.log('='.repeat(70));
    console.log('\n  No data found in file.\n');
    console.log('='.repeat(70) + '\n');
    process.exit(0);
}

// Confidence breakdown
const byConfidence = {};
rows.forEach(r => {
    const conf = r[5] || 'high';
    byConfidence[conf] = (byConfidence[conf] || 0) + 1;
});

// Participant breakdown
const byParticipant = {};
rows.forEach(r => {
    const p = r[0];
    byParticipant[p] = (byParticipant[p] || 0) + 1;
});

// Song coverage
const songCounts = {};
rows.forEach(r => {
    const anchor = r[1];
    const a = r[2];
    const b = r[3];
    songCounts[anchor] = (songCounts[anchor] || 0) + 1;
    songCounts[a] = (songCounts[a] || 0) + 1;
    songCounts[b] = (songCounts[b] || 0) + 1;
});

const uniqueSongs = Object.keys(songCounts).length;
const avgComparisonsPerSong = total * 3 / uniqueSongs;

// Most/least compared songs
const sortedSongs = Object.entries(songCounts).sort((a, b) => b[1] - a[1]);
const mostCompared = sortedSongs.slice(0, 5);
const leastCompared = sortedSongs.slice(-5).reverse();

console.log('\n' + '='.repeat(70));
console.log('  TRIPLET DATA ANALYSIS');
console.log('='.repeat(70));

console.log(`\n  File: ${filepath}`);
console.log(`  Total comparisons: ${total}`);

console.log('\n  Confidence Breakdown:');
console.log('  ' + '-'.repeat(66));
Object.entries(byConfidence).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    const pct = (v / total * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(pct / 2));
    console.log(`  ${k.padEnd(10)} ${v.toString().padStart(5)} (${pct.padStart(5)}%)  ${bar}`);
});

console.log('\n  Participants:');
console.log('  ' + '-'.repeat(66));
console.log(`  Unique participants: ${Object.keys(byParticipant).length}`);
Object.entries(byParticipant).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([k, v]) => {
    console.log(`    ${k}: ${v} comparisons`);
});

console.log('\n  Song Coverage:');
console.log('  ' + '-'.repeat(66));
console.log(`  Unique songs: ${uniqueSongs}`);
console.log(`  Average comparisons per song: ${avgComparisonsPerSong.toFixed(1)}`);

console.log('\n  Most Compared Songs:');
mostCompared.forEach(([id, count]) => {
    const bar = '█'.repeat(Math.floor(count / 5));
    console.log(`    ${id.padEnd(20)} ${count.toString().padStart(4)}x  ${bar}`);
});

console.log('\n  Least Compared Songs:');
leastCompared.forEach(([id, count]) => {
    const bar = '░'.repeat(Math.floor(count / 2));
    console.log(`    ${id.padEnd(20)} ${count.toString().padStart(4)}x  ${bar}`);
});

console.log('\n  Data Quality Assessment:');
console.log('  ' + '-'.repeat(66));
const highConf = byConfidence['high'] || 0;
const highPct = (highConf / total * 100);
const coverage = avgComparisonsPerSong;

let quality = 'Poor';
let recommendation = 'Collect more data, especially high-confidence comparisons.';

if (highPct >= 60 && coverage >= 10) {
    quality = 'Excellent';
    recommendation = 'Ready for atlas generation!';
} else if (highPct >= 40 && coverage >= 8) {
    quality = 'Good';
    recommendation = 'Good quality. Consider collecting a few more comparisons.';
} else if (highPct >= 30 && coverage >= 5) {
    quality = 'Fair';
    recommendation = 'Usable but could benefit from more data.';
}

console.log(`  Quality: ${quality}`);
console.log(`  High-confidence rate: ${highPct.toFixed(1)}%`);
console.log(`  Coverage: ${coverage.toFixed(1)} comparisons/song`);
console.log(`  Recommendation: ${recommendation}`);

console.log('\n' + '='.repeat(70) + '\n');