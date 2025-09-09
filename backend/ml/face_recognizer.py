# backend/ml/face_recognizer.py

import torch
import torch.nn.functional as F
from facenet_pytorch import InceptionResnetV1
import cv2

class FaceRecognizer:
    def __init__(self, known_embeddings=None, device=None):
        self.device = device or torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.resnet = InceptionResnetV1(pretrained='vggface2').eval().to(self.device)
        # Normalize and store known embeddings as 1D CPU tensors
        self.known_embeddings = {}
        if known_embeddings:
            for name, emb in known_embeddings.items():
                # Expect any of: (512,), (1, 512), (N, 512). Take 1 vector and flatten
                if emb.dim() > 1:
                    emb = emb[0]
                self.known_embeddings[name] = emb.detach().view(-1).cpu()

    def compute_embedding(self, face_img):
        # face_img: numpy array in BGR (as read by OpenCV)
        face_img = cv2.resize(face_img, (160, 160))
        face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
        face_img = torch.from_numpy(face_img).float()  # HWC, float32
        face_img = face_img.permute(2, 0, 1).unsqueeze(0)  # NCHW
        # Normalize to [-1, 1]
        face_img = (face_img / 255.0 - 0.5) / 0.5
        face_img = face_img.to(self.device)
        with torch.no_grad():
            embedding_batch = self.resnet(face_img)  # (1, 512)
        # Return 1D CPU tensor for consistent cosine similarity
        return embedding_batch.squeeze(0).cpu()

    def recognize(self, face_img, threshold=0.8):
        if not self.known_embeddings:
            return "Unknown"
        embedding_vec = self.compute_embedding(face_img).view(-1)  # (512,)
        best_name = "Unknown"
        best_sim = -1.0
        for name, db_vec in self.known_embeddings.items():
            # Ensure shapes are 1D and on CPU
            db_vec = db_vec.view(-1).cpu()
            sim = F.cosine_similarity(embedding_vec, db_vec, dim=0).item()
            if sim > best_sim:
                best_sim = sim
                best_name = name
        return best_name if best_sim >= threshold else "Unknown"
