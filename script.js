const loginProfiles = {
  student: {
    context: "Student Portal",
    title: "Student Log In",
    description: "Access your student records and progress page.",
    userLabel: "Student ID No.",
    userPlaceholder: "Enter your student ID",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    submitText: "Next",
    successText: "Opening student information page.",
    redirect: "dashboard.html",
  },
  faculty: {
    context: "Faculty Portal",
    title: "Faculty Log In",
    description: "Access class records, grades, and faculty services.",
    userLabel: "Faculty ID No.",
    userPlaceholder: "Enter your faculty ID",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    submitText: "Next",
    successText: "Faculty login block selected.",
  },
  admin: {
    context: "Admin Portal",
    title: "Admin Log In",
    description: "Access office tools and administrative services.",
    userLabel: "Employee ID No.",
    userPlaceholder: "Enter your employee ID",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    submitText: "Next",
    successText: "Admin login block selected.",
  },
  application: {
    context: "Admissions",
    title: "Application",
    description: "Continue or check the status of an application.",
    userLabel: "Application No.",
    userPlaceholder: "Enter your application number",
    passwordLabel: "Email or PIN",
    passwordPlaceholder: "Enter your email or PIN",
    submitText: "Check Application",
    successText: "Application option selected.",
  },
};

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

const userTypeSelect = document.querySelector("#user-type");
const loginForm = document.querySelector(".login-form");
const statusText = document.querySelector(".form-status");
const loginContext = document.querySelector("#login-context");
const loginTitle = document.querySelector("#login-title");
const loginDescription = document.querySelector("#login-description");
const userIdLabel = document.querySelector("#user-id-label");
const userIdInput = document.querySelector("#user-id");
const passwordLabel = document.querySelector("#password-label");
const passwordInput = document.querySelector("#password");
const submitButton = document.querySelector("#submit-button");
const birthMonth = document.querySelector("#birth-month");
const birthDay = document.querySelector("#birth-day");
const birthYear = document.querySelector("#birth-year");

function updateLoginBlock() {
  const profile = loginProfiles[userTypeSelect.value];

  loginContext.textContent = profile.context;
  loginTitle.textContent = profile.title;
  loginDescription.textContent = profile.description;
  userIdLabel.textContent = profile.userLabel;
  userIdInput.placeholder = profile.userPlaceholder;
  passwordLabel.textContent = profile.passwordLabel;
  passwordInput.placeholder = profile.passwordPlaceholder;
  submitButton.textContent = profile.submitText;
  statusText.textContent = "";
}

// Date of birth: guide users through year, then month, then day.

function daysInMonth(month, year) {
  // Day 0 of the next month is the last day of this month.
  // Until a year is picked, assume a leap year so Feb 29 stays available.
  return new Date(year || 2000, month, 0).getDate();
}

function updateDayOptions() {
  const selectedDay = Number(birthDay.value);
  const hasYearAndMonth = birthYear.value && birthMonth.value;

  birthDay.length = 1; // keep the "Day" placeholder
  birthDay.selectedIndex = 0;
  birthDay.disabled = !hasYearAndMonth;

  if (!hasYearAndMonth) {
    return;
  }

  const maxDay = daysInMonth(Number(birthMonth.value), Number(birthYear.value));

  for (let day = 1; day <= maxDay; day += 1) {
    birthDay.add(new Option(day, day));
  }

  if (selectedDay && selectedDay <= maxDay) {
    birthDay.value = String(selectedDay);
  }
}

function setupBirthDate() {
  const newestYear = new Date().getFullYear();
  const oldestYear = 1940;

  for (let year = newestYear; year >= oldestYear; year -= 1) {
    birthYear.add(new Option(year, year));
  }

  monthNames.forEach((name, index) => {
    birthMonth.add(new Option(name, index + 1));
  });

  updateDayOptions();

  birthYear.addEventListener("change", () => {
    birthMonth.value = "";
    birthMonth.disabled = false;
    updateDayOptions();
    birthMonth.focus();
  });
  birthMonth.addEventListener("change", updateDayOptions);
}

userTypeSelect.addEventListener("change", updateLoginBlock);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profile = loginProfiles[userTypeSelect.value];
  const userId = userIdInput.value.trim();
  const hasBirthDate = birthMonth.value && birthDay.value && birthYear.value;
  const password = passwordInput.value.trim();

  if (!userId || !hasBirthDate || !password) {
    statusText.textContent = "Enter your ID, date of birth, and login details.";
    return;
  }

  statusText.textContent = profile.successText;

  if (profile.redirect) {
    window.location.href = profile.redirect;
  }
});

setupBirthDate();
updateLoginBlock();
