/**
 * Competitive Hub — Static Exam Content
 * UNIFORM DATA: Same content for every user. Never regenerated.
 * This is the single source of truth for all exam content.
 */

import { JEE_SYLLABUS, NEET_SYLLABUS } from './syllabi/jee_neet';
import { SAT_SYLLABUS, ACT_SYLLABUS, CLAT_SYLLABUS, NDA_SYLLABUS } from './syllabi/sat_act_clat_nda';
import { IELTS_SYLLABUS, TOEFL_SYLLABUS, GRE_SYLLABUS, GMAT_SYLLABUS, UPSC_SYLLABUS } from './syllabi/english_grad_upsc';
import { AP_CALC_BC_SYLLABUS, AP_PHYSICS_C_SYLLABUS, AP_CHEMISTRY_SYLLABUS, AP_BIO_SYLLABUS, AP_PHYSICS_1_SYLLABUS, AP_CSA_SYLLABUS } from './syllabi/ap_math_science';
import { AP_US_HIST_SYLLABUS, AP_PSYCH_SYLLABUS, makeGenericAPSyllabus } from './syllabi/ap_humanities_languages';

// ═══════════════════════════════════════
//  EXAM DEFINITIONS
// ═══════════════════════════════════════
export const COMPETITIVE_EXAMS = [
    { slug: 'jee-mains', name: 'JEE Mains', country: 'India', flag: '🇮🇳', tagline: "India's toughest engineering exam", priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'neet', name: 'NEET', country: 'India', flag: '🇮🇳', tagline: 'The gateway to medical colleges', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'sat', name: 'SAT', country: 'USA', flag: '🇺🇸', tagline: 'Your ticket to top US universities', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'act', name: 'ACT', country: 'USA', flag: '🇺🇸', tagline: 'College readiness assessment', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'clat', name: 'CLAT', country: 'India', flag: '🇮🇳', tagline: 'Path to top law schools', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'nda', name: 'NDA', country: 'India', flag: '🇮🇳', tagline: 'Serve the nation with honour', priceINR: 999, priceUSD: 12, isActive: true },
    
    // NEW ADDITIONS
    { slug: 'ielts', name: 'IELTS', country: 'UK', flag: '🇬🇧', tagline: 'Global English proficiency standard', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'toefl', name: 'TOEFL', country: 'USA', flag: '🇺🇸', tagline: 'US University English requirement', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'ap-group', name: 'Advanced Placement (AP)', country: 'USA', flag: '🎓', tagline: 'Select specific AP Subjects...', priceINR: 999, priceUSD: 12, isActive: true, isGroup: true },
    { slug: 'gre', name: 'GRE', country: 'Global', flag: '🎓', tagline: 'Standardized graduate admissions', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'gmat', name: 'GMAT', country: 'Global', flag: '💼', tagline: 'Top-tier business school gateway', priceINR: 999, priceUSD: 12, isActive: true },
    { slug: 'upsc', name: 'UPSC CSE', country: 'India', flag: '🏛️', tagline: 'The Indian Civil Services Examination', priceINR: 999, priceUSD: 12, isActive: true },
    
    // SPECIFIC AP SUBJECTS (Hidden from main list, active via isAP filter)
    { slug: 'ap-calc-bc', name: 'AP Calculus BC', country: 'USA', flag: '📐', tagline: 'Advanced College Board Math', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-physics-c', name: 'AP Physics C', country: 'USA', flag: '⚛️', tagline: 'Calculus-based Mechanics & E&M', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-chem', name: 'AP Chemistry', country: 'USA', flag: '🧪', tagline: 'Advanced Chemical Principles', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-cs-a', name: 'AP Computer Science A', country: 'USA', flag: '💻', tagline: 'Java & Object-Oriented Design', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-bio', name: 'AP Biology', country: 'USA', flag: '🧬', tagline: 'Evolution, Genetics, & Ecology', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-phys-1', name: 'AP Physics 1', country: 'USA', flag: '🍎', tagline: 'Algebra-Based', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-phys-2', name: 'AP Physics 2', country: 'USA', flag: '⚡', tagline: 'Algebra-Based', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-phys-c-em', name: 'AP Physics C: E&M', country: 'USA', flag: '🧲', tagline: 'Electricity and Magnetism', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-us-hist', name: 'AP US History', country: 'USA', flag: '🦅', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-psych', name: 'AP Psychology', country: 'USA', flag: '🧠', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    
    // GENERIC APs
    { slug: 'ap-2d-art', name: 'AP 2-D Art and Design', country: 'USA', flag: '🎨', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-3d-art', name: 'AP 3-D Art and Design', country: 'USA', flag: '🏺', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-art-history', name: 'AP Art History', country: 'USA', flag: '🖼️', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-drawing', name: 'AP Drawing', country: 'USA', flag: '✏️', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-music-theory', name: 'AP Music Theory', country: 'USA', flag: '🎼', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-eng-lang', name: 'AP English Language', country: 'USA', flag: '✍️', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-eng-lit', name: 'AP English Literature', country: 'USA', flag: '📚', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-afam', name: 'AP African American Studies', country: 'USA', flag: '🌍', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-comp-gov', name: 'AP Comparative Gov', country: 'USA', flag: '🏛️', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-euro', name: 'AP European History', country: 'USA', flag: '🏰', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-human-geo', name: 'AP Human Geography', country: 'USA', flag: '🗺️', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-macro', name: 'AP Macroeconomics', country: 'USA', flag: '📈', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-micro', name: 'AP Microeconomics', country: 'USA', flag: '📉', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-us-gov', name: 'AP US Government', country: 'USA', flag: '🇺🇸', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-world', name: 'AP World History', country: 'USA', flag: '🌍', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-precalc', name: 'AP Precalculus', country: 'USA', flag: '📐', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-calc-ab', name: 'AP Calculus AB', country: 'USA', flag: '📈', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-csp', name: 'AP Computer Science Principles', country: 'USA', flag: '💻', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-stats', name: 'AP Statistics', country: 'USA', flag: '📊', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-enviro', name: 'AP Environmental Science', country: 'USA', flag: '🌱', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-chinese', name: 'AP Chinese', country: 'USA', flag: '🇨🇳', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-french', name: 'AP French', country: 'USA', flag: '🇫🇷', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-german', name: 'AP German', country: 'USA', flag: '🇩🇪', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-italian', name: 'AP Italian', country: 'USA', flag: '🇮🇹', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-japanese', name: 'AP Japanese', country: 'USA', flag: '🇯🇵', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-latin', name: 'AP Latin', country: 'USA', flag: '🏛️', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-spanish-lang', name: 'AP Spanish Language', country: 'USA', flag: '🇪🇸', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-spanish-lit', name: 'AP Spanish Literature', country: 'USA', flag: '📖', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-seminar', name: 'AP Seminar', country: 'USA', flag: '🗣️', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
    { slug: 'ap-research', name: 'AP Research', country: 'USA', flag: '🔬', tagline: 'Advanced Placement Subject', priceINR: 999, priceUSD: 12, isActive: true, isAP: true },
];

export const SYLLABI = {
    'jee-mains': JEE_SYLLABUS,
    'neet': NEET_SYLLABUS,
    'sat': SAT_SYLLABUS,
    'act': ACT_SYLLABUS,
    'clat': CLAT_SYLLABUS,
    'nda': NDA_SYLLABUS,
    'ielts': IELTS_SYLLABUS,
    'toefl': TOEFL_SYLLABUS,
    'ap-calc-bc': AP_CALC_BC_SYLLABUS,
    'ap-physics-c': AP_PHYSICS_C_SYLLABUS,
    'ap-chem': AP_CHEMISTRY_SYLLABUS,
    'ap-cs-a': AP_CSA_SYLLABUS,
    'ap-bio': AP_BIO_SYLLABUS,
    'ap-phys-1': AP_PHYSICS_1_SYLLABUS,
    'gre': GRE_SYLLABUS,
    'gmat': GMAT_SYLLABUS,
    'upsc': UPSC_SYLLABUS,
    'ap-us-hist': AP_US_HIST_SYLLABUS,
    'ap-psych': AP_PSYCH_SYLLABUS,
    'ap-phys-2': makeGenericAPSyllabus('AP Physics 2', 'ap-phys-2'),
    'ap-phys-c-em': makeGenericAPSyllabus('AP Physics C: E&M', 'ap-phys-c-em'),
    'ap-2d-art': makeGenericAPSyllabus('AP 2-D Art and Design', 'ap-2d-art'),
    'ap-3d-art': makeGenericAPSyllabus('AP 3-D Art and Design', 'ap-3d-art'),
    'ap-art-history': makeGenericAPSyllabus('AP Art History', 'ap-art-history'),
    'ap-drawing': makeGenericAPSyllabus('AP Drawing', 'ap-drawing'),
    'ap-music-theory': makeGenericAPSyllabus('AP Music Theory', 'ap-music-theory'),
    'ap-eng-lang': makeGenericAPSyllabus('AP English Language', 'ap-eng-lang'),
    'ap-eng-lit': makeGenericAPSyllabus('AP English Literature', 'ap-eng-lit'),
    'ap-afam': makeGenericAPSyllabus('AP African American Studies', 'ap-afam'),
    'ap-comp-gov': makeGenericAPSyllabus('AP Comparative Gov', 'ap-comp-gov'),
    'ap-euro': makeGenericAPSyllabus('AP European History', 'ap-euro'),
    'ap-human-geo': makeGenericAPSyllabus('AP Human Geography', 'ap-human-geo'),
    'ap-macro': makeGenericAPSyllabus('AP Macroeconomics', 'ap-macro'),
    'ap-micro': makeGenericAPSyllabus('AP Microeconomics', 'ap-micro'),
    'ap-us-gov': makeGenericAPSyllabus('AP US Government', 'ap-us-gov'),
    'ap-world': makeGenericAPSyllabus('AP World History', 'ap-world'),
    'ap-precalc': makeGenericAPSyllabus('AP Precalculus', 'ap-precalc'),
    'ap-calc-ab': makeGenericAPSyllabus('AP Calculus AB', 'ap-calc-ab'),
    'ap-csp': makeGenericAPSyllabus('AP Computer Science Principles', 'ap-csp'),
    'ap-stats': makeGenericAPSyllabus('AP Statistics', 'ap-stats'),
    'ap-enviro': makeGenericAPSyllabus('AP Environmental Science', 'ap-enviro'),
    'ap-chinese': makeGenericAPSyllabus('AP Chinese', 'ap-chinese'),
    'ap-french': makeGenericAPSyllabus('AP French', 'ap-french'),
    'ap-german': makeGenericAPSyllabus('AP German', 'ap-german'),
    'ap-italian': makeGenericAPSyllabus('AP Italian', 'ap-italian'),
    'ap-japanese': makeGenericAPSyllabus('AP Japanese', 'ap-japanese'),
    'ap-latin': makeGenericAPSyllabus('AP Latin', 'ap-latin'),
    'ap-spanish-lang': makeGenericAPSyllabus('AP Spanish Language', 'ap-spanish-lang'),
    'ap-spanish-lit': makeGenericAPSyllabus('AP Spanish Literature', 'ap-spanish-lit'),
    'ap-seminar': makeGenericAPSyllabus('AP Seminar', 'ap-seminar'),
    'ap-research': makeGenericAPSyllabus('AP Research', 'ap-research'),
};

/** Get flat list of all topics for an exam */
export function getAllTopics(examSlug) {
    const syllabus = SYLLABI[examSlug];
    if (!syllabus) return [];
    const topics = [];
    syllabus.subjects.forEach(subj => {
        subj.chapters.forEach(chap => {
            chap.topics.forEach(topic => {
                topics.push({
                    ...topic,
                    subjectName: subj.name,
                    chapterName: chap.name,
                    estimatedMinutes: 45,
                });
            });
        });
    });
    return topics;
}

/** Get a specific topic by ID */
export function getTopicById(examSlug, topicId) {
    return getAllTopics(examSlug).find(t => t.id === topicId) || null;
}
