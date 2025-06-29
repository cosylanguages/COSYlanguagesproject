// frontend/src/utils/speechUtils.js

/**
 * Maps COSYlanguage identifiers to BCP 47 language codes for Web Speech API.
 * @param {string} cosyLanguage - The COSYlanguage identifier (e.g., "COSYenglish").
 * @returns {string} The BCP 47 language code (e.g., "en-US").
 */
export function mapLanguageToSpeechCode(cosyLanguage) {
  let speechCode;
  let isFallback = false;
  // Ensure cosyLanguage is a string before calling toLowerCase or other string methods
  const langStr = String(cosyLanguage || '');

  switch(langStr) {
    case 'COSYenglish': speechCode = 'en-US'; break;
    case 'COSYfrançais': speechCode = 'fr-FR'; break;
    case 'COSYespañol': speechCode = 'es-ES'; break;
    case 'COSYitaliano': speechCode = 'it-IT'; break;
    case 'COSYdeutsch': speechCode = 'de-DE'; break;
    case 'COSYportuguês': speechCode = 'pt-PT'; break;
    case 'ΚΟΖΥελληνικά': speechCode = 'el-GR'; break;
    case 'ТАКОЙрусский': speechCode = 'ru-RU'; break;
    case 'ԾՈՍՅհայկական': speechCode = 'hy-AM'; break;
    case 'COSYbrezhoneg': speechCode = 'fr-FR'; isFallback = true; break; // Breton uses French as a fallback
    case 'COSYtatarça': speechCode = 'ru-RU'; isFallback = true; break;   // Tatar uses Russian as a fallback
    case 'COSYbashkort': speechCode = 'ru-RU'; isFallback = true; break; // Bashkir uses Russian as a fallback
    default: 
      console.warn(`SpeechUtils: Unknown COSYlanguage "${langStr}". Defaulting to en-US.`);
      speechCode = 'en-US'; 
      isFallback = true; 
      break;
  }
  if (isFallback && langStr !== '') { // Avoid logging fallback for empty input
    console.warn(`SpeechUtils: No direct speech synthesis voice for ${cosyLanguage}. Using fallback ${speechCode}.`);
  }
  return speechCode;
}

/**
 * Pronounces a given text using the Web Speech API.
 * @param {string} text - The text to pronounce.
 * @param {string} cosyLanguage - The COSYlanguage identifier for the text's language.
 * @returns {Promise<void>} A promise that resolves when speaking starts or rejects on error/no support.
 */
export const pronounceText = (text, cosyLanguage) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('SpeechUtils: Speech Synthesis not supported by this browser or not in a browser environment.');
      reject(new Error('Speech Synthesis not supported'));
      return;
    }

    if (!text || String(text).trim() === '') {
      console.warn('PronounceText: No text provided.');
      // Resolve an empty promise as there's nothing to speak.
      // Or reject, depending on desired behavior for empty text. For now, resolving.
      resolve(); 
      return;
    }

    const speechLang = mapLanguageToSpeechCode(cosyLanguage);
    const utterance = new SpeechSynthesisUtterance(String(text).trim());
    utterance.lang = speechLang;
    
    // Cancel any ongoing speech before speaking a new one
    window.speechSynthesis.cancel(); 

    utterance.onstart = () => {
      console.log(`SpeechUtils: Speaking "${text}" in ${cosyLanguage} (mapped to ${speechLang})`);
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('SpeechUtils: SpeechSynthesisUtterance.onerror - Error speaking:', event.error, 'for text:', text, 'lang:', speechLang);
      reject(event.error instanceof Error ? event.error : new Error(String(event.error || 'Unknown speech error')));
    };
    
    // Some browsers might not fire onstart immediately or reliably.
    // Fallback: resolve after a short delay if onstart doesn't fire,
    // but this is less ideal than relying on the event.
    // For simplicity, we'll rely on onstart and onerror.

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Attempts to unlock audio playback in the browser.
 * Call this after a user interaction if speech synthesis isn't working.
 */
export const unlockAudioPlayback = () => {
  if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
    try {
      const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      silentAudio.volume = 0;
      const playPromise = silentAudio.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          console.log("SpeechUtils: Audio playback likely unlocked.");
        }).catch(error => {
          console.warn("SpeechUtils: Audio unlock failed (this is common, user interaction might be needed for audio):", error);
        });
      }
    } catch (e) {
      console.error("SpeechUtils: Error trying to unlock audio:", e);
    }
  }
};

// Speech Recognition (STT) logic will be handled separately, likely in a custom hook.
console.log('[SpeechUtils] Service loaded with TTS and language mapping.');
