const menuToggle = document.querySelector("#menu-toggle");
const menuPanel = document.querySelector("#site-menu");

function setMenu(open) {
  menuPanel.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

  if (open) {
    menuPanel.querySelector("a").focus();
  }
}

menuToggle.addEventListener("click", () => {
  setMenu(menuPanel.hidden);
});

document.addEventListener("click", (event) => {
  if (!menuPanel.hidden && !event.target.closest(".nav-menu")) {
    setMenu(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menuPanel.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
});
