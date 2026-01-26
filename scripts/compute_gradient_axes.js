#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Compute PCA on 2D atlas coordinates
 * Returns principal components and variance explained
 */
function computePCA(songs) {
    const n = songs.length;

    // Extract coordinates
    const coords = songs.map(s => [s.x, s.y]);

    // Compute mean
    const meanX = coords.reduce((sum, c) => sum + c[0], 0) / n;
    const meanY = coords.reduce((sum, c) => sum + c[1], 0) / n;

    console.log(`  Mean position: [${meanX.toFixed(2)}, ${meanY.toFixed(2)}]`);

    // Center the data
    const centered = coords.map(c => [c[0] - meanX, c[1] - meanY]);

    // Compute covariance matrix
    let cov_xx = 0, cov_xy = 0, cov_yy = 0;
    for (const [x, y] of centered) {
        cov_xx += x * x;
        cov_xy += x * y;
        cov_yy += y * y;
    }
    cov_xx /= n;
    cov_xy /= n;
    cov_yy /= n;

    console.log(`  Covariance matrix:`);
    console.log(`    [[${cov_xx.toFixed(2)}, ${cov_xy.toFixed(2)}],`);
    console.log(`     [${cov_xy.toFixed(2)}, ${cov_yy.toFixed(2)}]]`);

    // Compute eigenvalues and eigenvectors
    // For 2x2 matrix, analytical solution exists
    const trace = cov_xx + cov_yy;
    const det = cov_xx * cov_yy - cov_xy * cov_xy;

    const lambda1 = trace / 2 + Math.sqrt(trace * trace / 4 - det);
    const lambda2 = trace / 2 - Math.sqrt(trace * trace / 4 - det);

    // Eigenvector for lambda1 (PC1)
    let v1_x, v1_y;
    if (Math.abs(cov_xy) > 1e-10) {
        v1_x = lambda1 - cov_yy;
        v1_y = cov_xy;
    } else {
        // Degenerate case: covariance is diagonal
        if (cov_xx > cov_yy) {
            v1_x = 1;
            v1_y = 0;
        } else {
            v1_x = 0;
            v1_y = 1;
        }
    }

    // Normalize PC1
    const norm1 = Math.sqrt(v1_x * v1_x + v1_y * v1_y);
    v1_x /= norm1;
    v1_y /= norm1;

    // PC2 is orthogonal to PC1
    const v2_x = -v1_y;
    const v2_y = v1_x;

    const totalVariance = lambda1 + lambda2;
    const pc1Variance = (lambda1 / totalVariance) * 100;
    const pc2Variance = (lambda2 / totalVariance) * 100;

    console.log('\n  Principal Components:');
    console.log(`    PC1: [${v1_x.toFixed(4)}, ${v1_y.toFixed(4)}]`);
    console.log(`         Variance explained: ${pc1Variance.toFixed(1)}%`);
    console.log(`         Eigenvalue: ${lambda1.toFixed(2)}`);
    console.log(`    PC2: [${v2_x.toFixed(4)}, ${v2_y.toFixed(4)}]`);
    console.log(`         Variance explained: ${pc2Variance.toFixed(1)}%`);
    console.log(`         Eigenvalue: ${lambda2.toFixed(2)}`);

    return {
        pc1: { x: v1_x, y: v1_y, variance: lambda1, variancePercent: pc1Variance },
        pc2: { x: v2_x, y: v2_y, variance: lambda2, variancePercent: pc2Variance },
        mean: { x: meanX, y: meanY }
    };
}

/**
 * Project songs onto principal components
 */
function projectOntoPC(songs, pca) {
    return songs.map(song => {
        // Center the point
        const cx = song.x - pca.mean.x;
        const cy = song.y - pca.mean.y;

        // Project onto PC1 (dot product with PC1 vector)
        const pc1_score = cx * pca.pc1.x + cy * pca.pc1.y;

        // Project onto PC2 (dot product with PC2 vector)
        const pc2_score = cx * pca.pc2.x + cy * pca.pc2.y;

        return {
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            genre: song.genre,
            x: song.x,
            y: song.y,
            pc1_score,
            pc2_score
        };
    });
}

/**
 * Find songs at extremes of each axis for interpretation
 */
