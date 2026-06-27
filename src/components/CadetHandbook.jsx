import React, { useState } from 'react';
import { BookOpen, Shield, Award, Users, Star, ChevronRight, Menu, X, Music } from './Icons';
import MarkdownDisplay from './MarkdownDisplay';

const HANDBOOK_SECTIONS = [
    {
        id: 'ncc_song',
        title: 'The NCC Song',
        icon: Music,
        content: `
# The NCC Song: Hum Sab Bharatiya Hain

**Hum Sab Bharatiya Hain, Hum Sab Bharatiya Hain**
Apni Manzil Ek Hai,
Ha, Ha, Ha, Ek Hai,
Ho, Ho, Ho, Ek Hai.
Hum Sab Bharatiya Hain.

Kashmir Ki Dharti Rani Hai,
Sartaj Himalaya Hai,
Saadiyon Se Humne Isko Apne Khoon Se Pala Hai
Desh Ki Raksha Ki Khatir Hum Shamshir Utha Lenge,
Hum Shamshir Utha Lenge.

Bikhre Bikhre Taare Hain Hum Lekin Jhilmil Ek Hai,
Ha, Ha, Ha, Ek Hai
Hum Sab Bharatiya Hain.

Mandir Gurudwaare Bhi Hain Yahan
Aur Masjid Bhi Hai Yahan
Girija Ka Hai Ghariyaal Kahin
Mullah ki Kahin Hai Ajaan

Ek Hee Apna Ram Hain, Ek hi Allah Taala Hai,
Ek Hee Allah Taala Hai, Raang Birange Deepak Hain Hum,
lekin Jagmag Ek Hai, Ha Ha Ha Ek Hai, Ho Ho Ho Ek Hai.
Hum Sab Bharatiya Hain, Hum Sab Bharatiya Hain.
        `
    },
    {
        id: 'code_of_conduct',
        title: 'Code of Conduct & Ethics',
        icon: Shield,
        content: `
# Code of Conduct & Ethics

### The NCC Pledge
"We the cadets of the National Cadet Corps, do solemnly pledge that we shall always uphold the unity of India. We resolve to be disciplined and responsible citizens of our nation. We shall undertake positive community service in the spirit of secularism and equality, and never use violence to settle disputes."

### Core Principles
- **Obey with a smile**: Discipline is the bedrock of the NCC.
- **Be Punctual**: Time management is critical for operations.
- **Work hard and without fuss**: Duties must be performed diligently.
- **Make no excuses and tell no lies**: Integrity above all.
        `
    },
    {
        id: 'ranks',
        title: 'Rank Structure',
        icon: Star,
        content: `
# Rank Structure

The National Cadet Corps follows a strict rank hierarchy corresponding to the armed forces.

- **Senior Under Officer (SUO)**: The highest rank a cadet can achieve. Wears 2 golden stripes on shoulder badges.
- **Under Officer (UO)**: Junior to SUO. Wears 1 golden stripe.
- **Company Sergeant Major (CSM)**: Wears the Ashoka Lion badge on the right sleeve.
- **Company Quarter Master Sergeant (CQMS)**: Responsible for stores. Wears Ashoka Lion with 3 chevrons.
- **Sergeant (SGT)**: 3 chevrons on the right sleeve.
- **Corporal (CPL)**: 2 chevrons on the right sleeve.
- **Lance Corporal (LCPL)**: 1 chevron on the right sleeve.
- **Cadet**: The foundational rank.
        `
    },
    {
        id: 'daily_routine',
        title: 'Daily Routine & Camp Life',
        icon: Users,
        content: `
# Daily Routine & Camp Life

### Typical Camp Routine
- **05:30 hrs**: Reveille (Wake up call)
- **06:00 - 07:00 hrs**: Fall-in & Physical Training (PT)
- **07:30 - 08:30 hrs**: Breakfast & Wash
- **09:00 - 12:30 hrs**: Drill, Weapon Training, and Lectures
- **13:00 - 14:00 hrs**: Lunch Break
- **14:30 - 16:30 hrs**: Specialized Subject Classes
- **17:00 - 18:00 hrs**: Sports & Games
- **19:00 hrs**: Roll Call
- **20:00 hrs**: Dinner
- **22:00 hrs**: Lights Out

> **Note:** Timings may vary based on the specific camp (ATC, RDC, TSC, etc.)
        `
    },
    {
        id: 'certificates',
        title: 'Certificates & Benefits',
        icon: Award,
        content: `
# Certificates & Benefits

### 'A' Certificate
Awarded to Junior Division/Wing cadets after 2 years of training.
- **Benefits**: Bonus marks in some state-level exams.

### 'B' Certificate
Awarded to Senior Division/Wing cadets after 1st year of training and 1 camp.
- **Benefits**: Bonus marks in paramilitary recruitment, reservation in state police.

### 'C' Certificate
The highest certificate. Requires 'B' cert, 2 years of SD/SW training, and 2 camps.
- **Benefits**: 
  - Direct entry to the armed forces (SSB interview only, no written exam for CDS/NDA in special entries).
  - Bonus marks in CAPF (BSF, CRPF, CISF, ITBP).
  - Preference in state and central government jobs.
        `
    },
    {
        id: 'drill',
        title: 'Drill (Common Subject)',
        icon: Users,
        content: `
# Drill (Common Subject)

### Fundamentals of Drill
- **Aim**: To inculcate a sense of discipline, improve bearing, smartness in appearance, and turn out.
- **Words of Command**: Every command has two parts: Cautionary and Executive.
- **Savdhan (Attention)**: Heels together, feet at 30 degrees, arms straight by the side, head up, eyes looking straight.
- **Vishram (Stand at Ease)**: Left foot carried 12 inches to the left, hands behind the back (right over left).
- **Saluting**: Acknowledging the rank and paying respect. Always done with the right hand.
        `
    },
    {
        id: 'weapon_training',
        title: 'Weapon Training (Common Subject)',
        icon: Shield,
        content: `
# Weapon Training (Common Subject)

### Characteristics of .22 Deluxe Rifle
- **Length**: 43 inches
- **Weight**: 6 lbs 2 oz
- **Magazine Capacity**: 5 rounds
- **Muzzle Velocity**: 2700 feet per second
- **Effective Range**: 25 yards

### Safety Precautions
1. Always treat the weapon as loaded.
2. Never point a weapon at anyone playfully.
3. Ensure the chamber is clear before handing over or taking charge.
        `
    },
    {
        id: 'map_reading',
        title: 'Map Reading (Specialized Subject)',
        icon: BookOpen,
        content: `
# Map Reading (Specialized Subject)

### Basics of Map Reading
- **Definition**: A map is a proportional representation of a portion of the earth's surface drawn on a flat surface.
- **Conventional Signs**: Symbols used to represent ground features (e.g., roads, rivers, temples).
- **Grid Lines**: Purple/black lines running North-South (Eastings) and East-West (Northings).
- **Finding North**: Can be found using a Prismatic Compass, Pole Star, Sun, or a watch.

### Types of North
1. **True North** (Geographical North Pole)
2. **Magnetic North** (Pointed by the compass needle)
3. **Grid North** (Direction of vertical grid lines)
        `
    }
];

