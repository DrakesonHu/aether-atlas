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
function parseMatrixCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) throw new Error('CSV must contain header and at least one row');
    const header = splitCSVLine(lines[0]);
    if (header.length < 2) throw new Error('Header must contain at least one id column and one numeric column');
    // Require first header cell to be empty or 'id'
    const first = header[0].trim().toLowerCase();
    if (!(first === '' || first === 'id' || first === 'track' || first === 'name')) {
        throw new Error('Expected matrix CSV where first header column is empty or "id" (row ids in first column)');
    }
    const ids = header.slice(1);
    const n = ids.length;
    const mat = Array.from({ length: n }, () => Array(n).fill(NaN));
    for (let r = 1; r <= n; r++) {
        if (r >= lines.length) throw new Error('Not enough rows for square matrix');
        const cols = splitCSVLine(lines[r]);
        if (cols.length < n + 1) throw new Error(`Row ${r} has incorrect column count`);
        for (let c = 0; c < n; c++) {
            const v = parseFloat(cols[c + 1]);
            mat[r - 1][c] = Number.isFinite(v) ? v : NaN;
        }
    }
    // Symmetrize and fill diagonal
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            const a = mat[i][j];
            const b = mat[j][i];
            let val;
            if (!Number.isFinite(a) && Number.isFinite(b)) val = b;
            else if (!Number.isFinite(b) && Number.isFinite(a)) val = a;
            else if (!Number.isFinite(a) && !Number.isFinite(b)) val = 0;
            else val = (a + b) / 2;
            mat[i][j] = mat[j][i] = val;
        }
        mat[i][i] = 1;
    }
    return { ids, mat };
}

function parsePairwiseCSV(text) {
    // Detect format: if header's first cell empty or 'id' -> matrix, else long format (id1,id2,value)
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    const firstCols = splitCSVLine(lines[0]);
    const first = firstCols[0].trim().toLowerCase();
    if (first === '' || first === 'id' || first === 'track' || first === 'name') {
        return parseMatrixCSV(text);
    }

    // long/edge-list format
    const triples = lines.map(l => splitCSVLine(l)).filter(cols => cols.length >= 3);
    const ids = [];
    const idIndex = new Map();
    function addId(id) { if (!idIndex.has(id)) { idIndex.set(id, ids.length); ids.push(id); } }
    for (const cols of triples) { addId(cols[0]); addId(cols[1]); }
    const n = ids.length;
    const mat = Array.from({ length: n }, () => Array(n).fill(NaN));
    // set diagonal to 1
    for (let i = 0; i < n; i++) mat[i][i] = 1;
    for (const cols of triples) {
        const a = cols[0], b = cols[1], v = parseFloat(cols[2]);
        const i = idIndex.get(a), j = idIndex.get(b);
        if (i === undefined || j === undefined) continue;
        const val = Number.isFinite(v) ? v : NaN;
        mat[i][j] = mat[j][i] = Number.isFinite(val) ? val : mat[i][j];
    }
    // replace NaNs with 0
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!Number.isFinite(mat[i][j])) mat[i][j] = 0;
    return { ids, mat };
}

function normalizeCoords(coords) {
    const dims = coords[0].length;
    const all = [];
    for (let d = 0; d < dims; d++) for (let i = 0; i < coords.length; i++) all.push(coords[i][d]);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const range = max - min || 1;
    return coords.map(c => c.map(v => +(5 + (v - min) / range * 90).toFixed(2)));
}

