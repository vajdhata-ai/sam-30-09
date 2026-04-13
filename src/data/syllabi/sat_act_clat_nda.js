export const SAT_SYLLABUS = {
    examSlug: 'sat',
    subjects: [
        {
            name: 'Reading & Writing', order: 1,
            chapters: [
                {
                    name: 'Information & Ideas', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'sat-rw-info-1', name: 'Central Ideas and Details', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-info-2', name: 'Command of Evidence (Textual)', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-info-3', name: 'Command of Evidence (Quantitative)', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-info-4', name: 'Inferences', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' },
                    ]
                },
                {
                    name: 'Craft & Structure', order: 2, estimatedHours: 12,
                    topics: [
                        { id: 'sat-rw-craft-1', name: 'Words in Context', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-craft-2', name: 'Text Structure and Purpose', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-rw-craft-3', name: 'Cross-Text Connections', order: 3, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Expression of Ideas', order: 3, estimatedHours: 10,
                    topics: [
                        { id: 'sat-rw-expr-1', name: 'Rhetorical Synthesis', order: 1, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'sat-rw-expr-2', name: 'Transitions', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Standard English Conventions', order: 4, estimatedHours: 10,
                    topics: [
                        { id: 'sat-rw-conv-1', name: 'Boundaries (Punctuation)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-conv-2', name: 'Form, Structure, and Sense (Grammar)', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Math', order: 2,
            chapters: [
                {
                    name: 'Algebra', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'sat-mat-alg-1', name: 'Linear Equations in One Variable', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-alg-2', name: 'Linear Equations in Two Variables', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-alg-3', name: 'Linear Functions', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-mat-alg-4', name: 'Systems of Two Linear Equations', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-alg-5', name: 'Linear Inequalities', order: 5, examFrequency: 'low', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Advanced Math', order: 2, estimatedHours: 18,
                    topics: [
                        { id: 'sat-mat-adv-1', name: 'Nonlinear Functions', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-adv-2', name: 'Nonlinear Equations', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-adv-3', name: 'Equivalent Expressions', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Problem-Solving & Data Analysis', order: 3, estimatedHours: 12,
                    topics: [
                        { id: 'sat-mat-prob-1', name: 'Ratios, Rates, Proportional Relationships', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-prob-2', name: 'Percentages', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-prob-3', name: 'One-Variable Data (Mean, Median, Mode)', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-mat-prob-4', name: 'Two-Variable Data (Scatterplots)', order: 4, examFrequency: 'low', weightage: 3, priority: 'normal' },
                        { id: 'sat-mat-prob-5', name: 'Probability & Conditional Probability', order: 5, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Geometry & Trigonometry', order: 4, estimatedHours: 10,
                    topics: [
                        { id: 'sat-mat-geo-1', name: 'Area and Volume', order: 1, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-mat-geo-2', name: 'Lines, Angles, and Triangles', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-geo-3', name: 'Right Triangles and Trigonometry', order: 3, examFrequency: 'low', weightage: 3, priority: 'normal' },
                        { id: 'sat-mat-geo-4', name: 'Circles', order: 4, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};

export const ACT_SYLLABUS = {
    examSlug: 'act',
    subjects: [
        {
            name: 'English', order: 1,
            chapters: [
                {
                    name: 'Production of Writing', order: 1, estimatedHours: 10,
                    topics: [
                        { id: 'act-eng-prod-1', name: 'Topic Development', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-eng-prod-2', name: 'Organization, Unity, and Cohesion', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Knowledge of Language', order: 2, estimatedHours: 8,
                    topics: [
                        { id: 'act-eng-know-1', name: 'Word Choice', order: 1, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'act-eng-know-2', name: 'Style and Tone', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                },
                {
                    name: 'Conventions of Standard English', order: 3, estimatedHours: 12,
                    topics: [
                        { id: 'act-eng-conv-1', name: 'Sentence Structure and Formation', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-eng-conv-2', name: 'Punctuation', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-eng-conv-3', name: 'Usage', order: 3, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Mathematics', order: 2,
            chapters: [
                {
                    name: 'Pre-Algebra & Algebra', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'act-mat-alg-1', name: 'Number Problems', order: 1, examFrequency: 'high', weightage: 4, priority: 'normal' },
                        { id: 'act-mat-alg-2', name: 'Linear Equations & Inequalities', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-mat-alg-3', name: 'Polynomials & Factoring', order: 3, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Geometry', order: 2, estimatedHours: 15,
                    topics: [
                        { id: 'act-mat-geo-1', name: 'Coordinate Geometry', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-mat-geo-2', name: 'Plane Geometry (Triangles, Circles)', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-mat-geo-3', name: 'Solid Geometry', order: 3, examFrequency: 'low', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Trigonometry & Advanced Topics', order: 3, estimatedHours: 10,
                    topics: [
                        { id: 'act-mat-trig-1', name: 'Trigonometric Relations', order: 1, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'act-mat-trig-2', name: 'Complex Numbers & Matrices', order: 2, examFrequency: 'low', weightage: 3, priority: 'low' },
                        { id: 'act-mat-trig-3', name: 'Conic Sections', order: 3, examFrequency: 'low', weightage: 2, priority: 'low' }
                    ]
                }
            ]
        },
        {
            name: 'Reading', order: 3,
            chapters: [
                {
                    name: 'Reading Comprehension', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'act-read-comp-1', name: 'Key Ideas and Details', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-read-comp-2', name: 'Craft and Structure', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'act-read-comp-3', name: 'Integration of Knowledge', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Science', order: 4,
            chapters: [
                {
                    name: 'Scientific Analysis', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'act-sci-ana-1', name: 'Interpretation of Data', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'act-sci-ana-2', name: 'Scientific Investigation', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'act-sci-ana-3', name: 'Evaluation of Models', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};

export const CLAT_SYLLABUS = {
    examSlug: 'clat',
    subjects: [
        {
            name: 'English Language', order: 1,
            chapters: [
                {
                    name: 'Comprehension & Language', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'clat-eng-comp-1', name: 'Reading Comprehension & Inference', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-eng-comp-2', name: 'Vocabulary & Contextual Meaning', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'clat-eng-comp-3', name: 'Summary & Main Idea', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Current Affairs (incl. GK)', order: 2,
            chapters: [
                {
                    name: 'Global & National Affairs', order: 1, estimatedHours: 30,
                    topics: [
                        { id: 'clat-gk-aff-1', name: 'National/International Events', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-gk-aff-2', name: 'Legal Information/Awareness', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-gk-aff-3', name: 'Arts, Culture & Historical Contexts', order: 3, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Legal Reasoning', order: 3,
            chapters: [
                {
                    name: 'Foundational Law', order: 1, estimatedHours: 25,
                    topics: [
                        { id: 'clat-leg-law-1', name: 'Law of Torts', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-leg-law-2', name: 'Constitutional Law', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-leg-law-3', name: 'Criminal Law Fundamentals', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-leg-law-4', name: 'Law of Contracts', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Logical Reasoning', order: 4,
            chapters: [
                {
                    name: 'Critical Thinking', order: 1, estimatedHours: 20,
                    topics: [
                        { id: 'clat-log-crit-1', name: 'Argument Analysis', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-log-crit-2', name: 'Premises and Conclusions', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'clat-log-crit-3', name: 'Analogies & Relationships', order: 3, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Quantitative Techniques', order: 5,
            chapters: [
                {
                    name: 'Data Interpretation', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'clat-quant-di-1', name: 'Ratio & Proportions (Passage Based)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'clat-quant-di-2', name: 'Basic Algebra & Percentage', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'clat-quant-di-3', name: 'Mensuration/Statistics', order: 3, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};

export const NDA_SYLLABUS = {
    examSlug: 'nda',
    subjects: [
        {
            name: 'Mathematics', order: 1,
            chapters: [
                {
                    name: 'Algebra', order: 1, estimatedHours: 12,
                    topics: [
                        { id: 'nda-mat-alg-1', name: 'Sets, Venn Diagrams & Relations', order: 1, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-mat-alg-2', name: 'Complex Numbers', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-alg-3', name: 'Quadratic Equations', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-alg-4', name: 'Permutation & Combination', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-alg-5', name: 'Binomial Theorem', order: 5, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Matrices & Determinants', order: 2, estimatedHours: 6,
                    topics: [
                        { id: 'nda-mat-mat-1', name: 'Types of Matrices', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-mat-2', name: 'Determinants & Applications', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Trigonometry', order: 3, estimatedHours: 15,
                    topics: [
                        { id: 'nda-mat-trig-1', name: 'Angles & T-Ratios', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-trig-2', name: 'Inverse Trigonometric Functions', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-trig-3', name: 'Properties of Triangles', order: 3, examFrequency: 'low', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Calculus', order: 4, estimatedHours: 20,
                    topics: [
                        { id: 'nda-mat-calc-1', name: 'Functions, Limits & Continuity', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-calc-2', name: 'Derivatives & Applications', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-calc-3', name: 'Integration & Area under Curve', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-calc-4', name: 'Differential Equations', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Vector & 3D Geometry', order: 5, estimatedHours: 12,
                    topics: [
                        { id: 'nda-mat-vec-1', name: 'Vectors & Scalar/Vector Products', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-vec-2', name: '3D Geometry (Lines & Planes)', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Statistics & Probability', order: 6, estimatedHours: 12,
                    topics: [
                        { id: 'nda-mat-stat-1', name: 'Measures of Central Tendency & Dispersion', order: 1, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-mat-stat-2', name: 'Probability & Bayes Theorem', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-stat-3', name: 'Binomial & Normal Distribution', order: 3, examFrequency: 'low', weightage: 2, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'General Ability Test (GAT)', order: 2,
            chapters: [
                {
                    name: 'English', order: 1, estimatedHours: 20,
                    topics: [
                        { id: 'nda-gat-eng-1', name: 'Grammar and Usage', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-eng-2', name: 'Vocabulary (Synonyms & Antonyms)', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-eng-3', name: 'Comprehension & Cohesion', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                },
                {
                    name: 'Physics', order: 2, estimatedHours: 15,
                    topics: [
                        { id: 'nda-gat-phy-1', name: 'Mechanics (Mass, Weight, Volume)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-phy-2', name: 'Optics & Sound', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-phy-3', name: 'Electricity & Magnetism', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Chemistry', order: 3, estimatedHours: 10,
                    topics: [
                        { id: 'nda-gat-che-1', name: 'Elements, Mixtures & Compounds', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-che-2', name: 'Acids, Bases & Salts', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-che-3', name: 'Preparation of Substances', order: 3, examFrequency: 'low', weightage: 2, priority: 'low' }
                    ]
                },
                {
                    name: 'General Science', order: 4, estimatedHours: 10,
                    topics: [
                        { id: 'nda-gat-gs-1', name: 'Biology Basics (Cells & Diseases)', order: 1, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'nda-gat-gs-2', name: 'Solar System & Achievements', order: 2, examFrequency: 'low', weightage: 2, priority: 'low' }
                    ]
                },
                {
                    name: 'History, Freedom Movement', order: 5, estimatedHours: 15,
                    topics: [
                        { id: 'nda-gat-his-1', name: 'Broad Survey of Indian History', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-his-2', name: 'Freedom Movement & Constitutions', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-his-3', name: 'World History Impacts', order: 3, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Geography', order: 6, estimatedHours: 10,
                    topics: [
                        { id: 'nda-gat-geo-1', name: 'Earth, Latitudes & Longitudes', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-geo-2', name: 'Ocean Currents & Weather', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-geo-3', name: 'Geography of India', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Current Events', order: 7, estimatedHours: 15,
                    topics: [
                        { id: 'nda-gat-cur-1', name: 'Recent Indian Events', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-cur-2', name: 'International Events', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'nda-gat-cur-3', name: 'Prominent Personalities', order: 3, examFrequency: 'low', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};
