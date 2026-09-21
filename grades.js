const termFilter = document.querySelector("#term-filter");
const termList = document.querySelector("#term-list");
const gradeSummary = document.querySelector("#grade-summary");

/* Data is stored oldest first; the page shows newest first. */
const termsNewestFirst = [...studentRecord.terms].reverse();

function renderSummary() {
  const summary = getSummary();
  const metrics = [
    ["Overall GWA", summary.gwa === null ? "\u2014" : summary.gwa.toFixed(2)],
    ["Total Units Earned", summary.totalUnits],
    ["Academic Units", summary.academicUnits],
    ["Non-Academic Units", summary.nonAcademicUnits],
  ];

  gradeSummary.replaceChildren(
    ...metrics.map(([label, value]) => h("div", {}, h("dt", { text: label }), h("dd", { text: String(value) })))
  );
}

function renderFilter() {
  const options = [h("option", { value: "all", text: "All terms" })];
  termsNewestFirst.forEach((term) => {
    options.push(h("option", { value: term.id, text: formatTerm(term) }));
  });
  termFilter.replaceChildren(...options);
}

function buildTermCard(term) {
  const isCurrent = term.status === "current";
  const gwa = computeGwa(term.courses);
  const missingCount = term.courses.filter(
    (course) => typeof course.grade !== "number" || course.grade === "INC" || course.status === "incomplete"
  ).length;
  const titleId = `term-${term.id}`;

  const rows = term.courses.map((course) =>
    h(
      "tr",
      {},
      h("td", { text: course.code }),
      h(
        "td",
        {},
        course.title,
        course.type === "non-academic" && h("span", { class: "tag", text: "Non-academic" })
      ),
      h("td", { class: "num", text: String(course.units) }),
      h("td", { class: "num" }, h("span", { class: "grade", text: formatGrade(course.grade) })),
      h("td", {}, courseRemarks(course))
    )
  );

  const stats = h("dl", { class: "term-stats" });
  stats.append(h("div", {}, h("dt", { text: "Term GWA" }), h("dd", { text: gwa === null ? "\u2014" : gwa.toFixed(2) })));
  if (isCurrent) {
    stats.append(h("div", {}, h("dt", { text: "Status" }), h("dd", {}, statusPill("In progress", "is-info"))));
    stats.append(h("div", {}, h("dt", { text: "Units enrolled" }), h("dd", { text: String(sumUnits(term.courses)) })));
  } else {
    const completionStatus = missingCount
      ? statusPill(`Missing (${missingCount})`, "is-pending")
      : statusPill("Complete");
    stats.append(h("div", {}, h("dt", { text: "Status" }), h("dd", {}, completionStatus)));
    stats.append(h("div", {}, h("dt", { text: "Units earned" }), h("dd", { text: String(sumUnits(term.courses)) })));
  }

  const contentId = `${titleId}-content`;
  const termCard = h(
    "section",
    { class: `info-card term-card grade-term${isCurrent ? " is-open" : ""}`, "aria-labelledby": titleId },
    h(
      "button",
      {
        class: "term-toggle term-card-header",
        type: "button",
        "aria-expanded": String(isCurrent),
        "aria-controls": contentId,
      },
      h(
        "div",
        {},
        h("h2", { class: "block-title", id: titleId, text: term.label }),
        h("p", { class: "term-meta", text: `SY ${term.schoolYear}, ${term.yearLevel}` })
      ),
      stats
    ),
    h(
      "div",
      { class: "term-content", id: contentId },
      h(
        "div",
        { class: "term-content-inner" },
        h(
          "div",
          { class: "table-wrap" },
          h(
            "table",
            { class: "data-table" },
            h("caption", { class: "visually-hidden", text: `Grades for ${formatTerm(term)}` }),
            h(
              "thead",
              {},
              h(
                "tr",
                {},
                h("th", { scope: "col", text: "Code" }),
                h("th", { scope: "col", text: "Course title" }),
                h("th", { scope: "col", class: "num", text: "Units" }),
                h("th", { scope: "col", class: "num", text: "Grade" }),
                h("th", { scope: "col", text: "Remarks" })
              )
            ),
            h("tbody", {}, rows)
          )
        ),
        isCurrent && h("p", { class: "table-note", text: "Grades appear here once your instructors submit them." })
      )
    )
  );

  termCard.querySelector(".term-toggle").addEventListener("click", () => {
    const isOpen = termCard.classList.toggle("is-open");
    termCard.querySelector(".term-toggle").setAttribute("aria-expanded", String(isOpen));
  });

  return termCard;
}

function renderTerms() {
  const selected = termFilter.value;
  const visible = selected === "all" ? termsNewestFirst : termsNewestFirst.filter((t) => t.id === selected);
  termList.replaceChildren(...visible.map(buildTermCard));
}

renderSummary();
renderFilter();
renderTerms();
termFilter.addEventListener("change", renderTerms);
