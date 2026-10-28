/* AI Lesson Plan Generator - template version.
   Plans are built from fixed text templates below. No AI model or API is used. */

// ---------- 1. TEMPLATES ----------
const LEVELS = {
  primary: {
    label: "Primary (ages 6-11)",
    grouping: "pairs or groups of three",
    warmup: "Show a surprising picture or object and ask children to guess what it has to do with today's topic. Let them vote with thumbs up or down.",
    language: "short sentences, simple words and lots of visuals",
    extras: ["Picture cards or real objects", "Coloured pencils and paper"],
    assessment: "Ask each child to draw or say one thing they learned, and observe them during the activity.",
    homework: "A 10-minute task: draw or tell a family member one thing you learned.",
    example: "Use real objects, pictures or a short role-play so children can see and touch the idea."
  },
  middle: {
    label: "Middle school (ages 11-14)",
    grouping: "small groups of 3-4",
    warmup: "Pose a quick question or myth-or-fact statement about the topic. Students discuss with a partner, then share.",
    language: "clear vocabulary with key terms written on the board",
    extras: ["Student notebooks", "Printed worksheet or task cards"],
    assessment: "Use a short quiz or exit ticket plus observation of group work.",
    homework: "A 15-20 minute task: complete a short worksheet or write a paragraph applying the topic.",
    example: "Use a relatable scenario, such as a school or home situation, that links to the topic."
  },
  high: {
    label: "High school (ages 14-18)",
    grouping: "pairs for discussion, then small groups for tasks",
    warmup: "Give a thought-provoking question or short case. Students write a one-minute response before discussing.",
    language: "subject vocabulary with precise definitions",
    extras: ["Student notebooks", "Short reading or case study handout"],
    assessment: "Use a short written response or problem set marked against the objectives.",
    homework: "A 20-30 minute task: answer application questions or write a short explanation using examples.",
    example: "Use a case study or data example that asks students to analyse and justify an answer."
  },
  adult: {
    label: "College / adult learners",
    grouping: "peer discussion groups",
    warmup: "Ask learners to share a work or life experience related to the topic, then link it to today's goals.",
    language: "professional terms, linked to learners' own experience",
    extras: ["Reading or article extract", "Notes or digital device for each learner"],
    assessment: "Use a short reflective write-up or applied problem and give written feedback.",
    homework: "A 30-minute task: apply the topic to a personal or workplace example and note questions.",
    example: "Use a real-world case from learners' fields and ask them to critique or apply it."
  }
};

// How the lesson time is shared between activities (weights add up to 1).
const ACTIVITIES = [
  { key: "warmup", name: "Introduction and warm-up", weight: 0.12 },
  { key: "teach", name: "Direct teaching", weight: 0.25 },
  { key: "guided", name: "Guided practice", weight: 0.25 },
  { key: "practical", name: "Practical activity", weight: 0.20 },
  { key: "assess", name: "Student assessment", weight: 0.12 },
  { key: "wrap", name: "Wrap-up and homework", weight: 0.06 }
];

// ---------- 2. HELPERS ----------
const $ = (id) => document.getElementById(id);
const form = $("plan-form"), output = $("plan-output"), printBtn = $("print-btn");
const FIELDS = ["subject", "topic", "objectives"];

