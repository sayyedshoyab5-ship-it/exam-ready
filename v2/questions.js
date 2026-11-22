// =====================================================================
//  QUESTIONS — edit this file to add, remove or change questions.
//  Each question needs:
//    skill   : "Vocabulary" | "Grammar" | "Reading" | "Listening"
//    topic   : a short name; wrong answers on the same topic are grouped
//              into one practice recommendation (see TOPIC_TIPS below)
//    text    : optional reading passage shown above the question
//    audio   : optional German sentence the browser reads aloud (Listening)
//    prompt  : the question
//    options : the answer choices
//    answer  : the index of the correct option (0 = first option)
// =====================================================================

const QUESTIONS = [
  // ---------- VOCABULARY ----------
  {
    skill: "Vocabulary",
    topic: "Numbers & time",
    prompt: "Es ist 7:45 Uhr. How do you say this in German?",
    options: ["Viertel nach sieben", "Halb acht", "Viertel vor acht", "Viertel vor sieben"],
    answer: 2,
  },
  {
    skill: "Vocabulary",
    topic: "Everyday words",
    prompt: "Which word does NOT belong?",
    options: ["Montag", "Dienstag", "Januar", "Freitag"],
    answer: 2,
  },
  {
    skill: "Vocabulary",
    topic: "Everyday words",
    prompt: "What is the opposite of „teuer“?",
    options: ["billig", "groß", "alt", "schnell"],
    answer: 0,
  },
  {
    skill: "Vocabulary",
    topic: "Everyday phrases",
    prompt: "You have finished eating in a restaurant. What do you say to the waiter?",
    options: ["Guten Appetit!", "Die Rechnung, bitte.", "Wie heißen Sie?", "Ich komme aus Indien."],
    answer: 1,
  },

  // ---------- GRAMMAR ----------
  {
    skill: "Grammar",
    topic: "Verb endings",
    prompt: "Wir ___ aus Pune.",
    options: ["komme", "kommst", "kommt", "kommen"],
    answer: 3,
  },
  {
    skill: "Grammar",
    topic: "Articles & accusative",
    prompt: "Hast du ___ Bruder?",
    options: ["ein", "einen", "eine", "einem"],
    answer: 1,
  },
  {
    skill: "Grammar",
    topic: "Word order & modal verbs",
    prompt: "Which sentence is correct?",
    options: [
      "Heute ich gehe ins Kino.",
      "Heute gehe ich ins Kino.",
      "Heute ins Kino ich gehe.",
      "Ich heute gehe ins Kino.",
    ],
    answer: 1,
  },
  {
    skill: "Grammar",
    topic: "Word order & modal verbs",
    prompt: "Ich ___ einen Kaffee trinken.",
    options: ["möchtest", "möchten", "möchte", "möchtet"],
    answer: 2,
  },

  // ---------- READING ----------
  {
    skill: "Reading",
    topic: "Reading messages",
    text:
      "Hallo Jonas,\nich bin am Samstag nicht zu Hause. Ich besuche meine Oma in Hamburg. " +
      "Können wir am Sonntag um 15 Uhr Fußball spielen? Bitte ruf mich an!\nLiebe Grüße, Mia",
    prompt: "Where is Mia on Saturday?",
    options: ["At home", "In Hamburg", "At football", "At Jonas's house"],
    answer: 1,
  },
  {
    skill: "Reading",
    topic: "Reading messages",
    text:
      "Hallo Jonas,\nich bin am Samstag nicht zu Hause. Ich besuche meine Oma in Hamburg. " +
      "Können wir am Sonntag um 15 Uhr Fußball spielen? Bitte ruf mich an!\nLiebe Grüße, Mia",
    prompt: "What should Jonas do?",
    options: ["Write Mia an email", "Visit the grandmother", "Call Mia", "Come on Saturday"],
    answer: 2,
  },
  {
    skill: "Reading",
    topic: "Reading signs & ads",
    text: "Praxis Dr. Weber\nSprechzeiten: Mo–Fr 8–12 Uhr\nMittwoch auch 15–18 Uhr\nSamstag geschlossen",
    prompt: "You want to see the doctor on Wednesday afternoon. Is that possible?",
    options: [
      "Yes, from 15 to 18 Uhr",
      "No, only in the mornings",
      "No, closed on Wednesday",
      "Yes, the whole day",
    ],
    answer: 0,
  },
  {
    skill: "Reading",
    topic: "Reading signs & ads",
    text: "Zimmer frei!\n20 m², Küche und Bad, 350 € warm.\nNur für Nichtraucher.\nTel. 0176 123456",
    prompt: "Richtig oder falsch? „You smoke. You can rent this room.“",
    options: ["Richtig (true)", "Falsch (false)"],
    answer: 1,
  },

  // ---------- LISTENING (the browser reads the German aloud) ----------
  {
    skill: "Listening",
    topic: "Hearing numbers & times",
    audio: "Der Zug nach München fährt um vierzehn Uhr dreißig von Gleis sieben.",
    prompt: "When does the train to Munich leave?",
    options: ["13:40", "14:30", "4:30", "14:13"],
    answer: 1,
  },
  {
    skill: "Listening",
    topic: "Hearing numbers & times",
    audio: "Die Schuhe kosten siebenundachtzig Euro.",
    prompt: "How much do the shoes cost?",
    options: ["78 €", "807 €", "87 €", "68 €"],
    answer: 2,
  },
  {
    skill: "Listening",
    topic: "Understanding short messages",
    audio: "Hallo Anna, hier ist Tom. Ich kann heute leider nicht kommen. Ich bin krank. Wir sehen uns am Freitag.",
    prompt: "Why can't Tom come today?",
    options: ["He has to work", "He is ill", "He is on holiday", "His train is late"],
    answer: 1,
  },
];

