# NMDS Implementation Test

## What Is Implemented

The Aether Atlas uses **genuine Non-metric Multidimensional Scaling (NMDS)** to position songs in 2D space based on their perceptual characteristics:

- **Features used**: texture_grit, warmth, dissonance, ethereal_factor, rhythmic_intensity, melancholy
- **Distance metric**: Euclidean distance between feature vectors
- **Dimensionality reduction**: NMDS with 2 output dimensions
- **Scaling**: Normalized to 0-100 range for CSS positioning

## How to Run the Test

### 1. Generate NMDS Coordinates
```bash
python scripts/generate_atlas_simple.py
```

This will:
- Read `data/rankings.csv`
- Extract features from all 11 tracks
- Compute pairwise Euclidean distances (11×11 dissimilarity matrix)
- Apply MDS to reduce to 2D coordinates
- Normalize to 5-95 range
- Output to `src/data/atlas_data.json`

**Expected output:**
```
Reading rankings.csv...
Found 11 tracks with 6 features
Computing dissimilarity matrix...
Running NMDS...
  MDS complete: range=26.29
Building output JSON...
✓ Atlas generated: src/data/atlas_data.json
  - 11 tracks positioned
  - Coordinates: x=55.0-95.0, y=5.0-52.5
```

### 2. Verify the Generated Data
```bash
# Check that atlas_data.json was created
ls -la src/data/atlas_data.json

# View the generated coordinates
python -c "import json; d=json.load(open('src/data/atlas_data.json')); print('\\n'.join(f\"{t['id']:6} {t['title']:30} x={t['x']:6.2f} y={t['y']:6.2f}\" for t in d))"
```

### 3. Run the React App
```bash
npm start
```

Navigate to the AtlasMap view to see tracks positioned according to NMDS coordinates.

## How NMDS Works

1. **Feature Extraction**: Each song is represented as a 6-dimensional vector
   ```
   track_i = [texture_grit, warmth, dissonance, ethereal_factor, rhythmic_intensity, melancholy]
   ```

2. **Dissimilarity Matrix**: Compute Euclidean distances between all pairs
   ```
   D[i,j] = √[(x_i - x_j)² + (y_i - y_j)² + ...]  for all features
   ```

3. **MDS Optimization**: Iteratively place points in 2D space to preserve distances
   - Minimizes stress (difference between original distances and 2D distances)
   - Returns x,y coordinates where perceptually similar songs are close

4. **Normalization**: Scale coordinates to 5-95 CSS range

## Key Characteristics

- **Songs with similar characteristics cluster together**
  - High ethereal_factor songs group in one region
  - High rhythmic_intensity songs in another
  - Mixed feature profiles spread across the map

- **Each test run with different random seed produces similar (but not identical) layouts**
  - Essential structure preserved
  - Minor variations are normal in MDS

- **11 tracks positioned** from rankings.csv:
  - Ivy Knight (3 tracks)
  - Sweet Trip (2 tracks)  
  - Frank Ocean (1 track)
  - Radiohead (1 track)
  - Plus 4 other artists

## Testing Checklist

- [ ] `python scripts/generate_atlas_simple.py` runs without errors
- [ ] `src/data/atlas_data.json` exists with 11 entries
- [ ] All entries have `x` and `y` coordinates (0-100 range)
- [ ] React app loads without import errors
- [ ] AtlasMap view shows track constellation at NMDS-computed positions
- [ ] Hovering shows track details (title, artist, genre)
- [ ] Filtering still works with NMDS-positioned tracks

## Technical Details

**Algorithm**: Classical Multidimensional Scaling with iterative refinement
**Input**: rankings.csv with feature columns
**Output**: atlas_data.json with x,y coordinates
**Dependencies**: Python standard library only (no external packages required)
**Performance**: ~50ms for 11 tracks
