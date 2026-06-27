/**
 * NCC Exam Preparation Hub — Question Bank (Unified)
 * Serves questions from the NCC Question Bank.
 */

import { nccQuestionBank } from './nccQuestionBank';

export const QUESTION_BANK = nccQuestionBank;

/** Get questions for a chapter. Returns full array. */
export function getQuestions(chapterId) {
    return QUESTION_BANK[chapterId] || [];
}

/**
 * Get questions filtered by difficulty level.
 * @param {string} chapterId - The chapter ID
 * @param {'easy'|'medium'|'hard'|'all'} difficulty - Difficulty filter
 * @returns {Array} Filtered questions
 */
export function getQuestionsByDifficulty(chapterId, difficulty) {
    const questions = QUESTION_BANK[chapterId] || [];
    if (difficulty === 'all') return questions;
    return questions.filter(q => q.difficulty === difficulty);
}

/** Get question by ID across all chapters */
export function getQuestionById(questionId) {
    for (const questions of Object.values(QUESTION_BANK)) {
        const found = questions.find(q => q.id === questionId);
        if (found) return found;
    }
    return null;
}

/** Get stats for a chapter */
export function getChapterStats(chapterId) {
    const questions = QUESTION_BANK[chapterId] || [];
    return {
        total: questions.length,
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length,
    };
}
