import { $ } from "../utils/dom.js";
import { editPatient, deletePatientAction } from "../controllers/patientController.js";

// Renders the list of patients into an HTML table
export function renderPatientTable(patients) {
  // Get references to the table body where rows will be inserted and the 'no patients' message
  const body = $("patientsTableBody");
  const noPatients = $("noPatients");

  // Clear any existing rows from the table body before rendering new data
  body.innerHTML = "";

  // Check if the patient array is empty
  if (patients.length === 0) {
    // If no patients are found, display the 'no patients' message and stop execution
    noPatients.style.display = "block";
    return;
  }

  // If patients exist, hide the 'no patients' message
  noPatients.style.display = "none";

  // Iterate over each patient object in the provided array
  patients.forEach(patient => {
    // Create a new table row element for the current patient
    const row = document.createElement("tr");
    row.className = "border-b";

    // Populate the row with dynamic HTML content using a template literal
    row.innerHTML = `
      <td class="px-3 py-2">${patient.id}</td>
      <td class="px-3 py-2">${patient.name}</td>
      <td class="px-3 py-2">${patient.age}</td>
      <td class="px-3 py-2">${patient.gender}</td>
      <td class="px-3 py-2">${patient.contact}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${patient.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${patient.id}">Delete</button>
      </td>
    `;

    // Attach event listeners to the newly created buttons
    row.querySelector("[data-edit]").onclick = () => editPatient(patient.id);
    row.querySelector("[data-delete]").onclick = () => deletePatientAction(patient.id);

    // Append the fully constructed row to the table body
    body.appendChild(row);
  });
}