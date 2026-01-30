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

// Initialize the main logic and set up all necessary event listeners
export function initDoctorController() {
  loadDoctors();

  // --- Search and Sort Listeners (NEW) ---
  $("searchInput").addEventListener("input", () => applyFilters());
  $("sortSelect").addEventListener("change", () => applyFilters());

  // --- Handle Form Submissions ---
  $("doctorForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: $("name").value.trim(),             
      specialization: $("specialization").value.trim(), 
      schedule: $("schedule").value.trim(),     
      contact: $("contact").value.trim()            
    };

    const { editingId } = getState();

    editingId
      ? await updateDoctor(editingId, data) 
      : await createNewDoctor(data);        
  });

  // --- Handle Cancel Button Click ---
  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}

// Logic to filter and sort the data locally without hitting the API again
export function applyFilters() {
  const { doctors } = getState();
  const searchTerm = $("searchInput").value.toLowerCase();
  const sortType = $("sortSelect").value;

  // 1. Filter by Name or Specialization
  let filtered = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm) || 
    doc.specialization.toLowerCase().includes(searchTerm)
  );

  // 2. Sort Logic
  filtered.sort((a, b) => {
    switch (sortType) {
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "specialty": return a.specialization.localeCompare(b.specialization);
      case "newest": default: return b.id - a.id; // Default: Newest first
    }
  });

  // 3. Render
  renderDoctorTable(filtered);
}

// Fetch all doctor data from the API and update the user interface
export async function loadDoctors() {
  const spinner = $("loadingSpinner");
  const table = $("doctorsTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const doctors = await apiGetAll();
  setState({ doctors });
  
  // Use applyFilters instead of rendering directly to respect current search/sort
  applyFilters();

  spinner.style.display = "none";
  table.style.display = "block";
}

// ... (Create, Edit, Update, Delete functions remain exactly the same as your original code) ...

export async function createNewDoctor(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Doctor added!");
    resetForm();
    loadDoctors();
  }
}

export async function editDoctor(id) {
  const doctor = await apiGetOne(id);
  setState({ editingId: id });
  fillForm(doctor);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export async function updateDoctor(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadDoctors();
  }
}

export async function deleteDoctorAction(id) {
  if (!confirm("Delete this doctor?")) return;
  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Deleted!");
    loadDoctors();
  }
}