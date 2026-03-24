import { useState, useCallback, useEffect, useRef } from 'react';
import { SpeechRecognitionService } from '../services/speechRecognition';

export interface UseVoiceRecognitionReturn {
  isSupported: boolean;
  isRecording: boolean;
  transcript: string | null;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
  clearError: () => void;
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [isSupported] = useState(() => {
    const service = new SpeechRecognitionService();
    return service.isSupported();
  });

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef<SpeechRecognitionService | null>(null);

  // Initialize service on mount
  useEffect(() => {
    serviceRef.current = new SpeechRecognitionService();

    return () => {
      // Cleanup: stop recording on unmount
      if (serviceRef.current) {
        serviceRef.current.abort();
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!serviceRef.current || !isSupported) {
      setError('Riconoscimento vocale non supportato');
      return;
    }

    // Clear previous state
    setTranscript(null);
    setError(null);
    setIsRecording(true);

    serviceRef.current.start(
      // onResult callback
      (text: string) => {
        setTranscript(text);
        setIsRecording(false);
      },
      // onError callback
      (errorMessage: string) => {
        setError(errorMessage);
        setIsRecording(false);
      }
    );
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSupported,
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
    clearError,
  };
}
