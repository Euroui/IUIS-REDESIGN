// Burger menu

const menuToggle = document.querySelector("#menu-toggle");
const menuPanel = document.querySelector("#site-menu");

function setMenu(open) {
  menuPanel.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => {
  setMenu(menuPanel.hidden);
});

// Close when clicking anywhere outside the menu
document.addEventListener("click", (event) => {
  if (!menuPanel.hidden && !event.target.closest(".nav-menu")) {
    setMenu(false);
  }
});

// Close with Escape and return focus to the button
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menuPanel.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
});

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
