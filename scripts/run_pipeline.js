#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TRIPLETS = 'data/triplets.csv';
const PAIRWISE = 'data/pairwise_weighted.csv';
const BT_OUTPUT = 'data/pairwise_bt.csv';
const ATLAS = 'src/data/atlas_data.json';

console.log('\n' + '='.repeat(70));
console.log('  AETHER ATLAS — COMPLETE PIPELINE');
console.log('='.repeat(70));

// Check if triplets exist
if (!fs.existsSync(TRIPLETS)) {
    console.log('\n  Error: No triplet data found.');
    console.log('  Run: node scripts/triplet_quiz.js');
    console.log('\n' + '='.repeat(70) + '\n');
    process.exit(1);
}

console.log('\n  Step 1/4: Analyzing triplet data...');
execSync(`node scripts/analyze_triplets.js ${TRIPLETS}`, { stdio: 'inherit' });

console.log('\n  Step 2/4: Converting to pairwise (weighted)...');
execSync(`node scripts/triplets_to_pairwise_weighted.js ${TRIPLETS} ${PAIRWISE} 0.3`, { stdio: 'inherit' });

console.log('\n  Step 3/4: Running Bradley-Terry model...');
execSync(`node scripts/bradley_terry.js ${PAIRWISE} ${BT_OUTPUT}`, { stdio: 'inherit' });

console.log('\n  Step 4/4: Generating atlas coordinates...');
execSync(`node scripts/generate_atlas_simple.js ${BT_OUTPUT} similarity`, { stdio: 'inherit' });

console.log('\n' + '='.repeat(70));
console.log('  ✓ PIPELINE COMPLETE');
console.log('='.repeat(70));
console.log(`\n  Atlas file: ${ATLAS}`);
console.log('  Refresh your browser to see the updated map!\n');
console.log('='.repeat(70) + '\n');