const CadetHandbook = () => {
    const [activeSectionId, setActiveSectionId] = useState(HANDBOOK_SECTIONS[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeSection = HANDBOOK_SECTIONS.find(s => s.id === activeSectionId);

    return (
        <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-hidden relative font-sans">
            
            {/* Header Banner */}
            <div className="w-full bg-theme-surface border-b border-theme-border py-4 px-6 flex items-center justify-between z-20 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-theme-primary/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                    <button 
                        className="md:hidden p-2 bg-theme-bg rounded-lg border border-theme-border text-theme-text"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-theme-primary/15 border border-theme-primary/30 rounded-xl flex items-center justify-center text-theme-primary shadow-[0_0_15px_rgba(var(--theme-primary),0.3)]">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-theme-text tracking-wide uppercase">Cadet Handbook</h1>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-theme-muted">Field Manual v2.0</p>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3 relative z-10 bg-theme-bg/50 px-4 py-2 rounded-xl border border-theme-border">
                    <Shield className="w-4 h-4 text-theme-primary" />
                    <span className="text-xs font-bold text-theme-text uppercase tracking-widest">Unity and Discipline</span>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Index */}
                <div className={`
                    absolute md:static inset-y-0 left-0 z-50 w-72 bg-theme-surface border-r border-theme-border transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-4 border-b border-theme-border flex items-center justify-between bg-theme-bg/30">
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">Table of Contents</span>
                        <button className="md:hidden text-theme-muted" onClick={() => setIsSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                        {HANDBOOK_SECTIONS.map((section, idx) => {
                            const Icon = section.icon;
                            const isActive = activeSectionId === section.id;
                            
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setActiveSectionId(section.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-6 py-3 text-left transition-all relative
                                        ${isActive ? 'bg-theme-primary/10 text-theme-primary' : 'text-theme-muted hover:bg-theme-surface hover:text-theme-text'}
                                    `}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-theme-primary shadow-[0_0_10px_rgba(var(--theme-primary),1)]" />}
                                    
                                    <div className="flex-shrink-0 opacity-80">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-sm font-bold truncate block ${isActive ? 'text-theme-primary' : ''}`}>
                                            {idx + 1}. {section.title}
                                        </span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-theme-bg relative">
                    <div className="max-w-4xl mx-auto p-6 md:p-10 lg:p-14">
                        
                        {/* Chapter Header */}
                        <div className="mb-10 pb-6 border-b-2 border-theme-border relative">
                            <div className="absolute -bottom-[2px] left-0 w-24 h-[2px] bg-theme-primary" />
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-theme-surface border border-theme-border rounded-2xl flex items-center justify-center text-theme-muted shadow-inner">
                                    <activeSection.icon className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold text-theme-primary tracking-widest uppercase">
                                    Chapter {HANDBOOK_SECTIONS.findIndex(s => s.id === activeSectionId) + 1}
                                </span>
                            </div>
                            {/* The title is technically inside the markdown content now, but we keep this structural header for aesthetics */}
                        </div>

                        {/* Content Body using MarkdownDisplay */}
                        <div className="bg-theme-surface/30 rounded-3xl p-6 md:p-10 border border-theme-border/50 shadow-sm relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <MarkdownDisplay content={activeSection.content} />
                        </div>
                        
                        {/* Footer Navigation */}
                        <div className="mt-10 flex justify-between items-center text-sm font-bold text-theme-muted">
                            <div>SAMVADA NCC PORTAL</div>
                            <div className="uppercase tracking-widest">END OF CHAPTER</div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CadetHandbook;
