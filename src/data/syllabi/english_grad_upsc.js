export const IELTS_SYLLABUS = {
    examSlug: 'ielts',
    subjects: [
        {
            name: 'Listening', order: 1,
            chapters: [
                {
                    name: 'Listening Skills', order: 1, estimatedHours: 10,
                    topics: [
                        { id: 'ielts-lis-1', name: 'Understanding Form/Note/Table Completion', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'ielts-lis-2', name: 'Multiple Choice & Short Answers', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'ielts-lis-3', name: 'Matching & Plan/Map Labelling', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Reading', order: 2,
            chapters: [
                {
                    name: 'Reading Strategies', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'ielts-read-1', name: 'Skimming and Scanning', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'ielts-read-2', name: 'True/False/Not Given & Yes/No/NG', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'ielts-read-3', name: 'Matching Headings & Features', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'ielts-read-4', name: 'Summary & Sentence Completion', order: 4, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Writing', order: 3,
            chapters: [
                {
                    name: 'Writing Task 1 & 2', order: 1, estimatedHours: 20,
                    topics: [
                        { id: 'ielts-writ-1', name: 'Task 1: Graph/Chart Analysis (Academic)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'ielts-writ-2', name: 'Task 1: Letter Writing (General)', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'ielts-writ-3', name: 'Task 2: Essay Structure & Argumentation', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Speaking', order: 4,
            chapters: [
                {
                    name: 'Speaking Phases', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'ielts-speak-1', name: 'Part 1: Introduction & Interview', order: 1, examFrequency: 'high', weightage: 4, priority: 'normal' },
                        { id: 'ielts-speak-2', name: 'Part 2: Long Turn (Cue Card)', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'ielts-speak-3', name: 'Part 3: Discussion & Complex Ideas', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const TOEFL_SYLLABUS = {
    examSlug: 'toefl',
    subjects: [
        {
            name: 'Reading', order: 1,
            chapters: [
                {
                    name: 'Academic Reading', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'toefl-read-1', name: 'Factual Information & Negative Facts', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'toefl-read-2', name: 'Inference & Purpose', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'toefl-read-3', name: 'Vocabulary in Context', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'toefl-read-4', name: 'Prose Summary & Chart Fill', order: 4, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Listening', order: 2,
            chapters: [
                {
                    name: 'Academic Listening', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'toefl-lis-1', name: 'Main Idea & Detailed Flow', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'toefl-lis-2', name: 'Speaker Attitude & Implication', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'toefl-lis-3', name: 'Note-Taking Strategies', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Speaking', order: 3,
            chapters: [
                {
                    name: 'Spoken Responses', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'toefl-speak-1', name: 'Independent Task (Familiar Topic)', order: 1, examFrequency: 'high', weightage: 4, priority: 'normal' },
                        { id: 'toefl-speak-2', name: 'Integrated Task (Read/Listen/Speak)', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'toefl-speak-3', name: 'Integrated Task (Listen/Speak)', order: 3, examFrequency: 'medium', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Writing', order: 4,
            chapters: [
                {
                    name: 'Writing Tasks', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'toefl-writ-1', name: 'Integrated Task (Read/Listen/Write)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'toefl-writ-2', name: 'Academic Discussion', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const GRE_SYLLABUS = {
    examSlug: 'gre',
    subjects: [
        {
            name: 'Verbal Reasoning', order: 1,
            chapters: [
                {
                    name: 'Reading Comprehension', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'gre-verb-read-1', name: 'Main Idea & Primary Purpose', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'gre-verb-read-2', name: 'Inference & Logical Flaws', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Text Completion & Equivalence', order: 2, estimatedHours: 15,
                    topics: [
                        { id: 'gre-verb-tc-1', name: 'Text Completion Strategy & Vocab', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'gre-verb-tc-2', name: 'Sentence Equivalence', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Quantitative Reasoning', order: 2,
            chapters: [
                {
                    name: 'Arithmetic & Algebra', order: 1, estimatedHours: 20,
                    topics: [
                        { id: 'gre-quant-alg-1', name: 'Integers, Fractions, Decimals', order: 1, examFrequency: 'high', weightage: 4, priority: 'normal' },
                        { id: 'gre-quant-alg-2', name: 'Algebraic Expressions & Equations', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Geometry & Data', order: 2, estimatedHours: 18,
                    topics: [
                        { id: 'gre-quant-geo-1', name: 'Lines, Angles, Triangles', order: 1, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'gre-quant-geo-2', name: 'Polygons & Circles', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'gre-quant-data-1', name: 'Data Interpretation', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Analytical Writing', order: 3,
            chapters: [
                {
                    name: 'Analytical Essay', order: 1, estimatedHours: 10,
                    topics: [
                        { id: 'gre-awa-1', name: 'Analyze an Issue', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const GMAT_SYLLABUS = {
    examSlug: 'gmat',
    subjects: [
        {
            name: 'Quantitative Reasoning', order: 1,
            chapters: [
                {
                    name: 'Problem Solving', order: 1, estimatedHours: 25,
                    topics: [
                        { id: 'gmat-quant-1', name: 'Arithmetic concepts', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'gmat-quant-2', name: 'Algebraic equations', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Verbal Reasoning', order: 2,
            chapters: [
                {
                    name: 'Reading Concept', order: 1, estimatedHours: 25,
                    topics: [
                        { id: 'gmat-verb-1', name: 'Reading Comprehension', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'gmat-verb-2', name: 'Critical Reasoning', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Data Insights', order: 3,
            chapters: [
                {
                    name: 'Data Analysis', order: 1, estimatedHours: 20,
                    topics: [
                        { id: 'gmat-di-1', name: 'Data Sufficiency', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'gmat-di-2', name: 'Multi-Source Reasoning', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'gmat-di-3', name: 'Table Analysis & Graphs', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const UPSC_SYLLABUS = {
    examSlug: 'upsc',
    subjects: [
        {
            name: 'History', order: 1,
            chapters: [
                {
                    name: 'Indian History & Culture', order: 1, estimatedHours: 40,
                    topics: [
                        { id: 'upsc-his-1', name: 'Ancient & Medieval History', order: 1, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'upsc-his-2', name: 'Modern Indian History', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'upsc-his-3', name: 'Indian National Movement', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Geography', order: 2,
            chapters: [
                {
                    name: 'Indian & World Geography', order: 1, estimatedHours: 35,
                    topics: [
                        { id: 'upsc-geo-1', name: 'Physical Geography', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'upsc-geo-2', name: 'Economic & Social Geography', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Polity & Governance', order: 3,
            chapters: [
                {
                    name: 'Indian Polity', order: 1, estimatedHours: 35,
                    topics: [
                        { id: 'upsc-pol-1', name: 'Constitution & Political System', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'upsc-pol-2', name: 'Panchayati Raj & Public Policy', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Economy', order: 4,
            chapters: [
                {
                    name: 'Economic Development', order: 1, estimatedHours: 30,
                    topics: [
                        { id: 'upsc-eco-1', name: 'Poverty & Inclusion', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'upsc-eco-2', name: 'Demographics & Social Sector', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Environment & Ecology', order: 5,
            chapters: [
                {
                    name: 'General Issues', order: 1, estimatedHours: 25,
                    topics: [
                        { id: 'upsc-env-1', name: 'Biodiversity & Climate Change', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'General Science', order: 6,
            chapters: [
                {
                    name: 'General Science', order: 1, estimatedHours: 20,
                    topics: [
                        { id: 'upsc-gs-1', name: 'Current Technologies, Space, Cyber', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};