function findExtremes(songs) {
    const sortedPC1 = songs.slice().sort((a, b) => a.pc1_score - b.pc1_score);
    const sortedPC2 = songs.slice().sort((a, b) => a.pc2_score - b.pc2_score);

    console.log('\n  PC1 Axis Extremes (Interpret this axis):');
    console.log('  ' + '─'.repeat(66));
    console.log('    LOW END (negative):');
    sortedPC1.slice(0, 5).forEach((s, i) => {
        console.log(`      ${i + 1}. "${s.title}" by ${s.artist}`);
        console.log(`         Genre: ${s.genre} | Score: ${s.pc1_score.toFixed(2)}`);
    });
    console.log('\n    HIGH END (positive):');
    sortedPC1.slice(-5).reverse().forEach((s, i) => {
        console.log(`      ${i + 1}. "${s.title}" by ${s.artist}`);
        console.log(`         Genre: ${s.genre} | Score: ${s.pc1_score.toFixed(2)}`);
    });

    console.log('\n  PC2 Axis Extremes (Interpret this axis):');
    console.log('  ' + '─'.repeat(66));
    console.log('    LOW END (negative):');
    sortedPC2.slice(0, 5).forEach((s, i) => {
        console.log(`      ${i + 1}. "${s.title}" by ${s.artist}`);
        console.log(`         Genre: ${s.genre} | Score: ${s.pc2_score.toFixed(2)}`);
    });
    console.log('\n    HIGH END (positive):');
    sortedPC2.slice(-5).reverse().forEach((s, i) => {
        console.log(`      ${i + 1}. "${s.title}" by ${s.artist}`);
        console.log(`         Genre: ${s.genre} | Score: ${s.pc2_score.toFixed(2)}`);
    });

    return {
        pc1: {
            low: sortedPC1.slice(0, 5).map(s => ({ id: s.id, title: s.title, artist: s.artist, score: s.pc1_score })),
            high: sortedPC1.slice(-5).reverse().map(s => ({ id: s.id, title: s.title, artist: s.artist, score: s.pc1_score }))
        },
        pc2: {
            low: sortedPC2.slice(0, 5).map(s => ({ id: s.id, title: s.title, artist: s.artist, score: s.pc2_score })),
            high: sortedPC2.slice(-5).reverse().map(s => ({ id: s.id, title: s.title, artist: s.artist, score: s.pc2_score }))
        }
    };
}

/**
 * Normalize scores to 0-1 range for gradient rendering
 */
function normalizeScores(songs) {
    const pc1_scores = songs.map(s => s.pc1_score);
    const pc2_scores = songs.map(s => s.pc2_score);

    const pc1_min = Math.min(...pc1_scores);
    const pc1_max = Math.max(...pc1_scores);
    const pc2_min = Math.min(...pc2_scores);
    const pc2_max = Math.max(...pc2_scores);

    console.log(`\n  Score ranges:`);
    console.log(`    PC1: ${pc1_min.toFixed(2)} to ${pc1_max.toFixed(2)}`);
    console.log(`    PC2: ${pc2_min.toFixed(2)} to ${pc2_max.toFixed(2)}`);

    return songs.map(s => ({
        ...s,
        pc1_normalized: (s.pc1_score - pc1_min) / (pc1_max - pc1_min),
        pc2_normalized: (s.pc2_score - pc2_min) / (pc2_max - pc2_min)
    }));
}

/**
 * Read SONG_DATABASE from App.js
 */
