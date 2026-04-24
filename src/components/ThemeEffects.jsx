import React from 'react';

/**
 * ThemeEffects — turbo.ai inspired ambient environmental layer.
 * Creates persistent dot grid and floating light beams across the app.
 */
const ThemeEffects = () => {
    return (
        <div className="turbo-environment" aria-hidden="true">
            {/* Dot Grid Pattern */}
            <div className="bg-pattern" />

            {/* Glowing Light Beams */}
            <div className="light-beam beam-top-right" />
            <div className="light-beam beam-left-center" />
            <div className="light-beam beam-bottom-right" />
        </div>
    );
};

export default ThemeEffects;
