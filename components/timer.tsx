"use client";

import { useState, useEffect, useCallback } from "react";
import { formatTime } from "@/lib/utils";

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function Timer({ duration, onComplete, autoStart = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((duration - timeLeft) / duration) * 100;

  const playSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log("Audio not supported");
    }
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          playSound();
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, playSound]);

  const reset = () => {
    setTimeLeft(duration);
    setIsComplete(false);
    setIsRunning(false);
  };

  const toggle = () => {
    if (isComplete) {
      reset();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const skip = () => {
    setTimeLeft(0);
    setIsRunning(false);
    setIsComplete(true);
    onComplete?.();
  };

  // Paramètres du cercle SVG
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Cercle de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted"
          />
          {/* Cercle de progression */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className={isComplete ? "text-green-500" : "text-primary"}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 0.5s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${isComplete ? "text-green-500" : ""}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-muted-foreground">
            {isComplete ? "Terminé !" : isRunning ? "En cours" : "En pause"}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggle}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            isComplete
              ? "bg-green-500 text-white hover:bg-green-600"
              : isRunning
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isComplete ? "Recommencer" : isRunning ? "Pause" : "Démarrer"}
        </button>
        {!isComplete && (
          <button
            onClick={skip}
            className="px-6 py-3 rounded-xl font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            Passer
          </button>
        )}
      </div>
    </div>
  );
}
