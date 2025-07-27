import torch
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
import json

with open('data/interactions.json') as f:
    logs = json.load(f)


def build_graph(logs):
    nodes = set()
    edges = []
    for l in logs:
        nodes.add(l['from'])
        nodes.add(l['to'])
        edges.append((l['from'], l['to']))
    nodes = sorted(nodes)
    node_map = {k: i for i, k in enumerate(nodes)}
    edge_index = torch.tensor([[node_map[f], node_map[t]] for f, t in edges]).t().contiguous()
    x = torch.randn(len(nodes), 8)
    return Data(x=x, edge_index=edge_index)


data = build_graph(logs)


nclass = data.x.size(1)

class GNN(torch.nn.Module):
    def __init__(self, in_channels, hidden, out):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden)
        self.conv2 = GCNConv(hidden, out)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index)
        return x


model = GNN(nclass, 32, 8)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
for epoch in range(50):
    model.train()
    optimizer.zero_grad()
    out = model(data.x, data.edge_index)
    loss = (out ** 2).mean()
    loss.backward()
    optimizer.step()
    if epoch % 10 == 0:
        print('Epoch', epoch, 'Loss:', loss.item())
print('GNN trainiert.')
