const siteNav = document.querySelector(".site-nav");
const headerInner = document.querySelector(".header-inner");

if (siteNav && headerInner && !headerInner.querySelector(".nav-menu")) {
  const menu = document.createElement("div");
  menu.className = "nav-menu";

  const toggle = document.createElement("button");
  toggle.className = "menu-toggle";
  toggle.id = "menu-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "site-menu");
  toggle.setAttribute("aria-label", "Open menu");
  toggle.innerHTML = "<span></span><span></span><span></span>";

  siteNav.className = "menu-panel";
  siteNav.id = "site-menu";
  siteNav.hidden = true;
  siteNav.setAttribute("aria-label", "Student pages");

  const logout = document.querySelector(".header-action");
  if (logout) {
    const divider = document.createElement("li");
    divider.innerHTML = '<div class="menu-divider" role="separator"></div>';
    siteNav.querySelector("ul").append(divider);

    const logoutItem = document.createElement("li");
    logoutItem.append(logout);
    siteNav.querySelector("ul").append(logoutItem);
  }

  menu.append(toggle, siteNav);
  headerInner.classList.add("has-menu");
  headerInner.append(menu);

  function setMenu(open) {
    siteNav.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    if (open) {
      siteNav.querySelector("a").focus();
    }
  }

  toggle.addEventListener("click", () => setMenu(siteNav.hidden));

  document.addEventListener("click", (event) => {
    if (!siteNav.hidden && !event.target.closest(".nav-menu")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !siteNav.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });
}
