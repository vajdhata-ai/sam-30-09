import React, { useEffect } from 'react';
import { useUniverseStore } from '../../store/universeStore';

export default function UniverseThemeProvider({ children }) {
  const { activeUniverse } = useUniverseStore();

  useEffect(() => {
    // 1. Remove all existing theme classes from the root
    const root = document.documentElement;
    root.classList.remove('theme-premium', 'theme-vibrant', 'theme-simple', 'theme-hp', 'theme-avengers');

    // 2. Apply the new theme class
    root.classList.add(`theme-${activeUniverse}`);
    
    // Fallbacks to generic variables if needed based on `activeUniverse`.
    // Example: dynamic document title change based on universe
    if (activeUniverse === 'hp') {
      document.title = "Samvada | Hogwarts Edition";
    } else if (activeUniverse === 'avengers') {
      document.title = "Samvada | S.H.I.E.L.D. Protocol";
    } else {
      document.title = "Samvada";
    }
  }, [activeUniverse]);

  return <>{children}</>;
}
