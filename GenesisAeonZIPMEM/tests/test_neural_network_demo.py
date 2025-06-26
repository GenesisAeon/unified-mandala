from GenesisAeonZIPMEM.neural_network_demo import train_iris_mlp


def test_train_iris_mlp_accuracy():
    acc = train_iris_mlp(random_state=1)
    assert 0.7 <= acc <= 1.0
