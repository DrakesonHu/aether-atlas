class ComparisonGraph {
    constructor() {
        this.edges = new Map();
    }

    addComparison(songA, songB) {
        const key = [songA, songB].sort().join('|||');
        this.edges.set(key, (this.edges.get(key) || 0) + 1);
    }

    getEdgeWeight(songA, songB) {
        const key = [songA, songB].sort().join('|||');
        return this.edges.get(key) || 0;
    }

    nodes() {
        const nodeSet = new Set();
        for (const key of this.edges.keys()) {
            const [a, b] = key.split('|||');
            nodeSet.add(a);
            nodeSet.add(b);
        }
        return Array.from(nodeSet);
    }
}

function buildComparisonGraph(triplets) {
    const graph = new ComparisonGraph();

    // Accept various triplet shapes: [participant, anchor, A, B] or objects
    for (const t of triplets) {
        if (Array.isArray(t)) {
            const [, anchor, optionA, optionB] = t;
            if (anchor && optionA) graph.addComparison(anchor, optionA);
            if (anchor && optionB) graph.addComparison(anchor, optionB);
            if (optionA && optionB) graph.addComparison(optionA, optionB);
        } else if (t && typeof t === 'object') {
            const anchor = t.anchor || t[1];
            const optionA = t.optionA || t[2];
            const optionB = t.optionB || t[3];
            if (anchor && optionA) graph.addComparison(anchor, optionA);
            if (anchor && optionB) graph.addComparison(anchor, optionB);
            if (optionA && optionB) graph.addComparison(optionA, optionB);
        }
    }

    return graph;
}

module.exports = { ComparisonGraph, buildComparisonGraph };
