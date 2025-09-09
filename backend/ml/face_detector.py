import cv2
import mediapipe as mp

class FaceDetector:
    def __init__(self):
        self.mp_face_detection = mp.solutions.face_detection
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=1,  # Use full range model for better detection
            min_detection_confidence=0.3  # Lower threshold to catch more faces
        )

    def detect_faces(self, frame):
        """Detect faces and return bounding boxes (x, y, w, h)."""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_detection.process(rgb_frame)

        faces = []
        if results.detections:
            h, w, _ = frame.shape
            for detection in results.detections:
                bboxC = detection.location_data.relative_bounding_box
                # Convert relative coordinates to absolute
                x = int(bboxC.xmin * w)
                y = int(bboxC.ymin * h)
                w_box = int(bboxC.width * w)
                h_box = int(bboxC.height * h)
                
                # Ensure coordinates are within frame bounds
                x = max(0, x)
                y = max(0, y)
                w_box = min(w_box, w - x)
                h_box = min(h_box, h - y)
                
                # Only add if face is large enough
                if w_box > 20 and h_box > 20:
                    faces.append((x, y, w_box, h_box))
                    
        return faces