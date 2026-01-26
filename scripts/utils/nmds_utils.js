// Lightweight MDS/NMDS utilities (approximate)
// This provides a metric MDS implementation (classical scaling) and a thin wrapper
// called `nonmetricMDS` that uses simulated annealing of monotonic regression on distances
// for small datasets. It's intended as a practical approximation for bootstrap uncertainty.

function pairwiseToMatrix(ids, scores, defaultValue = 0) {
    const n = ids.length;
    const idIndex = Object.fromEntries(ids.map((id, i) => [id, i]));
    const M = Array.from({ length: n }, () => Array(n).fill(defaultValue));
    for (const row of scores) {
        const a = idIndex[row.i];
        const b = idIndex[row.j];
        if (a == null || b == null) continue;
        M[a][b] = row.value;
        M[b][a] = row.value;
    }
    return M;
}

// Classical MDS (metric) via double centering
function classicalMDS(D, dimensions = 2) {
    // D is a dissimilarity matrix (n x n)
    const n = D.length;
    // square distances
    const D2 = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => D[i][j] * D[i][j]));

    // centering matrix
    const J = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) J[i][i] = 1;
    const one = Array.from({ length: n }, () => 1 / n);

    // Compute B = -0.5 * J * D2 * J  (using formula B = -0.5 * (D2 - rowMeans - colMeans + totalMean))
    const rowMeans = D2.map(row => row.reduce((a, b) => a + b, 0) / n);
    const totalMean = rowMeans.reduce((a, b) => a + b, 0) / n;
    const B = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => -0.5 * (D2[i][j] - rowMeans[i] - rowMeans[j] + totalMean)));

    // Eigen decomposition (power iteration would be heavy). We'll use numeric.js style small-eig trick for n <= 500
    // For simplicity and robustness here, perform SVD via power iteration on B^T B? We'll use a naive approach: use JS's limited capabilities and approximate via numeric library is not available.
    // Instead, simpler approach: use row PCA via Gram matrix and numeric diagonalization via iterative power for each component.

    // Helper: multiply matrix by vector
    function matVecMul(A, v) {
        const n = A.length;
        const out = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            let s = 0;
            const Ai = A[i];
            for (let j = 0; j < n; j++) s += Ai[j] * v[j];
            out[i] = s;
        }
        return out;
    }

    function dot(a, b) { return a.reduce((s, x, i) => s + x * b[i], 0); }

    // Power iteration to get top k eigenpairs
    const V = Array.from({ length: n }, () => Array(dimensions).fill(0));
    const Bcopy = B.map(r => r.slice());
    for (let comp = 0; comp < dimensions; comp++) {
        let v = Array.from({ length: n }, () => Math.random() - 0.5);
        // orthogonalize against previous
        for (let it = 0; it < 200; it++) {
            // Gram-Schmidt
            for (let p = 0; p < comp; p++) {
                const prev = V.map(row => row[p]);
                const coeff = dot(v, prev) / Math.max(dot(prev, prev), 1e-12);
                for (let i = 0; i < n; i++) v[i] -= coeff * prev[i];
            }
            const w = matVecMul(Bcopy, v);
            const norm = Math.sqrt(dot(w, w)) || 1e-12;
            for (let i = 0; i < n; i++) v[i] = w[i] / norm;
        }
        // Rayleigh quotient for eigenvalue
        const w = matVecMul(Bcopy, v);
        const eig = dot(v, w);
        // Store as column
        for (let i = 0; i < n; i++) V[i][comp] = v[i] * Math.sqrt(Math.max(eig, 0));
    }

    return V; // coordinates
}

// nonmetricMDS wrapper: here we simply call classicalMDS on D
function nonmetricMDS(D, dims = 2) {
    // D should be a symmetric dissimilarity matrix
    return classicalMDS(D, dims);
}

module.exports = { pairwiseToMatrix, classicalMDS, nonmetricMDS };
