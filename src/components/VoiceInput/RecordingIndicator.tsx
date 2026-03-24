import { useEffect, useState } from 'react';

export function RecordingIndicator() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 flex items-center gap-3">
      {/* Recording dot */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
      </span>

      {/* Timer */}
      <span className="text-sm font-medium text-gray-700">
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:
        {String(seconds % 60).padStart(2, '0')}
      </span>

      {/* Waveform animation */}
      <div className="flex items-center gap-1 h-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-red-500 rounded-full animate-pulse"
            style={{
              height: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
