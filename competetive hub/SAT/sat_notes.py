"""
==============================================================
  SAT NOTES BANK — Complete Chapter-wise Study Notes
  App: [Your EdTech App Name]
  Exam: SAT (Digital Adaptive Format)
  Version: 1.0

  HOW TO USE:
    from sat_notes import SAT_NOTES, get_note, get_all_topics, search_notes

  HOW TO ADD / UPDATE NOTES:
    Find the topic dict in SAT_NOTES, add to its 'content' sections,
    save, and done. No other file changes needed.

  STRUCTURE OF EACH NOTE:
    id           : unique string e.g. "SAT-RW-WIC"
    exam         : "SAT"
    section      : "Reading & Writing" | "Math"
    topic        : topic name (matches question bank topics)
    display_name : human-friendly display name
    description  : one-line summary of the topic
    exam_weight  : % of section this topic covers
    content      : list of content blocks (see schema below)
    key_rules    : list of short bullet rules to memorize
    common_errors: list of common mistakes students make
    quick_tips   : list of exam strategy tips
    formula_sheet: list of formulas (Math topics only)
    examples     : list of worked examples with steps

  CONTENT BLOCK SCHEMA:
    Each block in 'content' is a dict:
      heading  : section heading string
      body     : explanation text (string, use \n for line breaks)
==============================================================
"""

import json
from typing import Optional


