import { useState, useRef, useCallback } from 'react';
import { CameraState } from '../types';

export const useCamera = () => {
  const [cameraState, setCameraState] = useState<CameraState>({ isActive: false });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      console.log('Starting camera...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false,
      });

      console.log('Camera stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks());
      console.log('Video element:', videoRef.current);
      setCameraState({ isActive: true, stream });

      if (videoRef.current) {
        console.log('Setting video srcObject');
        videoRef.current.srcObject = stream;
        
        // Force play the video
        const playVideo = async () => {
          try {
            console.log('Attempting to play video...');
            await videoRef.current!.play();
            console.log('Video playing successfully');
          } catch (err) {
            console.error('Failed to play video:', err);
            // Try again after a short delay
            setTimeout(async () => {
              try {
                console.log('Retrying video play...');
                await videoRef.current!.play();
                console.log('Video playing on retry');
              } catch (retryErr) {
                console.error('Video play retry failed:', retryErr);
              }
            }, 100);
          }
        };
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          playVideo();
        };
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
          playVideo();
        };
        videoRef.current.onerror = (e) => {
          console.error('Video error event:', e);
        };
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      let errorMessage = 'Failed to access camera. Please check permissions.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and refresh the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported in this browser. Please try a different browser.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setCameraState({ 
        isActive: false, 
        error: errorMessage
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    setCameraState({ isActive: false });
  }, [cameraState.stream]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  return {
    cameraState,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureFrame,
  };
};