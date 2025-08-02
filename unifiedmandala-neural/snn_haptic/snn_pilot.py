import numpy as np
import torch
from torch import stack
from norse.torch.module.lif import LIFCell

input_signal = torch.tensor(np.random.rand(1, 100), dtype=torch.float32)

class HapticSNN(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.cell = LIFCell()

    def forward(self, x):
        mem = None
        spikes = []
        for t in range(x.size(1)):
            spk, mem = self.cell(x[:, t], mem)
            spikes.append(spk)
        return stack(spikes, dim=1)


model = HapticSNN()
spikes = model(input_signal)
print("Spikes detected:", spikes.sum().item())