SAT_NOTES = {

    # ══════════════════════════════════════════════════════════
    #  READING & WRITING SECTION
    # ══════════════════════════════════════════════════════════

    # ── Words in Context ──────────────────────────────────────
    "SAT-RW-WIC": {
        "id": "SAT-RW-WIC",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Words in Context",
        "display_name": "Words in Context",
        "description": "Choose the word that best fits the meaning and tone of a short passage.",
        "exam_weight": "~10–12% of Reading & Writing",
        "content": [
            {
                "heading": "What this topic tests",
                "body": (
                    "Words in Context questions give you a short passage (25–150 words) "
                    "with a blank. You choose the word (from 4 options) that best fits the "
                    "meaning, tone, and logic of the passage.\n\n"
                    "These are NOT pure vocabulary tests — the correct answer always depends "
                    "on the PASSAGE, not just word definitions. A word that sounds sophisticated "
                    "is wrong if it doesn't fit the context."
                ),
            },
            {
                "heading": "The 4 types of context clues",
                "body": (
                    "1. DEFINITION CLUE — the passage explains the word directly.\n"
                    "   Example: 'The scientist's method was rigorous — every step was carefully "
                    "   verified and documented.' → 'Rigorous' is explained by what follows.\n\n"
                    "2. CONTRAST CLUE — signal words like 'although', 'however', 'despite', "
                    "'but', 'yet', 'while' tell you the blank means the OPPOSITE of something "
                    "mentioned.\n"
                    "   Example: 'Although praised by critics, the film was ________ at the "
                    "box office.' → You need a word meaning 'unsuccessful' (contrast with praised).\n\n"
                    "3. CAUSE & EFFECT CLUE — 'because', 'therefore', 'as a result', 'so' "
                    "tell you the blank is caused by or causes something.\n"
                    "   Example: 'Because the bridge was ________, city officials ordered "
                    "immediate repairs.' → The blank must be a negative word (unsafe, unstable).\n\n"
                    "4. RESTATEMENT / EXAMPLE CLUE — the passage repeats the idea in "
                    "different words, or gives a specific example that reveals the meaning.\n"
                    "   Example: 'Her testimony was ________: she gave dates, times, "
                    "and photographs to back every claim.' → The blank must mean well-supported "
                    "or detailed."
                ),
            },
            {
                "heading": "Connotation — positive vs negative",
                "body": (
                    "Even when two words have similar meanings, one may have a positive "
                    "connotation and the other negative. The tone of the passage tells you which.\n\n"
                    "Example: 'stubborn' vs 'determined' — both mean not giving up, but "
                    "'stubborn' is negative and 'determined' is positive.\n\n"
                    "Always read the passage's overall tone:\n"
                    "• Praising tone → positive word\n"
                    "• Critical tone → negative word\n"
                    "• Neutral/scientific tone → neutral, precise word"
                ),
            },
            {
                "heading": "Step-by-step approach",
                "body": (
                    "Step 1: Read the full passage — don't stop at the blank.\n"
                    "Step 2: Find the context clue type (contrast, cause, definition, example).\n"
                    "Step 3: Before looking at the options, predict your OWN word for the blank.\n"
                    "Step 4: Match your prediction to the closest option.\n"
                    "Step 5: Eliminate options that change the meaning or contradict the clue.\n\n"
                    "CRITICAL: Plug your chosen word back into the passage and read it aloud "
                    "(mentally). If it sounds off, it's wrong."
                ),
            },
            {
                "heading": "High-frequency SAT vocabulary (by category)",
                "body": (
                    "POSITIVE / PRAISE:\n"
                    "seminal (groundbreaking), laudable (praiseworthy), astute (shrewd), "
                    "prolific (highly productive), judicious (having good judgment), "
                    "lucid (clear and easy to understand), cogent (convincing), "
                    "salient (most noticeable), meticulous (extremely careful)\n\n"
                    "NEGATIVE / CRITICISM:\n"
                    "spurious (false, fake), tenuous (weak, flimsy), perfunctory (done carelessly), "
                    "partisan (biased), contentious (controversial), myopic (short-sighted), "
                    "vacuous (empty, lacking ideas), dubious (doubtful), specious (misleading)\n\n"
                    "NEUTRAL / ACADEMIC:\n"
                    "posit (to suggest), assert (to state confidently), substantiate (to prove), "
                    "corroborate (to confirm with evidence), nuanced (subtle, complex), "
                    "elucidate (to explain clearly), enumerate (to list), mitigate (to lessen), "
                    "proliferate (to grow rapidly), delineate (to describe precisely)\n\n"
                    "SCIENCE / RESEARCH:\n"
                    "empirical (based on observation), labile (unstable), robust (strong, reliable), "
                    "inert (not reactive), catalyst (something that causes change), "
                    "attenuate (to weaken), extrapolate (to extend from known data)"
                ),
            },
        ],
        "key_rules": [
            "Always read the FULL passage before choosing an answer.",
            "Look for contrast signals: although, however, despite, but, yet.",
            "Look for cause signals: because, therefore, as a result, consequently.",
            "Predict your own word BEFORE looking at options.",
            "Plug your chosen word back into the passage and re-read.",
            "The right word fits BOTH meaning and tone.",
            "Sophisticated vocabulary is NOT always correct — fit matters most.",
        ],
        "common_errors": [
            "Choosing a word that sounds smart but doesn't fit the passage.",
            "Ignoring contrast clues and picking a word that matches the first part only.",
            "Confusing words with similar sounds (e.g. 'eminent' vs 'imminent').",
            "Not reading the full passage before choosing.",
            "Picking a definition that's correct in isolation but wrong in context.",
        ],
        "quick_tips": [
            "Cover the options and predict your own word first — this prevents being tricked.",
            "If two options seem equally valid, look for contrast or cause signals you missed.",
            "Elimination is powerful here — remove options that are clearly the wrong tone.",
            "These questions have short passages — you can afford to re-read quickly.",
        ],
        "formula_sheet": [],
        "examples": [
            {
                "title": "Contrast clue example",
                "passage": (
                    "'Although the professor's lecture was intended to ________ the complex "
                    "topic for first-year students, many left the hall more confused than before.'"
                ),
                "steps": [
                    "Step 1: 'Although' = contrast signal.",
                    "Step 2: Outcome = students were MORE confused → so the intention was the OPPOSITE of confusing.",
                    "Step 3: Prediction = 'clarify' or 'simplify'.",
                    "Step 4: Match to option: 'illuminate' (make clear) ✓",
                    "Step 5: Eliminate: 'obscure' (make unclear) ✗ — that's the outcome, not the intention.",
                ],
                "answer": "illuminate",
            },
        ],
    },


    # ── Transitions ───────────────────────────────────────────
    "SAT-RW-TR": {
        "id": "SAT-RW-TR",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Transitions",
        "display_name": "Transitions",
        "description": "Choose the transition word or phrase that logically connects two sentences or ideas.",
        "exam_weight": "~8–10% of Reading & Writing",
        "content": [
            {
                "heading": "What this topic tests",
                "body": (
                    "Transition questions give you two sentences (or a blank at the start of "
                    "the second sentence). You choose the transition word that best shows the "
                    "logical relationship between the ideas.\n\n"
                    "The key skill: identify the LOGICAL RELATIONSHIP between sentence 1 and "
                    "sentence 2, then match to the right category of transition."
                ),
            },
            {
                "heading": "The 6 transition categories (with examples)",
                "body": (
                    "1. CONTRAST — sentence 2 opposes or qualifies sentence 1.\n"
                    "   Words: however, nevertheless, nonetheless, even so, yet, "
                    "in contrast, on the other hand, despite this, that said\n\n"
                    "2. CAUSE & EFFECT — sentence 2 results from sentence 1.\n"
                    "   Words: therefore, consequently, as a result, thus, hence, "
                    "for this reason, accordingly\n\n"
                    "3. ADDITION — sentence 2 adds more supporting information.\n"
                    "   Words: furthermore, moreover, in addition, additionally, "
                    "also, besides, what's more\n\n"
                    "4. EXAMPLE / ILLUSTRATION — sentence 2 gives a specific case.\n"
                    "   Words: for example, for instance, specifically, to illustrate, "
                    "in particular, as an illustration\n\n"
                    "5. CONCESSION — sentence 2 acknowledges a problem but maintains "
                    "the main point.\n"
                    "   Words: even so, nonetheless, nevertheless, that said, "
                    "admittedly, granted\n\n"
                    "6. SUMMARY / CONCLUSION — sentence 2 wraps up or restates.\n"
                    "   Words: in summary, in conclusion, ultimately, in short, overall, "
                    "in other words, that is"
                ),
            },
            {
                "heading": "How to identify the relationship",
                "body": (
                    "Ask yourself about sentence 2:\n\n"
                    "• Does it OPPOSE sentence 1? → Contrast\n"
                    "• Does it FOLLOW as a result of sentence 1? → Cause & effect\n"
                    "• Does it ADD more support in the same direction? → Addition\n"
                    "• Is it a SPECIFIC CASE of the general statement in sentence 1? → Example\n"
                    "• Does it acknowledge a difficulty but PUSH THROUGH? → Concession\n"
                    "• Does it WRAP UP or restate? → Summary\n\n"
                    "Trick: Look at the verbs and direction of argument. Same direction = "
                    "addition. Opposite direction = contrast. Specific after general = example."
                ),
            },
            {
                "heading": "Commonly confused pairs",
                "body": (
                    "HOWEVER vs. THEREFORE:\n"
                    "• 'However' = contrast (sentences oppose each other)\n"
                    "• 'Therefore' = result (sentence 2 follows from sentence 1)\n\n"
                    "FURTHERMORE vs. FOR EXAMPLE:\n"
                    "• 'Furthermore' = new supporting point (not a specific case)\n"
                    "• 'For example' = specific instance of an already stated point\n\n"
                    "NONETHELESS vs. AS A RESULT:\n"
                    "• 'Nonetheless' = concession (despite a problem, something is still true)\n"
                    "• 'As a result' = cause-effect (because of X, Y happened)\n\n"
                    "SIMILARLY vs. IN CONTRAST:\n"
                    "• 'Similarly' = sentence 2 mirrors or parallels sentence 1\n"
                    "• 'In contrast' = sentence 2 is the opposite"
                ),
            },
            {
                "heading": "Step-by-step approach",
                "body": (
                    "Step 1: Read BOTH sentences carefully.\n"
                    "Step 2: Ask: does sentence 2 go in the SAME direction or OPPOSITE direction "
                    "as sentence 1?\n"
                    "Step 3: Classify the relationship (contrast / addition / example / result / "
                    "concession / summary).\n"
                    "Step 4: Match the relationship to the correct transition word category.\n"
                    "Step 5: From the remaining options in that category, pick the one with the "
                    "best fit (some contrasts are softer, some are harder).\n\n"
                    "SHORTCUT: Eliminate options from wrong categories first. If you know it's "
                    "a contrast, immediately rule out all cause-effect and addition options."
                ),
            },
        ],
        "key_rules": [
            "Identify the RELATIONSHIP between sentences before looking at options.",
            "'However' and similar words signal CONTRAST — opposite ideas.",
            "'Therefore', 'As a result', 'Thus' signal CAUSE AND EFFECT.",
            "'Furthermore', 'In addition', 'Moreover' signal ADDITION — same direction.",
            "'For example', 'For instance' signal an EXAMPLE of the previous claim.",
            "'Even so', 'Nonetheless' signal CONCESSION — despite X, Y is still true.",
            "Eliminate entire wrong categories before choosing from remaining options.",
        ],
        "common_errors": [
            "Confusing 'however' (contrast) with 'therefore' (cause-effect).",
            "Picking 'furthermore' when sentence 2 is a specific example, not a new point.",
            "Choosing 'similarly' when the sentences actually contradict each other.",
            "Not reading both sentences before choosing — reading only the second sentence.",
            "Picking a word that sounds formal without checking the logical relationship.",
        ],
        "quick_tips": [
            "Reduce the sentences to their core idea (one word each) — same or opposite?",
            "The most common trap is mixing up contrast and concession — both use 'however'.",
            "If a transition seems to make both statements true simultaneously, it's probably concession.",
            "'For example' is only correct when sentence 1 makes a GENERAL claim.",
        ],
        "formula_sheet": [],
        "examples": [
            {
                "title": "Concession vs. contrast",
                "passage": (
                    "Sentence 1: Renewable energy sources like solar and wind are intermittent by nature.\n"
                    "Sentence 2: ________, advances in battery storage have made it increasingly feasible "
                    "to use them as primary sources."
                ),
                "steps": [
                    "Step 1: Sentence 1 = a PROBLEM (intermittent).",
                    "Step 2: Sentence 2 = a SOLUTION that exists DESPITE the problem.",
                    "Step 3: This is CONCESSION — 'despite the problem, X is still possible.'",
                    "Step 4: 'Even so' or 'Nonetheless' fit best.",
                    "Step 5: NOT 'Therefore' (sentence 2 is not caused by sentence 1's problem).",
                ],
                "answer": "Even so / Nonetheless",
            },
        ],
    },


    # ── Boundaries ────────────────────────────────────────────
    "SAT-RW-BND": {
        "id": "SAT-RW-BND",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Boundaries",
        "display_name": "Sentence Boundaries",
        "description": "Fix run-ons, comma splices, and fragments by using correct punctuation or conjunctions.",
        "exam_weight": "~12–14% of Reading & Writing",
        "content": [
            {
                "heading": "The 3 sentence boundary errors",
                "body": (
                    "1. RUN-ON — two independent clauses joined with NO punctuation.\n"
                    "   Wrong: 'The train was delayed passengers waited on the platform.'\n"
                    "   Fixed: 'The train was delayed; passengers waited on the platform.'\n\n"
                    "2. COMMA SPLICE — two independent clauses joined with ONLY a comma.\n"
                    "   Wrong: 'The train was delayed, passengers waited on the platform.'\n"
                    "   Fixed: Use a semicolon, a period, or a comma + coordinating conjunction.\n\n"
                    "3. FRAGMENT — a group of words that cannot stand alone as a sentence "
                    "(missing subject, verb, or complete thought).\n"
                    "   Wrong: 'Although the train was delayed.'\n"
                    "   Fixed: 'Although the train was delayed, passengers stayed calm.'"
                ),
            },
            {
                "heading": "5 ways to correctly join two independent clauses",
                "body": (
                    "METHOD 1 — SEMICOLON (;)\n"
                    "   Use when the two clauses are closely related and equally important.\n"
                    "   Example: 'The experiment failed; the team regrouped immediately.'\n\n"
                    "METHOD 2 — COMMA + COORDINATING CONJUNCTION (FANBOYS)\n"
                    "   F=For, A=And, N=Nor, B=But, O=Or, Y=Yet, S=So\n"
                    "   Example: 'The experiment failed, but the team regrouped.'\n\n"
                    "METHOD 3 — PERIOD (make two sentences)\n"
                    "   Example: 'The experiment failed. The team regrouped immediately.'\n\n"
                    "METHOD 4 — COLON (:) — only when clause 2 explains/lists clause 1.\n"
                    "   Example: 'The team had one goal: to finish by Friday.'\n\n"
                    "METHOD 5 — SUBORDINATING CONJUNCTION (makes one clause dependent)\n"
                    "   Because, although, since, while, when, if, after, before, unless\n"
                    "   Example: 'Although the experiment failed, the team regrouped.'"
                ),
            },
            {
                "heading": "Punctuation rules — Colon vs Semicolon vs Dash",
                "body": (
                    "SEMICOLON (;):\n"
                    "• Joins two COMPLETE independent clauses.\n"
                    "• Can replace a period.\n"
                    "• Never use semicolon before a list unless the first clause is complete.\n"
                    "• Wrong: 'She brought: apples, oranges, and grapes.' (colon after verb — broken)\n\n"
                    "COLON (:):\n"
                    "• Must follow a COMPLETE independent clause.\n"
                    "• Introduces a list, explanation, or elaboration.\n"
                    "• The part before the colon must be able to stand alone.\n"
                    "• Wrong: 'She likes: swimming, running, and cycling.'\n"
                    "  (can't put colon after 'likes' — it interrupts the verb)\n"
                    "• Right: 'She has three hobbies: swimming, running, and cycling.'\n\n"
                    "DASH (—):\n"
                    "• Used for emphasis, interruption, or setting off extra information.\n"
                    "• Can replace a colon informally.\n"
                    "• If used in pairs, both dashes must surround the non-essential info.\n"
                    "• Example: 'The solution — though counterintuitive — worked perfectly.'"
                ),
            },
            {
                "heading": "Subordinating conjunctions — making dependent clauses",
                "body": (
                    "A subordinating conjunction turns an independent clause into a DEPENDENT "
                    "clause that cannot stand alone.\n\n"
                    "Common subordinating conjunctions:\n"
                    "• Time: when, while, after, before, since, until, as soon as\n"
                    "• Cause: because, since, as\n"
                    "• Condition: if, unless, provided that\n"
                    "• Contrast: although, even though, whereas, while\n\n"
                    "PLACEMENT RULE:\n"
                    "• If dependent clause comes FIRST → use a comma: "
                    "'Although it rained, we went hiking.'\n"
                    "• If dependent clause comes SECOND → no comma needed: "
                    "'We went hiking although it rained.'"
                ),
            },
            {
                "heading": "Commas — the 5 main uses",
                "body": (
                    "1. SERIES — separating items in a list: 'apples, oranges, and grapes'\n\n"
                    "2. COMPOUND SENTENCE — before FANBOYS joining two clauses: "
                    "'I studied, and she practiced.'\n\n"
                    "3. INTRODUCTORY ELEMENT — after an intro phrase/clause: "
                    "'After the exam, they celebrated.'\n\n"
                    "4. NON-ESSENTIAL (PARENTHETICAL) INFO — surrounding extra info that "
                    "could be removed: 'The report, which was 40 pages long, was well received.'\n\n"
                    "5. COORDINATE ADJECTIVES — between adjectives that independently "
                    "modify the noun: 'a long, difficult exam' (but NOT 'a small red car' — "
                    "color and size don't independently modify)"
                ),
            },
        ],
        "key_rules": [
            "A comma alone CANNOT join two independent clauses — that's a comma splice.",
            "A semicolon joins two COMPLETE independent clauses — both must stand alone.",
            "A colon must follow a COMPLETE independent clause — never interrupts a verb.",
            "FANBOYS (for, and, nor, but, or, yet, so) need a comma before them when joining clauses.",
            "A subordinating conjunction at the start of a sentence = dependent clause = needs a comma.",
            "No comma needed when the dependent clause comes after the independent clause.",
            "Dashes used in pairs must surround non-essential (removable) information.",
        ],
        "common_errors": [
            "Comma splice: using only a comma between two independent clauses.",
            "Colon after a verb or incomplete clause ('She enjoys: swimming...').",
            "Semicolon before a dependent clause (only joins independent clauses).",
            "Forgetting the comma after an introductory phrase.",
            "Using 'however' with only a comma — needs semicolon before and comma after.",
        ],
        "quick_tips": [
            "Test a semicolon: cover it and read both sides — can BOTH stand alone? ✓",
            "Test a colon: can the part before it be a complete sentence on its own? ✓",
            "If you see 'however' between two clauses: semicolon before, comma after.",
            "A sentence is a fragment if it starts with 'because', 'although', 'when', etc. and has no main clause.",
        ],
        "formula_sheet": [
            "Independent clause ; independent clause ✓",
            "Independent clause , FANBOYS independent clause ✓",
            "Independent clause : list/explanation ✓",
            "Dependent clause , independent clause ✓",
            "Independent clause dependent clause ✓ (no comma needed)",
            "Sentence fragment: missing subject or verb — ALWAYS wrong on SAT",
        ],
        "examples": [
            {
                "title": "Fixing a comma splice",
                "passage": "The scientists made a breakthrough, they published their findings immediately.",
                "steps": [
                    "Identify: two independent clauses joined only by a comma → comma splice.",
                    "Fix Option 1: 'The scientists made a breakthrough; they published immediately.'",
                    "Fix Option 2: 'The scientists made a breakthrough, so they published immediately.'",
                    "Fix Option 3: 'The scientists made a breakthrough. They published immediately.'",
                ],
                "answer": "All three are valid — choose based on style and answer choices.",
            },
        ],
    },


    # ── Form, Structure & Sense ───────────────────────────────
    "SAT-RW-FSS": {
        "id": "SAT-RW-FSS",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Form, Structure & Sense",
        "display_name": "Form, Structure & Sense",
        "description": "Choose correct verb tense, pronoun, modifier placement, and parallel structure.",
        "exam_weight": "~12–14% of Reading & Writing",
        "content": [
            {
                "heading": "Subject-Verb Agreement",
                "body": (
                    "The verb must agree in NUMBER with its subject (singular or plural).\n\n"
                    "BASIC RULE:\n"
                    "• Singular subject → singular verb (adds -s): 'The dog runs.'\n"
                    "• Plural subject → plural verb: 'The dogs run.'\n\n"
                    "TRICKY CASES:\n\n"
                    "1. NEITHER...NOR / EITHER...OR — verb agrees with the CLOSER subject.\n"
                    "   'Neither the manager nor the employees HAVE approved.' (employees = plural)\n"
                    "   'Neither the employees nor the manager HAS approved.' (manager = singular)\n\n"
                    "2. COLLECTIVE NOUNS — singular (team, committee, government, class).\n"
                    "   'The committee HAS made its decision.' ✓\n\n"
                    "3. INDEFINITE PRONOUNS — mostly singular.\n"
                    "   Singular: each, every, everyone, everyone, anyone, nobody, someone, "
                    "either, neither\n"
                    "   Plural: both, few, many, several\n"
                    "   Either: some, any, none, all (depends on what follows)\n\n"
                    "4. INTERVENING PHRASES — ignore words between subject and verb.\n"
                    "   'The quality of the products IS (not are) exceptional.'\n"
                    "   Ignore 'of the products' — subject is 'quality' (singular)."
                ),
            },
            {
                "heading": "Verb Tense",
                "body": (
                    "USE THE RIGHT TENSE based on the time described and the other verbs nearby.\n\n"
                    "SIMPLE PAST — completed action in the past: 'She submitted the report.'\n\n"
                    "SIMPLE PRESENT — general truths, habits, ongoing states: "
                    "'Water boils at 100°C.'\n\n"
                    "PAST PERFECT (had + past participle) — an action completed BEFORE another "
                    "past action:\n"
                    "   'By the time he arrived, she HAD ALREADY LEFT.'\n"
                    "   Signal words: by the time, before, after, when (combined with past)\n\n"
                    "PRESENT PERFECT (has/have + past participle) — a past action with "
                    "relevance to now:\n"
                    "   'She HAS WORKED here for ten years.' (and still does)\n\n"
                    "FUTURE (will / going to) — action that hasn't happened yet.\n\n"
                    "CONSISTENCY RULE: Don't shift tense within a sentence without reason.\n"
                    "   Wrong: 'She walked in and SITS down.'\n"
                    "   Right: 'She walked in and SAT down.'"
                ),
            },
            {
                "heading": "Pronoun Agreement & Reference",
                "body": (
                    "A pronoun must agree with its ANTECEDENT (the noun it refers to) in "
                    "number and person.\n\n"
                    "RULES:\n"
                    "• Singular antecedent → singular pronoun\n"
                    "• Plural antecedent → plural pronoun\n"
                    "• Collective nouns → singular pronoun (the team... ITS decision)\n\n"
                    "SINGULAR THEY:\n"
                    "The SAT accepts 'they/their' as a gender-neutral singular pronoun. "
                    "Prefer 'their' over 'his or her' when the antecedent is unspecified.\n"
                    "   'Each student must bring THEIR own materials.' ✓\n\n"
                    "PRONOUN CASE:\n"
                    "• Subject position: I, he, she, we, they, who\n"
                    "• Object position: me, him, her, us, them, whom\n"
                    "   'She gave it to HIM and ME.' (object)\n"
                    "   'HE and SHE completed the project.' (subject)\n\n"
                    "AMBIGUOUS REFERENCE — the pronoun must clearly refer to ONE antecedent.\n"
                    "   Wrong: 'Tom told Sam that HE had failed.' (who failed?)\n"
                    "   Fixed: 'Tom told Sam that Sam had failed.'"
                ),
            },
            {
                "heading": "Modifier Placement",
                "body": (
                    "A modifier must be placed next to the word it modifies. Two main errors:\n\n"
                    "1. DANGLING MODIFIER — the implied subject of the modifier doesn't match "
                    "the actual subject of the sentence.\n"
                    "   Wrong: 'Having studied for six hours, the exam seemed easy.'\n"
                    "   (The exam didn't study — WHO studied?)\n"
                    "   Right: 'Having studied for six hours, Maria found the exam easy.'\n\n"
                    "2. MISPLACED MODIFIER — modifier is placed too far from what it modifies.\n"
                    "   Wrong: 'She almost drove her children to school every day.'\n"
                    "   (Did she almost drive, or drive almost every day?)\n"
                    "   Right: 'She drove her children to school almost every day.'\n\n"
                    "RULE: The noun that the opening phrase describes must come IMMEDIATELY "
                    "after the comma."
                ),
            },
            {
                "heading": "Parallel Structure",
                "body": (
                    "When listing items or comparing ideas, all items must be in the SAME "
                    "grammatical form.\n\n"
                    "Wrong: 'She enjoys swimming, to run, and when she cycles.'\n"
                    "Right: 'She enjoys swimming, running, and cycling.'\n\n"
                    "Wrong: 'The report was long, detailed, and had many charts.'\n"
                    "Right: 'The report was long, detailed, and chart-heavy.'\n\n"
                    "PARALLEL STRUCTURE WITH CORRELATIVES:\n"
                    "Both...and / Either...or / Neither...nor / Not only...but also\n"
                    "The structure after each part must match:\n"
                    "   Right: 'She is not only talented BUT ALSO hardworking.'\n"
                    "   Wrong: 'She is not only talented BUT ALSO has hard work.'"
                ),
            },
        ],
        "key_rules": [
            "Verb agrees with its SUBJECT, not the nearest noun.",
            "Ignore prepositional phrases between subject and verb.",
            "NEITHER...NOR: verb agrees with the CLOSER subject.",
            "Past perfect (had + past participle) for actions before another past action.",
            "Opening modifier → the noun it describes MUST come right after the comma.",
            "Pronoun case: subject=I/he/she/we/they; object=me/him/her/us/them.",
            "Parallel structure: all listed items must be the same grammatical form.",
        ],
        "common_errors": [
            "Agreeing verb with nearby noun instead of actual subject.",
            "Using simple past instead of past perfect for earlier past actions.",
            "Dangling modifiers — the sentence subject doesn't match the modifier.",
            "Shifting between 'he/she' and 'they' mid-passage without reason.",
            "Breaking parallel structure in lists ('swimming, to run, and cycling').",
        ],
        "quick_tips": [
            "Cross out prepositional phrases to find the true subject.",
            "With 'by the time' or 'before', the earlier action needs 'had' (past perfect).",
            "For modifiers: ask 'who/what does this phrase describe?' → that noun follows the comma.",
            "For parallel structure: list all items and check they use the same -ing/-ed/to form.",
        ],
        "formula_sheet": [
            "Neither A nor B → verb agrees with B",
            "Either A or B → verb agrees with B",
            "Past perfect: had + [past participle]",
            "Present perfect: has/have + [past participle]",
            "Opening phrase, [noun it describes] + [verb] ...",
        ],
        "examples": [],
    },


    # ── Rhetorical Synthesis ──────────────────────────────────
    "SAT-RW-RS": {
        "id": "SAT-RW-RS",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Rhetorical Synthesis",
        "display_name": "Rhetorical Synthesis",
        "description": "Use bullet-point notes to write a sentence that achieves a specific rhetorical goal.",
        "exam_weight": "~8–10% of Reading & Writing",
        "content": [
            {
                "heading": "What this topic tests",
                "body": (
                    "You are given a set of 3–5 bullet-point notes on a topic. The question "
                    "asks you to choose a sentence that uses the notes to accomplish a specific "
                    "GOAL — e.g., 'support a claim', 'compare two things', 'introduce a topic', "
                    "'emphasize a contrast', or 'provide evidence for an argument.'\n\n"
                    "This is NOT about writing style. The correct answer is the one that DIRECTLY "
                    "uses the notes to achieve the stated goal — not the one that sounds the best."
                ),
            },
            {
                "heading": "The 4 common goal types",
                "body": (
                    "1. SUPPORT A CLAIM — the correct answer presents the note data as evidence.\n"
                    "   Look for: specific numbers, percentages, or findings from the notes.\n\n"
                    "2. INTRODUCE A TOPIC — the correct answer gives general context, not deep detail.\n"
                    "   Look for: broad overview sentence, not one that dives into specifics.\n\n"
                    "3. COMPARE / CONTRAST — the correct answer explicitly draws a comparison.\n"
                    "   Look for: uses words like 'while', 'whereas', 'compared to', "
                    "'in contrast to', 'both...and'.\n\n"
                    "4. EXPLAIN A CAUSE / EFFECT — links a reason to an outcome.\n"
                    "   Look for: words like 'because', 'since', 'as a result', 'leading to'."
                ),
            },
            {
                "heading": "Step-by-step approach",
                "body": (
                    "Step 1: Read the GOAL first (the question itself).\n"
                    "Step 2: Identify which 1–2 notes are most relevant to that goal.\n"
                    "Step 3: Eliminate options that ignore those notes or use the wrong ones.\n"
                    "Step 4: Eliminate options that state something NOT in the notes "
                    "(you can't add outside knowledge).\n"
                    "Step 5: Choose the option that MOST DIRECTLY and ACCURATELY uses the "
                    "relevant notes to achieve the stated goal.\n\n"
                    "KEY: 'Most effectively' = most directly connected to the stated goal, "
                    "using accurate information from the notes."
                ),
            },
            {
                "heading": "Common traps to avoid",
                "body": (
                    "TRAP 1 — Option uses the notes accurately but achieves the WRONG goal.\n"
                    "   (e.g., you need to 'compare', but an option just states a fact)\n\n"
                    "TRAP 2 — Option adds information NOT in the notes.\n"
                    "   (SAT Synthesis answers must be grounded in the given notes only)\n\n"
                    "TRAP 3 — Option is too vague to actually support the specific goal.\n"
                    "   (e.g., 'The study had interesting findings' — doesn't use any specific note)\n\n"
                    "TRAP 4 — Option accurately uses the notes but misrepresents a detail.\n"
                    "   (Always verify numbers and facts against the notes)"
                ),
            },
        ],
        "key_rules": [
            "Read the GOAL in the question before reading the notes or options.",
            "The correct answer must directly serve the stated goal.",
            "All facts/numbers used must come from the given notes — no outside knowledge.",
            "An option can be grammatically perfect and still be wrong if it serves the wrong goal.",
            "When comparing, the answer must explicitly draw the comparison, not just list facts.",
        ],
        "common_errors": [
            "Choosing the best-written sentence instead of the most goal-relevant one.",
            "Picking an option that uses notes accurately but doesn't achieve the stated goal.",
            "Missing that an option adds invented details not in the notes.",
            "Not matching the specific type of goal (compare vs. support vs. introduce).",
        ],
        "quick_tips": [
            "Circle the goal verb in the question: 'support', 'compare', 'introduce', 'explain'.",
            "Pre-identify which 1–2 notes relate to the goal before reading options.",
            "If a question asks to 'compare', immediately discard options without comparison language.",
        ],
        "formula_sheet": [],
        "examples": [],
    },


    # ── Inferences ────────────────────────────────────────────
    "SAT-RW-INF": {
        "id": "SAT-RW-INF",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Inferences",
        "display_name": "Inferences",
        "description": "Draw logical conclusions that are supported by the passage but not explicitly stated.",
        "exam_weight": "~8% of Reading & Writing",
        "content": [
            {
                "heading": "What this topic tests",
                "body": (
                    "Inference questions ask you to conclude something that is SUGGESTED "
                    "by the passage but not stated outright. The correct answer follows "
                    "logically from the evidence — you must not read in too much or too little.\n\n"
                    "The key challenge: avoid EXTREME or UNSUPPORTED inferences. The right "
                    "answer is the one that is MOST DIRECTLY supported by the passage."
                ),
            },
            {
                "heading": "Types of inference questions",
                "body": (
                    "1. 'Which inference is BEST SUPPORTED?' — find the conclusion most "
                    "directly tied to the passage's evidence.\n\n"
                    "2. 'The author would most likely AGREE with...' — look at the "
                    "author's stance, word choice, and what evidence they emphasize.\n\n"
                    "3. 'Based on the passage, what can be concluded about...?' — "
                    "find what logically follows from the specific facts given."
                ),
            },
            {
                "heading": "The inference ladder — what counts as supported",
                "body": (
                    "Think of inferences on a spectrum:\n\n"
                    "TOO LITERAL — just repeats what the passage says (not an inference).\n"
                    "CORRECT INFERENCE — slightly beyond the text but directly supported by evidence.\n"
                    "TOO EXTREME — goes far beyond the evidence, uses absolutes like 'always', "
                    "'never', 'all', 'none', 'completely'.\n\n"
                    "EXAMPLES:\n"
                    "Passage: 'Studies show coffee improves short-term focus in most adults.'\n"
                    "Too literal: 'Coffee was studied.'\n"
                    "Correct: 'Moderate coffee consumption may benefit cognitive performance.'\n"
                    "Too extreme: 'Everyone should drink coffee every day.'"
                ),
            },
            {
                "heading": "Red flag words in wrong answers",
                "body": (
                    "Wrong answers often use extreme or absolute language:\n"
                    "• 'always', 'never', 'all', 'none', 'every', 'no one'\n"
                    "• 'completely', 'entirely', 'solely', 'only'\n"
                    "• 'proves', 'establishes', 'definitively shows'\n\n"
                    "Correct inferences often use hedged language:\n"
                    "• 'may', 'might', 'can', 'likely', 'suggests', 'implies'\n"
                    "• 'some', 'many', 'often', 'in some cases'\n"
                    "• 'tends to', 'is associated with'"
                ),
            },
        ],
        "key_rules": [
            "The inference must be SUPPORTED by the passage — not assumed from outside knowledge.",
            "Avoid extreme words: always, never, all, none, completely.",
            "The best inference is the most DIRECTLY supported by evidence in the text.",
            "Correct answers often use hedged language: 'may', 'likely', 'suggests'.",
            "Do not bring in your personal beliefs or general knowledge.",
        ],
        "common_errors": [
            "Picking an answer that is true in real life but not supported by the passage.",
            "Choosing an extreme answer ('proves that X always...') when the passage is cautious.",
            "Picking a literal restatement of the passage (not an inference at all).",
            "Over-inferring: going too many steps beyond what the passage actually says.",
        ],
        "quick_tips": [
            "Ask: 'Can I point to specific words in the passage that support this?'",
            "If an answer has 'always', 'never', or 'all' — it's almost always wrong.",
            "The correct answer often uses 'may' or 'suggests' — mirrors the passage's caution.",
        ],
        "formula_sheet": [],
        "examples": [],
    },


    # ── Central Ideas & Details ───────────────────────────────
    "SAT-RW-CID": {
        "id": "SAT-RW-CID",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Central Ideas & Details",
        "display_name": "Central Ideas & Details",
        "description": "Identify the main idea of a passage or locate specific stated information.",
        "exam_weight": "~10% of Reading & Writing",
        "content": [
            {
                "heading": "Central idea (main idea) questions",
                "body": (
                    "These ask: 'Which choice best states the main idea of the text?'\n\n"
                    "The main idea is the CENTRAL CLAIM the entire passage is making — not a "
                    "detail, not a supporting example, and not a broader generalization.\n\n"
                    "WRONG ANSWER TYPES:\n"
                    "• Too narrow — only covers one detail, not the whole passage.\n"
                    "• Too broad — goes beyond what the passage discusses.\n"
                    "• Accurate detail — a true statement from the passage, but not the central point.\n"
                    "• Contradicts the passage — sounds plausible but misrepresents the argument.\n\n"
                    "RIGHT ANSWER TYPE: covers the full scope of the passage in one balanced "
                    "statement, neither too narrow nor too broad."
                ),
            },
            {
                "heading": "Detail questions",
                "body": (
                    "These ask about SPECIFIC INFORMATION stated in the passage.\n"
                    "'According to the text, what is...' / 'The author states that...'\n\n"
                    "APPROACH:\n"
                    "1. Note the key terms in the question.\n"
                    "2. Scan the passage for those terms.\n"
                    "3. Read that section carefully.\n"
                    "4. Choose the answer that DIRECTLY matches what the passage says — "
                    "no paraphrasing too loosely, no outside knowledge.\n\n"
                    "TRAP: Answers that are true in real life but use words not in the passage."
                ),
            },
            {
                "heading": "How to find the main idea quickly",
                "body": (
                    "1. Read the first sentence — often states the topic.\n"
                    "2. Read the last sentence — often restates the conclusion.\n"
                    "3. Ask: 'What is the author trying to PROVE or SHOW with this passage?'\n"
                    "4. Check that your main idea explains WHY the details and examples exist.\n\n"
                    "If a detail seems random, it's probably there to support the main idea. "
                    "Ask: 'What does this detail prove?' — the answer to that is likely the main idea."
                ),
            },
        ],
        "key_rules": [
            "Main idea covers the FULL passage — not too narrow, not too broad.",
            "Detail questions have a directly stated answer — no inference needed.",
            "Eliminate answers that contradict the passage or add outside information.",
            "A detail can be true and still not be the main idea.",
        ],
        "common_errors": [
            "Choosing a detail you remember clearly — it might be too narrow for 'main idea'.",
            "Choosing a broad generalization that goes beyond the passage's actual argument.",
            "For detail questions: using outside knowledge instead of the passage text.",
        ],
        "quick_tips": [
            "For main idea: match your answer to ALL paragraphs, not just one.",
            "For detail questions: underline the specific claim in the passage before choosing.",
        ],
        "formula_sheet": [],
        "examples": [],
    },


    # ── Text Structure & Purpose ──────────────────────────────
    "SAT-RW-TSP": {
        "id": "SAT-RW-TSP",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Text Structure & Purpose",
        "display_name": "Text Structure & Purpose",
        "description": "Identify how a text is organized and what role specific parts play.",
        "exam_weight": "~8% of Reading & Writing",
        "content": [
            {
                "heading": "Overall structure questions",
                "body": (
                    "These ask: 'Which describes the overall structure of the text?'\n\n"
                    "Common structures:\n"
                    "• PROBLEM → SOLUTION: describes a challenge, then proposes an answer.\n"
                    "• CLAIM → EVIDENCE: makes a general statement, then supports it with data.\n"
                    "• OLD VIEW → NEW VIEW: describes prevailing belief, then challenges it.\n"
                    "• COMPARISON: presents two or more perspectives or things side-by-side.\n"
                    "• NARRATIVE: tells a story or sequence of events.\n"
                    "• CAUSE → EFFECT: explains why something happened and its result.\n\n"
                    "APPROACH: Trace the passage flow — what happens in each paragraph? "
                    "Then match to the structural description."
                ),
            },
            {
                "heading": "Function of a sentence/paragraph questions",
                "body": (
                    "These ask: 'What is the primary function of the underlined sentence?'\n\n"
                    "Common functions:\n"
                    "• Introduces the main argument\n"
                    "• Provides a counterexample\n"
                    "• Supports a previous claim with evidence\n"
                    "• Acknowledges a limitation\n"
                    "• Transitions to a new idea\n"
                    "• Summarizes or concludes the argument\n\n"
                    "APPROACH: Read the sentence before AND after the target sentence. "
                    "Ask: what is this sentence DOING in relation to what came before?"
                ),
            },
        ],
        "key_rules": [
            "For structure questions: map out each section of the passage before choosing.",
            "For function questions: read the surrounding sentences for context.",
            "A sentence's 'function' is its role in the argument, not just its content.",
            "An accurate description of a sentence's content is not the same as its function.",
        ],
        "common_errors": [
            "Describing WHAT the sentence says instead of WHAT IT DOES in the argument.",
            "Choosing a structure description that only fits part of the passage.",
        ],
        "quick_tips": [
            "Try to describe each paragraph in 3–4 words, then see which option matches the sequence.",
            "For function: replace the sentence with each answer option and see which makes logical sense.",
        ],
        "formula_sheet": [],
        "examples": [],
    },


    # ── Command of Evidence ───────────────────────────────────
    "SAT-RW-COE": {
        "id": "SAT-RW-COE",
        "exam": "SAT",
        "section": "Reading & Writing",
        "topic": "Command of Evidence",
        "display_name": "Command of Evidence",
        "description": "Choose evidence (textual or quantitative) that best supports a given claim.",
        "exam_weight": "~10% of Reading & Writing",
        "content": [
            {
                "heading": "Textual evidence questions",
                "body": (
                    "These ask: 'Which quotation from the text best supports the claim that...?'\n\n"
                    "APPROACH:\n"
                    "1. Understand the specific CLAIM you need to support.\n"
                    "2. Look for the option that most DIRECTLY connects to that claim.\n"
                    "3. Eliminate options that are relevant to the text but don't address the claim.\n\n"
                    "TRAP: An option that comes from the text but supports a DIFFERENT point."
                ),
            },
            {
                "heading": "Quantitative evidence questions",
                "body": (
                    "These pair a passage and a graph/table. You choose which finding from "
                    "the data most directly supports or challenges a claim in the passage.\n\n"
                    "APPROACH:\n"
                    "1. Read the claim in the question carefully.\n"
                    "2. Find the specific data point (number, percentage, trend) that addresses it.\n"
                    "3. Choose the answer that uses that specific data — NOT a general trend.\n\n"
                    "KEY: The strongest evidence uses SPECIFIC numbers to support SPECIFIC claims.\n"
                    "A general trend ('sales increased') is weaker than a specific number ('sales "
                    "increased by 42% in Q3')."
                ),
            },
            {
                "heading": "What 'best supports' means",
                "body": (
                    "Best = most directly and specifically connected to the stated claim.\n\n"
                    "A correct answer:\n"
                    "• Uses evidence that directly addresses the claim (not a related but different point)\n"
                    "• Is specific (uses numbers/quotes when available)\n"
                    "• Doesn't require multiple logical steps to connect to the claim\n\n"
                    "A wrong answer:\n"
                    "• Is from the right passage but about a different aspect\n"
                    "• Is too general to 'support' the specific claim\n"
                    "• Actually contradicts or is irrelevant to the claim"
                ),
            },
        ],
        "key_rules": [
            "The evidence must DIRECTLY support the specific claim — not just the general topic.",
            "Specific numbers/percentages are stronger evidence than general statements.",
            "Evidence from the right passage is not automatically the right answer.",
        ],
        "common_errors": [
            "Choosing evidence that's related to the topic but supports a different point.",
            "Choosing general data when specific numbers are available.",
            "Choosing evidence that's accurate but actually challenges the claim.",
        ],
        "quick_tips": [
            "Pre-identify exactly which data point would prove the claim, then match to options.",
            "Ask: 'Does this evidence make the claim MORE believable?' — if yes, it's likely correct.",
        ],
        "formula_sheet": [],
        "examples": [],
    },


    # ══════════════════════════════════════════════════════════
    #  MATH SECTION
    # ══════════════════════════════════════════════════════════

    # ── Linear Equations ──────────────────────────────────────
    "SAT-M-LE": {
        "id": "SAT-M-LE",
        "exam": "SAT",
        "section": "Math",
        "topic": "Linear Equations",
        "display_name": "Linear Equations",
        "description": "Solve single-variable linear equations, interpret slope/intercept, and set up word problem equations.",
        "exam_weight": "~13% of Math",
        "content": [
            {
                "heading": "Solving linear equations",
                "body": (
                    "A linear equation has the variable raised to power 1 only.\n\n"
                    "BASIC STEPS:\n"
                    "1. Distribute (remove parentheses): a(b + c) = ab + ac\n"
                    "2. Combine like terms on each side.\n"
                    "3. Move variable terms to one side, constants to the other.\n"
                    "4. Divide both sides by the coefficient.\n\n"
                    "Example: 5(x − 3) = 2x + 9\n"
                    "→ 5x − 15 = 2x + 9\n"
                    "→ 3x = 24\n"
                    "→ x = 8"
                ),
            },
            {
                "heading": "Slope-Intercept Form: y = mx + b",
                "body": (
                    "m = slope = rate of change = rise/run\n"
                    "b = y-intercept = value of y when x = 0\n\n"
                    "SLOPE FORMULA:\n"
                    "m = (y₂ − y₁) / (x₂ − x₁)\n\n"
                    "FINDING THE EQUATION given two points:\n"
                    "1. Calculate slope m.\n"
                    "2. Substitute m and one point (x, y) into y = mx + b.\n"
                    "3. Solve for b.\n"
                    "4. Write final equation.\n\n"
                    "INTERPRETING IN CONTEXT:\n"
                    "• Slope = how much y changes for each 1-unit increase in x.\n"
                    "• y-intercept = starting value (when x = 0).\n"
                    "Example: Cost = 5 + 2t → Start at $5, increases by $2 per hour."
                ),
            },
            {
                "heading": "Standard Form: Ax + By = C",
                "body": (
                    "To convert from standard to slope-intercept:\n"
                    "Solve for y: By = −Ax + C → y = (−A/B)x + (C/B)\n"
                    "Slope = −A/B, y-intercept = C/B\n\n"
                    "POINT-SLOPE FORM (useful for building equations):\n"
                    "y − y₁ = m(x − x₁)\n"
                    "Use when you know the slope and one point."
                ),
            },
            {
                "heading": "Absolute Value Equations",
                "body": (
                    "|expression| = k splits into TWO equations:\n"
                    "Case 1: expression = k\n"
                    "Case 2: expression = −k\n\n"
                    "Example: |2x − 6| = 4\n"
                    "Case 1: 2x − 6 = 4 → x = 5\n"
                    "Case 2: 2x − 6 = −4 → x = 1\n\n"
                    "• |expression| = 0 → exactly ONE solution.\n"
                    "• |expression| = negative number → NO solution (impossible).\n"
                    "• |expression| = positive number → TWO solutions."
                ),
            },
            {
                "heading": "Setting up word problems",
                "body": (
                    "COMMON STRUCTURES:\n\n"
                    "FLAT FEE + RATE: total = fixed + rate × quantity\n"
                    "   Example: Taxi = $3 + $1.50 per mile → 3 + 1.5m = 16.50\n\n"
                    "BREAK-EVEN: two costs are equal → set them equal and solve.\n"
                    "   Example: 'Plan A costs 20 + 5m. Plan B costs 10m. When equal?'\n"
                    "   20 + 5m = 10m → m = 4\n\n"
                    "TOTAL ITEMS: x + y = total, with constraints.\n"
                    "   Example: Tickets: adult $8, child $5. Total 100 tickets, $620.\n"
                    "   a + c = 100 AND 8a + 5c = 620"
                ),
            },
        ],
        "key_rules": [
            "Distribute before combining like terms.",
            "Whatever you do to one side, do to the other.",
            "Slope = (y₂−y₁)/(x₂−x₁) — rise over run.",
            "y-intercept is the value when x = 0.",
            "Slope in context = rate of change per unit.",
            "|x| = k creates two equations: x = k and x = −k.",
            "Set up word problems as equations: name your variable first.",
        ],
        "common_errors": [
            "Forgetting to distribute the negative sign: −2(x − 3) = −2x + 6, NOT −2x − 6.",
            "Calculating slope as run/rise instead of rise/run.",
            "Interpreting slope as the starting value (that's the y-intercept).",
            "Missing the second case in absolute value equations.",
            "Setting up word problems without defining variables clearly.",
        ],
        "quick_tips": [
            "Check your answer by substituting back into the original equation.",
            "For slope problems: list (x₁,y₁) and (x₂,y₂) clearly before computing.",
            "For word problems: always write what your variable represents first.",
        ],
        "formula_sheet": [
            "Slope-intercept: y = mx + b",
            "Slope: m = (y₂−y₁) / (x₂−x₁)",
            "Point-slope: y − y₁ = m(x − x₁)",
            "Standard form: Ax + By = C → slope = −A/B",
            "|expression| = k → expression = k OR expression = −k",
        ],
        "examples": [
            {
                "title": "Interpreting slope from a word problem",
                "passage": "The number of bacteria is modeled by B = 200 + 50t. What does 50 represent?",
                "steps": [
                    "Identify the form: B = 200 + 50t matches y = b + mx (b=200, m=50).",
                    "Slope (50) = rate of change → bacteria increase by 50 per hour.",
                    "y-intercept (200) = starting value → 200 bacteria at t = 0.",
                ],
                "answer": "50 = rate of increase = 50 bacteria per hour.",
            },
        ],
    },


    # ── Systems of Linear Equations ───────────────────────────
    "SAT-M-SLE": {
        "id": "SAT-M-SLE",
        "exam": "SAT",
        "section": "Math",
        "topic": "Systems of Linear Equations",
        "display_name": "Systems of Linear Equations",
        "description": "Solve systems using substitution, elimination, or graphical interpretation.",
        "exam_weight": "~10% of Math",
        "content": [
            {
                "heading": "Method 1 — Substitution",
                "body": (
                    "Best when one equation is already solved for a variable.\n\n"
                    "STEPS:\n"
                    "1. Solve one equation for one variable (e.g., y = 2x + 3).\n"
                    "2. Substitute that expression into the other equation.\n"
                    "3. Solve for the remaining variable.\n"
                    "4. Substitute back to find the other variable.\n\n"
                    "Example: y = 2x + 3 and y = 5x − 9\n"
                    "→ 2x + 3 = 5x − 9\n"
                    "→ 12 = 3x → x = 4\n"
                    "→ y = 2(4) + 3 = 11"
                ),
            },
            {
                "heading": "Method 2 — Elimination",
                "body": (
                    "Best when both equations are in Ax + By = C form.\n\n"
                    "STEPS:\n"
                    "1. Multiply one or both equations so one variable has opposite coefficients.\n"
                    "2. Add the equations — one variable cancels out.\n"
                    "3. Solve for the remaining variable.\n"
                    "4. Substitute back.\n\n"
                    "Example: 3x + 2y = 16 and 5x − 2y = 8\n"
                    "→ Add: 8x = 24 → x = 3\n"
                    "→ 3(3) + 2y = 16 → y = 3.5"
                ),
            },
            {
                "heading": "Number of solutions — graphical interpretation",
                "body": (
                    "EXACTLY ONE SOLUTION — lines intersect at one point (different slopes).\n\n"
                    "NO SOLUTION — lines are parallel (same slope, different y-intercept).\n"
                    "   Algebraically: you get a FALSE statement like 0 = 5.\n\n"
                    "INFINITE SOLUTIONS — lines are identical (same slope, same y-intercept).\n"
                    "   Algebraically: you get a TRUE statement like 0 = 0.\n\n"
                    "HOW TO CHECK:\n"
                    "Convert both to y = mx + b:\n"
                    "• Same m, different b → no solution\n"
                    "• Same m, same b → infinite solutions\n"
                    "• Different m → exactly one solution"
                ),
            },
        ],
        "key_rules": [
            "Substitution works best when one variable is already isolated.",
            "Elimination works best when coefficients can be easily matched.",
            "Same slope, different intercept = parallel lines = NO solution.",
            "Same slope, same intercept = identical lines = INFINITE solutions.",
            "Always check your solution by substituting back into BOTH equations.",
        ],
        "common_errors": [
            "Sign errors when adding/subtracting equations in elimination.",
            "Forgetting to substitute back to find the second variable.",
            "Confusing no solution with infinite solutions.",
            "Not checking if the system can be simplified before solving.",
        ],
        "quick_tips": [
            "If both equations equal y, just set the right-hand sides equal.",
            "For no solution/infinite: divide Eq1 by Eq2 coefficient-by-coefficient and see if ratios match.",
        ],
        "formula_sheet": [
            "Same slopes, different intercepts → NO solution (parallel lines)",
            "Same slopes, same intercepts → INFINITE solutions (same line)",
            "Different slopes → ONE solution (lines intersect)",
        ],
        "examples": [],
    },


    # ── Quadratic Functions ───────────────────────────────────
    "SAT-M-QF": {
        "id": "SAT-M-QF",
        "exam": "SAT",
        "section": "Math",
        "topic": "Quadratic Functions",
        "display_name": "Quadratic Functions",
        "description": "Solve quadratics by factoring, quadratic formula, and completing the square. Understand vertex, roots, and discriminant.",
        "exam_weight": "~15% of Math",
        "content": [
            {
                "heading": "Standard, Vertex, and Factored Forms",
                "body": (
                    "STANDARD FORM: f(x) = ax² + bx + c\n"
                    "• a > 0 → parabola opens UP (minimum at vertex)\n"
                    "• a < 0 → parabola opens DOWN (maximum at vertex)\n"
                    "• c = y-intercept (where graph crosses y-axis)\n\n"
                    "VERTEX FORM: f(x) = a(x − h)² + k\n"
                    "• Vertex = (h, k)\n"
                    "• Note: the sign flips! f(x) = (x − 3)² + 4 → vertex at (3, 4), NOT (−3, 4)\n\n"
                    "FACTORED FORM: f(x) = a(x − r₁)(x − r₂)\n"
                    "• r₁ and r₂ are the x-intercepts (roots/zeros)\n"
                    "• Axis of symmetry = (r₁ + r₂) / 2"
                ),
            },
            {
                "heading": "Solving quadratics — 3 methods",
                "body": (
                    "METHOD 1 — FACTORING (fastest when it works)\n"
                    "For x² + bx + c = 0: find two numbers that MULTIPLY to c and ADD to b.\n"
                    "Example: x² − 5x + 6 → (x−2)(x−3) = 0 → x = 2 or x = 3\n\n"
                    "METHOD 2 — QUADRATIC FORMULA (always works)\n"
                    "x = [−b ± √(b² − 4ac)] / 2a\n"
                    "Example: 2x² − 5x + 2 = 0\n"
                    "x = [5 ± √(25−16)] / 4 = [5 ± 3] / 4\n"
                    "x = 2 or x = 0.5\n\n"
                    "METHOD 3 — COMPLETING THE SQUARE\n"
                    "Useful to find vertex form:\n"
                    "x² + 6x + 5 = 0\n"
                    "→ (x² + 6x + 9) − 9 + 5 = 0\n"
                    "→ (x + 3)² = 4\n"
                    "→ x + 3 = ±2 → x = −1 or x = −5"
                ),
            },
            {
                "heading": "The Discriminant — b² − 4ac",
                "body": (
                    "The discriminant tells you HOW MANY REAL ROOTS a quadratic has:\n\n"
                    "• b² − 4ac > 0 → TWO distinct real roots (line crosses x-axis twice)\n"
                    "• b² − 4ac = 0 → ONE real root (line touches x-axis once — tangent)\n"
                    "• b² − 4ac < 0 → NO real roots (line doesn't touch x-axis)\n\n"
                    "SAT TIP: 'Exactly one real root' or 'touches the x-axis' → set discriminant = 0."
                ),
            },
            {
                "heading": "Vieta's Formulas (sum and product of roots)",
                "body": (
                    "For ax² + bx + c = 0 with roots r₁ and r₂:\n\n"
                    "SUM of roots: r₁ + r₂ = −b/a\n"
                    "PRODUCT of roots: r₁ × r₂ = c/a\n\n"
                    "Example: x² − 7x + 12 = 0\n"
                    "Sum = 7/1 = 7, Product = 12/1 = 12\n"
                    "Roots must multiply to 12 and add to 7 → (3)(4) ✓\n\n"
                    "Use Vieta's to quickly find the SUM of solutions without fully solving."
                ),
            },
            {
                "heading": "Parabola — vertex and axis of symmetry",
                "body": (
                    "VERTEX (h, k):\n"
                    "• From vertex form: read off directly.\n"
                    "• From standard form: h = −b / (2a), k = f(h)\n\n"
                    "AXIS OF SYMMETRY: x = h = −b / (2a)\n\n"
                    "The vertex is the minimum (if a>0) or maximum (if a<0) of the function.\n\n"
                    "Example: f(x) = 2x² − 8x + 5\n"
                    "h = −(−8) / (2×2) = 8/4 = 2\n"
                    "k = f(2) = 2(4) − 8(2) + 5 = 8 − 16 + 5 = −3\n"
                    "Vertex = (2, −3)"
                ),
            },
        ],
        "key_rules": [
            "Standard form: f(x) = ax² + bx + c → c is y-intercept.",
            "Vertex form: f(x) = a(x−h)² + k → vertex is (h, k). Watch the sign of h!",
            "Factored form: f(x) = a(x−r₁)(x−r₂) → roots are r₁ and r₂.",
            "Discriminant = b²−4ac: positive=2 roots, zero=1 root, negative=no roots.",
            "Sum of roots = −b/a, Product of roots = c/a.",
            "Vertex x-coordinate: h = −b/(2a).",
            "a > 0 = opens up (minimum), a < 0 = opens down (maximum).",
        ],
        "common_errors": [
            "Vertex form: reading vertex as (−h, k) instead of (h, k) — the sign flips!",
            "Forgetting ± in quadratic formula — finding only one root.",
            "Confusing discriminant > 0 (two roots) with < 0 (no roots).",
            "Not dividing correctly in quadratic formula — dividing by 2 instead of 2a.",
        ],
        "quick_tips": [
            "If the problem says 'one real root' or 'tangent to x-axis' → discriminant = 0.",
            "Factoring shortcut: for x²+bx+c, find two numbers: product=c, sum=b.",
            "Vieta's formulas save time on 'sum of solutions' questions.",
        ],
        "formula_sheet": [
            "Quadratic Formula: x = [−b ± √(b²−4ac)] / 2a",
            "Discriminant: b² − 4ac",
            "Vertex: h = −b/(2a), k = f(h)",
            "Sum of roots: −b/a",
            "Product of roots: c/a",
            "Vertex form: f(x) = a(x−h)² + k → vertex (h, k)",
        ],
        "examples": [
            {
                "title": "Using discriminant to find k",
                "passage": "f(x) = x² − 6x + k has exactly one real root. Find k.",
                "steps": [
                    "Exactly one root → discriminant = 0.",
                    "Discriminant = b² − 4ac = (−6)² − 4(1)(k) = 36 − 4k.",
                    "Set equal to 0: 36 − 4k = 0 → k = 9.",
                ],
                "answer": "k = 9",
            },
        ],
    },


    # ── Exponential Functions ─────────────────────────────────
    "SAT-M-EF": {
        "id": "SAT-M-EF",
        "exam": "SAT",
        "section": "Math",
        "topic": "Exponential Functions",
        "display_name": "Exponential Functions",
        "description": "Model growth and decay with exponential equations. Interpret base, rate, and initial value.",
        "exam_weight": "~10% of Math",
        "content": [
            {
                "heading": "Exponential growth and decay formula",
                "body": (
                    "GENERAL FORM: f(t) = A × bᵗ\n"
                    "• A = initial value (at t = 0)\n"
                    "• b = growth/decay factor (base)\n"
                    "• t = time\n\n"
                    "GROWTH: b > 1\n"
                    "   If growing by r% each period: b = 1 + r/100\n"
                    "   Example: 5% growth per year → b = 1.05\n"
                    "   f(t) = 1000(1.05)ᵗ\n\n"
                    "DECAY: 0 < b < 1\n"
                    "   If decaying by r% each period: b = 1 − r/100\n"
                    "   Example: 15% depreciation per year → b = 0.85\n"
                    "   f(t) = 20000(0.85)ᵗ"
                ),
            },
            {
                "heading": "Doubling and halving",
                "body": (
                    "DOUBLING TIME:\n"
                    "f(t) = A × 2^(t/d)\n"
                    "where d = time to double.\n"
                    "Example: Doubles every 3 hours → f(t) = 500 × 2^(t/3)\n"
                    "At t = 12: f(12) = 500 × 2^(12/3) = 500 × 2⁴ = 500 × 16 = 8000\n\n"
                    "HALF-LIFE (radioactive decay):\n"
                    "f(t) = A × (1/2)^(t/h)\n"
                    "where h = half-life period.\n"
                    "Example: Half-life of 5 years → f(t) = 200 × (0.5)^(t/5)"
                ),
            },
            {
                "heading": "Exponential vs Linear — which model?",
                "body": (
                    "LINEAR: increases/decreases by the SAME AMOUNT each period.\n"
                    "   'Adds 50 per hour' → f(t) = 200 + 50t\n\n"
                    "EXPONENTIAL: increases/decreases by the SAME PERCENTAGE each period.\n"
                    "   'Doubles every hour' or 'grows by 20%' → f(t) = A × bᵗ\n\n"
                    "SAT TIP: Look for percentage language → exponential.\n"
                    "Look for fixed amount language → linear."
                ),
            },
            {
                "heading": "Reading the graph of an exponential",
                "body": (
                    "• y-intercept = initial value A (where the curve crosses y-axis)\n"
                    "• If curve goes up → growth (b > 1)\n"
                    "• If curve goes down → decay (b < 1)\n"
                    "• Exponential curves NEVER touch zero (asymptote at y = 0)\n"
                    "• Horizontal asymptote at y = 0 for basic models"
                ),
            },
        ],
        "key_rules": [
            "Growth by r% → multiply by (1 + r/100) each period.",
            "Decay by r% → multiply by (1 − r/100) each period.",
            "A = initial value (plug in t = 0 to confirm).",
            "Doubling: f = A × 2^(t/d) where d is doubling period.",
            "Percentage language → exponential. Fixed amount → linear.",
            "Exponential function NEVER equals zero — asymptote at y = 0.",
        ],
        "common_errors": [
            "Using b = 0.15 for '15% decay' instead of b = 0.85 (keeps 85%).",
            "Using b = 1.15 for '15% decay' (that's growth).",
            "Confusing linear and exponential models in word problems.",
            "Forgetting to count the number of periods correctly (t/d for doubling).",
        ],
        "quick_tips": [
            "Always ask: 'What fraction does it KEEP each period?' — that's your base.",
            "For 'doubles every d years': number of doublings in time t = t/d.",
            "The initial value A is always the y-intercept of the graph.",
        ],
        "formula_sheet": [
            "Exponential growth: f(t) = A(1 + r)ᵗ where r = rate as decimal",
            "Exponential decay: f(t) = A(1 − r)ᵗ where r = rate as decimal",
            "Doubling: f(t) = A × 2^(t/d)",
            "Half-life: f(t) = A × (1/2)^(t/h)",
            "At t = 0: f(0) = A × b⁰ = A × 1 = A (initial value)",
        ],
        "examples": [],
    },


    # ── Statistics ────────────────────────────────────────────
    "SAT-M-STAT": {
        "id": "SAT-M-STAT",
        "exam": "SAT",
        "section": "Math",
        "topic": "Statistics",
        "display_name": "Statistics",
        "description": "Interpret mean, median, mode, range, standard deviation, and draw conclusions from data.",
        "exam_weight": "~10% of Math",
        "content": [
            {
                "heading": "Mean, Median, Mode",
                "body": (
                    "MEAN (average): sum of all values ÷ number of values\n"
                    "   Example: {4, 7, 9, 10, 10} → mean = 40/5 = 8\n\n"
                    "MEDIAN: middle value when data is ordered.\n"
                    "   Odd number of values → middle item.\n"
                    "   Even number of values → average of two middle items.\n"
                    "   Example: {4, 7, 9, 10, 10} → median = 9 (3rd of 5)\n\n"
                    "MODE: most frequently occurring value.\n"
                    "   Example: {4, 7, 9, 10, 10} → mode = 10\n\n"
                    "RANGE: max − min\n"
                    "   Example: {4, 7, 9, 10, 10} → range = 10 − 4 = 6"
                ),
            },
            {
                "heading": "Standard Deviation",
                "body": (
                    "Standard deviation measures how SPREAD OUT the data is from the mean.\n\n"
                    "• HIGH standard deviation → data is spread out / varied.\n"
                    "• LOW standard deviation → data is clustered close to the mean.\n\n"
                    "You will NOT need to calculate SD on the SAT — you only need to INTERPRET it.\n\n"
                    "KEY QUESTION: 'Which dataset has greater spread?' → higher SD.\n\n"
                    "Two datasets can have the SAME MEAN but DIFFERENT spread:\n"
                    "• {8, 8, 8, 8} → mean = 8, SD = 0 (no spread)\n"
                    "• {2, 5, 11, 14} → mean = 8, SD ≈ 4.5 (high spread)"
                ),
            },
            {
                "heading": "Sampling and population inference",
                "body": (
                    "The goal of sampling is to draw conclusions about the POPULATION, "
                    "not just the sample.\n\n"
                    "MARGIN OF ERROR (±E):\n"
                    "If a study finds 35% with ±4% margin of error:\n"
                    "→ The TRUE population percentage is likely between 31% and 39%.\n\n"
                    "KEY DISTINCTIONS:\n"
                    "• 'Exactly 35%' → WRONG (we can't be exact with a sample)\n"
                    "• '31–39% of the sample' → WRONG (we already know the sample was 35%)\n"
                    "• '31–39% of the population' → CORRECT\n\n"
                    "CAUTION:\n"
                    "• Association ≠ causation (studies 'suggest' or 'are associated with')\n"
                    "• Generalizations beyond the sampled population are unsupported\n"
                    "• Random sampling = results can be generalized to population\n"
                    "• Non-random sampling = results may be biased"
                ),
            },
            {
                "heading": "Reading tables and two-way tables",
                "body": (
                    "TWO-WAY TABLE: rows and columns represent two categories.\n\n"
                    "RELATIVE FREQUENCY: fraction/percentage within a group.\n"
                    "   'What % of science students like math?'\n"
                    "   → Restrict to SCIENCE row, find % who like math.\n\n"
                    "CONDITIONAL PROBABILITY from table:\n"
                    "   P(A | B) = (count of A and B) / (count of B)\n"
                    "   'P(likes math | is in science group)' = (likes math AND science) / total in science"
                ),
            },
        ],
        "key_rules": [
            "Mean = sum / count. Median = middle value (after ordering).",
            "Standard deviation = spread — you interpret it, not calculate it.",
            "Margin of error applies to the POPULATION estimate, not the sample.",
            "Correlation/association ≠ causation in study conclusions.",
            "For two-way tables: restrict to the given group for conditional probability.",
        ],
        "common_errors": [
            "Applying margin of error to the sample instead of the population.",
            "Confusing median position: with 6 values, median = average of 3rd and 4th.",
            "Claiming causation from observational study data.",
            "Higher SD = more spread, not lower. Students often reverse this.",
        ],
        "quick_tips": [
            "When adding a new value above the mean → mean increases, but how much? Depends on count.",
            "'Which is higher, mean or median?' → if data is skewed right, mean > median.",
            "For margin of error questions: the answer is always about the population, not the sample.",
        ],
        "formula_sheet": [
            "Mean = Σx / n",
            "Median: middle value of sorted data",
            "Range = max − min",
            "Population estimate = sample % ± margin of error",
        ],
        "examples": [],
    },


    # ── Geometry ──────────────────────────────────────────────
    "SAT-M-GEO": {
        "id": "SAT-M-GEO",
        "exam": "SAT",
        "section": "Math",
        "topic": "Geometry",
        "display_name": "Geometry",
        "description": "Solve problems involving triangles, circles, polygons, coordinate geometry, and 3D shapes.",
        "exam_weight": "~15% of Math",
        "content": [
            {
                "heading": "Reference formulas (given on SAT)",
                "body": (
                    "These are provided in the test — you should still know them for speed:\n\n"
                    "AREAS:\n"
                    "• Rectangle: A = lw\n"
                    "• Triangle: A = ½bh\n"
                    "• Circle: A = πr²\n"
                    "• Trapezoid: A = ½(b₁ + b₂)h\n\n"
                    "CIRCUMFERENCE: C = 2πr = πd\n\n"
                    "VOLUME:\n"
                    "• Cylinder: V = πr²h\n"
                    "• Cone: V = ⅓πr²h\n"
                    "• Sphere: V = (4/3)πr³\n"
                    "• Box (rectangular prism): V = lwh\n\n"
                    "PYTHAGOREAN THEOREM: a² + b² = c² (c = hypotenuse)\n\n"
                    "SPECIAL RIGHT TRIANGLES:\n"
                    "• 30-60-90: sides in ratio 1 : √3 : 2\n"
                    "• 45-45-90: sides in ratio 1 : 1 : √2"
                ),
            },
            {
                "heading": "Circles — all the key formulas",
                "body": (
                    "CIRCUMFERENCE: C = 2πr\n"
                    "AREA: A = πr²\n\n"
                    "ARC LENGTH: L = (θ/360) × 2πr\n"
                    "SECTOR AREA: A = (θ/360) × πr²\n"
                    "Where θ = central angle in degrees.\n\n"
                    "EQUATION OF CIRCLE: (x − h)² + (y − k)² = r²\n"
                    "Center = (h, k), Radius = r\n\n"
                    "CHORD / RADIUS: A chord is any line connecting two points on the circle. "
                    "The radius to the midpoint of a chord is perpendicular to it."
                ),
            },
            {
                "heading": "Triangles — key properties",
                "body": (
                    "ANGLE SUM: angles in any triangle = 180°\n\n"
                    "EXTERIOR ANGLE: exterior angle = sum of two non-adjacent interior angles.\n\n"
                    "SIMILAR TRIANGLES (AA, SAS, SSS):\n"
                    "• Corresponding angles are equal.\n"
                    "• Corresponding sides are in proportion (scale factor k).\n"
                    "• If sides are in ratio k, areas are in ratio k².\n\n"
                    "PYTHAGOREAN TRIPLES (memorize):\n"
                    "3-4-5, 5-12-13, 8-15-17, 7-24-25\n"
                    "(And their multiples: 6-8-10, 9-12-15, etc.)\n\n"
                    "ISOSCELES TRIANGLE: two equal sides → two equal base angles.\n"
                    "EQUILATERAL TRIANGLE: all sides equal → all angles = 60°."
                ),
            },
            {
                "heading": "Coordinate geometry",
                "body": (
                    "DISTANCE FORMULA: d = √[(x₂−x₁)² + (y₂−y₁)²]\n\n"
                    "MIDPOINT FORMULA: M = [(x₁+x₂)/2, (y₁+y₂)/2]\n\n"
                    "SLOPE: m = (y₂−y₁)/(x₂−x₁)\n\n"
                    "PARALLEL LINES: same slope, different y-intercept.\n\n"
                    "PERPENDICULAR LINES: slopes are NEGATIVE RECIPROCALS.\n"
                    "   If m₁ = 2/3, then m₂ = −3/2 (flip and negate).\n"
                    "   Product of perpendicular slopes: m₁ × m₂ = −1"
                ),
            },
            {
                "heading": "Angles — key relationships",
                "body": (
                    "SUPPLEMENTARY ANGLES: add to 180°.\n"
                    "COMPLEMENTARY ANGLES: add to 90°.\n"
                    "VERTICAL ANGLES: equal (opposite angles when two lines intersect).\n\n"
                    "PARALLEL LINES CUT BY TRANSVERSAL:\n"
                    "• Corresponding angles: equal ✓\n"
                    "• Alternate interior angles: equal ✓\n"
                    "• Co-interior (same-side interior) angles: supplementary (add to 180°)\n\n"
                    "POLYGON INTERIOR ANGLES:\n"
                    "Sum = (n − 2) × 180°, where n = number of sides.\n"
                    "Quadrilateral: 360°. Pentagon: 540°. Hexagon: 720°."
                ),
            },
        ],
        "key_rules": [
            "Pythagorean theorem: a² + b² = c² (c is always the hypotenuse, the longest side).",
            "Arc length = (angle/360) × circumference.",
            "Sector area = (angle/360) × πr².",
            "Equation of circle: (x−h)² + (y−k)² = r². Careful — center is (h, k).",
            "Similar triangles: set up a proportion of corresponding sides.",
            "Perpendicular slopes multiply to −1.",
            "Sum of interior angles of n-gon = (n−2) × 180.",
        ],
        "common_errors": [
            "Using diameter instead of radius in circle formulas.",
            "Forgetting to square the radius: A = πr², not πr.",
            "Setting up wrong corresponding sides in similar triangle proportions.",
            "Confusing arc length and sector area formulas.",
            "Misidentifying the center when completing the square in circle equations.",
        ],
        "quick_tips": [
            "Recognize Pythagorean triples (3-4-5, 5-12-13) to skip the calculation.",
            "For circle equation: (x−h)² + (y−k)² = r² → always check signs for center.",
            "For arc: angle/360 is the FRACTION of the whole circle — apply to circumference or area.",
        ],
        "formula_sheet": [
            "Area of circle: πr²",
            "Circumference: 2πr",
            "Arc length: (θ/360) × 2πr",
            "Sector area: (θ/360) × πr²",
            "Circle equation: (x−h)² + (y−k)² = r²",
            "Pythagorean theorem: a² + b² = c²",
            "Distance: √[(x₂−x₁)² + (y₂−y₁)²]",
            "Midpoint: [(x₁+x₂)/2, (y₁+y₂)/2]",
            "Interior angle sum: (n−2) × 180",
            "Perpendicular slopes: m₁ × m₂ = −1",
        ],
        "examples": [],
    },


    # ── Trigonometry ──────────────────────────────────────────
    "SAT-M-TRIG": {
        "id": "SAT-M-TRIG",
        "exam": "SAT",
        "section": "Math",
        "topic": "Trigonometry",
        "display_name": "Trigonometry",
        "description": "Apply SOH-CAH-TOA, complementary angle identities, and the unit circle basics.",
        "exam_weight": "~5–8% of Math",
        "content": [
            {
                "heading": "SOH-CAH-TOA",
                "body": (
                    "In a RIGHT triangle, relative to angle θ:\n\n"
                    "sin θ = Opposite / Hypotenuse\n"
                    "cos θ = Adjacent / Hypotenuse\n"
                    "tan θ = Opposite / Adjacent\n\n"
                    "MEMORY TIP: SOH-CAH-TOA\n"
                    "Some Old Hippos Carry A Heavy Tub of Apples\n\n"
                    "STANDARD VALUES TO MEMORIZE:\n"
                    "sin 30° = 0.5,  cos 30° = √3/2\n"
                    "sin 45° = √2/2, cos 45° = √2/2\n"
                    "sin 60° = √3/2, cos 60° = 0.5\n"
                    "sin 90° = 1,    cos 90° = 0"
                ),
            },
            {
                "heading": "Complementary angle identity",
                "body": (
                    "sin(θ) = cos(90° − θ)\n"
                    "cos(θ) = sin(90° − θ)\n\n"
                    "This means: sin and cos of complementary angles are EQUAL.\n\n"
                    "Example: sin(35°) = cos(55°) because 35 + 55 = 90.\n\n"
                    "SAT QUESTION TYPE: 'If sin(x°) = cos(y°), what is x + y?'\n"
                    "Answer: x + y = 90 (they must be complementary)."
                ),
            },
            {
                "heading": "Finding missing sides and angles",
                "body": (
                    "TO FIND A MISSING SIDE:\n"
                    "1. Identify angle and which sides are involved.\n"
                    "2. Choose sin, cos, or tan.\n"
                    "3. Set up ratio and solve.\n\n"
                    "Example: Angle = 30°, hypotenuse = 14. Find opposite side.\n"
                    "sin(30°) = opp/14 → 0.5 = opp/14 → opp = 7\n\n"
                    "TO FIND A MISSING ANGLE:\n"
                    "Use inverse trig: θ = sin⁻¹(opp/hyp)\n\n"
                    "PYTHAGOREAN IDENTITY:\n"
                    "sin²θ + cos²θ = 1 (always true)\n"
                    "Use this to find sin if given cos, or vice versa."
                ),
            },
        ],
        "key_rules": [
            "SOH-CAH-TOA: sin=O/H, cos=A/H, tan=O/A.",
            "sin(x) = cos(90−x) — complementary angle identity.",
            "sin²θ + cos²θ = 1 — Pythagorean identity.",
            "Standard values: sin30=0.5, cos60=0.5, sin45=cos45=√2/2.",
            "tan θ = sin θ / cos θ.",
        ],
        "common_errors": [
            "Using sin when cos is needed — always label O, A, H relative to the GIVEN angle.",
            "Forgetting that complementary angles add to 90 (not 180).",
            "Using degrees when the problem expects radians (rare on SAT but possible).",
        ],
        "quick_tips": [
            "Label all three sides (O, A, H) relative to the angle before setting up the ratio.",
            "If asked for an expression like sin(x) given cos(x), use sin²+cos²=1.",
        ],
        "formula_sheet": [
            "sin θ = Opposite / Hypotenuse",
            "cos θ = Adjacent / Hypotenuse",
            "tan θ = Opposite / Adjacent = sin/cos",
            "sin(θ) = cos(90°−θ)",
            "sin²θ + cos²θ = 1",
            "30-60-90 sides: 1 : √3 : 2",
            "45-45-90 sides: 1 : 1 : √2",
        ],
        "examples": [],
    },


    # ── Percentages ───────────────────────────────────────────
    "SAT-M-PCT": {
        "id": "SAT-M-PCT",
        "exam": "SAT",
        "section": "Math",
        "topic": "Percentages",
        "display_name": "Percentages",
        "description": "Calculate percent change, percent of a total, and successive percent changes.",
        "exam_weight": "~8% of Math",
        "content": [
            {
                "heading": "Core percentage formulas",
                "body": (
                    "PERCENT OF A NUMBER:\n"
                    "   x% of n = (x/100) × n\n"
                    "   Example: 35% of 80 = 0.35 × 80 = 28\n\n"
                    "PERCENT CHANGE:\n"
                    "   % change = [(new − old) / old] × 100\n"
                    "   Positive = increase. Negative = decrease.\n\n"
                    "FINDING ORIGINAL VALUE:\n"
                    "   If 120 is 30% more than the original:\n"
                    "   original × 1.30 = 120 → original = 120/1.30 ≈ 92.3\n\n"
                    "FINDING WHAT PERCENT:\n"
                    "   What percent is 45 of 180? → (45/180) × 100 = 25%"
                ),
            },
            {
                "heading": "Successive percent changes",
                "body": (
                    "IMPORTANT: Percent changes DO NOT simply add/subtract.\n\n"
                    "Example: +20% then −20% ≠ 0%.\n"
                    "   Start: 100 → after +20%: 120 → after −20%: 96. Net = −4%.\n\n"
                    "REASON: The second percentage is applied to a DIFFERENT base.\n\n"
                    "FORMULA for two successive changes (r₁ and r₂ as decimals):\n"
                    "   Net multiplier = (1 + r₁)(1 + r₂)\n"
                    "   For +20% then −20%: (1.20)(0.80) = 0.96 → 4% decrease\n\n"
                    "GENERAL TIP: Always use multiplication, not addition, for percent changes."
                ),
            },
            {
                "heading": "Percent in context — tax, discount, tip",
                "body": (
                    "DISCOUNT then TAX (apply in order!):\n"
                    "   Step 1: Apply discount → new price\n"
                    "   Step 2: Apply tax to the DISCOUNTED price\n"
                    "   Example: $80 jacket, 25% off, then 10% tax:\n"
                    "   After discount: 80 × 0.75 = $60\n"
                    "   After tax: 60 × 1.10 = $66\n\n"
                    "MARKUP: new price = original × (1 + markup rate)\n"
                    "   Example: $50 item, 40% markup: 50 × 1.40 = $70\n\n"
                    "TIP CALCULATION: tip = bill × tip rate. Total = bill × (1 + tip rate)."
                ),
            },
        ],
        "key_rules": [
            "% change = (new − old) / old × 100.",
            "Successive % changes: multiply factors, don't add percentages.",
            "+r% then −r% always results in a net DECREASE (not zero).",
            "Apply discount BEFORE tax — different bases give different results.",
            "To find original: divide current value by the multiplier.",
        ],
        "common_errors": [
            "Adding percentage changes instead of multiplying (20% + 20% ≠ net effect).",
            "Applying tax to original price instead of discounted price.",
            "Forgetting that +20% then −20% gives −4%, not 0%.",
        ],
        "quick_tips": [
            "Use a base of 100 for any successive percentage change question.",
            "For discount: think 'what fraction does it COST after discount?'",
        ],
        "formula_sheet": [
            "% of number: (x/100) × n",
            "% change: (new − old)/old × 100",
            "Successive changes: multiply (1±r₁)(1±r₂)",
            "Increase by x%: multiply by (1 + x/100)",
            "Decrease by x%: multiply by (1 − x/100)",
        ],
        "examples": [],
    },


    # ── Ratios & Proportions ──────────────────────────────────
    "SAT-M-RP": {
        "id": "SAT-M-RP",
        "exam": "SAT",
        "section": "Math",
        "topic": "Ratios & Proportions",
        "display_name": "Ratios & Proportions",
        "description": "Set up and solve proportions, including unit conversion and scale problems.",
        "exam_weight": "~8% of Math",
        "content": [
            {
                "heading": "Setting up proportions",
                "body": (
                    "A proportion states two ratios are equal: a/b = c/d\n\n"
                    "CROSS-MULTIPLICATION: ad = bc\n\n"
                    "SETTING UP:\n"
                    "Keep the SAME UNITS in the same position:\n"
                    "(value 1 / quantity 1) = (value 2 / quantity 2)\n\n"
                    "Example: 3 cups flour : 24 cookies = x cups : 64 cookies\n"
                    "3/24 = x/64 → 24x = 192 → x = 8"
                ),
            },
            {
                "heading": "Unit conversion",
                "body": (
                    "Use DIMENSIONAL ANALYSIS — multiply by conversion fractions.\n\n"
                    "Example: Convert 60 mph to feet per second.\n"
                    "60 miles/hr × (5280 feet/mile) × (1 hour/3600 seconds)\n"
                    "= (60 × 5280) / 3600 = 88 feet/second\n\n"
                    "KEY: Make sure units cancel. Write them out explicitly.\n\n"
                    "COMMON CONVERSIONS:\n"
                    "1 mile = 5,280 feet\n"
                    "1 hour = 3,600 seconds\n"
                    "1 kg = 1,000 grams\n"
                    "1 liter = 1,000 milliliters"
                ),
            },
            {
                "heading": "Ratio problems",
                "body": (
                    "PART-TO-PART ratio vs PART-TO-WHOLE:\n"
                    "   Boys:Girls = 3:5 (part-to-part)\n"
                    "   Boys:Total = 3:8 (part-to-whole)\n\n"
                    "SCALING RATIOS:\n"
                    "   If A:B = 3:5 and A = 12, then B = 12 × (5/3) = 20.\n\n"
                    "COMBINED RATIOS:\n"
                    "   A:B = 2:3, B:C = 3:4 → A:B:C = 2:3:4\n"
                    "   If B ratios match, combine directly."
                ),
            },
        ],
        "key_rules": [
            "Keep same units in same positions when setting up proportions.",
            "Cross multiply to solve: a/b = c/d → ad = bc.",
            "For unit conversion: write units explicitly and cancel them.",
            "Part-to-part ratio ≠ part-to-whole — know which the question asks.",
        ],
        "common_errors": [
            "Flipping the proportion (putting different units in same position).",
            "Confusing part-to-part with part-to-whole ratios.",
            "Forgetting to convert units before using a formula.",
        ],
        "quick_tips": [
            "Write units at every step of unit conversion — they should cancel cleanly.",
            "For ratio word problems: assign variables using multiples (3x, 5x instead of 3, 5).",
        ],
        "formula_sheet": [
            "Proportion: a/b = c/d → ad = bc",
            "Ratio scaling: if A:B = m:n and A is known, B = A × (n/m)",
        ],
        "examples": [],
    },


    # ── Probability ───────────────────────────────────────────
    "SAT-M-PROB": {
        "id": "SAT-M-PROB",
        "exam": "SAT",
        "section": "Math",
        "topic": "Probability",
        "display_name": "Probability",
        "description": "Calculate basic probability, conditional probability from tables, and expected value.",
        "exam_weight": "~5% of Math",
        "content": [
            {
                "heading": "Basic probability",
                "body": (
                    "P(event) = (favorable outcomes) / (total possible outcomes)\n\n"
                    "• P(event) is always between 0 and 1.\n"
                    "• P(A) + P(not A) = 1 → P(not A) = 1 − P(A)\n\n"
                    "Example: 4 red, 6 blue, 10 green marbles (total 20).\n"
                    "P(red) = 4/20 = 1/5\n"
                    "P(not red) = 1 − 1/5 = 4/5"
                ),
            },
            {
                "heading": "Conditional probability",
                "body": (
                    "P(A | B) = probability of A GIVEN B has occurred.\n\n"
                    "Formula: P(A | B) = P(A and B) / P(B)\n\n"
                    "FROM A TABLE:\n"
                    "Restrict your sample space to only the B group, then find A within that group.\n\n"
                    "Example (two-way table):\n"
                    "Science + likes math: 70. Total in science: 100.\n"
                    "P(likes math | in science) = 70/100 = 7/10\n\n"
                    "KEY: Conditional probability RESTRICTS the sample space to the 'given' group."
                ),
            },
            {
                "heading": "Independent events",
                "body": (
                    "Two events A and B are INDEPENDENT if: P(A and B) = P(A) × P(B)\n\n"
                    "Example: Flipping a coin twice.\n"
                    "P(H and H) = 0.5 × 0.5 = 0.25\n\n"
                    "NOT independent (dependent) — one event affects the other.\n"
                    "Example: Drawing two cards WITHOUT replacement — "
                    "the second draw depends on the first."
                ),
            },
        ],
        "key_rules": [
            "P(A) = favorable / total.",
            "P(not A) = 1 − P(A).",
            "Conditional: P(A|B) restricts sample space to B group.",
            "Independent events: P(A and B) = P(A) × P(B).",
            "All probabilities are between 0 and 1.",
        ],
        "common_errors": [
            "Using the total count instead of the group count in conditional probability.",
            "Multiplying instead of adding for mutually exclusive events.",
            "Not reducing the total on the second draw (without replacement problems).",
        ],
        "quick_tips": [
            "For conditional probability from a table: circle or highlight only the relevant row/column.",
            "P(A or B) = P(A) + P(B) − P(A and B) — don't double count.",
        ],
        "formula_sheet": [
            "P(A) = favorable outcomes / total outcomes",
            "P(not A) = 1 − P(A)",
            "P(A|B) = P(A and B) / P(B)",
            "P(A and B) = P(A) × P(B)  [if independent]",
            "P(A or B) = P(A) + P(B) − P(A and B)",
        ],
        "examples": [],
    },

}


