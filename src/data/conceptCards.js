/**
 * Competitive Hub — Concept Cards (Static, Uniform)
 * Same content shown to every user. Keyed by topic ID.
 */

export const CONCEPT_CARDS = {
    // ═══ JEE PHYSICS ═══
    'jee-phy-unit-1': {
        title: 'SI Units & Measurement',
        coreIdea: 'Every physical quantity is expressed as a number multiplied by a unit. The SI system defines 7 base units from which all others are derived.',
        keyConcepts: [
            'Base units: metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), candela (cd)',
            'Derived units are combinations of base units (e.g., Newton = kg·m/s²)',
            'Significant figures determine measurement precision'
        ],
        formulas: ['[Derived Unit] = f(base units)', 'Least Count = Smallest division on scale', 'Relative Error = ΔX / X'],
        commonMistakes: ['Confusing mass (kg) with weight (N)', 'Ignoring significant figures in calculations', 'Mixing CGS and SI units in the same problem'],
        examPattern: 'JEE asks 1-2 questions on dimensional analysis — often disguised as "which formula is dimensionally correct?"',
    },
    'jee-phy-unit-2': {
        title: 'Dimensional Analysis',
        coreIdea: 'Dimensions represent the physical nature of a quantity. Dimensional analysis helps verify equations, derive relations, and convert units.',
        keyConcepts: [
            'Dimensions: [M], [L], [T], [A], [K], [mol], [cd]',
            'Principle of homogeneity: both sides of an equation must have same dimensions',
            'Can derive relations between quantities when exact formula is unknown'
        ],
        formulas: ['[Force] = [M L T⁻²]', '[Energy] = [M L² T⁻²]', '[Pressure] = [M L⁻¹ T⁻²]'],
        commonMistakes: ['Cannot determine dimensionless constants (like 2π)', 'Cannot distinguish between quantities with same dimensions (Work vs Torque)', 'Cannot derive relations involving more than 3 base dimensions with 3 unknowns'],
        examPattern: 'Expect 1 direct question. Usually: "find dimensions of X" or "check dimensional correctness of formula."',
    },
    'jee-phy-unit-3': {
        title: 'Errors in Measurement',
        coreIdea: 'No measurement is perfect. Understanding errors helps you report results with appropriate precision and estimate reliability.',
        keyConcepts: [
            'Systematic errors: consistent offset (zero error, calibration error)',
            'Random errors: unpredictable fluctuations, reduced by averaging',
            'Propagation of errors in addition, multiplication, and power'
        ],
        formulas: ['ΔZ = ΔA + ΔB (for Z = A ± B)', 'ΔZ/Z = ΔA/A + ΔB/B (for Z = A × B)', 'ΔZ/Z = n·(ΔA/A) (for Z = Aⁿ)'],
        commonMistakes: ['Using absolute error where relative error is needed', 'Forgetting that powers multiply the relative error', 'Not taking maximum possible error in exam calculations'],
        examPattern: 'Typically 1 question on error propagation — "if X is measured with error δ, find error in X³/Y²"',
    },
    'jee-phy-kine-1': {
        title: 'Motion in One Dimension',
        coreIdea: 'Motion in 1D is described by position, velocity, and acceleration along a single axis. The equations of motion connect these quantities under constant acceleration.',
        keyConcepts: [
            'Displacement vs distance — displacement can be negative',
            'Velocity = dx/dt, Acceleration = dv/dt = d²x/dt²',
            'Three equations of motion for constant acceleration',
            'Free fall: a = g = 9.8 m/s² downward'
        ],
        formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'sₙ = u + a(2n-1)/2'],
        commonMistakes: ['Confusing speed (scalar) with velocity (vector)', 'Forgetting sign convention when acceleration opposes motion', 'Using equations of motion when acceleration is NOT constant'],
        examPattern: 'Very fundamental. 1-2 questions guaranteed, often combined with graphs (v-t, x-t, a-t).',
    },
    'jee-phy-kine-2': {
        title: 'Projectile Motion',
        coreIdea: 'A projectile moves in a parabolic path under gravity alone. Horizontal motion is uniform (no acceleration), vertical motion is uniformly accelerated.',
        keyConcepts: [
            'Decompose velocity into horizontal (u·cosθ) and vertical (u·sinθ) components',
            'Time of flight, max height, and range are the three key quantities',
            'Range is maximum at θ = 45°',
            'Complementary angles (θ and 90°−θ) give same range'
        ],
        formulas: ['T = 2u·sinθ / g', 'H = u²·sin²θ / 2g', 'R = u²·sin2θ / g', 'y = x·tanθ − gx²/(2u²cos²θ)'],
        commonMistakes: ['Forgetting that horizontal velocity is CONSTANT throughout', 'Not accounting for height difference in projectile from a cliff', 'Confusing range formula — only valid for same-level projection'],
        examPattern: '1-2 questions. Favourite: projectile from height, or finding angle for given range ratio.',
    },
    'jee-phy-kine-3': {
        title: 'Relative Motion',
        coreIdea: 'Motion is always measured relative to a frame of reference. The velocity of A relative to B is V(A) − V(B).',
        keyConcepts: [
            'Relative velocity: v_AB = v_A − v_B (vector subtraction)',
            'Rain-man problems: find angle of umbrella',
            'River-boat problems: minimum time vs shortest path'
        ],
        formulas: ['v_AB = v_A − v_B', 'Crossing time (shortest path) = d / √(v_b² − v_r²)', 'Crossing time (minimum time) = d / v_b'],
        commonMistakes: ['Forgetting vector nature — must subtract components, not magnitudes', 'Mixing up "velocity of A w.r.t. B" with "velocity of B w.r.t. A"'],
        examPattern: 'Usually 1 question on river-boat or rain-man problem. Sometimes combined with 2D projectile.',
    },
    'jee-phy-laws-1': {
        title: "Newton's Laws of Motion",
        coreIdea: "Newton's three laws form the foundation of classical mechanics. The second law (F = ma) is the workhorse — it connects forces to acceleration.",
        keyConcepts: [
            'First Law: An object stays at rest or in uniform motion unless acted upon by a net force (inertia)',
            'Second Law: F_net = ma — the net force equals mass times acceleration',
            'Third Law: Every action has an equal and opposite reaction (on DIFFERENT bodies)',
            'Free body diagrams (FBD) are essential for solving force problems'
        ],
        formulas: ['F = ma', 'Weight W = mg', 'Normal Force N = mg (on flat surface)', 'Apparent weight in lift: N = m(g ± a)'],
        commonMistakes: ['Drawing action-reaction on same body (they act on DIFFERENT bodies)', 'Forgetting to include all forces in FBD', 'Using F = ma with non-inertial frame without pseudo force'],
        examPattern: 'Foundation for everything. 2-3 questions directly. FBD-based problems are JEE favourites.',
    },
    'jee-phy-laws-2': {
        title: 'Friction',
        coreIdea: 'Friction opposes relative motion between surfaces. Static friction prevents motion; kinetic friction acts during motion. μₛ > μₖ always.',
        keyConcepts: [
            'Static friction: f_s ≤ μ_s·N (adjusts to prevent motion)',
            'Kinetic friction: f_k = μ_k·N (constant during motion)',
            'Angle of repose: θ = tan⁻¹(μ_s)',
            'Friction on inclined planes'
        ],
        formulas: ['f_s(max) = μ_s · N', 'f_k = μ_k · N', 'Angle of repose: tan θ = μ_s', 'On incline: f = μ·mg·cosθ'],
        commonMistakes: ['Assuming friction always equals μN (it ONLY equals μN at the maximum/sliding point)', 'Forgetting friction can act uphill on incline (when block tends to slide down)', 'Not checking if applied force exceeds static friction before using kinetic'],
        examPattern: 'Very high frequency. Block-on-block problems, inclined plane friction, friction with pulleys.',
    },
    'jee-phy-laws-3': {
        title: 'Circular Motion Dynamics',
        coreIdea: 'Uniform circular motion requires a centripetal force directed toward the center. Without it, the object flies off in a straight line (Newton\'s 1st Law).',
        keyConcepts: [
            'Centripetal acceleration: a_c = v²/r = ω²r',
            'Centripetal force is NOT a new force — it\'s provided by tension, gravity, friction, normal force etc.',
            'Banking of roads eliminates need for friction at design speed',
            'Vertical circular motion: minimum speed at top for string/track problems'
        ],
        formulas: ['a_c = v²/r', 'F_c = mv²/r', 'Banking angle: tanθ = v²/(rg)', 'Min speed at top of loop: v = √(rg)'],
        commonMistakes: ['Treating centripetal force as a separate force in FBD', 'Confusing centripetal (real) with centrifugal (pseudo, only in rotating frame)', 'Forgetting gravity at the top of vertical circular motion'],
        examPattern: '1-2 questions. Favourites: car on banked road, ball on string in vertical circle, loop-the-loop.',
    },

    // ═══ JEE CHEMISTRY (abbreviated — key topics) ═══
    'jee-che-atom-1': {
        title: 'Bohr Model & Hydrogen Spectrum',
        coreIdea: 'Bohr postulated quantized orbits for electrons. Energy is absorbed/emitted only during transitions between orbits, producing line spectra.',
        keyConcepts: ['Quantized angular momentum: L = nℏ', 'Energy levels: E_n = −13.6/n² eV for hydrogen', 'Spectral series: Lyman (UV), Balmer (visible), Paschen (IR)'],
        formulas: ['E_n = −13.6Z²/n² eV', 'r_n = 0.529 n²/Z Å', '1/λ = RZ²(1/n₁² − 1/n₂²)', 'v_n = 2.18×10⁶ Z/n m/s'],
        commonMistakes: ['Forgetting the Z² factor for non-hydrogen atoms', 'Mixing up emission (higher→lower) vs absorption (lower→higher)', 'Model fails for multi-electron atoms'],
        examPattern: 'Very high frequency. Calculate wavelength of transition, radius of orbit, or energy difference.',
    },
    'jee-che-atom-2': {
        title: 'Quantum Numbers',
        coreIdea: 'Four quantum numbers uniquely describe every electron: n (shell), l (subshell), m_l (orbital orientation), m_s (spin).',
        keyConcepts: ['n = 1,2,3... (principal)', 'l = 0 to n−1 (azimuthal: s,p,d,f)', 'm_l = −l to +l (magnetic)', 'm_s = ±½ (spin)'],
        formulas: ['Max electrons in shell = 2n²', 'Max electrons in subshell = 2(2l+1)', 'Number of orbitals in subshell = 2l+1'],
        commonMistakes: ['l cannot equal n (maximum is n−1)', 'Confusing m_l values count with electron count (orbitals × 2 = electrons)', 'Forgetting Pauli exclusion: no two electrons can have all 4 quantum numbers identical'],
        examPattern: 'Direct: "which set of quantum numbers is valid?" or "how many electrons have l=2 in element X?"',
    },

    // ═══ JEE MATH (abbreviated — key topics) ═══
    'jee-mat-comp-1': {
        title: 'Algebra of Complex Numbers',
        coreIdea: 'Complex numbers extend real numbers with i = √(−1). Every complex number z = a + bi has a real part and imaginary part.',
        keyConcepts: ['Addition, subtraction: combine real and imaginary separately', 'Multiplication: (a+bi)(c+di) = (ac−bd) + (ad+bc)i', 'Conjugate: z̄ = a − bi', 'Modulus: |z| = √(a²+b²)'],
        formulas: ['z·z̄ = |z|²', '|z₁·z₂| = |z₁|·|z₂|', 'arg(z₁·z₂) = arg(z₁) + arg(z₂)', '1/z = z̄/|z|²'],
        commonMistakes: ['Forgetting i² = −1 during multiplication', 'Not rationalizing when dividing (multiply by conjugate)', 'Confusing |z|² with z²'],
        examPattern: '1-2 questions. Often: "find |z| if..." or "if z satisfies equation, find real/imaginary part."',
    },
    'jee-mat-calc-1': {
        title: 'Limits & Continuity',
        coreIdea: 'A limit describes what a function approaches as x approaches a value. Continuity means the limit equals the function value — no jumps or holes.',
        keyConcepts: ['L\'Hôpital\'s rule for 0/0 and ∞/∞ forms', 'Standard limits: sinx/x → 1, (eˣ−1)/x → 1, (1+1/x)ˣ → e', 'Squeeze theorem for bounded oscillating functions'],
        formulas: ['lim(x→0) sinx/x = 1', 'lim(x→0) (eˣ−1)/x = 1', 'lim(x→∞) (1+1/x)ˣ = e', 'lim(x→0) tanx/x = 1'],
        commonMistakes: ['Applying L\'Hôpital without checking 0/0 or ∞/∞ form first', 'Forgetting to check left-hand and right-hand limits separately', 'Assuming continuous function = differentiable (|x| is continuous but not differentiable at 0)'],
        examPattern: 'High frequency — 1-2 questions. Often requires algebraic manipulation before applying standard limits.',
    },
};

export function getConceptCard(topicId) {
    return CONCEPT_CARDS[topicId] || null;
}