function readSongDatabaseIds() {
    const appPath = path.join('src', 'App.js');
    if (!fs.existsSync(appPath)) return [];
    try {
        const txt = fs.readFileSync(appPath, 'utf8');
        const m = txt.match(/const\s+SONG_DATABASE\s*=\s*\[/);
        if (!m) return [];
        const start = m.index + m[0].length;
        const tail = txt.slice(start);
        const endIndex = tail.indexOf('];');
        if (endIndex === -1) return [];
        const block = tail.slice(0, endIndex);
        const ids = Array.from(block.matchAll(/id\s*:\s*['\"]([^'\"]+)['\"]/g)).map(x => x[1]);
        return ids;
    } catch (e) {
        return [];
    }
}

function isotonicPAV(y) {
    // y is an array of numbers corresponding to sorted x; returns fitted monotone non-decreasing array
    const n = y.length;
    const blocks = [];
    for (let i = 0; i < n; i++) {
        blocks.push({ sum: y[i], w: 1, avg: y[i] });
        while (blocks.length >= 2) {
            const L = blocks.length;
            if (blocks[L - 2].avg > blocks[L - 1].avg) {
                const b2 = blocks.pop();
                const b1 = blocks.pop();
                const merged = { sum: b1.sum + b2.sum, w: b1.w + b2.w, avg: (b1.sum + b2.sum) / (b1.w + b2.w) };
                blocks.push(merged);
            } else break;
        }
    }
    const fitted = [];
    for (const b of blocks) {
        for (let k = 0; k < b.w; k++) fitted.push(b.avg);
    }
    return fitted;
}

function nonmetricMDS(D, dims = 2, maxIter = 200, tol = 1e-6, verbose = true) {
    const n = D.length;
    const coords = Array.from({ length: n }, () => Array.from({ length: dims }, () => (Math.random() - 0.5) * 50));
    const lr = 0.02;
    let prevStress = Infinity;

    for (let iter = 0; iter < maxIter; iter++) {
        // compute current distances
        const curd = Array.from({ length: n }, () => Array(n).fill(0));
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
            let s = 0;
            for (let d = 0; d < dims; d++) { const diff = coords[i][d] - coords[j][d]; s += diff * diff; }
            curd[i][j] = curd[j][i] = Math.sqrt(s) || 1e-6;
        }

        // flatten upper triangle and sort by input dissimilarity
        const pairs = [];
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push({ i, j, D: D[i][j], dcur: curd[i][j] });
        pairs.sort((a, b) => a.D - b.D);
        const Dsorted = pairs.map(p => p.D);
        const dcurSorted = pairs.map(p => p.dcur);

        // isotonic fit of dcurSorted as a monotone function of Dsorted
        const fitted = isotonicPAV(dcurSorted);

        // assign disparities back
        const delta = Array.from({ length: n }, () => Array(n).fill(0));
        for (let k = 0; k < pairs.length; k++) {
            const { i, j } = pairs[k];
            delta[i][j] = delta[j][i] = fitted[k];
        }

        // gradient update
        const grads = Array.from({ length: n }, () => Array(dims).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) if (i !== j) {
                const w = 1; // unit weights
                const diff = curd[i][j] - delta[i][j];
                for (let d = 0; d < dims; d++) {
                    grads[i][d] += w * diff * (coords[i][d] - coords[j][d]) / (curd[i][j] || 1e-6);
                }
            }
        }
        for (let i = 0; i < n; i++) for (let d = 0; d < dims; d++) coords[i][d] -= lr * grads[i][d];

        // compute stress
        let stress = 0;
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
            const diff = curd[i][j] - delta[i][j];
            stress += diff * diff;
        }

        if (verbose && (iter % 10 === 0 || iter === maxIter - 1)) console.log(`    iter ${iter + 1}/${maxIter} stress=${stress.toFixed(6)}`);

        if (prevStress < Infinity) {
            const rel = Math.abs(prevStress - stress) / (prevStress + 1e-12);
            if (rel < tol) { if (verbose) console.log('Converged (tol)'); break; }
        }
        prevStress = stress;
    }

    return normalizeCoords(coords);
}

// --- main ---
try {
    const csvPath = process.argv[2];
    const mode = (process.argv[3] || 'similarity').toLowerCase();
    if (!csvPath) { console.error('Usage: node scripts/generate_atlas_simple.js <pairwise-matrix.csv> [similarity|dissimilarity]'); process.exit(1); }
    if (!fs.existsSync(csvPath)) { console.error('CSV not found:', csvPath); process.exit(1); }

    console.log('Reading', csvPath);
    const raw = fs.readFileSync(csvPath, 'utf8');
    const { ids, mat } = parsePairwiseCSV(raw);
    const n = ids.length;

    // convert similarity -> dissimilarity if necessary
    let D = Array.from({ length: n }, () => Array(n).fill(0));
    if (mode === 'similarity') {
        let maxv = -Infinity;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (Number.isFinite(mat[i][j])) maxv = Math.max(maxv, mat[i][j]);
        if (!Number.isFinite(maxv)) maxv = 1;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) D[i][j] = maxv - mat[i][j];
    } else {
        // assume matrix already dissimilarities
        D = mat;
    }

    console.log(`Matrix loaded: ${n} items. Mode=${mode}`);
    console.log('Running non-metric NMDS...');
    const coords = nonmetricMDS(D, 2, 200, 1e-6, true);

    // Build output entries (metadata minimal)
    const entries = ids.map((id, i) => ({ id, title: '', artist: '', album: '', genre: '', producer: null, releaseType: 'Single', linkedAlbumId: '', trackId: id, x: coords[i][0], y: coords[i][1] }));

    // apply SONG_DATABASE filter
    const allowed = readSongDatabaseIds();
    let final = entries;
    if (allowed && allowed.length) {
        const before = final.length;
        final = final.filter(e => allowed.includes(e.id));
        console.log(`Filtered atlas to SONG_DATABASE ids: ${final.length}/${before} kept`);
    }

    fs.mkdirSync(path.join('src', 'data'), { recursive: true });
    fs.writeFileSync(path.join('src', 'data', 'atlas_data.json'), JSON.stringify(final, null, 2), 'utf8');
    console.log('\n✓ Atlas generated: src/data/atlas_data.json');
    console.log(`  - ${final.length} tracks positioned`);
} catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
}
