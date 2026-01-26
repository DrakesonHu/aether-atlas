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

function readPairwise(inputPath) {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const triples = lines.map(l => splitCSVLine(l)).filter(c => c.length >= 3);
    return triples; // [ [idA,idB,value], ... ]
}

function buildCounts(triples, K = 100) {
    const ids = [];
    const idIndex = new Map();
    function addId(id) { if (!idIndex.has(id)) { idIndex.set(id, ids.length); ids.push(id); } }
    for (const t of triples) { addId(t[0]); addId(t[1]); }
    const n = ids.length;
    const wins = Array.from({ length: n }, () => Array(n).fill(0));
    const comps = Array.from({ length: n }, () => Array(n).fill(0));

    for (const t of triples) {
        const a = t[0];
        const b = t[1];
        let v = parseFloat(t[2]);
        const i = idIndex.get(a), j = idIndex.get(b);
        if (Number.isNaN(v)) continue;
        if (v <= 1) {
            // treat as proportion in [0,1]
            const winsA = Math.round(v * K);
            const winsB = K - winsA;
            wins[i][j] += winsA;
            wins[j][i] += winsB;
            comps[i][j] += K;
            comps[j][i] += K;
        } else {
            // treat as counts
            const winsA = Math.round(v);
            wins[i][j] += winsA;
            comps[i][j] += winsA;
        }
    }
    // ensure diagonal zeros
    for (let ii = 0; ii < n; ii++) { wins[ii][ii] = 0; comps[ii][ii] = 0; }
    return { ids, idIndex, wins, comps };
}

function bradleyTerry(wins, comps, maxIter = 1000, tol = 1e-9) {
    const n = wins.length;
    const p = Array(n).fill(1.0);
    const totalWins = Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) totalWins[i] += wins[i][j];

    for (let iter = 0; iter < maxIter; iter++) {
        const pNew = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            let denom = 0;
            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                const nij = comps[i][j] || comps[j][i] || 0;
                if (nij <= 0) continue;
                denom += nij / (p[i] + p[j]);
            }
            if (denom > 0) pNew[i] = totalWins[i] / denom;
            else pNew[i] = p[i];
        }
        // normalize
        const sum = pNew.reduce((s, v) => s + v, 0) || 1;
        for (let i = 0; i < n; i++) pNew[i] /= sum;
        // check convergence
        let maxRel = 0;
        for (let i = 0; i < n; i++) {
            const rel = Math.abs(pNew[i] - p[i]) / (p[i] || 1e-12);
            if (rel > maxRel) maxRel = rel;
            p[i] = pNew[i];
        }
        if (iter % 100 === 0 || iter === maxIter - 1) {
            console.log(`    Iteration ${iter + 1}/${maxIter}, max relative change: ${maxRel.toExponential(2)}`);
        }
        if (maxRel < tol) {
            console.log(`  ✓ Converged at iteration ${iter + 1}`);
            break;
        }
    }
    const beta = p.map(v => Math.log(v + 1e-16));
    return { p, beta };
}

function computeSimilarityFromBeta(beta) {
    const n = beta.length;
    const sim = Array.from({ length: n }, () => Array(n).fill(0));
    let maxVal = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const v = 1 / (1 + Math.abs(beta[i] - beta[j]));
        sim[i][j] = v;
        if (v > maxVal) maxVal = v;
    }
    // normalize to [0,1]
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) sim[i][j] = (sim[i][j] - 0) / (maxVal - 0 || 1);
    return sim;
}

// CLI
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node scripts/bradley_terry.js <input_pairwise.csv> [output_pairwise_sim.csv]');
    console.log('');
    console.log('Input format:');
    console.log('  idA,idB,value');
    console.log('  where value is a proportion in [0,1] or raw counts');
    console.log('');
    console.log('Output:');
    console.log('  Pairwise similarity scores derived from Bradley-Terry model');
    console.log('  Also generates bt_scores.csv with strength parameters');
    process.exit(1);
}

const input = args[0];
const output = args[1] || path.join('data', 'pairwise_bt.csv');
const K = 100;

if (!fs.existsSync(input)) {
    console.error('Error: Input file not found:', input);
    process.exit(1);
}

console.log('\n' + '='.repeat(70));
console.log('  BRADLEY-TERRY MODEL');
console.log('='.repeat(70));
console.log(`\n  Input:  ${input}`);
console.log(`  Output: ${output}`);

const triples = readPairwise(input);
console.log(`\n  Loaded ${triples.length} pairwise comparisons`);

const { ids, idIndex, wins, comps } = buildCounts(triples, K);
console.log(`  Items: ${ids.length}`);

console.log('\n  Running Bradley-Terry optimization...');
const { p, beta } = bradleyTerry(wins, comps, 1000, 1e-9);

console.log('\n  Computing similarity matrix...');
const sim = computeSimilarityFromBeta(beta);

// Write pairwise similarity CSV
const outLines = [];
for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
        outLines.push(`${ids[i]},${ids[j]},${sim[i][j].toFixed(6)}`);
    }
}
fs.writeFileSync(output, outLines.join('\n') + '\n', 'utf8');

// Write scores
const scoreLines = ['id,p_normalized,beta'];
for (let i = 0; i < ids.length; i++) {
    scoreLines.push(`${ids[i]},${p[i].toFixed(6)},${beta[i].toFixed(6)}`);
}
const scoresPath = path.join(path.dirname(output), 'bt_scores.csv');
fs.writeFileSync(scoresPath, scoreLines.join('\n') + '\n', 'utf8');

console.log(`\n  ✓ Wrote ${outLines.length} pairwise similarities to ${output}`);
console.log(`  ✓ Wrote strength parameters to ${scoresPath}\n`);
console.log('='.repeat(70) + '\n');