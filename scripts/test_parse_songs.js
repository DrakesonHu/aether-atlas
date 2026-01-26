const fs = require('fs');
const path = require('path');
const APP_PATH = path.join('src', 'App.js');
const txt = fs.readFileSync(APP_PATH, 'utf8');
const match = txt.match(/const\s+SONG_DATABASE\s*=\s*(\[[\s\S]*?\]);/m);
if (!match) {
    console.error('SONG_DATABASE not found');
    process.exit(1);
}
try {
    const arr = new Function('return ' + match[1])();
    console.log('SONG_DATABASE length ->', arr.length);
    // list last 10 ids for verification
    console.log('Last 10 ids:');
    console.log(arr.slice(-10).map(s => s.id));
} catch (err) {
    console.error('Failed to eval SONG_DATABASE:', err.message);
    process.exit(1);
}