// =====================================================================
//  EXAM HABITS — asked after the questions. Not scored as a %, but a
//  "No" stops the verdict from being "Ready" and adds a practice tip.
//  Why: learners most often fail on speaking and nerves, which a
//  multiple-choice quiz cannot measure.
// =====================================================================
const HABITS = [
  {
    question: "In the last 2 weeks, have you spoken German out loud with another person (teacher, tutor, friend)?",
    tip: { title: "Speak German out loud with a person", text: "Many learners fail because the first time they speak German to someone is in the exam room. Do 3 short practice calls: introduce yourself, ask and answer questions, make a request." },
  },
  {
    question: "Have you done at least one full, timed mock exam, including the listening audio?",
    tip: { title: "Do a full timed mock exam", text: "Download the free Goethe A1 Übungssatz, set a timer and do all four parts with the audio. Nerves and running out of time cost points even when you know the German." },
  },
  {
    question: "Can you write a short message (about 30 words) in German without a translator?",
    tip: { title: "Practise the writing task", text: "Write one 30-word message a day (invite a friend, cancel an appointment). Answer every point in the task and keep sentences simple." },
  },
];

// What to tell the learner to practise, per topic.
const TOPIC_TIPS = {
  "Numbers & time":
    "Say clock times and prices out loud every day (halb, Viertel vor/nach).",
  "Everyday words":
    "Learn word groups: days, months, food, family, opposites (teuer/billig, groß/klein). 10 flashcards a day.",
  "Everyday phrases":
    "Practise short situations: ordering food, asking for the bill, asking the way. These are exactly the Sprechen tasks.",
  "Verb endings":
    "Drill the present tense of common verbs (kommen, wohnen, haben, sein) for ich/du/er/wir/ihr/sie.",
  "Articles & accusative":
    "Learn every noun with its article (der/die/das). Then practise der → den, ein → einen after verbs like haben, brauchen, kaufen.",
  "Word order & modal verbs":
    "Remember: the verb is always in position 2. With möchten/können/müssen, the second verb goes to the end.",
  "Reading messages":
    "Read short emails and texts and answer: who, where, when, what should I do? Underline times and places.",
  "Reading signs & ads":
    "Read real signs, opening hours and small ads. Watch for words like nur, geschlossen, nicht, auch — they decide the answer.",
  "Hearing numbers & times":
    "German says numbers backwards (87 = sieben-und-achtzig). Listen to train announcements and prices and write down the number you hear.",
  "Understanding short messages":
    "Read the question BEFORE the audio plays, then listen only for that one detail. Practise with Goethe A1 Hören audio.",
};
