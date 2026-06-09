import React, { useState } from 'react';
import { BookOpen, Shield, Award, Users, Star, ChevronRight, ChevronDown } from './Icons';

const HANDBOOK_SECTIONS = [
    {
        id: 'code_of_conduct',
        title: 'Code of Conduct & Ethics',
        icon: Shield,
        content: `
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

*Note: Timings may vary based on the specific camp (ATC, RDC, TSC, etc.)*
        `
    },
    {
        id: 'certificates',
        title: 'Certificates & Benefits',
        icon: Award,
        content: `
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
### Basics of Map Reading
- **Definition**: A map is a proportional representation of a portion of the earth's surface drawn on a flat surface.
- **Conventional Signs**: Symbols used to represent ground features (e.g., roads, rivers, temples).
- **Grid Lines**: Purple/black lines running North-South (Eastings) and East-West (Northings).
- **Finding North**: Can be found using a Prismatic Compass, Pole Star, Sun, or a watch.
- **Types of North**:
  1. True North (Geographical North Pole)
  2. Magnetic North (Pointed by the compass needle)
  3. Grid North (Direction of vertical grid lines)
        `
    }
];

const CadetHandbook = () => {
    const [openSection, setOpenSection] = useState(HANDBOOK_SECTIONS[0].id);

    return (
        <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-y-auto custom-scrollbar p-6 md:p-10">
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-theme-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-theme-primary/20">
                        <BookOpen className="w-8 h-8 text-theme-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-theme-text mb-3">Cadet Handbook</h1>
                    <p className="text-theme-muted text-sm md:text-base max-w-2xl mx-auto">
                        Your comprehensive guide to NCC protocols, conduct, structure, and operational guidelines.
                    </p>
                </div>

                {/* Accordion Sections */}
                <div className="space-y-4">
                    {HANDBOOK_SECTIONS.map((section) => {
                        const Icon = section.icon;
                        const isOpen = openSection === section.id;

                        return (
                            <div 
                                key={section.id} 
                                className={`
                                    rounded-2xl transition-all duration-300 overflow-hidden border
                                    ${isOpen ? 'bg-theme-surface border-theme-primary/30 shadow-lg shadow-theme-primary/5' : 'bg-theme-surface/50 border-theme-border hover:border-theme-primary/20'}
                                `}
                            >
                                <button
                                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-theme-primary text-theme-bg' : 'bg-theme-bg text-theme-primary border border-theme-primary/20'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-lg font-bold text-theme-text">{section.title}</h2>
                                    </div>
                                    <div className={`transition-transform duration-300 text-theme-muted ${isOpen ? 'rotate-180 text-theme-primary' : ''}`}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </button>

                                <div 
                                    className={`
                                        transition-all duration-500 ease-in-out
                                        ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                                    `}
                                >
                                    <div className="px-6 pb-6 pt-2 border-t border-theme-border/50">
                                        <div 
                                            className="prose prose-invert prose-theme max-w-none text-sm md:text-base text-theme-muted
                                            prose-h3:text-theme-primary prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                                            prose-ul:my-2 prose-li:my-1 prose-strong:text-theme-text"
                                            dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>').replace(/### (.*?)<br\/>/g, '<h3>$1</h3>').replace(/- \*\*(.*?)\*\*(.*?)<br\/>/g, '<li><strong>$1</strong>$2</li>').replace(/- (.*?)<br\/>/g, '<li>$1</li>') }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CadetHandbook;
