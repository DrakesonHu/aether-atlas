# Aether Atlas

A personal music criticism project. Written phenomenological analyses paired 
with computational spatial mapping. 

*Where does this live in the topology of aesthetic experience?*

---

## Core Concept

Music treated as phenomenological objects—experiences that can be both 
described and mapped.

This started as a Google Doc titled "Songs/Albums." I simply love music. 
So I wanted to make something between a personal music journal and 
an analysis site. No expectations, really.

The **reviews** articulate the felt quality of songs, with click-to-expand 
lyric annotations. Some are about albums, some about individual songs. The 
unit is whatever feels true to how I actually experience the music.

The **atlas** is a 2D map built from my own similarity judgments. Songs that 
feel experientially close sit near each other, regardless of genre or sonic 
features. A personal geography of listening.

---

## The Map

Triplet comparisons ("which of these two is more like this anchor?") fed into 
a Bradley-Terry model, then nonmetric MDS to get 2D coordinates.

Vibe-coded with AI assistance. I understand the concepts but not the 
implementation deeply. The map is meant to be explored.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **3D:** Three.js / React Three Fiber
- **Analytics:** Google Analytics 4
- **Fonts:** Cormorant Garamond (serif)

---

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_GA_IN_DEV=false
```

---

## Project Structure

```
app/
├── layout.js          # Root layout with metadata
├── page.js            # Home page
├── globals.css        # Tailwind + custom styles
├── icon.jpg           # Favicon
├── album/[albumId]/   # Album pages
├── track/[trackId]/   # Track analysis pages
├── atlas/             # Interactive atlas visualization
└── about/             # About page

components/            # Reusable React components
lib/                   # Data, utils, analytics
public/                # Static assets
```

---

## Visual Aesthetic

Film grain, neon-in-darkness, chromatic aberration. Wong Kar-wai's *Fallen 
Angels*.

---

## Status

Work in progress.

---

*"A map of nowhere physical"*

---

## Roadmap/Future Plans (tentative, likely to change)

### Current State

**Atlas:** ~40 songs, 270 personal triplet comparisons, Bradley-Terry + NMDS pipeline, interactive 2D visualization

**Content:** Phenomenological music criticism with lyric analysis

**Infrastructure:** React app, custom statistical implementations, Vercel deployment

---

### Immediate plans:
 - revamp landing page for clarity and aethetics
 - create a logo/site icon
 - develop PCA gradient feature (may pull feature until developed)

### Phase 1: Analytics & Monetization (Weeks 1-2)

**Validate audience interest before building complex features**

- Google Analytics + GDPR cookie consent
- Ko-fi donation button
- Affiliate links (Bandcamp, Spotify, Amazon)
- Traffic analysis

---

### Phase 2: Authentication & Public Comparisons (Weeks 2-4)

**Enable crowdsourced dataset with user tracking**

- Firebase Authentication (Google Sign-In + email/password)
- User profiles and comparison tracking
- Public triplet quiz (login required)
- Cloud database for comparison storage
- Basic contributor stats display

**Why login-required:** Dataset integrity, individual consistency tracking, spam prevention

---

### Phase 3: Leaderboard & Gamification (Weeks 4-6)

**Incentivize quality contributions**

- Contributor rankings (total comparisons, consistency score, recent activity)
- Badge system (milestones, consistency, impact)
- Personal statistics dashboard
- Comparison quality metrics (transitivity scoring)
- Achievement unlocks

---

### Phase 4: Personal Atlases (Weeks 6-10)

**Generate individual perceptual maps**

- Per-user atlas generation (50+ comparisons minimum)
- Toggle: My Atlas / Global Atlas / User X's Atlas
- Deviation visualization (personal vs. consensus)
- Inter-personal similarity analysis
- Agreement/disagreement metrics

**Research value:** Map variation in aesthetic perception across individuals

---

### Phase 5: Data Quality & Advanced Features (Weeks 10-12)

**Refine dataset and expand capabilities**

- Weighted consensus (by user consistency)
- Spam detection (timing, patterns, test questions)
- Adaptive sampling (target uncertain pairs)
- Manual review tools for flagged data

---

### Phase 6: Enhanced Visualization (Future)

- PCA gradient overlays with data-driven axes
- Dimension exploration tools

---

## Data & Privacy

**User accounts required for participation** to ensure dataset quality and enable personalization.

**Privacy compliance:**
- GDPR-compliant data handling
- Full data export on request
- Account deletion removes all user comparisons
- Aggregate statistics may be displayed publicly
- No personal information shared without consent

**Data usage:** Comparison judgments used solely for atlas generation and research on perceptual similarity.

---

## Contributing

**Once live:** Sign in and contribute triplet comparisons. 50+ comparisons unlocks your personal atlas.

---

## Research Considerations

**Interpersonal Deviation:** Different listeners organize music differently. Personal atlases reveal individual perceptual structures; global atlas aggregates consensus while preserving variation metrics.

**Spam Prevention:** Login-required participation, timing analysis, transitivity scoring, test questions, and manual review. Low-quality data filtered via consistency weighting.

**Song Knowledge:** Comparisons reflect both sonic similarity and cultural familiarity. Users unfamiliar with songs may judge differently than regular listeners. Dataset tracks exposure/confidence alongside similarity. In addition, we can't really test users on songs they don't know

---

---

## Tech Stack Evolution

**Current:** Next.js 14 (App Router), Tailwind, Three.js / R3F, GA4

**Adding:** Firebase (auth + database), Cloud Functions (atlas regeneration)

**Future:** Advanced sampling algorithms, personal atlases

---

## Philosophy

Exploring collective intelligence in aesthetic perception. Individual judgments aggregate into shared understanding while preserving personal variation. The atlas maps both consensus and divergence in how we experience music.

---