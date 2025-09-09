# backend/ml/main.py

import cv2
from face_detector import FaceDetector
from face_recognizer import FaceRecognizer
import torch
import pandas as pd
from datetime import datetime

# 1️⃣ Initialize
detector = FaceDetector(min_detection_confidence=0.6)
# Example: pre-load some embeddings (replace with your actual known faces)
known_embeddings = {}  # {'Alice': tensor_embedding, 'Bob': tensor_embedding}
recognizer = FaceRecognizer(known_embeddings=known_embeddings)

# 2️⃣ Attendance CSV
attendance_file = "attendance.csv"
try:
    df = pd.read_csv(attendance_file)
except FileNotFoundError:
    df = pd.DataFrame(columns=["Name", "Time"])

# 3️⃣ Start webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Detect faces
    bboxes = detector.detect_faces(frame)
    
    for (x1, y1, x2, y2) in bboxes:
        face_img = frame[y1:y2, x1:x2]
        name = recognizer.recognize(face_img)

        # Draw rectangle and name
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
        cv2.putText(frame, name, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

        # Log attendance
        if name != "Unknown" and name not in df["Name"].values:
            df = pd.concat([df, pd.DataFrame([[name, datetime.now().strftime("%H:%M:%S")]], columns=df.columns)], ignore_index=True)
            df.to_csv(attendance_file, index=False)

    cv2.imshow("Attendance", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