# ══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════

def get_all_topics() -> list[dict]:
    """Return a summary list of all topics with id, section, topic, and description."""
    return [
        {
            "id": note["id"],
            "section": note["section"],
            "topic": note["topic"],
            "display_name": note["display_name"],
            "description": note["description"],
            "exam_weight": note["exam_weight"],
        }
        for note in SAT_NOTES.values()
    ]


def get_note(topic_id: str) -> Optional[dict]:
    """
    Retrieve full notes for a topic by its ID.

    Args:
        topic_id: e.g. "SAT-RW-WIC", "SAT-M-QF"

    Returns:
        Full note dict, or None if not found.

    Example:
        note = get_note("SAT-M-QF")
        print(note["key_rules"])
    """
    return SAT_NOTES.get(topic_id)


def get_notes_by_section(section: str) -> list[dict]:
    """
    Return all notes for a given section.

    Args:
        section: "Reading & Writing" | "Math"

    Returns:
        List of full note dicts.
    """
    return [note for note in SAT_NOTES.values() if note["section"] == section]


def get_formula_sheet(section: Optional[str] = None) -> dict:
    """
    Return all formulas across all topics (or one section).
    Useful for generating a quick-reference formula sheet.
    """
    sheet = {}
    for note in SAT_NOTES.values():
        if section and note["section"] != section:
            continue
        if note["formula_sheet"]:
            sheet[note["display_name"]] = note["formula_sheet"]
    return sheet


