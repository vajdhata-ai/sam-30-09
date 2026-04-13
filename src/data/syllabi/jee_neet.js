export const JEE_SYLLABUS = {
    examSlug: 'jee-mains',
    subjects: [
        {
            name: 'Physics', order: 1,
            chapters: [
                {
                    name: 'Units & Dimensions', order: 1, estimatedHours: 3,
                    topics: [
                        { id: 'jee-phy-unit-1', name: 'SI Units & Measurement', order: 1, examFrequency: 'medium', weightage: 2, priority: 'normal' },
                        { id: 'jee-phy-unit-2', name: 'Dimensional Analysis & Errors', order: 2, examFrequency: 'high', weightage: 3, priority: 'high' }
                    ]
                },
                {
                    name: 'Kinematics', order: 2, estimatedHours: 5,
                    topics: [
                        { id: 'jee-phy-kine-1', name: 'Motion in 1D', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'jee-phy-kine-2', name: 'Projectile & Relative Motion', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Laws of Motion & Friction', order: 3, estimatedHours: 5,
                    topics: [
                        { id: 'jee-phy-laws-1', name: "Newton's Laws & Circular Motion", order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-phy-laws-2', name: 'Friction', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Work, Energy & Power', order: 4, estimatedHours: 4,
                    topics: [
                        { id: 'jee-phy-work-1', name: 'Work-Energy Theorem & Power', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-phy-work-2', name: 'Conservation of Energy & Collisions', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Rotational Motion', order: 5, estimatedHours: 6,
                    topics: [
                        { id: 'jee-phy-rota-1', name: 'Moment of Inertia', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-phy-rota-2', name: 'Torque, Angular Momentum & Rolling', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Thermodynamics & Heat', order: 6, estimatedHours: 6,
                    topics: [
                        { id: 'jee-phy-therm-1', name: 'Laws of Thermodynamics', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-phy-therm-2', name: 'KTG & Heat Transfer', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Electromagnetism', order: 7, estimatedHours: 12,
                    topics: [
                        { id: 'jee-phy-elec-1', name: 'Electrostatics & Capacitors', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-phy-elec-2', name: 'Current Electricity', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-phy-elec-3', name: 'Magnetic Effects of Current & EMI', order: 3, examFrequency: 'high', weightage: 6, priority: 'high' }
                    ]
                },
                {
                    name: 'Optics & Modern Physics', order: 8, estimatedHours: 10,
                    topics: [
                        { id: 'jee-phy-opt-1', name: 'Ray & Wave Optics', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-phy-mod-1', name: 'Dual Nature, Atoms, Nuclei', order: 2, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-phy-mod-2', name: 'Semiconductors', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Chemistry', order: 2,
            chapters: [
                {
                    name: 'Physical Chemistry', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'jee-che-phys-1', name: 'Mole Concept & Atomic Structure', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-che-phys-2', name: 'Thermodynamics & Equilibrium', order: 2, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-che-phys-3', name: 'Solutions & Electrochemistry', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-che-phys-4', name: 'Chemical Kinetics', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Inorganic Chemistry', order: 2, estimatedHours: 12,
                    topics: [
                        { id: 'jee-che-inor-1', name: 'Periodic Table & Chemical Bonding', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-che-inor-2', name: 'Coordination Compounds', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-che-inor-3', name: 'p, d, f Block Elements', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'jee-che-inor-4', name: 'Metallurgy & Environmental Chemistry', order: 4, examFrequency: 'low', weightage: 2, priority: 'low' }
                    ]
                },
                {
                    name: 'Organic Chemistry', order: 3, estimatedHours: 14,
                    topics: [
                        { id: 'jee-che-org-1', name: 'GOC & Isomerism', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-che-org-2', name: 'Hydrocarbons, Halides, Alcohols', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-che-org-3', name: 'Aldehydes, Ketones, Carboxylic Acids', order: 3, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-che-org-4', name: 'Amines & Biomolecules', order: 4, examFrequency: 'medium', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Mathematics', order: 3,
            chapters: [
                {
                    name: 'Algebra', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'jee-mat-alg-1', name: 'Sets, Relations & Functions', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-mat-alg-2', name: 'Complex Numbers & Quadratic Eq', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-mat-alg-3', name: 'Matrices & Determinants', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-mat-alg-4', name: 'Permutations, Combinations & Probability', order: 4, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-mat-alg-5', name: 'Binomial Theorem & Sequences', order: 5, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Calculus', order: 2, estimatedHours: 18,
                    topics: [
                        { id: 'jee-mat-calc-1', name: 'Limits, Continuity & Differentiability', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-mat-calc-2', name: 'Applications of Derivatives', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-mat-calc-3', name: 'Indefinite & Definite Integration', order: 3, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'jee-mat-calc-4', name: 'Differential Equations & Area', order: 4, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Coordinate Geometry', order: 3, estimatedHours: 12,
                    topics: [
                        { id: 'jee-mat-coord-1', name: 'Straight Lines & Circles', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'jee-mat-coord-2', name: 'Conic Sections (Parabola, Ellipse, Hyperbola)', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Vector & 3D Geometry', order: 4, estimatedHours: 8,
                    topics: [
                        { id: 'jee-mat-vec-1', name: 'Vector Algebra', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'jee-mat-vec-2', name: '3D Geometry', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};

export const NEET_SYLLABUS = {
    examSlug: 'neet',
    subjects: [
        {
            name: 'Biology', order: 1,
            chapters: [
                {
                    name: 'Diversity in Living World & structural Organisation', order: 1, estimatedHours: 10,
                    topics: [
                        { id: 'neet-bio-div-1', name: 'Living World & Biological Classification', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'neet-bio-div-2', name: 'Plant & Animal Kingdom', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-bio-div-3', name: 'Morphology & Anatomy in Plants/Animals', order: 3, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Cell Structure & Function', order: 2, estimatedHours: 8,
                    topics: [
                        { id: 'neet-bio-cell-1', name: 'Cell Unit of Life & Biomolecules', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-bio-cell-2', name: 'Cell Cycle and Cell Division', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Plant Physiology', order: 3, estimatedHours: 12,
                    topics: [
                        { id: 'neet-bio-pphy-1', name: 'Transport, Mineral Nutrition & Photosynthesis', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-bio-pphy-2', name: 'Respiration & Plant Growth', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Human Physiology', order: 4, estimatedHours: 15,
                    topics: [
                        { id: 'neet-bio-hphy-1', name: 'Digestion, Breathing, Fluids', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-bio-hphy-2', name: 'Excretion & Locomotion', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-bio-hphy-3', name: 'Neural & Chemical Coordination', order: 3, examFrequency: 'high', weightage: 6, priority: 'high' }
                    ]
                },
                {
                    name: 'Genetics, Evolution & Biotechnology', order: 5, estimatedHours: 14,
                    topics: [
                        { id: 'neet-bio-gen-1', name: 'Principles of Inheritance & Variation', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-bio-gen-2', name: 'Molecular Basis & Evolution', order: 2, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-bio-gen-3', name: 'Biotechnology Principles & Applications', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Ecology & Environment', order: 6, estimatedHours: 8,
                    topics: [
                        { id: 'neet-bio-eco-1', name: 'Organisms & Populations', order: 1, examFrequency: 'high', weightage: 4, priority: 'high' },
                        { id: 'neet-bio-eco-2', name: 'Ecosystem & Environmental Issues', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Physics', order: 2,
            chapters: [
                {
                    name: 'Mechanics (Class 11)', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'neet-phy-mech-1', name: 'Kinematics & Laws of Motion', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-phy-mech-2', name: 'Work, Energy & Rotational Motion', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-phy-mech-3', name: 'Gravitation & Properties of Matter', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                },
                {
                    name: 'Heat & Thermodynamics', order: 2, estimatedHours: 8,
                    topics: [
                        { id: 'neet-phy-therm-1', name: 'Thermodynamics & KTG', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-phy-therm-2', name: 'Thermal Properties', order: 2, examFrequency: 'medium', weightage: 4, priority: 'normal' }
                    ]
                },
                {
                    name: 'Electrodynamics & Optics (Class 12)', order: 3, estimatedHours: 15,
                    topics: [
                        { id: 'neet-phy-elec-1', name: 'Electrostatics & Current Electricity', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-phy-elec-2', name: 'Magnetism & EMI/AC', order: 2, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-phy-elec-3', name: 'Ray & Wave Optics', order: 3, examFrequency: 'high', weightage: 6, priority: 'high' }
                    ]
                },
                {
                    name: 'Modern Physics', order: 4, estimatedHours: 8,
                    topics: [
                        { id: 'neet-phy-mod-1', name: 'Dual Nature, Atoms & Nuclei', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-phy-mod-2', name: 'Electronic Devices', order: 2, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                }
            ]
        },
        {
            name: 'Chemistry', order: 3,
            chapters: [
                {
                    name: 'Physical Chemistry', order: 1, estimatedHours: 15,
                    topics: [
                        { id: 'neet-che-phys-1', name: 'Mole Concept, Atomic Structure', order: 1, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-che-phys-2', name: 'Thermodynamics & Equilibrium', order: 2, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-che-phys-3', name: 'Solutions & Electrochemistry', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' },
                        { id: 'neet-che-phys-4', name: 'Chemical Kinetics', order: 4, examFrequency: 'high', weightage: 4, priority: 'high' }
                    ]
                },
                {
                    name: 'Inorganic Chemistry', order: 2, estimatedHours: 12,
                    topics: [
                        { id: 'neet-che-inor-1', name: 'Periodic Table & Bonding', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-che-inor-2', name: 'p, d, f Block & Coordination', order: 2, examFrequency: 'high', weightage: 6, priority: 'high' }
                    ]
                },
                {
                    name: 'Organic Chemistry', order: 3, estimatedHours: 15,
                    topics: [
                        { id: 'neet-che-org-1', name: 'GOC & Hydrocarbons', order: 1, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-che-org-2', name: 'Haloalkanes, Alcohols, Carbonyls', order: 2, examFrequency: 'high', weightage: 6, priority: 'high' },
                        { id: 'neet-che-org-3', name: 'Amines, Biomolecules & Polymers', order: 3, examFrequency: 'high', weightage: 5, priority: 'high' }
                    ]
                }
            ]
        }
    ]
};
