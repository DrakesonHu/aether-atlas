# Aether Atlas

A personal music criticism project exploring aesthetic experience through two 
systems: written phenomenological analyses and computational spatial mapping. 
Aether Atlas asks: *where does this live in the topology of aesthetic experience?*

## Core Concept

Music is treated as phenomenological objects—experiences that can be both 
described and mapped. The site combines:

1. **Literary analysis** — Music reviews that articulate the felt 
quality and meaning of songs, with click-to-expand lyric annotations. This 
initially started as a Google Doc titled "Songs/Albums", the birthplace of the 
entire project. I simply love music, I realized. So I wanted to make a blog 
acting as something between a personal music journal and a music analysis site.
No expectations, really.

2. **Spatial visualization** — Music is treated as phenomenological objects 
occupying positions in experiential space. The atlas uses ordinal similarity 
judgments (triplet comparisons) to recover a low-dimensional embedding that 
preserves the structure of subjective experience. Essentially all this is 
vibe-coded, as I do not have formal training in these data analysis tools.

## Current Status

**MVP**: Working pipeline with mock data. Real data collection and statistical 
validation in progress.

Note: the Node generator now prints NMDS iteration/stress logs during runs; 
intermediate pairwise files are produced by the pipeline (they can be cleaned up
after an update).

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm start
# Open http://localhost:3000
```

## Pipeline Overview

### 1. Data Collection
The triplet quiz presents three songs: an anchor and two options. Participants 
choose which option feels more similar to the anchor.

**Format:** `participant,anchor,optionA,optionB,chosen,timestamp`

### 2. Processing Pipeline
```bash
# Merge collected triplet CSVs
cat data/user1_triplets.csv data/user2_triplets.csv > data/all_triplets.csv

# Convert to pairwise wins
node scripts/triplets_to_pairwise.js data/all_triplets.csv data/pairwise_from_triplets.csv

# Fit Bradley-Terry model
node scripts/bradley_terry.js data/pairwise_from_triplets.csv data/pairwise_bt.csv

# Generate 2D embedding via nonmetric NMDS
node scripts/generate_atlas_simple.js data/pairwise_bt.csv similarity

# Output: src/data/atlas_data.json

Notes:
- Running `scripts/bradley_terry.js` also writes `data/bt_scores.csv` (per-item latent strengths).
- A helper `scripts/map_names_to_ids.js` exists to convert name-based CSVs to id-based pairwise inputs.
- You can also run `npm run update-atlas` which invokes the generator script (it may require an input CSV path depending on how you run it).
```

### 3. Visualization
The atlas renders songs as points in 2D space where proximity indicates 
phenomenological similarity.

## Methodological Framework

### Why Triplets?
- Pairwise rankings are sensitive to context, such as which what the subject has
been exposed to already. (i.e. in a set with apple vs. orange and apple vs. dog,
apple vs. orange is likely to get a very high similarity score. 
In apple vs. orange and apple vs. pear, apple vs. orange may get a much lower
one)
- Natural cognitive task ("which is more like X?")
- Provides ordinal information sufficient for NMDS

### Bradley-Terry Aggregation
Jointly estimates latent strength parameters (β) from choice data:
- `P(i chosen over j) = exp(β_i) / (exp(β_i) + exp(β_j))`
- Borrows strength across sparse comparisons
- Converts to symmetric dissimilarities via `|β_i - β_j|`

### Nonmetric Multidimensional Scaling
- Preserves rank-order of dissimilarities (ordinal MDS)
- Output centered and scaled to viewport

**Why this works:** Shepard-Kruskal theory—ordinal relationships suffice to 
recover geometric structure. NMDS doesn't require metric distances, only their 
ordering.

## Known Limitations

### Theoretical
- **Scalar assumption:** Bradley-Terry compresses multidimensional similarity 
into one dimension. If songs differ along independent axes, structure may be 
lost.
- **Context dependence:** Similarity judgments vary with item set, instructions,
participant state, etc.
- **Identifiability:** Embeddings unique only up to 
rotation/reflection/translation/monotone scaling. Interpret relative positions,
not absolute coordinates.

### Practical (Current MVP)
- No bootstrap validation or confidence intervals
- Minimal data collection (mock data only)
- No active sampling or adaptive trial selection

### Data Collection Requirements
- Each song needs tens of triplet appearances for stability
- Need catch trials and consistency checks for participant quality

## Planned Improvements

**Short-to-medium-term:**
- [ ] Multiple NMDS initializations with stress reporting
- [ ] Bootstrap resampling for position stability estimates
- [ ] Shepard diagrams for ordinal fit visualization
- [ ] Perform similarity ranking judgements to generate a self map!

**Long-term:**
- [ ] User-contributed judgments? (crowdsourced)
- [ ] Connection lines showing explicit relationships
- [ ] Integration with written analyses and lyric annotations?
- [ ] Extension to film/cinema mapping?

## File Structure
```
src/
  components/
    TripletQuiz.jsx          # Data collection UI
  data/
    atlas_data.json          # 2D coordinates for visualization
scripts/
  triplets_to_pairwise.js    # Aggregates triplets → pairwise wins
  map_names_to_ids.js        # Maps human names → song IDs
  bradley_terry.js           # Fits BT model
  generate_atlas_simple.js   # Runs NMDS embedding
data/
  mock_triplets.csv          # Test data
  all_triplets.csv           # Merged real data (gitignored)
  pairwise_*.csv             # Intermediate processing files
```

## Theoretical Commitments

1. **Aesthetic experience has structure** — feelings have geometry (at least 
ordinally)
2. **Phenomenological description is knowledge** — articulating felt qualities
isn't mere subjectivity
3. **Music creates scenes** — listening generates imagistic, spatial, 
narrative content
4. **Attention is a medium** — how you encounter something shapes what it is

## Design Philosophy

The visual aesthetic (film grain, neon-in-darkness, chromatic aberration) 
references Wong Kar-wai's Fallen Angels. It's one of my favorite films 
aesthetically!

## Reproducibility

- Seed RNG for deterministic results
- Document: input CSV, script versions, random seed, date
- Keep triplet data with participant consent and anonymization

## Contributing

This is currently a personal passion project. Data collection and 
methodological refinement in progress.

---

*"A map of nowhere physical"*