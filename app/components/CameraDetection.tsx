'use client'

import { useChatContext } from "@/hooks/useChat";
import { useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js';
import { debugLog } from '@/lib/debugLog'

interface CameraDetectionProps {
  enabled?: boolean;
  onStart?: () => void;
}

/**
 * Camera + face presence — only starts getUserMedia after explicit consent click.
 * Parent should default `enabled` to false (privacy).
 */
export const CameraDetection = ({ enabled = false, onStart }: CameraDetectionProps) => {
  const { isSessionActive, startSession, getIntroduction, language } = useChatContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [consentGiven, setConsentGiven] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [personDetected, setPersonDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const presenceMsRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setConsentGiven(false);
      stopCamera();
    }
  }, [enabled]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        setModelsLoaded(true);
      } catch (error) {
        console.error("Failed to load face-api models:", error);
      }
    };
    if (enabled && consentGiven) {
      void loadModels();
    }
  }, [enabled, consentGiven]);

  const initializeCamera = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permission.state);
        if (permission.state === 'denied') {
          return;
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        }
      });
      setCameraPermission('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsDetecting(true);
    } catch (error) {
      console.error("Failed to initialize camera:", error);
      setCameraPermission('denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsDetecting(false);
    setPersonDetected(false);
    presenceMsRef.current = 0;
  };

  const detectPerson = async () => {
    if (!videoRef.current || !modelsLoaded || !isDetecting) return false;

    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return false;
    }

    try {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });
      const detection = await faceapi.detectSingleFace(video, options);
      return !!detection;
    } catch (error) {
      console.error("Detection error:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!isDetecting || isSessionActive || !modelsLoaded) return;

    detectionIntervalRef.current = setInterval(async () => {
      const hasPerson = await detectPerson();
      if (hasPerson) {
        setPersonDetected(true);
        presenceMsRef.current += 100;
        debugLog(`Presence time: ${presenceMsRef.current}ms`);

        if (presenceMsRef.current >= 4000 && !isSessionActive) {
          const enableAudioEvent = new Event('click');
          document.dispatchEvent(enableAudioEvent);

          startSession();
          getIntroduction();

          if (onStart) {
            onStart();
          }

          setIsDetecting(false);
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
          }
        }
      } else {
        setPersonDetected(false);
        presenceMsRef.current = 0;
      }
    }, 100);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isDetecting, isSessionActive, modelsLoaded, startSession, getIntroduction, onStart]);

  useEffect(() => {
    if (enabled && consentGiven && !isSessionActive && cameraPermission !== 'denied' && modelsLoaded) {
      void initializeCamera();
    }

    return () => {
      stopCamera();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [enabled, consentGiven, isSessionActive, cameraPermission, modelsLoaded]);

  if (!enabled) return null;

  if (!consentGiven) {
    return (
      <div
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-white/20 bg-slate-900/95 p-4 text-white shadow-lg backdrop-blur md:left-auto"
        dir="rtl"
        role="dialog"
        aria-labelledby="camera-consent-title"
      >
        <h2 id="camera-consent-title" className="text-sm font-extrabold">
          {language === 'fa' ? 'اجازهٔ دوربین' : 'Camera permission'}
        </h2>
        <p className="mt-2 text-xs leading-6 text-white/80">
          {language === 'fa'
            ? 'تشخیص حضور فقط روی دستگاه تو اجرا می‌شود و تصویر به سرور فرستاده نمی‌شود. فقط در صورت تمایل ادامه بده.'
            : 'Presence detection runs only on your device and is not uploaded. Continue only if you agree.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl bg-teal-500 px-3 py-2 text-xs font-extrabold text-white"
            onClick={() => setConsentGiven(true)}
          >
            {language === 'fa' ? 'اجازه می‌دهم' : 'Allow camera'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/40 shadow-lg bg-black/30 backdrop-blur-sm">
          <video
            ref={previewVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="fixed top-40 right-40 translate-x-32 z-50 bg-black bg-opacity-75 rounded-lg p-2 text-white text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isDetecting ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        {isDetecting && (
          <div className="mt-1">
            <div className="flex items-center gap-1">
              <span>{language === "fa" ? "وضعیت:" : "Status:"}</span>
              <span className={personDetected ? 'text-green-400' : 'text-red-400'}>
                {personDetected
                  ? (language === "fa" ? "شخص تشخیص داده شد" : "Person Detected")
                  : (language === "fa" ? "شخصی یافت نشد" : "No Person")
                }
              </span>
            </div>
            <div className="mt-1">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((presenceMsRef.current / 4000) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs">
                {language === "fa"
                  ? `${(presenceMsRef.current / 1000).toFixed(1)}/4 ثانیه`
                  : `${(presenceMsRef.current / 1000).toFixed(1)}/4s`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ display: 'none' }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            void videoRef.current.play();
          }
        }}
      />
    </>
  );
};
