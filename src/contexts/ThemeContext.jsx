import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const THEMES = {
    PREMIUM: 'premium',
    OLIVE: 'olive',
    DESERT: 'desert',
    NAVY: 'navy',
    NIGHT_OPS: 'night-ops',
    CUSTOM: 'custom',
};

// Helper hex to "r, g, b"
export function hexToRgbString(hex) {
    if (!hex) return '0, 0, 0';
    let rawHex = hex.replace('#', '');
    if (rawHex.length === 3) rawHex = rawHex.split('').map(char => char + char).join('');
    const r = parseInt(rawHex.substring(0, 2), 16) || 0;
    const g = parseInt(rawHex.substring(2, 4), 16) || 0;
    const b = parseInt(rawHex.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
}

export const DEFAULT_CUSTOM_COLORS = {
    primary: '#8b5cf6',
    secondary: '#d946ef',
    bg: '#020617',
    surface: '#0f172a',
    text: '#ffffff',
    muted: '#94a3b8'
};

// Theme variable maps - applied as inline CSS variables on <html>
const THEME_VARS = {
    [THEMES.PREMIUM]: {
        '--theme-bg': '14, 11, 7',
        '--theme-surface': '20, 16, 9',
        '--theme-text': '240, 232, 216',
        '--theme-muted': '168, 152, 128',
        '--theme-primary': '201, 165, 90',
        '--theme-secondary': '224, 192, 122',
        '--theme-border': '201, 165, 90',
        '--aurora-1': '35, 100%, 50%',
        '--aurora-2': '45, 100%, 50%',
        '--aurora-3': '15, 100%, 50%',
    },
    [THEMES.OLIVE]: {
        '--theme-bg': '26, 31, 22',
        '--theme-surface': '34, 43, 28',
        '--theme-text': '232, 238, 224',
        '--theme-muted': '142, 153, 128',
        '--theme-primary': '184, 150, 80',
        '--theme-secondary': '155, 178, 122',
        '--theme-border': '184, 150, 80',
        '--aurora-1': '80, 40%, 40%',
        '--aurora-2': '90, 50%, 30%',
        '--aurora-3': '45, 60%, 40%',
    },
    [THEMES.DESERT]: {
        '--theme-bg': '36, 32, 26',
        '--theme-surface': '48, 42, 34',
        '--theme-text': '248, 243, 232',
        '--theme-muted': '178, 163, 142',
        '--theme-primary': '156, 118, 62',
        '--theme-secondary': '124, 138, 92',
        '--theme-border': '156, 118, 62',
        '--aurora-1': '40, 50%, 40%',
        '--aurora-2': '30, 40%, 30%',
        '--aurora-3': '50, 30%, 45%',
    },
    [THEMES.NAVY]: {
        '--theme-bg': '10, 16, 28',
        '--theme-surface': '18, 26, 44',
        '--theme-text': '230, 240, 255',
        '--theme-muted': '120, 140, 170',
        '--theme-primary': '220, 220, 220',
        '--theme-secondary': '100, 160, 220',
        '--theme-border': '220, 220, 220',
        '--aurora-1': '210, 60%, 40%',
        '--aurora-2': '220, 70%, 50%',
        '--aurora-3': '200, 50%, 30%',
    },
    [THEMES.NIGHT_OPS]: {
        '--theme-bg': '5, 5, 5',
        '--theme-surface': '15, 15, 15',
        '--theme-text': '200, 255, 200',
        '--theme-muted': '100, 150, 100',
        '--theme-primary': '0, 255, 100',
        '--theme-secondary': '255, 50, 50',
        '--theme-border': '0, 255, 100',
        '--aurora-1': '140, 100%, 30%',
        '--aurora-2': '130, 100%, 20%',
        '--aurora-3': '0, 100%, 30%',
    },
};

// Apply theme by injecting CSS vars directly as inline styles (highest specificity, no CSS fights)
const applyTheme = (theme, customColors = null) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    let vars = THEME_VARS[theme] || THEME_VARS[THEMES.PREMIUM];

    if (theme === THEMES.CUSTOM) {
        let colorsToUse = customColors;
        if (!colorsToUse) {
            try {
                colorsToUse = JSON.parse(localStorage.getItem('atlas-custom-colors')) || DEFAULT_CUSTOM_COLORS;
            } catch (e) {
                colorsToUse = DEFAULT_CUSTOM_COLORS;
            }
        }
        vars = {
            '--theme-bg': hexToRgbString(colorsToUse.bg),
            '--theme-surface': hexToRgbString(colorsToUse.surface),
            '--theme-text': hexToRgbString(colorsToUse.text),
            '--theme-muted': hexToRgbString(colorsToUse.muted),
            '--theme-primary': hexToRgbString(colorsToUse.primary),
            '--theme-secondary': hexToRgbString(colorsToUse.secondary),
            '--theme-border': hexToRgbString(colorsToUse.primary),
            '--aurora-1': '260, 80%, 60%',
            '--aurora-2': '320, 80%, 60%',
            '--aurora-3': '200, 80%, 60%',
        };
    }

    Object.entries(vars).forEach(([prop, value]) => {
        root.style.setProperty(prop, value);
    });

    // Update theme classes
    Object.values(THEMES).forEach(t => {
        root.classList.remove(`theme-${t}`);
        document.body.classList.remove(`theme-${t}`);
    });
    
    root.classList.add(`theme-${theme}`);
    document.body.classList.add(`theme-${theme}`);
    
    root.classList.add('dark');
    document.body.classList.add('dark');
};

export const ThemeProvider = ({ children }) => {
    const [customColors, setCustomColorsState] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('atlas-custom-colors')) || DEFAULT_CUSTOM_COLORS;
        } catch {
            return DEFAULT_CUSTOM_COLORS;
        }
    });

    const [theme, setThemeState] = useState(() => {
        let saved = localStorage.getItem('atlas-theme-v2');
        if (!saved || !Object.values(THEMES).includes(saved)) {
            saved = THEMES.PREMIUM; 
        }
        applyTheme(saved, customColors);
        return saved;
    });

    const isDark = true;

    useEffect(() => {
        applyTheme(theme, customColors);
        localStorage.setItem('atlas-theme-v2', theme);
    }, [theme, customColors]);

    const setCustomColors = (newColors) => {
        setCustomColorsState(newColors);
        localStorage.setItem('atlas-custom-colors', JSON.stringify(newColors));
    };

    const setTheme = (newTheme) => {
        if (Object.values(THEMES).includes(newTheme)) {
            setThemeState(newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark, THEMES, customColors, setCustomColors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
