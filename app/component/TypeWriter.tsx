import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypeWriter({
  text,
  speed = 100,
  delay = 0,
  className = "",
  showCursor = true,
  onComplete,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showBlinkingCursor, setShowBlinkingCursor] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
      } else if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    }, delay);

    return () => clearTimeout(startTimer);
  }, [currentIndex, text, speed, delay, isComplete, onComplete]);

  // Blinking cursor effect
  useEffect(() => {
    if (!showCursor) return;

    const cursorTimer = setInterval(() => {
      setShowBlinkingCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [showCursor]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span
          className={`inline-block w-0.5 h-[1em] bg-current ml-1 ${
            showBlinkingCursor ? "opacity-100" : "opacity-0"
          } transition-opacity duration-100`}
        />
      )}
    </span>
  );
}
