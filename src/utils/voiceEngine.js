// No howler JS to prevent crash
// import { Howl } from 'howler';
// We must avoid importing store directly since React hooks can't be called outside.
// In a full implementation, we pass the setters into this utility.

const mockDialogue = {
  hp: {
    greeting: "Welcome back to Hogwarts. Ready to master some magic?",
    correct: "Ten points to Gryffindor!",
    fail: "A slight misstep. Remember the incantation!"
  },
  avengers: {
    greeting: "JARVIS systems online. Ready when you are.",
    correct: "Target acquired and destroyed. Excellent work.",
    fail: "Armor integrity low. Recalibrate and try again."
  }
};

export async function triggerCompanionReaction(eventType, storeSetters) {
  const { activeUniverse, activeCompanion, setIsSpeaking, setSpeechAudioLevel } = storeSetters;
  if (!activeCompanion) return;

  const transcript = mockDialogue[activeUniverse]?.[eventType] || "I don't have a response for that.";
  console.log(`[VoiceEngine] Audio Output Simulated: ${transcript}`);

  await new Promise(resolve => setTimeout(resolve, 500)); 

  setIsSpeaking(true);
  let frame;
  let simulatedDuration = 3000;
  let start = performance.now();

  const simulateVolume = () => {
    const now = performance.now();
    if (now - start < simulatedDuration) {
      setSpeechAudioLevel(Math.random() * 60 + 20);
      frame = requestAnimationFrame(simulateVolume);
    } else {
      setIsSpeaking(false);
      setSpeechAudioLevel(0);
    }
  };

  simulateVolume();
  return transcript;
}
