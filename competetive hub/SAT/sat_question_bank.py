"""
==============================================================
  SAT QUESTION BANK — Complete Static Question Database
  App: [Your EdTech App Name]
  Exam: SAT (Digital Adaptive Format)
  Version: 1.0
  Last Updated: 2025

  HOW TO USE:
    from sat_question_bank import SAT_QUESTIONS, get_questions, get_mock_test

  HOW TO ADD QUESTIONS:
    Copy any existing question block, paste at the end of the
    relevant section list, update the id, content, and save.

  STRUCTURE:
    SAT_QUESTIONS  — full dict of all questions
    get_questions(section, topic, difficulty, count)
    get_mock_test()  — returns a balanced full mock test
    get_chapter_set(section, topic)  — all questions for one topic
    get_pyq_style(section)  — only "pyq" tagged questions
    export_to_json(filepath)  — dump all questions to JSON
==============================================================
"""

import random
import json
from typing import Optional


# ──────────────────────────────────────────────────────────────
# QUESTION SCHEMA (each question is a dict):
#
#   id          : unique string  e.g. "SAT-RW-WIC-001"
#   exam        : "SAT"
#   section     : "Reading & Writing"  |  "Math"
#   topic       : see TOPICS below
#   subtopic    : finer classification
#   difficulty  : "easy" | "medium" | "hard"
#   tags        : list of strings  e.g. ["pyq", "important", "tricky"]
#   passage     : optional context passage (string or None)
#   question    : the question text
#   options     : dict  {"A": ..., "B": ..., "C": ..., "D": ...}
#   answer      : "A" | "B" | "C" | "D"
#   explanation : step-by-step solution string
#   hint        : one-line hint string
# ──────────────────────────────────────────────────────────────

# TOPIC REFERENCE
# Reading & Writing:
#   "Words in Context"
#   "Text Structure & Purpose"
#   "Cross-Text Connections"
#   "Central Ideas & Details"
#   "Command of Evidence"
#   "Inferences"
#   "Boundaries"
#   "Form, Structure & Sense"
#   "Rhetorical Synthesis"
#   "Transitions"
# Math:
#   "Linear Equations"
#   "Systems of Linear Equations"
#   "Linear Inequalities"
#   "Linear Functions & Graphs"
#   "Quadratic Functions"
#   "Exponential Functions"
#   "Equivalent Expressions"
#   "Nonlinear Equations"
#   "Ratios & Proportions"
#   "Percentages"
#   "Statistics"
#   "Probability"
#   "Geometry"
#   "Trigonometry"


