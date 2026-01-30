import { $ } from "../utils/dom.js";
import { editDoctor, deleteDoctorAction } from "../controllers/doctorController.js";

// Renders the list of doctors into an HTML table
export function renderDoctorTable(doctors) {
  const body = $("doctorsTableBody");
  const noDoctors = $("noDoctors");

  body.innerHTML = "";

  // Handle empty state
  if (doctors.length === 0) {
    noDoctors.style.display = "flex"; // Centered flex layout
    return;
  }

  noDoctors.style.display = "none";

  doctors.forEach(doctor => {
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-50 transition-colors border-b border-slate-100 group";

    // Create a simple "Avatar" initial
    const initial = doctor.name.replace("Dr. ", "").charAt(0) || "D";

    row.innerHTML = `
      <td class="px-8 py-5 text-xs font-bold text-slate-400">#${doctor.id}</td>
      
      <td class="px-8 py-5 text-left">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-black shadow-sm group-hover:scale-110 transition-transform">
            ${initial}
          </div>
          <span class="text-slate-800 font-bold text-sm">
            ${doctor.name}
          </span>
        </div>
      </td>

      <td class="px-8 py-5">
        <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          ${doctor.specialization}
        </span>
      </td>

      <td class="px-8 py-5 font-medium text-slate-500 text-xs">
        <div class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ${doctor.schedule}
        </div>
      </td>

      <td class="px-8 py-5 text-slate-500 tabular-nums text-sm font-bold">${doctor.contact}</td>

      <td class="px-8 py-5">
        <div class="flex items-center justify-center gap-2">
          <button class="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" 
                  data-edit="${doctor.id}" title="Edit Doctor">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>

          <button class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                  data-delete="${doctor.id}" title="Remove Doctor">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </td>
    `;

    // Attach event listeners
    row.querySelector("[data-edit]").onclick = () => editDoctor(doctor.id);
    row.querySelector("[data-delete]").onclick = () => deleteDoctorAction(doctor.id);

    body.appendChild(row);
  });
}