import { apiGetAll as getPatients } from "../services/patientService.js";
import { apiGetAll as getDoctors } from "../services/doctorService.js";
import { apiGetAll as getBillings } from "../services/billingService.js";

export async function initProfilesController() {
  // DOM Elements
  const title = document.getElementById("profilesTitle");
  const head = document.getElementById("tableHead");
  const body = document.getElementById("profilesTableBody");
  const loading = document.getElementById("loadingSpinner");
  const tableContainer = document.getElementById("profilesTableContainer");
  const noProfilesMsg = document.getElementById("noProfiles");
  
  // Input Elements
  const searchInput = document.getElementById("searchInput");
  const sortBySelect = document.getElementById("sortBy");
  const sortDirSelect = document.getElementById("sortDir");

  if (!title) return;

  // State
  let rawData = [];      // The master list fetched from API
  let filteredData = []; // The list currently being displayed (after search/sort)
  let currentType = "patients";

  const configs = {
    patients: {
      title: "Patient Profiles",
      headers: ["ID", "Name", "Age", "Open"],
      fetch: getPatients,
      map: p => [p.id, p.name, p.age]
    },
    doctors: {
      title: "Doctor Profiles",
      headers: ["ID", "Name", "Specialization", "Open"],
      fetch: getDoctors,
      map: d => [d.id, d.name, d.specialization]
    },
    bills: {
      title: "Billing Profiles",
      headers: ["Patient ID", "Doctor", "Amount", "Open"],
      fetch: getBillings,
      map: b => [b.id, b.doctor_attended, b.amount]
    }
  };

  // --- CORE FUNCTION: Renders the table based on data passed to it ---
  function renderTable(dataToRender) {
    const cfg = configs[currentType];
    
    // Clear existing
    head.innerHTML = "";
    body.innerHTML = "";

    if (!dataToRender || dataToRender.length === 0) {
      tableContainer.querySelector('table').classList.add('hidden');
      noProfilesMsg.classList.remove('hidden');
      noProfilesMsg.classList.add('flex');
      return;
    } else {
      tableContainer.querySelector('table').classList.remove('hidden');
      noProfilesMsg.classList.add('hidden');
      noProfilesMsg.classList.remove('flex');
    }

    // Headers
    cfg.headers.forEach(h => {
      const th = document.createElement("th");
      th.className = "px-6 py-4";
      th.innerText = h;
      head.appendChild(th);
    });

    // Rows
    dataToRender.forEach(item => {
      const tr = document.createElement("tr");
      tr.className = "border-t hover:bg-slate-50 transition-colors";

      const rowValues = cfg.map(item);

      rowValues.forEach(v => {
        const td = document.createElement("td");
        td.className = "px-6 py-4";
        td.innerText = v;
        tr.appendChild(td);
      });

      // View Button
      const viewTd = document.createElement("td");
      viewTd.className = "px-6 py-4 text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors";
      viewTd.innerText = "View Record";
      
      viewTd.onclick = () => {
        const routeType = currentType === 'bills' ? 'bills' : currentType; // slight redundancy check
        history.pushState(null, "", `/profiles/${routeType}/${item.id}`);
        import("../router/viewRouter.js").then(m => m.router());
      };

      tr.appendChild(viewTd);
      body.appendChild(tr);
    });
  }

  // --- CORE FUNCTION: Filters and Sorts 'rawData' then calls render ---
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortField = sortBySelect.value; // 'id' or 'name'
    const sortDir = sortDirSelect.value;  // 'asc' or 'desc'

    // 1. FILTER
    let result = rawData.filter(item => {
      // Always search ID
      if (String(item.id).toLowerCase().includes(searchTerm)) return true;
      
      // Dynamic Search based on Type
      if (currentType === 'patients' || currentType === 'doctors') {
        return item.name.toLowerCase().includes(searchTerm);
      } 
      else if (currentType === 'bills') {
        // For bills, we usually search by Doctor name or perhaps Patient ID
        // Assuming item.doctor_attended exists based on map config
        return (item.doctor_attended && item.doctor_attended.toLowerCase().includes(searchTerm));
      }
      return false;
    });

    // 2. SORT
    result.sort((a, b) => {
      let valA, valB;

      if (sortField === 'id') {
        valA = parseInt(a.id);
        valB = parseInt(b.id);
      } else {
        // Sort by Name
        if (currentType === 'bills') {
           // Bills might not have 'name', use 'doctor_attended'
           valA = a.doctor_attended ? a.doctor_attended.toLowerCase() : "";
           valB = b.doctor_attended ? b.doctor_attended.toLowerCase() : "";
        } else {
           valA = a.name ? a.name.toLowerCase() : "";
           valB = b.name ? b.name.toLowerCase() : "";
        }
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    filteredData = result;
    renderTable(filteredData);
  }

  // --- API LOAD FUNCTION ---
  async function load(type) {
    loading.classList.remove("hidden");
    tableContainer.classList.add("hidden");
    
    // Reset search inputs on tab switch? Optional. 
    // searchInput.value = ""; 

    const cfg = configs[type];
    title.innerHTML = `<span class="text-blue-600">${cfg.title.split(' ')[0]}</span> Directory`;

    try {
      rawData = await cfg.fetch();
      currentType = type;
      // Initial Apply (will show all data, default sorted)
      applyFilters(); 
    } catch (e) {
      console.error("Fetch failed", e);
      loading.innerText = "Failed to load data";
      return;
    }

    loading.classList.add("hidden");
    tableContainer.classList.remove("hidden");
  }

  // --- EVENT LISTENERS ---

  // 1. Tab Switching
  document.querySelectorAll(".profile-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      // Update Button Styles
      document.querySelectorAll(".profile-tab").forEach(b => {
        // Reset to Outline style
        b.classList.remove("bg-blue-500", "text-white");
        b.classList.add("bg-white", "text-blue-600");
      });
      // Set Active style
      btn.classList.remove("bg-white", "text-blue-600");
      btn.classList.add("bg-blue-500", "text-white");

      load(btn.dataset.type);
    });
  });

  // 2. Search & Sort Inputs
  searchInput.addEventListener("input", applyFilters);
  sortBySelect.addEventListener("change", applyFilters);
  sortDirSelect.addEventListener("change", applyFilters);

  // 3. Export CSV (Exports currently filtered view)
  document.getElementById("exportCsvBtn").addEventListener("click", () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const cfg = configs[currentType];
    const headers = cfg.headers.slice(0, -1); // Remove "Open"
    
    // Generate Rows from Filtered Data
    const rows = filteredData.map(item => cfg.map(item));

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";

    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // 4. Export PDF — open a print-friendly window with only the report
  document.getElementById("exportPdfBtn").addEventListener("click", () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const cfg = configs[currentType];
    const headers = cfg.headers.slice(0, -1); // Remove "Open"
    const rows = filteredData.map(item => cfg.map(item));

    // Minimal print styles for a PDF-friendly table
    const style = `
      <style>
        html,body{margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial;color:#111827}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border:1px solid #e5e7eb;padding:8px 10px;text-align:left;vertical-align:top}
        th{background:#111827;color:#ffffff;text-transform:uppercase;font-size:11px}
        caption{font-size:18px;margin-bottom:8px;text-align:left;font-weight:700;color:#0ea5e9}
        @media print{body{padding:8mm} a{display:none}}
      </style>
    `;

    let html = `<!doctype html><html><head><meta charset="utf-8"><title>${cfg.title} Report</title>${style}</head><body>`;
    html += `<div style="margin-bottom:12px;"><strong>${cfg.title}</strong> — Generated ${new Date().toLocaleString()}</div>`;
    html += '<table><thead><tr>';
    headers.forEach(h => { html += `<th>${h}</th>`; });
    html += '</tr></thead><tbody>';

    rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        const safe = String(cell === null || cell === undefined ? '' : cell).replace(/</g, '&lt;');
        html += `<td>${safe}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table></body></html>';

    const w = window.open('', '_blank');
    if (!w) {
      alert('Popup blocked. Allow popups or use the browser print option.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    // Allow rendering then trigger print
    setTimeout(() => { w.print(); }, 600);
  });

  // INITIAL LOAD
  load("patients");
}