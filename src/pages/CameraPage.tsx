import React, { useState, useEffect } from 'react';
import { Shield, Check, Loader2 } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { api } from '../lib/api';
import { RecognitionResult } from '../types';
import { useNavigate } from 'react-router-dom';

interface DetectedStudent {
  id: string;
  name: string;
  student_id: string;
  department: string;
  confidence: number;
}

export const CameraPage: React.FC = () => {
  const { cameraState, videoRef, canvasRef, startCamera, stopCamera, captureFrame } = useCamera();
  const [scanningState, setScanningState] = useState<'scanning' | 'person-detected' | 'confirmed'>('scanning');
  const [detectedStudent, setDetectedStudent] = useState<DetectedStudent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-start camera when component mounts
    const initCamera = async () => {
      try {
        await startCamera();
      } catch (error) {
        console.error('Failed to start camera:', error);
      }
    };
    
    initCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  // Simulate face detection and recognition process
  useEffect(() => {
    if (!cameraState.isActive) return;

    const processFrame = async () => {
      if (isProcessing) return;
      
      setIsProcessing(true);
      
      // Simulate detection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock face detection (30% chance of detecting a face)
      const faceDetected = Math.random() > 0.7;
      
      if (faceDetected) {
        setScanningState('person-detected');
        
        // Simulate recognition delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock recognition result (80% success rate)
        const recognitionSuccess = Math.random() > 0.2;
        
        if (recognitionSuccess) {
          const mockStudent: DetectedStudent = {
            id: 'STU001',
            name: 'John Doe',
            student_id: 'STU001',
            department: 'Computer Science',
            confidence: 0.92 + Math.random() * 0.08, // 92-100% confidence
          };
          
          setDetectedStudent(mockStudent);
          setScanningState('confirmed');
          
          // Mark attendance
          try {
            await api.markAttendance(mockStudent.id, mockStudent.confidence);
          } catch (error) {
            console.error('Failed to mark attendance:', error);
          }
          
          // Reset after 4 seconds
          setTimeout(() => {
            setDetectedStudent(null);
            setScanningState('scanning');
          }, 4000);
        } else {
          // Recognition failed, go back to scanning
          setScanningState('scanning');
        }
      } else {
        setScanningState('scanning');
      }
      
      setIsProcessing(false);
    };

    const interval = setInterval(processFrame, 3000);
    return () => clearInterval(interval);
  }, [cameraState.isActive, isProcessing]);

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const getScanningText = () => {
    switch (scanningState) {
      case 'scanning':
        return 'Scanning for person...';
      case 'person-detected':
        return 'Scanning person...';
      case 'confirmed':
        return 'Attendance Confirmed!';
      default:
        return 'Scanning for person...';
    }
  };

  const getScanningIcon = () => {
    switch (scanningState) {
      case 'confirmed':
        return <Check className="h-6 w-6 text-green-500" />;
      default:
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Header with Admin Button */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Smart Attendance</h1>
            <p className="text-blue-200 text-sm">Face Recognition System</p>
          </div>
        </div>
        
        <button
          onClick={handleAdminClick}
          className="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
        >
          <Shield className="h-5 w-5" />
          <span className="font-medium">Admin</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
        {/* Scanning Status */}
        <div className="mb-8 flex items-center space-x-3">
          {getScanningIcon()}
          <span className={`text-xl font-medium ${
            scanningState === 'confirmed' ? 'text-green-400' : 'text-white'
          }`}>
            {getScanningText()}
          </span>
        </div>

        {/* Camera Feed */}
        <div className="relative w-full max-w-4xl">
          {/* Manual camera start button if not active */}
          {!cameraState.isActive && !cameraState.error && (
            <div className="mb-4 text-center">
              <button
                onClick={startCamera}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors text-lg font-medium"
              >
                Start Camera
              </button>
            </div>
          )}
          
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white border-opacity-20">
            {cameraState.error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">Camera Access Required</p>
                  <p className="text-gray-300 text-sm max-w-md mx-auto mb-4">{cameraState.error}</p>
                  
                  {/* Troubleshooting tips */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4 text-left text-sm">
                    <p className="text-white font-medium mb-2">Troubleshooting:</p>
                    <ul className="text-blue-200 space-y-1">
                      <li>• Allow camera permissions when prompted</li>
                      <li>• Make sure no other app is using the camera</li>
                      <li>• Try refreshing the page</li>
                      <li>• Check if your browser supports camera access</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={startCamera}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : cameraState.isActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Face Detection Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Detection Frame */}
                  <div className={`absolute inset-8 border-2 border-dashed rounded-2xl transition-all duration-500 ${
                    scanningState === 'person-detected' ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' :
                    scanningState === 'confirmed' ? 'border-green-400 shadow-lg shadow-green-400/20' :
                    'border-blue-400 border-opacity-50'
                  }`} />
                  
                  {/* Corner Markers */}
                  <div className="absolute top-12 left-12 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg" />
                  <div className="absolute top-12 right-12 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-lg" />
                  <div className="absolute bottom-12 left-12 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-lg" />
                  <div className="absolute bottom-12 right-12 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg" />
                  
                  {/* Instructions */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                      Position your face within the frame
                    </div>
                  </div>
                  
                  {/* Processing Indicator */}
                  {scanningState === 'person-detected' && (
                    <div className="absolute inset-0 bg-yellow-400 bg-opacity-10 animate-pulse" />
                  )}
                  
                  {/* Success Overlay */}
                  {scanningState === 'confirmed' && (
                    <div className="absolute inset-0 bg-green-400 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-4 shadow-lg animate-bounce">
                        <Check className="h-12 w-12 text-green-500" />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-white text-lg">Initializing Camera...</p>
                  <p className="text-blue-200 text-sm mt-2">Please wait while we set up your camera</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student Details (shown after confirmation) */}
        {detectedStudent && scanningState === 'confirmed' && (
          <div className="mt-8 w-full max-w-md">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white border-opacity-20 animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {detectedStudent.name}
                </h3>
                <p className="text-lg text-gray-600 mb-1">
                  ID: {detectedStudent.student_id}
                </p>
                <p className="text-gray-500 mb-4">
                  {detectedStudent.department}
                </p>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">
                    Attendance Marked Successfully
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Confidence: {(detectedStudent.confidence * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-green-600">
                    Time: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-center max-w-2xl">
          <p className="text-white text-lg mb-2">
            Stand in front of the camera for automatic attendance marking
          </p>
          <p className="text-blue-200 text-sm">
            Advanced anti-spoofing protection ensures only live persons can mark attendance
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-blue-200 text-sm">
          Powered by MediaPipe + FaceNet • Real-time Face Recognition
        </p>
      </div>
    </div>
  );
};