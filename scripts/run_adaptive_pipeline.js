#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TRIPLETS = 'data/triplets.csv';
const PAIRWISE = 'data/pairwise_weighted.csv';
const BT_OUTPUT = 'data/pairwise_bt.csv';
const ATLAS = 'src/data/atlas_data.json';

function countResponses() {
    if (!fs.existsSync(TRIPLETS)) return 0;
    return fs.readFileSync(TRIPLETS, 'utf8').split('\n').length - 2;
}

async function main() {
    console.log('\n' + '='.repeat(70));
    console.log('  ADAPTIVE ATLAS PIPELINE');
    console.log('='.repeat(70));

    const responseCount = countResponses();
    console.log(`\n  Current triplet data: ${responseCount} comparisons`);

    if (responseCount < 100) {
        console.log('\n  ⚠ Insufficient data for analysis');
        console.log('  Need at least 100 comparisons for bootstrap phase');
        console.log('\n  Run: node scripts/adaptive_triplet_quiz.js');
        console.log('='.repeat(70) + '\n');
        process.exit(0);
    }


    console.log('\n  Step 1: Running t-STE embedding (Python)...');
    try {
        execSync(`python scripts/triplet_ste.py`, { stdio: 'inherit' });
        console.log('✓ Adaptive pipeline complete. Output written to src/data/atlas_data.json');
    } catch (err) {
        console.error('Error running t-STE embedding:', err);
        process.exit(1);
    }

    console.log('\n  Step 3/4: Computing uncertainty & generating targets...');
    if (fs.existsSync('scripts/compute_uncertainty.js')) {
        execSync(`node scripts/compute_uncertainty.js`, { stdio: 'inherit' });
    } else {
        console.log('  (compute_uncertainty.js not found - skipping uncertainty step)');
    }

    console.log('\n  Step 4/4: Summary');
    console.log('  ' + '-'.repeat(66));

    const targetsPath = 'data/target_pairs.json';
    if (fs.existsSync(targetsPath)) {
        const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
        console.log(`  Target pairs generated: ${targets.targetPairs ? targets.targetPairs.length : 0}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('  ✓ PIPELINE COMPLETE');
    console.log('='.repeat(70));
    console.log(`\n  Atlas: src/data/atlas_data.json`);
    console.log('  Target pairs: data/target_pairs.json');
    console.log('\n  Next: Run adaptive quiz for refinement');
    console.log('    node scripts/adaptive_triplet_quiz.js');
    console.log('\n' + '='.repeat(70) + '\n');
}

main().catch(err => { console.error(err); process.exit(1); });
