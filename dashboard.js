// Calendar

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const calendarTitle = document.querySelector("#calendar-title");
const calendarWeekdays = document.querySelector("#calendar-weekdays");
const calendarBody = document.querySelector("#calendar-body");
const calendarPrev = document.querySelector("#calendar-prev");
const calendarNext = document.querySelector("#calendar-next");
const calendarToday = document.querySelector("#calendar-today");

let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();

function buildWeekdayHeaders() {
  weekdayNames.forEach((name) => {
    const header = document.createElement("th");
    header.scope = "col";
    header.textContent = name.slice(0, 3);
    header.setAttribute("aria-label", name);
    calendarWeekdays.append(header);
  });
}

function renderCalendar() {
  const today = new Date();
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const gridStart = new Date(viewYear, viewMonth, 1 - firstOfMonth.getDay());

  calendarTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;
  calendarBody.replaceChildren();

  // Always draw six weeks so the card keeps the same height every month
  for (let week = 0; week < 6; week += 1) {
    const row = document.createElement("tr");

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const date = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + week * 7 + weekday
      );

      const cell = document.createElement("td");
      const day = document.createElement("span");
      day.className = "calendar-day";
      day.textContent = date.getDate();

      if (date.getMonth() !== viewMonth) {
        cell.classList.add("is-outside");
        cell.setAttribute("aria-hidden", "true");
      }

      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      ) {
        cell.setAttribute("aria-current", "date");
      }

      cell.append(day);
      row.append(cell);
    }

    calendarBody.append(row);
  }
}

function changeMonth(offset) {
  const shown = new Date(viewYear, viewMonth + offset, 1);
  viewYear = shown.getFullYear();
  viewMonth = shown.getMonth();
  renderCalendar();
}

calendarPrev.addEventListener("click", () => changeMonth(-1));
calendarNext.addEventListener("click", () => changeMonth(1));

calendarToday.addEventListener("click", () => {
  const today = new Date();
  viewYear = today.getFullYear();
  viewMonth = today.getMonth();
  renderCalendar();
});

buildWeekdayHeaders();
renderCalendar();

// Today's schedule

const dailySchedule = {
  Monday: [
    { code: "IT 201", title: "Data Structures and Algorithms", start: "08:00", end: "09:00" },
    { code: "IT 204", title: "Information Management 2", start: "13:00", end: "14:30" },
  ],
  Tuesday: [
    { code: "IT 202", title: "Object-Oriented Programming", start: "09:00", end: "11:00" },
    { code: "IT 205", title: "Platform Technologies", start: "13:30", end: "15:00" },
  ],
  Wednesday: [
    { code: "IT 201", title: "Data Structures and Algorithms", start: "09:00", end: "11:00" },
    { code: "IT 203", title: "Networking 2", start: "11:00", end: "12:30" },
    { code: "IT 204", title: "Information Management 2", start: "13:00", end: "14:30" },
  ],
  Thursday: [
    { code: "IT 202", title: "Object-Oriented Programming", start: "09:00", end: "11:00" },
    { code: "IT 205", title: "Platform Technologies", start: "13:30", end: "15:00" },
  ],
  Friday: [
    { code: "IT 203", title: "Networking 2", start: "11:00", end: "12:30" },
    { code: "IT 206", title: "Integrative Programming and Technologies", start: "14:00", end: "17:00" },
  ],
  Saturday: [],
  Sunday: [],
};

const dayScheduleTitle = document.querySelector("#day-schedule-title");
const dayScheduleDate = document.querySelector("#day-schedule-date");
const dayClassList = document.querySelector("#day-class-list");
const nextClass = document.querySelector("#next-class");
const nextClassStatus = document.querySelector("#next-class-status");

function formatScheduleTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function minutesSinceMidnight(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function renderDailySchedule() {
  const today = new Date();
  const dayName = weekdayNames[today.getDay()];
  const classes = dailySchedule[dayName] || [];
  const now = today.getHours() * 60 + today.getMinutes();

  dayScheduleTitle.textContent = dayName;
  dayScheduleDate.textContent = today.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  dayClassList.replaceChildren();

  classes.forEach((course) => {
    const item = document.createElement("li");
    const subject = document.createElement("strong");
    const time = document.createElement("small");
    subject.textContent = `${course.code} - ${course.title}`;
    time.textContent = `${formatScheduleTime(course.start)}-${formatScheduleTime(course.end)}`;
    item.append(subject, time);
    dayClassList.append(item);
  });

  const upcoming = classes.find((course) => minutesSinceMidnight(course.end) > now);
  if (!classes.length) {
    nextClassStatus.textContent = "No class";
    nextClass.textContent = `No classes scheduled for ${dayName}.`;
    return;
  }

  if (!upcoming) {
    nextClassStatus.textContent = "Finished";
    nextClass.textContent = `All classes for ${dayName} are finished.`;
    return;
  }

  const isInProgress = minutesSinceMidnight(upcoming.start) <= now;
  nextClassStatus.textContent = isInProgress ? "In progress" : "Next class";
  nextClass.replaceChildren();
  const nextTitle = document.createElement("strong");
  const nextTime = document.createElement("span");
  nextTitle.textContent = `${upcoming.code} - ${upcoming.title}`;
  nextTime.textContent = `${formatScheduleTime(upcoming.start)}-${formatScheduleTime(upcoming.end)}`;
  nextClass.append(nextTitle, nextTime);
}

renderDailySchedule();
