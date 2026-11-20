// =====================================================================
//  SETTINGS — how "ready" is decided. Change these numbers to tune it.
// =====================================================================
const PASS_MARK = 60;       // Goethe A1 pass mark is 60%. Below this = "Not yet".
const READY_MARK = 80;      // We ask for 80% to leave a safety margin above the pass mark.
const GUESS_CREDIT = 0.5;   // A correct answer the learner says they guessed counts as half.
const MAX_TIPS = 3;         // How many practice tips to show.
const MAX_PLAYS = 2;        // How often a listening clip can be played (like the real exam).

// =====================================================================
//  APP STATE
// =====================================================================
let current = 0;      // which question we are on
let answers = [];     // answers[i] = { choice, guessed, plays }
let habits = [];      // habits[i] = true (yes) / false (no) / null (not answered)

const $ = (id) => document.getElementById(id);

function show(screenId) {
  ["start", "quiz", "habits", "result"].forEach((id) => $(id).classList.toggle("hidden", id !== screenId));
  window.scrollTo(0, 0);
}

// =====================================================================
//  QUIZ
// =====================================================================
function startQuiz() {
  current = 0;
  answers = QUESTIONS.map(() => ({ choice: null, guessed: false, plays: 0 }));
  habits = HABITS.map(() => null);
  show("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[current];
  const a = answers[current];

  $("progress-text").textContent = `Question ${current + 1} of ${QUESTIONS.length} · ${q.skill}`;
  $("progress-bar").style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;

  $("passage").textContent = q.text || "";
  $("passage").classList.toggle("hidden", !q.text);

  // Listening: show a play button instead of text
  $("listen").classList.toggle("hidden", !q.audio);
  if (q.audio) {
    const left = MAX_PLAYS - a.plays;
    $("play-btn").disabled = left <= 0;
    $("play-btn").textContent = left > 0 ? `▶ Play audio (${left} left)` : "No plays left";
  }

  $("prompt").textContent = q.prompt;

  $("options").innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option" + (a.choice === i ? " selected" : "");
    btn.textContent = opt;
    btn.onclick = () => { a.choice = i; renderQuestion(); };
    $("options").appendChild(btn);
  });

  $("guessed").checked = a.guessed;
  $("back-btn").disabled = current === 0;
  $("next-btn").disabled = a.choice === null;
}

// Reads the German sentence aloud using the browser's built-in voice.
function playAudio() {
  const q = QUESTIONS[current];
  const a = answers[current];
  if (!("speechSynthesis" in window)) {
    alert("Your browser can't play audio. The sentence is: " + q.audio);
    return;
  }
  speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(q.audio);
  speech.lang = "de-DE";
  speech.rate = 0.9;
  const german = speechSynthesis.getVoices().find((v) => v.lang.startsWith("de"));
  if (german) speech.voice = german;
  else $("listen-note").textContent = "Your browser has no German voice, so this may sound wrong. For best results open this page in Chrome or Edge.";
  speechSynthesis.speak(speech);
  a.plays++;
  renderQuestion();
}

function nextQuestion() {
  if (current < QUESTIONS.length - 1) { current++; renderQuestion(); }
  else { show("habits"); renderHabits(); }
}

function prevQuestion() {
  if (current > 0) { current--; renderQuestion(); }
}

// =====================================================================
//  EXAM HABITS (yes / no)
// =====================================================================
function renderHabits() {
  $("habit-list").innerHTML = HABITS.map((h, i) => `
    <div class="habit">
      <p>${h.question}</p>
      <div class="yesno">
        <button class="option ${habits[i] === true ? "selected" : ""}" onclick="setHabit(${i}, true)">Yes</button>
        <button class="option ${habits[i] === false ? "selected" : ""}" onclick="setHabit(${i}, false)">No</button>
      </div>
    </div>`).join("");
  $("result-btn").disabled = habits.includes(null);
}

function setHabit(i, value) {
  habits[i] = value;
  renderHabits();
}

// =====================================================================
//  SCORING — this is where "ready" is calculated
// =====================================================================

// Points for one question: 1 if right, 0.5 if right but guessed, 0 if wrong.
function pointsFor(i) {
  const a = answers[i];
  if (a.choice !== QUESTIONS[i].answer) return 0;
  return a.guessed ? GUESS_CREDIT : 1;
}

// Turn a percentage into a label.
function band(pct) {
  if (pct >= READY_MARK) return { label: "Ready", cls: "ready" };
  if (pct >= PASS_MARK) return { label: "Almost", cls: "almost" };
  return { label: "Not yet", cls: "notyet" };
}

