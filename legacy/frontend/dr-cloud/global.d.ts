// frontend/global.d.ts
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    // Add other properties if needed
  }
  
  interface SpeechRecognitionResult {
    0: SpeechRecognitionAlternative;
    length: number;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  interface SpeechRecognitionResultList {
    0: SpeechRecognitionResult;
    length: number;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: any) => any) | null;
    onend: (() => any) | null;
    start: () => void;
    stop: () => void;
  }
  
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
  