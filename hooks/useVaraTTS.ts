
import { useState, useCallback, useEffect } from 'react';

export const useVaraTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = useCallback((text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            console.warn('Text-to-Speech not supported in this browser.');
            return;
        }

        // Cancel any ongoing speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Try to find a good voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('Female') && voice.lang.startsWith('en'));
        const defaultVoice = voices.find(voice => voice.lang.startsWith('en') && voice.default);
        utterance.voice = femaleVoice || defaultVoice || voices[0];

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    }, []);
    
    // Ensure voices are loaded
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
             window.speechSynthesis.getVoices();
             if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
            }
        }
    }, []);

    return { speak, isSpeaking };
};
