# backend/ml/face_detector.py

import mediapipe as mp
import cv2

class FaceDetector:
    def __init__(self, min_detection_confidence=0.5):
        self.mp_face = mp.solutions.face_detection
        self.detector = self.mp_face.FaceDetection(
            model_selection=1, 
            min_detection_confidence=min_detection_confidence
        )

    def detect_faces(self, frame):
        """
        Detect faces in a BGR frame and return bounding boxes.
        Returns list of bounding boxes [(x1, y1, x2, y2), ...]
        """
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.detector.process(rgb_frame)

        bboxes = []
        if results.detections:
            for detection in results.detections:
                bboxC = detection.location_data.relative_bounding_box
                x1 = max(0, int(bboxC.xmin * w))
                y1 = max(0, int(bboxC.ymin * h))
                x2 = min(w, x1 + int(bboxC.width * w))
                y2 = min(h, y1 + int(bboxC.height * h))
                bboxes.append((x1, y1, x2, y2))
        return bboxes