SAT_QUESTIONS = {

    # ══════════════════════════════════════════════════════════
    # SECTION 1 — READING & WRITING
    # ══════════════════════════════════════════════════════════

    "Reading & Writing": [

        # ── TOPIC: Words in Context ────────────────────────────

        {
            "id": "SAT-RW-WIC-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Words in Context",
            "subtopic": "Positive / Negative connotation",
            "difficulty": "easy",
            "tags": ["important", "vocabulary"],
            "passage": (
                "The scientist's findings, while initially dismissed, proved ________ — "
                "her method of carbon dating ancient sediment layers is now the standard "
                "approach used worldwide."
            ),
            "question": "Which word best completes the text?",
            "options": {
                "A": "tenuous",
                "B": "seminal",
                "C": "contentious",
                "D": "redundant",
            },
            "answer": "B",
            "explanation": (
                "'Seminal' means groundbreaking or highly influential — fitting for work "
                "that became the global standard despite early dismissal. 'Tenuous' means "
                "weak or flimsy. 'Contentious' means disputed or controversial. 'Redundant' "
                "means unnecessary or repetitive."
            ),
            "hint": "The findings are now standard worldwide — so they must have been very influential.",
        },

        {
            "id": "SAT-RW-WIC-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Words in Context",
            "subtopic": "Academic vocabulary",
            "difficulty": "easy",
            "tags": ["vocabulary"],
            "passage": (
                "The journalist's account was praised for its ________ reporting: every "
                "claim was supported by multiple independent sources and verifiable data."
            ),
            "question": "Which word best completes the text?",
            "options": {
                "A": "speculative",
                "B": "impassioned",
                "C": "rigorous",
                "D": "ambiguous",
            },
            "answer": "C",
            "explanation": (
                "'Rigorous' means thorough, detailed, and careful — perfectly matching a "
                "report where every claim is verified. 'Speculative' means based on guesswork, "
                "opposite of verified. 'Impassioned' means emotional, unrelated to verifiability. "
                "'Ambiguous' means unclear."
            ),
            "hint": "The passage praises the journalist for verifying every claim — what word describes careful, thorough work?",
        },

        {
            "id": "SAT-RW-WIC-003",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Words in Context",
            "subtopic": "Contrast clues",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "Although the professor's lecture was intended to ________ the complex "
                "topic for first-year students, many left the hall more confused than when "
                "they arrived."
            ),
            "question": "Which word best completes the text?",
            "options": {
                "A": "obscure",
                "B": "complicate",
                "C": "illuminate",
                "D": "validate",
            },
            "answer": "C",
            "explanation": (
                "The word 'although' signals a contrast: the intention was the opposite of "
                "the actual outcome (confusion). So the intention must have been to make the "
                "topic clearer — 'illuminate.' 'Obscure' and 'complicate' match the outcome, "
                "not the intention. 'Validate' means to confirm, not clarify."
            ),
            "hint": "'Although' tells you the intention was the opposite of confusing.",
        },

        {
            "id": "SAT-RW-WIC-004",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Words in Context",
            "subtopic": "Tone matching",
            "difficulty": "medium",
            "tags": ["tricky"],
            "passage": (
                "The committee's decision was met with ________ from community members who "
                "had spent months advocating for the opposing policy."
            ),
            "question": "Which word best completes the text?",
            "options": {
                "A": "indifference",
                "B": "consternation",
                "C": "admiration",
                "D": "amusement",
            },
            "answer": "B",
            "explanation": (
                "'Consternation' means dismay or distress — appropriate for people who had "
                "spent months fighting for the opposite outcome. 'Indifference' means they "
                "would not care (contradicts 'months of advocacy'). 'Admiration' and 'amusement' "
                "suggest positive/neutral reactions, not fitting."
            ),
            "hint": "People who spent months fighting for something and lost would feel dismayed.",
        },

        {
            "id": "SAT-RW-WIC-005",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Words in Context",
            "subtopic": "Advanced vocabulary",
            "difficulty": "hard",
            "tags": ["important", "vocabulary"],
            "passage": (
                "Historians have long debated whether the emperor's seemingly magnanimous "
                "gestures toward conquered territories were genuinely ________ or merely "
                "calculated to suppress rebellion."
            ),
            "question": "Which word best completes the text?",
            "options": {
                "A": "altruistic",
                "B": "perfunctory",
                "C": "belligerent",
                "D": "inscrutable",
            },
            "answer": "A",
            "explanation": (
                "The debate is between genuine good intent vs. political calculation. "
                "'Altruistic' (selflessly generous) is the genuine motive being questioned. "
                "'Perfunctory' means done without care — doesn't fit the dichotomy. "
                "'Belligerent' means aggressive, contradicting 'magnanimous gestures.' "
                "'Inscrutable' means mysterious — not a motive."
            ),
            "hint": "What quality would make a gesture toward conquered territories genuine rather than political?",
        },

        {
            "id": "SAT-RW-WIC-006",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Words in Context",
            "subtopic": "Scientific context",
            "difficulty": "hard",
            "tags": ["tricky", "pyq"],
            "passage": (
                "The enzyme's catalytic activity was highly ________ — even minor changes "
                "in pH or temperature caused dramatic shifts in reaction rate, making the "
                "compound difficult to use in industrial processes."
            ),
            "question": "Which word best completes the text?",
            "options": {
                "A": "robust",
                "B": "labile",
                "C": "inert",
                "D": "prolific",
            },
            "answer": "B",
            "explanation": (
                "'Labile' means unstable or readily altered — exactly what is described "
                "(minor changes cause dramatic effects). 'Robust' means strong and stable, "
                "the opposite. 'Inert' means unreactive — it clearly reacts. 'Prolific' "
                "means producing a lot, unrelated to stability."
            ),
            "hint": "The enzyme reacts dramatically to even minor changes — what word means easily altered?",
        },

        # ── TOPIC: Transitions ─────────────────────────────────

        {
            "id": "SAT-RW-TR-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Transitions",
            "subtopic": "Contrast",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": (
                "Early studies suggested that sleep deprivation had only minor effects on "
                "cognitive performance. ________, subsequent research using more rigorous "
                "methods found significant impairments in memory consolidation and decision-"
                "making after even one night of poor sleep."
            ),
            "question": "Which choice completes the text with the most logical transition?",
            "options": {
                "A": "Therefore",
                "B": "Similarly",
                "C": "However",
                "D": "Consequently",
            },
            "answer": "C",
            "explanation": (
                "The second sentence contradicts the first ('minor effects' vs. 'significant "
                "impairments'). A contrast transition is needed. 'However' correctly signals "
                "contrast. 'Therefore' and 'Consequently' signal cause-effect. 'Similarly' "
                "signals agreement — the opposite of what is needed."
            ),
            "hint": "The two sentences say opposite things — which word shows contrast?",
        },

        {
            "id": "SAT-RW-TR-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Transitions",
            "subtopic": "Cause and effect",
            "difficulty": "easy",
            "tags": [],
            "passage": (
                "The company invested heavily in employee wellness programs, including on-site "
                "gyms and mental health support. ________, absenteeism dropped by 18% over the "
                "following year."
            ),
            "question": "Which choice completes the text with the most logical transition?",
            "options": {
                "A": "Nevertheless",
                "B": "In contrast",
                "C": "As a result",
                "D": "For instance",
            },
            "answer": "C",
            "explanation": (
                "The second sentence describes the direct outcome of the investment described "
                "in the first. 'As a result' correctly signals a cause-effect relationship. "
                "'Nevertheless' and 'In contrast' signal contrast. 'For instance' signals an "
                "example, not a result."
            ),
            "hint": "The lower absenteeism happened because of the investment — what transition shows cause-effect?",
        },

        {
            "id": "SAT-RW-TR-003",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Transitions",
            "subtopic": "Adding information",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "The novel introduced several experimental narrative techniques, including "
                "an unreliable narrator and non-linear chronology. ________, the author "
                "chose to omit chapter numbers, forcing readers to piece together the timeline."
            ),
            "question": "Which choice completes the text with the most logical transition?",
            "options": {
                "A": "However",
                "B": "In addition",
                "C": "Therefore",
                "D": "On the other hand",
            },
            "answer": "B",
            "explanation": (
                "The second sentence adds another experimental technique (omitting chapter "
                "numbers) to the list introduced in the first. 'In addition' correctly signals "
                "additional supporting information. 'However' and 'On the other hand' signal "
                "contrast. 'Therefore' signals a conclusion/result."
            ),
            "hint": "Both sentences describe experimental choices the author made — they're on the same side.",
        },

        {
            "id": "SAT-RW-TR-004",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Transitions",
            "subtopic": "Concession",
            "difficulty": "medium",
            "tags": ["tricky"],
            "passage": (
                "Renewable energy sources like solar and wind are intermittent by nature. "
                "________, advances in battery storage technology have made it increasingly "
                "feasible to rely on them as primary energy sources."
            ),
            "question": "Which choice completes the text with the most logical transition?",
            "options": {
                "A": "As a result",
                "B": "Similarly",
                "C": "Even so",
                "D": "That is",
            },
            "answer": "C",
            "explanation": (
                "The structure is: 'X is a problem. [transition] Y overcomes it.' This requires "
                "a concession word — acknowledging the problem while saying something positive "
                "persists. 'Even so' (meaning 'despite this') fits perfectly. 'As a result' "
                "would say battery tech exists because of intermittency, which is illogical. "
                "'Similarly' and 'That is' don't fit the contrast."
            ),
            "hint": "The second sentence overcomes the limitation in the first — which word means 'despite this'?",
        },

        {
            "id": "SAT-RW-TR-005",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Transitions",
            "subtopic": "Exemplification",
            "difficulty": "hard",
            "tags": ["pyq"],
            "passage": (
                "Many ancient civilizations developed strikingly similar architectural features "
                "independently of one another. ________, both the Egyptians and the Maya "
                "constructed large stone pyramid structures, despite having had no known contact."
            ),
            "question": "Which choice completes the text with the most logical transition?",
            "options": {
                "A": "Consequently",
                "B": "Nonetheless",
                "C": "For example",
                "D": "Furthermore",
            },
            "answer": "C",
            "explanation": (
                "The second sentence provides a specific example (Egyptians and Maya) to "
                "support the general claim in the first sentence. 'For example' introduces "
                "a specific illustration. 'Consequently' implies the pyramids are a result "
                "of similarity (illogical). 'Nonetheless' implies contrast. 'Furthermore' "
                "adds a new point, but the second sentence is specifically an example."
            ),
            "hint": "The Egyptians and Maya are a specific case that proves the general claim in sentence one.",
        },

        # ── TOPIC: Standard English Conventions (Boundaries) ──

        {
            "id": "SAT-RW-BND-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Boundaries",
            "subtopic": "Run-on sentences",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": None,
            "question": (
                "Which choice correctly combines the two sentences?\n"
                "Sentence 1: The team worked through the night.\n"
                "Sentence 2: They finished the project before the deadline."
            ),
            "options": {
                "A": "The team worked through the night, they finished the project before the deadline.",
                "B": "The team worked through the night; they finished the project before the deadline.",
                "C": "The team worked through the night they finished the project before the deadline.",
                "D": "The team worked through the night, and finishing the project before the deadline.",
            },
            "answer": "B",
            "explanation": (
                "Option A is a comma splice (two independent clauses joined only by a comma). "
                "Option C is a run-on with no punctuation. Option D creates a mismatched "
                "structure ('finishing' doesn't match 'worked'). Option B correctly uses a "
                "semicolon to join two independent clauses."
            ),
            "hint": "Two complete sentences need more than just a comma between them.",
        },

        {
            "id": "SAT-RW-BND-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Boundaries",
            "subtopic": "Punctuation with clauses",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "The new policy applies to all employees ________ those who were hired before 2020 "
                "are exempt from the mandatory training requirement."
            ),
            "question": "Which punctuation correctly completes the sentence?",
            "options": {
                "A": "employees, those",
                "B": "employees; those",
                "C": "employees: those",
                "D": "employees those",
            },
            "answer": "B",
            "explanation": (
                "Both parts are independent clauses (each can stand alone as a sentence). "
                "A semicolon correctly joins two related independent clauses. A comma alone "
                "(A) creates a comma splice. A colon (C) is used to introduce a list or "
                "explanation, not typically two equal independent clauses. Option D is a run-on."
            ),
            "hint": "Both halves could be separate sentences — what joins two independent clauses?",
        },

        {
            "id": "SAT-RW-BND-003",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Boundaries",
            "subtopic": "Subordinate clauses",
            "difficulty": "medium",
            "tags": [],
            "passage": (
                "________ the experiment produced unexpected results, the researchers decided "
                "to repeat it under controlled conditions before publishing their findings."
            ),
            "question": "Which choice correctly completes the sentence?",
            "options": {
                "A": "Because",
                "B": "Although",
                "C": "However",
                "D": "Therefore",
            },
            "answer": "A",
            "explanation": (
                "The sentence describes a reason (unexpected results) followed by an action "
                "(repeat the experiment). 'Because' correctly introduces a subordinate clause "
                "explaining why. 'Although' would imply a contrast that doesn't exist here. "
                "'However' and 'Therefore' are conjunctive adverbs, not subordinating "
                "conjunctions — they can't open a dependent clause."
            ),
            "hint": "The unexpected results are the reason for repeating the experiment.",
        },

        {
            "id": "SAT-RW-BND-004",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Boundaries",
            "subtopic": "Colon usage",
            "difficulty": "hard",
            "tags": ["tricky"],
            "passage": None,
            "question": (
                "Which sentence correctly uses a colon?\n"
            ),
            "options": {
                "A": "The report highlighted: several key areas for improvement.",
                "B": "She excelled in: math, science, and history.",
                "C": "The package contained three items: a book, a pen, and a notepad.",
                "D": "He decided: to leave early and avoid the traffic.",
            },
            "answer": "C",
            "explanation": (
                "A colon must follow a grammatically complete independent clause. In C, "
                "'The package contained three items' is a complete clause, and the colon "
                "introduces the list. In A and B, the colon interrupts the verb phrase "
                "('highlighted:' and 'excelled in:' — incomplete). In D, the colon "
                "interrupts the verb 'decided' before its object."
            ),
            "hint": "A colon must follow a COMPLETE sentence — not interrupt a verb or phrase.",
        },

        # ── TOPIC: Form, Structure & Sense ────────────────────

        {
            "id": "SAT-RW-FSS-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Form, Structure & Sense",
            "subtopic": "Subject-verb agreement",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": None,
            "question": (
                "Which choice correctly completes the sentence?\n"
                "'Neither the project lead nor the two junior analysts ________ the final "
                "draft before submission.'"
            ),
            "options": {
                "A": "has reviewed",
                "B": "have reviewed",
                "C": "was reviewing",
                "D": "reviews",
            },
            "answer": "B",
            "explanation": (
                "With 'neither...nor', the verb agrees with the subject closest to it "
                "(the 'or rule'). 'The two junior analysts' is plural, so 'have reviewed' "
                "is correct. If the order were reversed ('neither the analysts nor the lead'), "
                "it would be 'has reviewed'. 'Was reviewing' and 'reviews' are wrong tense/form."
            ),
            "hint": "With 'neither...nor', look at the noun CLOSEST to the verb.",
        },

        {
            "id": "SAT-RW-FSS-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Form, Structure & Sense",
            "subtopic": "Verb tense",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "By the time the delegates arrived at the summit, the host country ________ "
                "all the logistical arrangements for the three-day conference."
            ),
            "question": "Which choice correctly completes the sentence?",
            "options": {
                "A": "finalized",
                "B": "has finalized",
                "C": "had finalized",
                "D": "was finalizing",
            },
            "answer": "C",
            "explanation": (
                "'By the time' signals that one past action was completed before another "
                "past action. The past perfect tense ('had finalized') is required for the "
                "action that happened first (finalizing arrangements) before the delegates "
                "arrived. Simple past 'finalized' misses the sequence. 'Has finalized' is "
                "present perfect. 'Was finalizing' implies it was still in progress."
            ),
            "hint": "'By the time [past action]' — the other action was already done before that.",
        },

        {
            "id": "SAT-RW-FSS-003",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Form, Structure & Sense",
            "subtopic": "Pronoun agreement",
            "difficulty": "medium",
            "tags": ["tricky"],
            "passage": (
                "Each of the participants must submit ________ completed consent form before "
                "the study begins."
            ),
            "question": "Which choice correctly completes the sentence?",
            "options": {
                "A": "their",
                "B": "our",
                "C": "its",
                "D": "his or her",
            },
            "answer": "A",
            "explanation": (
                "On the SAT, 'their' is accepted as a singular gender-neutral pronoun and "
                "is the preferred modern usage. 'Each' is the subject — technically singular, "
                "but 'their' is now standard. 'Its' would refer to an object, not a person. "
                "'Our' is wrong (first person). 'His or her' is grammatically old-fashioned "
                "and wordy — the SAT prefers 'their'."
            ),
            "hint": "The SAT accepts 'their' as a gender-neutral singular pronoun — prefer it over 'his or her'.",
        },

        {
            "id": "SAT-RW-FSS-004",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Form, Structure & Sense",
            "subtopic": "Modifier placement",
            "difficulty": "hard",
            "tags": ["tricky", "pyq"],
            "passage": None,
            "question": (
                "Which sentence correctly places the modifier?\n"
            ),
            "options": {
                "A": "Having studied for six hours, the exam seemed manageable to Maria.",
                "B": "The exam seemed manageable to Maria having studied for six hours.",
                "C": "Having studied for six hours, Maria found the exam manageable.",
                "D": "Maria, the exam seemed manageable, having studied for six hours.",
            },
            "answer": "C",
            "explanation": (
                "A dangling modifier occurs when the modifier's implied subject doesn't match "
                "the sentence subject. 'Having studied for six hours' describes Maria — so "
                "Maria must immediately follow the comma. In A, 'the exam' is the subject — "
                "the exam didn't study. B and D have misplacement issues. C correctly puts "
                "Maria right after the modifier."
            ),
            "hint": "Who studied for six hours? That person must come right after the opening phrase.",
        },

        # ── TOPIC: Rhetorical Synthesis ────────────────────────

        {
            "id": "SAT-RW-RS-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Rhetorical Synthesis",
            "subtopic": "Notes into argument",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "A student is writing a report about urban heat islands. The student has "
                "found the following notes:\n"
                "• Urban areas can be 1–7°F warmer than surrounding rural areas.\n"
                "• Dark surfaces like asphalt absorb and retain more heat than vegetation.\n"
                "• Trees in cities can reduce surface temperatures by up to 20°F through shade.\n"
                "• Some cities have introduced green roofs to combat the urban heat island effect."
            ),
            "question": (
                "Which sentence most effectively uses the notes to support the claim that "
                "vegetation can reduce urban heat?"
            ),
            "options": {
                "A": "Urban areas are often much warmer than rural areas due to dark surfaces.",
                "B": "Cities are warmer than rural areas by as much as 7 degrees.",
                "C": "Trees can lower surface temperatures by up to 20°F, and green roofs are increasingly used to combat urban heat.",
                "D": "Some cities have introduced green roofs to reduce temperatures.",
            },
            "answer": "C",
            "explanation": (
                "The question asks for evidence that vegetation reduces urban heat. Option C "
                "combines two relevant pieces of evidence: the 20°F temperature reduction from "
                "trees, and green roof adoption — both about vegetation. Option A focuses on "
                "dark surfaces. Option B describes the problem, not the solution. Option D is "
                "too narrow (only mentions green roofs, not trees)."
            ),
            "hint": "Find the option that uses the most evidence about vegetation specifically.",
        },

        {
            "id": "SAT-RW-RS-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Rhetorical Synthesis",
            "subtopic": "Combining information",
            "difficulty": "hard",
            "tags": ["pyq", "important"],
            "passage": (
                "A student is writing about the limitations of standardized testing. Notes:\n"
                "• Standardized tests measure a narrow set of skills (mainly verbal and mathematical).\n"
                "• Students from wealthier backgrounds score higher on average, partly due to test prep access.\n"
                "• Some studies show test scores correlate with college GPA.\n"
                "• Howard Gardner's theory of multiple intelligences identifies 8 types of intelligence."
            ),
            "question": (
                "Which sentence most effectively uses the notes to argue that standardized tests "
                "may not capture a student's full potential?"
            ),
            "options": {
                "A": "Test scores have been shown to correlate with college GPA in some studies.",
                "B": "Because standardized tests focus mainly on verbal and mathematical skills, they may overlook the range of intelligences Gardner identified.",
                "C": "Wealthy students score higher partly because of access to test preparation.",
                "D": "Standardized tests are limited and should be abolished.",
            },
            "answer": "B",
            "explanation": (
                "The question asks for an argument that tests miss students' full potential. "
                "Option B directly links the narrow focus of tests with Gardner's 8 intelligences "
                "— showing the gap between what tests measure and the full range of human ability. "
                "Option A actually supports tests. Option C is about fairness (a different argument). "
                "Option D makes a claim without using the notes as evidence."
            ),
            "hint": "Combine the note about narrow skill measurement with Gardner's multiple intelligences.",
        },

        # ── TOPIC: Central Ideas & Details ────────────────────

        {
            "id": "SAT-RW-CID-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Central Ideas & Details",
            "subtopic": "Main idea",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": (
                "Mycorrhizal fungi form symbiotic relationships with plant roots, extending "
                "the root system's reach and allowing plants to absorb more water and nutrients "
                "from the soil. In exchange, plants supply the fungi with sugars produced through "
                "photosynthesis. This mutual exchange has been found to be so beneficial that "
                "plants connected to mycorrhizal networks often outgrow isolated plants by a "
                "significant margin."
            ),
            "question": "Which choice best states the main idea of the text?",
            "options": {
                "A": "Fungi can harm plant root systems if not properly managed.",
                "B": "Plants and mycorrhizal fungi both benefit from their symbiotic relationship.",
                "C": "Photosynthesis provides essential nutrients for soil organisms.",
                "D": "Mycorrhizal networks allow plants to communicate with one another.",
            },
            "answer": "B",
            "explanation": (
                "The passage describes a mutual exchange: fungi help plants absorb water/nutrients; "
                "plants give fungi sugars. The outcome (plants outgrow isolated ones) supports "
                "mutual benefit. Option A is wrong (the relationship is beneficial, not harmful). "
                "Option C reverses the relationship (plants give sugars to fungi, not to soil "
                "organisms generally). Option D about communication is not mentioned."
            ),
            "hint": "Both organisms gain something — what does that make the relationship?",
        },

        {
            "id": "SAT-RW-CID-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Central Ideas & Details",
            "subtopic": "Detail retrieval",
            "difficulty": "medium",
            "tags": [],
            "passage": (
                "The Cassini spacecraft, launched in 1997 and arriving at Saturn in 2004, "
                "spent 13 years orbiting the planet and its moons. Among its most significant "
                "discoveries was the detection of a saltwater ocean beneath the icy crust of "
                "Enceladus — a moon of Saturn — along with hydrothermal vents that could "
                "potentially support microbial life. The mission ended in 2017 when the spacecraft "
                "was intentionally plunged into Saturn's atmosphere to avoid contaminating "
                "its moons."
            ),
            "question": "According to the text, why was Cassini directed into Saturn's atmosphere?",
            "options": {
                "A": "It had run out of fuel and could no longer maintain orbit.",
                "B": "Scientists wanted to collect data on Saturn's atmosphere.",
                "C": "The mission's goals had been fully completed ahead of schedule.",
                "D": "To prevent it from potentially contaminating Saturn's moons.",
            },
            "answer": "D",
            "explanation": (
                "The passage states the mission ended when the spacecraft was 'intentionally "
                "plunged into Saturn's atmosphere to avoid contaminating its moons.' This "
                "directly supports Option D. The passage does not mention running out of fuel "
                "(A), atmosphere data collection (B), or an early completion (C)."
            ),
            "hint": "The answer is stated directly in the last sentence.",
        },

        # ── TOPIC: Inferences ─────────────────────────────────

        {
            "id": "SAT-RW-INF-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Inferences",
            "subtopic": "Drawing conclusions",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "In a study of 1,200 adults, participants who reported sleeping fewer than "
                "6 hours per night had a 48% higher rate of heart disease than those sleeping "
                "7–9 hours. However, the study also found that participants who slept more "
                "than 9 hours had a 38% higher rate of heart disease than the optimal group."
            ),
            "question": "Which inference is best supported by the text?",
            "options": {
                "A": "Sleeping more is always better for heart health than sleeping less.",
                "B": "Both too little and too much sleep are associated with increased heart disease risk.",
                "C": "Heart disease is caused primarily by poor sleep habits.",
                "D": "Adults should aim to sleep exactly 8 hours per night.",
            },
            "answer": "B",
            "explanation": (
                "The passage shows elevated heart disease in both the under-6-hours group "
                "AND the over-9-hours group, compared to the 7–9-hour optimal group. Option "
                "B correctly captures both findings. Option A is wrong (too much sleep is also "
                "linked to higher risk). Option C uses 'caused by' — the study shows association, "
                "not causation. Option D (exactly 8 hours) is not stated."
            ),
            "hint": "Look at both data points — the short AND long sleepers both had elevated rates.",
        },

        {
            "id": "SAT-RW-INF-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Inferences",
            "subtopic": "Author's perspective",
            "difficulty": "hard",
            "tags": ["tricky", "pyq"],
            "passage": (
                "Dr. Elias Marchetti has argued that modern architecture's emphasis on "
                "glass-and-steel uniformity has stripped cities of the cultural character "
                "that once made them distinct. He notes that a visitor to any major financial "
                "district in the world today would struggle to determine which country they were "
                "in based on architecture alone — an observation he considers deeply troubling."
            ),
            "question": "Which inference about Marchetti's view is best supported?",
            "options": {
                "A": "He believes all modern architecture should be demolished.",
                "B": "He thinks architectural variety is valuable for cultural identity.",
                "C": "He favors glass-and-steel buildings for their efficiency.",
                "D": "He believes the uniformity of modern cities is an inevitable trend.",
            },
            "answer": "B",
            "explanation": (
                "Marchetti finds it 'deeply troubling' that cities look the same — implying "
                "he values the cultural distinctiveness that architectural diversity provided. "
                "Option A is too extreme (he criticizes the trend, not calls for demolition). "
                "Option C is the opposite of his view. Option D presents uniformity as "
                "inevitable — Marchetti frames it as a problem worth addressing, not accepting."
            ),
            "hint": "What does Marchetti value, based on what he finds 'troubling'?",
        },

        # ── TOPIC: Command of Evidence ─────────────────────────

        {
            "id": "SAT-RW-COE-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Command of Evidence",
            "subtopic": "Quantitative evidence",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "A researcher claims that urban forests significantly improve air quality. "
                "A city survey found the following particulate matter levels (PM2.5, µg/m³):\n"
                "• Area with dense tree cover: 8.2\n"
                "• Area with moderate tree cover: 14.6\n"
                "• Area with no tree cover: 22.4"
            ),
            "question": "Which finding from the table most directly supports the researcher's claim?",
            "options": {
                "A": "Particulate matter levels were highest in areas with no tree cover.",
                "B": "Dense tree cover areas had PM2.5 levels 63% lower than no-cover areas.",
                "C": "The difference between moderate and dense cover areas was 6.4 µg/m³.",
                "D": "All areas surveyed had PM2.5 levels below 25 µg/m³.",
            },
            "answer": "B",
            "explanation": (
                "The claim is that urban forests 'significantly' improve air quality. Option B "
                "quantifies the improvement directly (63% lower PM2.5 with dense trees vs. none) "
                "— making the strongest, most specific case. Option A shows a correlation but "
                "doesn't quantify the improvement. Option C describes a smaller difference within "
                "the data. Option D suggests all levels are relatively low and doesn't support "
                "the claim."
            ),
            "hint": "The strongest evidence uses a specific number to show HOW MUCH improvement there is.",
        },

        # ── TOPIC: Text Structure & Purpose ───────────────────

        {
            "id": "SAT-RW-TSP-001",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Text Structure & Purpose",
            "subtopic": "Overall structure",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "For decades, the prevailing view was that dinosaurs were cold-blooded, "
                "slow-moving creatures similar to modern reptiles. This view began to shift "
                "in the 1970s when paleontologist Robert Bakker proposed that many dinosaurs "
                "were warm-blooded and far more active. Subsequent fossil evidence — including "
                "bone growth patterns consistent with rapid, sustained growth — has lent "
                "significant support to this revised understanding."
            ),
            "question": "Which choice best describes the overall structure of the text?",
            "options": {
                "A": "A hypothesis is proposed and then immediately disproven.",
                "B": "A scientific consensus is challenged, and subsequent evidence supports the new view.",
                "C": "Two competing theories are presented without a conclusion.",
                "D": "A scientist's biography is used to illustrate a broader concept.",
            },
            "answer": "B",
            "explanation": (
                "The passage moves from old consensus (cold-blooded) → Bakker's challenge → "
                "supporting evidence (bone growth). This is clearly: established view challenged, "
                "then supported by new evidence. Option A is wrong (the old hypothesis was "
                "challenged, not immediately disproven in the text). Option C is wrong (evidence "
                "supports the new view). Option D is wrong (Bakker is mentioned briefly, not "
                "biographically)."
            ),
            "hint": "Trace the structure: old view → new challenge → evidence for new view.",
        },

        {
            "id": "SAT-RW-TSP-002",
            "exam": "SAT",
            "section": "Reading & Writing",
            "topic": "Text Structure & Purpose",
            "subtopic": "Function of a sentence",
            "difficulty": "hard",
            "tags": ["tricky"],
            "passage": (
                "Proponents of universal basic income (UBI) argue that it would eliminate "
                "poverty and reduce inequality. Critics, however, warn that it could disincentivize "
                "work and place an unsustainable burden on government budgets. Pilot programs "
                "in Finland and Kenya have shown mixed results, with participants reporting "
                "improved wellbeing but employment effects remaining ambiguous."
            ),
            "question": "What is the primary function of the final sentence?",
            "options": {
                "A": "It conclusively supports the proponents' argument.",
                "B": "It provides evidence that undermines the critics' concern about disincentivizing work.",
                "C": "It introduces real-world evidence that complicates the debate without fully resolving it.",
                "D": "It shifts the focus from economic theory to social outcomes.",
            },
            "answer": "C",
            "explanation": (
                "The final sentence cites pilot programs with 'mixed results' — improved wellbeing "
                "(supports proponents somewhat) but 'ambiguous' employment effects (doesn't resolve "
                "critics' concern). It adds evidence that makes the debate more complex, not simpler. "
                "Option A is wrong ('mixed results'). Option B is wrong ('ambiguous' employment "
                "effects don't undermine critics' concern). Option D is partially true but misses "
                "the structural role of introducing inconclusive evidence."
            ),
            "hint": "'Mixed results' and 'ambiguous' — what do those words tell you about the sentence's function?",
        },


        # ══════════════════════════════════════════════════════════
        # SECTION 2 — MATH
        # ══════════════════════════════════════════════════════════

    ],

    "Math": [

        # ── TOPIC: Linear Equations ────────────────────────────

        {
            "id": "SAT-M-LE-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Equations",
            "subtopic": "Solve for variable",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": None,
            "question": "If 3x + 7 = 22, what is the value of 6x − 4?",
            "options": {
                "A": "5",
                "B": "16",
                "C": "26",
                "D": "30",
            },
            "answer": "C",
            "explanation": (
                "Step 1: 3x + 7 = 22 → 3x = 15 → x = 5.\n"
                "Step 2: Substitute x = 5 into 6x − 4 = 6(5) − 4 = 30 − 4 = 26.\n"
                "Answer: C (26)."
            ),
            "hint": "First solve for x, then substitute into the new expression.",
        },

        {
            "id": "SAT-M-LE-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Equations",
            "subtopic": "Word problem",
            "difficulty": "easy",
            "tags": [],
            "passage": None,
            "question": (
                "A taxi charges a flat fee of $3 plus $1.50 per mile. If a customer's total "
                "bill is $16.50, how many miles did they travel?"
            ),
            "options": {
                "A": "7",
                "B": "9",
                "C": "11",
                "D": "13",
            },
            "answer": "B",
            "explanation": (
                "Set up: 3 + 1.5m = 16.50.\n"
                "1.5m = 13.50.\n"
                "m = 9.\n"
                "The customer traveled 9 miles."
            ),
            "hint": "Flat fee plus rate times miles equals total — set up and solve.",
        },

        {
            "id": "SAT-M-LE-003",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Equations",
            "subtopic": "Variables on both sides",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": "If 5(x − 3) = 2x + 9, what is the value of x?",
            "options": {
                "A": "4",
                "B": "6",
                "C": "8",
                "D": "10",
            },
            "answer": "C",
            "explanation": (
                "Expand: 5x − 15 = 2x + 9.\n"
                "3x = 24.\n"
                "x = 8."
            ),
            "hint": "Distribute first, then collect x terms on one side.",
        },

        {
            "id": "SAT-M-LE-004",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Equations",
            "subtopic": "Equation of a line",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": (
                "A line passes through the points (2, 5) and (6, 13). What is the equation "
                "of this line?"
            ),
            "options": {
                "A": "y = x + 3",
                "B": "y = 2x + 1",
                "C": "y = 3x − 1",
                "D": "y = 2x + 3",
            },
            "answer": "B",
            "explanation": (
                "Slope = (13 − 5) / (6 − 2) = 8 / 4 = 2.\n"
                "Using point (2, 5): 5 = 2(2) + b → b = 1.\n"
                "Equation: y = 2x + 1."
            ),
            "hint": "Find the slope first using (y2−y1)/(x2−x1), then use one point to find b.",
        },

        {
            "id": "SAT-M-LE-005",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Equations",
            "subtopic": "Interpreting slope",
            "difficulty": "medium",
            "tags": ["pyq"],
            "passage": (
                "The number of bacteria in a culture is modeled by B = 200 + 50t, where "
                "B is the number of bacteria and t is time in hours."
            ),
            "question": "What does the 50 in the equation represent?",
            "options": {
                "A": "The initial number of bacteria",
                "B": "The number of bacteria after 50 hours",
                "C": "The rate at which bacteria increase per hour",
                "D": "The maximum number of bacteria",
            },
            "answer": "C",
            "explanation": (
                "In a linear equation B = 200 + 50t, the coefficient of t (which is 50) "
                "represents the rate of change — how much B increases for each 1-unit increase "
                "in t. So 50 bacteria are added per hour. 200 is the initial value (t=0). "
                "There is no maximum in a linear model."
            ),
            "hint": "In y = mx + b, m is the rate of change (slope). What does that mean in context?",
        },

        {
            "id": "SAT-M-LE-006",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Equations",
            "subtopic": "Absolute value equations",
            "difficulty": "hard",
            "tags": ["tricky"],
            "passage": None,
            "question": "How many solutions does |2x − 6| = 4 have?",
            "options": {
                "A": "0",
                "B": "1",
                "C": "2",
                "D": "Infinitely many",
            },
            "answer": "C",
            "explanation": (
                "An absolute value equation |expression| = positive number always has two cases:\n"
                "Case 1: 2x − 6 = 4 → 2x = 10 → x = 5.\n"
                "Case 2: 2x − 6 = −4 → 2x = 2 → x = 1.\n"
                "Two solutions: x = 5 and x = 1."
            ),
            "hint": "|expression| = k creates two equations: expression = k AND expression = -k.",
        },

        # ── TOPIC: Systems of Linear Equations ────────────────

        {
            "id": "SAT-M-SLE-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Systems of Linear Equations",
            "subtopic": "Substitution",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": None,
            "question": (
                "If y = 2x + 3 and y = 5x − 9, what is the value of x?"
            ),
            "options": {
                "A": "2",
                "B": "3",
                "C": "4",
                "D": "5",
            },
            "answer": "C",
            "explanation": (
                "Since both expressions equal y, set them equal:\n"
                "2x + 3 = 5x − 9\n"
                "12 = 3x\n"
                "x = 4."
            ),
            "hint": "Both equal y, so set the right-hand sides equal to each other.",
        },

        {
            "id": "SAT-M-SLE-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Systems of Linear Equations",
            "subtopic": "Elimination",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": (
                "Solve the system:\n"
                "3x + 2y = 16\n"
                "5x − 2y = 8\n"
                "What is the value of x?"
            ),
            "options": {
                "A": "2",
                "B": "3",
                "C": "4",
                "D": "5",
            },
            "answer": "B",
            "explanation": (
                "Add the two equations to eliminate y:\n"
                "8x = 24 → x = 3.\n"
                "Check: 3(3) + 2y = 16 → 9 + 2y = 16 → y = 3.5."
            ),
            "hint": "Adding the equations eliminates y because +2y and -2y cancel.",
        },

        {
            "id": "SAT-M-SLE-003",
            "exam": "SAT",
            "section": "Math",
            "topic": "Systems of Linear Equations",
            "subtopic": "No solution / infinite solutions",
            "difficulty": "hard",
            "tags": ["tricky", "pyq"],
            "passage": None,
            "question": (
                "For which value of k does the system have no solution?\n"
                "2x + 4y = 8\n"
                "x + 2y = k"
            ),
            "options": {
                "A": "k = 4",
                "B": "k = 6",
                "C": "k = 3",
                "D": "Any value of k",
            },
            "answer": "C",
            "explanation": (
                "Rewrite Equation 1: divide by 2 → x + 2y = 4.\n"
                "Equation 2 is: x + 2y = k.\n"
                "These are parallel lines (same coefficients) — they have NO solution when k ≠ 4.\n"
                "They have INFINITE solutions when k = 4.\n"
                "So for NO solution, k can be anything ≠ 4. Among the options, k = 3 is the only "
                "value ≠ 4."
            ),
            "hint": "When two equations have identical left-hand sides but different right-hand sides, there's no solution.",
        },

        # ── TOPIC: Linear Inequalities ─────────────────────────

        {
            "id": "SAT-M-LI-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Inequalities",
            "subtopic": "Solve inequality",
            "difficulty": "easy",
            "tags": [],
            "passage": None,
            "question": "Which value of x satisfies 4x − 5 > 11?",
            "options": {
                "A": "x = 3",
                "B": "x = 4",
                "C": "x = 5",
                "D": "x = 2",
            },
            "answer": "C",
            "explanation": (
                "4x − 5 > 11 → 4x > 16 → x > 4.\n"
                "Among the options, only x = 5 satisfies x > 4."
            ),
            "hint": "Solve the inequality for x, then check which option falls in the valid range.",
        },

        {
            "id": "SAT-M-LI-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Linear Inequalities",
            "subtopic": "Flip sign with negative",
            "difficulty": "medium",
            "tags": ["important", "tricky"],
            "passage": None,
            "question": "If −3x + 6 ≤ 0, which of the following must be true?",
            "options": {
                "A": "x ≤ 2",
                "B": "x ≥ 2",
                "C": "x ≤ −2",
                "D": "x ≥ −2",
            },
            "answer": "B",
            "explanation": (
                "−3x + 6 ≤ 0\n"
                "−3x ≤ −6\n"
                "Dividing by −3 FLIPS the inequality: x ≥ 2."
            ),
            "hint": "Dividing or multiplying both sides of an inequality by a NEGATIVE number flips the sign.",
        },

        # ── TOPIC: Quadratic Functions ─────────────────────────

        {
            "id": "SAT-M-QF-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Quadratic Functions",
            "subtopic": "Discriminant",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": "The function f(x) = x² − 6x + k has exactly one real root. What is the value of k?",
            "options": {
                "A": "3",
                "B": "6",
                "C": "9",
                "D": "12",
            },
            "answer": "C",
            "explanation": (
                "For exactly one real root, the discriminant = 0.\n"
                "Discriminant = b² − 4ac = (−6)² − 4(1)(k) = 36 − 4k = 0\n"
                "4k = 36 → k = 9."
            ),
            "hint": "One real root means discriminant = 0. Discriminant = b² − 4ac.",
        },

        {
            "id": "SAT-M-QF-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Quadratic Functions",
            "subtopic": "Factoring",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": "What are the solutions to x² − 5x + 6 = 0?",
            "options": {
                "A": "x = 1, x = 6",
                "B": "x = 2, x = 3",
                "C": "x = −2, x = −3",
                "D": "x = −1, x = 6",
            },
            "answer": "B",
            "explanation": (
                "Factor: (x − 2)(x − 3) = 0.\n"
                "x − 2 = 0 → x = 2\n"
                "x − 3 = 0 → x = 3.\n"
                "Check: 2 × 3 = 6 ✓ and 2 + 3 = 5 ✓."
            ),
            "hint": "Find two numbers that multiply to +6 and add to −5.",
        },

        {
            "id": "SAT-M-QF-003",
            "exam": "SAT",
            "section": "Math",
            "topic": "Quadratic Functions",
            "subtopic": "Vertex form",
            "difficulty": "hard",
            "tags": ["pyq"],
            "passage": None,
            "question": (
                "The function f(x) = (x − 3)² + 4 is graphed in the xy-plane. "
                "Which of the following is true about the graph?"
            ),
            "options": {
                "A": "The parabola has vertex (3, 4) and opens downward.",
                "B": "The parabola has vertex (−3, 4) and opens upward.",
                "C": "The parabola has vertex (3, 4) and opens upward.",
                "D": "The parabola has vertex (3, −4) and opens upward.",
            },
            "answer": "C",
            "explanation": (
                "Vertex form: f(x) = a(x − h)² + k, where (h, k) is the vertex.\n"
                "Here h = 3, k = 4 → vertex is (3, 4).\n"
                "Since a = 1 > 0, the parabola opens upward."
            ),
            "hint": "In f(x) = a(x−h)² + k, the vertex is (h, k). Positive a = opens up.",
        },

        {
            "id": "SAT-M-QF-004",
            "exam": "SAT",
            "section": "Math",
            "topic": "Quadratic Functions",
            "subtopic": "Quadratic formula",
            "difficulty": "hard",
            "tags": ["important"],
            "passage": None,
            "question": "What is the sum of all solutions to 2x² − 8x + 6 = 0?",
            "options": {
                "A": "1",
                "B": "2",
                "C": "3",
                "D": "4",
            },
            "answer": "D",
            "explanation": (
                "Divide by 2: x² − 4x + 3 = 0.\n"
                "Factor: (x − 1)(x − 3) = 0 → x = 1 or x = 3.\n"
                "Sum = 1 + 3 = 4.\n\n"
                "Shortcut (Vieta's formulas): sum of roots = −b/a = −(−4)/1 = 4."
            ),
            "hint": "Sum of roots of ax²+bx+c = 0 is always −b/a (Vieta's formula).",
        },

        # ── TOPIC: Exponential Functions ───────────────────────

        {
            "id": "SAT-M-EF-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Exponential Functions",
            "subtopic": "Growth and decay",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "A population of bacteria doubles every 3 hours. Initially there are 500 bacteria."
            ),
            "question": "How many bacteria will there be after 12 hours?",
            "options": {
                "A": "2,000",
                "B": "4,000",
                "C": "8,000",
                "D": "16,000",
            },
            "answer": "C",
            "explanation": (
                "Number of 3-hour periods in 12 hours = 12/3 = 4.\n"
                "Population = 500 × 2⁴ = 500 × 16 = 8,000."
            ),
            "hint": "How many doubling periods fit in 12 hours? Then apply 2 raised to that power.",
        },

        {
            "id": "SAT-M-EF-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Exponential Functions",
            "subtopic": "Exponential decay",
            "difficulty": "hard",
            "tags": ["pyq"],
            "passage": None,
            "question": (
                "The value of a car depreciates by 15% each year. If the car was worth $20,000 "
                "when new, which expression gives its value after t years?"
            ),
            "options": {
                "A": "20,000(0.85)ᵗ",
                "B": "20,000(1.15)ᵗ",
                "C": "20,000 − 15t",
                "D": "20,000(0.15)ᵗ",
            },
            "answer": "A",
            "explanation": (
                "Depreciation of 15% means the car RETAINS 85% (100% − 15%) of its value each year.\n"
                "After t years: Value = 20,000 × (0.85)ᵗ.\n"
                "Option B models growth (not decay). Option C is linear (not exponential). "
                "Option D would approach zero far too fast."
            ),
            "hint": "If something decreases by 15%, it keeps 85% each period — use 0.85 as the base.",
        },

        # ── TOPIC: Equivalent Expressions ─────────────────────

        {
            "id": "SAT-M-EE-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Equivalent Expressions",
            "subtopic": "Polynomial simplification",
            "difficulty": "easy",
            "tags": [],
            "passage": None,
            "question": "Which expression is equivalent to (2x + 3)(x − 5)?",
            "options": {
                "A": "2x² − 7x − 15",
                "B": "2x² + 7x − 15",
                "C": "2x² − 10x − 15",
                "D": "2x² − 7x + 15",
            },
            "answer": "A",
            "explanation": (
                "FOIL: (2x)(x) + (2x)(−5) + (3)(x) + (3)(−5)\n"
                "= 2x² − 10x + 3x − 15\n"
                "= 2x² − 7x − 15."
            ),
            "hint": "Use FOIL: First, Outer, Inner, Last. Then combine like terms.",
        },

        {
            "id": "SAT-M-EE-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Equivalent Expressions",
            "subtopic": "Rational expressions",
            "difficulty": "hard",
            "tags": ["tricky"],
            "passage": None,
            "question": (
                "Which expression is equivalent to (x² − 9) / (x − 3), for x ≠ 3?"
            ),
            "options": {
                "A": "x − 3",
                "B": "x + 3",
                "C": "x² − 3",
                "D": "(x + 3)(x − 3)",
            },
            "answer": "B",
            "explanation": (
                "x² − 9 is a difference of squares: (x + 3)(x − 3).\n"
                "(x + 3)(x − 3) / (x − 3) = x + 3, for x ≠ 3."
            ),
            "hint": "Factor the numerator first — look for difference of squares (a²−b²) = (a+b)(a−b).",
        },

        # ── TOPIC: Ratios & Proportions ────────────────────────

        {
            "id": "SAT-M-RP-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Ratios & Proportions",
            "subtopic": "Direct proportion",
            "difficulty": "easy",
            "tags": [],
            "passage": None,
            "question": (
                "A recipe requires 3 cups of flour to make 24 cookies. How many cups of "
                "flour are needed to make 64 cookies?"
            ),
            "options": {
                "A": "6",
                "B": "7",
                "C": "8",
                "D": "9",
            },
            "answer": "C",
            "explanation": (
                "Proportion: 3/24 = x/64.\n"
                "Cross multiply: 24x = 192 → x = 8."
            ),
            "hint": "Set up a proportion: (cups)/(cookies) = (cups)/(cookies).",
        },

        {
            "id": "SAT-M-RP-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Ratios & Proportions",
            "subtopic": "Unit conversion",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": (
                "A car travels at 60 miles per hour. What is its speed in feet per second? "
                "(1 mile = 5,280 feet)"
            ),
            "options": {
                "A": "44",
                "B": "66",
                "C": "88",
                "D": "110",
            },
            "answer": "C",
            "explanation": (
                "60 miles/hour × 5,280 feet/mile ÷ 3,600 seconds/hour\n"
                "= (60 × 5,280) / 3,600\n"
                "= 316,800 / 3,600\n"
                "= 88 feet per second."
            ),
            "hint": "Convert miles→feet and hours→seconds separately, then combine.",
        },

        # ── TOPIC: Percentages ─────────────────────────────────

        {
            "id": "SAT-M-PCT-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Percentages",
            "subtopic": "Percent change",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": None,
            "question": (
                "A jacket originally costs $80. It is discounted by 25% and then sales tax "
                "of 10% is added. What is the final price?"
            ),
            "options": {
                "A": "$60.00",
                "B": "$62.00",
                "C": "$64.00",
                "D": "$66.00",
            },
            "answer": "D",
            "explanation": (
                "Step 1: 25% off $80 = $80 × 0.75 = $60.\n"
                "Step 2: 10% tax on $60 = $60 × 1.10 = $66."
            ),
            "hint": "Apply the discount first, then apply tax to the discounted price.",
        },

        {
            "id": "SAT-M-PCT-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Percentages",
            "subtopic": "Percent of total",
            "difficulty": "medium",
            "tags": [],
            "passage": None,
            "question": (
                "In a survey, 120 out of 480 people said they prefer tea over coffee. "
                "What percentage prefer tea?"
            ),
            "options": {
                "A": "20%",
                "B": "25%",
                "C": "30%",
                "D": "33%",
            },
            "answer": "B",
            "explanation": (
                "120 / 480 = 0.25 = 25%."
            ),
            "hint": "Divide the part by the whole, then multiply by 100.",
        },

        {
            "id": "SAT-M-PCT-003",
            "exam": "SAT",
            "section": "Math",
            "topic": "Percentages",
            "subtopic": "Successive percent changes",
            "difficulty": "hard",
            "tags": ["tricky", "pyq"],
            "passage": None,
            "question": (
                "A store increases all prices by 20%, then later decreases them by 20%. "
                "What is the net effect on the original price?"
            ),
            "options": {
                "A": "No change",
                "B": "4% increase",
                "C": "4% decrease",
                "D": "2% decrease",
            },
            "answer": "C",
            "explanation": (
                "Let original price = 100.\n"
                "After 20% increase: 100 × 1.20 = 120.\n"
                "After 20% decrease: 120 × 0.80 = 96.\n"
                "Net change = 96 − 100 = −4 → 4% decrease.\n\n"
                "Key insight: percent changes don't cancel. +20% then −20% ≠ 0%."
            ),
            "hint": "Try with a specific number like $100. The two percentages are applied to different bases.",
        },

        # ── TOPIC: Statistics ──────────────────────────────────

        {
            "id": "SAT-M-STAT-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Statistics",
            "subtopic": "Mean, median, mode",
            "difficulty": "easy",
            "tags": ["important"],
            "passage": None,
            "question": (
                "The scores of 5 students are: 72, 85, 90, 90, 93. "
                "What is the median score?"
            ),
            "options": {
                "A": "85",
                "B": "88",
                "C": "90",
                "D": "91",
            },
            "answer": "C",
            "explanation": (
                "Ordered: 72, 85, 90, 90, 93.\n"
                "The middle value (3rd out of 5) is 90."
            ),
            "hint": "Median is the middle value when data is ordered. With 5 values, it's the 3rd.",
        },

        {
            "id": "SAT-M-STAT-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Statistics",
            "subtopic": "Sampling and inference",
            "difficulty": "hard",
            "tags": ["important", "pyq"],
            "passage": (
                "A study randomly sampled 500 adults from a city of 200,000 and found that "
                "35% exercised daily. The margin of error is ±4%."
            ),
            "question": "Which conclusion is best supported?",
            "options": {
                "A": "Exactly 35% of all 200,000 adults exercise daily.",
                "B": "Between 31% and 39% of the 500 sampled adults exercise daily.",
                "C": "Between 31% and 39% of the 200,000 adults in the city likely exercise daily.",
                "D": "At least 35% of all adults in the country exercise daily.",
            },
            "answer": "C",
            "explanation": (
                "The margin of error applies to the POPULATION estimate — the goal of sampling "
                "is to draw conclusions about the full population (200,000 city adults), not just "
                "the sample. Option A says 'exactly' — margin of error means we don't know exactly. "
                "Option B incorrectly applies the interval to the sample (we know the sample was 35%). "
                "Option D extends beyond the city to the whole country — not supported."
            ),
            "hint": "The margin of error tells us the range for the POPULATION, not the sample we already measured.",
        },

        {
            "id": "SAT-M-STAT-003",
            "exam": "SAT",
            "section": "Math",
            "topic": "Statistics",
            "subtopic": "Standard deviation interpretation",
            "difficulty": "hard",
            "tags": ["tricky"],
            "passage": None,
            "question": (
                "Two classes take the same exam. Class A has a mean of 78 and a standard "
                "deviation of 3. Class B has a mean of 78 and a standard deviation of 12. "
                "Which statement is accurate?"
            ),
            "options": {
                "A": "Class A performed better overall.",
                "B": "Class B's scores are more spread out than Class A's.",
                "C": "Class B's mean will be higher after curved grading.",
                "D": "Class A has more students than Class B.",
            },
            "answer": "B",
            "explanation": (
                "Standard deviation measures the spread/variability of data. A higher SD means "
                "scores are more spread out. Both classes have the same mean (78), so performance "
                "level is equal. Class B's SD of 12 is larger → more spread. No information about "
                "curving or class size is given."
            ),
            "hint": "Standard deviation = spread. Same mean doesn't mean same distribution.",
        },

        # ── TOPIC: Probability ─────────────────────────────────

        {
            "id": "SAT-M-PROB-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Probability",
            "subtopic": "Basic probability",
            "difficulty": "easy",
            "tags": [],
            "passage": None,
            "question": (
                "A bag contains 4 red marbles, 6 blue marbles, and 10 green marbles. "
                "If one marble is picked at random, what is the probability it is NOT red?"
            ),
            "options": {
                "A": "1/5",
                "B": "4/5",
                "C": "1/4",
                "D": "3/4",
            },
            "answer": "B",
            "explanation": (
                "Total marbles = 4 + 6 + 10 = 20.\n"
                "Not red = 6 + 10 = 16.\n"
                "P(not red) = 16/20 = 4/5."
            ),
            "hint": "P(not red) = 1 − P(red). Or count the non-red marbles directly.",
        },

        {
            "id": "SAT-M-PROB-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Probability",
            "subtopic": "Two-way table probability",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "A survey of 200 students shows:\n"
                "           | Likes math | Does not like math |\n"
                "Science    |     70     |        30          |\n"
                "No science |     40     |        60          |"
            ),
            "question": (
                "What is the probability that a randomly selected student likes math, "
                "given they are in the science group?"
            ),
            "options": {
                "A": "7/20",
                "B": "7/10",
                "C": "7/12",
                "D": "7/15",
            },
            "answer": "B",
            "explanation": (
                "This is a conditional probability: P(likes math | in science group).\n"
                "Science group total = 70 + 30 = 100.\n"
                "Likes math AND in science = 70.\n"
                "P = 70/100 = 7/10."
            ),
            "hint": "Conditional probability: restrict your sample space to the science group only.",
        },

        # ── TOPIC: Geometry ────────────────────────────────────

        {
            "id": "SAT-M-GEO-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Geometry",
            "subtopic": "Area and perimeter",
            "difficulty": "easy",
            "tags": [],
            "passage": None,
            "question": (
                "A rectangle has a length of 12 cm and a width of 7 cm. "
                "What is the area of the rectangle?"
            ),
            "options": {
                "A": "38 cm²",
                "B": "72 cm²",
                "C": "84 cm²",
                "D": "96 cm²",
            },
            "answer": "C",
            "explanation": "Area = length × width = 12 × 7 = 84 cm².",
            "hint": "Area of rectangle = length × width.",
        },

        {
            "id": "SAT-M-GEO-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Geometry",
            "subtopic": "Pythagorean theorem",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": (
                "A right triangle has legs of length 5 and 12. What is the length of the hypotenuse?"
            ),
            "options": {
                "A": "11",
                "B": "13",
                "C": "15",
                "D": "17",
            },
            "answer": "B",
            "explanation": (
                "a² + b² = c²\n"
                "5² + 12² = 25 + 144 = 169\n"
                "c = √169 = 13."
            ),
            "hint": "Use a² + b² = c². Common Pythagorean triple: 5-12-13.",
        },

        {
            "id": "SAT-M-GEO-003",
            "exam": "SAT",
            "section": "Math",
            "topic": "Geometry",
            "subtopic": "Circles",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": None,
            "question": (
                "A circle has center at the origin and passes through the point (5, 12). "
                "What is the area of the circle? (Leave in terms of π)"
            ),
            "options": {
                "A": "25π",
                "B": "144π",
                "C": "169π",
                "D": "289π",
            },
            "answer": "C",
            "explanation": (
                "Radius = distance from origin to (5, 12) = √(5² + 12²) = √(25 + 144) = √169 = 13.\n"
                "Area = πr² = π(13²) = 169π."
            ),
            "hint": "Radius = distance from center to point. Then use Area = πr².",
        },

        {
            "id": "SAT-M-GEO-004",
            "exam": "SAT",
            "section": "Math",
            "topic": "Geometry",
            "subtopic": "Volume",
            "difficulty": "medium",
            "tags": [],
            "passage": None,
            "question": (
                "A cylinder has a radius of 4 cm and a height of 10 cm. "
                "What is the volume? (Leave in terms of π)"
            ),
            "options": {
                "A": "80π",
                "B": "120π",
                "C": "160π",
                "D": "200π",
            },
            "answer": "C",
            "explanation": (
                "Volume of cylinder = πr²h = π(4²)(10) = π(16)(10) = 160π cm³."
            ),
            "hint": "Volume of cylinder = π × radius² × height.",
        },

        {
            "id": "SAT-M-GEO-005",
            "exam": "SAT",
            "section": "Math",
            "topic": "Geometry",
            "subtopic": "Similar triangles",
            "difficulty": "hard",
            "tags": ["tricky", "pyq"],
            "passage": (
                "Triangle ABC is similar to Triangle DEF. In Triangle ABC, AB = 6, BC = 9. "
                "In Triangle DEF, DE = 10."
            ),
            "question": "What is the length of EF?",
            "options": {
                "A": "13",
                "B": "14",
                "C": "15",
                "D": "16",
            },
            "answer": "C",
            "explanation": (
                "Ratio of similarity = DE/AB = 10/6 = 5/3.\n"
                "EF corresponds to BC.\n"
                "EF = BC × (5/3) = 9 × (5/3) = 15."
            ),
            "hint": "Find the scale factor (ratio of corresponding sides), then apply it.",
        },

        {
            "id": "SAT-M-GEO-006",
            "exam": "SAT",
            "section": "Math",
            "topic": "Geometry",
            "subtopic": "Arc length and sector area",
            "difficulty": "hard",
            "tags": ["pyq"],
            "passage": None,
            "question": (
                "A circle has radius 9 cm. What is the length of an arc subtended by a "
                "central angle of 80°? (Leave in terms of π)"
            ),
            "options": {
                "A": "2π",
                "B": "3π",
                "C": "4π",
                "D": "6π",
            },
            "answer": "C",
            "explanation": (
                "Arc length = (θ/360) × 2πr = (80/360) × 2π(9)\n"
                "= (2/9) × 18π = 4π cm."
            ),
            "hint": "Arc length = (angle/360) × circumference. Circumference = 2πr.",
        },

        # ── TOPIC: Trigonometry ────────────────────────────────

        {
            "id": "SAT-M-TRIG-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Trigonometry",
            "subtopic": "SOH-CAH-TOA",
            "difficulty": "medium",
            "tags": ["important"],
            "passage": (
                "In right triangle ABC, angle C is the right angle, angle A = 35°, and "
                "the hypotenuse BC... wait — side AB (hypotenuse) = 20."
            ),
            "question": (
                "In a right triangle, the angle opposite a side is 30°. The hypotenuse "
                "is 14. What is the length of the side opposite the 30° angle?"
            ),
            "options": {
                "A": "5",
                "B": "6",
                "C": "7",
                "D": "8",
            },
            "answer": "C",
            "explanation": (
                "sin(30°) = opposite / hypotenuse\n"
                "0.5 = opposite / 14\n"
                "opposite = 7.\n\n"
                "Note: sin(30°) = 0.5 is a standard value to memorize."
            ),
            "hint": "SOH: sin = Opposite / Hypotenuse. sin(30°) = 0.5.",
        },

        {
            "id": "SAT-M-TRIG-002",
            "exam": "SAT",
            "section": "Math",
            "topic": "Trigonometry",
            "subtopic": "Complementary angle identities",
            "difficulty": "hard",
            "tags": ["pyq", "tricky"],
            "passage": None,
            "question": (
                "If sin(x°) = cos(y°) and x + y = 90, which of the following must be true?"
            ),
            "options": {
                "A": "x = y",
                "B": "x = 45",
                "C": "x and y are complementary angles",
                "D": "sin(x) = sin(y)",
            },
            "answer": "C",
            "explanation": (
                "sin(x°) = cos(y°) is always true when x + y = 90° — this is the "
                "complementary angle identity: sin(θ) = cos(90° − θ).\n"
                "x + y = 90 means they are complementary by definition. Option A is wrong "
                "(x doesn't have to equal y). Option B only works if x = y = 45. "
                "Option D is only true if x = y."
            ),
            "hint": "sin(x) = cos(90−x). What does x + y = 90 make x and y?",
        },

        # ── TOPIC: Nonlinear Equations ─────────────────────────

        {
            "id": "SAT-M-NLE-001",
            "exam": "SAT",
            "section": "Math",
            "topic": "Nonlinear Equations",
            "subtopic": "System with quadratic",
            "difficulty": "hard",
            "tags": ["important", "pyq"],
            "passage": None,
            "question": (
                "How many solutions does the system have?\n"
                "y = x² − 4\n"
                "y = 2x − 1"
            ),
            "options": {
                "A": "0",
                "B": "1",
                "C": "2",
                "D": "Infinitely many",
            },
            "answer": "C",
            "explanation": (
                "Set equal: x² − 4 = 2x − 1\n"
                "x² − 2x − 3 = 0\n"
                "(x − 3)(x + 1) = 0\n"
                "x = 3 or x = −1 → Two solutions."
            ),
            "hint": "Set the two expressions equal, rearrange, and count real solutions of the quadratic.",
        },

    ],

}


