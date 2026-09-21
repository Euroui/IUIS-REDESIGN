const unitSummary = document.querySelector("#unit-summary");
const yearGroups = document.querySelector("#year-groups");

function renderUnitSummary() {
  const summary = getSummary();
  const metrics = [
    ["Total Units Earned", summary.totalUnits],
    ["Academic Units", summary.academicUnits],
    ["Non-Academic Units", summary.nonAcademicUnits],
    ["Terms Completed", summary.termsCompleted],
  ];

  unitSummary.replaceChildren(
    ...metrics.map(([label, value]) => h("div", {}, h("dt", { text: label }), h("dd", { text: String(value) })))
  );
}

function buildTerm(term) {
  const isCurrent = term.status === "current";

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
      h("td", {}, isCurrent ? statusPill("Enrolled", "is-info") : statusPill("Passed"))
    )
  );

  const details = h(
    "details",
    { class: "info-card term-details", open: true },
    h(
      "summary",
      {},
      h("h3", { class: "summary-title", text: `${term.label}, SY ${term.schoolYear}` }),
      h("span", { class: "summary-meta", text: `${sumUnits(term.courses)} units` }),
      isCurrent && statusPill("In progress", "is-info")
    ),
    h(
      "div",
      { class: "table-wrap" },
      h(
        "table",
        { class: "data-table" },
        h("caption", { class: "visually-hidden", text: `Classes for ${formatTerm(term)}` }),
        h(
          "thead",
          {},
          h(
            "tr",
            {},
            h("th", { scope: "col", text: "Code" }),
            h("th", { scope: "col", text: "Course title" }),
            h("th", { scope: "col", class: "num", text: "Units" }),
            h("th", { scope: "col", text: "Status" })
          )
        ),
        h("tbody", {}, rows)
      )
    )
  );

  return details;
}

function renderYears() {
  /* Group terms by year level, keeping the order they appear in the data. */
  const groups = new Map();
  studentRecord.terms.forEach((term) => {
    if (!groups.has(term.yearLevel)) groups.set(term.yearLevel, []);
    groups.get(term.yearLevel).push(term);
  });

  const sections = [...groups].map(([yearLevel, terms], index) =>
    h(
      "section",
      { class: "year-group", "aria-labelledby": `year-${index}` },
      h("h2", { class: "year-title", id: `year-${index}`, text: yearLevel }),
      terms.map(buildTerm)
    )
  );

  yearGroups.replaceChildren(...sections);
}

renderUnitSummary();
renderYears();
