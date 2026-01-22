#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readAppSongDatabase() {
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
    const entries = [];
    const re = /\{[^}]*?id\s*:\s*['\"]([^'\"]+)['\"][^}]*?title\s*:\s*['\"]([^'\"]*)['\"][^}]*?(?:artist\s*:\s*['\"]([^'\"]*)['\"])?[^}]*?\}/gms;
    let mm;
    while ((mm = re.exec(block)) !== null) {
        entries.push({ id: mm[1], title: mm[2] || '', artist: mm[3] || '' });
    }
    // fallback: also capture lines with `id:` only
    if (!entries.length) {
        const simple = Array.from(block.matchAll(/id\s*:\s*['\"]([^'\"]+)['\"]/g)).map(m => m[1]);
        return simple.map(id => ({ id, title: '', artist: '' }));
    }
    return entries;
}

function normalize(s) {
    return (s || '')
        .toString()
        .toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/[^a-z0-9 ]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function buildLookup(entries) {
    const byTitle = new Map();
    const byTitleArtist = new Map();
    for (const e of entries) {
        const t = normalize(e.title);
        if (t) {
            if (!byTitle.has(t)) byTitle.set(t, []);
            byTitle.get(t).push(e.id);
        }
        const ta = normalize(`${e.title} ${e.artist}`);
        if (ta) {
            if (!byTitleArtist.has(ta)) byTitleArtist.set(ta, []);
            byTitleArtist.get(ta).push(e.id);
        }
    }
    return { byTitle, byTitleArtist, entries };
}

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

function mapName(name, lookup) {
    const n = normalize(name);
    // exact title
    if (lookup.byTitle.has(n)) {
        const ids = lookup.byTitle.get(n);
        if (ids.length === 1) return { id: ids[0], note: null };
        return { id: ids[0], note: `multiple matches (${ids.join(',')})` };
    }
    // title + artist exact
    if (lookup.byTitleArtist.has(n)) {
        const ids = lookup.byTitleArtist.get(n);
        return { id: ids[0], note: ids.length > 1 ? `multiple matches (${ids.join(',')})` : null };
    }
    // substring match
    const candidates = [];
    for (const e of lookup.entries) {
        const nt = normalize(e.title + ' ' + e.artist);
        if (nt.includes(n) || n.includes(normalize(e.title))) candidates.push(e.id);
    }
    if (candidates.length === 1) return { id: candidates[0], note: `substring match` };
    if (candidates.length > 1) return { id: candidates[0], note: `ambiguous substring (${candidates.join(',')})` };
    // nothing
    return { id: null, note: 'no match' };
}

function convertFile(inPath, outPath) {
    if (!fs.existsSync(inPath)) throw new Error('Input not found: ' + inPath);
    const txt = fs.readFileSync(inPath, 'utf8');
    const lines = txt.split(/\r?\n/).filter(l => l.trim() !== '');
    const entries = readAppSongDatabase();
    const lookup = buildLookup(entries);
    const out = [];
    for (const line of lines) {
        const cols = splitCSVLine(line);
        if (cols.length < 3) {
            // just echo through
            out.push(line);
            continue;
        }
        const nameA = cols[0].trim();
        const nameB = cols[1].trim();
        const val = cols.slice(2).join(',').trim();
        const mA = mapName(nameA, lookup);
        const mB = mapName(nameB, lookup);
        if (!mA.id) console.error(`WARN: ${nameA} -> ${mA.note}`);
        if (!mB.id) console.error(`WARN: ${nameB} -> ${mB.note}`);
        const idA = mA.id || nameA;
        const idB = mB.id || nameB;
        out.push(`${idA},${idB},${val}`);
    }
    fs.writeFileSync(outPath, out.join('\n'), 'utf8');
    console.log('Wrote', outPath);
}

// --- CLI ---
const inPath = process.argv[2];
const outPath = process.argv[3] || (inPath ? inPath.replace(/\.(csv|txt)$/i, '.ids.csv') : null);
if (!inPath) {
    console.log('Usage: node scripts/map_names_to_ids.js <input.csv> [output.csv]');
    console.log('Input rows: nameA,nameB,value  (names are song titles or "title - artist")');
    process.exit(1);
}
try {
    convertFile(inPath, outPath);
} catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
}