# ══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════

def get_all_questions() -> list[dict]:
    """Return a flat list of all questions across all sections."""
    all_q = []
    for section_questions in SAT_QUESTIONS.values():
        all_q.extend(section_questions)
    return all_q


def get_questions(
    section: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    tags: Optional[list] = None,
    count: Optional[int] = None,
    shuffle: bool = True,
) -> list[dict]:
    """
    Filter questions by section, topic, difficulty, and/or tags.

    Args:
        section    : "Reading & Writing" | "Math"
        topic      : e.g. "Transitions", "Quadratic Functions"
        difficulty : "easy" | "medium" | "hard"
        tags       : list of tags — returns questions that have ANY of these tags
        count      : max number of questions to return (None = all)
        shuffle    : randomize order before returning

    Returns:
        List of matching question dicts.

    Example:
        get_questions(section="Math", difficulty="hard", count=5)
    """
    pool = get_all_questions()

    if section:
        pool = [q for q in pool if q["section"] == section]
    if topic:
        pool = [q for q in pool if q["topic"] == topic]
    if difficulty:
        pool = [q for q in pool if q["difficulty"] == difficulty]
    if tags:
        pool = [q for q in pool if any(t in q["tags"] for t in tags)]

    if shuffle:
        random.shuffle(pool)

    return pool[:count] if count else pool


