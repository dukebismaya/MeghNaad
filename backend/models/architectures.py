import torch
import torch.nn as nn
import torchvision.models as models

class MultiModalCycloneNet(nn.Module):
    """
    Dual-Stream Multi-Modal Fusion Network:
    - Stream 1: ResNet-18 Backbone for 2D Satellite IR Imagery (Visual stream)
    - Stream 2: MLP Encoder for Atmospheric ERA5 Vectors (mslp, wind_speed, sst, lat, lon)
    - Fusion: Feature Concatenation + Multi-Task Regression & Classification Heads
    """
    def __init__(self, num_classes=6, era5_dim=5, pretrained=True):
        super().__init__()

        # --- Stream 1: Visual CNN Encoder ---
        weights = models.ResNet18_Weights.DEFAULT if pretrained else None
        backbone = models.resnet18(weights=weights)
        self.image_encoder = nn.Sequential(*list(backbone.children())[:-1])
        img_feature_dim = backbone.fc.in_features  # 512

        # --- Stream 2: Atmospheric Physics MLP Encoder ---
        self.physics_encoder = nn.Sequential(
            nn.Linear(era5_dim, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Linear(64, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.2)
        )

        # --- Fusion & Shared Representation ---
        fused_dim = img_feature_dim + 128  # 512 + 128 = 640
        self.fusion_fc = nn.Sequential(
            nn.Linear(fused_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU()
        )

        # --- Multi-Task Prediction Heads ---
        self.regression_head = nn.Linear(128, 1)            # Normalized Wind Speed [0, 1]
        self.classification_head = nn.Linear(128, num_classes)  # IMD Category Logits

    def forward(self, img, era5_vector):
        # Image feature extraction
        img_feat = self.image_encoder(img)
        img_feat = torch.flatten(img_feat, 1)  # (Batch, 512)

        # Physics feature extraction
        phys_feat = self.physics_encoder(era5_vector)  # (Batch, 128)

        # Multimodal fusion
        fused = torch.cat([img_feat, phys_feat], dim=1)  # (Batch, 640)
        fused = self.fusion_fc(fused)

        # Outputs
        pred_wind_norm = self.regression_head(fused).squeeze(-1)
        category_logits = self.classification_head(fused)

        return pred_wind_norm, category_logits


class CycloneTrajectoryLSTM(nn.Module):
    """
    Recurrent Neural Network for 24-Hour Cyclone Track Forecasting.
    Input shape:  (Batch, Seq_Len=4, Features=4) -> [Lat, Lon, Wind, Pres]
    Output shape: (Batch, Future_Steps=4, 2)     -> [Lat, Lon] for +6h, +12h, +18h, +24h
    """
    def __init__(self, input_dim=4, hidden_dim=128, num_layers=2, future_steps=4):
        super().__init__()
        self.future_steps = future_steps
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2
        )
        self.fc = nn.Sequential(
            nn.Linear(hidden_dim, 64),
            nn.ReLU(),
            nn.Linear(64, future_steps * 2)
        )

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        last_hidden = lstm_out[:, -1, :]
        out = self.fc(last_hidden)
        return out.view(-1, self.future_steps, 2)
