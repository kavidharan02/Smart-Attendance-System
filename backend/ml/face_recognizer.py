import os
import numpy as np
import tensorflow as tf
import cv2

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "20180402-114759", "facenet.pb")

class FaceRecognizer:
    def __init__(self):
        self.load_facenet_model()

    def load_facenet_model(self):
        """Load Facenet model from .pb file"""
        self.graph = tf.Graph()
        with self.graph.as_default():
            graph_def = tf.compat.v1.GraphDef()
            with tf.io.gfile.GFile(MODEL_PATH, "rb") as f:
                graph_def.ParseFromString(f.read())
                tf.import_graph_def(graph_def, name="")
        self.sess = tf.compat.v1.Session(graph=self.graph)

        # Inputs & outputs (check facenet repo if names differ)
        self.images_placeholder = self.graph.get_tensor_by_name("input:0")
        self.embeddings = self.graph.get_tensor_by_name("embeddings:0")
        self.phase_train_placeholder = self.graph.get_tensor_by_name("phase_train:0")

    def get_embedding(self, face_img):
        """Preprocess face & extract 128D embedding"""
        if face_img is None or face_img.size == 0:
            return None
            
        face_img = cv2.resize(face_img, (160, 160))
        face_img = face_img.astype("float32") / 255.0
        face_img = np.expand_dims(face_img, axis=0)

        feed_dict = {
            self.images_placeholder: face_img,
            self.phase_train_placeholder: False
        }
        embedding = self.sess.run(self.embeddings, feed_dict=feed_dict)
        return embedding[0]

    def compare_embeddings(self, emb1, emb2, threshold=0.8):
        """Compare two embeddings (cosine distance)"""
        dist = np.linalg.norm(emb1 - emb2)
        return dist, dist < threshold
