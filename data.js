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
        { code: "CC 201", title: "Introduction to Computing", units: 3, grade: 1.0, type: "academic", instructor: "Madresta Tracy Marie Andrea C." },
        { code: "CC 202", title: "Computer Programming 1", units: 3, grade: 1.25, type: "academic", instructor: "Simbran Angelica Grace" },
        { code: "CIT 201", title: "Discrete Structures 1", units: 3, grade: 1.5, type: "academic", instructor: "Gabawa Lea" },
        { code: "CWTS 101", title: "Civic Welfare Training Service 1", units: 3, grade: 1.0, type: "non-academic", instructor: "Gerona Bernard V." },
        { code: "MTH 101", title: "Mathematics in the Modern World", units: 3, grade: 1.25, type: "academic", instructor: "Temelo Dolly Rose F." },
        { code: "PATHFIT 1", title: "Movement Competency Training", units: 2, grade: 1.0, type: "academic", instructor: "Canson Caryl C." },
        { code: "PSY 110", title: "Understanding the Self", units: 3, grade: 1.25, type: "academic", instructor: "Basbas Jan Iris Faye M." },
        { code: "SS 110", title: "Readings in Philippine History", units: 3, grade: 1.5, type: "academic", instructor: "Prio Henry John M." },
      ],
    },
    {
      id: "2025-2",
      label: "Second Semester",
      schoolYear: "2025-2026",
      yearLevel: "First Year",
      status: "completed",
      courses: [
        { code: "CC 203", title: "Computer Programming 2", units: 3, grade: 1.0, type: "academic", instructor: "Madresta Tracy Marie Andrea C." },
        { code: "CIT 202", title: "Fundamentals of Multimedia Systems", units: 3, grade: 1.25, type: "academic", instructor: "Defante Janine P." },
        { code: "CIT 203", title: "Fundamentals of Database Systems", units: 3, grade: 1.5, type: "academic", instructor: "Simbran Angelica Grace" },
        { code: "CWTS 102", title: "Civic Welfare Training Service 2", units: 3, grade: 1.0, type: "non-academic", instructor: "Gerona Bernard V." },
        { code: "ENG 110", title: "Purposive Communication", units: 3, grade: 1.25, type: "academic", instructor: "Diamante Alexis L." },
        { code: "NSCI 110", title: "Science, Technology and Society", units: 3, grade: 1.25, type: "academic", instructor: "Gabor Donna H." },
        { code: "PATHFIT 2", title: "Exercise-Based Fitness Activities", units: 2, grade: 1.0, type: "academic", instructor: "Sorsano Adam Clyde S." },
        { code: "SS 117", title: "Living in the IT Era", units: 3, grade: 1.5, type: "academic", instructor: "Osorio Erwin Deza" },
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
        { code: "CC 204", title: "Data Structures and Algorithms", units: 3, grade: null, type: "academic", instructor: "Armada Keia Joy Harder" },
        { code: "CIT 207", title: "Object-Oriented Programming", units: 3, grade: null, type: "academic", instructor: "Armada Keia Joy Harder" },
        { code: "IT 203", title: "Networking 2", units: 3, grade: null, type: "academic", instructor: "RAMOS, EDUARDO P." },
        { code: "CIT 204", title: "Quantitative Methods", units: 3, grade: null, type: "academic", instructor: "Raborar Neiljan C." },
        { code: "PATHFIT 3", title: "Exercise-Based Fitness Activities", units: 2, grade: null, type: "academic", instructor: "Catedrilla Leonard Tomesa" },
        { code: "CIT 206", title: "Platform Technologies", units: 3, grade: null, type: "academic", instructor: "Tangub Vijay" },
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
