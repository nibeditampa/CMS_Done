import { apiGetAll as getPatients } from "../service/patientService.js";
import { apiGetAll as getDoctors } from "../service/doctorService.js";
import { apiGetAll as getBillings } from "../service/billingService.js";

export async function initProfileController() {
  const title = document.getElementById("profilesTitle");
  const head = document.getElementById("tableHead");
  const body = document.getElementById("profilesTableBody");
  const loading = document.getElementById("loadingSpinner");
  const table = document.getElementById("ProfilesTableContainer");

  if (!title) return;

  const configs = {
    patients: {
      title: "Patient Profiles",
      headers: ["ID", "Name", "Age", "Open"],
      fetch: getPatients,
      map: p => [p.patient_id, p.name, p.age]
    },
    doctors: {
      title: "Doctor Profiles",
      headers: ["ID", "Name", "Specialization", "Open"],
      fetch: getDoctors,
      map: d => [d.doctor_id, d.name, d.specialization]
    },
    billings: {
      title: "Billing Profiles",
      headers: ["Patient ID", "Doctor", "Amount", "Open"],
      fetch: getBillings,
      map: b => [b.patient_id, b.doctor_attended, b.amount]
    }
  };

  async function load(type) {
    loading.classList.remove("hidden");
    table.classList.add("hidden");

    const cfg = configs[type];
    title.textContent = cfg.title;

    const data = await cfg.fetch();

    head.innerHTML = cfg.headers.map(h => `<th class="px-3 py-2">${h}</th>`).join("");
    body.innerHTML = "";

    data.forEach(item => {
      body.innerHTML += `
        <tr class="border-t">
          ${cfg.map(item).map(v => `<td class="px-3 py-2">${v}</td>`).join("")}
          <td class="px-3 py-2 text-blue-600 text-sm cursor-pointer">View</td>
        </tr>`;
    });

    loading.classList.add("hidden");
    table.classList.remove("hidden");
  }

  document.querySelectorAll(".profile-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".profile-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      load(btn.dataset.type);
    });
  });

  load("patients");
}
