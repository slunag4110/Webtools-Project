// YOTR Member Management dashboard interactions
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("memberSearch");
  const group = document.getElementById("groupFilter");
  const status = document.getElementById("statusFilter");
  const rows = [...document.querySelectorAll("#memberRows tr")];
  const count = document.getElementById("resultCount");
  const backdrop = document.getElementById("modalBackdrop");
  const title = document.getElementById("dialogTitle");
  const body = document.getElementById("dialogBody");
  const save = document.getElementById("saveDialog");
  const cancel = document.getElementById("cancelDialog");
  let activeRow = null;
  let mode = "";

  function applyFilters() {
    const q = search.value.toLowerCase().trim();
    let shown = 0;
    rows.forEach(row => {
      const matchesText = row.textContent.toLowerCase().includes(q);
      const matchesGroup = group.value === "all" || row.dataset.group === group.value;
      const matchesStatus = status.value === "all" || row.dataset.status === status.value;
      row.hidden = !(matchesText && matchesGroup && matchesStatus);
      if (!row.hidden) shown++;
    });
    count.textContent = `Showing ${shown ? 1 : 0} – ${shown} of ${shown} matching members`;
  }

  search.addEventListener("input", applyFilters);
  group.addEventListener("change", applyFilters);
  status.addEventListener("change", applyFilters);
  document.getElementById("searchButton").addEventListener("click", applyFilters);

  function closeDialog() { backdrop.hidden = true; activeRow = null; }
  document.getElementById("closeDialog").addEventListener("click", closeDialog);
  cancel.addEventListener("click", closeDialog);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeDialog(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDialog(); });

  function field(label, value, name) {
    return `<label for="${name}">${label}</label><input id="${name}" name="${name}" value="${value.replaceAll('"', '&quot;')}" required>`;
  }

  function openMemberDialog(kind, row = null) {
    mode = kind;
    activeRow = row;
    if (kind === "Add") {
      title.textContent = "Add Member";
      body.innerHTML =
        field("Full Name", "", "memberName") +
        field("Email Address", "", "memberEmail") +
        '<label for="memberGroup">Group</label><select id="memberGroup"><option>Youth Leaders</option><option>Worship Team</option><option>Outreach</option><option>Media Team</option></select>' +
        '<label for="memberStatus">Status</label><select id="memberStatus"><option>Active</option><option>Inactive</option></select>';
      save.hidden = false;
    } else if (kind === "Edit") {
      const c = row.querySelectorAll("td");
      title.textContent = "Edit Member";
      body.innerHTML =
        field("Full Name", c[1].textContent.trim(), "memberName") +
        field("Email Address", c[2].textContent.trim(), "memberEmail") +
        `<label for="memberGroup">Group</label><select id="memberGroup"><option ${row.dataset.group==="Youth Leaders"?"selected":""}>Youth Leaders</option><option ${row.dataset.group==="Worship Team"?"selected":""}>Worship Team</option><option ${row.dataset.group==="Outreach"?"selected":""}>Outreach</option><option ${row.dataset.group==="Media Team"?"selected":""}>Media Team</option></select>` +
        `<label for="memberStatus">Status</label><select id="memberStatus"><option ${row.dataset.status==="Active"?"selected":""}>Active</option><option ${row.dataset.status==="Inactive"?"selected":""}>Inactive</option></select>`;
      save.hidden = false;
    } else {
      const c = row.querySelectorAll("td");
      title.textContent = kind + " Member";
      body.textContent = `${c[1].textContent.trim()} — ${c[2].textContent.trim()} — ${c[3].textContent.trim()} — ${row.dataset.status}.`;
      save.hidden = true;
    }
    backdrop.hidden = false;
  }

  document.getElementById("addMemberButton").addEventListener("click", () => openMemberDialog("Add"));
  document.getElementById("adminButton").addEventListener("click", () => {
    title.textContent = "Admin Account";
    body.textContent = "You are viewing the Youth on the Rock Member Management dashboard.";
    save.hidden = true;
    backdrop.hidden = false;
  });

  document.querySelectorAll(".actions button").forEach(button => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const action = button.dataset.action;
      if (action === "Remove") {
        if (window.confirm(`Remove ${row.querySelectorAll("td")[1].textContent.trim()} from this demo table?`)) {
          row.remove();
          applyFilters();
        }
      } else {
        openMemberDialog(action, row);
      }
    });
  });

  save.addEventListener("click", () => {
    if (mode === "Add" || mode === "Edit") {
      const name = document.getElementById("memberName");
      const email = document.getElementById("memberEmail");
      if (!name.value.trim() || !email.value.trim()) {
        (name.value.trim() ? email : name).focus();
        return;
      }
      const groupValue = document.getElementById("memberGroup").value;
      const statusValue = document.getElementById("memberStatus").value;
      if (mode === "Add") {
        const id = String(rows.length + 1).padStart(3, "0");
        const tr = document.createElement("tr");
        tr.dataset.group = groupValue;
        tr.dataset.status = statusValue;
        tr.innerHTML = `<td>${id}</td><td><span class="person-icon">●</span> ${name.value.trim()}</td><td>${email.value.trim()}</td><td>${groupValue}</td><td><span class="status ${statusValue.toLowerCase()}">● ${statusValue}</span></td><td class="actions"><button class="view-btn" data-action="View">◉ View</button><button class="edit-btn" data-action="Edit">✎ Edit</button><button class="remove-btn" data-action="Remove">♜ Remove</button></td>`;
        document.getElementById("memberRows").appendChild(tr);
        tr.querySelectorAll(".actions button").forEach(btn => btn.addEventListener("click", () => {
          const act = btn.dataset.action;
          if (act === "Remove") { if (confirm("Remove this member?")) { tr.remove(); applyFilters(); } }
          else openMemberDialog(act, tr);
        }));
      } else if (activeRow) {
        const c = activeRow.querySelectorAll("td");
        c[1].innerHTML = `<span class="person-icon">●</span> ${name.value.trim()}`;
        c[2].textContent = email.value.trim();
        c[3].textContent = groupValue;
        c[4].innerHTML = `<span class="status ${statusValue.toLowerCase()}">● ${statusValue}</span>`;
        activeRow.dataset.group = groupValue;
        activeRow.dataset.status = statusValue;
      }
      applyFilters();
    }
    closeDialog();
  });

  document.querySelectorAll(".pagination button:not(:disabled)").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".pagination button").forEach(b => b.classList.remove("current"));
      if (/^\d+$/.test(button.textContent.trim())) button.classList.add("current");
    });
  });
});
