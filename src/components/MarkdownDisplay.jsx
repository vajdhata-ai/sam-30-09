import React from 'react';

const MarkdownDisplay = ({ text, content }) => {
    const rawText = text || content;
    if (!rawText) return null;
    
    const lines = typeof rawText === 'string' ? rawText.split('\n') : Array.isArray(rawText) ? rawText : JSON.stringify(rawText).split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.includes('---CONTENT_SPLIT---')) {
            elements.push(<hr key={`hr-${i}`} className="my-10 border-theme-border opacity-50 w-3/4 mx-auto" />);
            i++; continue;
        }

        if (line.startsWith('## ')) {
            elements.push(<h2 key={`h2-${i}`} className="text-2xl font-serif font-bold mt-10 mb-6 text-theme-primary">{line.replace('## ', '')}</h2>);
            i++; continue;
        }
        
        if (line.startsWith('### ')) {
            elements.push(<h3 key={`h3-${i}`} className="text-xl font-serif font-bold mt-8 mb-4 text-theme-secondary">{line.replace('### ', '')}</h3>);
            i++; continue;
        }
        
        if (line.startsWith('# ')) {
            elements.push(<h1 key={`h1-${i}`} className="text-3xl md:text-4xl font-serif font-black mt-8 mb-8 text-theme-text uppercase tracking-widest border-b border-theme-border pb-4">{line.replace('# ', '')}</h1>);
            i++; continue;
        }

        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            // Bold parsing for lists
            const parseBold = (str) => {
                const parts = str.split(/(\*\*.*?\*\*)/);
                return parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index} className="font-bold text-theme-primary">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });
            };

            elements.push(
                <div key={`li-${i}`} className="flex gap-4 my-3">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-theme-primary" />
                    <span className="text-lg leading-relaxed text-theme-text/90 font-medium">{parseBold(line.replace(/^[*|-]\s*/, ''))}</span>
                </div>
            );
            i++; continue;
        }

        if (line.trim().startsWith('> ')) {
            elements.push(
                <blockquote key={`bq-${i}`} className="border-l-4 border-theme-primary pl-4 py-2 my-4 bg-theme-primary/5 rounded-r-lg italic text-theme-text/80">
                    {line.replace('> ', '')}
                </blockquote>
            );
            i++; continue;
        }

        if (!line.trim()) {
            elements.push(<div key={`sp-${i}`} className="h-4" />);
            i++; continue;
        }

        // Bold parsing for paragraphs
        const parseBold = (str) => {
            const parts = str.split(/(\*\*.*?\*\*)/);
            return parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-bold text-theme-primary">{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };

        elements.push(
            <p key={`p-${i}`} className="text-lg leading-relaxed text-theme-text/80 my-3">
                {parseBold(line)}
            </p>
        );
        i++;
    }

    return <div className="markdown-body font-sans">{elements}</div>;
};

export default MarkdownDisplay;
