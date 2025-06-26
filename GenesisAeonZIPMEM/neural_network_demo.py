import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler


def train_iris_mlp(random_state: int = 245):
    """Train a small MLP on the iris dataset and return accuracy."""
    data = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=random_state
    )
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    clf = MLPClassifier(hidden_layer_sizes=(4, 2), max_iter=1000, random_state=random_state)
    clf.fit(X_train, y_train)
    return clf.score(X_test, y_test)


if __name__ == "__main__":
    acc = train_iris_mlp()
    print(f"Accuracy: {acc:.2%}")
