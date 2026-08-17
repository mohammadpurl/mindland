'use client'
import { debugLog } from '@/lib/debugLog'
import { useChatContext } from "@/hooks/useChat";
import { useState, useEffect, useCallback, useRef } from "react";
import { VoiceInput } from "./VoiceInput";
import { QRCodeSVG } from "qrcode.react";
import { Language } from "@/hooks/useChat";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface UIProps {
  hidden?: boolean;
  cameraDetectionEnabled?: boolean;
  setCameraDetectionEnabled?: (enabled: boolean) => void;
}

export const UI = ({ hidden, cameraDetectionEnabled = false, setCameraDetectionEnabled }: UIProps) => {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const { 
    cameraZoomed, 
    setCameraZoomed, 
    chat, 
    loading,
    isSessionActive, 
    startSession, 
    getIntroduction,
    endSession,
    showQRCode,
    setShowQRCode,
    qrCodeImage,
    tripId,
    language,
    setLanguage,
    
  } = useChatContext();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [origin, setOrigin] = useState<string>('');
  const [lastImageError, setLastImageError] = useState<string | null>(null);
  const isLocationQr = !!qrCodeImage && qrCodeImage.startsWith('/locations/');
  const encodedQrSrc = qrCodeImage ? qrCodeImage.replace(/ /g, '%20') : '';


  // فعال کردن صدا در اولین کلیک کاربر
  useEffect(() => {
    const enableAudioOnFirstClick = () => {
      if (!audioEnabled) {
        setAudioEnabled(true);
        debugLog("Audio enabled on first click");
        // حذف event listener بعد از فعال شدن
        document.removeEventListener('click', enableAudioOnFirstClick);
      }
    };

    document.addEventListener('click', enableAudioOnFirstClick);
    return () => {
      document.removeEventListener('click', enableAudioOnFirstClick);
    };
  }, [audioEnabled]);

  // Debug: Log tripId changes
  useEffect(() => {
    debugLog("tripId changed:", tripId, "Type:", typeof tripId, "Length:", tripId ? String(tripId).length : 0);
  }, [tripId]);

  // Debug: Log showQRCode changes
  useEffect(() => {
    debugLog("showQRCode changed:", showQRCode, "tripId:", tripId);
  }, [showQRCode, tripId]);

  // Debug: Log QR image path decision
  useEffect(() => {
    debugLog("[QR-DEBUG] qrCodeImage:", qrCodeImage);
    debugLog("[QR-DEBUG] isLocationQr:", isLocationQr);
    debugLog("[QR-DEBUG] encodedQrSrc:", encodedQrSrc);
  }, [qrCodeImage, isLocationQr, encodedQrSrc]);

  // Set origin when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      debugLog("Current origin:", currentOrigin);
      setOrigin(currentOrigin);
    } else {
      debugLog("Window is not defined, setting default origin");
      setOrigin('http://localhost:3000'); // Default for development
    }
  }, []);

  // Debug: Log origin changes
  useEffect(() => {
    debugLog("=== DEBUG INFO ===");
    debugLog("Origin changed:", origin, "Type:", typeof origin, "Length:", origin ? origin.length : 0);
    debugLog("Full QR Code value would be:", `${origin}/ticket/${tripId || '0'}`);
    debugLog("Current window.location:", typeof window !== 'undefined' ? window.location.href : 'N/A');
    debugLog("Current window.origin:", typeof window !== 'undefined' ? window.location.origin : 'N/A');
    debugLog("Current window.protocol:", typeof window !== 'undefined' ? window.location.protocol : 'N/A');
    debugLog("Current window.host:", typeof window !== 'undefined' ? window.location.host : 'N/A');
    debugLog("Environment check:", {
      isClient: typeof window !== 'undefined',
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production'
    });
    debugLog("Component state:", {
      showQRCode,
      isSessionActive,
      tripId,
      origin
    });
    debugLog("==================");
  }, [origin, tripId, showQRCode, isSessionActive]);

  // Debug: Log when QR code should be shown
  useEffect(() => {
    if (showQRCode) {
      debugLog("=== QR CODE SHOULD BE SHOWN ===");
      debugLog("tripId:", tripId);
      debugLog("origin:", origin);
      debugLog("Full URL:", `${origin}/ticket/${tripId || '0'}`);
      debugLog("==================");
    }
  }, [showQRCode, tripId, origin]);

  // Debug: Log when button is clicked
  const handleTicketClick = useCallback(() => {
    const tripIdStr = String(tripId);
    debugLog("=== TICKET BUTTON CLICKED ===");
    debugLog("tripId:", tripIdStr);
    debugLog("origin:", origin);
    debugLog("Full URL:", `/ticket/${tripIdStr}`);
    debugLog("Router available:", !!router);
    debugLog("window.location.origin:", window.location.origin);
    debugLog("==================");
    
    if (!tripIdStr || tripIdStr.trim() === '' || tripIdStr === '0' || tripIdStr === 'null') {
      console.error("tripId is empty or invalid:", tripIdStr);
      alert("خطا: شناسه بلیط نامعتبر است. لطفاً ابتدا اطلاعات سفر را تکمیل کنید.");
      return;
    }
    
    // Check if it's a temporary ID
    if (tripIdStr.startsWith('temp_')) {
      debugLog("Temporary ID detected, redirecting to form with temp data");
      // For temporary IDs, redirect to ticket page with "0" to show empty form
      const targetUrl = `/ticket/0`;
      try {
        router.push(targetUrl);
        debugLog("Redirected to empty form");
        return;
      } catch (error) {
        console.error("Router push failed:", error);
        window.location.href = targetUrl;
        return;
      }
    }
    
    try {
      debugLog("Attempting router.push...");
      const targetUrl = `/ticket/${tripIdStr}`;
      debugLog("Target URL:", targetUrl);
      
      // Try router.push first
      router.push(targetUrl);
      debugLog("Router.push successful");
    } catch (error) {
      console.error("Router push failed:", error);
      debugLog("Falling back to window.location...");
      
      // Fallback to window.location
      try {
        window.location.href = `/ticket/${tripIdStr}`;
      } catch (locationError) {
        console.error("window.location also failed:", locationError);
        // Last resort: show alert
        alert(`خطا در باز کردن صفحه بلیط. لطفاً به آدرس زیر بروید: /ticket/${tripIdStr}`);
      }
    }
  }, [tripId, router, origin]);

  // Debug: Log component mount
  useEffect(() => {
    debugLog("=== COMPONENT MOUNTED ===");
    debugLog("Initial tripId:", tripId);
    debugLog("Initial showQRCode:", showQRCode);
    debugLog("Initial origin:", origin);
    debugLog("==================");
  }, [tripId, showQRCode, origin]);

  // Debug: Log when tripId changes
  useEffect(() => {
    if (tripId) {
      debugLog("=== TRIP ID SET ===");
      debugLog("New tripId:", tripId);
      debugLog("Type:", typeof tripId);
      debugLog("Length:", String(tripId).length);
      debugLog("==================");
    }
  }, [tripId]);

  // Debug: Log when showQRCode changes
  useEffect(() => {
    if (showQRCode) {
      debugLog("=== SHOW QR CODE SET ===");
      debugLog("showQRCode:", showQRCode);
      debugLog("tripId at this time:", tripId);
      debugLog("origin at this time:", origin);
      debugLog("==================");
    }
  }, [showQRCode, tripId, origin]);

  // Debug: Log when origin changes
  useEffect(() => {
    if (origin) {
      debugLog("=== ORIGIN SET ===");
      debugLog("New origin:", origin);
      debugLog("Type:", typeof origin);
      debugLog("Length:", origin.length);
      debugLog("==================");
    }
  }, [origin]);

  // Debug: Log when component updates
  useEffect(() => {
    debugLog("=== COMPONENT UPDATED ===");
    debugLog("Current state:", {
      tripId,
      showQRCode,
      origin,
      isSessionActive
    });
    debugLog("==================");
  });

  // Debug: Log when button is rendered
  useEffect(() => {
    if (showQRCode && tripId) {
      debugLog("=== BUTTON SHOULD BE RENDERED ===");
      debugLog("Button will have tripId:", tripId);
      debugLog("Button will have origin:", origin);
      debugLog("Button will navigate to:", `/ticket/${tripId}`);
      debugLog("==================");
    }
  }, [showQRCode, tripId, origin]);

  // Debug: Log when button is clicked
  useEffect(() => {
    debugLog("=== BUTTON CLICK HANDLER READY ===");
    debugLog("handleTicketClick function:", typeof handleTicketClick);
    debugLog("==================");
  }, [handleTicketClick]);

  // Debug: Log when component unmounts
  useEffect(() => {
    return () => {
      debugLog("=== COMPONENT UNMOUNTING ===");
      debugLog("Final state:", {
        tripId,
        showQRCode,
        origin,
        isSessionActive
      });
      debugLog("==================");
    };
  });

  const sendMessage = () => {
    const text = input.current?.value;
    if (!loading && text && isSessionActive) {
      chat(text);
      if (input.current) input.current.value = "";
    } else if (!isSessionActive) {
      alert("Please start a session first!");
    }
  };

  


  if (hidden) {
    return null;
  }

  return (
    <>
      <VoiceInput language={language} />
      
      {/* QR Code - Positioned below End Session button */}
      {showQRCode && (
        <div
          style={{
            position: 'fixed',
            bottom: '140px', // Above the End Session button area
            left: '140px',
            background: "white",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
            <h3 style={{ fontSize: 14, textAlign: "center", margin: 0, flex: 1 }}>
              QR Code بلیط
            </h3>
            <button
              onClick={() => setShowQRCode(false)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 12,
                cursor: 'pointer',
                color: '#666',
                padding: '2px 4px',
                borderRadius: '3px',
                marginLeft: 4
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#f0f0f0'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = 'transparent'}
            >
              ✕
            </button>
          </div>
          {qrCodeImage && qrCodeImage.startsWith("/locations/") ? (
            <Image
              src={qrCodeImage.replace(/ /g, '%20')}
              alt="Location QR Code"
              width={192}
              height={192}
              style={{ borderRadius: 4 }}
              unoptimized
              onLoad={() => {
                debugLog('[QR-DEBUG] Image loaded successfully:', encodedQrSrc);
                setLastImageError(null);
              }}
              onError={(e) => {
                console.error('[QR-DEBUG] Image failed to load:', {
                  original: qrCodeImage,
                  encoded: encodedQrSrc,
                });
                setLastImageError(`Failed to load: ${encodedQrSrc}`);
              }}
            />
          ) : (
            <QRCodeSVG
              value={`${origin}/ticket/${tripId || '0'}`}
              size={192}
            />
          )}
         
        </div>
      )}
      {/* 4TH-EYE Logo in left corner */}
      <div className="fixed bottom-16 right-4 z-20 pointer-events-none">
        <div className="relative">
          {/* Circular background with a fresh, glass-like gradient complementing green */}
          <div className="w-34 h-34 rounded-full bg-gradient-to-br from-teal-400/60 via-cyan-500/60 to-blue-600/60 shadow-2xl border-4 border-white/20 backdrop-blur-md relative flex items-center justify-center">
            {/* Inner glow effect with a more subtle, matching color */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-300/30 to-cyan-400/30 blur-sm"></div>
            
            {/* Logo image - centered using flex */}
            {/* <div className="flex items-center justify-center w-full h-full relative z-10 pt-7">
              <Image
                src="/4TH-EYE-FINAL-09.png"
                alt="4TH-EYE Logo"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div> */}
          </div>

          {/* Pulsing ring effect - adjusted for better visual harmony */}
          <div className="absolute inset-0 w-full h-full rounded-full bg-white/10 animate-pulse"></div>

          {/* Subtle glow effect - adjusted color */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-teal-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75"></div>

          {/* Floating particles - adjusted colors to match new theme */}
          <div className="absolute w-2 h-2 bg-teal-300 rounded-full -top-1 left-1/4 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute w-2 h-2 bg-cyan-300 rounded-full top-1/4 -right-1 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute w-2 h-2 bg-blue-300 rounded-full bottom-0 left-1/3 animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      <div className="fixed top-8 left-0 right-0 bottom-0 z-20 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          
          {!audioEnabled && !isSessionActive && (
            <div className="text-sm text-gray-600 mt-2">
              {language === "fa" ? "برای فعال کردن صدا، دکمه شروع جلسه را کلیک کنید" : "Click start session to enable audio"}
            </div>
          )}
          
          {/* Language Selector */}
          <div className="mt-4 flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700"> Language </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="pointer-events-auto px-4 py-2 w-26 rounded-full bg-gradient-to-r from-teal-400/80 via-cyan-500/80 to-blue-600/80 text-black font-medium text-sm shadow-lg backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-300/50 transition-all duration-300 hover:from-teal-500/90 hover:via-cyan-600/90 hover:to-blue-700/90"
              >
                <option value="fa">فارسی</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          
          {/* Camera Detection Toggle */}
          {/* <div className="mt-3 flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700">
              {language === "fa" ? "تشخیص خودکار:" : "Auto Detection:"}
            </label>
            <button
              onClick={() => setCameraDetectionEnabled?.(!cameraDetectionEnabled)}
              className={`pointer-events-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20 ${
                cameraDetectionEnabled
                  ? 'bg-gradient-to-r from-teal-400/80 via-cyan-500/80 to-blue-600/80 text-black hover:from-teal-500/90 hover:via-cyan-600/90 hover:to-blue-700/90'
                  : 'bg-gradient-to-r from-gray-400/60 to-gray-500/60 text-gray-700 hover:from-gray-500/70 hover:to-gray-600/70'
              }`}
            >
              {cameraDetectionEnabled
                ? (language === "fa" ? "فعال" : "ON")
                : (language === "fa" ? "غیرفعال" : "OFF")
              }
            </button>
          </div> */}
          
          {/* Session Management Buttons */}
          <div className="mt-4 flex gap-3">
            {!isSessionActive ? (
              <button
                onClick={async () => {
                  // فعال کردن صدا هنگام کلیک روی دکمه start session
                  if (!audioEnabled) {
                    setAudioEnabled(true);
                    debugLog("Audio enabled on session start");
                  }
                  await startSession();
                  await getIntroduction(); // دوباره اجرا می‌شود
                }}
                className="pointer-events-auto relative group"
              >
                {/* Circular background with gradient */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/80 via-cyan-500/80 to-blue-600/80 shadow-2xl border-4 border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:from-teal-500/90 group-hover:via-cyan-600/90 group-hover:to-blue-700/90 group-hover:scale-105">
                  {/* Inner glow effect */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-300/30 to-cyan-400/30 blur-sm"></div>
                  
                  {/* Button content */}
                  <div className="relative z-10 text-center">
                    <div className="text-xs font-bold text-black leading-tight">
                      {language === "fa" ? "شروع جلسه" : "Start Session"}
                    </div>
                    <div className="text-2xl mb-1">🎤</div>
                  </div>
                  
                  {/* Animated ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/60 blur-sm animate-ping"></div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-300 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              </button>
            ) : (
              <button
                onClick={endSession}
                className="pointer-events-auto relative group"
              >
                {/* Circular background with gradient */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400/80 via-pink-500/80 to-red-600/80 shadow-2xl border-4 border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:from-red-500/90 group-hover:via-pink-600/90 group-hover:to-red-700/90 group-hover:scale-105">
                  {/* Inner glow effect */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-300/30 to-pink-400/30 blur-sm"></div>
                  
                  {/* Button content */}
                  <div className="relative z-10 text-center">
                    <div className="text-xs font-bold text-black leading-tight">
                      {language === "fa" ? "پایان جلسه" : "End Session"}
                    </div>
                    <div className="text-2xl mb-1">⏹️</div>
                  </div>
                  
                  {/* Animated ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/60 blur-sm animate-ping"></div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-300 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              </button>
            )}
          </div>

          
          {isSessionActive && (
            <div className="flex flex-col gap-2">
              {/* <div className="text-sm text-green-600 mt-3 font-medium bg-gradient-to-r from-green-400/20 to-emerald-500/20 px-4 py-2 rounded-full border border-green-300/30 backdrop-blur-sm">
                🟢 {language === "fa" ? "جلسه فعال - حالا صحبت کنید!" : "Session Active - Speak now!"}
              </div> */}
              {/* <div className="w-full">
                <MessageHistory />
              </div> */}
            </div>
          )}
        </div>
        {/* <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => {
              const body = document.querySelector("body");
              if (body?.classList.contains("greenScreen")) {
                body.classList.remove("greenScreen");
              } else {
                body?.classList.add("greenScreen");
              }
            }}
            className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </button>
        </div> */}
        {/* <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder={language === "fa" ? "پیام خود را بنویسید..." : "Type a message..."}
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            disabled={loading}
            onClick={sendMessage}
            className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${loading ? "cursor-not-allowed opacity-30" : ""
              }`}
          >
            {language === "fa" ? "ارسال" : "Send"}
          </button>
        </div> */}
      </div>
    </>
  );
};