def get_chapter_set(section: str, topic: str) -> list[dict]:
    """Return ALL questions for one chapter/topic, sorted easy → hard."""
    difficulty_order = {"easy": 0, "medium": 1, "hard": 2}
    questions = get_questions(section=section, topic=topic, shuffle=False)
    return sorted(questions, key=lambda q: difficulty_order.get(q["difficulty"], 1))


def get_pyq_style(section: Optional[str] = None) -> list[dict]:
    """Return only questions tagged as 'pyq' (previous year question style)."""
    return get_questions(section=section, tags=["pyq"])


def get_mock_test() -> dict:
    """
    Return a balanced SAT mock test.

    Structure mirrors real digital SAT:
      - Reading & Writing Module 1: 27 questions (mix of all RW topics)
      - Reading & Writing Module 2: 27 questions
      - Math Module 1: 22 questions
      - Math Module 2: 22 questions

    Since our bank is smaller than a real test, this returns all available
    questions organized into these modules, filling as many as available.
    """
    rw_questions = get_questions(section="Reading & Writing", shuffle=True)
    math_questions = get_questions(section="Math", shuffle=True)

    half_rw = len(rw_questions) // 2
    half_math = len(math_questions) // 2

    return {
        "exam": "SAT",
        "title": "SAT Full Mock Test",
        "total_questions": len(rw_questions) + len(math_questions),
        "modules": {
            "RW_Module_1": {
                "section": "Reading & Writing",
                "time_minutes": 32,
                "questions": rw_questions[:half_rw],
            },
            "RW_Module_2": {
                "section": "Reading & Writing",
                "time_minutes": 32,
                "questions": rw_questions[half_rw:],
            },
            "Math_Module_1": {
                "section": "Math",
                "time_minutes": 35,
                "questions": math_questions[:half_math],
            },
            "Math_Module_2": {
                "section": "Math",
                "time_minutes": 35,
                "questions": math_questions[half_math:],
            },
        },
    }


