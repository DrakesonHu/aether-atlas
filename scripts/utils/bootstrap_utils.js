function bootstrapResample(array) {
    const n = array.length;
    const sample = [];
    for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * n);
        sample.push(array[idx]);
    }
    return sample;
}

function variance(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map(x => Math.pow(x - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
}

function procrustesAlign(coords, reference) {
    if (!coords || !reference) return coords;
    const n = coords.length;
    const dims = coords[0].length;
    const cCoords = Array(dims).fill(0);
    const cRef = Array(dims).fill(0);
    for (let i = 0; i < n; i++) {
        for (let d = 0; d < dims; d++) {
            cCoords[d] += coords[i][d];
            cRef[d] += reference[i][d];
        }
    }
    for (let d = 0; d < dims; d++) { cCoords[d] /= n; cRef[d] /= n; }
    const aligned = coords.map((point) => point.map((v, d) => v - cCoords[d] + cRef[d]));
    return aligned;
}

module.exports = { bootstrapResample, variance, procrustesAlign };