def get_key_rules_summary(section: Optional[str] = None) -> dict:
    """Return key rules for every topic, grouped by topic name."""
    result = {}
    for note in SAT_NOTES.values():
        if section and note["section"] != section:
            continue
        result[note["display_name"]] = note["key_rules"]
    return result


def search_notes(keyword: str) -> list[dict]:
    """
    Search all notes for a keyword in topic name, description, content body, or key rules.

    Args:
        keyword: search term (case-insensitive)

    Returns:
        List of matching topic summary dicts.

    Example:
        search_notes("discriminant")
    """
    keyword = keyword.lower()
    results = []
    for note in SAT_NOTES.values():
        searchable = (
            note["topic"].lower()
            + note["description"].lower()
            + " ".join(note["key_rules"]).lower()
            + " ".join(note["common_errors"]).lower()
            + " ".join(
                block["body"].lower() for block in note["content"]
            )
        )
        if keyword in searchable:
            results.append({
                "id": note["id"],
                "section": note["section"],
                "topic": note["topic"],
                "display_name": note["display_name"],
            })
    return results


def export_notes_to_json(filepath: str = "sat_notes.json") -> None:
    """Export all notes to a JSON file."""
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(SAT_NOTES, f, indent=2, ensure_ascii=False)
    print(f"Exported {len(SAT_NOTES)} topic notes to {filepath}")


