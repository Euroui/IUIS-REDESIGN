const STORAGE_KEY = "wvsu-faculty-evaluations";

/* Statements are grouped by area. Change the wording here; the form rebuilds itself. */
const evaluationCriteria = [
  {
    title: "Commitment",
    items: [
      "Comes to class prepared and on time.",
      "Uses class time well and covers the topics in the course outline.",
    ],
  },
  {
    title: "Knowledge of the subject",
    items: [
      "Explains topics clearly and accurately.",
      "Connects lessons to real-world and industry examples.",
    ],
  },
  {
    title: "Teaching for independent learning",
    items: [
      "Encourages questions and class discussion.",
      "Gives activities that help me think and work on my own.",
    ],
  },
  {
    title: "Management of learning",
    items: [
      "Gives clear requirements, deadlines, and grading criteria.",
      "Returns graded work with useful feedback in a reasonable time.",
    ],
  },
];
const statementCount = evaluationCriteria.reduce((total, group) => total + group.items.length, 0);

const currentTerm = studentRecord.terms.find((term) => term.status === "current");
const coursesToEvaluate = currentTerm ? currentTerm.courses.filter((course) => course.instructor) : [];
const evaluationOpen = false;

const termLabel = document.querySelector("#term-label");
const evaluationCount = document.querySelector("#evaluation-count");
const evaluationMeter = document.querySelector("#evaluation-meter");
const evaluationList = document.querySelector("#evaluation-list");
const pageStatus = document.querySelector("#page-status");

const dialog = document.querySelector("#evaluation-dialog");
const form = document.querySelector("#evaluation-form");
const dialogTitle = document.querySelector("#dialog-title");
const dialogSubtitle = document.querySelector("#dialog-subtitle");
const criteriaContainer = document.querySelector("#criteria");
const commentsInput = document.querySelector("#comments");
const errorText = document.querySelector("#evaluation-error");
const submitButton = document.querySelector("#dialog-submit");

let activeCourse = null;

/* ---------- Storage (falls back to memory if the browser blocks localStorage) ---------- */

function loadStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

let store = loadStore();

function saveStore() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    /* Private mode or blocked storage: answers last until the page is closed. */
  }
}

function getEntry(course) {
  return store[currentTerm.id] && store[currentTerm.id][course.code];
}

function setEntry(course, entry) {
  store[currentTerm.id] = store[currentTerm.id] || {};
  store[currentTerm.id][course.code] = entry;
  saveStore();
}

/* ---------- List ---------- */

function buildItem(course) {
  const entry = getEntry(course);

  const button = h("button", {
    class: entry ? "outline-button" : "primary-button",
    type: "button",
    text: entry ? "Edit evaluation" : "Evaluate",
    "data-code": course.code,
  });
  button.addEventListener("click", () => openDialog(course));

  return h(
    "li",
    { class: "info-card evaluation-item" },
    h(
      "div",
      {},
      h("p", { class: "course-code", text: course.code }),
      h("h2", { class: "block-title", text: course.title }),
      h("p", { class: "instructor" }, "Instructor: ", h("strong", { text: course.instructor }))
    ),
    h("footer", {}, entry ? statusPill("Submitted") : statusPill("Pending", "is-pending"), button)
  );
}

function renderList() {
  const total = coursesToEvaluate.length;
  const done = coursesToEvaluate.filter((course) => getEntry(course)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  if (!evaluationOpen) {
    evaluationCount.textContent = "Faculty evaluation is currently closed.";
    evaluationMeter.firstElementChild.style.width = "0%";
    evaluationMeter.setAttribute("aria-label", "Faculty evaluation closed");
    evaluationList.replaceChildren(
      h(
        "li",
        { class: "info-card evaluation-closed" },
        h("h2", { class: "block-title", text: "Evaluation period closed" }),
        h("p", { class: "card-note", text: "Evaluation forms will be available when the next evaluation period opens." })
      )
    );
    return;
  }

  evaluationCount.textContent = total
    ? `${done} of ${total} evaluations submitted`
    : "There are no evaluations open right now.";
  evaluationMeter.firstElementChild.style.width = `${percent}%`;
  evaluationMeter.setAttribute("aria-label", `${percent} percent of evaluations submitted`);
  evaluationList.replaceChildren(...coursesToEvaluate.map(buildItem));
}

/* ---------- Dialog ---------- */

function buildCriteria(savedRatings) {
  let index = 0;

  const groups = evaluationCriteria.map((group) => {
    const fieldsets = group.items.map((statement) => {
      const name = `q${index}`;
      index += 1;

      const options = [1, 2, 3, 4, 5].map((value) =>
        h(
          "label",
          {},
          h("input", {
            type: "radio",
            name,
            value: String(value),
            checked: savedRatings && savedRatings[name] === value,
          }),
          h("span", { text: String(value) })
        )
      );

      return h(
        "fieldset",
        { class: "rating-item" },
        h("legend", { text: statement }),
        h("div", { class: "rating-scale" }, options)
      );
    });

    return h("div", { class: "criteria-group" }, h("h3", { text: group.title }), fieldsets);
  });

  criteriaContainer.replaceChildren(...groups);
}

function openDialog(course) {
  const entry = getEntry(course);
  activeCourse = course;

  dialogTitle.textContent = `Evaluate ${course.instructor}`;
  dialogSubtitle.textContent = `${course.code} ${course.title}`;
  buildCriteria(entry && entry.ratings);
  commentsInput.value = entry ? entry.comments : "";
  errorText.textContent = "";
  errorText.classList.remove("is-error");
  submitButton.textContent = entry ? "Update evaluation" : "Submit evaluation";

  dialog.showModal();
}

function closeDialog() {
  dialog.close();
}

criteriaContainer.addEventListener("change", (event) => {
  const fieldset = event.target.closest("fieldset");
  if (fieldset) fieldset.classList.remove("is-missing");
});

document.querySelector("#dialog-close").addEventListener("click", closeDialog);
document.querySelector("#dialog-cancel").addEventListener("click", closeDialog);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const ratings = {};
  const missing = [];

  for (let i = 0; i < statementCount; i += 1) {
    const name = `q${i}`;
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    const fieldset = form.querySelector(`input[name="${name}"]`).closest("fieldset");

    if (checked) {
      ratings[name] = Number(checked.value);
      fieldset.classList.remove("is-missing");
    } else {
      missing.push(fieldset);
      fieldset.classList.add("is-missing");
    }
  }

  if (missing.length) {
    const count = missing.length;
    errorText.textContent =
      count === 1
        ? "1 statement still needs a rating. Rate every statement to continue."
        : `${count} statements still need a rating. Rate every statement to continue.`;
    errorText.classList.add("is-error");
    missing[0].querySelector("input").focus();
    return;
  }

  const wasEdit = Boolean(getEntry(activeCourse));
  setEntry(activeCourse, {
    ratings,
    comments: commentsInput.value.trim(),
    submittedAt: new Date().toISOString(),
  });

  const course = activeCourse;
  closeDialog();
  renderList();
  pageStatus.textContent = `Evaluation for ${course.instructor} ${wasEdit ? "updated" : "submitted"}.`;

  /* The list was rebuilt, so put focus back on the matching button. */
  const button = [...evaluationList.querySelectorAll("button")].find((b) => b.dataset.code === course.code);
  if (button) button.focus();
});

/* ---------- Start ---------- */

if (currentTerm) {
  termLabel.textContent = `Rate each of your instructors for ${formatTerm(currentTerm)}.`;
}
renderList();