def get_stats() -> dict:
    """Return a summary of the question bank."""
    all_q = get_all_questions()
    stats = {
        "total": len(all_q),
        "by_section": {},
        "by_difficulty": {"easy": 0, "medium": 0, "hard": 0},
        "by_topic": {},
        "pyq_count": len(get_pyq_style()),
    }
    for q in all_q:
        sec = q["section"]
        diff = q["difficulty"]
        topic = q["topic"]

        stats["by_section"][sec] = stats["by_section"].get(sec, 0) + 1
        stats["by_difficulty"][diff] = stats["by_difficulty"].get(diff, 0) + 1
        stats["by_topic"][topic] = stats["by_topic"].get(topic, 0) + 1

    return stats


def export_to_json(filepath: str = "sat_questions.json") -> None:
    """Export the full question bank to a JSON file."""
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(SAT_QUESTIONS, f, indent=2, ensure_ascii=False)
    all_q = get_all_questions()
    print(f"Exported {len(all_q)} questions to {filepath}")


def export_flat_json(filepath: str = "sat_questions_flat.json") -> None:
    """Export a flat list of all questions to JSON (easier for frontend use)."""
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(get_all_questions(), f, indent=2, ensure_ascii=False)
    print(f"Exported {len(get_all_questions())} questions to {filepath}")


