console.log("✅ initBillingController module loaded");

import { 
  apiGetAll,
  apiGetOne,
  apiCreate,
  apiUpdate,
  apiDelete
} from "../services/billingService.js";

import { showAlert } from "../components/Alert.js";
import { renderBillingTable } from "../components/BillingTable.js";
import { resetForm, fillForm } from "../components/BillingForm.js";

import { setState, getState } from "../state/store.js";
import { $, createElement } from "../utils/dom.js";

// --------------------------------------------------
// Initialize Billing Controller
// --------------------------------------------------
export function initBillingController() {
  // Load billing data immediately
  loadBills();

  // Handle billing form submission
  $("billingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      patient_id: $("patient_id").value.trim(),
      doctor_attended: $("doctor_attended").value.trim(),
      amount: $("amount").value.trim(),
      bill_date: $("bill_date").value.trim()
    };

    const { editingId } = getState();

    editingId
      ? await updateBill(editingId, data)
      : await createNewBill(data);
  });

  // Handle cancel button
  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}

// --------------------------------------------------
// Load all bills
// --------------------------------------------------
export async function loadBills() {
  const spinner = $("loadingSpinner");
  const table = $("billingsTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const bills = await apiGetAll();

  setState({ bills });
  renderBillingTable(bills);

  spinner.style.display = "none";
  table.style.display = "block";
}

/* ==================================================
   CRUD OPERATIONS (Enable when backend is ready)
   ================================================== */

// Create a new bill
export async function createNewBill(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Bill added successfully!");
    resetForm();
    loadBills();
  }
}

// Load a bill for editing
export async function editBill(id) {
  const bill = await apiGetOne(id);

  setState({ editingId: id });
  fillForm(bill);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing bill
export async function updateBill(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Bill updated!");
    resetForm();
    setState({ editingId: null });
    loadBills();
  }
}

// Delete a bill
export async function deleteBillAction(id) {
  if (!confirm("Delete this bill?")) return;

  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Bill deleted!");
    loadBills();
  }
}
