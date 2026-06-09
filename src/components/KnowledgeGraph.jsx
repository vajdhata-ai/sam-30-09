import React, { useState, useEffect, useMemo } from 'react';
import { Network, Brain, Cpu, ChevronLeft, Minimize2, Maximize2, Layers } from './Icons';

/**
 * KnowledgeGraph
 * A premium, interactive orbital concept map.
 * Supports drill-down navigation into subtopics with smooth transitions.
 */
const KnowledgeGraph = ({ 
    data,
    fallbackRoot = "Central Concept",
    fallbackSubtopics = [{ name: "Extracting Concepts..." }] 
}) => {
    const [history, setHistory] = useState([]);
    const [currentData, setCurrentData] = useState(data || { name: fallbackRoot, children: fallbackSubtopics });
    
    useEffect(() => {
        if (data) {
            setCurrentData(data);
            setHistory([]);
        }
    }, [data]);

    const rootTopic = currentData?.name || fallbackRoot;
    const subtopics = (currentData?.children || fallbackSubtopics).slice(0, 12); // Handle up to 12 nodes gracefully

    const [isExpanded, setIsExpanded] = useState(false);
    const [activeNode, setActiveNode] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNodeClick = (nodeData) => {
        if (nodeData.children && nodeData.children.length > 0) {
            setHistory([...history, currentData]);
            setCurrentData(nodeData);
            setActiveNode(null);
        }
    };

    const handleBack = () => {
        if (history.length > 0) {
            const newHistory = [...history];
            const previousData = newHistory.pop();
            setHistory(newHistory);
            setCurrentData(previousData);
            setActiveNode(null);
        }
    };

    // Calculate positions for nodes in a circle
    const getNodes = () => {
        const nodes = [];
        const radius = isExpanded ? 180 : 120;
        const centerX = 200;
        const centerY = 200;
        const angleStep = (Math.PI * 2) / Math.max(1, subtopics.length);

        subtopics.forEach((topicData, index) => {
            const angle = index * angleStep - Math.PI / 2; // Start from top
            nodes.push({
                id: index,
                data: topicData,
                label: topicData.name,
                hasChildren: topicData.children && topicData.children.length > 0,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                delay: index * 0.05
            });
        });

        return nodes;
    };

    const nodes = getNodes();
    const containerHeight = isExpanded ? 'h-[600px]' : 'h-[400px]';
    const svgSize = isExpanded ? 500 : 400;
    const svgOffset = (svgSize - 400) / 2;

    return (
        <div className={`relative w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${containerHeight}`}>
            
            {/* Top Controls */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-xl bg-[#0c0906] border border-white/[0.06] text-theme-muted hover:text-theme-primary hover:border-theme-primary/30 transition-all duration-300 shadow-depth hover-lift cursor-none"
                    title={isExpanded ? "Collapse Map" : "Expand Map"}
                >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
            </div>

            {/* Breadcrumb Navigation */}
            {history.length > 0 && (
                <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2 max-w-[70%]">
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-theme-primary/10 border border-theme-primary/20 text-theme-primary hover:bg-theme-primary/20 transition-all duration-300 shadow-depth hover-lift cursor-none"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Back</span>
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                        <span className="opacity-50">Root</span>
                        {history.map((h, i) => (
                            <React.Fragment key={i}>
                                <span className="opacity-50">/</span>
                                <span className="max-w-[100px] truncate" title={h.name}>{h.name}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-[#0e0b07] rounded-[24px] border border-white/[0.06] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                {/* Background Grid & Ambient Lighting */}
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-theme-primary/5 rounded-full blur-[100px] pointer-events-none float-slow"></div>

                <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* SVG Connections & Orbital Rings */}
                    <svg 
                        className="absolute overflow-visible pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ width: svgSize, height: svgSize, left: `calc(50% - ${svgSize/2}px)`, top: `calc(50% - ${svgSize/2}px)` }}
                        viewBox={`0 0 400 400`}
                    >
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(201,165,90,0.8)" />
                                <stop offset="100%" stopColor="rgba(201,165,90,0.1)" />
                            </linearGradient>
                            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                                <stop offset="100%" stopColor="rgba(201,165,90,0.05)" />
                            </linearGradient>
                        </defs>

                        {/* Orbital Rings */}
                        <circle cx="200" cy="200" r={isExpanded ? 180 : 120} fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="4 8" className="animate-[spin_60s_linear_infinite]" />
                        <circle cx="200" cy="200" r={isExpanded ? 120 : 80} fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="2 4" className="animate-[spin_40s_linear_infinite_reverse]" />

                        {mounted && nodes.map((node) => (
                            <line 
                                key={`line-${node.id}`}
                                x1="200" 
                                y1="200" 
                                x2={node.x} 
                                y2={node.y} 
                                stroke="url(#lineGrad)" 
                                strokeWidth={activeNode === node.id ? "2" : "1"}
                                strokeDasharray={activeNode === node.id ? "none" : "4 4"}
                                className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center"
                                style={{ 
                                    opacity: mounted ? (activeNode === node.id ? 1 : 0.4) : 0, 
                                    transitionDelay: `${node.delay}s`,
                                }}
                            />
                        ))}
                    </svg>

                    {/* Root Node (Center) */}
                    <div 
                        className="absolute z-20 w-28 h-28 rounded-full border border-theme-primary/30 bg-[#0c0906] flex flex-col items-center justify-center text-theme-text shadow-[0_0_40px_rgba(201,165,90,0.15),inset_0_0_20px_rgba(201,165,90,0.05)] cursor-pointer hover:scale-105 transition-all duration-500 ease-out nav-active-glow"
                        style={{ transform: `scale(${mounted ? 1 : 0.8})`, opacity: mounted ? 1 : 0 }}
                        onMouseEnter={() => setActiveNode('root')}
                        onMouseLeave={() => setActiveNode(null)}
                    >
                        <div className="absolute inset-1 rounded-full border border-theme-primary/10 animate-[spin_10s_linear_infinite]" />
                        <Brain className="w-8 h-8 mb-2 text-theme-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-center px-4 leading-tight line-clamp-2">
                            {rootTopic}
                        </span>
                    </div>

                    {/* Satellite Nodes */}
                    {mounted && nodes.map((node) => (
                        <div 
                            key={`node-${node.id}`}
                            className={`absolute z-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover-lift`}
                            style={{ 
                                left: `calc(50% - 100px + ${node.x - 200}px)`, 
                                top: `calc(50% - 100px + ${node.y - 200}px)`,
                                width: '200px',
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'scale(1)' : 'scale(0.8)',
                                transitionDelay: `${node.delay}s`
                            }}
                            onMouseEnter={() => setActiveNode(node.id)}
                            onMouseLeave={() => setActiveNode(null)}
                            onClick={() => handleNodeClick(node.data)}
                        >
                            <div className="relative">
                                {/* Has-Children Glow Indicator */}
                                {node.hasChildren && (
                                    <div className={`absolute -inset-2 rounded-full border border-theme-primary/20 animate-pulse transition-opacity duration-300 ${activeNode === node.id ? 'opacity-100' : 'opacity-0'}`} />
                                )}
                                
                                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-3 transition-all duration-300 relative z-10
                                    ${activeNode === node.id 
                                        ? 'bg-theme-primary/20 border-theme-primary/50 text-theme-primary shadow-[0_0_20px_rgba(201,165,90,0.3)] rotate-3' 
                                        : 'bg-[#0c0906] border-white/[0.1] text-theme-muted hover:border-theme-primary/30'}
                                `}>
                                    {node.hasChildren ? <Layers className="w-5 h-5" /> : <Network className="w-5 h-5" />}
                                </div>
                            </div>
                            
                            <span className={`text-[11px] font-bold text-center px-4 py-1.5 rounded-lg border transition-all duration-300 max-w-full shadow-sm
                                ${activeNode === node.id 
                                    ? 'text-theme-primary bg-theme-primary/10 border-theme-primary/20' 
                                    : 'text-theme-muted bg-[#0c0906]/80 border-transparent backdrop-blur-sm'}
                            `}>
                                <span className="line-clamp-2">{node.label}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Active Node Info Panel (shows when hovering) */}
            <div className={`absolute bottom-6 left-6 max-w-[300px] p-4 rounded-2xl bg-[#0c0906]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-400 transform z-30
                ${activeNode !== null ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
            `}>
                <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-theme-primary/10 border border-theme-primary/20 text-theme-primary shrink-0">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-[13px] font-bold text-theme-text mb-1 leading-snug">
                            {activeNode === 'root' ? rootTopic : nodes.find(n => n.id === activeNode)?.label}
                        </h4>
                        <p className="text-[11px] text-theme-muted leading-relaxed">
                            {activeNode === 'root' 
                                ? "Current focal point. Explore interconnected concepts branching from this core." 
                                : (nodes.find(n => n.id === activeNode)?.hasChildren 
                                    ? "Contains subtopics. Click to drill down and explore deeper." 
                                    : "Leaf concept. AI-extracted terminal node.")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeGraph;
