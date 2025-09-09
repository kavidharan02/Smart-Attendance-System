import cv2
from face_detector import FaceDetector
from face_recognizer import FaceRecognizer
    

def main():
    detector = FaceDetector()
    recognizer = FaceRecognizer()

    # Store reference embeddings (you can extend this with a database)
    known_embeddings = {}
    
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        faces = detector.detect_faces(frame)
        
        # Debug: show face count
        cv2.putText(frame, f"Faces: {len(faces)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        for (x, y, w, h) in faces:
            face_img = frame[y:y+h, x:x+w]

            # Extract embedding
            emb = recognizer.get_embedding(face_img)
            
            if emb is None:
                continue  # Skip if no valid face

            # Simple demo: check against known embeddings
            identity = "Unknown"
            for name, ref_emb in known_embeddings.items():
                dist, match = recognizer.compare_embeddings(emb, ref_emb)
                if match:
                    identity = name
                    break

            # Draw box & name
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, identity, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

        cv2.imshow("Face Recognition", frame)
        key = cv2.waitKey(1)

        # Press "s" to save a face embedding as known
        if key == ord("s") and faces:
            x, y, w, h = faces[0]
            face_img = frame[y:y+h, x:x+w]
            emb = recognizer.get_embedding(face_img)
            if emb is not None:
                known_embeddings["User1"] = emb
                print("Saved embedding for User1")
            else:
                print("No valid face detected to save")

        if key == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
