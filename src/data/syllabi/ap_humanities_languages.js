export const AP_US_HIST_SYLLABUS = {
    examSlug: 'ap-us-hist',
    subjects: [
        {
            name: 'US History Periods', order: 1,
            chapters: [
                {
                    name: 'Early America (1491-1800)', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'apush-1', name: 'Period 1: 1491-1607', order: 1, examFrequency: 'low', weightage: 3, priority: 'normal' },
                        { id: 'apush-2', name: 'Period 2: 1607-1754', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'apush-3', name: 'Period 3: 1754-1800', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: '19th Century (1800-1898)', order: 2, estimatedHours: 20,
                    topics: [
                        { id: 'apush-4', name: 'Period 4: 1800-1848', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apush-5', name: 'Period 5: 1844-1877', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apush-6', name: 'Period 6: 1865-1898', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Modern America (1890-Present)', order: 3, estimatedHours: 20,
                    topics: [
                        { id: 'apush-7', name: 'Period 7: 1890-1945', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apush-8', name: 'Period 8: 1945-1980', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apush-9', name: 'Period 9: 1980-Present', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};

export const AP_PSYCH_SYLLABUS = {
    examSlug: 'ap-psych',
    subjects: [
        {
            name: 'Psychology Units', order: 1,
            chapters: [
                {
                    name: 'Foundations & Biological Bases', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'appsych-1', name: 'Scientific Foundations of Psychology', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appsych-2', name: 'Biological Bases of Behavior', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appsych-3', name: 'Sensation and Perception', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                },
                {
                    name: 'Cognition & Development', order: 2, estimatedHours: 15,
                    topics: [
                        { id: 'appsych-4', name: 'Learning', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appsych-5', name: 'Cognitive Psychology', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appsych-6', name: 'Developmental Psychology', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                },
                {
                    name: 'Clinical & Social', order: 3, estimatedHours: 15,
                    topics: [
                        { id: 'appsych-7', name: 'Motivation, Emotion, and Personality', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appsych-8', name: 'Clinical Psychology', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appsych-9', name: 'Social Psychology', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};

// Generic AP Generator for languages and highly specific arts to keep the codebase optimal
export const makeGenericAPSyllabus = (name, slug) => ({
    examSlug: slug,
    subjects: [
        {
            name: name, order: 1,
            chapters: [
                {
                    name: 'Core Concepts & Skills', order: 1, estimatedHours: 20,
                    topics: [
                        { id: `${slug}-1`, name: 'Foundational Knowledge & Principles', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: `${slug}-2`, name: 'Advanced Application and Analysis', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
});
