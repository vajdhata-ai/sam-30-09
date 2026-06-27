import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const THEMES = {
    PREMIUM: 'premium',
    OLIVE: 'olive',
    NAVY: 'navy',
    AIR_FORCE: 'air-force',
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
        '--theme-bg': '9, 9, 11',
        '--theme-surface': '24, 24, 27',
        '--theme-text': '250, 250, 250',
        '--theme-muted': '161, 161, 170',
        '--theme-primary': '201, 165, 90',
        '--theme-secondary': '227, 194, 128',
        '--theme-border': '39, 39, 42',
        '--aurora-1': '45, 80%, 40%',
        '--aurora-2': '50, 70%, 50%',
        '--aurora-3': '35, 80%, 30%',
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
    [THEMES.AIR_FORCE]: {
        '--theme-bg': '12, 18, 30',
        '--theme-surface': '22, 32, 50',
        '--theme-text': '240, 248, 255',
        '--theme-muted': '140, 170, 200',
        '--theme-primary': '135, 206, 235', /* Sky Blue */
        '--theme-secondary': '70, 130, 180',
        '--theme-border': '135, 206, 235',
        '--aurora-1': '200, 70%, 50%',
        '--aurora-2': '210, 80%, 60%',
        '--aurora-3': '190, 60%, 40%',
    },
};

// Apply theme by injecting CSS vars directly as inline styles (highest specificity, no CSS fights)
const applyTheme = (theme, customColors = null) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    let vars = THEME_VARS[theme] || THEME_VARS[THEMES.PREMIUM];



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