function h(tag, text, cls) {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function list(items, tag = "ul") {
  const l = h(tag);
  items.forEach((i) => l.appendChild(h("li", i)));
  return l;
}
function section(title, ...nodes) {
  const s = h("section", null, "plan-section");
  s.appendChild(h("h3", title));
  nodes.forEach((n) => s.appendChild(n));
  return s;
}

// Splits total minutes across activities so the numbers always add up exactly.
function splitTime(total) {
  const raw = ACTIVITIES.map((a) => a.weight * total);
  const mins = raw.map((r) => Math.max(1, Math.floor(r)));
  let diff = total - mins.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
  for (let k = 0; diff !== 0; k = (k + 1) % order.length) {
    mins[order[k]] += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }
  return mins;
}

// ---------- 3. VALIDATION ----------
function validate(data) {
  const errors = {};
  if (data.subject.length < 2) errors.subject = "Please enter a subject (at least 2 characters).";
  if (data.topic.length < 3) errors.topic = "Please enter a lesson topic (at least 3 characters).";
  if (data.objectives.length === 0) errors.objectives = "Please enter at least one learning objective.";
  else if (data.objectives.length > 5) errors.objectives = "Please enter no more than 5 objectives, one per line.";
  return errors;
}

function showErrors(errors) {
  FIELDS.forEach((f) => {
    const input = $(f), msg = $(f + "-error");
    if (errors[f]) {
      msg.textContent = errors[f]; msg.hidden = false;
      input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", f + "-error");
    } else {
      msg.hidden = true; msg.textContent = "";
      input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby");
    }
  });
}

// ---------- 4. PLAN GENERATOR (templates) ----------
function generatePlan(d) {
  const L = LEVELS[d.level];
  const mins = splitTime(d.duration);
  let start = 0;
  const schedule = ACTIVITIES.map((a, i) => {
    const row = { ...a, minutes: mins[i], from: start, to: start + mins[i] };
    start += mins[i];
    return row;
  });
  const first = d.objectives[0];

  return {
    d, L, schedule,
    materials: ["Board or projector", ...L.extras, `A printed or written task sheet on "${d.topic}"`, `Examples or resources related to ${d.subject}`],
    warmup: [
      L.warmup,
      `Introduce the topic "${d.topic}" and share today's objectives with students.`,
      `Link the topic to what students already know in ${d.subject}.`
    ],
    teach: [
      `Explain the key ideas of "${d.topic}" using ${L.language}.`,
      `Model one worked example while thinking aloud, focusing on the objective: ${first}.`,
      "Pause with two or three quick check questions to see who is following."
    ],
    guided: [
      `Students work in ${L.grouping} on a task about "${d.topic}" while you circulate.`,
      "Give hints rather than answers and note common mistakes.",
      "Share two or three strong responses with the class."
    ],
    practical: [
      `Students complete a hands-on or application task that uses "${d.topic}" in a realistic way.`,
      d.objectives.length > 1
        ? `Make sure the task covers more than one objective, including: ${d.objectives[1]}.`
        : `Make sure the task gives practice in: ${first}.`
    ],
    examples: [
      `Everyday connection: show a real situation where "${d.topic}" appears and ask students to explain it.`,
      `Worked example: demonstrate one ${d.subject} problem or scenario on "${d.topic}" step by step.`,
      `Mini-scenario: give a short situation and ask students to predict or decide what happens, and why.`,
      L.example
    ],
    assessment: [
      L.assessment,
      "Check each objective:",
      ...d.objectives.map((o) => `Can students do this? ${o}`)
    ],
    homework: [L.homework, `Topic: "${d.topic}". Ask students to bring one question for the next lesson.`]
  };
}

// ---------- 5. RENDERING ----------
function render(p) {
  output.innerHTML = "";
  output.appendChild(h("h2", `Lesson Plan: ${p.d.topic}`));
  output.appendChild(h("p", `${p.d.subject} \u00b7 ${p.L.label} \u00b7 ${p.d.duration} minutes`, "plan-meta"));
  output.appendChild(h("p", "Sample plan from built-in templates, not live AI output. Review and adapt it to your class before use.", "plan-notice"));

  output.appendChild(section("Learning objectives", list(p.d.objectives, "ol")));
  output.appendChild(section("Required materials", list(p.materials)));

  // Timing table
  const table = h("table");
  const head = h("tr");
  ["Time", "Activity", "Minutes"].forEach((t) => head.appendChild(h("th", t)));
  table.appendChild(head);
  p.schedule.forEach((s) => {
    const tr = h("tr");
    [`${s.from}-${s.to} min`, s.name, String(s.minutes)].forEach((t) => tr.appendChild(h("td", t)));
    table.appendChild(tr);
  });
  const wrap = h("div", null, "table-wrap");
  wrap.appendChild(table);
  output.appendChild(section("Suggested timing", wrap));

  const byKey = (k) => p.schedule.find((s) => s.key === k);
  const timed = (title, key) => {
    const s = byKey(key);
    const sec = h("section", null, "plan-section");
    const heading = h("h3", title);
    heading.appendChild(h("span", `${s.minutes} min`, "time-badge"));
    sec.appendChild(heading);
    return sec;
  };

  const intro = timed("Introduction and warm-up activity", "warmup");
  intro.appendChild(list(p.warmup));
  output.appendChild(intro);

  const main = h("section", null, "plan-section");
  main.appendChild(h("h3", "Main teaching activities"));
  [["Direct teaching", "teach"], ["Guided practice", "guided"], ["Practical activity", "practical"]].forEach(([title, key]) => {
    const s = byKey(key);
    const sub = h("h4", title);
    sub.appendChild(h("span", `${s.minutes} min`, "time-badge"));
    main.appendChild(sub);
    main.appendChild(list(p[key]));
  });
  output.appendChild(main);

  output.appendChild(section("Practical examples", list(p.examples)));

  const assess = timed("Student assessment", "assess");
  assess.appendChild(list(p.assessment));
  output.appendChild(assess);

  const hw = timed("Homework", "wrap");
  hw.appendChild(list(p.homework));
  output.appendChild(hw);

  output.hidden = false;
  printBtn.disabled = false;
  output.focus();
  output.scrollIntoView({ behavior: "smooth" });
}

// ---------- 6. EVENTS ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    subject: $("subject").value.trim(),
    topic: $("topic").value.trim(),
    level: $("level").value,
    duration: parseInt($("duration").value, 10),
    objectives: $("objectives").value.split("\n").map((s) => s.trim()).filter(Boolean)
  };
  const errors = validate(data);
  showErrors(errors);
  const firstBad = FIELDS.find((f) => errors[f]);
  if (firstBad) { $(firstBad).focus(); return; }
  render(generatePlan(data));
});

printBtn.addEventListener("click", () => window.print());

$("reset-btn").addEventListener("click", () => {
  form.reset();
  showErrors({});
  output.innerHTML = "";
  output.hidden = true;
  printBtn.disabled = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("subject").focus();
});
