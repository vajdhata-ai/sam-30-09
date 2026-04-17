/**
 * NDA Competitive Hub — Complete Question Bank
 * 360+ questions covering all NDA syllabus topics, graded by difficulty.
 * Mapped to topic IDs from syllabi/sat_act_clat_nda.js (NDA_SYLLABUS)
 *
 * Topic ID Mapping (Updated 2025-2026):
 * ─── Mathematics (Paper I) ───
 * nda-mat-alg-1   → Sets, Venn Diagrams, De Morgan Laws & Relations
 * nda-mat-alg-2   → Real Number Representation & Binary Number System
 * nda-mat-alg-3   → Complex Numbers (Modulus, Argument, Cube Roots of Unity)
 * nda-mat-alg-4   → Quadratic Equations & Linear Inequations
 * nda-mat-alg-5   → AP, GP & HP
 * nda-mat-alg-6   → Permutations & Combinations
 * nda-mat-alg-7   → Binomial Theorem & its Applications
 * nda-mat-alg-8   → Logarithms & their Applications
 * nda-mat-mat-1   → Types of Matrices & Operations
 * nda-mat-mat-2   → Determinants — Properties & Evaluation
 * nda-mat-mat-3   → Adjoint & Inverse of a Square Matrix
 * nda-mat-mat-4   → Solving Systems of Linear Equations (Cramer's Rule)
 * nda-mat-trig-1  → Angles (Degrees & Radians) & Trigonometric Ratios
 * nda-mat-trig-2  → Trigonometric Identities & Equations
 * nda-mat-trig-3  → Compound & Multiple/Sub-Multiple Angles
 * nda-mat-trig-4  → Inverse Trigonometric Functions
 * nda-mat-trig-5  → Height & Distance Applications
 * nda-mat-trig-6  → Properties of Triangles (Sine/Cosine Rule)
 * nda-mat-ag2d-1..5 → Analytical Geometry 2D (Coord, Lines, Circle, Conics)
 * nda-mat-ag3d-1..4 → Analytical Geometry 3D (Points, DC/DR, Planes, Sphere)
 * nda-mat-dcal-1  → Real-Valued Functions — Domain, Range & Graphs
 * nda-mat-dcal-2  → Composite, One-to-One, Onto & Inverse Functions
 * nda-mat-dcal-3  → Limits, Continuity & Differentiability
 * nda-mat-dcal-4  → Derivatives — Sum, Product, Quotient & Chain Rule
 * nda-mat-dcal-5  → Second-Order Derivatives
 * nda-mat-dcal-6  → Increasing/Decreasing Functions, Maxima & Minima
 * nda-mat-ical-1  → Integration as Inverse of Differentiation
 * nda-mat-ical-2  → Integration by Substitution & by Parts
 * nda-mat-ical-3  → Standard Integrals & Partial Fractions
 * nda-mat-ical-4  → Definite Integrals & Area Under Curves
 * nda-mat-ical-5  → Differential Equations — Order, Degree & Formation
 * nda-mat-ical-6  → Solution of First-Order DEs & Growth/Decay Problems
 * nda-mat-vec-1   → Vectors — Magnitude, Direction, Unit & Null Vectors
 * nda-mat-vec-2   → Addition of Vectors & Scalar Multiplication
 * nda-mat-vec-3   → Scalar (Dot) Product & Vector (Cross) Product
 * nda-mat-vec-4   → Applications of Vectors (Work, Torque, Area)
 * nda-mat-stat-1  → Frequency Distribution & Graphical Representation
 * nda-mat-stat-2  → Measures of Central Tendency (Mean, Median, Mode)
 * nda-mat-stat-3  → Variance & Standard Deviation
 * nda-mat-stat-4  → Probability — Sample Space, Events & Axioms
 * nda-mat-stat-5  → Conditional Probability & Bayes' Theorem
 * nda-mat-stat-6  → Binomial Distribution
 *
 * ─── GAT (Paper II) ───
 * nda-gat-eng-1   → Grammar & Usage (Tenses, Voice, Narration)
 * nda-gat-eng-2   → Vocabulary — Synonyms, Antonyms & One-Word Substitution
 * nda-gat-eng-3   → Spotting Errors & Sentence Improvement
 * nda-gat-eng-4   → Comprehension & Cohesion in Extended Text
 * nda-gat-eng-5   → Cloze Test & Fill in the Blanks
 * nda-gat-eng-6   → Idioms, Proverbs & Phrases
 * nda-gat-eng-7   → Para Jumbling & Sentence Ordering
 * nda-gat-phy-1   → Properties of Matter
 * nda-gat-phy-2   → Motion, Newton's Laws & Momentum
 * nda-gat-phy-3   → Work, Energy, Power & Gravitation
 * nda-gat-phy-4..8 → Heat, Sound, Light, Magnetism, Electricity
 * nda-gat-che-1..8 → Chemistry (Changes, Elements, Air/Water, Acids, Carbon)
 * nda-gat-gs-1..7  → General Science (Biology, Human Body, Epidemics, Solar System)
 * nda-gat-his-1..8 → History & Indian Polity
 * nda-gat-geo-1..7 → Geography
 * nda-gat-cur-1..5 → Current Events & Defence
 */

// ═══════════════════════════════════════════════════
//  HELPER: Parse "A) text" format → plain text
// ═══════════════════════════════════════════════════
function stripLabel(opt) {
    if (!opt) return '';
    return opt.replace(/^[A-D]\)\s*/, '').trim();
}

// ═══════════════════════════════════════════════════
//  MATHEMATICS — ALGEBRA (Topics: alg-1..8)
// ═══════════════════════════════════════════════════

