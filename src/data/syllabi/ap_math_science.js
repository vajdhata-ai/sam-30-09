// AP Math and Science subjects. High priority subjects are fully fleshed out.

export const AP_CALC_BC_SYLLABUS = {
    examSlug: 'ap-calc-bc',
    subjects: [
        {
            name: 'Calculus BC', order: 1,
            chapters: [
                {
                    name: 'Limits and Derivatives', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'apc-lim-1', name: 'Limits and Continuity', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apc-diff-1', name: 'Differentiation: Definition and Basic Derivative Rules', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apc-diff-2', name: 'Differentiation: Composite, Implicit, and Inverse Functions', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apc-diff-3', name: 'Contextual Applications of Differentiation', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apc-diff-4', name: 'Analytical Applications of Differentiation', order: 5, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                },
                {
                    name: 'Integrals', order: 2, estimatedHours: 20,
                    topics: [
                        { id: 'apc-int-1', name: 'Integration and Accumulation of Change', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apc-int-2', name: 'Differential Equations', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apc-int-3', name: 'Applications of Integration', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Advanced BC Topics', order: 3, estimatedHours: 20,
                    topics: [
                        { id: 'apc-adv-1', name: 'Parametric Equations, Polar Coordinates, and Vector-Valued Functions', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apc-adv-2', name: 'Infinite Sequences and Series', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const AP_PHYSICS_C_SYLLABUS = {
    examSlug: 'ap-physics-c',
    subjects: [
        {
            name: 'Mechanics', order: 1,
            chapters: [
                {
                    name: 'Kinematics & Dynamics', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'appc-mech-1', name: 'Kinematics (1D and 2D)', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appc-mech-2', name: "Newton's Laws of Motion", order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Energy, Momentum & Rotation', order: 2, estimatedHours: 20,
                    topics: [
                        { id: 'appc-mech-3', name: 'Work, Energy, and Power', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appc-mech-4', name: 'Systems of Particles and Linear Momentum', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appc-mech-5', name: 'Rotation', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appc-mech-6', name: 'Oscillations and Gravitation', order: 4, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        },
        {
            name: 'Electricity & Magnetism', order: 2,
            chapters: [
                {
                    name: 'Electrostatics & Circuits', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'appc-em-1', name: 'Electrostatics', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appc-em-2', name: 'Conductors, Capacitors, Dielectrics', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appc-em-3', name: 'Electric Circuits', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Magnetism & Electromagnetism', order: 2, estimatedHours: 15,
                    topics: [
                        { id: 'appc-em-4', name: 'Magnetic Fields', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'appc-em-5', name: 'Electromagnetism', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};


export const AP_CHEMISTRY_SYLLABUS = {
    examSlug: 'ap-chem',
    subjects: [
        {
            name: 'Chemistry Units', order: 1,
            chapters: [
                {
                    name: 'Atomic Structure & Properties', order: 1, estimatedHours: 10,
                    topics: [
                        { id: 'apchem-1', name: 'Atomic Structure and Properties', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apchem-2', name: 'Molecular and Ionic Compound Structure and Properties', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apchem-3', name: 'Intermolecular Forces and Properties', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Reactions & Kinetics', order: 2, estimatedHours: 15,
                    topics: [
                        { id: 'apchem-4', name: 'Chemical Reactions', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apchem-5', name: 'Kinetics', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apchem-6', name: 'Thermodynamics', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Equilibrium & Acids', order: 3, estimatedHours: 15,
                    topics: [
                        { id: 'apchem-7', name: 'Equilibrium', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apchem-8', name: 'Acids and Bases', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apchem-9', name: 'Applications of Thermodynamics', order: 3, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const AP_BIO_SYLLABUS = {
    examSlug: 'ap-bio',
    subjects: [
        {
            name: 'Biology Units', order: 1,
            chapters: [
                {
                    name: 'Chemistry of Life & Cells', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'apbio-1', name: 'Chemistry of Life', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'apbio-2', name: 'Cell Structure and Function', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apbio-3', name: 'Cellular Energetics', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apbio-4', name: 'Cell Communication and Cell Cycle', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Genetics & Evolution', order: 2, estimatedHours: 20,
                    topics: [
                        { id: 'apbio-5', name: 'Heredity', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apbio-6', name: 'Gene Expression and Regulation', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apbio-7', name: 'Natural Selection', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apbio-8', name: 'Ecology', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const AP_PHYSICS_1_SYLLABUS = {
    examSlug: 'ap-phys-1',
    subjects: [
        {
            name: 'Physics 1 Units', order: 1,
            chapters: [
                {
                    name: 'Kinematics & Dynamics', order: 1, estimatedHours: 20,
                    topics: [
                        { id: 'app1-1', name: 'Kinematics', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'app1-2', name: 'Dynamics', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'app1-3', name: 'Circular Motion and Gravitation', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Energy & Momentum', order: 2, estimatedHours: 20,
                    topics: [
                        { id: 'app1-4', name: 'Energy', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'app1-5', name: 'Momentum', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'app1-6', name: 'Simple Harmonic Motion', order: 3, examFrequency: 'medium', weightage: 4, priority: 'high' },
                        { id: 'app1-7', name: 'Torque and Rotational Motion', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const AP_CSA_SYLLABUS = {
    examSlug: 'ap-cs-a',
    subjects: [
        {
            name: 'Computer Science A (Java)', order: 1,
            chapters: [
                {
                    name: 'Primitives & Objects', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'apcsa-1', name: 'Primitive Types', order: 1, examFrequency: 'high', weightage: 4, priority: 'normal' },
                        { id: 'apcsa-2', name: 'Using Objects', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apcsa-3', name: 'Boolean Expressions and if Statements', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apcsa-4', name: 'Iteration', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Classes, Arrays & Inheritance', order: 2, estimatedHours: 25,
                    topics: [
                        { id: 'apcsa-5', name: 'Writing Classes', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apcsa-6', name: 'Array', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apcsa-7', name: 'ArrayList', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apcsa-8', name: '2D Array', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'apcsa-9', name: 'Inheritance', order: 5, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'apcsa-10', name: 'Recursion', order: 6, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                }
            ]
        }
    ]
};
