import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const THEMES = {
    PREMIUM: 'premium',
    VIBRANT: 'vibrant',
    SIMPLE: 'simple',
    CUSTOM: 'custom',
    LIGHT: 'light',
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
    [THEMES.VIBRANT]: {
        '--theme-bg': '15, 23, 42',
        '--theme-surface': '30, 41, 59',
        '--theme-text': '248, 250, 252',
        '--theme-muted': '148, 163, 184',
        '--theme-primary': '139, 92, 246',
        '--theme-secondary': '236, 72, 153',
        '--theme-border': '139, 92, 246',
        '--aurora-1': '260, 80%, 60%',
        '--aurora-2': '320, 80%, 60%',
        '--aurora-3': '200, 80%, 60%',
    },
    [THEMES.SIMPLE]: {
        '--theme-bg': '30, 30, 30',
        '--theme-surface': '44, 44, 44',
        '--theme-text': '225, 225, 225',
        '--theme-muted': '156, 153, 147',
        '--theme-primary': '217, 119, 87',
        '--theme-secondary': '230, 144, 116',
        '--theme-border': '225, 225, 225',
        '--aurora-1': '20, 10%, 40%',
        '--aurora-2': '30, 10%, 30%',
        '--aurora-3': '0, 0%, 20%',
    },
    [THEMES.LIGHT]: {
        '--theme-bg': '222, 213, 196',
        '--theme-surface': '236, 230, 218',
        '--theme-text': '35, 28, 18',
        '--theme-muted': '108, 96, 78',
        '--theme-primary': '155, 118, 48',
        '--theme-secondary': '178, 142, 72',
        '--theme-border': '195, 185, 165',
        '--aurora-1': '35, 50%, 55%',
        '--aurora-2': '45, 50%, 50%',
        '--aurora-3': '25, 40%, 45%',
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
    
    if (theme === THEMES.LIGHT) {
        root.classList.remove('dark');
        document.body.classList.remove('dark');
    } else {
        root.classList.add('dark');
        document.body.classList.add('dark');
    }
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

    const isDark = theme !== THEMES.LIGHT;

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
