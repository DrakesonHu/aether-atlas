#!/usr/bin/env python
"""
Simplified NMDS atlas generator using basic numpy/scipy
Avoids pandas compatibility issues
"""
import json
import csv
import math
import time
import sys
from collections import OrderedDict
import re

def euclidean_distance(a, b):
    """Calculate euclidean distance between two points"""
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def nmds_simple(dissimilarities, n_dims=2, max_iter=300, verbose=True):
    """
    Simple MDS implementation (classical scaling)
    dissimilarities: NxN distance matrix (symmetric)
    Returns: N x n_dims coordinates scaled to 0-100
    """
    import random
    random.seed(42)
    n = len(dissimilarities)

    if verbose:
        print(f"  MDS: items={n}, dims={n_dims}, max_iter={max_iter}")
        t0 = time.time()

    # Classical MDS approach
    # Center the distance matrix
    D_sq = [[d**2 for d in row] for row in dissimilarities]
    
    # Row and grand means
    row_mean = []
    for i in range(n):
        row_mean.append(sum(D_sq[i]) / n)
    
    grand_mean = sum(sum(row) for row in D_sq) / (n * n)
    
    # Gram matrix
    B = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            B[i][j] = -0.5 * (D_sq[i][j] - row_mean[i] - row_mean[j] + grand_mean)
    
    # Eigenvalue decomposition (simplified - just use SVD approximation)
    # For simplicity, initialize randomly and refine
    coords = [[random.uniform(-50, 50) for _ in range(n_dims)] for _ in range(n)]
    
    # Few iterations of refinement
    learning_rate = 0.1
    for iteration in range(max_iter):
        # Calculate current distance matrix
        current_dists = [[0.0] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                d = 0
                for k in range(n_dims):
                    d += (coords[i][k] - coords[j][k]) ** 2
                current_dists[i][j] = math.sqrt(d) if d > 0 else 0.001
        
        # Update based on Procrustes
        for i in range(n):
            for dim in range(n_dims):
                grad = 0
                for j in range(n):
                    if i != j and current_dists[i][j] > 0.001:
                        grad += (current_dists[i][j] - dissimilarities[i][j]) * (coords[i][dim] - coords[j][dim]) / current_dists[i][j]
                coords[i][dim] -= learning_rate * grad

        # Optionally print progress / stress every 10 iterations
        if verbose and (iteration % 10 == 0 or iteration == max_iter - 1):
            stress = 0.0
            for i in range(n):
                for j in range(i + 1, n):
                    diff = current_dists[i][j] - dissimilarities[i][j]
                    stress += diff * diff
            print(f"    iter {iteration+1}/{max_iter} stress={stress:.4f}")

    if verbose:
        print(f"  MDS finished in {time.time() - t0:.2f}s")
    
    # Scale to 5-95 range
    all_vals = []
    for dim in range(n_dims):
        all_vals.extend([coords[i][dim] for i in range(n)])
    
    min_val = min(all_vals)
    max_val = max(all_vals)
    range_val = max_val - min_val
    if range_val == 0:
        range_val = 1
    
    normalized = []
    for i in range(n):
        row = []
        for d in range(n_dims):
            val = 5 + (coords[i][d] - min_val) / range_val * 90
            row.append(val)
        normalized.append(row)
    
    print(f"  MDS complete: range={range_val:.2f}")
    return normalized

def main():
    print("Reading rankings.csv...")
    
    # Read CSV
    songs = []
    feature_names = []
    
    with open('data/rankings.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            songs.append(row)
            if idx == 0:
                # Get feature column names (exclude metadata)
                metadata = ['id', 'title', 'artist', 'album', 'genre', 'producer', 'releaseType', 'linkedAlbumId', 'trackId']
                feature_names = [k for k in row.keys() if k not in metadata]
    
    print(f"Found {len(songs)} tracks with {len(feature_names)} features")
    print(f"Features: {feature_names}")
    
    # Extract features as floats
    features = []
    for song in songs:
        feature_vec = []
        for feat in feature_names:
            try:
                val = float(song.get(feat, 0))
            except (ValueError, TypeError):
                val = 0
            feature_vec.append(val)
        features.append(feature_vec)
    
    # Compute dissimilarity matrix (Euclidean distances)
    print("Computing dissimilarity matrix...")
    n = len(features)
    dissimilarities = [[0.0] * n for _ in range(n)]
    total_pairs = n * (n - 1) // 2
    pair_count = 0
    next_report = max(1, total_pairs // 10)

    for i in range(n):
        for j in range(i + 1, n):
            dist = euclidean_distance(features[i], features[j])
            dissimilarities[i][j] = dist
            dissimilarities[j][i] = dist
            pair_count += 1
            if pair_count % next_report == 0 or pair_count == total_pairs:
                pct = int(pair_count / total_pairs * 100) if total_pairs > 0 else 100
                print(f"  distances: {pair_count}/{total_pairs} pairs ({pct}%)")
    
    # Run NMDS
    print("Running NMDS (this may take a moment)...")
    coords = nmds_simple(dissimilarities, n_dims=2, max_iter=100, verbose=True)
    
    # Build output
    print("Building output JSON...")
    output = []
    
    for i, song in enumerate(songs):
        entry = OrderedDict([
            ("id", song.get('id', f'song-{i}')),
            ("title", song.get('title', '')),
            ("artist", song.get('artist', '')),
            ("album", song.get('album', '')),
            ("genre", song.get('genre', '')),
            ("producer", song.get('producer', None)),
            ("releaseType", song.get('releaseType', 'Single')),
            ("linkedAlbumId", song.get('linkedAlbumId', '')),
            ("trackId", song.get('trackId', '')),
            ("x", round(coords[i][0], 2)),
            ("y", round(coords[i][1], 2))
        ])
        output.append(entry)
    
    # Optionally filter to only include songs declared in the app's SONG_DATABASE
    def get_song_database_ids():
        app_path = 'src/App.js'
        if not os.path.exists(app_path):
            return []
        try:
            with open(app_path, 'r', encoding='utf-8') as af:
                text = af.read()
        except Exception:
            return []

        # Find the SONG_DATABASE block
        m = re.search(r"const\s+SONG_DATABASE\s*=\s*\[", text)
        if not m:
            return []
        start = m.end()
        # Naively find the closing bracket for the array
        end = text.find('];', start)
        if end == -1:
            return []
        block = text[start:end]

        # Extract id: '...' or id: "..."
        ids = re.findall(r"id\s*:\s*['\"]([^'\"]+)['\"]", block)
        return ids

    allowed_ids = get_song_database_ids()
    if allowed_ids:
        before_count = len(output)
        output = [e for e in output if e.get('id') in allowed_ids]
        print(f"Filtered atlas to SONG_DATABASE ids: {len(output)}/{before_count} kept")
    # Ensure output directory exists
    import os
    os.makedirs('src/data', exist_ok=True)
    
    # Write JSON
    with open('src/data/atlas_data.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✓ Atlas generated: src/data/atlas_data.json")
    print(f"  - {len(output)} tracks positioned")
    print(f"  - Coordinates: x={min(c[0] for c in coords):.1f}-{max(c[0] for c in coords):.1f}, y={min(c[1] for c in coords):.1f}-{max(c[1] for c in coords):.1f}")

if __name__ == '__main__':
    main()
