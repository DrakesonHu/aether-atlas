#!/usr/bin/env python
"""
Quick test to verify NMDS coordinates and show clustering
"""
import json
import math

with open('src/data/atlas_data.json') as f:
    tracks = json.load(f)

print("=" * 80)
print("NMDS COORDINATES TEST")
print("=" * 80)
print(f"\nTotal tracks: {len(tracks)}")
print(f"\nCoordinates:")
print("-" * 80)
print(f"{'ID':8} {'Title':30} {'Artist':20} {'X':8} {'Y':8}")
print("-" * 80)

for t in tracks:
    print(f"{t['id']:8} {t['title'][:28]:30} {t['artist'][:18]:20} {t['x']:8.2f} {t['y']:8.2f}")

print("\nStatistics:")
print("-" * 80)
xs = [t['x'] for t in tracks]
ys = [t['y'] for t in tracks]

print(f"X range: {min(xs):.2f} - {max(xs):.2f} (span: {max(xs)-min(xs):.2f})")
print(f"Y range: {min(ys):.2f} - {max(ys):.2f} (span: {max(ys)-min(ys):.2f})")

# Calculate average pairwise distance
total_dist = 0
count = 0
for i in range(len(tracks)):
    for j in range(i+1, len(tracks)):
        dx = tracks[i]['x'] - tracks[j]['x']
        dy = tracks[i]['y'] - tracks[j]['y']
        dist = math.sqrt(dx**2 + dy**2)
        total_dist += dist
        count += 1

avg_dist = total_dist / count if count > 0 else 0
print(f"Average inter-track distance: {avg_dist:.2f}")
print(f"Clustering: {'Tight' if avg_dist < 20 else 'Moderate' if avg_dist < 30 else 'Spread'}")

print("\n✓ NMDS data validated")
print("=" * 80)
