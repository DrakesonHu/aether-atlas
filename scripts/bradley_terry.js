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
    // triples may express proportions in [0,1] or raw counts. Detect if value <= 1
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
            // treat as counts: interpret as wins for first id
            const winsA = Math.round(v);
            wins[i][j] += winsA;
            comps[i][j] += winsA;
            // we don't know total comparisons; assume symmetric counts are included elsewhere
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
        if (maxRel < tol) break;
    }
    const beta = p.map(v => Math.log(v + 1e-16));
    return { p, beta };
}

function computeSimilarityFromBeta(beta) {
    const n = beta.length;
    // similarity = 1 / (1 + abs(diff)) in (0,1]
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

// --- CLI ---
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node scripts/bradley_terry.js <input_pairwise.csv> [output_pairwise_sim.csv]');
    console.log('Input rows: idA,idB,value  where value is proportion in [0,1] or raw counts.');
    process.exit(1);
}
const input = args[0];
const output = args[1] || path.join('data', 'pairwise_bt.csv');
const K = 100; // pseudo-count multiplier for proportions

const triples = readPairwise(input);
const { ids, idIndex, wins, comps } = buildCounts(triples, K);
const { p, beta } = bradleyTerry(wins, comps, 1000, 1e-9);
const sim = computeSimilarityFromBeta(beta);

// write pairwise similarity CSV (idA,idB,similarity)
const outLines = [];
for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
        outLines.push(`${ids[i]},${ids[j]},${sim[i][j].toFixed(6)}`);
    }
}
fs.writeFileSync(output, outLines.join('\n') + '\n', 'utf8');
// write scores
const scoreLines = ['id,p_normalized,beta'];
for (let i = 0; i < ids.length; i++) scoreLines.push(`${ids[i]},${p[i].toFixed(6)},${beta[i].toFixed(6)}`);
fs.writeFileSync(path.join(path.dirname(output), 'bt_scores.csv'), scoreLines.join('\n') + '\n', 'utf8');
console.log(`Wrote ${outLines.length} pairwise similarities to ${output}`);
console.log('Wrote bt_scores.csv');
