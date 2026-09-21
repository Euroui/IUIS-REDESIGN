/*
  Sample student record shared by the Grades, Curriculum and Faculty Evaluation pages.
  Everything below is placeholder data: swap it for real records (or an API response)
  when the back end is ready. The pages only read from `studentRecord`.

  Term order: oldest first.
  Course type: "academic" counts toward GWA, "non-academic" (e.g. NSTP) does not.
  status: "completed" | "current"
*/
const studentRecord = {
  id: "2025M0767",
  terms: [
    {
      id: "2025-1",
      label: "First Semester",
      schoolYear: "2025-2026",
      yearLevel: "First Year",
      status: "completed",
      courses: [
        { code: "GEC 1", title: "Understanding the Self", units: 3, grade: 1.25, type: "academic" },
        { code: "GEC 2", title: "Readings in Philippine History", units: 3, grade: 1.5, type: "academic" },
        { code: "GEC 3", title: "The Contemporary World", units: 3, grade: 1.5, type: "academic" },
        { code: "GEC 4", title: "Mathematics in the Modern World", units: 3, grade: 1.25, type: "academic" },
        { code: "GEC 5", title: "Purposive Communication", units: 3, grade: 1.5, type: "academic" },
        { code: "IT 101", title: "Introduction to Computing", units: 3, grade: 1.0, type: "academic" },
        { code: "IT 102", title: "Computer Programming 1", units: 3, grade: 1.25, type: "academic" },
        { code: "IT 103", title: "Discrete Mathematics", units: 3, grade: 1.5, type: "academic" },
        { code: "NSTP 1", title: "National Service Training Program 1", units: 3, grade: 1.0, type: "non-academic" },
      ],
    },
    {
      id: "2025-2",
      label: "Second Semester",
      schoolYear: "2025-2026",
      yearLevel: "First Year",
      status: "completed",
      courses: [
        { code: "GEC 6", title: "Art Appreciation", units: 3, grade: 1.25, type: "academic" },
        { code: "GEC 7", title: "Science, Technology and Society", units: 3, grade: 1.25, type: "academic" },
        { code: "GEC 8", title: "Ethics", units: 3, grade: 1.5, type: "academic" },
        { code: "GEC 9", title: "The Life and Works of Rizal", units: 3, grade: 1.5, type: "academic" },
        { code: "IT 104", title: "Computer Programming 2", units: 3, grade: 1.0, type: "academic" },
        { code: "IT 105", title: "Human Computer Interaction", units: 3, grade: 1.5, type: "academic" },
        { code: "IT 106", title: "Digital Logic Design", units: 3, grade: 1.25, type: "academic" },
        { code: "IT 107", title: "Web Systems and Technologies", units: 3, grade: 1.25, type: "academic" },
        { code: "NSTP 2", title: "National Service Training Program 2", units: 3, grade: 1.0, type: "non-academic" },
      ],
    },
    {
      id: "2025-M",
      label: "Midyear",
      schoolYear: "2025-2026",
      yearLevel: "First Year",
      status: "completed",
      courses: [
        { code: "IT 108", title: "Networking 1", units: 3, grade: 1.25, type: "academic" },
        { code: "IT 109", title: "Information Management 1", units: 3, grade: 1.0, type: "academic" },
        { code: "IT 110", title: "Quantitative Methods", units: 3, grade: 1.5, type: "academic" },
        { code: "GEE 1", title: "Gender and Society", units: 3, grade: 1.25, type: "academic" },
        { code: "GEE 2", title: "Living in the IT Era", units: 3, grade: 1.5, type: "academic" },
      ],
    },
    {
      id: "2026-1",
      label: "First Semester",
      schoolYear: "2026-2027",
      yearLevel: "Second Year",
      status: "current",
      courses: [
        { code: "IT 201", title: "Data Structures and Algorithms", units: 3, grade: null, type: "academic", instructor: "REYES, ANA B." },
        { code: "IT 202", title: "Object-Oriented Programming", units: 3, grade: null, type: "academic", instructor: "VILLANUEVA, CARLO D." },
        { code: "IT 203", title: "Networking 2", units: 3, grade: null, type: "academic", instructor: "RAMOS, EDUARDO P." },
        { code: "IT 204", title: "Information Management 2", units: 3, grade: null, type: "academic", instructor: "GONZALES, LIZA M." },
        { code: "IT 205", title: "Platform Technologies", units: 3, grade: null, type: "academic", instructor: "TORRES, GRACE S." },
        { code: "IT 206", title: "Integrative Programming and Technologies", units: 3, grade: null, type: "academic", instructor: "AQUINO, MARK J." },
      ],
    },
  ],
};

/* ---------- Helpers ---------- */

function formatTerm(term) {
  return `${term.label}, SY ${term.schoolYear}`;
}

function formatGrade(grade) {
  return typeof grade === "number" ? grade.toFixed(2) : "\u2014";
}

function sumUnits(courses) {
  return courses.reduce((total, course) => total + course.units, 0);
}

/* Weighted average of graded academic courses. Returns null when nothing is graded. */
function computeGwa(courses) {
  const graded = courses.filter((c) => c.type === "academic" && typeof c.grade === "number");
  const units = sumUnits(graded);
  if (!units) return null;
  return graded.reduce((total, c) => total + c.grade * c.units, 0) / units;
}

/* Totals across every completed term. */
function getSummary() {
  const completed = studentRecord.terms.filter((t) => t.status === "completed");
  const courses = completed.flatMap((t) => t.courses);
  const academicUnits = sumUnits(courses.filter((c) => c.type === "academic"));
  const nonAcademicUnits = sumUnits(courses.filter((c) => c.type === "non-academic"));
  return {
    gwa: computeGwa(courses),
    totalUnits: academicUnits + nonAcademicUnits,
    academicUnits,
    nonAcademicUnits,
    termsCompleted: completed.length,
  };
}

/* Tiny DOM builder: h("td", { class: "num", text: "3" }, child, child) */
function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child);
  }
  return node;
}

function statusPill(text, variant) {
  return h("span", { class: variant ? `status-pill ${variant}` : "status-pill", text });
}

function courseRemarks(course) {
  if (typeof course.grade !== "number") return statusPill("Ongoing", "is-info");
  if (course.grade > 3) return statusPill("Failed", "is-failed");
  return statusPill("Passed");
}
