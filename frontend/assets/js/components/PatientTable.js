import { $ } from "../utils/dom.js";
import { editPatient, deletePatientAction } from "../controllers/patientController.js";

// REPLACEMENT START: Replace your old renderPatientTable with this one
export function renderPatientTable(patients) {
  const body = $("patientsTableBody");
  const noPatients = $("noPatients");

  // 1. Clear existing rows
  body.innerHTML = "";

  // 2. Handle empty state (using flex to center the "No Patients" message)
  if (patients.length === 0) {
    noPatients.style.display = "flex"; 
    return;
  }

  noPatients.style.display = "none";

  // 3. Loop through filtered/sorted patients and create rows
  patients.forEach(patient => {
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-50 transition-colors border-b border-slate-100";

    row.innerHTML = `
      <td class="px-8 py-5 text-xs font-bold text-slate-400">#${patient.id}</td>
      <td class="px-8 py-5">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-700 text-[10px] font-black">
            ${patient.name.charAt(0)}
          </div>
          <span class="text-blue-600 hover:text-blue-800 font-bold cursor-pointer transition-colors" data-patient-id="${patient.id}">
            ${patient.name}
          </span>
        </div>
      </td>
      <td class="px-8 py-5 font-bold">${patient.age} <span class="text-[10px] text-slate-400">YRS</span></td>
      <td class="px-8 py-5">
        <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${patient.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}">
          ${patient.gender}
        </span>
      </td>
      <td class="px-8 py-5 text-slate-500 tabular-nums">${patient.contact}</td>
      <td class="px-8 py-5">
        <div class="flex items-center justify-center gap-2">
          <button class="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" data-edit="${patient.id}" title="Edit">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" data-delete="${patient.id}" title="Delete">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </td>
    `;

    // 4. Attach Event Listeners
    row.querySelector("[data-edit]").onclick = () => editPatient(patient.id);
    row.querySelector("[data-delete]").onclick = () => deletePatientAction(patient.id);
    row.querySelector("[data-patient-id]").onclick = () => {
      history.pushState(null, "", `/profiles/patients/${patient.id}`);
      import("../router/viewRouter.js").then(m => m.router());
    };

    body.appendChild(row);
  });
}