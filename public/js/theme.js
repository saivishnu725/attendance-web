// TODO: Refactor this file
// TODO: adding this line to remove the error in the console but i have to figure out what is the problem and fix it
let sidebarCollapseList = [];

function toggleSidebar() {
  document.body.classList.toggle("sidebar-toggled");
  sidebar.classList.toggle("toggled");

  if (sidebar.classList.contains("toggled")) {
    for (let bsCollapse of sidebarCollapseList) {
      bsCollapse.hide();
    }
  }
}

function closeMenuAccordions() {
  let vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );

  if (vw < 768) {
    for (let bsCollapse of sidebarCollapseList) {
      bsCollapse.hide();
    }
  }
}

function preventContentWrapperScroll(e) {
  let vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );

  if (vw > 768) {
    let e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  }
}

// script that creates a function that selects the form 'delete-attendance-form' and changes the value of a input named 'attendanceID' to the parameter and then submit the form
function deleteAttendance(attendanceID) {
  document
    .querySelector("#delete-attendance-form input[name='attendanceID']")
    .setAttribute("value", attendanceID);
  document.querySelector("#delete-attendance-form").submit();
}

function scrollToTop() {
  let scrollDistance = window.scrollY;

  //check if user is scrolling up
  if (scrollDistance > 100) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
}

let sidebar = document.querySelector(".sidebar");
let sidebarToggles = document.querySelectorAll(
  "#sidebarToggle, #sidebarToggleTop"
);

if (sidebar) {
  for (let toggle of sidebarToggles) {
    toggle.addEventListener("click", toggleSidebar);
  }

  window.addEventListener("resize", closeMenuAccordions);
}

let fixedNavigation = document.querySelector("body.fixed-nav .sidebar");

if (fixedNavigation) {
  fixedNavigation.addEventListener("mousewheel", preventContentWrapperScroll);
  fixedNavigation.addEventListener(
    "DOMMouseScroll",
    preventContentWrapperScroll
  );
  fixedNavigation.addEventListener("wheel", preventContentWrapperScroll);
}

let scrollToTopButton = document.querySelector(".scroll-to-top");

if (scrollToTopButton) {
  window.addEventListener("scroll", scrollToTop);
}
