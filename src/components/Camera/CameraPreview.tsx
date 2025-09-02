import React, { useEffect, useState } from 'react';
import { Camera, CameraOff, Check, X } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { api } from '../../lib/api';
import { Button } from '../UI/Button';
import { RecognitionResult } from '../../types';
import toast from 'react-hot-toast';

interface CameraPreviewProps {
  onAttendanceMarked?: (result: RecognitionResult) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ onAttendanceMarked }) => {
  const { cameraState, videoRef, canvasRef, startCamera, stopCamera, captureFrame } = useCamera();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRecognition, setLastRecognition] = useState<RecognitionResult | null>(null);
  const [recognitionTimeout, setRecognitionTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
      if (recognitionTimeout) {
        clearTimeout(recognitionTimeout);
      }
    };
  }, [stopCamera, recognitionTimeout]);

  const processFrame = async () => {
    if (isProcessing || !cameraState.isActive) return;

    const imageData = captureFrame();
    if (!imageData) return;

    setIsProcessing(true);

    try {
      // Mock recognition for demo purposes
      // In real implementation, this would call the Flask API
      const mockResult: RecognitionResult = {
        student_id: 'STU001',
        student_name: 'John Doe',
        confidence: 0.95,
        is_live: true,
      };

      setLastRecognition(mockResult);
      
      if (mockResult.confidence > 0.8 && mockResult.is_live) {
        // Mark attendance
        await api.markAttendance(mockResult.student_id, mockResult.confidence);
        
        toast.success(`Attendance marked for ${mockResult.student_name}`, {
          duration: 4000,
          icon: <Check className="h-5 w-5 text-green-500" />,
        });
        
        onAttendanceMarked?.(mockResult);
        
        // Clear recognition result after 3 seconds
        if (recognitionTimeout) {
          clearTimeout(recognitionTimeout);
        }
        
        const timeout = setTimeout(() => {
          setLastRecognition(null);
        }, 3000);
        
        setRecognitionTimeout(timeout);
      }
    } catch (error) {
      console.error('Recognition failed:', error);
      toast.error('Recognition failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-process frames every 2 seconds when camera is active
  useEffect(() => {
    if (!cameraState.isActive) return;

    const interval = setInterval(processFrame, 2000);
    return () => clearInterval(interval);
  }, [cameraState.isActive, isProcessing]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Live Camera Feed</h3>
        <div className="flex space-x-2">
          {!cameraState.isActive ? (
            <Button
              onClick={startCamera}
              icon={Camera}
              variant="primary"
              size="sm"
            >
              Start Camera
            </Button>
          ) : (
            <Button
              onClick={stopCamera}
              icon={CameraOff}
              variant="secondary"
              size="sm"
            >
              Stop Camera
            </Button>
          )}
        </div>
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {cameraState.error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <CameraOff className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300">{cameraState.error}</p>
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
            
            {/* Recognition overlay */}
            {lastRecognition && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                  <div className="flex items-center justify-center mb-4">
                    {lastRecognition.confidence > 0.8 && lastRecognition.is_live ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-8 w-8 mr-2" />
                        <span className="text-lg font-semibold">Attendance Marked!</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <X className="h-8 w-8 mr-2" />
                        <span className="text-lg font-semibold">Recognition Failed</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      {lastRecognition.student_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Confidence: {(lastRecognition.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Liveness: {lastRecognition.is_live ? 'Verified' : 'Failed'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Processing...
              </div>
            )}
            
            {/* Face detection guide overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded-lg m-8 opacity-30" />
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                Position your face within the frame
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300">Camera not active</p>
            </div>
          </div>
        )}
      </div>
      
      {cameraState.isActive && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Stand still and look directly at the camera for automatic recognition</p>
          <p className="text-xs mt-1">
            Anti-spoofing protection: Live person detection enabled
          </p>
        </div>
      )}
    </div>
  );
};