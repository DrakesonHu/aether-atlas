#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readSongDatabase() {
    const appPath = path.join('src', 'App.js');
    if (!fs.existsSync(appPath)) return [];
    const txt = fs.readFileSync(appPath, 'utf8');
    const m = txt.match(/const\s+SONG_DATABASE\s*=\s*\[/);
    if (!m) return [];
    const start = m.index + m[0].length;
    const tail = txt.slice(start);
    const endIndex = tail.indexOf('];');
    if (endIndex === -1) return [];
    const block = tail.slice(0, endIndex);
    const re = /\{[^}]*?id\s*:\s*['\"]([^'\"]+)['\"][^}]*?x\s*:\s*([0-9.+-]+)[^}]*?y\s*:\s*([0-9.+-]+)[^}]*?\}/gms;
    const res = [];
    let mm;
    while ((mm = re.exec(block)) !== null) {
        res.push({ id: mm[1], x: Number(mm[2]), y: Number(mm[3]) });
    }
    return res;
}

function euclid(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function simulate(trials = 500, beta = 0.15) {
    const songs = readSongDatabase();
    if (!songs.length) throw new Error('No SONG_DATABASE entries found in src/App.js');
    const rows = [];
    for (let i = 0; i < trials; i++) {
        const participant = `p${Math.floor(i / 50) + 1}`;
        const anchor = songs[Math.floor(Math.random() * songs.length)];
        let a, b;
        do { a = songs[Math.floor(Math.random() * songs.length)]; } while (a.id === anchor.id);
        do { b = songs[Math.floor(Math.random() * songs.length)]; } while (b.id === anchor.id || b.id === a.id);
        const dA = euclid(anchor, a), dB = euclid(anchor, b);
        const sA = Math.exp(-beta * dA), sB = Math.exp(-beta * dB);
        const pA = sA / (sA + sB);
        const chosen = Math.random() < pA ? a.id : b.id;
        const timestamp = new Date().toISOString();
        rows.push([participant, anchor.id, a.id, b.id, chosen, timestamp].join(','));
    }
    return rows;
}

function main() {
    const cnt = Number(process.argv[2] || 500);
    const outDir = path.join('data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'mock_triplets.csv');
    try {
        const rows = simulate(cnt);
        const header = 'participant,anchor,optionA,optionB,chosen,timestamp';
        fs.writeFileSync(outPath, [header, ...rows].join('\n'), 'utf8');
        console.log(`Wrote ${outPath} (${cnt} trials)`);
    } catch (e) {
        console.error('Error:', e.message || e);
        process.exit(1);
    }
}

if (require.main === module) main();
