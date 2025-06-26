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


