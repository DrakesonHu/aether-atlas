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

function toPairwiseWeighted(triples, minConfidence = 0) {
    // Confidence weights: high=1.0, low=0.3, equal=skip
    const confidenceWeights = { 'high': 1.0, 'low': 0.3, 'medium': 0.6 };

    const map = new Map();
    function key(a, b) { return a < b ? `${a}|||${b}` : `${b}|||${a}`; }

    let skipped = 0;
    let total = 0;

    for (const cols of triples) {
        const anchor = cols[1];
        const a = cols[2];
        const b = cols[3];
        const chosen = cols[4];
        const confidence = cols[5] || 'high';

        total++;

        if (!a || !b || !chosen) continue;
        if (a === b) continue;

        // Handle 'equal' responses specially: treat 'close' as weak double-vote, skip 'far'
        if (confidence === 'equal') {
            if (String(chosen).toLowerCase() === 'close') {
                // weak double vote for both A and B
                const w = 0.25;
                const k0 = key(a, b);
                if (!map.has(k0)) map.set(k0, { a, b, scoreA: 0, scoreB: 0, totalWeight: 0 });
                const rec0 = map.get(k0);
                rec0.scoreA += w;
                rec0.scoreB += w;
                rec0.totalWeight += 2 * w;
                continue;
            } else {
                skipped++;
                continue;
            }
        }

        const weight = confidenceWeights[confidence] || 0.5;
        if (weight < minConfidence) {
            skipped++;
            continue;
        }

        const k = key(a, b);
        if (!map.has(k)) map.set(k, { a, b, scoreA: 0, scoreB: 0, totalWeight: 0 });
        const rec = map.get(k);

        // Determine which ID corresponds to a/b
        const first = rec.a < rec.b ? rec.a : rec.b;
        const second = rec.a < rec.b ? rec.b : rec.a;

        if (chosen === first) rec.scoreA += weight;
        else if (chosen === second) rec.scoreB += weight;

        rec.totalWeight += weight;
    }

    console.log(`\n  Processed ${total} comparisons`);
    console.log(`  Skipped ${skipped} (equal/low-confidence)`);
    console.log(`  Used ${total - skipped} for pairwise conversion`);

    // Produce rows: idA,idB,proportion_for_idA (idA < idB)
    const rows = [];
    for (const [k, rec] of map.entries()) {
        const parts = k.split('|||');
        const idA = parts[0], idB = parts[1];

        let scoreForA = 0, scoreForB = 0;
        if (rec.a === idA && rec.b === idB) {
            scoreForA = rec.scoreA;
            scoreForB = rec.scoreB;
        } else if (rec.a === idB && rec.b === idA) {
            scoreForA = rec.scoreB;
            scoreForB = rec.scoreA;
        }

        const total = scoreForA + scoreForB;
        if (total === 0) continue; // No valid comparisons

        const prop = scoreForA / total;
        rows.push(`${idA},${idB},${prop.toFixed(6)}`);
    }

    return rows;
}

// CLI
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node scripts/triplets_to_pairwise_weighted.js <triplets.csv> [out_pairwise.csv] [minConfidence]');
    console.log('');
    console.log('Arguments:');
    console.log('  triplets.csv    Input file with triplet comparisons');
    console.log('  out_pairwise    Output file (default: data/pairwise_weighted.csv)');
    console.log('  minConfidence   Filter responses below this weight (0-1, default: 0)');
    console.log('');
    console.log('Confidence weights:');
    console.log('  high   = 1.0');
    console.log('  medium = 0.6');
    console.log('  low    = 0.3');
    console.log('  equal  = skipped');
    console.log('');
    console.log('Example:');
    console.log('  node scripts/triplets_to_pairwise_weighted.js data/triplets.csv data/pairwise.csv 0.3');
    process.exit(1);
}

const input = args[0];
const output = args[1] || path.join('data', 'pairwise_weighted.csv');
const minConf = parseFloat(args[2]) || 0;

if (!fs.existsSync(input)) {
    console.error('Error: Input not found:', input);
    process.exit(1);
}

console.log('\n' + '='.repeat(70));
console.log('  TRIPLETS TO PAIRWISE CONVERSION (WEIGHTED)');
console.log('='.repeat(70));
console.log(`\n  Input:  ${input}`);
console.log(`  Output: ${output}`);
console.log(`  Min confidence weight: ${minConf}`);

const triples = readTriplets(input);
const rows = toPairwiseWeighted(triples, minConf);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, rows.join('\n') + '\n', 'utf8');

console.log(`\n  ✓ Wrote ${rows.length} weighted pairwise rows\n`);
console.log('='.repeat(70) + '\n');