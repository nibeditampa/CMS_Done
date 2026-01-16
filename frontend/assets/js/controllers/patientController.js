console.log("✅ initPatientController module loaded");
import { 
    apiGetAll, 
    apiGetOne, 
    apiCreate, 
    apiUpdate, 
    apiDelete 
} from "../services/patientService.js";

import { showAlert } from "../components/Alert.js";
import { renderPatientTable } from "../components/PatientTable.js";
import { resetForm, fillForm } from "../components/PatientForm.js";

import { setState, getState } from "../state/store.js";
import { $, createElement } from "../utils/dom.js";

// Setup event listeners and load initial data
// Initialize the main logic and set up all necessary event listeners
export function initPatientController() {
  // Start by fetching and displaying all patient data immediately upon load
  loadPatients();

  // --- Handle Form Submissions ---

  // Attach a listener to the 'submit' event of the patient input form
  $("patientForm").addEventListener("submit", async (e) => {
    // Prevent the browser's default form submission behavior (page refresh)
    e.preventDefault();

    // Collect data from the input fields using the custom '$' selector
    const data = {
      name: $("name").value.trim(),       // Get name value, remove whitespace
      age: $("age").value.trim(),     // Get age value
      gender: $("gender").value.trim(), // Get gender value
      contact: $("contact").value.trim()    // Get contact value
    };

    // Check the application state to see if we are currently editing an existing record
    const { editingId } = getState();

    // Use a ternary operator to decide which action to take:
    editingId
      ? await updatePatient(editingId, data) // If editingId exists, update the patient
      : await createNewPatient(data);        // Otherwise, create a new patient
  });

  // --- Handle Cancel Button Click ---

  // Attach a listener to the 'click' event of the cancel button
  $("cancelBtn").addEventListener("click", () => {
    // Clear the editing state (set the ID to null)
    setState({ editingId: null });
    // Clear all input fields in the form
    resetForm();
  });
}


// Fetch all patient data from the API and update the user interface
export async function loadPatients() {
  // Get references to the loading spinner and the main data table elements
  const spinner = $("loadingSpinner");
  const table = $("patientsTableContainer");

  // Show the spinner and hide the table to indicate a loading state
  spinner.style.display = "block";
  table.style.display = "none";

  // Asynchronously fetch all patient records from the backend API
  const patients = await apiGetAll();

  // Store the retrieved patient array in the application's global state
  setState({ patients });
  // Render the fetched patient data into the HTML table structure
  renderPatientTable(patients);

  // Hide the spinner and show the table now that the data is loaded and displayed
  spinner.style.display = "none";
  table.style.display = "block";
}


// Create a new patient
export async function createNewPatient(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Patient added!");
    resetForm();
    loadPatients();
  }
}

// Load a patient into the form for editing
export async function editPatient(id) {
  const patient = await apiGetOne(id);

  setState({ editingId: id });
  fillForm(patient);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing patient
export async function updatePatient(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadPatients();
  }
}

// Delete a patient
export async function deletePatientAction(id) {
  if (!confirm("Delete this patient?")) return;

  const res = await apiDelete(id);
 	if (res.ok) {
    showAlert("Deleted!");
    loadPatients();
  }
}
