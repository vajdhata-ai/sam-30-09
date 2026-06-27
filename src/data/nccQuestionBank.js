export const nccQuestionBank = {
    // ════════════════════════════════════════════════════
    // COMMON SUBJECTS (All Wings)
    // ════════════════════════════════════════════════════
    'national-integration-1': [
        {
            id: 'ni-1',
            type: 'mcq',
            question: 'What does National Integration mean?',
            options: [
                'Following only one religion in the country',
                'Feeling of togetherness among citizens regardless of caste, religion, or language',
                'Speaking only one national language',
                'Merging all states into one central territory'
            ],
            answer: 'Feeling of togetherness among citizens regardless of caste, religion, or language',
            difficulty: 'easy',
            explanation: 'National integration is unity in diversity. It is the awareness of a common identity among citizens despite cultural or regional differences.'
        },
        {
            id: 'ni-2',
            type: 'mcq',
            question: 'Which of the following is a major challenge to National Integration in India?',
            options: [
                'Industrialization',
                'Communalism',
                'Urbanization',
                'Literacy'
            ],
            answer: 'Communalism',
            difficulty: 'medium',
            explanation: 'Communalism (putting religious identity above national identity) causes societal divide and threatens national integration.'
        },
        {
            id: 'ni-3',
            type: 'assertion-reasoning',
            question: 'Assertion (A): NCC promotes National Integration. Reason (R): Cadets from all over India live together in National Integration Camps (NIC) regardless of their background.',
            options: [
                'Both A and R are true and R is the correct explanation of A',
                'Both A and R are true but R is NOT the correct explanation of A',
                'A is true but R is false',
                'A is false but R is true'
            ],
            answer: 'Both A and R are true and R is the correct explanation of A',
            difficulty: 'hard',
            explanation: 'NIC camps bring youth from diverse states together, forcing them to interact and understand each other\'s cultures, thus practically fostering integration.'
        }
    ],
    'drill-1': [
        {
            id: 'dr-1',
            type: 'mcq',
            question: 'What is the correct angle between the feet in the Savdhan (Attention) position?',
            options: ['45 degrees', '60 degrees', '30 degrees', '90 degrees'],
            answer: '30 degrees',
            difficulty: 'easy',
            explanation: 'In the Savdhan position, the heels must be joined and the feet turned outwards to form an angle of 30 degrees.'
        },
        {
            id: 'dr-2',
            type: 'mcq',
            question: 'What are the two parts of a Word of Command?',
            options: [
                'Start and Stop',
                'Cautionary and Executive',
                'Warning and Action',
                'Left and Right'
            ],
            answer: 'Cautionary and Executive',
            difficulty: 'medium',
            explanation: 'Chetawani (Cautionary) prepares the squad, and Karwahi (Executive) triggers the action.'
        },
        {
            id: 'dr-3',
            type: 'mcq',
            question: 'In the Piche Mud (About Turn) command, how many degrees does a cadet turn?',
            options: ['90 degrees Left', '180 degrees Right', '180 degrees Left', '360 degrees Right'],
            answer: '180 degrees Right',
            difficulty: 'hard',
            explanation: 'An about-turn is always a 180-degree turn executed over the right shoulder (via the right side).'
        }
    ],
    'weapon-training-1': [
        {
            id: 'wt-1',
            type: 'mcq',
            question: 'What is the effective range of the .22 Deluxe Rifle?',
            options: ['25 yards', '100 yards', '200 yards', '1700 yards'],
            answer: '25 yards',
            difficulty: 'medium',
            explanation: 'While the maximum range is 1700 yards, its effective range (where it remains highly accurate) is only 25 yards.'
        },
        {
            id: 'wt-2',
            type: 'mcq',
            question: 'How many rounds can the magazine of a .22 Deluxe Rifle hold?',
            options: ['10', '5', '15', '20'],
            answer: '5',
            difficulty: 'easy',
            explanation: 'The standard magazine for the .22 Deluxe Rifle holds 5 rounds.'
        },
        {
            id: 'wt-3',
            type: 'mcq',
            question: 'What is the weight of the .22 Deluxe Rifle?',
            options: ['8 lbs', '6 lbs 2 oz', '5 lbs 5 oz', '7 lbs 2 oz'],
            answer: '6 lbs 2 oz',
            difficulty: 'hard',
            explanation: 'The standard weight of the .22 Deluxe rifle used in NCC is 6 pounds and 2 ounces.'
        }
    ],

    // ════════════════════════════════════════════════════
    // ARMY WING
    // ════════════════════════════════════════════════════
    'army-org-1': [
        {
            id: 'ao-1',
            type: 'mcq',
            question: 'Who is the Supreme Commander of the Indian Armed Forces?',
            options: ['Chief of Army Staff', 'Prime Minister', 'President of India', 'Defense Minister'],
            answer: 'President of India',
            difficulty: 'easy',
            explanation: 'According to the Constitution, the President is the Supreme Commander of the Armed Forces.'
        },
        {
            id: 'ao-2',
            type: 'mcq',
            question: 'Where is the headquarters of the Army Training Command (ARTRAC)?',
            options: ['Pune', 'Shimla', 'Udhampur', 'Dehradun'],
            answer: 'Shimla',
            difficulty: 'medium',
            explanation: 'ARTRAC is located in Shimla, Himachal Pradesh.'
        },
        {
            id: 'ao-3',
            type: 'mcq',
            question: 'What is the smallest tactical unit in the Infantry?',
            options: ['Platoon', 'Company', 'Section', 'Brigade'],
            answer: 'Section',
            difficulty: 'hard',
            explanation: 'A Section consists of 10 troops and is commanded by a Havildar.'
        }
    ],

    // ════════════════════════════════════════════════════
    // NAVY WING
    // ════════════════════════════════════════════════════
    'navy-org-1': [
        {
            id: 'no-1',
            type: 'mcq',
            question: 'Which of these is the Training Command of the Indian Navy?',
            options: ['Western Naval Command', 'Eastern Naval Command', 'Southern Naval Command', 'Andaman Command'],
            answer: 'Southern Naval Command',
            difficulty: 'medium',
            explanation: 'The Southern Naval Command, headquartered in Kochi, is responsible for training.'
        },
        {
            id: 'no-2',
            type: 'mcq',
            question: 'What is the equivalent Army rank of a Navy Captain?',
            options: ['Captain', 'Major', 'Colonel', 'Brigadier'],
            answer: 'Colonel',
            difficulty: 'hard',
            explanation: 'A Navy Captain commands a large warship and is a senior rank equivalent to an Army Colonel.'
        }
    ],

    // ════════════════════════════════════════════════════
    // AIR FORCE WING
    // ════════════════════════════════════════════════════
    'af-org-1': [
        {
            id: 'afo-1',
            type: 'mcq',
            question: 'How many operational commands does the IAF have?',
            options: ['7', '5', '3', '2'],
            answer: '5',
            difficulty: 'medium',
            explanation: 'The IAF has 7 total commands, but 5 are operational and 2 are functional (Training and Maintenance).'
        },
        {
            id: 'afo-2',
            type: 'mcq',
            question: 'Who commands a typical IAF fighter squadron?',
            options: ['Flight Lieutenant', 'Group Captain', 'Wing Commander', 'Air Commodore'],
            answer: 'Wing Commander',
            difficulty: 'hard',
            explanation: 'A Squadron (approx 18 aircraft) is typically commanded by a Wing Commander.'
        }
    ]
};

// Helper function to get questions by chapter
export const getQuestionsForChapter = (chapterId) => {
    return nccQuestionBank[chapterId] || [];
};

// Helper function to get a randomized mock test for a specific wing
export const getQuestionsForWing = (wing, limit = 35) => {
    let allQuestions = [];
    
    // Collect common subjects
    const commonKeys = ['national-integration-1', 'drill-1', 'weapon-training-1'];
    commonKeys.forEach(key => {
        if (nccQuestionBank[key]) {
            allQuestions = [...allQuestions, ...nccQuestionBank[key]];
        }
    });
    
    // Collect wing-specific subjects
    const wingPrefix = wing === 'air force' ? 'af' : wing.toLowerCase();
    Object.keys(nccQuestionBank).forEach(key => {
        if (key.startsWith(wingPrefix)) {
            allQuestions = [...allQuestions, ...nccQuestionBank[key]];
        }
    });
    
    // Shuffle and limit
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
};
