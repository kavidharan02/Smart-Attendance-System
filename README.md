# Smart Attendance System

A comprehensive face recognition-based attendance system with real-time processing, anti-spoofing protection, and advanced analytics.

## Features

- **Real-time Face Recognition**: MediaPipe + FaceNet integration for accurate face detection and recognition
- **Anti-spoofing Protection**: Liveness detection to prevent photo/video spoofing
- **Student Management**: Complete CRUD operations with photo upload and face embedding storage
- **Live Attendance Marking**: Automatic attendance marking with visual feedback
- **Analytics Dashboard**: Comprehensive statistics and attendance trends
- **Report Generation**: CSV/PDF export with customizable filters
- **Responsive Design**: Desktop-first design that works seamlessly on mobile devices

## Tech Stack

### Frontend
- React.js 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for responsive styling
- Chart.js for data visualization
- Local storage for demo data persistence

### Backend (Flask API Structure)
- Flask with Python 3.8+
- MediaPipe for face detection
- FaceNet for face recognition and embeddings
- OpenCV for image processing
- SQLAlchemy for database ORM

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   # No environment setup needed for demo
   # In production, configure your Flask backend URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Flask Backend Setup

The frontend is designed to work with a Flask backend. Here's the recommended structure:

```
backend/
├── app.py
├── models/
│   ├── student.py
│   ├── attendance.py
│   └── face_recognition.py
├── routes/
│   ├── auth.py
│   ├── students.py
│   ├── attendance.py
│   └── face_recognition.py
├── utils/
│   ├── face_detector.py
│   ├── face_recognizer.py
│   └── liveness_detector.py
└── requirements.txt
```

### Key Flask Dependencies
```
Flask==2.3.3
Flask-CORS==4.0.0
mediapipe==0.10.7
tensorflow==2.13.0
opencv-python==4.8.0
numpy==1.24.3
Pillow==10.0.0
python-dotenv==1.0.0
```

## Database Schema

The system is designed to work with the following database tables:

- `students`: Student profiles and face embeddings
- `attendance_records`: Daily attendance logs
- `users`: Admin user accounts

## Face Recognition Pipeline

1. **Face Detection**: MediaPipe detects faces in real-time
2. **Liveness Check**: Anti-spoofing validation
3. **Face Recognition**: FaceNet generates embeddings for matching
4. **Attendance Marking**: Automatic attendance logging with confidence scores

## Production Deployment

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Deploy Flask Backend** with proper face recognition libraries
3. **Configure Database** with proper migrations
4. **Set Environment Variables** for production

## Security Features

- Authentication system with role-based access
- Face embedding encryption
- Liveness detection for anti-spoofing
- Secure API endpoints
- HTTPS enforcement in production

## Performance Optimization

- Face recognition processing under 1 second per face
- Optimized image compression for storage
- Efficient database indexing
- Real-time camera streaming with minimal latency

## Browser Requirements

- Modern browsers with WebRTC support
- Camera access permissions
- Minimum resolution: 640x480 for face detection

## License

MIT License - see LICENSE file for details.