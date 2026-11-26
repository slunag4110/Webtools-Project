// YOTR Mentorship Dashboard interactions
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("mentorSearch");
  const filter = document.getElementById("statusFilter");
  const rows = [...document.querySelectorAll("#mentorshipRows tr")];
  const count = document.getElementById("resultCount");
  const backdrop = document.getElementById("modalBackdrop");
  const title = document.getElementById("dialogTitle");
  const text = document.getElementById("dialogText");

  function applyFilters() {
    const query = (search.value || "").toLowerCase().trim();
    const status = filter.value;
    let visible = 0;
    rows.forEach(row => {
      const matchesText = row.textContent.toLowerCase().includes(query);
      const matchesStatus = status === "all" || row.dataset.status === status;
      row.hidden = !(matchesText && matchesStatus);
      if (!row.hidden) visible++;
    });
    count.textContent = `Showing ${visible ? 1 : 0} to ${visible} of ${visible} matching mentorships`;
  }
  search.addEventListener("input", applyFilters);
  filter.addEventListener("change", applyFilters);

  function openDialog(heading, message) {
    title.textContent = heading;
    text.textContent = message;
    backdrop.hidden = false;
  }
  function closeDialog() { backdrop.hidden = true; }
  document.getElementById("closeDialog").addEventListener("click", closeDialog);
  document.getElementById("dialogOk").addEventListener("click", closeDialog);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeDialog(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDialog(); });

  document.getElementById("assignButton").addEventListener("click", () => {
    openDialog("Assign Mentorship", "The assignment form can be connected to your member database when your backend is ready.");
  });
  document.getElementById("adminButton").addEventListener("click", () => {
    openDialog("Admin Account", "You are viewing the Youth on the Rock mentorship dashboard.");
  });

  document.querySelectorAll(".actions button").forEach(button => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const cells = row.querySelectorAll("td");
      const action = button.dataset.action;
      const details = `${cells[1].textContent} is paired with ${cells[2].textContent} in ${cells[3].textContent}. Status: ${row.dataset.status}. Progress: ${cells[6].textContent.trim()}.`;
      openDialog(action === "view" ? `Mentorship ${cells[0].textContent}` : `Edit ${cells[0].textContent}`, details);
    });
  });

  // Demo pagination controls: keep the current sample data visible.
  document.querySelectorAll(".pagination button:not(:disabled)").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".pagination button").forEach(b => b.classList.remove("current"));
      if (/^\d+$/.test(button.textContent.trim())) button.classList.add("current");
      else openDialog("Pagination", "Connect pagination to your full mentorship records when your database is ready.");
    });
  });
});
