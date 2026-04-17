/**
 * Competitive Hub — Question Bank (Unified)
 * Merges all exam question banks into a single source.
 * Normalizes legacy JEE format to the unified schema:
 *   { id, text, options: [str,str,str,str], correctAnswer, explanation, difficulty, tags }
 */

import { NDA_QUESTION_BANK } from './ndaQuestionBank';

// ═══════════════════════════════════════
//  LEGACY JEE QUESTIONS (normalized)
// ═══════════════════════════════════════

const JEE_QUESTIONS_RAW = {
    'jee-phy-unit-1': [
        { id: 'Q-JEE-PHY-U1-E01', questionText: 'Which of the following is NOT a base SI unit?', optionA: 'Kilogram', optionB: 'Newton', optionC: 'Ampere', optionD: 'Kelvin', correct: 'B', explanation: 'Newton is a derived unit (kg·m/s²). The 7 base SI units are: metre, kilogram, second, ampere, kelvin, mole, candela.', whyWrongA: 'Kilogram IS a base SI unit for mass.', whyWrongC: 'Ampere IS a base SI unit for electric current.', whyWrongD: 'Kelvin IS a base SI unit for temperature.', difficulty: 'easy', patternType: 'conceptual' },
        { id: 'Q-JEE-PHY-U1-E02', questionText: 'The number of significant figures in 0.00340 is:', optionA: '2', optionB: '3', optionC: '5', optionD: '6', correct: 'B', explanation: 'Leading zeros are NOT significant. Only 3, 4, and the trailing 0 are significant = 3 sig figs.', whyWrongA: 'You forgot the trailing zero which IS significant.', whyWrongC: 'Leading zeros before 3 are not significant.', whyWrongD: 'You counted all digits including leading zeros.', difficulty: 'easy', patternType: 'conceptual' },
        { id: 'Q-JEE-PHY-U1-M01', questionText: 'If force (F), velocity (V), and time (T) are taken as fundamental quantities, the dimensions of mass are:', optionA: '[FVT⁻¹]', optionB: '[FV⁻¹T]', optionC: '[FV⁻¹T⁰]', optionD: '[FVT]', correct: 'C', explanation: 'F = ma → m = F/a = F/(V/T) = FT/V. But since V = LT⁻¹ and F = MLT⁻², solving gives m = [FV⁻¹T⁰].', difficulty: 'medium', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-U1-M02', questionText: 'A wire has mass (0.3 ± 0.003) g, radius (0.5 ± 0.005) mm, and length (6 ± 0.06) cm. Maximum percentage error in density is:', optionA: '1%', optionB: '3%', optionC: '4%', optionD: '5%', correct: 'C', explanation: 'ρ = m/(πr²l). Δρ/ρ = Δm/m + 2(Δr/r) + Δl/l = 1% + 2(1%) + 1% = 4%.', difficulty: 'medium', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-U1-H01', questionText: 'The dimensions of (μ₀ε₀)⁻¹/² are same as:', optionA: 'Velocity', optionB: 'Acceleration', optionC: 'Force', optionD: 'Energy', correct: 'A', explanation: 'c = 1/√(μ₀ε₀) — the speed of light. So (μ₀ε₀)⁻¹/² has dimensions of velocity [LT⁻¹].', difficulty: 'hard', patternType: 'conceptual' },
    ],
    'jee-phy-kine-1': [
        { id: 'Q-JEE-PHY-K1-E01', questionText: 'A car travels 40 km north then 30 km east. The displacement is:', optionA: '70 km', optionB: '50 km', optionC: '10 km', optionD: '35 km', correct: 'B', explanation: 'Displacement = √(40² + 30²) = √2500 = 50 km.', difficulty: 'easy', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-K1-E02', questionText: 'A ball is thrown vertically upward with velocity 20 m/s. The maximum height reached is (g = 10 m/s²):', optionA: '10 m', optionB: '20 m', optionC: '40 m', optionD: '5 m', correct: 'B', explanation: 'v² = u² − 2gh → 0 = 400 − 20h → h = 20 m.', difficulty: 'easy', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-K1-M01', questionText: 'A particle moves with v = 2t + 3t² m/s. The displacement in the first 2 seconds is:', optionA: '10 m', optionB: '12 m', optionC: '16 m', optionD: '14 m', correct: 'B', explanation: 's = ∫₀² (2t + 3t²)dt = [t² + t³]₀² = 4 + 8 = 12 m.', difficulty: 'medium', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-K1-M02', questionText: 'In a v-t graph, the area under the curve represents:', optionA: 'Acceleration', optionB: 'Velocity', optionC: 'Displacement', optionD: 'Force', correct: 'C', explanation: 'Area under v-t graph = ∫v·dt = displacement.', difficulty: 'medium', patternType: 'conceptual' },
        { id: 'Q-JEE-PHY-K1-H01', questionText: 'Two balls are dropped from heights h and 2h simultaneously. The ratio of times to reach the ground is:', optionA: '1:2', optionB: '1:√2', optionC: '1:4', optionD: '√2:1', correct: 'B', explanation: 'h = ½gt² → t = √(2h/g). Ratio = √h : √(2h) = 1 : √2.', difficulty: 'hard', patternType: 'numerical' },
    ],
    'jee-phy-laws-1': [
        { id: 'Q-JEE-PHY-L1-E01', questionText: "Newton's third law states that action and reaction forces:", optionA: 'Act on the same body', optionB: 'Act on different bodies', optionC: 'May or may not cancel', optionD: 'Are always unequal', correct: 'B', explanation: 'Action and reaction ALWAYS act on two DIFFERENT bodies.', difficulty: 'easy', patternType: 'conceptual' },
        { id: 'Q-JEE-PHY-L1-E02', questionText: 'A 5 kg block is on a smooth surface. A force of 10 N acts on it. The acceleration is:', optionA: '5 m/s²', optionB: '2 m/s²', optionC: '10 m/s²', optionD: '50 m/s²', correct: 'B', explanation: 'F = ma → a = F/m = 10/5 = 2 m/s².', difficulty: 'easy', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-L1-M01', questionText: 'A man of mass 60 kg is in a lift accelerating upward at 2 m/s². His apparent weight is (g=10):', optionA: '600 N', optionB: '720 N', optionC: '480 N', optionD: '120 N', correct: 'B', explanation: 'N = m(g+a) = 60(10+2) = 720 N.', difficulty: 'medium', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-L1-M02', questionText: 'Two blocks of 2 kg and 3 kg are connected by a string on a smooth surface. A force of 25 N pulls the 3 kg block. Tension in the string is:', optionA: '10 N', optionB: '15 N', optionC: '20 N', optionD: '5 N', correct: 'A', explanation: 'Total a = 25/(2+3) = 5 m/s². Tension = m₁×a = 2×5 = 10 N.', difficulty: 'medium', patternType: 'numerical' },
        { id: 'Q-JEE-PHY-L1-H01', questionText: 'Three blocks of masses 1, 2, 3 kg are connected in series on a smooth surface. A 12 N force pulls the 3 kg block. The force exerted by the 2 kg block on the 1 kg block is:', optionA: '6 N', optionB: '4 N', optionC: '2 N', optionD: '8 N', correct: 'C', explanation: 'System acceleration a = 12/(1+2+3) = 2 m/s². Force on 1 kg block = 1×2 = 2 N.', difficulty: 'hard', patternType: 'numerical' },
    ],
};

// ═══════════════════════════════════════
//  NORMALIZE LEGACY FORMAT → UNIFIED
// ═══════════════════════════════════════

function normalizeLegacyQuestion(q) {
    // Already in new format
    if (q.text && q.options) return q;

    // Legacy JEE format → new format
    return {
        id: q.id,
        text: q.questionText,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correct,
        explanation: q.explanation,
        difficulty: q.difficulty || 'medium',
        tags: [q.patternType || 'general', 'JEE'],
    };
}

function normalizeLegacyBank(bank) {
    const normalized = {};
    for (const [topicId, questions] of Object.entries(bank)) {
        normalized[topicId] = questions.map(normalizeLegacyQuestion);
    }
    return normalized;
}

// ═══════════════════════════════════════
//  MERGED QUESTION BANK
// ═══════════════════════════════════════

const NORMALIZED_JEE = normalizeLegacyBank(JEE_QUESTIONS_RAW);

export const QUESTION_BANK = {
    ...NORMALIZED_JEE,
    ...NDA_QUESTION_BANK,
};

/** Get questions for a topic. Returns full array. */
export function getQuestions(topicId) {
    return QUESTION_BANK[topicId] || [];
}

/**
 * Get questions filtered by difficulty level.
 * @param {string} topicId - The topic ID
 * @param {'easy'|'medium'|'hard'|'pyq'|'all'} difficulty - Difficulty filter
 * @returns {Array} Filtered questions
 */
export function getQuestionsByDifficulty(topicId, difficulty) {
    const questions = QUESTION_BANK[topicId] || [];
    if (difficulty === 'all') return questions;
    if (difficulty === 'pyq') return questions.filter(q => q.isPYQ === true);
    return questions.filter(q => q.difficulty === difficulty);
}

/** Get question by ID across all topics */
export function getQuestionById(questionId) {
    for (const questions of Object.values(QUESTION_BANK)) {
        const found = questions.find(q => q.id === questionId);
        if (found) return found;
    }
    return null;
}

/** Get stats for a topic */
export function getTopicStats(topicId) {
    const questions = QUESTION_BANK[topicId] || [];
    return {
        total: questions.length,
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length,
        pyq: questions.filter(q => q.isPYQ).length,
    };
}
