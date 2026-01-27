import json
import numpy as np
import os

# Paths
SRC_3D_ATLAS = 'src/data/atlas_nodes_3d.json'
OUT_JSON = 'data/gradient_axes_3d.json'
PUBLIC_OUT = 'public/data/gradient_axes_3d.json'

if not os.path.exists(SRC_3D_ATLAS):
    print('3D atlas not found at', SRC_3D_ATLAS)
    raise SystemExit(1)

with open(SRC_3D_ATLAS,'r',encoding='utf8') as f:
    atlas = json.load(f)

# Build matrix
coords = np.array([[float(s.get('x',0)), float(s.get('y',0)), float(s.get('z',0))] for s in atlas])
mean = coords.mean(axis=0)
centered = coords - mean

# Covariance
cov = np.cov(centered, rowvar=False)
# Eigen decomposition
eigvals, eigvecs = np.linalg.eigh(cov)  # for symmetric matrices
# Sort descending
order = np.argsort(eigvals)[::-1]
eigvals = eigvals[order]
eigvecs = eigvecs[:,order]

total_var = eigvals.sum()
pc_info = {}
for i in range(min(3, len(eigvals))):
    vec = eigvecs[:,i]
    pc_info[f'pc{i+1}'] = {
        'x': float(vec[0]),
        'y': float(vec[1]),
        'z': float(vec[2]),
        'variance': float(eigvals[i]),
        'variancePercent': float((eigvals[i]/total_var)*100)
    }

# Project onto PCs
projected = centered.dot(eigvecs)

songs_out = []
pc1_scores = projected[:,0].tolist()
pc2_scores = projected[:,1].tolist() if projected.shape[1] > 1 else [0]*len(projected)
pc3_scores = projected[:,2].tolist() if projected.shape[1] > 2 else [0]*len(projected)

pc1_min, pc1_max = min(pc1_scores), max(pc1_scores)
pc2_min, pc2_max = min(pc2_scores), max(pc2_scores)
pc3_min, pc3_max = min(pc3_scores), max(pc3_scores)

for i, s in enumerate(atlas):
    songs_out.append({
        'id': s.get('id'),
        'title': s.get('title',''),
        'artist': s.get('artist',''),
        'album': s.get('album',''),
        'genre': s.get('genre',''),
        'x': s.get('x'),
        'y': s.get('y'),
        'z': s.get('z'),
        'pc1_score': float(pc1_scores[i]),
        'pc2_score': float(pc2_scores[i]) if len(pc2_scores)>i else 0.0,
        'pc3_score': float(pc3_scores[i]) if len(pc3_scores)>i else 0.0,
        'pc1_normalized': float((pc1_scores[i]-pc1_min)/(pc1_max-pc1_min+1e-9)),
        'pc2_normalized': float((pc2_scores[i]-pc2_min)/(pc2_max-pc2_min+1e-9)),
        'pc3_normalized': float((pc3_scores[i]-pc3_min)/(pc3_max-pc3_min+1e-9)),
    })

# Find extremes for PC1 and PC2
sorted_pc1 = sorted(songs_out, key=lambda x: x['pc1_score'])
sorted_pc2 = sorted(songs_out, key=lambda x: x['pc2_score'])
sorted_pc3 = sorted(songs_out, key=lambda x: x['pc3_score'])

extremes = {
    'pc1': {
        'low': [ { 'id': s['id'], 'title': s['title'], 'artist': s['artist'], 'score': s['pc1_score'] } for s in sorted_pc1[:5] ],
        'high': [ { 'id': s['id'], 'title': s['title'], 'artist': s['artist'], 'score': s['pc1_score'] } for s in sorted_pc1[-5:][::-1] ]
    },
    'pc2': {
        'low': [ { 'id': s['id'], 'title': s['title'], 'artist': s['artist'], 'score': s['pc2_score'] } for s in sorted_pc2[:5] ],
        'high': [ { 'id': s['id'], 'title': s['title'], 'artist': s['artist'], 'score': s['pc2_score'] } for s in sorted_pc2[-5:][::-1] ]
    },
    'pc3': {
        'low': [ { 'id': s['id'], 'title': s['title'], 'artist': s['artist'], 'score': s['pc3_score'] } for s in sorted_pc3[:5] ],
        'high': [ { 'id': s['id'], 'title': s['title'], 'artist': s['artist'], 'score': s['pc3_score'] } for s in sorted_pc3[-5:][::-1] ]
    }
}

output = {
    'metadata': {
        'generated': None,
        'numSongs': len(songs_out),
        'method': 'PCA on 3D atlas coordinates'
    },
    'pca': {
        'pc1': pc_info['pc1'],
        'pc2': pc_info['pc2'],
        'pc3': pc_info['pc3'] if 'pc3' in pc_info else None,
        'mean': { 'x': float(mean[0]), 'y': float(mean[1]), 'z': float(mean[2]) }
    },
    'songs': songs_out,
    'extremes': extremes,
    'interpretations': {
        'pc1': { 'name': 'AXIS_1_NAME', 'lowLabel': 'LOW_END_LABEL', 'highLabel': 'HIGH_END_LABEL', 'description': 'Manually interpret by examining extremes' },
        'pc2': { 'name': 'AXIS_2_NAME', 'lowLabel': 'LOW_END_LABEL', 'highLabel': 'HIGH_END_LABEL', 'description': 'Manually interpret by examining extremes' },
        'pc3': { 'name': 'AXIS_3_NAME', 'lowLabel': 'LOW_END_LABEL', 'highLabel': 'HIGH_END_LABEL', 'description': 'Manually interpret by examining extremes' }
    }
}

# Add timestamp
from datetime import datetime
output['metadata']['generated'] = datetime.utcnow().isoformat()

# Ensure output directories
os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
os.makedirs(os.path.dirname(PUBLIC_OUT), exist_ok=True)

with open(OUT_JSON,'w',encoding='utf8') as f:
    json.dump(output, f, indent=2)

with open(PUBLIC_OUT,'w',encoding='utf8') as f:
    json.dump(output, f, indent=2)

print('Wrote 3D gradient axes to', OUT_JSON, 'and', PUBLIC_OUT)
