import { useMessageHistory } from "@/hooks/useMessageHistory";
import React, { useEffect, useMemo, useRef } from "react";

export const MessageHistory: React.FC = () => {
  const { messages } = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const bubbleText = useMemo(() => {
    if (!messages?.length) return "";
    // Get the last message text
    const rawText = (messages[messages.length - 1]?.text ?? "").trim();
    
    return rawText;
  }, [messages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [bubbleText]);

  if (!bubbleText) return null;

  // محاسبه طول متن برای انیمیشن
  const textLength = bubbleText.length;
  const shouldAnimate = textLength > 30; // اگر متن طولانی‌تر از 30 کاراکتر باشد

  return (
    <div className="pointer-events-none fixed top-2 left-1/2 -translate-x-1/2 z-10 max-w-[70vw]">
      <div ref={containerRef} className="relative inline-block max-w-[680px] overflow-hidden">
        <div
          ref={textRef}
          className={`text-[13px] leading-5 whitespace-nowrap font-medium text-foreground ${
            shouldAnimate ? 'animate-scroll-right' : ''
          }`}
          style={{
            direction: /[\u0600-\u06FF]/.test(bubbleText) ? 'rtl' : 'ltr',
            textAlign: /[\u0600-\u06FF]/.test(bubbleText) ? 'right' : 'left',
            animationDuration: shouldAnimate ? `${Math.max(3, textLength * 0.1)}s` : 'none'
          }}
        >
          {bubbleText}
        </div>
      </div>
    </div>
  );
};
