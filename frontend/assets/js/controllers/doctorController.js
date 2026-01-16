console.log("✅ initDoctorController module loaded");
import { 
    apiGetAll, 
    apiGetOne, 
    apiCreate, 
    apiUpdate, 
    apiDelete 
} from "../services/doctorService.js";

import { showAlert } from "../components/Alert.js";
import { renderDoctorTable } from "../components/DoctorTable.js";
import { resetForm, fillForm } from "../components/DoctorForm.js";

import { setState, getState } from "../state/store.js";
import { $, createElement } from "../utils/dom.js";

// Setup event listeners and load initial data
// Initialize the main logic and set up all necessary event listeners
export function initDoctorController() {
  // Start by fetching and displaying all doctor data immediately upon load
  loadDoctors();

  // --- Handle Form Submissions ---

  // Attach a listener to the 'submit' event of the doctor input form
  $("doctorForm").addEventListener("submit", async (e) => {
    // Prevent the browser's default form submission behavior (page refresh)
    e.preventDefault();

    // Collect data from the input fields using the custom '$' selector
    const data = {
      name: $("name").value.trim(),                 // Get doctor name
      specialization: $("specialization").value.trim(), // Get specialization
      schedule: $("schedule").value.trim(),     // Get schedule
      contact: $("contact").value.trim()             // Get contact
    };

    // Check the application state to see if we are currently editing an existing record
    const { editingId } = getState();

    // Use a ternary operator to decide which action to take:
    editingId
      ? await updateDoctor(editingId, data) // If editingId exists, update the doctor
      : await createNewDoctor(data);        // Otherwise, create a new doctor
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


// Fetch all doctor data from the API and update the user interface
export async function loadDoctors() {
  // Get references to the loading spinner and the main data table elements
  const spinner = $("loadingSpinner");
  const table = $("doctorsTableContainer");

  // Show the spinner and hide the table to indicate a loading state
  spinner.style.display = "block";
  table.style.display = "none";

  // Asynchronously fetch all doctor records from the backend API
  const doctors = await apiGetAll();

  // Store the retrieved doctor array in the application's global state
  setState({ doctors });
  // Render the fetched doctor data into the HTML table structure
  renderDoctorTable(doctors);

  // Hide the spinner and show the table now that the data is loaded and displayed
  spinner.style.display = "none";
  table.style.display = "block";
}


// Create a new doctor
export async function createNewDoctor(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Doctor added!");
    resetForm();
    loadDoctors();
  }
}

// Load a doctor into the form for editing
export async function editDoctor(id) {
  const doctor = await apiGetOne(id);

  setState({ editingId: id });
  fillForm(doctor);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing doctor
export async function updateDoctor(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadDoctors();
  }
}

// Delete a doctor
export async function deleteDoctorAction(id) {
  if (!confirm("Delete this doctor?")) return;

  const res = await apiDelete(id);
 	if (res.ok) {
    showAlert("Deleted!");
    loadDoctors();
  }
}
