import torch
import torch.nn as nn
from torchvision import models
import os

# 1. EEG Model Export
print("Starting EEG Model Export...")
from main import EEG_CNN_LSTM_Attention
eeg_model = EEG_CNN_LSTM_Attention(num_classes=5)
eeg_weights_path = "neuro_chatbot_model(eeg)/dataset/best_eeg_model.pth"
if not os.path.exists(eeg_weights_path):
    eeg_weights_path = "best_eeg_model.pth"

eeg_model.load_state_dict(torch.load(eeg_weights_path, map_location="cpu"))
eeg_model.eval()

dummy_eeg_input = torch.randn(1, 1, 178)
torch.onnx.export(
    eeg_model,
    dummy_eeg_input,
    "best_eeg_model.onnx",
    export_params=True,
    opset_version=13,
    do_constant_folding=True,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
)
print("EEG model successfully exported to best_eeg_model.onnx!")

# 2. Alzheimer's Model Export
print("Starting Alzheimer Model Export...")
alz_model = models.resnet18(weights=None)
alz_model.fc = nn.Linear(alz_model.fc.in_features, 4)
alz_weights_path = "best_alzheimer_model.pth"

try:
    alz_model.load_state_dict(torch.load(alz_weights_path, map_location="cpu", weights_only=True))
except Exception:
    alz_model.load_state_dict(torch.load(alz_weights_path, map_location="cpu"))
alz_model.eval()

dummy_alz_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    alz_model,
    dummy_alz_input,
    "best_alzheimer_model.onnx",
    export_params=True,
    opset_version=13,
    do_constant_folding=True,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
)
print("Alzheimer model successfully exported to best_alzheimer_model.onnx!")