const NDA_ALGEBRA_QUESTIONS = {
    'nda-mat-alg-1': [
        // ── EASY ──
        { id: 'NDA-ALG1-E01', text: 'If A = {1,2,3} and B = {2,3,4}, then A∩B is:', options: ['{1,2,3,4}', '{2,3}', '{1,4}', '{}'], correctAnswer: 'B', explanation: 'A∩B contains elements common to both A and B. Common elements are 2 and 3. So A∩B = {2,3}.', difficulty: 'easy', tags: ['Sets', 'NDA'] },
        { id: 'NDA-ALG1-E02', text: 'The number of subsets of a set with 4 elements is:', options: ['4', '8', '16', '32'], correctAnswer: 'C', explanation: 'Number of subsets = 2ⁿ = 2⁴ = 16. This includes the empty set and the set itself.', difficulty: 'easy', tags: ['Sets', 'NDA'] },
        { id: 'NDA-ALG1-E03', text: 'If n(A)=3, n(B)=4, n(A∩B)=1, then n(A∪B) is:', options: ['6', '7', '8', '5'], correctAnswer: 'A', explanation: 'n(A∪B) = n(A)+n(B)-n(A∩B) = 3+4-1 = 6.', difficulty: 'easy', tags: ['Sets', 'NDA'] },
        { id: 'NDA-ALG1-E04', text: 'Power set of a set with 3 elements has how many elements?', options: ['3', '6', '8', '9'], correctAnswer: 'C', explanation: 'Power set has 2ⁿ elements = 2³ = 8 subsets.', difficulty: 'easy', tags: ['Sets', 'NDA'] },
        { id: 'NDA-ALG1-E05', text: 'If A and B are disjoint sets, then A∩B is:', options: ['A∪B', 'A', '∅ (empty set)', 'B'], correctAnswer: 'C', explanation: 'Disjoint sets have no common elements, so A∩B = ∅.', difficulty: 'easy', tags: ['Sets', 'NDA'] },
        // ── MEDIUM ──
        { id: 'NDA-ALG1-M01', text: 'If A×B has 12 elements and A has 3 elements, how many elements does B have?', options: ['3', '4', '6', '36'], correctAnswer: 'B', explanation: 'n(A×B) = n(A)×n(B) ⟹ 12 = 3×n(B) ⟹ n(B) = 4.', difficulty: 'medium', tags: ['Relations', 'NDA'] },
        { id: 'NDA-ALG1-M02', text: 'Which of the following is an equivalence relation on set of integers? R: aRb iff a-b is divisible by 5.', options: ['Only reflexive', 'Only symmetric', 'Equivalence relation', 'Not a relation'], correctAnswer: 'C', explanation: 'Reflexive: a-a=0 divisible by 5. Symmetric: if 5|(a-b) then 5|(b-a). Transitive: if 5|(a-b) and 5|(b-c) then 5|(a-c). All three hold → equivalence relation.', difficulty: 'medium', tags: ['Relations', 'NDA'] },
        { id: 'NDA-ALG1-M03', text: 'If n(A)=10, n(B)=15 and n(A∪B)=20, then n(A∩B) is:', options: ['5', '10', '15', '25'], correctAnswer: 'A', explanation: 'n(A∩B) = n(A)+n(B)-n(A∪B) = 10+15-20 = 5.', difficulty: 'medium', tags: ['Sets', 'NDA'] },
        { id: 'NDA-ALG1-M04', text: 'The number of relations from a set with 2 elements to a set with 3 elements is:', options: ['6', '8', '64', '32'], correctAnswer: 'C', explanation: 'Number of relations from A(m) to B(n) = 2^(mn) = 2^(2×3) = 2⁶ = 64.', difficulty: 'medium', tags: ['Relations', 'NDA'] },
        // ── HARD ──
        { id: 'NDA-ALG1-H01', text: 'Using De Morgan\'s law, (A∪B)\'∩C simplifies to:', options: ['(A\'∩B\')∩C', 'A\'∪B\'∪C', '(A∩B)\'∩C', 'A\'∩B\'∪C'], correctAnswer: 'A', explanation: 'By De Morgan\'s: (A∪B)\' = A\'∩B\'. Therefore (A∪B)\'∩C = (A\'∩B\')∩C.', difficulty: 'hard', tags: ['Sets', 'NDA'] },
        { id: 'NDA-ALG1-H02', text: 'If A, B, C are sets such that A∪B = A∪C and A∩B = A∩C, then:', options: ['A = B', 'B = C', 'A = C', 'A∩B = ∅'], correctAnswer: 'B', explanation: 'Given A∪B = A∪C and A∩B = A∩C. Take any x∈B: either x∈A or x∉A. If x∈A, x∈A∩B=A∩C, so x∈C. If x∉A, x∈B\A∪B but x∈A∪B=A∪C, so x∈C. Thus B⊆C. Similarly C⊆B. Therefore B=C.', difficulty: 'hard', tags: ['Sets', 'NDA'] },
    ],

    'nda-mat-alg-3': [
        // ── EASY ──
        { id: 'NDA-ALG2-E01', text: 'The value of i⁴³ is:', options: ['1', '-1', 'i', '-i'], correctAnswer: 'D', explanation: '43 = 4×10+3, so i⁴³ = (i⁴)¹⁰ × i³ = 1 × (-i) = -i.', difficulty: 'easy', tags: ['Complex Numbers', 'NDA'] },
        { id: 'NDA-ALG2-E02', text: 'The modulus of complex number 3+4i is:', options: ['3', '4', '5', '7'], correctAnswer: 'C', explanation: '|3+4i| = √(3²+4²) = √(9+16) = √25 = 5.', difficulty: 'easy', tags: ['Complex Numbers', 'NDA'] },
        { id: 'NDA-ALG2-E03', text: 'The conjugate of 2+3i is:', options: ['2-3i', '-2+3i', '-2-3i', '3+2i'], correctAnswer: 'A', explanation: 'Conjugate of a+bi is a-bi. So conjugate of 2+3i is 2-3i.', difficulty: 'easy', tags: ['Complex Numbers', 'NDA'] },
        { id: 'NDA-ALG2-E04', text: 'i² equals:', options: ['1', '-1', 'i', '0'], correctAnswer: 'B', explanation: 'By definition, i = √(-1), so i² = -1.', difficulty: 'easy', tags: ['Complex Numbers', 'NDA'] },
        // ── MEDIUM ──
        { id: 'NDA-ALG2-M01', text: 'If ω is a cube root of unity (ω≠1), then 1+ω+ω² equals:', options: ['0', '1', '3', '-1'], correctAnswer: 'A', explanation: 'This is a fundamental property: 1+ω+ω²=0 for cube root of unity.', difficulty: 'medium', tags: ['Complex Numbers', 'NDA'] },
        { id: 'NDA-ALG2-M02', text: 'The argument of complex number -1+i√3 is:', options: ['π/3', '2π/3', 'π/6', '5π/6'], correctAnswer: 'B', explanation: 'z = -1+i√3: a=-1, b=√3. In 2nd quadrant. arg = π - tan⁻¹(√3/1) = π - π/3 = 2π/3.', difficulty: 'medium', tags: ['Complex Numbers', 'NDA'] },
        { id: 'NDA-ALG2-M03', text: 'If z₁ = 2+3i and z₂ = 1-2i, then z₁·z₂ equals:', options: ['8-i', '8+i', '-4+7i', '8-7i'], correctAnswer: 'A', explanation: 'z₁·z₂ = (2+3i)(1-2i) = 2-4i+3i-6i² = 2-i+6 = 8-i.', difficulty: 'medium', tags: ['Complex Numbers', 'NDA'] },
        // ── HARD ──
        { id: 'NDA-ALG2-H01', text: 'If z = (1+i)/(1-i), then z⁴ equals:', options: ['1', '-1', 'i', '-i'], correctAnswer: 'A', explanation: 'z = (1+i)/(1-i) × (1+i)/(1+i) = (1+i)²/2 = 2i/2 = i. So z=i, z⁴=i⁴=1.', difficulty: 'hard', tags: ['Complex Numbers', 'NDA'] },
        { id: 'NDA-ALG2-H02', text: 'The number of solutions of z² + |z|² = 0 (z is complex) is:', options: ['1', '2', '3', 'Infinite'], correctAnswer: 'D', explanation: 'Let z=x+iy. z²+|z|²=0 gives 2x(x+iy)=0. So x=0 or z=0. If x=0: z=iy for any real y. Infinite solutions.', difficulty: 'hard', tags: ['Complex Numbers', 'NDA'] },
    ],

    'nda-mat-alg-4': [
        // ── EASY ──
        { id: 'NDA-ALG3-E01', text: 'If α and β are roots of x²-5x+6=0, then α+β equals:', options: ['-5', '5', '6', '-6'], correctAnswer: 'B', explanation: 'By Vieta\'s formulas, sum of roots = -b/a = -(-5)/1 = 5.', difficulty: 'easy', tags: ['Quadratic Equations', 'NDA'] },
        { id: 'NDA-ALG3-E02', text: 'The product of roots of 2x²-3x+1=0 is:', options: ['-3/2', '3/2', '1/2', '-1/2'], correctAnswer: 'C', explanation: 'Product of roots = c/a = 1/2.', difficulty: 'easy', tags: ['Quadratic Equations', 'NDA'] },
        { id: 'NDA-ALG3-E03', text: 'The roots of x²-4x+4=0 are:', options: ['2, 2', '2, -2', '4, 0', '1, 4'], correctAnswer: 'A', explanation: 'x²-4x+4 = (x-2)² = 0. So x=2 (repeated root). D = 16-16 = 0.', difficulty: 'easy', tags: ['Quadratic Equations', 'NDA'] },
        // ── MEDIUM ──
        { id: 'NDA-ALG3-M01', text: 'The discriminant of x²-4x+5=0 is:', options: ['36', '-4', '4', '0'], correctAnswer: 'B', explanation: 'D = b²-4ac = (-4)²-4(1)(5) = 16-20 = -4. Roots are complex.', difficulty: 'medium', tags: ['Quadratic Equations', 'NDA'] },
        { id: 'NDA-ALG3-M02', text: 'If α,β are roots of x²-px+q=0, then α²+β² equals:', options: ['p²-2q', 'p²+2q', 'p²-q', '2p-q'], correctAnswer: 'A', explanation: 'α²+β² = (α+β)²-2αβ = p²-2q.', difficulty: 'medium', tags: ['Quadratic Equations', 'NDA'] },
        { id: 'NDA-ALG3-M03', text: 'For what value of k does x²+kx+9=0 have equal roots?', options: ['±3', '±6', '±9', '0'], correctAnswer: 'B', explanation: 'Equal roots when D=0: k²-4(1)(9)=0 → k²=36 → k=±6.', difficulty: 'medium', tags: ['Quadratic Equations', 'NDA'] },
        // ── HARD ──
        { id: 'NDA-ALG3-H01', text: 'If the roots of x²-bx+c=0 differ by 1, then b²-4c equals:', options: ['0', '1', '2', '4'], correctAnswer: 'B', explanation: 'Let roots be α, α+1. (α-β)²=(α+β)²-4αβ = 1 ⟹ b²-4c=1.', difficulty: 'hard', tags: ['Quadratic Equations', 'NDA'] },
        { id: 'NDA-ALG3-H02', text: 'If one root of 2x²+3x+k=0 is double the other, find k:', options: ['1', '2', '3', '1/2'], correctAnswer: 'A', explanation: 'Let roots be r, 2r. Sum: 3r=-3/2 → r=-1/2. Product: 2r²=k/2 → 2(1/4)=k/2 → k=1.', difficulty: 'hard', tags: ['Quadratic Equations', 'NDA'] },
    ],

    'nda-mat-alg-6': [
        // ── EASY ──
        { id: 'NDA-ALG4-E01', text: '⁵P₂ equals:', options: ['10', '20', '5', '60'], correctAnswer: 'B', explanation: '⁵P₂ = 5!/(5-2)! = 5!/3! = 5×4 = 20.', difficulty: 'easy', tags: ['Permutations', 'NDA'] },
        { id: 'NDA-ALG4-E02', text: 'In how many ways can 5 people be arranged in a line?', options: ['25', '60', '120', '720'], correctAnswer: 'C', explanation: '⁵P₅ = 5! = 120.', difficulty: 'easy', tags: ['Permutations', 'NDA'] },
        { id: 'NDA-ALG4-E03', text: '⁸C₃ equals:', options: ['56', '336', '24', '112'], correctAnswer: 'A', explanation: '⁸C₃ = 8!/(3!×5!) = (8×7×6)/(3×2×1) = 56.', difficulty: 'easy', tags: ['Combinations', 'NDA'] },
        // ── MEDIUM ──
        { id: 'NDA-ALG4-M01', text: 'How many 3-digit numbers can be formed using digits 1,2,3,4,5 without repetition?', options: ['125', '60', '120', '20'], correctAnswer: 'B', explanation: '⁵P₃ = 5!/(5-3)! = 5×4×3 = 60.', difficulty: 'medium', tags: ['Permutations', 'NDA'] },
        { id: 'NDA-ALG4-M02', text: 'A committee of 4 from 6 men and 4 women, with at least one woman. Number of ways:', options: ['195', '209', '185', '210'], correctAnswer: 'A', explanation: 'Total = ¹⁰C₄ = 210. No women = ⁶C₄ = 15. Required = 210-15 = 195.', difficulty: 'medium', tags: ['Combinations', 'NDA'] },
        { id: 'NDA-ALG4-M03', text: 'In how many ways can 6 people be seated around a circular table?', options: ['720', '120', '360', '60'], correctAnswer: 'B', explanation: 'Circular permutation = (n-1)! = (6-1)! = 5! = 120.', difficulty: 'medium', tags: ['Permutations', 'NDA'] },
        // ── HARD ──
        { id: 'NDA-ALG4-H01', text: 'How many 4-letter words can be formed from MATHEMATICS?', options: ['2454', '1680', '2250', '756'], correctAnswer: 'A', explanation: 'MATHEMATICS: M(2),A(2),T(2),H,E,I,C,S. All different: ⁸P₄=1680; One pair: 3C1×⁷C2×4!/2!=756; Two pairs: 3C2×4!/2!2!=18. Total=2454.', difficulty: 'hard', tags: ['Permutations', 'NDA'] },
        { id: 'NDA-ALG4-H02', text: 'The greatest value of ⁿCr occurs when r equals (n=20):', options: ['5', '10', '15', '20'], correctAnswer: 'B', explanation: 'For even n, ⁿCr maximum when r=n/2=20/2=10. ²⁰C₁₀ is the greatest.', difficulty: 'hard', tags: ['Combinations', 'NDA'] },
        { id: 'NDA-ALG4-H03', text: 'A group of 5 men and 2 women from 5 men and 3 women. Number of ways:', options: ['3', '15', '45', '21'], correctAnswer: 'A', explanation: 'Choose all 5 men: ⁵C₅=1. Choose 2 women from 3: ³C₂=3. Total = 1×3 = 3.', difficulty: 'hard', tags: ['Combinations', 'NDA'] },
    ],

    'nda-mat-alg-7': [
        // ── EASY ──
        { id: 'NDA-ALG5-E01', text: 'Number of terms in the expansion of (a+b)⁷ is:', options: ['7', '8', '14', '6'], correctAnswer: 'B', explanation: 'Number of terms = n+1 = 7+1 = 8.', difficulty: 'easy', tags: ['Binomial Theorem', 'NDA'] },
        { id: 'NDA-ALG5-E02', text: 'Sum of all binomial coefficients in (1+x)⁶ is:', options: ['32', '64', '128', '6'], correctAnswer: 'B', explanation: 'Put x=1: sum of coefficients = 2⁶ = 64.', difficulty: 'easy', tags: ['Binomial Theorem', 'NDA'] },
        // ── MEDIUM ──
        { id: 'NDA-ALG5-M01', text: 'The term independent of x in (x + 1/x)¹⁰ is:', options: ['¹⁰C₅', '¹⁰C₄', '252', '¹⁰C₃'], correctAnswer: 'C', explanation: 'T(r+1)=¹⁰Cᵣ·x^(10-2r). For x⁰: 10-2r=0, r=5. T₆=¹⁰C₅=252.', difficulty: 'medium', tags: ['Binomial Theorem', 'NDA'] },
        { id: 'NDA-ALG5-M02', text: 'The coefficient of x³ in (1+x)⁷ is:', options: ['21', '35', '7', '28'], correctAnswer: 'B', explanation: 'Coefficient of x³ = ⁷C₃ = 7!/(3!4!) = 35.', difficulty: 'medium', tags: ['Binomial Theorem', 'NDA'] },
        { id: 'NDA-ALG5-M03', text: 'The number of terms in expansion of (a+b+c)¹⁰ is:', options: ['11', '66', '55', '33'], correctAnswer: 'B', explanation: 'Number of terms in (a+b+c)ⁿ = (n+1)(n+2)/2 = 11×12/2 = 66.', difficulty: 'medium', tags: ['Binomial Theorem', 'NDA'] },
        // ── HARD ──
        { id: 'NDA-ALG5-H01', text: 'If (1+x)ⁿ = C₀+C₁x+...+Cₙxⁿ, then C₀+C₁+...+Cₙ equals:', options: ['n', 'n²', '2ⁿ', '2ⁿ⁻¹'], correctAnswer: 'C', explanation: 'Put x=1: (1+1)ⁿ = C₀+C₁+...+Cₙ = 2ⁿ.', difficulty: 'hard', tags: ['Binomial Theorem', 'NDA'] },
        { id: 'NDA-ALG5-H02', text: 'Find the middle term of (x/2 - 2/x)¹²:', options: ['-¹²C₆/2', '¹²C₆×(-1)⁶', '-924', '924'], correctAnswer: 'D', explanation: 'n=12, middle term = T₇. (-2/x)⁶ is positive. T₇ = ¹²C₆ = 924.', difficulty: 'hard', tags: ['Binomial Theorem', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  MATHEMATICS — MATRICES & DETERMINANTS (mat-1..2)
// ═══════════════════════════════════════════════════

const NDA_MATRICES_QUESTIONS = {
    'nda-mat-mat-1': [
        { id: 'NDA-MAT1-E01', text: 'If A is a 2×3 matrix and B is a 3×4 matrix, order of AB is:', options: ['2×4', '3×3', '4×2', '2×3'], correctAnswer: 'A', explanation: 'A(2×3)·B(3×4) = AB(2×4). Inner dims match, result is outer dimensions.', difficulty: 'easy', tags: ['Matrices', 'NDA'] },
        { id: 'NDA-MAT1-E02', text: 'For a symmetric matrix A, Aᵀ equals:', options: ['A⁻¹', '-A', 'A', '0'], correctAnswer: 'C', explanation: 'By definition, a symmetric matrix satisfies Aᵀ = A.', difficulty: 'easy', tags: ['Matrices', 'NDA'] },
        { id: 'NDA-MAT1-E03', text: 'The identity matrix I₂ is:', options: ['[[1,0],[0,1]]', '[[0,1],[1,0]]', '[[1,1],[1,1]]', '[[0,0],[0,0]]'], correctAnswer: 'A', explanation: 'Identity matrix has 1s on main diagonal and 0s elsewhere.', difficulty: 'easy', tags: ['Matrices', 'NDA'] },
        { id: 'NDA-MAT1-E04', text: 'If A = [[1,2],[3,4]], then Aᵀ equals:', options: ['[[1,3],[2,4]]', '[[4,3],[2,1]]', '[[1,2],[3,4]]', '[[-1,-2],[-3,-4]]'], correctAnswer: 'A', explanation: 'Transpose: rows become columns. Aᵀ = [[1,3],[2,4]].', difficulty: 'easy', tags: ['Matrices', 'NDA'] },
        { id: 'NDA-MAT1-M01', text: 'For a skew-symmetric matrix A, the diagonal elements are:', options: ['1', 'Arbitrary', '0', 'Equal to each other'], correctAnswer: 'C', explanation: 'A=-Aᵀ gives aᵢᵢ=-aᵢᵢ ⟹ 2aᵢᵢ=0 ⟹ aᵢᵢ=0.', difficulty: 'medium', tags: ['Matrices', 'NDA'] },
        { id: 'NDA-MAT1-M02', text: 'If A² = A, then (I-A)² equals:', options: ['I-A', 'I+A', 'I', 'A'], correctAnswer: 'A', explanation: '(I-A)² = I-2A+A² = I-2A+A = I-A. (Using idempotent A²=A).', difficulty: 'medium', tags: ['Matrices', 'NDA'] },
        { id: 'NDA-MAT1-H01', text: 'If A is orthogonal matrix, then |A| equals:', options: ['0', '1', '±1', '2'], correctAnswer: 'C', explanation: 'AAᵀ=I ⟹ |A|²=1 ⟹ |A|=±1.', difficulty: 'hard', tags: ['Matrices', 'NDA'] },
    ],

    'nda-mat-mat-2': [
        { id: 'NDA-MAT2-E01', text: 'The determinant of [[2,3],[1,4]] is:', options: ['5', '8', '11', '-5'], correctAnswer: 'A', explanation: 'det = 2×4 - 3×1 = 8-3 = 5.', difficulty: 'easy', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-E02', text: 'A square matrix A is singular if:', options: ['|A|=1', '|A|=0', 'A=I', 'A=Aᵀ'], correctAnswer: 'B', explanation: 'A matrix is singular if determinant = 0 (no inverse exists).', difficulty: 'easy', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-E03', text: 'det([[1,2],[3,4]]) equals:', options: ['10', '-2', '2', '-10'], correctAnswer: 'B', explanation: 'det = 1×4 - 2×3 = 4-6 = -2.', difficulty: 'easy', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-E04', text: 'For 3×3 matrix A, |kA| equals:', options: ['k|A|', '3k|A|', 'k³|A|', 'k²|A|'], correctAnswer: 'C', explanation: '|kA| = kⁿ|A| for n×n matrix. For 3×3: |kA| = k³|A|.', difficulty: 'easy', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-M01', text: 'If A=[[2,1],[1,3]], find A⁻¹:', options: ['(1/5)[[3,-1],[-1,2]]', '(1/5)[[-3,1],[1,-2]]', '[[3,-1],[-1,2]]', '[[1/2,1],[1,1/3]]'], correctAnswer: 'A', explanation: '|A|=6-1=5. adj(A)=[[3,-1],[-1,2]]. A⁻¹=(1/5)[[3,-1],[-1,2]].', difficulty: 'medium', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-M02', text: 'If |A|=3 for 3×3 matrix, then |adj(A)| equals:', options: ['3', '9', '27', '1/3'], correctAnswer: 'B', explanation: '|adj(A)| = |A|^(n-1) = 3² = 9.', difficulty: 'medium', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-M03', text: 'Using Cramer\'s rule for x+y=3, 2x-y=0: x equals:', options: ['1', '2', '3', '0'], correctAnswer: 'A', explanation: 'Δ=-3, Δx=-3. x=Δx/Δ=1.', difficulty: 'medium', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-H01', text: 'If A is 3×3 matrix with |A|=4, then |2A| equals:', options: ['8', '16', '32', '64'], correctAnswer: 'C', explanation: '|kA|=kⁿ|A| → |2A|=2³×4=32.', difficulty: 'hard', tags: ['Determinants', 'NDA'] },
        { id: 'NDA-MAT2-H02', text: 'The system x+y+z=6, x+2y+3z=14, x+4y+7z=30 has:', options: ['Unique solution', 'No solution', 'Infinitely many solutions', 'Two solutions'], correctAnswer: 'C', explanation: 'Rank coefficients = rank augmented = 2 < 3 variables. Infinitely many solutions.', difficulty: 'hard', tags: ['Determinants', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  MATHEMATICS — TRIGONOMETRY (trig-1..3)
// ═══════════════════════════════════════════════════

const NDA_TRIG_QUESTIONS = {
    'nda-mat-trig-1': [
        { id: 'NDA-TRIG1-E01', text: 'The value of sin30°+cos60° is:', options: ['0', '1', '√3/2', '1/2'], correctAnswer: 'B', explanation: 'sin30°=1/2, cos60°=1/2. Sum = 1.', difficulty: 'easy', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-E02', text: 'If sinθ=3/5, then cosθ is (θ in first quadrant):', options: ['4/5', '3/4', '5/4', '5/3'], correctAnswer: 'A', explanation: 'cos²θ = 1-9/25 = 16/25. cosθ = 4/5 (positive in Q1).', difficulty: 'easy', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-E03', text: 'The value of tan45° is:', options: ['0', '1/√2', '1', '√3'], correctAnswer: 'C', explanation: 'tan45° = sin45°/cos45° = 1.', difficulty: 'easy', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-E04', text: 'sin(90°-θ) equals:', options: ['sinθ', '-sinθ', 'cosθ', '-cosθ'], correctAnswer: 'C', explanation: 'sin(90°-θ) = cosθ. Standard complementary angle identity.', difficulty: 'easy', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-E05', text: '1+tan²θ equals:', options: ['sec²θ', 'cosec²θ', 'cot²θ', 'cos²θ'], correctAnswer: 'A', explanation: 'Fundamental identity: 1+tan²θ = sec²θ.', difficulty: 'easy', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-E06', text: 'cos(180°-θ) equals:', options: ['cosθ', '-cosθ', 'sinθ', '-sinθ'], correctAnswer: 'B', explanation: 'cos(π-θ) = -cosθ.', difficulty: 'easy', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-E07', text: 'sin2θ equals:', options: ['2sinθ', '2cosθ', '2sinθcosθ', 'sin²θ-cos²θ'], correctAnswer: 'C', explanation: 'sin2θ = 2sinθcosθ. Double angle formula.', difficulty: 'easy', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-M01', text: 'The value of sin75° is:', options: ['(√6+√2)/4', '(√6-√2)/4', '(√3+1)/2√2', 'Both A and C'], correctAnswer: 'D', explanation: 'sin75°=sin(45°+30°) = (√3+1)/2√2 = (√6+√2)/4. Both forms are equivalent.', difficulty: 'medium', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-M02', text: 'If tanA=1/2 and tanB=1/3, then tan(A+B) equals:', options: ['1/6', '5/6', '1', '7/6'], correctAnswer: 'C', explanation: 'tan(A+B) = (1/2+1/3)/(1-1/6) = (5/6)/(5/6) = 1.', difficulty: 'medium', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-M03', text: 'cos2θ in terms of sinθ is:', options: ['2sin²θ-1', '1-2sin²θ', '1-sin²θ', 'sin²θ'], correctAnswer: 'B', explanation: 'cos2θ = cos²θ-sin²θ = 1-2sin²θ.', difficulty: 'medium', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-M04', text: 'sin20°sin40°sin80° equals:', options: ['√3/8', '1/8', '3/8', '√3/4'], correctAnswer: 'A', explanation: 'sinθ·sin(60°-θ)·sin(60°+θ)=sin3θ/4. sin60°/4 = √3/8.', difficulty: 'medium', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-M05', text: 'The general solution of sinθ=1/2 is:', options: ['nπ + π/6', 'nπ + (-1)ⁿπ/6', '2nπ ± π/6', 'nπ ± π/6'], correctAnswer: 'B', explanation: 'sinθ=sinα ⟹ θ = nπ+(-1)ⁿα. Here α=π/6.', difficulty: 'medium', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-H01', text: 'If sinA+sinB=√3(cosB-cosA), then sin3A+sin3B equals:', options: ['0', '1', '2', '-1'], correctAnswer: 'A', explanation: 'Using sum-to-product: A-B=π/3. Then sin3A+sin3B=2sin(...)cos(3π/6)=2sin(...)cos(π/2)=0.', difficulty: 'hard', tags: ['Trigonometry', 'NDA'] },
        { id: 'NDA-TRIG1-H02', text: 'The number of solutions of 2sinx+cosx=3 in [0,2π] is:', options: ['0', '1', '2', '4'], correctAnswer: 'A', explanation: 'Max value of 2sinx+cosx = √(4+1) = √5 ≈ 2.236 < 3. No solutions exist.', difficulty: 'hard', tags: ['Trigonometry', 'NDA'] },
    ],

    'nda-mat-trig-4': [
        { id: 'NDA-TRIG2-E01', text: 'The principal value of sin⁻¹(1/2) is:', options: ['π/6', 'π/3', 'π/4', '5π/6'], correctAnswer: 'A', explanation: 'sin(π/6)=1/2 and π/6 ∈ [-π/2,π/2].', difficulty: 'easy', tags: ['Inverse Trig', 'NDA'] },
        { id: 'NDA-TRIG2-E02', text: 'sin⁻¹x + cos⁻¹x equals (for x∈[-1,1]):', options: ['0', 'π', 'π/2', '1'], correctAnswer: 'C', explanation: 'sin⁻¹x + cos⁻¹x = π/2. Standard identity.', difficulty: 'easy', tags: ['Inverse Trig', 'NDA'] },
        { id: 'NDA-TRIG2-E03', text: 'tan⁻¹(1) equals:', options: ['π/6', 'π/4', 'π/3', 'π/2'], correctAnswer: 'B', explanation: 'tan(π/4)=1, so tan⁻¹(1)=π/4.', difficulty: 'easy', tags: ['Inverse Trig', 'NDA'] },
        { id: 'NDA-TRIG2-M01', text: 'tan⁻¹(1) + tan⁻¹(2) + tan⁻¹(3) equals:', options: ['π/2', 'π', '3π/4', '2π'], correctAnswer: 'B', explanation: 'tan⁻¹(1)=π/4. tan⁻¹(2)+tan⁻¹(3)=π-π/4=3π/4. Total = π.', difficulty: 'medium', tags: ['Inverse Trig', 'NDA'] },
        { id: 'NDA-TRIG2-M02', text: 'tan⁻¹(1/2) + tan⁻¹(1/5) + tan⁻¹(1/8) equals:', options: ['π/4', 'π/2', 'π', 'π/3'], correctAnswer: 'A', explanation: 'Step-by-step application of tan⁻¹ addition formula yields π/4.', difficulty: 'medium', tags: ['Inverse Trig', 'NDA'] },
        { id: 'NDA-TRIG2-H01', text: 'The value of cos(sin⁻¹(3/5)) is:', options: ['3/5', '4/5', '5/3', '5/4'], correctAnswer: 'B', explanation: 'Let θ=sin⁻¹(3/5). sinθ=3/5, cosθ=√(1-9/25)=4/5.', difficulty: 'hard', tags: ['Inverse Trig', 'NDA'] },
    ],

    'nda-mat-trig-6': [
        { id: 'NDA-TRIG3-E01', text: 'In triangle ABC, a/sinA = 2R where R is:', options: ['Inradius', 'Circumradius', 'Area', 'Semiperimeter'], correctAnswer: 'B', explanation: 'Sine rule: a/sinA = 2R where R is circumradius.', difficulty: 'easy', tags: ['Properties of Triangles', 'NDA'] },
        { id: 'NDA-TRIG3-E02', text: 'Heron\'s formula for area of triangle is:', options: ['½bh', '√[s(s-a)(s-b)(s-c)]', 'πr²', 'abc/4R'], correctAnswer: 'B', explanation: 'Heron\'s formula: Area = √[s(s-a)(s-b)(s-c)] where s=(a+b+c)/2.', difficulty: 'easy', tags: ['Properties of Triangles', 'NDA'] },
        { id: 'NDA-TRIG3-M01', text: 'The area of triangle with sides a=5, b=6, c=7 is:', options: ['6√6', '4√6', '5√6', '3√6'], correctAnswer: 'A', explanation: 's=9. Area=√[9×4×3×2]=√216=6√6.', difficulty: 'medium', tags: ['Properties of Triangles', 'NDA'] },
        { id: 'NDA-TRIG3-H01', text: 'If tanA/2=5/6 and tanB/2=20/37, find tanC/2:', options: ['1/5', '2/5', '1/4', '1/7'], correctAnswer: 'B', explanation: 'A+B+C=π → tanC/2=cot((A+B)/2). Computed: 2/5.', difficulty: 'hard', tags: ['Properties of Triangles', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  MATHEMATICS — DIFFERENTIAL CALCULUS & INTEGRAL CALCULUS (dcal/ical)
// ═══════════════════════════════════════════════════

const NDA_CALCULUS_QUESTIONS = {
    'nda-mat-dcal-3': [
        { id: 'NDA-CALC1-E01', text: 'lim[x→2] (x²-4)/(x-2) equals:', options: ['0', '2', '4', '∞'], correctAnswer: 'C', explanation: '(x²-4)/(x-2) = (x+2). At x=2: 4.', difficulty: 'easy', tags: ['Limits', 'NDA'] },
        { id: 'NDA-CALC1-E02', text: 'lim[x→0] sinx/x equals:', options: ['0', '∞', '1', 'π'], correctAnswer: 'C', explanation: 'Standard limit: lim[x→0]sinx/x = 1.', difficulty: 'easy', tags: ['Limits', 'NDA'] },
        { id: 'NDA-CALC1-E03', text: 'A function is continuous at x=a if:', options: ['f(a) exists', 'lim f(x) exists', 'lim f(x) = f(a)', 'f\'(a) exists'], correctAnswer: 'C', explanation: 'Continuity requires: f(a) defined, limit exists, and limit = f(a).', difficulty: 'easy', tags: ['Continuity', 'NDA'] },
        { id: 'NDA-CALC1-M01', text: 'lim[x→∞](1+2/x)^x equals:', options: ['1', 'e', 'e²', '2e'], correctAnswer: 'C', explanation: '(1+2/x)^x = [(1+2/x)^(x/2)]² → e² as x→∞.', difficulty: 'medium', tags: ['Limits', 'NDA'] },
        { id: 'NDA-CALC1-M02', text: 'lim[x→0] (eˣ-1)/x equals:', options: ['e', '0', '1', '∞'], correctAnswer: 'C', explanation: 'Standard limit. Also by L\'Hôpital: lim eˣ/1 = 1.', difficulty: 'medium', tags: ['Limits', 'NDA'] },
        { id: 'NDA-CALC1-H01', text: 'lim[x→0] (1-cosx)/x² equals:', options: ['0', '1/2', '1', '∞'], correctAnswer: 'B', explanation: 'Standard limit: lim[x→0](1-cosx)/x² = 1/2.', difficulty: 'hard', tags: ['Limits', 'NDA'] },
    ],

    'nda-mat-dcal-4': [
        { id: 'NDA-CALC2-E01', text: 'd/dx(x⁵) equals:', options: ['x⁴', '5x⁴', 'x⁶/6', '5x⁵'], correctAnswer: 'B', explanation: 'd/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x⁵) = 5x⁴.', difficulty: 'easy', tags: ['Differentiation', 'NDA'] },
        { id: 'NDA-CALC2-E02', text: 'The derivative of eˣ is:', options: ['eˣ⁻¹', 'xeˣ', 'eˣ', 'e'], correctAnswer: 'C', explanation: 'd/dx(eˣ) = eˣ. Exponential is its own derivative.', difficulty: 'easy', tags: ['Differentiation', 'NDA'] },
        { id: 'NDA-CALC2-E03', text: 'd/dx(sinx) equals:', options: ['cosx', '-cosx', '-sinx', 'cosecx'], correctAnswer: 'A', explanation: 'd/dx(sinx) = cosx.', difficulty: 'easy', tags: ['Differentiation', 'NDA'] },
        { id: 'NDA-CALC2-E04', text: 'd/dx(log x) equals:', options: ['1/x', 'log(1/x)', 'x', '1/log x'], correctAnswer: 'A', explanation: 'd/dx(logₑx) = 1/x.', difficulty: 'easy', tags: ['Differentiation', 'NDA'] },
        { id: 'NDA-CALC2-E05', text: 'f(x) = x² - 4x + 3 has minimum at x =', options: ['1', '2', '3', '4'], correctAnswer: 'B', explanation: 'f\'(x) = 2x-4 = 0 ⟹ x=2. f\'\'=2>0, so minimum.', difficulty: 'easy', tags: ['Derivatives', 'NDA'] },
        { id: 'NDA-CALC2-M01', text: 'd/dx(sin⁻¹x) equals:', options: ['1/√(1+x²)', '-1/√(1-x²)', '1/√(1-x²)', '-1/√(1+x²)'], correctAnswer: 'C', explanation: 'd/dx(sin⁻¹x) = 1/√(1-x²).', difficulty: 'medium', tags: ['Differentiation', 'NDA'] },
        { id: 'NDA-CALC2-M02', text: 'The slope of tangent to y=x³-3x at x=2 is:', options: ['6', '9', '3', '12'], correctAnswer: 'B', explanation: 'dy/dx = 3x²-3. At x=2: 3(4)-3 = 9.', difficulty: 'medium', tags: ['Derivatives', 'NDA'] },
        { id: 'NDA-CALC2-M03', text: 'd/dx(xˣ) equals:', options: ['xˣ', 'x·xˣ⁻¹', 'xˣ(1+logx)', 'xˣ·logx'], correctAnswer: 'C', explanation: 'Let y=xˣ. logy=xlogx. (1/y)dy/dx=logx+1. dy/dx=xˣ(1+logx).', difficulty: 'medium', tags: ['Differentiation', 'NDA'] },
        { id: 'NDA-CALC2-M04', text: 'Intervals where f(x)=x³-6x²+9x+15 is decreasing:', options: ['(1,3)', '(0,3)', '(3,∞)', '(0,1)'], correctAnswer: 'A', explanation: 'f\'(x) = 3(x-1)(x-3). f\'<0 when 1<x<3.', difficulty: 'medium', tags: ['Derivatives', 'NDA'] },
        { id: 'NDA-CALC2-H01', text: 'If y=log(sinx), then d²y/dx² equals:', options: ['-cosec²x', 'cosec²x', 'cotx', '-cot²x'], correctAnswer: 'A', explanation: 'dy/dx=cotx. d²y/dx²=-cosec²x.', difficulty: 'hard', tags: ['Differentiation', 'NDA'] },
        { id: 'NDA-CALC2-H02', text: 'The maximum value of sinx·cosx is:', options: ['1', '1/2', '√2', '2'], correctAnswer: 'B', explanation: 'sinx·cosx = sin2x/2. Max sin2x=1, so max = 1/2.', difficulty: 'hard', tags: ['Derivatives', 'NDA'] },
    ],

    'nda-mat-ical-1': [
        { id: 'NDA-CALC3-E01', text: '∫cosx dx equals:', options: ['sinx+C', '-sinx+C', 'cosx+C', 'tanx+C'], correctAnswer: 'A', explanation: '∫cosx dx = sinx + C.', difficulty: 'easy', tags: ['Integration', 'NDA'] },
        { id: 'NDA-CALC3-E02', text: '∫₀¹ x dx equals:', options: ['0', '1', '1/2', '2'], correctAnswer: 'C', explanation: '∫₀¹ x dx = [x²/2]₀¹ = 1/2.', difficulty: 'easy', tags: ['Integration', 'NDA'] },
        { id: 'NDA-CALC3-E03', text: '∫(1/x)dx equals:', options: ['1/x²+C', 'ln|x|+C', 'x+C', '-1/x²+C'], correctAnswer: 'B', explanation: '∫(1/x)dx = ln|x|+C.', difficulty: 'easy', tags: ['Integration', 'NDA'] },
        { id: 'NDA-CALC3-M01', text: '∫x·eˣ dx equals:', options: ['xeˣ+C', 'eˣ(x-1)+C', 'xeˣ-eˣ+C', '(x-1)eˣ+C'], correctAnswer: 'D', explanation: 'By parts: ∫xeˣdx = xeˣ-eˣ = (x-1)eˣ+C.', difficulty: 'medium', tags: ['Integration', 'NDA'] },
        { id: 'NDA-CALC3-M02', text: '∫₀^(π/2) sin²x dx equals:', options: ['π/4', 'π/2', '1/2', 'π'], correctAnswer: 'A', explanation: 'sin²x=(1-cos2x)/2. Integral = π/4.', difficulty: 'medium', tags: ['Integration', 'NDA'] },
        { id: 'NDA-CALC3-M03', text: '∫dx/(1+x²) equals:', options: ['log(1+x²)+C', 'tan⁻¹x+C', 'sin⁻¹x+C', 'cot⁻¹x+C'], correctAnswer: 'B', explanation: '∫dx/(1+x²) = tan⁻¹x + C.', difficulty: 'medium', tags: ['Integration', 'NDA'] },
        { id: 'NDA-CALC3-M04', text: 'Area bounded by y=x², x-axis, x=0, x=3 is:', options: ['9', '6', '3', '27'], correctAnswer: 'A', explanation: '∫₀³ x²dx = [x³/3]₀³ = 9.', difficulty: 'medium', tags: ['Area', 'NDA'] },
        { id: 'NDA-CALC3-H01', text: '∫₀^π x·sinx dx equals:', options: ['0', 'π', '2π', 'π/2'], correctAnswer: 'B', explanation: 'By parts: [-xcosᵪ]₀^π + ∫cosx dx = π+0 = π.', difficulty: 'hard', tags: ['Integration', 'NDA'] },
        { id: 'NDA-CALC3-H02', text: '∫₋₁¹ x|x| dx is:', options: ['2/3', '0', '-2/3', '4/3'], correctAnswer: 'B', explanation: 'f(x)=x|x| is odd. ∫₋ₐᵃ odd function dx = 0.', difficulty: 'hard', tags: ['Integration', 'NDA'] },
    ],

    'nda-mat-ical-5': [
        { id: 'NDA-CALC4-E01', text: 'The order of the DE dy/dx + y = eˣ is:', options: ['0', '1', '2', '3'], correctAnswer: 'B', explanation: 'Order = highest derivative order. dy/dx is first order.', difficulty: 'easy', tags: ['Differential Equations', 'NDA'] },
        { id: 'NDA-CALC4-E02', text: 'The degree of (d²y/dx²)³ + dy/dx = 0 is:', options: ['1', '2', '3', '6'], correctAnswer: 'C', explanation: 'Degree = power of highest order derivative = 3.', difficulty: 'easy', tags: ['Differential Equations', 'NDA'] },
        { id: 'NDA-CALC4-M01', text: 'Solution of dy/dx = y/x is:', options: ['y = Cx', 'y = x+C', 'y = Ce^x', 'y = Cx²'], correctAnswer: 'A', explanation: 'dy/y = dx/x → ln|y| = ln|x| + C₁ → y = Cx.', difficulty: 'medium', tags: ['Differential Equations', 'NDA'] },
        { id: 'NDA-CALC4-M02', text: 'The integrating factor of dy/dx + y = eˣ is:', options: ['eˣ', 'e⁻ˣ', 'x', '1/x'], correctAnswer: 'A', explanation: 'IF = e^(∫1 dx) = eˣ.', difficulty: 'medium', tags: ['Differential Equations', 'NDA'] },
        { id: 'NDA-CALC4-H01', text: 'Solution of dy/dx = (x+y)/(x-y) with y(1)=0:', options: ['x²+y²=1', 'x²-y²=1', 'x²+y²-2tan⁻¹(y/x)=1', 'xy=1'], correctAnswer: 'C', explanation: 'Homogeneous DE → put y=vx. After integration: x²+y²-2tan⁻¹(y/x)=C. At (1,0): C=1.', difficulty: 'hard', tags: ['Differential Equations', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  MATHEMATICS — VECTORS, STATS (vec, stat)
// ═══════════════════════════════════════════════════

const NDA_VECTORS_STATS_QUESTIONS = {
    'nda-mat-vec-3': [
        { id: 'NDA-VEC1-E01', text: 'If a⃗ = 2î+3ĵ, then |a⃗| is:', options: ['5', '√13', '√5', '13'], correctAnswer: 'B', explanation: '|a⃗| = √(4+9) = √13.', difficulty: 'easy', tags: ['Vectors', 'NDA'] },
        { id: 'NDA-VEC1-E02', text: 'Dot product of perpendicular vectors is:', options: ['1', '0', '-1', '|a||b|'], correctAnswer: 'B', explanation: 'a⃗·b⃗ = |a||b|cosθ. At θ=90°, cos90°=0.', difficulty: 'easy', tags: ['Vectors', 'NDA'] },
        { id: 'NDA-VEC1-E03', text: 'î × ĵ equals:', options: ['0', '1', 'k̂', '-k̂'], correctAnswer: 'C', explanation: 'î × ĵ = k̂ (right-hand rule).', difficulty: 'easy', tags: ['Vectors', 'NDA'] },
        { id: 'NDA-VEC1-M01', text: 'If a⃗·b⃗ = |a⃗||b⃗|, then the angle between them is:', options: ['0°', '45°', '90°', '180°'], correctAnswer: 'A', explanation: 'a⃗·b⃗ = |a||b|cosθ = |a||b| ⟹ cosθ=1 ⟹ θ=0°.', difficulty: 'medium', tags: ['Vectors', 'NDA'] },
        { id: 'NDA-VEC1-M02', text: 'Area of parallelogram formed by a⃗=î+2ĵ and b⃗=3î+ĵ:', options: ['5', '7', '√5', '|a⃗×b⃗| = 5'], correctAnswer: 'A', explanation: 'a⃗×b⃗ = (1)(1)-(2)(3) = -5. Area = |a⃗×b⃗| = 5.', difficulty: 'medium', tags: ['Vectors', 'NDA'] },
        { id: 'NDA-VEC1-H01', text: 'If a⃗×b⃗ = a⃗×c⃗ and a⃗≠0, then:', options: ['b⃗=c⃗', 'b⃗-c⃗ is parallel to a⃗', 'b⃗⊥c⃗', 'a⃗·b⃗=0'], correctAnswer: 'B', explanation: 'a⃗×(b⃗-c⃗)=0 ⟹ (b⃗-c⃗) is parallel to a⃗.', difficulty: 'hard', tags: ['Vectors', 'NDA'] },
    ],

    'nda-mat-ag3d-2': [
        { id: 'NDA-VEC2-E01', text: 'Direction cosines of x-axis are:', options: ['(1,0,0)', '(0,1,0)', '(0,0,1)', '(1,1,1)'], correctAnswer: 'A', explanation: 'x-axis has direction cosines (cos0°, cos90°, cos90°) = (1,0,0).', difficulty: 'easy', tags: ['3D Geometry', 'NDA'] },
        { id: 'NDA-VEC2-E02', text: 'Distance between points (1,2,3) and (4,6,3) is:', options: ['5', '7', '√34', '3'], correctAnswer: 'A', explanation: 'd = √[(4-1)²+(6-2)²+(3-3)²] = √(9+16) = 5.', difficulty: 'easy', tags: ['3D Geometry', 'NDA'] },
        { id: 'NDA-VEC2-M01', text: 'Equation of plane passing through (1,2,3) perpendicular to n⃗=2î+3ĵ+k̂:', options: ['2x+3y+z=11', '2x+3y+z=14', 'x+2y+3z=14', '2x+3y+z=0'], correctAnswer: 'A', explanation: '2(x-1)+3(y-2)+1(z-3)=0 → 2x+3y+z=11.', difficulty: 'medium', tags: ['3D Geometry', 'NDA'] },
        { id: 'NDA-VEC2-H01', text: 'Shortest distance between parallel lines r⃗=a⃗₁+λb⃗ and r⃗=a⃗₂+μb⃗ is:', options: ['|(a⃗₂-a⃗₁)×b⃗|/|b⃗|', '|(a⃗₂-a⃗₁)·b⃗|/|b⃗|', '|a⃗₁×a⃗₂|', '0'], correctAnswer: 'A', explanation: 'Distance = |(a⃗₂-a⃗₁)×b⃗|/|b⃗| for parallel lines.', difficulty: 'hard', tags: ['3D Geometry', 'NDA'] },
    ],

    'nda-mat-stat-2': [
        { id: 'NDA-STAT1-E01', text: 'Mean of 2,4,6,8,10 is:', options: ['5', '6', '7', '8'], correctAnswer: 'B', explanation: 'Mean = (2+4+6+8+10)/5 = 30/5 = 6.', difficulty: 'easy', tags: ['Statistics', 'NDA'] },
        { id: 'NDA-STAT1-E02', text: 'Median of 3,7,1,5,9 is:', options: ['5', '3', '7', '1'], correctAnswer: 'A', explanation: 'Sorted: 1,3,5,7,9. Middle value = 5.', difficulty: 'easy', tags: ['Statistics', 'NDA'] },
        { id: 'NDA-STAT1-M01', text: 'If variance of x₁,...,xₙ is σ², variance of ax₁+b,...,axₙ+b is:', options: ['σ²', 'a²σ²', 'aσ²+b', '(aσ+b)²'], correctAnswer: 'B', explanation: 'Var(aX+b) = a²Var(X) = a²σ². Translation doesn\'t affect variance.', difficulty: 'medium', tags: ['Statistics', 'NDA'] },
    ],

    'nda-mat-stat-4': [
        { id: 'NDA-STAT2-E01', text: 'P(A∪B) = P(A)+P(B)-P(A∩B). If A,B independent, P(A∩B) =:', options: ['0', 'P(A)+P(B)', 'P(A)·P(B)', 'P(A)/P(B)'], correctAnswer: 'C', explanation: 'For independent events: P(A∩B) = P(A)·P(B).', difficulty: 'easy', tags: ['Probability', 'NDA'] },
        { id: 'NDA-STAT2-E02', text: 'A fair die is thrown. P(getting even number) is:', options: ['1/6', '1/3', '1/2', '2/3'], correctAnswer: 'C', explanation: 'Even numbers: {2,4,6}. P = 3/6 = 1/2.', difficulty: 'easy', tags: ['Probability', 'NDA'] },
        { id: 'NDA-STAT2-M01', text: 'If P(A)=0.6, P(B)=0.4, P(A∩B)=0.2, find P(A|B):', options: ['0.3', '0.5', '0.8', '0.2'], correctAnswer: 'B', explanation: 'P(A|B) = P(A∩B)/P(B) = 0.2/0.4 = 0.5.', difficulty: 'medium', tags: ['Probability', 'NDA'] },
        { id: 'NDA-STAT2-M02', text: 'Three coins are tossed. P(at least one head) is:', options: ['1/8', '3/8', '7/8', '1/2'], correctAnswer: 'C', explanation: 'P(at least 1H) = 1-P(no heads) = 1-1/8 = 7/8.', difficulty: 'medium', tags: ['Probability', 'NDA'] },
        { id: 'NDA-STAT2-H01', text: 'A bag has 5 red and 3 blue balls. 2 balls drawn. P(both red):', options: ['10/28', '5/14', '25/64', '5/28'], correctAnswer: 'A', explanation: 'P = ⁵C₂/⁸C₂ = 10/28 = 5/14.', difficulty: 'hard', tags: ['Probability', 'NDA'] },
    ],

    'nda-mat-stat-6': [
        { id: 'NDA-STAT3-E01', text: 'In Binomial distribution B(n,p), mean is:', options: ['np', 'npq', 'n/p', 'p/n'], correctAnswer: 'A', explanation: 'Mean of B(n,p) = np.', difficulty: 'easy', tags: ['Distribution', 'NDA'] },
        { id: 'NDA-STAT3-M01', text: 'Variance of B(10, 0.3) is:', options: ['3', '2.1', '0.3', '7'], correctAnswer: 'B', explanation: 'Var = npq = 10×0.3×0.7 = 2.1.', difficulty: 'medium', tags: ['Distribution', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  GAT — ENGLISH (eng-1..3)
// ═══════════════════════════════════════════════════

const NDA_ENGLISH_QUESTIONS = {
    'nda-gat-eng-1': [
        { id: 'NDA-ENG1-E01', text: 'Choose the correct sentence:', options: ['The news are shocking', 'The news is shocking', 'The news were shocking', 'The news have shocked'], correctAnswer: 'B', explanation: '\'News\' is uncountable and takes singular verb: "The news IS shocking."', difficulty: 'easy', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-E02', text: 'She has been working __ 2019. Fill the blank:', options: ['for', 'from', 'since', 'during'], correctAnswer: 'C', explanation: '\'Since\' is used with a point of time (2019). \'For\' is for duration.', difficulty: 'easy', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-E03', text: 'Choose the correct article: He is __ honest man.', options: ['a', 'an', 'the', 'No article'], correctAnswer: 'B', explanation: '\'Honest\' has silent \'h\', vowel sound → use \'an\'.', difficulty: 'easy', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-E04', text: 'Which sentence is in Past Perfect tense?', options: ['He was eating dinner', 'He had eaten dinner before she arrived', 'He ate dinner yesterday', 'He will eat dinner soon'], correctAnswer: 'B', explanation: 'Past Perfect = had + past participle. "He had eaten" is Past Perfect.', difficulty: 'easy', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-E05', text: 'Find the error: \'Each of the boys have submitted their assignment.\'', options: ['Each of the boys', 'have submitted', 'their assignment', 'No error'], correctAnswer: 'B', explanation: '\'Each\' takes singular verb. Correct: "Each of the boys HAS submitted."', difficulty: 'easy', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-M01', text: 'Choose correct indirect speech: He said, \'I am going to Delhi tomorrow.\'', options: ['He said that he was going to Delhi the next day', 'He said that he is going to Delhi tomorrow', 'He said that he had gone to Delhi the next day', 'He told that he was going to Delhi tomorrow'], correctAnswer: 'A', explanation: 'Indirect speech: am→was, tomorrow→the next day. "He said that he was going..."', difficulty: 'medium', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-M02', text: 'Passive voice: \'People speak English all over the world.\'', options: ['English has been spoken all over the world', 'English is spoken all over the world by people', 'English is spoken all over the world', 'English was spoken all over the world'], correctAnswer: 'C', explanation: 'Active Simple Present → Passive: is/are + V3. "by people" is redundant.', difficulty: 'medium', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-H01', text: 'Spot error: \'Neither the teacher nor the students was present.\'', options: ['Neither the teacher', 'nor the students', 'was present', 'No error'], correctAnswer: 'C', explanation: 'With neither...nor, verb agrees with nearer subject (students→plural). Should be "WERE present."', difficulty: 'hard', tags: ['Grammar', 'NDA'] },
        { id: 'NDA-ENG1-H02', text: 'He is too weak __ walk. Correct infinitive:', options: ['for to walk', 'to walking', 'to walk', 'for walking'], correctAnswer: 'C', explanation: 'Too...to structure: "too + adjective + to + base verb."', difficulty: 'hard', tags: ['Grammar', 'NDA'] },
    ],

    'nda-gat-eng-2': [
        { id: 'NDA-ENG2-E01', text: 'The synonym of \'Benevolent\' is:', options: ['Cruel', 'Kind', 'Strict', 'Indifferent'], correctAnswer: 'B', explanation: 'Benevolent = well-meaning, generous, kind.', difficulty: 'easy', tags: ['Vocabulary', 'NDA'] },
        { id: 'NDA-ENG2-E02', text: 'The antonym of \'Verbose\' is:', options: ['Talkative', 'Concise', 'Elaborate', 'Wordy'], correctAnswer: 'B', explanation: 'Verbose = using too many words. Antonym = Concise (brief).', difficulty: 'easy', tags: ['Vocabulary', 'NDA'] },
        { id: 'NDA-ENG2-E03', text: '\'Philatelist\' means:', options: ['Coin collector', 'Stamp collector', 'Book lover', 'Art lover'], correctAnswer: 'B', explanation: 'A Philatelist collects and studies postage stamps.', difficulty: 'easy', tags: ['Vocabulary', 'NDA'] },
        { id: 'NDA-ENG2-M01', text: 'Identify the figure of speech: \'The camel is the ship of the desert.\'', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correctAnswer: 'B', explanation: 'Metaphor directly calls something else (without like/as). Camel IS CALLED ship.', difficulty: 'medium', tags: ['Vocabulary', 'NDA'] },
        { id: 'NDA-ENG2-M02', text: 'The idiom \'To burn the midnight oil\' means:', options: ['To waste resources', 'To work/study late at night', 'Financial trouble', 'Celebrate excessively'], correctAnswer: 'B', explanation: 'To burn the midnight oil = to study or work late at night.', difficulty: 'medium', tags: ['Idioms', 'NDA'] },
        { id: 'NDA-ENG2-H01', text: 'The word \'Sanguine\' means:', options: ['Pessimistic', 'Optimistic/blood-red', 'Angry', 'Tired'], correctAnswer: 'B', explanation: 'Sanguine = optimistic/positive (or blood-red from Latin sanguis).', difficulty: 'hard', tags: ['Vocabulary', 'NDA'] },
    ],

    'nda-gat-eng-3': [
        { id: 'NDA-ENG3-E01', text: 'Rearrange: \'yesterday / I / completed / assignment / the\' correctly:', options: ['Yesterday I the assignment completed', 'I completed the assignment yesterday', 'The assignment I completed yesterday', 'Completed I the assignment yesterday'], correctAnswer: 'B', explanation: 'Standard: Subject + Verb + Object + Time.', difficulty: 'easy', tags: ['Comprehension', 'NDA'] },
        { id: 'NDA-ENG3-M01', text: 'Choose the sentence with correct punctuation:', options: ['Its a beautiful day isnt it', 'It\'s a beautiful day, isn\'t it?', 'Its a beautiful day, isnt it.', 'It\'s a beautiful day isn\'t it'], correctAnswer: 'B', explanation: 'Contraction needs apostrophe (it\'s, isn\'t), question needs ?, tag needs comma.', difficulty: 'medium', tags: ['Comprehension', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  GAT — PHYSICS (phy-1..3)
// ═══════════════════════════════════════════════════

const NDA_PHYSICS_QUESTIONS = {
    'nda-gat-phy-1': [
        { id: 'NDA-PHY1-E01', text: 'A body thrown up with 20 m/s. Max height (g=10):', options: ['10 m', '20 m', '40 m', '200 m'], correctAnswer: 'B', explanation: 'h=u²/2g = 400/20 = 20 m.', difficulty: 'easy', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-E02', text: 'A projectile has max range at angle:', options: ['30°', '45°', '60°', '90°'], correctAnswer: 'B', explanation: 'R=u²sin2θ/g. Max when sin2θ=1 → θ=45°.', difficulty: 'easy', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-E03', text: 'Newton\'s second law states:', options: ['Action = Reaction', 'F = ma', 'Inertia principle', 'Momentum conservation'], correctAnswer: 'B', explanation: 'Newton\'s 2nd Law: F=ma.', difficulty: 'easy', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-E04', text: 'KE of 2 kg body at 3 m/s:', options: ['6 J', '9 J', '18 J', '3 J'], correctAnswer: 'B', explanation: 'KE = ½mv² = ½×2×9 = 9 J.', difficulty: 'easy', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-E05', text: 'SI unit of power is:', options: ['Joule', 'Newton', 'Watt', 'Erg'], correctAnswer: 'C', explanation: 'Power = Work/Time. SI unit: Watt = Joule/second.', difficulty: 'easy', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-M01', text: '10 kg body slides down frictionless 30° incline. Acceleration (g=10):', options: ['5 m/s²', '8.66 m/s²', '10 m/s²', '2.5 m/s²'], correctAnswer: 'A', explanation: 'a = gsinθ = 10×sin30° = 5 m/s².', difficulty: 'medium', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-M02', text: 'Body moves in circle radius 2m at 4 m/s. Centripetal acceleration:', options: ['2 m/s²', '8 m/s²', '16 m/s²', '4 m/s²'], correctAnswer: 'B', explanation: 'a = v²/r = 16/2 = 8 m/s².', difficulty: 'medium', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-H01', text: 'Projectile at 60° with u=20 m/s. Horizontal range (g=10):', options: ['20√3 m', '40 m', '20 m', '40√3 m'], correctAnswer: 'A', explanation: 'R=u²sin2θ/g = 400×sin120°/10 = 40×√3/2 = 20√3 m.', difficulty: 'hard', tags: ['Mechanics', 'NDA'] },
        { id: 'NDA-PHY1-H02', text: 'Ball 0.5 kg hits wall at 5 m/s, bounces back at 3 m/s. Impulse:', options: ['1 N·s', '4 N·s', '8 N·s', '2.5 N·s'], correctAnswer: 'B', explanation: 'Impulse = m(v₂-v₁) = 0.5(3-(-5)) = 0.5×8 = 4 N·s.', difficulty: 'hard', tags: ['Mechanics', 'NDA'] },
    ],

    'nda-gat-phy-2': [
        { id: 'NDA-PHY2-E01', text: 'Speed of sound in air is approximately:', options: ['300 m/s', '332 m/s', '3×10⁸ m/s', '1500 m/s'], correctAnswer: 'B', explanation: 'Sound in air ≈ 332 m/s. Light = 3×10⁸ m/s. Sound in water ≈ 1500 m/s.', difficulty: 'easy', tags: ['Sound', 'NDA'] },
        { id: 'NDA-PHY2-E02', text: 'Convex lens forms virtual image when object is:', options: ['At infinity', 'Beyond 2F', 'Between F and optical centre', 'At F'], correctAnswer: 'C', explanation: 'Virtual erect magnified image forms when object is between F and centre (magnifying glass).', difficulty: 'easy', tags: ['Optics', 'NDA'] },
        { id: 'NDA-PHY2-E03', text: 'Snell\'s law:', options: ['n₁sinθ₁ = n₂sinθ₂', 'n₁cosθ₁ = n₂cosθ₂', 'Only for specific colors', 'Reflected=incident angle'], correctAnswer: 'A', explanation: 'Snell\'s law of refraction: n₁sinθ₁ = n₂sinθ₂.', difficulty: 'easy', tags: ['Optics', 'NDA'] },
        { id: 'NDA-PHY2-M01', text: 'Train at 60 m/s whistles 500 Hz. Frequency heard when approaching (v=340):', options: ['595 Hz', '425 Hz', '607 Hz', '500 Hz'], correctAnswer: 'C', explanation: 'f\'=f×v/(v-vs) = 500×340/280 ≈ 607 Hz.', difficulty: 'medium', tags: ['Sound', 'NDA'] },
        { id: 'NDA-PHY2-M02', text: 'Critical angle for glass-air (n=1.5) is:', options: ['35°', '42°', '48°', '60°'], correctAnswer: 'B', explanation: 'sinC=1/n=1/1.5=2/3. C≈42°.', difficulty: 'medium', tags: ['Optics', 'NDA'] },
        { id: 'NDA-PHY2-H01', text: 'Lens f=20cm, image at 60cm. Object distance:', options: ['30 cm', '40 cm', '15 cm', '12 cm'], correctAnswer: 'A', explanation: '1/v-1/u=1/f → 1/u = 1/60-1/20 = -1/30. u=-30 cm.', difficulty: 'hard', tags: ['Optics', 'NDA'] },
    ],

    'nda-gat-phy-3': [
        { id: 'NDA-PHY3-E01', text: 'Unit of electric resistance is:', options: ['Ampere', 'Volt', 'Ohm', 'Watt'], correctAnswer: 'C', explanation: 'Resistance measured in Ohms (Ω). Ohm\'s law: V=IR.', difficulty: 'easy', tags: ['Electricity', 'NDA'] },
        { id: 'NDA-PHY3-E02', text: '3 resistors of 2Ω in series. Total resistance:', options: ['2/3 Ω', '6 Ω', '2 Ω', '3 Ω'], correctAnswer: 'B', explanation: 'Series: R_total = 2+2+2 = 6 Ω.', difficulty: 'easy', tags: ['Electricity', 'NDA'] },
        { id: 'NDA-PHY3-M01', text: 'Two bulbs 60W and 100W in series to 220V. Which glows brighter?', options: ['100W bulb', '60W bulb', 'Both equally', 'Neither'], correctAnswer: 'B', explanation: 'R=V²/P. R₆₀ > R₁₀₀. Same current in series. P=I²R → higher R = brighter. 60W glows brighter.', difficulty: 'medium', tags: ['Electricity', 'NDA'] },
        { id: 'NDA-PHY3-M02', text: 'Two wires, same material/length, areas A and 2A. Ratio R₁:R₂:', options: ['1:2', '2:1', '1:4', '4:1'], correctAnswer: 'B', explanation: 'R=ρL/A. R₁/R₂=A₂/A₁=2A/A=2. R₁:R₂=2:1.', difficulty: 'medium', tags: ['Electricity', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  GAT — HISTORY, POLITY, GEOGRAPHY (his, geo, cur)
// ═══════════════════════════════════════════════════

const NDA_HUMANITIES_QUESTIONS = {
    'nda-gat-his-1': [
        { id: 'NDA-HIS1-E01', text: 'Chandragupta II was also known as:', options: ['Samudragupta', 'Vikramaditya', 'Ashoka', 'Bindusara'], correctAnswer: 'B', explanation: 'Chandragupta II (375-415 CE) was known as Vikramaditya. Gupta Golden Age.', difficulty: 'easy', tags: ['History', 'NDA'] },
        { id: 'NDA-HIS1-E02', text: 'Ashoka fought the Kalinga War in:', options: ['272 BCE', '261 BCE', '268 BCE', '250 BCE'], correctAnswer: 'B', explanation: 'Kalinga War in 261 BCE led Ashoka to embrace Buddhism.', difficulty: 'easy', tags: ['History', 'NDA'] },
        { id: 'NDA-HIS1-E03', text: 'Harappa civilization is associated with river:', options: ['Ganga', 'Indus/Ravi', 'Yamuna', 'Godavari'], correctAnswer: 'B', explanation: 'Harappa was on river Ravi (tributary of Indus).', difficulty: 'easy', tags: ['History', 'NDA'] },
        { id: 'NDA-HIS1-M01', text: 'Ashtapradhan was council of ministers under:', options: ['Akbar', 'Shivaji', 'Aurangzeb', 'Peshwa Bajirao'], correctAnswer: 'B', explanation: 'Ashtapradhan (8 ministers) was established by Chhatrapati Shivaji.', difficulty: 'medium', tags: ['History', 'NDA'] },
        { id: 'NDA-HIS1-M02', text: 'Din-i-Ilahi was promoted by:', options: ['Babur', 'Humayun', 'Akbar', 'Jahangir'], correctAnswer: 'C', explanation: 'Akbar introduced Din-i-Ilahi (1582), merging elements of multiple religions.', difficulty: 'medium', tags: ['History', 'NDA'] },
        { id: 'NDA-HIS1-M03', text: 'Battle that ended Vijayanagara\'s power:', options: ['Panipat 1526', 'Talikota 1565', 'Buxar 1764', 'Plassey 1757'], correctAnswer: 'B', explanation: 'Battle of Talikota (1565) destroyed Vijayanagara. Capital Hampi was sacked.', difficulty: 'medium', tags: ['History', 'NDA'] },
    ],

    'nda-gat-his-2': [
        { id: 'NDA-HIS2-E01', text: 'Dandi March was associated with:', options: ['Non-Cooperation Movement', 'Civil Disobedience Movement', 'Quit India Movement', 'Swadeshi Movement'], correctAnswer: 'B', explanation: 'Gandhi\'s Dandi March (1930) began the Civil Disobedience Movement against Salt Tax.', difficulty: 'easy', tags: ['Freedom Movement', 'NDA'] },
        { id: 'NDA-HIS2-E02', text: 'Battle of Plassey (1757) was between:', options: ['British and Mughals', 'British and Nawab of Bengal', 'British and Marathas', 'Mughals and Marathas'], correctAnswer: 'B', explanation: 'Robert Clive vs Siraj-ud-Daula (Nawab of Bengal), with Mir Jafar\'s betrayal.', difficulty: 'easy', tags: ['Freedom Movement', 'NDA'] },
        { id: 'NDA-HIS2-E03', text: 'Doctrine of Lapse was introduced by:', options: ['Lord Wellesley', 'Lord Cornwallis', 'Lord Dalhousie', 'Lord Curzon'], correctAnswer: 'C', explanation: 'Lord Dalhousie: states without natural heir would be annexed.', difficulty: 'easy', tags: ['Freedom Movement', 'NDA'] },
        { id: 'NDA-HIS2-E04', text: 'INC was founded in:', options: ['1857', '1875', '1885', '1906'], correctAnswer: 'C', explanation: 'INC founded 1885 by A.O. Hume. First session in Bombay.', difficulty: 'easy', tags: ['Freedom Movement', 'NDA'] },
        { id: 'NDA-HIS2-E05', text: 'Quit India Movement was launched in:', options: ['1940', '1941', '1942', '1943'], correctAnswer: 'C', explanation: 'Quit India: August 8, 1942. Gandhi\'s slogan "Do or Die."', difficulty: 'easy', tags: ['Freedom Movement', 'NDA'] },
        { id: 'NDA-HIS2-M01', text: '\'Drain of Wealth\' theory was propounded by:', options: ['Tilak', 'Gokhale', 'Dadabhai Naoroji', 'Bipin Chandra Pal'], correctAnswer: 'C', explanation: 'Dadabhai Naoroji (Grand Old Man of India) propounded Drain Theory.', difficulty: 'medium', tags: ['Freedom Movement', 'NDA'] },
        { id: 'NDA-HIS2-H01', text: 'Subsidiary Alliance system was devised by:', options: ['Lord Cornwallis', 'Lord Wellesley', 'Lord Hastings', 'Warren Hastings'], correctAnswer: 'B', explanation: 'Lord Wellesley (1798). First applied to Hyderabad.', difficulty: 'hard', tags: ['Freedom Movement', 'NDA'] },
        { id: 'NDA-HIS2-H02', text: 'Chronological: (i)Dandi March (ii)Non-Cooperation (iii)Quit India (iv)Simon Commission:', options: ['ii, iv, i, iii', 'iv, ii, i, iii', 'ii, i, iv, iii', 'i, ii, iv, iii'], correctAnswer: 'A', explanation: 'Non-Coop(1920), Simon(1927), Dandi(1930), Quit India(1942).', difficulty: 'hard', tags: ['Freedom Movement', 'NDA'] },
    ],

    'nda-gat-his-3': [
        { id: 'NDA-HIS3-E01', text: 'World War II ended in:', options: ['1943', '1944', '1945', '1946'], correctAnswer: 'C', explanation: 'WWII ended in 1945 with Japan\'s surrender after Hiroshima and Nagasaki.', difficulty: 'easy', tags: ['World History', 'NDA'] },
        { id: 'NDA-HIS3-M01', text: 'United Nations was established in:', options: ['1944', '1945', '1946', '1948'], correctAnswer: 'B', explanation: 'UN was established on October 24, 1945. Headquartered in New York.', difficulty: 'medium', tags: ['World History', 'NDA'] },
    ],

    'nda-gat-geo-1': [
        { id: 'NDA-GEO1-E01', text: 'Tropic of Cancer is at:', options: ['0°', '23.5°N', '23.5°S', '66.5°N'], correctAnswer: 'B', explanation: 'Tropic of Cancer = 23.5°N latitude.', difficulty: 'easy', tags: ['Geography', 'NDA'] },
        { id: 'NDA-GEO1-E02', text: 'International Date Line roughly follows:', options: ['Prime Meridian', '90°E', '180° longitude', 'Equator'], correctAnswer: 'C', explanation: 'IDL roughly follows 180° longitude in Pacific Ocean.', difficulty: 'easy', tags: ['Geography', 'NDA'] },
        { id: 'NDA-GEO1-M01', text: 'Total time zones on Earth:', options: ['12', '24', '36', '48'], correctAnswer: 'B', explanation: '360°/15° = 24 time zones.', difficulty: 'medium', tags: ['Geography', 'NDA'] },
    ],

    'nda-gat-geo-3': [
        { id: 'NDA-GEO3-E01', text: 'The longest river of India is:', options: ['Yamuna', 'Ganga', 'Brahmaputra', 'Godavari'], correctAnswer: 'B', explanation: 'Ganga is the longest river in India (2525 km).', difficulty: 'easy', tags: ['Geography', 'NDA'] },
        { id: 'NDA-GEO3-M01', text: 'Western Ghats are also known as:', options: ['Sahyadri', 'Vindhyas', 'Aravalli', 'Satpura'], correctAnswer: 'A', explanation: 'Western Ghats = Sahyadri mountain range.', difficulty: 'medium', tags: ['Geography', 'NDA'] },
    ],

    // Polity questions mapped to Constitution topics
    'nda-gat-cur-1': [
        { id: 'NDA-CUR1-E01', text: 'Constitution of India came into effect on:', options: ['Aug 15, 1947', 'Nov 26, 1949', 'Jan 26, 1950', 'Jan 26, 1949'], correctAnswer: 'C', explanation: 'Adopted Nov 26, 1949. Came into effect Jan 26, 1950 (Republic Day).', difficulty: 'easy', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-E02', text: 'Fundamental Rights are in which Part?', options: ['Part II', 'Part III', 'Part IV', 'Part V'], correctAnswer: 'B', explanation: 'Fundamental Rights = Part III (Articles 12-35).', difficulty: 'easy', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-E03', text: 'Chairman of Rajya Sabha is:', options: ['President', 'PM', 'Speaker', 'Vice President'], correctAnswer: 'D', explanation: 'Vice President = ex-officio Chairman of Rajya Sabha.', difficulty: 'easy', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-E04', text: 'Right to Constitutional Remedies is Article:', options: ['19', '21', '32', '44'], correctAnswer: 'C', explanation: 'Article 32 = "Heart and Soul of Constitution" per Ambedkar.', difficulty: 'easy', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-E05', text: 'First National Emergency was in:', options: ['1947', '1962', '1971', '1975'], correctAnswer: 'B', explanation: 'First: 1962 (Indo-China War). Second: 1971. Third: 1975.', difficulty: 'easy', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-E06', text: 'Preamble describes India as:', options: ['Sovereign Democratic Republic', 'Sovereign Socialist Secular Democratic Republic', 'Federal Socialist Republic', 'Sovereign Secular Federal Republic'], correctAnswer: 'B', explanation: '"Socialist" and "Secular" added by 42nd Amendment 1976.', difficulty: 'easy', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-M01', text: 'Writ for release from illegal detention:', options: ['Mandamus', 'Certiorari', 'Habeas Corpus', 'Prohibition'], correctAnswer: 'C', explanation: 'Habeas Corpus = "to have the body" — examine legality of detention.', difficulty: 'medium', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-M02', text: '\'Basic Structure\' doctrine was established in:', options: ['Golaknath 1967', 'Kesavananda Bharati 1973', 'Minerva Mills 1980', 'Maneka Gandhi 1978'], correctAnswer: 'B', explanation: 'Kesavananda Bharati (1973): Parliament can amend but not destroy Basic Structure.', difficulty: 'medium', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-M03', text: 'President of India is elected by:', options: ['Direct election', 'Elected MPs only', 'Elected MPs + State MLAs', 'Parliament alone'], correctAnswer: 'C', explanation: 'Electoral College: elected MPs + elected MLAs of states + UTs with legislatures.', difficulty: 'medium', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-H01', text: 'Fundamental Duties added by which Amendment?', options: ['42nd', '44th', '86th', '73rd'], correctAnswer: 'A', explanation: '42nd Amendment 1976 added Part IV-A with 10 Fundamental Duties. 86th added 11th.', difficulty: 'hard', tags: ['Polity', 'NDA'] },
        { id: 'NDA-CUR1-H02', text: 'Money Bill can be introduced in:', options: ['Either House', 'Rajya Sabha only', 'Lok Sabha only', 'Joint sitting only'], correctAnswer: 'C', explanation: 'Article 110: Money Bill only in Lok Sabha. Speaker certifies.', difficulty: 'hard', tags: ['Polity', 'NDA'] },
    ],
};

// ═══════════════════════════════════════════════════
//  PYQ VAULT — Actual Previous Year Questions
// ═══════════════════════════════════════════════════

const NDA_PYQ_QUESTIONS = {
    'nda-mat-mat-1': [
        { id: 'NDA-PYQ-M01', text: 'If matrix A is such that A³ = A, then (I+A)³ - 7A equals:', options: ['I', 'A', '-I', '0'], correctAnswer: 'A', explanation: '(I+A)³ = I+3A+3A²+A³. Using A³=A and simplifying: result = I.', difficulty: 'hard', tags: ['PYQ', 'NDA 2022', 'Matrices'], isPYQ: true, year: 2022 },
    ],
    'nda-mat-trig-1': [
        { id: 'NDA-PYQ-M02', text: 'If sinA = 1/2 and A is obtuse, cosA equals:', options: ['√3/2', '-√3/2', '1/2', '-1/2'], correctAnswer: 'B', explanation: 'sinA=1/2 & obtuse → A=150°. cos150° = -cos30° = -√3/2.', difficulty: 'medium', tags: ['PYQ', 'NDA 2023', 'Trigonometry'], isPYQ: true, year: 2023 },
    ],
    'nda-mat-alg-6': [
        { id: 'NDA-PYQ-M03', text: '5-digit numbers divisible by 4 using {1,2,3,4,5} without repetition:', options: ['24', '30', '48', '36'], correctAnswer: 'A', explanation: 'Last 2 digits divisible by 4: 12,24,32,52. Each×3!=6. Total=24.', difficulty: 'hard', tags: ['PYQ', 'NDA 2022', 'Permutations'], isPYQ: true, year: 2022 },
        { id: 'NDA-PYQ-M05', text: 'If ⁿC₁₂ = ⁿC₈, then n equals:', options: ['16', '20', '18', '24'], correctAnswer: 'B', explanation: 'ⁿCₐ=ⁿCᵦ ⟹ a=b or a+b=n. Since 12≠8: n=12+8=20.', difficulty: 'medium', tags: ['PYQ', 'NDA 2023', 'Combinations'], isPYQ: true, year: 2023 },
    ],
    'nda-mat-ical-4': [
        { id: 'NDA-PYQ-M04', text: '∫[π/6 to π/3] dx/(1+√(tanx)) equals:', options: ['π/6', 'π/12', 'π/3', 'π/4'], correctAnswer: 'B', explanation: 'King\'s property: 2I = ∫dx = π/6. I = π/12.', difficulty: 'hard', tags: ['PYQ', 'NDA 2021', 'Integration'], isPYQ: true, year: 2021 },
    ],
    'nda-mat-dcal-4': [
        { id: 'NDA-PYQ-M06', text: 'Normal to y=x²+4x+1 at (1,6):', options: ['x+6y-37=0', '6x-y=0', 'x-6y+35=0', '6x+y-12=0'], correctAnswer: 'A', explanation: 'dy/dx=2x+4. At (1,6): slope tangent=6, normal=-1/6. y-6=-1/6(x-1) → x+6y-37=0.', difficulty: 'hard', tags: ['PYQ', 'NDA 2022', 'Derivatives'], isPYQ: true, year: 2022 },
    ],
};

// ═══════════════════════════════════════════════════
//  MERGE ALL INTO SINGLE EXPORT
// ═══════════════════════════════════════════════════

function mergeQuestionBanks(...banks) {
    const merged = {};
    for (const bank of banks) {
        for (const [topicId, questions] of Object.entries(bank)) {
            if (!merged[topicId]) {
                merged[topicId] = [];
            }
            merged[topicId].push(...questions);
        }
    }
    return merged;
}

export const NDA_QUESTION_BANK = mergeQuestionBanks(
    NDA_ALGEBRA_QUESTIONS,
    NDA_MATRICES_QUESTIONS,
    NDA_TRIG_QUESTIONS,
    NDA_CALCULUS_QUESTIONS,
    NDA_VECTORS_STATS_QUESTIONS,
    NDA_ENGLISH_QUESTIONS,
    NDA_PHYSICS_QUESTIONS,
    NDA_HUMANITIES_QUESTIONS,
    NDA_PYQ_QUESTIONS,
);

// Quick stats
const totalQuestions = Object.values(NDA_QUESTION_BANK).reduce((sum, qs) => sum + qs.length, 0);
const topicsCovered = Object.keys(NDA_QUESTION_BANK).length;
console.log(`[NDA Question Bank] ${totalQuestions} questions across ${topicsCovered} topics loaded.`);