function calculate() {
  // 1. Score per skill
  const skills = {};
  QUESTIONS.forEach((q, i) => {
    skills[q.skill] = skills[q.skill] || { points: 0, total: 0 };
    skills[q.skill].points += pointsFor(i);
    skills[q.skill].total += 1;
  });
  for (const s in skills) skills[s].pct = Math.round((skills[s].points / skills[s].total) * 100);

  // 2. Overall = average of the skills (each skill counts equally)
  const pcts = Object.values(skills).map((s) => s.pct);
  const overall = Math.round(pcts.reduce((x, y) => x + y, 0) / pcts.length);
  const weakest = Math.min(...pcts);

  // 3. Exam habits the learner said "No" to
  const missingHabits = HABITS.filter((h, i) => habits[i] === false);

  // 4. Verdict: "ready" needs a high average, no weak skill, AND the exam habits in place
  let verdict;
  if (overall >= READY_MARK && weakest >= PASS_MARK && missingHabits.length === 0) verdict = "ready";
  else if (overall >= PASS_MARK) verdict = "almost";
  else verdict = "notyet";

  // 5. Practice tips: topics where the learner lost the most points
  const lost = {};
  QUESTIONS.forEach((q, i) => { lost[q.topic] = (lost[q.topic] || 0) + (1 - pointsFor(i)); });
  const topicTips = Object.entries(lost)
    .filter(([, pts]) => pts > 0)
    .sort((x, y) => y[1] - x[1])
    .map(([topic]) => ({ title: topic, text: TOPIC_TIPS[topic] }));

  // Habit tips come first (they are the most common reason people fail), then topic tips.
  const tips = [...missingHabits.map((h) => h.tip), ...topicTips].slice(0, MAX_TIPS);

  // Always give at least 2 tips.
  const extra = [
    { title: "Do one more mock exam", text: "A second timed Goethe Übungssatz a few days before the exam confirms you're still on track." },
    { title: "Listen to German every day", text: "10 minutes of slow, simple German audio a day (for example DW's free A1 course “Nicos Weg”) keeps your listening sharp." },
  ];
  while (tips.length < 2) tips.push(extra.shift());

  return { skills, overall, verdict, tips, missingHabits };
}

// =====================================================================
//  RESULT SCREEN
// =====================================================================
const VERDICTS = {
  ready:  { title: "You look ready to book your A1 exam", text: "You are comfortably above the 60% pass mark in every skill we checked, and you've practised under exam conditions." },
  almost: { title: "Almost there — practise a little before booking", text: "You are close, but a weak skill or a missing exam habit could cost you on the day. Fix the points below first." },
  notyet: { title: "Not ready yet — don't book the exam just yet", text: "You are below the 60% pass mark. Booking now risks losing your exam fee. Work on the topics below and take the check again." },
};

function showResult() {
  const r = calculate();
  show("result");

  $("verdict").className = "verdict " + r.verdict;
  $("verdict-title").textContent = VERDICTS[r.verdict].title;
  $("verdict-text").textContent = VERDICTS[r.verdict].text;
  $("overall").textContent = `${r.overall}%`;

  $("skills").innerHTML = Object.entries(r.skills).map(([name, s]) => {
    const b = band(s.pct);
    return `
      <div class="skill">
        <div class="skill-head"><span>${name}</span><span class="tag ${b.cls}">${b.label} · ${s.pct}%</span></div>
        <div class="bar"><div class="fill ${b.cls}" style="width:${s.pct}%"></div><div class="mark" style="left:${PASS_MARK}%"></div></div>
      </div>`;
  }).join("");

  $("tips").innerHTML = r.tips.map((t) => `<li><strong>${t.title}</strong><span>${t.text}</span></li>`).join("");

  $("review").innerHTML = QUESTIONS.map((q, i) => {
    const a = answers[i];
    const right = a.choice === q.answer;
    const label = q.audio ? `🔊 „${q.audio}“ — ${q.prompt}` : q.prompt;
    return `<li class="${right ? "right" : "wrong"}">
      <span class="q">${label}</span>
      <span class="a">${right ? "✓" : "✗"} Your answer: ${q.options[a.choice]}${a.guessed ? " (guessed)" : ""}
      ${right ? "" : ` · Correct: ${q.options[q.answer]}`}</span></li>`;
  }).join("");
}

// =====================================================================
//  WIRING
// =====================================================================
$("start-btn").onclick = startQuiz;
$("restart-btn").onclick = startQuiz;
$("next-btn").onclick = nextQuestion;
$("back-btn").onclick = prevQuestion;
$("play-btn").onclick = playAudio;
$("result-btn").onclick = showResult;
$("guessed").onchange = (e) => { answers[current].guessed = e.target.checked; };
$("question-count").textContent = QUESTIONS.length;
if ("speechSynthesis" in window) speechSynthesis.getVoices(); // pre-load voices
