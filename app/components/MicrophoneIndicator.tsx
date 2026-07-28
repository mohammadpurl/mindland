"use client";

import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicrophoneIndicatorProps {
  isListening: boolean;
  isSpeaking: boolean;
  isError: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MicrophoneIndicator({ 
  isListening, 
  isSpeaking, 
  isError, 
  size = 'md',
  className = ''
}: MicrophoneIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const getIconColor = () => {
    if (isError) return 'text-red-500';
    if (isSpeaking) return 'text-green-500';
    if (isListening) return 'text-blue-500';
    return 'text-gray-400';
  };

  const getPulseColor = () => {
    if (isError) return 'bg-red-500';
    if (isSpeaking) return 'bg-green-500';
    if (isListening) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Pulse effect when speaking */}
      {isSpeaking && (
        <div className={`absolute inset-0 rounded-full ${getPulseColor()} opacity-75 animate-ping`} />
      )}
      
      {/* Ripple effect when listening */}
      {isListening && !isSpeaking && (
        <div className={`absolute inset-0 rounded-full ${getPulseColor()} opacity-50 animate-pulse`} />
      )}
      
      {/* Microphone icon */}
      <div className={`relative ${sizeClasses[size]} ${getIconColor()}`}>
        {isError ? (
          <MicOff className="w-full h-full" />
        ) : (
          <Mic className="w-full h-full" />
        )}
      </div>
      
      {/* Status indicator dot */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPulseColor()} ${
        isSpeaking ? 'animate-pulse' : ''
      }`} />
    </div>
  );
}

// Hook for microphone status
export function useMicrophoneStatus() {
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  return {
    isListening,
    isSpeaking,
    isError,
    setIsListening,
    setIsSpeaking,
    setIsError
  };
}
