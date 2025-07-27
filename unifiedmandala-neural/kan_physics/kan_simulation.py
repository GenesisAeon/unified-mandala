from kan_network import KANLayer
import torch

torch.manual_seed(0)
data = torch.rand(1, 10)
model = torch.nn.Sequential(
    KANLayer(10, 64),
    torch.nn.ReLU(),
    KANLayer(64, 1)
)
output = model(data)
print("KAN Output:", output)
