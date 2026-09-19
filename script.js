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

userTypeSelect.addEventListener("change", updateLoginBlock);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profile = loginProfiles[userTypeSelect.value];
  const userId = document.querySelector("#user-id").value.trim();
  const birthDate = document.querySelector("#birth-date").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!userId || !birthDate || !password) {
    statusText.textContent = "Enter your ID, date of birth, and login details.";
    return;
  }

  statusText.textContent = profile.successText;

  if (profile.redirect) {
    window.location.href = profile.redirect;
  }
});

updateLoginBlock();
