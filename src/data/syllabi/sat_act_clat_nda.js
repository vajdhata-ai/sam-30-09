/**
 * SAT Syllabus — Updated to the latest Digital SAT (2024-2026) specification
 * Source: College Board Digital SAT Suite
 * Format: 2 hrs 14 min, computer-adaptive, 54 RW + 44 Math questions
 */
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
                        { id: 'sat-rw-craft-2', name: 'Text Structure and Purpose', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-rw-craft-3', name: 'Cross-Text Connections', order: 3, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Expression of Ideas', order: 3, estimatedHours: 10,
                    topics: [
                        { id: 'sat-rw-expr-1', name: 'Rhetorical Synthesis', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-expr-2', name: 'Transitions', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Standard English Conventions', order: 4, estimatedHours: 12,
                    topics: [
                        { id: 'sat-rw-conv-1', name: 'Boundaries (Sentence Punctuation)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-conv-2', name: 'Form, Structure, and Sense (Grammar)', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-rw-conv-3', name: 'Subject-Verb Agreement', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-rw-conv-4', name: 'Pronoun-Antecedent Agreement', order: 4, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'sat-rw-conv-5', name: 'Frequently Confused Words', order: 5, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'sat-rw-conv-6', name: 'Modifiers & Parallelism', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Math', order: 2,
            chapters: [
                {
                    name: 'Algebra', order: 1, estimatedHours: 16,
                    topics: [
                        { id: 'sat-mat-alg-1', name: 'Linear Equations in One Variable', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-alg-2', name: 'Linear Equations in Two Variables', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-alg-3', name: 'Linear Functions', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-alg-4', name: 'Systems of Two Linear Equations', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-alg-5', name: 'Linear Inequalities in One or Two Variables', order: 5, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-mat-alg-6', name: 'Absolute Value Equations & Functions', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Advanced Math', order: 2, estimatedHours: 20,
                    topics: [
                        { id: 'sat-mat-adv-1', name: 'Equivalent Expressions (Factoring, Expanding)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-adv-2', name: 'Quadratic Equations & Functions', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-adv-3', name: 'Polynomial Functions & Graphs', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-adv-4', name: 'Exponential Functions & Equations', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-adv-5', name: 'Radical & Rational Equations', order: 5, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-adv-6', name: 'Systems of Nonlinear Equations', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'sat-mat-adv-7', name: 'Function Notation & Interpretation', order: 7, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Problem-Solving & Data Analysis', order: 3, estimatedHours: 14,
                    topics: [
                        { id: 'sat-mat-prob-1', name: 'Ratios, Rates & Proportional Relationships', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-prob-2', name: 'Percentages', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-prob-3', name: 'Unit Conversion & Dimensional Analysis', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-mat-prob-4', name: 'One-Variable Data (Center, Spread)', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-prob-5', name: 'Two-Variable Data (Scatterplots & Line of Best Fit)', order: 5, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-mat-prob-6', name: 'Probability & Conditional Probability', order: 6, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-prob-7', name: 'Inference from Sample Statistics & Margin of Error', order: 7, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'sat-mat-prob-8', name: 'Evaluating Statistical Claims (Experiments vs. Observational)', order: 8, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Geometry & Trigonometry', order: 4, estimatedHours: 12,
                    topics: [
                        { id: 'sat-mat-geo-1', name: 'Area & Volume (2D & 3D Shapes)', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-geo-2', name: 'Lines, Angles & Triangles', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'sat-mat-geo-3', name: 'Right Triangles & Pythagorean Theorem', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-geo-4', name: 'Trigonometric Ratios (sin, cos, tan)', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'sat-mat-geo-5', name: 'Circles (Arc Length, Sectors, Central Angles)', order: 5, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'sat-mat-geo-6', name: 'Circle Equations', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'sat-mat-geo-7', name: 'Congruence & Similarity', order: 7, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'sat-mat-geo-8', name: 'Radians & Unit Circle Basics', order: 8, examFrequency: 'low', weightage: 3, priority: 'normal' }
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

/**
 * NDA Syllabus — Updated to the latest UPSC NDA (2025-2026) specification
 * Paper I: Mathematics (300 marks, 120 questions, 2.5 hrs)
 * Paper II: General Ability Test (600 marks, 150 questions, 2.5 hrs)
 *     Part A — English (200 marks)
 *     Part B — General Knowledge (400 marks)
 */
export const NDA_SYLLABUS = {
    examSlug: 'nda',
    subjects: [
        {
            name: 'Mathematics (Paper I)', order: 1,
            chapters: [
                {
                    name: 'Algebra', order: 1, estimatedHours: 18,
                    topics: [
                        { id: 'nda-mat-alg-1', name: 'Sets, Venn Diagrams, De Morgan Laws & Relations', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-alg-2', name: 'Real Number Representation & Binary Number System', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-mat-alg-3', name: 'Complex Numbers (Modulus, Argument, Cube Roots of Unity)', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-alg-4', name: 'Quadratic Equations & Linear Inequations', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-alg-5', name: 'AP, GP & HP — Arithmetic/Geometric/Harmonic Progressions', order: 5, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-alg-6', name: 'Permutations & Combinations', order: 6, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-alg-7', name: 'Binomial Theorem & its Applications', order: 7, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'nda-mat-alg-8', name: 'Logarithms & their Applications', order: 8, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Matrices & Determinants', order: 2, estimatedHours: 8,
                    topics: [
                        { id: 'nda-mat-mat-1', name: 'Types of Matrices & Operations', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-mat-2', name: 'Determinants — Properties & Evaluation', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-mat-3', name: 'Adjoint & Inverse of a Square Matrix', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-mat-4', name: 'Solving Systems of Linear Equations (Cramer\'s Rule)', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Trigonometry', order: 3, estimatedHours: 15,
                    topics: [
                        { id: 'nda-mat-trig-1', name: 'Angles (Degrees & Radians) & Trigonometric Ratios', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-trig-2', name: 'Trigonometric Identities & Equations', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-trig-3', name: 'Compound & Multiple/Sub-Multiple Angles', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-trig-4', name: 'Inverse Trigonometric Functions', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-trig-5', name: 'Height & Distance Applications', order: 5, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-trig-6', name: 'Properties of Triangles (Sine/Cosine Rule)', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Analytical Geometry — 2D', order: 4, estimatedHours: 15,
                    topics: [
                        { id: 'nda-mat-ag2d-1', name: 'Cartesian Coordinates & Distance Formula', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-ag2d-2', name: 'Equation of a Line (Various Forms) & Angle Between Lines', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-ag2d-3', name: 'Distance of a Point from a Line', order: 3, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'nda-mat-ag2d-4', name: 'Equation of a Circle (Standard & General Form)', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-ag2d-5', name: 'Conic Sections — Parabola, Ellipse & Hyperbola', order: 5, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Analytical Geometry — 3D', order: 5, estimatedHours: 10,
                    topics: [
                        { id: 'nda-mat-ag3d-1', name: 'Points in 3D Space & Distance Between Points', order: 1, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'nda-mat-ag3d-2', name: 'Direction Cosines & Direction Ratios', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-ag3d-3', name: 'Equation of a Plane & Line in 3D', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-ag3d-4', name: 'Angle Between Lines/Planes & Equation of a Sphere', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Differential Calculus', order: 6, estimatedHours: 18,
                    topics: [
                        { id: 'nda-mat-dcal-1', name: 'Real-Valued Functions — Domain, Range & Graphs', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-dcal-2', name: 'Composite, One-to-One, Onto & Inverse Functions', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-mat-dcal-3', name: 'Limits, Continuity & Differentiability', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-dcal-4', name: 'Derivatives — Sum, Product, Quotient & Chain Rule', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-dcal-5', name: 'Second-Order Derivatives', order: 5, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-dcal-6', name: 'Increasing/Decreasing Functions, Maxima & Minima', order: 6, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Integral Calculus & Differential Equations', order: 7, estimatedHours: 18,
                    topics: [
                        { id: 'nda-mat-ical-1', name: 'Integration as Inverse of Differentiation', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-ical-2', name: 'Integration by Substitution & by Parts', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-ical-3', name: 'Standard Integrals & Partial Fractions', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-ical-4', name: 'Definite Integrals & Area Under Curves', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-ical-5', name: 'Differential Equations — Order, Degree & Formation', order: 5, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-ical-6', name: 'Solution of First-Order DEs & Growth/Decay Problems', order: 6, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Vector Algebra', order: 8, estimatedHours: 10,
                    topics: [
                        { id: 'nda-mat-vec-1', name: 'Vectors — Magnitude, Direction, Unit & Null Vectors', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-vec-2', name: 'Addition of Vectors & Scalar Multiplication', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-vec-3', name: 'Scalar (Dot) Product & Vector (Cross) Product', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-vec-4', name: 'Applications of Vectors (Work, Torque, Area)', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Statistics & Probability', order: 9, estimatedHours: 12,
                    topics: [
                        { id: 'nda-mat-stat-1', name: 'Frequency Distribution & Graphical Representation', order: 1, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-mat-stat-2', name: 'Measures of Central Tendency (Mean, Median, Mode)', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-mat-stat-3', name: 'Variance & Standard Deviation', order: 3, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-mat-stat-4', name: 'Probability — Sample Space, Events & Axioms', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-stat-5', name: 'Conditional Probability & Bayes\' Theorem', order: 5, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-mat-stat-6', name: 'Binomial Distribution', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'General Ability Test — GAT (Paper II)', order: 2,
            chapters: [
                {
                    name: 'English (Part A — 200 Marks)', order: 1, estimatedHours: 25,
                    topics: [
                        { id: 'nda-gat-eng-1', name: 'Grammar & Usage (Tenses, Voice, Narration)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-eng-2', name: 'Vocabulary — Synonyms, Antonyms & One-Word Substitution', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-eng-3', name: 'Spotting Errors & Sentence Improvement', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-eng-4', name: 'Comprehension & Cohesion in Extended Text', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-eng-5', name: 'Cloze Test & Fill in the Blanks', order: 5, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-eng-6', name: 'Idioms, Proverbs & Phrases', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-eng-7', name: 'Para Jumbling & Sentence Ordering', order: 7, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Physics (Part B — GK)', order: 2, estimatedHours: 18,
                    topics: [
                        { id: 'nda-gat-phy-1', name: 'Properties of Matter — Density, Pressure, Archimedes\' Principle', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-phy-2', name: 'Motion — Velocity, Acceleration, Newton\'s Laws & Momentum', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-phy-3', name: 'Work, Energy, Power & Gravitation', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-phy-4', name: 'Heat — Temperature, Specific Heat, Expansion & Thermometry', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-phy-5', name: 'Sound — Wave Motion, Velocity, Reflection & Echoes', order: 5, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'nda-gat-phy-6', name: 'Light — Reflection, Refraction, Spherical Mirrors & Lenses', order: 6, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-phy-7', name: 'Magnetism — Natural & Artificial Magnets, Earth as Magnet', order: 7, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-phy-8', name: 'Electricity — Static Electricity, Current, Ohm\'s Law, Circuits', order: 8, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Chemistry (Part B — GK)', order: 3, estimatedHours: 14,
                    topics: [
                        { id: 'nda-gat-che-1', name: 'Physical & Chemical Changes', order: 1, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-che-2', name: 'Elements, Mixtures & Compounds — Laws of Chemical Combination', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-che-3', name: 'Properties of Air & Water — Hydrogen, Oxygen, Nitrogen, CO₂', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-che-4', name: 'Oxidation & Reduction', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-che-5', name: 'Acids, Bases & Salts', order: 5, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-che-6', name: 'Carbon — Forms (Diamond, Graphite), Hydrocarbons', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-che-7', name: 'Fertilizers — Natural & Artificial', order: 7, examFrequency: 'low', weightage: 2, priority: 'normal' },
                        { id: 'nda-gat-che-8', name: 'Atomic Structure & Periodic Table Basics', order: 8, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'General Science (Part B — GK)', order: 4, estimatedHours: 14,
                    topics: [
                        { id: 'nda-gat-gs-1', name: 'Living & Non-Living Things — Basis of Life, Cells & Protoplasm', order: 1, examFrequency: 'medium', weightage: 4, priority: 'normal' },
                        { id: 'nda-gat-gs-2', name: 'Growth & Reproduction in Plants & Animals', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-gs-3', name: 'Human Body — Elementary Knowledge of Organs', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-gs-4', name: 'Common Epidemics — Causes, Prevention & Treatment', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-gs-5', name: 'Food — Sources of Energy, Balanced Diet & Nutrition', order: 5, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-gs-6', name: 'Solar System — Planets, Eclipses, Space Achievements', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-gs-7', name: 'Famous Scientists & Scientific Inventions', order: 7, examFrequency: 'low', weightage: 2, priority: 'normal' }
                    ]
                },
                {
                    name: 'History & Indian Polity (Part B — GK)', order: 5, estimatedHours: 20,
                    topics: [
                        { id: 'nda-gat-his-1', name: 'Indian Civilization & Culture — Broad Survey', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-his-2', name: 'Medieval India — Mughal Period & Regional Kingdoms', order: 2, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-his-3', name: 'Indian Freedom Movement & National Leaders', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-his-4', name: 'Indian Constitution — Fundamental Rights, Duties & DPSP', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-his-5', name: 'Indian Polity — Parliament, Judiciary & Administration', order: 5, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-his-6', name: 'Five Year Plans & Panchayati Raj', order: 6, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-his-7', name: 'World History — Renaissance, French & Industrial Revolutions', order: 7, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-his-8', name: 'United Nations, ICJ & International Organizations', order: 8, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Geography (Part B — GK)', order: 6, estimatedHours: 15,
                    topics: [
                        { id: 'nda-gat-geo-1', name: 'Earth — Shape, Size, Latitude, Longitude & Time Zones', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-geo-2', name: 'Atmosphere — Composition, Temperature, Pressure & Winds', order: 2, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'nda-gat-geo-3', name: 'Ocean Currents, Tides & Climate Patterns', order: 3, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-geo-4', name: 'Soil, Vegetation & Natural Resources', order: 4, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-geo-5', name: 'Earthquakes, Volcanoes & Physical Geography', order: 5, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-geo-6', name: 'Regional Geography of India — Agriculture, Industry & Resources', order: 6, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-geo-7', name: 'Transport, Communication & Trade of India', order: 7, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                },
                {
                    name: 'Current Events & Defence (Part B — GK)', order: 7, estimatedHours: 15,
                    topics: [
                        { id: 'nda-gat-cur-1', name: 'Important National & International Events', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-cur-2', name: 'Indian Defence — Army, Navy & Air Force Basics', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'nda-gat-cur-3', name: 'Awards — Gallantry, Sports, National & International', order: 3, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-cur-4', name: 'Sports — National & International Championships', order: 4, examFrequency: 'medium', weightage: 3, priority: 'normal' },
                        { id: 'nda-gat-cur-5', name: 'Prominent Personalities — India & World', order: 5, examFrequency: 'medium', weightage: 3, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};
