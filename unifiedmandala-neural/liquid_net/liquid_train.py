import torch
from torch import nn, optim
from liquid_time_constant_network import LTC

X = torch.randn(16, 100, 32)
Y = torch.randint(0, 3, (16,))

model = LTC(input_size=32, hidden_size=64, output_size=3)
optimizer = optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(5):
    for i in range(X.size(0)):
        pred = model(X[i])
        loss = loss_fn(pred, Y[i].unsqueeze(0))
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch} Loss: {loss.item()}")
