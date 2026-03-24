// Web Speech API types (not in TypeScript by default)
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export class SpeechRecognitionService {
  private recognition: ISpeechRecognition | null = null;
  private isRecording = false;

  constructor() {
    // Check browser support
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.setupRecognition();
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    // Configure for Italian language
    this.recognition.lang = 'it-IT';

    // Return final results only (no interim)
    this.recognition.interimResults = false;

    // Return only best match
    this.recognition.maxAlternatives = 1;

    // Stop automatically after speech ends
    this.recognition.continuous = false;
  }

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Start recording
   */
  start(
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError('Riconoscimento vocale non supportato in questo browser');
      return;
    }

    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    // Set up event handlers
    this.recognition.onresult = (event: Event) => {
      const speechEvent = event as SpeechRecognitionEvent;
      const transcript =
        speechEvent.results[speechEvent.resultIndex][0].transcript;
      onResult(transcript);
      this.isRecording = false;
    };

    this.recognition.onerror = (event: Event) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      let errorMessage = 'Errore durante il riconoscimento vocale';

      switch (errorEvent.error) {
        case 'no-speech':
          errorMessage = 'Nessun audio rilevato. Riprova parlando più chiaramente.';
          break;
        case 'audio-capture':
          errorMessage = 'Microfono non disponibile. Verifica le impostazioni.';
          break;
        case 'not-allowed':
          errorMessage = 'Permesso microfono negato. Abilita il microfono nelle impostazioni.';
          break;
        case 'network':
          errorMessage = 'Errore di rete. Verifica la connessione internet.';
          break;
        case 'aborted':
          errorMessage = 'Riconoscimento vocale annullato.';
          break;
        default:
          errorMessage = `Errore: ${errorEvent.error}`;
      }

      onError(errorMessage);
      this.isRecording = false;
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };

    // Start recognition
    try {
      this.recognition.start();
      this.isRecording = true;
    } catch (error) {
      onError('Impossibile avviare il riconoscimento vocale');
      this.isRecording = false;
    }
  }

  /**
   * Stop recording
   */
  stop(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
  }

  /**
   * Abort recording
   */
  abort(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.abort();
      this.isRecording = false;
    }
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }
}
