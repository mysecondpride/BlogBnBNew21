document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput"); // ✅ NO dot
  const searchClose = document.getElementById("searchClose"); // ✅ NO dot or space

  // ✅ Always reset searchBar when page loads
  if (searchBar) {
    searchBar.classList.remove("open");
  }

  // ✅ Open search when searchBtn is clicked
  allButtons.forEach((button) => {
    button.addEventListener("click", function () {
      searchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      if (searchInput) searchInput.focus();
    });
  });

  // ✅ Close search when Close button is clicked
  if (searchClose) {
    searchClose.addEventListener("click", function () {
      searchBar.classList.remove("open");
    });
  }
});

var draggable = new Draggabilly(".draggable");

var draggable = new Draggabilly(".draggable", {
  containment: true,
});

var draggable = new Draggabilly(".draggable", {
  axis: "x",
});

var draggable = new Draggabilly(".draggable", {
  axis: "y",
});

var draggable = new Draggabilly(".draggable", {
  grid: [20, 20],
});

//handle
var draggable = new Draggabilly(".draggable", {
  handle: ".handle",
});

const box = document.querySelector(".box");

box.style.fontSize = "20px";
box.style.border = "1px solid black";

//event handler
draggable.on("dragStart", () => {
  box.style.background = "yellow";
});
draggable.off("dragEnd", () => {
  box.style.background = "09F";
});





