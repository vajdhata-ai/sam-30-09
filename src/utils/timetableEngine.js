/**
 * Competitive Hub — Timetable Generation Engine
 * Pure JS functions — no server needed. Generates & rebalances daily study plans.
 */

/**
 * Generate a full timetable from today to exam date.
 * @param {Array} allTopics - Array of { id, name, chapterName, subjectName, estimatedMinutes }
 * @param {Array} completedTopicIds - IDs of topics already completed
 * @param {string} examDate - ISO date string of the exam
 * @param {number} dailyHours - Hours per day student can study
 * @returns {Array} Array of { date, topics: [topicId, ...] }
 */
export function generateTimetable(allTopics, completedTopicIds, examDate, dailyHours) {
    const remaining = allTopics.filter(t => !completedTopicIds.includes(t.id));
    if (remaining.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    const daysRemaining = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
    const bufferDays = Math.floor(daysRemaining * 0.20);
    const studyDays = Math.max(1, daysRemaining - bufferDays);

    const avgTopicTime = 45; // minutes
    const topicsPerDay = Math.max(1, Math.floor((dailyHours * 60) / avgTopicTime));

    const schedule = [];
    let topicIdx = 0;

    for (let day = 1; day <= studyDays && topicIdx < remaining.length; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        const dayTopics = [];
        for (let i = 0; i < topicsPerDay && topicIdx < remaining.length; i++) {
            dayTopics.push(remaining[topicIdx].id);
            topicIdx++;
        }

        if (dayTopics.length > 0) {
            schedule.push({ date: dateStr, topicIds: dayTopics });
        }
    }

    return schedule;
}

/**
 * Rebalance timetable — called when a topic is completed, missed, or hours change.
 * Deletes future tasks and regenerates.
 */
export function rebalanceTimetable(allTopics, completedTopicIds, examDate, dailyHours) {
    return generateTimetable(allTopics, completedTopicIds, examDate, dailyHours);
}

/**
 * Get today's tasks from a timetable schedule.
 */
export function getTodaysTasks(schedule) {
    const today = new Date().toISOString().split('T')[0];
    return schedule.find(s => s.date === today)?.topicIds || [];
}

/**
 * Calculate study stats.
 */
export function getStudyStats(allTopics, completedTopicIds, examDate) {
    const total = allTopics.length;
    const done = completedTopicIds.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    const today = new Date();
    const exam = new Date(examDate);
    const daysRemaining = Math.max(0, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));

    const remaining = total - done;
    let status = 'on_track';
    if (daysRemaining === 0) status = 'exam_passed';
    else if (remaining > daysRemaining * 3) status = 'behind';
    else if (remaining > daysRemaining * 2) status = 'tight';

    return { total, done, remaining, percent, daysRemaining, status };
}

/**
 * Get time-based greeting.
 */
export function getGreeting(name) {
    const hour = new Date().getHours();
    if (hour < 5) return { text: `Burning midnight oil, ${name}?`, emoji: '🌙' };
    if (hour < 12) return { text: `Good morning, ${name}`, emoji: '☀️' };
    if (hour < 17) return { text: `Good afternoon, ${name}`, emoji: '🌤️' };
    if (hour < 21) return { text: `Good evening, ${name}`, emoji: '🌆' };
    return { text: `Night owl mode, ${name}`, emoji: '🦉' };
}
