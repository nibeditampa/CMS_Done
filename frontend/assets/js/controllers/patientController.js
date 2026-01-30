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

/**
 * 1. Initialize Controller
 * Added event listeners for searchInput and sortSelect
 */
export function initPatientController() {
  loadPatients();

  // --- Search and Sort Listeners (NEW) ---
  // These trigger every time the user types or changes the dropdown
  $("searchInput").addEventListener("input", () => applyFilters());
  $("sortSelect").addEventListener("change", () => applyFilters());

  // --- Handle Form Submissions ---
  $("patientForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: $("name").value.trim(),
      age: $("age").value.trim(),
      gender: $("gender").value.trim(),
      contact: $("contact").value.trim()
    };

    const { editingId } = getState();

    editingId
      ? await updatePatient(editingId, data)
      : await createNewPatient(data);
  });

  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}

/**
 * 2. Filter and Sort Logic (NEW FUNCTION)
 * This is added as a standalone function to process data locally
 */
export function applyFilters() {
  const { patients } = getState();
  const searchTerm = $("searchInput").value.toLowerCase();
  const sortType = $("sortSelect").value;

  // Step A: Filter by Name or Contact
  let filtered = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.contact.includes(searchTerm)
  );

  // Step B: Apply Sorting
  filtered.sort((a, b) => {
    switch (sortType) {
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "age-asc": return a.age - b.age;
      case "age-desc": return b.age - a.age;
      case "newest": default: return b.id - a.id; 
    }
  });

  // Step C: Render only the filtered/sorted results
  renderPatientTable(filtered);
}

/**
 * 3. Load Patients
 * Modified to call applyFilters() instead of direct rendering
 */
export async function loadPatients() {
  const spinner = $("loadingSpinner");
  const table = $("patientsTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const patients = await apiGetAll();
  setState({ patients });
  
  // Apply current search/sort filters to the newly fetched data
  applyFilters();

  spinner.style.display = "none";
  table.style.display = "block";
}

// --- Remaining Actions (unchanged) ---

export async function createNewPatient(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Patient added!");
    resetForm();
    loadPatients();
  }
}

export async function editPatient(id) {
  const patient = await apiGetOne(id);
  setState({ editingId: id });
  fillForm(patient);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function updatePatient(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadPatients();
  }
}

export async function deletePatientAction(id) {
  if (!confirm("Delete this patient?")) return;
  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Deleted!");
    loadPatients();
  }
}