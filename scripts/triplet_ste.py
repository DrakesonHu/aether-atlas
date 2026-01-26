import pandas as pd
import numpy as np
import json
import sys


def logistic_triplet_embedding(triplets, n_items, n_dims=2, n_iter=300, verbose=True):
    rng = np.random.default_rng(42)
    init = rng.standard_normal((n_items, n_dims)) * 0.01

    try:
        from scipy.optimize import minimize
    except ImportError:
        print("scipy not available, falling back to simple SGD")
        return simple_triplet_sgd(triplets, n_items, n_dims, verbose)

    def loss_and_grad(x_flat):
        X = x_flat.reshape(n_items, n_dims)
        grads = np.zeros_like(X)
        loss = 0.0
        for (anchor, pos, neg) in triplets:
            xa = X[anchor]
            xb = X[pos]
            xc = X[neg]
            d_pos = np.sum((xa - xb) ** 2)
            d_neg = np.sum((xa - xc) ** 2)
            diff = d_pos - d_neg
            clipped = np.clip(diff, -50, 50)
            sigmoid = 1.0 / (1.0 + np.exp(-clipped))
            loss += np.log1p(np.exp(clipped))
            grads[anchor] += 2 * sigmoid * (xc - xb)
            grads[pos] += 2 * sigmoid * (xb - xa)
            grads[neg] += 2 * sigmoid * (xa - xc)
        loss /= len(triplets)
        grads /= max(1, len(triplets))
        return loss, grads.reshape(-1)

    res = minimize(
        loss_and_grad,
        init.flatten(),
        jac=True,
        method='L-BFGS-B',
        options={'maxiter': n_iter, 'disp': verbose}
    )
    if verbose:
        print('L-BFGS status:', res.message)
    return res.x.reshape(n_items, n_dims)


def simple_triplet_sgd(triplets, n_items, n_dims=2, learning_rate=0.01, n_iter=400, verbose=True):
    rng = np.random.default_rng(42)
    X = rng.standard_normal((n_items, n_dims)) * 0.01
    for it in range(1, n_iter + 1):
        rng.shuffle(triplets)
        total_loss = 0.0
        for (anchor, pos, neg) in triplets:
            xa, xb, xc = X[anchor], X[pos], X[neg]
            d_pos = np.sum((xa - xb) ** 2)
            d_neg = np.sum((xa - xc) ** 2)
            diff = d_pos - d_neg
            clipped = np.clip(diff, -50, 50)
            prob = 1.0 / (1.0 + np.exp(-clipped))
            total_loss += np.log1p(np.exp(clipped))
            coeff = np.clip(2 * (1.0 - prob), -0.2, 0.2)
            gradient = coeff * (xc - xb)
            X[anchor] += gradient
            X[pos] -= coeff * (xa - xb)
            X[neg] += coeff * (xa - xc)
        if verbose and it % 100 == 0:
            print(f"  SGD iter {it}/{n_iter} loss {total_loss / len(triplets):.4f}")
        X = np.clip(X, -5, 5)
    return X


def tste_embedding(triplets, n_items, n_dims=2, n_iter=1000):
    try:
        from tripletste import tste
        print("Using tripletste library for embedding")
        X = tste(np.array(triplets), no_dims=n_dims, n_iter=n_iter)
        return X
    except ImportError:
        return logistic_triplet_embedding(triplets, n_items, n_dims=n_dims, n_iter=n_iter)

def main():
    triplet_path = 'data/triplets.csv'
    output_path = 'src/data/atlas_data.json'
    column_names = ['participant', 'anchor', 'optionA', 'optionB', 'chosen', 'detail', 'timestamp']
    df = pd.read_csv(triplet_path, names=column_names, header=0)
    items = sorted(set(df['anchor']) | set(df['optionA']) | set(df['optionB']))
    item_to_idx = {item: i for i, item in enumerate(items)}
    idx_to_item = {i: item for item, i in item_to_idx.items()}

    triplets = []
    for _, row in df.iterrows():
        anchor = item_to_idx[row['anchor']]
        a = item_to_idx[row['optionA']]
        b = item_to_idx[row['optionB']]
        chosen = row['chosen']
        if chosen == row['optionA']:
            triplets.append([anchor, a, b])
        elif chosen == row['optionB']:
            triplets.append([anchor, b, a])
        # skip 'equal' or ambiguous

    X = tste_embedding(triplets, len(items), n_dims=2, n_iter=1000)
    # Normalize to [5,95] for both axes
    min_x, max_x = np.min(X[:,0]), np.max(X[:,0])
    min_y, max_y = np.min(X[:,1]), np.max(X[:,1])
    norm_x = 5 + 90 * (X[:,0] - min_x) / (max_x - min_x + 1e-8)
    norm_y = 5 + 90 * (X[:,1] - min_y) / (max_y - min_y + 1e-8)
    atlas = []
    for i, item in enumerate(items):
        atlas.append({
            'id': item,
            'x': float(f'{norm_x[i]:.2f}'),
            'y': float(f'{norm_y[i]:.2f}')
        })
    with open(output_path, 'w') as f:
        json.dump(atlas, f, indent=2)
    print(f"✓ t-STE embedding complete. Output written to {output_path}")

if __name__ == '__main__':
    main()
