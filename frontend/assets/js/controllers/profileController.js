import { apiGetAll as getPatients } from "../services/patientService.js";
import { apiGetAll as getBillings } from "../services/billingService.js";
import { apiGetAll as getDoctors } from "../services/doctorService.js";


export async function loadPatientProfile(patientId) {
  const container = document.getElementById("profileContainer");

  try {
    const patients = await getPatients();

    const patient = patients.find(p => p.id == patientId);

    if (!patient) {
      container.innerHTML = "<p>Patient not found</p>";
      return;
    }

    const bills = await getBillings();
    const patientBills = bills.filter(b => b.patient_id == patientId);

    container.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <h2 class="text-xl font-semibold mb-4">Basic Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="flex gap-3">
            <div class="w-28 text-slate-500">Name</div>
            <div class="text-slate-800 font-medium">${patient.name}</div>
          </div>
          <div class="flex gap-3">
            <div class="w-28 text-slate-500">Age</div>
            <div class="text-slate-800">${patient.age}</div>
          </div>
          <div class="flex gap-3">
            <div class="w-28 text-slate-500">Gender</div>
            <div class="text-slate-800">${patient.gender}</div>
          </div>
          <div class="flex gap-3">
            <div class="w-28 text-slate-500">Contact</div>
            <div class="text-slate-800">${patient.contact}</div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="text-xl font-semibold mb-4">Billing History</h2>

        ${patientBills.length === 0
        ? "<p class=\"text-sm text-slate-600\">No bills found</p>"
        : `
              <div class="overflow-x-auto">
                <table class="min-w-full border text-sm rounded-lg overflow-hidden">
                  <thead>
                    <tr class="bg-blue-600 text-white text-left">
                      <th class="px-4 py-3 text-xs uppercase tracking-wide">Doctor</th>
                      <th class="px-4 py-3 text-xs uppercase tracking-wide text-right">Amount</th>
                      <th class="px-4 py-3 text-xs uppercase tracking-wide">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${patientBills.map((b, idx) => `
                      <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50">
                        <td class="px-4 py-3 text-slate-800 font-medium">${b.doctor_attended}</td>
                        <td class="px-4 py-3 text-right text-emerald-700 font-semibold">₹${b.amount}</td>
                        <td class="px-4 py-3 text-slate-600">${b.bill_date}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `
      }
      </div>
    `;

    setupExports(patient, "patient_profile");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load patient profile</p>";
  }
}

export async function loadDoctorProfile(doctorId) {
  const container = document.getElementById("profileContainer");

  try {
    const doctors = await getDoctors();
    const doctor = doctors.find(d => d.id == doctorId);

    if (!doctor) {
      container.innerHTML = "<p>Doctor not found</p>";
      return;
    }

    container.innerHTML = `
      <div class="bg-white p-6 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-3">Doctor Details</h2>
        <p><strong>Name:</strong> ${doctor.name}</p>
        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        <p><strong>Contact:</strong> ${doctor.contact || 'N/A'}</p>
        <p><strong>Schedule:</strong> ${doctor.schedule || 'N/A'}</p>
      </div>
    `;

    // improved card styling
    container.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="text-xl font-semibold mb-4">Doctor Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="flex gap-3"><div class="w-36 text-slate-500">Name</div><div class="text-slate-800 font-medium">${doctor.name}</div></div>
          <div class="flex gap-3"><div class="w-36 text-slate-500">Specialization</div><div class="text-slate-800">${doctor.specialization}</div></div>
          <div class="flex gap-3"><div class="w-36 text-slate-500">Contact</div><div class="text-slate-800">${doctor.contact || 'N/A'}</div></div>
          <div class="flex gap-3"><div class="w-36 text-slate-500">Schedule</div><div class="text-slate-800">${doctor.schedule || 'N/A'}</div></div>
        </div>
      </div>
    `;

    setupExports(doctor, "doctor_profile");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load doctor profile</p>";
  }
}

export async function loadBillProfile(billId) {
  const container = document.getElementById("profileContainer");

  try {
    const bills = await getBillings();
    console.log("billing data",bills)
    const bill = bills.find(b => b.id == billId);

    if (!bill) {
      container.innerHTML = "<p>Bill not found</p>";
      return;
    }

    container.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <h2 class="text-xl font-semibold mb-4">Bill Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="flex gap-3"><div class="w-36 text-slate-500">Bill ID</div><div class="text-slate-800 font-medium">${bill.id}</div></div>
          <div class="flex gap-3"><div class="w-36 text-slate-500">Patient ID</div><div class="text-slate-800">${bill.patient_id}</div></div>
          <div class="flex gap-3"><div class="w-36 text-slate-500">Doctor</div><div class="text-slate-800">${bill.doctor_attended}</div></div>
          <div class="flex gap-3"><div class="w-36 text-slate-500">Amount</div><div class="text-emerald-700 font-semibold">₹${bill.amount}</div></div>
          <div class="flex gap-3"><div class="w-36 text-slate-500">Date</div><div class="text-slate-800">${bill.bill_date}</div></div>
      </div>
    `;
    setupExports(bill, "bill_profile");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load bill profile</p>";
  }
}
function setupExports(data, filename) {
  const csvBtn = document.getElementById("exportCsvBtn");
  const pdfBtn = document.getElementById("exportPdfBtn");

  if (csvBtn) {
    // Clone to remove old listeners if any (though usually DOM is fresh)
    const newCsvBtn = csvBtn.cloneNode(true);
    csvBtn.parentNode.replaceChild(newCsvBtn, csvBtn);

    newCsvBtn.addEventListener("click", () => {
      const headers = Object.keys(data).join(",");
      const values = Object.values(data).map(v => `"${v}"`).join(",");
      const csvContent =
        "data:text/csv;charset=utf-8," + headers + "\n" + values;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (pdfBtn) {
    const newPdfBtn = pdfBtn.cloneNode(true);
    pdfBtn.parentNode.replaceChild(newPdfBtn, pdfBtn);
    newPdfBtn.addEventListener("click", async () => {
      // Build a structured printable report depending on the type of `data`.
      const now = new Date().toLocaleString();

      const esc = v => String(v === null || v === undefined ? '' : v).replace(/</g, '&lt;');

      const styles = `
        <style>
          :root{--muted:#6b7280;--accent:#0ea5e9;--header:#0369a1;--amount:#059669}
          html,body{margin:0;padding:20px;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;color:#0f172a}
          .report{max-width:900px;margin:0 auto}
          .report-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
          .report-title{font-size:18px;font-weight:700;color:var(--header)}
          .report-meta{font-size:12px;color:var(--muted)}
          .details-table{width:100%;border-collapse:collapse;margin-bottom:18px}
          .details-table td{padding:10px;border:1px solid #e6eef6}
          .details-table .label{width:34%;background:#f1f9ff;color:#0b4a6f;font-weight:600}
          .details-table .value{background:#fff}
          .billing-table{width:100%;border-collapse:collapse}
          .billing-table th{background:var(--accent);color:white;padding:10px;text-align:left;font-size:12px}
          .billing-table td{padding:10px;border:1px solid #e6eef6;font-size:13px}
          .billing-table tbody tr:nth-child(even){background:#fbfdff}
          .billing-table tbody tr:hover{background:#eef9ff}
          .amount{color:var(--amount);font-weight:700;text-align:right}
          @media print{ body{padding:8mm} .report{max-width:100%} }
        </style>
      `;

      let bodyHtml = '';

      // Patient record (has age)
      if (data && data.age !== undefined) {
        let bills = [];
        try { bills = await getBillings(); } catch(e){ bills = []; }
        const patientBills = bills.filter(b => String(b.patient_id) == String(data.id));

        bodyHtml += `<div class="report">
          <div class="report-header">
            <div class="report-title">Patient Profile — ${esc(data.name)}</div>
            <div class="report-meta">Generated: ${now}</div>
          </div>

          <table class="details-table">
            <tr><td class="label">Name</td><td class="value">${esc(data.name)}</td></tr>
            <tr><td class="label">Age</td><td class="value">${esc(data.age)}</td></tr>
            <tr><td class="label">Gender</td><td class="value">${esc(data.gender)}</td></tr>
            <tr><td class="label">Contact</td><td class="value">${esc(data.contact)}</td></tr>
            <tr><td class="label">Patient ID</td><td class="value">${esc(data.id)}</td></tr>
          </table>

          <h3 style="color:var(--header);margin:8px 0 10px;font-size:16px">Billing History</h3>
          <table class="billing-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th class="amount">Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${patientBills.length === 0 ? `<tr><td colspan="3" style="padding:12px;color:var(--muted)">No billing records found</td></tr>` : patientBills.map((b, i) => `
                <tr>
                  <td>${esc(b.doctor_attended)}</td>
                  <td class="amount">₹${esc(b.amount)}</td>
                  <td>${esc(b.bill_date)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`;

      // Doctor record
      } else if (data && data.specialization !== undefined) {
        bodyHtml += `<div class="report">
          <div class="report-header">
            <div class="report-title">Doctor Profile — ${esc(data.name)}</div>
            <div class="report-meta">Generated: ${now}</div>
          </div>
          <table class="details-table">
            <tr><td class="label">Name</td><td class="value">${esc(data.name)}</td></tr>
            <tr><td class="label">Specialization</td><td class="value">${esc(data.specialization)}</td></tr>
            <tr><td class="label">Contact</td><td class="value">${esc(data.contact || 'N/A')}</td></tr>
            <tr><td class="label">Doctor ID</td><td class="value">${esc(data.id)}</td></tr>
          </table>
        </div>`;

      // Bill record
      } else if (data && data.amount !== undefined) {
        bodyHtml += `<div class="report">
          <div class="report-header">
            <div class="report-title">Bill Details — ID ${esc(data.id)}</div>
            <div class="report-meta">Generated: ${now}</div>
          </div>
          <table class="details-table">
            <tr><td class="label">Bill ID</td><td class="value">${esc(data.id)}</td></tr>
            <tr><td class="label">Patient ID</td><td class="value">${esc(data.patient_id)}</td></tr>
            <tr><td class="label">Doctor</td><td class="value">${esc(data.doctor_attended)}</td></tr>
            <tr><td class="label">Amount</td><td class="value amount">₹${esc(data.amount)}</td></tr>
            <tr><td class="label">Date</td><td class="value">${esc(data.bill_date)}</td></tr>
          </table>
        </div>`;

      } else {
        // fallback: use existing container HTML
        const contentEl = document.getElementById('profileContainer');
        bodyHtml = contentEl ? `<div class="report">${contentEl.innerHTML}</div>` : '<div class="report"><p>No printable content</p></div>';
      }

      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Profile Report</title>${styles}</head><body>${bodyHtml}</body></html>`;

      const w = window.open('', '_blank');
      if (!w) { alert('Popup blocked. Allow popups to export PDF.'); return; }
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => { w.print(); }, 500);
    });
  }
}