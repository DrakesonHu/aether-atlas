How to prepare `data/rankings.csv` for the NMDS generator

- File: `data/rankings.csv` (comma-separated values).
- Required header columns (order not strict, but these keys must exist):
  - `id` : short unique id for the song (e.g., `ik-1`)
  - `title` : song title
  - `artist` : artist name
  - `album` : album title
  - `genre` : genre label
  - `producer` : optional
  - `releaseType` : e.g., `Album`, `EP`, `Single`
  - `linkedAlbumId` : id used by the app to link to album pages
  - `trackId` : track id if used
- Feature columns: add numeric columns representing perceptual attributes. Typical features:
  - `texture_grit`  (0-10): how gritty/textured the sound is
  - `warmth`        (0-10): tonal warmth / analog feel
  - `dissonance`    (0-10): harmonic dissonance
  - `ethereal_factor` (0-10): reverb / dreaminess
  - `rhythmic_intensity` (0-10): how driving/complex the rhythm is
  - `melancholy`    (0-10): emotional sadness
- Each row should be one track. Feature values must be numeric (integers or floats). Missing entries will be treated as 0.
- Save encoding as UTF-8.

Using your own data:
1. Create a copy of `data/rankings_sample.csv` and rename it to `data/rankings.csv`.
2. Replace the sample rows with your real tracks, preserving the header columns.
3. Run the generator script below to create `src/data/atlas_data.json`.

Running the generator (from project root):

On Windows (PowerShell):

```powershell
# backup existing rankings (optional)
copy data\rankings.csv data\rankings.csv.bak -ErrorAction SilentlyContinue

# run generator
python scripts\generate_atlas_simple.py

# restore backup if you want
# move data\rankings.csv.bak data\rankings.csv -Force
```

On macOS / Linux:

```bash
cp data/rankings.csv data/rankings.csv.bak 2>/dev/null || true
python3 scripts/generate_atlas_simple.py
# restore if you need
# mv data/rankings.csv.bak data/rankings.csv
```

Notes:
- The generator expects a clean CSV header row as the first line (no comment lines above the header). If you include comments at the top, the script may misread the header.
- The script performs a simple classical MDS/NMDS approximation and writes `src/data/atlas_data.json`.
- For larger datasets or more robust NMDS, consider using scikit-learn's `MDS` or `manifold.MDS` with better initialization.
- Keep feature scales consistent across tracks (e.g., 0-10) for meaningful distances.