def export_flat_topics_json(filepath: str = "sat_topics_list.json") -> None:
    """Export a flat list of all topic summaries (for navigation/menu use)."""
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(get_all_topics(), f, indent=2, ensure_ascii=False)
    print(f"Exported topic list to {filepath}")


# ══════════════════════════════════════════════════════════════
# QUICK TEST — run this file directly
# ══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 55)
    print("  SAT NOTES BANK — Stats")
    print("=" * 55)
    print(f"  Total topics: {len(SAT_NOTES)}")
    print()

    rw = get_notes_by_section("Reading & Writing")
    math = get_notes_by_section("Math")
    print(f"  Reading & Writing topics : {len(rw)}")
    for n in rw:
        print(f"    [{n['id']}]  {n['display_name']}")

    print()
    print(f"  Math topics : {len(math)}")
    for n in math:
        print(f"    [{n['id']}]  {n['display_name']}")

    print()
    print("  Sample — Key rules for Quadratic Functions:")
    qf = get_note("SAT-M-QF")
    for rule in qf["key_rules"]:
        print(f"    • {rule}")

    print()
    print("  Sample — Formula sheet (Math only):")
    formulas = get_formula_sheet(section="Math")
    for topic, flist in formulas.items():
        print(f"    {topic}:")
        for f in flist:
            print(f"      {f}")

    print()
    print("  Sample — Search for 'discriminant':")
    results = search_notes("discriminant")
    for r in results:
        print(f"    → [{r['id']}] {r['display_name']}")

    print()
    print("  Exporting...")
    export_notes_to_json("sat_notes.json")
    export_flat_topics_json("sat_topics_list.json")
    print("  Done!")
