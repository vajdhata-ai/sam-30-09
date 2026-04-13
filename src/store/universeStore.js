import { useState, useEffect } from 'react';

// Zero-dependency global state implementation to bypass the Zustand npm block
let globalState = {
  activeUniverse: 'premium',
  activeCompanion: 'hp',
  themeMode: 'dark',
  isSpeaking: false,
  speechAudioLevel: 0,
};

const listeners = new Set();

const setState = (newState) => {
  globalState = { ...globalState, ...newState };
  listeners.forEach((listener) => listener(globalState));
};

export const useUniverseStore = () => {
  const [state, setLocalState] = useState(globalState);

  useEffect(() => {
    listeners.add(setLocalState);
    return () => listeners.delete(setLocalState);
  }, []);

  return {
    ...state,
    setActiveUniverse: (val) => setState({ activeUniverse: val }),
    setActiveCompanion: (val) => setState({ activeCompanion: val }),
    setThemeMode: (val) => setState({ themeMode: val }),
    setIsSpeaking: (val) => setState({ isSpeaking: val }),
    setSpeechAudioLevel: (val) => setState({ speechAudioLevel: val }),
  };
};
