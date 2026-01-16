import { $ } from "../utils/dom.js";
import { editDoctor, deleteDoctorAction } from "../controllers/doctorController.js";

// Renders the list of doctors into an HTML table
export function renderDoctorTable(doctors) {
  // Get references to the table body where rows will be inserted and the 'no doctors' message
  const body = $("doctorsTableBody");
  const noDoctors = $("noDoctors");

  // Clear any existing rows from the table body before rendering new data
  body.innerHTML = "";

  // Check if the doctor array is empty
  if (doctors.length === 0) {
    // If no doctors are found, display the 'no doctors' message and stop execution
    noDoctors.style.display = "block";
    return;
  }

  // If doctors exist, hide the 'no doctors' message
  noDoctors.style.display = "none";

  // Iterate over each doctor object in the provided array
  doctors.forEach(doctor => {
    // Create a new table row element for the current doctor
    const row = document.createElement("tr");
    row.className = "border-b";

    // Populate the row with dynamic HTML content using a template literal
    row.innerHTML = `
      <td class="px-3 py-2">${doctor.id}</td>
      <td class="px-3 py-2">${doctor.name}</td>
      <td class="px-3 py-2">${doctor.specialization}</td>
      <td class="px-3 py-2">${doctor.schedule}</td>
      <td class="px-3 py-2">${doctor.contact}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${doctor.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${doctor.id}">Delete</button>
      </td>
    `;

    // Attach event listeners to the newly created buttons
    row.querySelector("[data-edit]").onclick = () => editDoctor(doctor.id);
    row.querySelector("[data-delete]").onclick = () => deleteDoctorAction(doctor.id);

    // Append the fully constructed row to the table body
    body.appendChild(row);
  });
}