function readSongDatabase() {
    const appPath = path.join('src', 'App.js');
    if (!fs.existsSync(appPath)) {
        console.error('Error: src/App.js not found');
        process.exit(1);
    }

    const txt = fs.readFileSync(appPath, 'utf8');
    const m = txt.match(/const\s+SONG_DATABASE\s*=\s*\[/);
    if (!m) {
        console.error('Error: SONG_DATABASE not found in App.js');
        process.exit(1);
    }

    const start = m.index + m[0].length;
    const tail = txt.slice(start);
    const endIndex = tail.indexOf('];');
    if (endIndex === -1) {
        console.error('Error: Could not parse SONG_DATABASE');
        process.exit(1);
    }

    const block = tail.slice(0, endIndex);
    const re = /\{\s*id\s*:\s*['\"]([^'\"]+)['\"][^}]*?title\s*:\s*['\"]([^'\"]*)['\"][^}]*?artist\s*:\s*['\"]([^'\"]*)['\"][^}]*?album\s*:\s*['\"]([^'\"]*)['\"][^}]*?genre\s*:\s*['\"]([^'\"]*)['\"][^}]*?\}/gms;

    const res = [];
    let mm;
    while ((mm = re.exec(block)) !== null) {
        res.push({
            id: mm[1],
            title: mm[2] || mm[1],
            artist: mm[3] || 'Unknown Artist',
            album: mm[4] || '',
            genre: mm[5] || ''
        });
    }
    return res;
}

/**
 * Main execution
 */
function main() {
    console.log('\n' + '='.repeat(70));
    console.log('  DATA-DRIVEN GRADIENT AXIS COMPUTATION');
    console.log('='.repeat(70));

    // Load atlas
    const atlasPath = path.join('src', 'data', 'atlas_data.json');
    if (!fs.existsSync(atlasPath)) {
        console.error('\nError: Atlas not found at', atlasPath);
        console.log('Run the atlas generation pipeline first.');
        process.exit(1);
    }

    const atlas = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
    console.log(`\nLoaded atlas with ${atlas.length} songs`);

    // Load song metadata
    const songDB = readSongDatabase();
    const songMap = new Map(songDB.map(s => [s.id, s]));

    // Merge atlas coordinates with metadata
    const songs = atlas.map(a => ({
        ...a,
        title: songMap.get(a.id)?.title || a.id,
        artist: songMap.get(a.id)?.artist || 'Unknown',
        album: songMap.get(a.id)?.album || '',
        genre: songMap.get(a.id)?.genre || ''
    }));

    // Step 1: Compute PCA
    console.log('\nStep 1: Computing Principal Component Analysis...');
    console.log('─'.repeat(70));
    const pca = computePCA(songs);

    // Step 2: Project songs onto PCs
    console.log('\nStep 2: Projecting songs onto principal components...');
    let songsWithScores = projectOntoPC(songs, pca);

    // Step 3: Find extremes for interpretation
    console.log('\nStep 3: Identifying extreme songs for axis interpretation...');
    const extremes = findExtremes(songsWithScores);

    // Step 4: Normalize scores
    console.log('\nStep 4: Normalizing scores for visualization...');
    songsWithScores = normalizeScores(songsWithScores);

    // Step 5: Save results
    const outputPath = path.join('data', 'gradient_axes.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const output = {
        metadata: {
            generated: new Date().toISOString(),
            numSongs: songs.length,
            method: 'PCA on 2D atlas coordinates'
        },
        pca: {
            pc1: pca.pc1,
            pc2: pca.pc2,
            mean: pca.mean
        },
        songs: songsWithScores,
        extremes,
        interpretations: {
            pc1: {
                name: "AXIS_1_NAME",
                lowLabel: "LOW_END_LABEL",
                highLabel: "HIGH_END_LABEL",
                description: "Manually interpret by examining the extreme songs above"
            },
            pc2: {
                name: "AXIS_2_NAME",
                lowLabel: "LOW_END_LABEL",
                highLabel: "HIGH_END_LABEL",
                description: "Manually interpret by examining the extreme songs above"
            }
        }
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

    console.log('\n' + '='.repeat(70));
    console.log('  ✓ ANALYSIS COMPLETE');
    console.log('='.repeat(70));
    console.log(`\n  Output saved to: ${outputPath}`);
    console.log('\n  NEXT STEPS:');
    console.log('  1. Review the extreme songs printed above');
    console.log('  2. Interpret what each PC axis represents');
    console.log('  3. Edit data/gradient_axes.json and fill in:');
    console.log('     - interpretations.pc1.name (e.g., "Energy")');
    console.log('     - interpretations.pc1.lowLabel (e.g., "Calm")');
    console.log('     - interpretations.pc1.highLabel (e.g., "Intense")');
    console.log('     - interpretations.pc2.name');
    console.log('     - interpretations.pc2.lowLabel');
    console.log('     - interpretations.pc2.highLabel');
    console.log('  4. Run the visualization to see data-driven gradients');
    console.log('\n' + '='.repeat(70) + '\n');
}

if (require.main === module) {
    main();
}

module.exports = { computePCA, projectOntoPC };