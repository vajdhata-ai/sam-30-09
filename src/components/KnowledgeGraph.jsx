import React, { useState, useEffect } from 'react';
import { Network, Brain, Cpu, Database, ChevronRight, Minimize2, Maximize2 } from './Icons';

/**
 * KnowledgeGraph
 * A lightweight, dependency-free orbital concept map using SVG and CSS transitions.
 * Visualizes how topics are interconnected without heavy graphing libraries.
 */
const KnowledgeGraph = ({ 
    data,
    fallbackRoot = "Central Concept",
    fallbackSubtopics = ["Node A", "Node B", "Node C", "Node D", "Node E"] 
}) => {
    const rootTopic = data?.name || fallbackRoot;
    const subtopics = data?.children?.map(c => c.name).slice(0, 8) || fallbackSubtopics; // max 8 nodes for orbital map

    const [isExpanded, setIsExpanded] = useState(false);
    const [activeNode, setActiveNode] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate positions for nodes in a circle
    const getNodes = () => {
        const nodes = [];
        const radius = isExpanded ? 160 : 100;
        const centerX = 200;
        const centerY = 200;
        const angleStep = (Math.PI * 2) / Math.max(1, subtopics.length);

        subtopics.forEach((topic, index) => {
            const angle = index * angleStep - Math.PI / 2; // Start from top
            nodes.push({
                id: index,
                label: topic,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                delay: index * 0.1
            });
        });

        return nodes;
    };

    const nodes = getNodes();

    return (
        <div className={`relative w-full transition-all duration-500 ease-in-out ${isExpanded ? 'h-[500px]' : 'h-[300px]'}`}>
            
            <div className="absolute top-4 right-4 z-20">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-xl bg-theme-surface/50 border border-theme-primary/20 text-theme-muted hover:text-theme-primary hover:bg-theme-primary/10 transition-colors"
                >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
            </div>

            <div className="absolute inset-0 bg-theme-bg/30 rounded-3xl border border-theme-border overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="absolute w-[400px] h-[400px] overflow-visible pointer-events-none">
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(201,165,90,0.5)" />
                                <stop offset="100%" stopColor="rgba(201,165,90,0.1)" />
                            </linearGradient>
                        </defs>
                        
                        {mounted && nodes.map((node) => (
                            <line 
                                key={`line-${node.id}`}
                                x1="200" 
                                y1="200" 
                                x2={node.x} 
                                y2={node.y} 
                                stroke="url(#lineGrad)" 
                                strokeWidth={activeNode === node.id ? "3" : "1"}
                                strokeDasharray="4 4"
                                className="transition-all duration-500 ease-out origin-center"
                                style={{ 
                                    opacity: mounted ? 1 : 0, 
                                    transitionDelay: `${node.delay}s`,
                                }}
                            />
                        ))}
                    </svg>

                    {/* Root Node */}
                    <div 
                        className="absolute z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-theme-primary to-theme-secondary flex flex-col items-center justify-center text-theme-bg shadow-[0_0_30px_rgba(201,165,90,0.4)] cursor-pointer hover:scale-105 transition-transform"
                        style={{ transform: `scale(${mounted ? 1 : 0.8})`, opacity: mounted ? 1 : 0, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onMouseEnter={() => setActiveNode('root')}
                        onMouseLeave={() => setActiveNode(null)}
                    >
                        <Brain className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center px-2 leading-tight">
                            {rootTopic}
                        </span>
                    </div>

                    {/* Satellite Nodes */}
                    {mounted && nodes.map((node) => (
                        <div 
                            key={`node-${node.id}`}
                            className={`absolute z-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ease-out hover:scale-110`}
                            style={{ 
                                left: `calc(50% - 100px + ${node.x - 200}px)`, 
                                top: `calc(50% - 100px + ${node.y - 200}px)`,
                                width: '200px',
                                opacity: mounted ? 1 : 0,
                                transitionDelay: `${node.delay}s`
                            }}
                            onMouseEnter={() => setActiveNode(node.id)}
                            onMouseLeave={() => setActiveNode(null)}
                        >
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-colors duration-300
                                ${activeNode === node.id ? 'bg-theme-primary/20 border-theme-primary text-theme-primary shadow-[0_0_15px_rgba(201,165,90,0.5)]' : 'bg-theme-surface border-theme-border text-theme-muted hover:border-theme-primary/50'}
                            `}>
                                <Network className="w-4 h-4" />
                            </div>
                            <span className={`text-xs font-bold text-center px-4 py-1 rounded-full backdrop-blur-sm transition-colors duration-300
                                ${activeNode === node.id ? 'text-theme-primary bg-theme-primary/10' : 'text-theme-muted bg-theme-bg/50'}
                            `}>
                                {node.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Active Node Info Panel (shows when hovering) */}
            <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-theme-surface/90 backdrop-blur-md border border-theme-primary/20 shadow-xl transition-all duration-300 transform
                ${activeNode !== null ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
            `}>
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-theme-primary/10 text-theme-primary">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-theme-text mb-1">
                            {activeNode === 'root' ? rootTopic : nodes.find(n => n.id === activeNode)?.label}
                        </h4>
                        <p className="text-xs text-theme-muted">
                            AI-extracted conceptual node. Hover over other nodes to explore relationships.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeGraph;
