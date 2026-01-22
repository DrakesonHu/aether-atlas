import pandas as pd
import json
import numpy as np
from sklearn.manifold import MDS
from sklearn.metrics import euclidean_distances
from sklearn.preprocessing import MinMaxScaler
import os

# CONFIGURATION
INPUT_FILE = os.path.join('data', 'rankings.csv')
OUTPUT_FILE = os.path.join('src', 'data', 'atlas_data.json')

def generate_atlas():
    # 1. Load Data
    try:
        df = pd.read_csv(INPUT_FILE)
    except FileNotFoundError:
        print(f"Error: Could not find {INPUT_FILE}. Run this from the project root.")
        return

    # 2. Prepare Features
    metadata_cols = ['id', 'title', 'artist', 'album', 'genre', 'producer', 'releaseType', 'linkedAlbumId', 'trackId']
    feature_cols = [c for c in df.columns if c not in metadata_cols]
    
    # Fill missing values with mean
    features = df[feature_cols].fillna(df[feature_cols].mean())
    
    print(f"Generating Atlas from {len(df)} tracks...")

    # 3. Compute Dissimilarity (Euclidean)
    dissimilarity_matrix = euclidean_distances(features)

    # 4. Run NMDS
    nmds = MDS(
        n_components=2, 
        metric=False, 
        max_iter=3000, 
        eps=1e-9, 
        random_state=42, 
        dissimilarity="precomputed", 
        n_jobs=-1
    )
    coords = nmds.fit_transform(dissimilarity_matrix)

    # 5. Normalize to 0-100 for CSS
    scaler = MinMaxScaler(feature_range=(5, 95))
    coords_scaled = scaler.fit_transform(coords)

    # 6. Merge & Export
    output_data = []
    for idx, row in df.iterrows():
        song_entry = {
            "id": str(row['id']),
            "title": row['title'],
            "artist": row['artist'],
            "album": row['album'],
            "genre": row['genre'],
            "producer": row.get('producer', None) if pd.notna(row.get('producer')) else None,
            "releaseType": row.get('releaseType', 'Single'),
            "linkedAlbumId": row.get('linkedAlbumId', ''),
            "trackId": row.get('trackId', ''),
            "x": round(coords_scaled[idx][0], 2),
            "y": round(coords_scaled[idx][1], 2)
        }
        output_data.append(song_entry)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"Success! Data saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_atlas()