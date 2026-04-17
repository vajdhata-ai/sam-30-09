// ============================================================
// NDA Content Uploader to Firebase Firestore
// Compatible with Firebase v9+ (modular SDK) & Google's Antigravity
// ============================================================
// SETUP:
//   npm install firebase
//   Replace firebaseConfig below with YOUR project config
//   Run: node upload_nda_content.js
// ============================================================

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import mathData from "./nda_mathematics_complete.json" assert { type: "json" };
import gatData from "./nda_general_ability_complete.json" assert { type: "json" };

// ─── YOUR FIREBASE CONFIG ───────────────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
// ────────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── FIRESTORE SCHEMA ───────────────────────────────────────
// exams/{examId}                        ← exam metadata
// exams/{examId}/subjects/{subjectId}   ← subject metadata
// exams/{examId}/chapters/{chapterId}   ← chapter notes
// questions/{questionId}                ← flat question store (best for querying)
// notes/{chapterId}                     ← chapter notes (rich text)
// ────────────────────────────────────────────────────────────

const EXAM_ID = "NDA";
const BATCH_LIMIT = 490; // Firestore batch limit is 500 ops

// Utility: chunk array into batches
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ─── 1. Upload Exam Metadata ────────────────────────────────
async function uploadExamMetadata() {
  console.log("📋 Uploading exam metadata...");
  await setDoc(doc(db, "exams", EXAM_ID), {
    name: "NDA - National Defence Academy",
    fullName: "NDA & NA Examination",
    conductedBy: "UPSC",
    frequency: "Twice a year",
    subjects: ["Mathematics", "General Ability Test"],
    pattern: {
      paper1: { name: "Mathematics", marks: 300, questions: 120, duration: "2.5 hrs" },
      paper2: { name: "General Ability Test", marks: 600, questions: 150, duration: "2.5 hrs" },
    },
    eligibility: {
      age: "16.5 to 19.5 years",
      qualification: "Class 12 (PCM for Army/Navy, any stream for Air Force with Math)",
      maritalStatus: "Unmarried",
    },
    selection: ["Written", "SSB Interview", "Medical"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log("✅ Exam metadata uploaded");
}

// ─── 2. Upload Chapter Notes ────────────────────────────────
async function uploadChapterNotes(chapters, subjectId) {
  console.log(`📚 Uploading notes for ${subjectId}...`);

  for (const chapter of chapters) {
    const chapterId = chapter.id;

    // Upload notes document
    await setDoc(doc(db, "notes", chapterId), {
      examId: EXAM_ID,
      subjectId,
      chapterName: chapter.chapter,
      notes: chapter.notes,
      createdAt: serverTimestamp(),
    });

    // Upload chapter index under exam/subject
    await setDoc(
      doc(db, "exams", EXAM_ID, "subjects", subjectId, "chapters", chapterId),
      {
        id: chapterId,
        name: chapter.chapter,
        notesRef: `notes/${chapterId}`,
        questionCount: {
          easy: chapter.questions?.easy?.length || 0,
          medium: chapter.questions?.medium?.length || 0,
          hard: chapter.questions?.hard?.length || 0,
        },
        updatedAt: serverTimestamp(),
      }
    );
  }
  console.log(`✅ Notes uploaded for ${subjectId}`);
}

// ─── 3. Upload Questions (batch write for speed) ─────────────
async function uploadQuestions(chapters, subjectId, extraQuestions = []) {
  console.log(`❓ Uploading questions for ${subjectId}...`);

  const allQuestions = [];

  // Collect from chapters
  for (const chapter of chapters) {
    if (!chapter.questions) continue;
    const chapterId = chapter.id;

    for (const level of ["easy", "medium", "hard"]) {
      const qs = chapter.questions[level] || [];
      for (const q of qs) {
        allQuestions.push({
          ...q,
          examId: EXAM_ID,
          subjectId,
          chapterId,
          chapterName: chapter.chapter,
          difficulty: level,
          type: "MCQ",
          createdAt: serverTimestamp(),
        });
      }
    }
  }

  // Collect PYQs
  for (const q of extraQuestions) {
    allQuestions.push({
      ...q,
      examId: EXAM_ID,
      subjectId,
      chapterId: "pyq",
      chapterName: "Previous Year Questions",
      difficulty: "mixed",
      type: "PYQ",
      createdAt: serverTimestamp(),
    });
  }

  console.log(`  → Total questions to upload: ${allQuestions.length}`);

  // Batch upload
  const batches = chunk(allQuestions, BATCH_LIMIT);
  for (let i = 0; i < batches.length; i++) {
    const batch = writeBatch(db);
    for (const q of batches[i]) {
      const qRef = doc(db, "questions", q.id);
      batch.set(qRef, q);
    }
    await batch.commit();
    console.log(`  → Batch ${i + 1}/${batches.length} committed`);
  }

  console.log(`✅ Questions uploaded for ${subjectId}`);
}

// ─── 4. Upload Mock Test Papers ──────────────────────────────
async function uploadMockTests() {
  console.log("📝 Uploading mock test templates...");

  const mockTests = [
    {
      id: "NDA_MOCK_01",
      title: "NDA Full Mock Test 1",
      examId: EXAM_ID,
      papers: [
        {
          paperId: "P1",
          name: "Mathematics",
          duration: 150,
          totalMarks: 300,
          totalQuestions: 120,
          markingScheme: { correct: 2.5, wrong: -0.83 },
          // Question IDs pulled from questions collection
          questionFilters: { examId: EXAM_ID, subjectId: "Mathematics", limit: 120 },
        },
        {
          paperId: "P2",
          name: "General Ability Test",
          duration: 150,
          totalMarks: 600,
          totalQuestions: 150,
          markingScheme: { correct: 4, wrong: -1.33 },
          questionFilters: { examId: EXAM_ID, subjectId: "GAT", limit: 150 },
        },
      ],
      difficulty: "Standard",
      isActive: true,
      createdAt: serverTimestamp(),
    },
    {
      id: "NDA_MOCK_02",
      title: "NDA Full Mock Test 2",
      examId: EXAM_ID,
      papers: [
        {
          paperId: "P1",
          name: "Mathematics",
          duration: 150,
          totalMarks: 300,
          totalQuestions: 120,
          markingScheme: { correct: 2.5, wrong: -0.83 },
          questionFilters: { examId: EXAM_ID, subjectId: "Mathematics", limit: 120 },
        },
        {
          paperId: "P2",
          name: "General Ability Test",
          duration: 150,
          totalMarks: 600,
          totalQuestions: 150,
          markingScheme: { correct: 4, wrong: -1.33 },
          questionFilters: { examId: EXAM_ID, subjectId: "GAT", limit: 150 },
        },
      ],
      difficulty: "Advanced",
      isActive: true,
      createdAt: serverTimestamp(),
    },
  ];

  for (const mock of mockTests) {
    await setDoc(doc(db, "mockTests", mock.id), mock);
  }
  console.log("✅ Mock tests uploaded");
}

// ─── 5. Upload Progress Tracking Schema ──────────────────────
async function createProgressSchema() {
  console.log("📊 Creating progress tracking schema docs...");

  // This is the structure each user's progress will follow
  // Actual user docs created on first login / first attempt
  await setDoc(doc(db, "_schemas", "userProgress"), {
    description: "Schema for user progress tracking",
    structure: {
      userId: "string",
      examId: "string",
      subjectId: "string",
      chapterId: "string",
      questionsAttempted: ["questionId"],
      correctAnswers: ["questionId"],
      wrongAnswers: ["questionId"],
      skipped: ["questionId"],
      accuracy: "number (percentage)",
      timeSpent: "number (seconds)",
      lastAttemptedAt: "timestamp",
      difficultyBreakdown: {
        easy: { attempted: 0, correct: 0 },
        medium: { attempted: 0, correct: 0 },
        hard: { attempted: 0, correct: 0 },
      },
    },
    updatedAt: serverTimestamp(),
  });
  console.log("✅ Progress schema created");
}

// ─── MAIN UPLOAD FUNCTION ────────────────────────────────────
async function uploadAllNDAContent() {
  console.log("\n🚀 Starting NDA Content Upload to Firestore...\n");
  console.log("=".repeat(55));

  try {
    // Metadata
    await uploadExamMetadata();

    // Mathematics
    await uploadChapterNotes(mathData.chapters, "Mathematics");
    await uploadQuestions(
      mathData.chapters,
      "Mathematics",
      mathData.pyq_section?.questions || []
    );

    // General Ability Test
    await uploadChapterNotes(gatData.sections, "GAT");
    await uploadQuestions(gatData.sections, "GAT");

    // Mock Tests
    await uploadMockTests();

    // Progress schema
    await createProgressSchema();

    console.log("\n" + "=".repeat(55));
    console.log("🎉 ALL CONTENT UPLOADED SUCCESSFULLY!");
    console.log("=".repeat(55));
    console.log("\n📦 Firestore Collections Created:");
    console.log("   • exams/NDA");
    console.log("   • exams/NDA/subjects/Mathematics");
    console.log("   • exams/NDA/subjects/GAT");
    console.log("   • notes/{chapterId} (all chapter notes)");
    console.log("   • questions/{questionId} (all 200+ questions)");
    console.log("   • mockTests/{mockId}");
    console.log("   • _schemas/userProgress");
    console.log("\n✨ Your edtech app is ready to go!");
  } catch (error) {
    console.error("\n❌ Upload Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// ─── Run ─────────────────────────────────────────────────────
uploadAllNDAContent();