# ══════════════════════════════════════════════════════════════
# QUICK TEST — run this file directly to verify it works
# ══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    stats = get_stats()
    print("=" * 55)
    print("  SAT QUESTION BANK — Stats")
    print("=" * 55)
    print(f"  Total questions : {stats['total']}")
    print(f"  PYQ-style       : {stats['pyq_count']}")
    print()
    print("  By section:")
    for sec, count in stats["by_section"].items():
        print(f"    {sec:<25} {count} questions")
    print()
    print("  By difficulty:")
    for diff, count in stats["by_difficulty"].items():
        print(f"    {diff:<10} {count} questions")
    print()
    print("  By topic:")
    for topic, count in sorted(stats["by_topic"].items()):
        print(f"    {topic:<35} {count}")
    print()

    print("  Sample — 3 hard Math questions:")
    hard_math = get_questions(section="Math", difficulty="hard", count=3)
    for q in hard_math:
        print(f"    [{q['id']}] {q['question'][:60]}...")
    print()

    print("  Sample — mock test structure:")
    mock = get_mock_test()
    for module, data in mock["modules"].items():
        print(f"    {module}: {len(data['questions'])} questions, {data['time_minutes']} min")

    print()
    print("  Exporting to JSON...")
    export_flat_json("sat_questions_flat.json")
    export_to_json("sat_questions.json")
    print("  Done!")
