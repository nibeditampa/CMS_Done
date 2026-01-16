import { $, createElement } from "../utils/dom.js";

// Resets the input form to its default state for creating a new bill
export function resetForm() {
  // Use the native .reset() method on the HTML form element
  $("billingForm").reset();

  // Change the submit button text back to "Add Bill"
  $("submitBtn").textContent = "Add Bill";

  // Hide the "Cancel" button, as we are no longer in 'edit' mode
  $("cancelBtn").style.display = "none";
}

// Populates the input form fields with data from a selected bill object (for editing)
export function fillForm(bill) {
  // Fill each input field with the corresponding property from the bill data
  $("patient_id").value = bill.patient_id;
  $("doctor_attended").value = bill.doctor_attended;
  $("amount").value = bill.amount;
  $("bill_date").value = bill.bill_date;

  // Change the submit button text to "Update Bill"
  $("submitBtn").textContent = "Update Bill";

  // Show the "Cancel" button, allowing the user to exit 'edit' mode
  $("cancelBtn").style.display = "inline-block";
}
