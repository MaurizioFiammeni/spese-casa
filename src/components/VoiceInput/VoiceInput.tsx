import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { RecordingIndicator } from './RecordingIndicator';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
  const {
    isSupported,
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
    clearError,
  } = useVoiceRecognition();

  // Handle transcript result
  if (transcript && !isRecording) {
    onTranscript(transcript);
    resetTranscript();
  }

  // Push-to-talk: press and hold to record
  const handleMouseDown = () => {
    if (!isRecording) {
      clearError();
      startRecording();
    }
  };

  const handleMouseUp = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  // Also handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isRecording) {
      clearError();
      startRecording();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Microphone Button - Push to Talk */}
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={disabled || !isSupported}
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg select-none
          ${
            isRecording
              ? 'bg-red-500 animate-pulse shadow-red-500/50'
              : 'bg-primary shadow-primary/50'
          }
          ${disabled || !isSupported ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        `}
        aria-label="Tieni premuto per registrare"
      >
        {isRecording ? (
          // Stop icon
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Microphone icon
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}

        {/* Ripple effect during recording */}
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
        )}
      </button>

      {/* Recording Indicator */}
      {isRecording && <RecordingIndicator />}

      {/* Status Messages */}
      <div className="mt-4 text-center min-h-[60px]">
        {!isSupported && (
          <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Riconoscimento vocale non supportato
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Usa Chrome o Edge per migliori risultati
            </p>
          </div>
        )}

        {isRecording && (
          <p className="text-primary font-medium animate-pulse">
            🎤 Parla ora... (rilascia per fermare)
          </p>
        )}

        {error && (
          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg max-w-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!isRecording && !error && isSupported && (
          <p className="text-gray-500 text-sm">
            Tieni premuto il microfono per dettare una spesa
          </p>
        )}
      </div>
    </div>
  );
}
