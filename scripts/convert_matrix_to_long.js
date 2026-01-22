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

function matrixToLong(inputPath, outputPath) {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const lines = raw.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) throw new Error('Need header + rows');
    const header = splitCSVLine(lines[0]);
    const ids = header.slice(1);
    const n = ids.length;
    const rows = lines.slice(1).map(l => splitCSVLine(l).slice(1));
    const out = ['id1,id2,value'];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const v = rows[i][j] || rows[j][i] || '';
            out.push(`${ids[i]},${ids[j]},${v}`);
        }
    }
    fs.writeFileSync(outputPath, out.join('\n'), 'utf8');
    console.log('Wrote', outputPath);
}

const inPath = process.argv[2] || path.join('data', 'pairwise_sample.csv');
const outPath = process.argv[3] || path.join('data', 'pairwise_long.csv');
if (!fs.existsSync(inPath)) { console.error('Input not found:', inPath); process.exit(1); }
try { matrixToLong(inPath, outPath); } catch (e) { console.error(e.message); process.exit(1); }
