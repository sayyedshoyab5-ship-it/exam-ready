# Am I exam-ready? — A1 German readiness check

A 5-minute check that tells an A1 German learner whether they are ready to book the Goethe / ÖSD A1 exam, broken down by skill, and the 2–3 things to practise first.

Built for the Globio Founder's Office – Product Manager Intern assignment.

**Live app:** https://sayyedshoyab5-ship-it.github.io/exam-ready/

## Discovery first: why do A1 learners fail?

Before building, I looked at public accounts of learners who failed or nearly failed Goethe A1 (r/German threads, exam-prep guides for Indian learners, Goethe's own scoring rules). Three patterns came up again and again:

1. **Confidence ≠ readiness.** Several learners who failed had "studied hard", done sample papers and *felt* confident. Self-assessment is unreliable.
2. **The skills that fail people are the ones you can't self-check.** Learners reported that listening (Hören) and especially speaking (Sprechen) were where they lost points or panicked. Some had never spoken German to another person before the exam.
3. **Exam conditions, not German.** Nerves, not reading the question before the audio, and running out of time cost points even when learners knew the language. One learner missed the pass mark at 58/100 and put it down to nerves.

At A1 a failed exam means repeating the **whole** exam and paying the **full** fee again, so a wrong "you're ready" is expensive.

**Target learner:** someone who has finished an A1 course or self-study, feels ready because the grammar and reading feel easy, but hasn't tested listening or speaking under exam conditions.

## How the app responds to that

- **Listening section:** the browser reads German aloud (built-in speech, no audio files), at most twice per clip, like the real exam. It includes German's "backwards" numbers (87 = sieben-und-achtzig).
- **"I guessed" checkbox:** a lucky guess counts as half a point, so it can't inflate readiness.
- **Exam-habits check:** 3 yes/no questions (spoken German with a person? done a timed mock exam? can write a 30-word message?). A "No" can't lower your skill scores, but it stops the verdict from being "Ready" and becomes your first practice tip.

## How "ready" is calculated

| Rule | Why |
|---|---|
| Correct = 1 point, correct but guessed = 0.5, wrong = 0 | A lucky guess should not make someone feel ready |
| Skill score = points ÷ questions in that skill (4 skills) | Shows where the learner is weak |
| **Ready** ≥ 80%, **Almost** 60–79%, **Not yet** < 60% | Goethe A1 pass mark is 60%. With 3–4 questions per skill one mistake moves a score by 25–33%, and nerves cost points on the day, so we want a safety margin above 60% |
| Overall verdict "Ready" only if: average ≥ 80% **and** no skill below 60% **and** all exam habits are "Yes" | One weak skill, or never having spoken German aloud, is a real risk even with a good average |
| Tips = missing exam habits first, then the topics where the most points were lost | Specific next steps instead of "study more" |

## Code structure

No framework, no build step — just open `index.html` in a browser.

| File | What it does |
|---|---|
| `index.html` | The four screens: start, quiz, exam habits, result |
| `questions.js` | All questions, the exam-habit questions, and the practice tip for each topic — **edit here to change content** |
| `app.js` | Settings at the top (pass mark, ready mark, guess credit, plays), then quiz flow, scoring (`calculate()`) and the result screen |
| `style.css` | Styling |

## Common changes

- **Add a question:** copy one block in `questions.js`, change the text, and set `answer` to the index of the correct option (0 = first).
- **Add a listening question:** same, but add an `audio: "German sentence"` line.
- **Change what "ready" means:** edit `READY_MARK`, `PASS_MARK` or `GUESS_CREDIT` at the top of `app.js`.
- **Add an exam-habit question:** add an entry to `HABITS` in `questions.js`.
- **Show more or fewer tips:** change `MAX_TIPS` in `app.js`.

## Limitations / next steps

- The discovery is desk research from public posts, not interviews. Next step: talk to five real Globio learners.
- Speaking and writing are checked by self-report, not tested.
- 15 questions is a small sample; v2 would use a larger question bank and randomise questions.
- The 80% bar is a reasoned guess. It should be checked against real learners' exam results.
