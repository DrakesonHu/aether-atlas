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

function readTriplets(p) {
    const raw = fs.readFileSync(p, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return [];
    const header = splitCSVLine(lines[0]).map(s => s.toLowerCase());
    const hasHeader = header[0] && header[0].indexOf('participant') >= 0;
    const dataLines = hasHeader ? lines.slice(1) : lines;
    return dataLines.map(l => splitCSVLine(l)).filter(cols => cols.length >= 5);
}

function toPairwise(triples) {
    // triples: [participant, anchor, optionA, optionB, chosen, ...]
    const map = new Map();
    function key(a, b) { return a < b ? `${a}|||${b}` : `${b}|||${a}`; }

    for (const cols of triples) {
        const anchor = cols[1];
        const a = cols[2];
        const b = cols[3];
        const chosen = cols[4];
        // skip 'both close'/'both far' in non-weighted converter
        if (!chosen) continue;
        const lc = String(chosen).toLowerCase();
        if (lc === 'close' || lc === 'far') continue;
        if (!a || !b || !chosen) continue;
        if (a === b) continue;
        const k = key(a, b);
        if (!map.has(k)) map.set(k, { a, b, winsA: 0, winsB: 0, total: 0 });
        const rec = map.get(k);
        // determine which of rec.a/rec.b corresponds to chosen
        const first = rec.a < rec.b ? rec.a : rec.b;
        const second = rec.a < rec.b ? rec.b : rec.a;
        if (chosen === first) rec.winsA += 1;
        else if (chosen === second) rec.winsB += 1;
        // if chosen equals anchor or other, ignore
        rec.total += 1;
    }

    // produce rows: idA,idB,proportion_for_idA (idA < idB)
    const rows = [];
    for (const [k, rec] of map.entries()) {
        const parts = k.split('|||');
        const idA = parts[0], idB = parts[1];
        let winsForA = 0, winsForB = 0;
        if (rec.a === idA && rec.b === idB) { winsForA = rec.winsA; winsForB = rec.winsB; }
        else if (rec.a === idB && rec.b === idA) { winsForA = rec.winsB; winsForB = rec.winsA; }
        const total = winsForA + winsForB;
        const prop = total > 0 ? (winsForA / total) : 0;
        rows.push(`${idA},${idB},${prop.toFixed(6)}`);
    }
    return rows;
}

// CLI
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Usage: node scripts/triplets_to_pairwise.js <triplets.csv> [out_pairwise.csv]');
    process.exit(1);
}
const input = args[0];
const output = args[1] || path.join('data', 'pairwise_from_triplets.csv');
if (!fs.existsSync(input)) { console.error('Input not found:', input); process.exit(1); }
const triples = readTriplets(input);
const rows = toPairwise(triples);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, rows.join('\n') + '\n', 'utf8');
console.log(`Wrote ${rows.length} pairwise rows to ${output}`);
