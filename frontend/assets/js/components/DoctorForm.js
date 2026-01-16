import { $, createElement } from "../utils/dom.js";

// Resets the input form to its default state for creating a new doctor
export function resetForm() {
  // Use the native .reset() method on the HTML form element
  $("doctorForm").reset();

  // Change the submit button text back to "Add Doctor"
  $("submitBtn").textContent = "Add Doctor";

  // Hide the "Cancel" button, as we are no longer in 'edit' mode
  $("cancelBtn").style.display = "none";
}

// Populates the input form fields with data from a selected doctor object (for editing)
export function fillForm(doctor) {
  // Fill each input field with the corresponding property from the doctor data
  $("name").value = doctor.name;
  $("specialization").value = doctor.specialization;
  $("schedule").value = doctor.schedule;
  $("contact").value = doctor.contact;

  // Change the submit button text to "Update Doctor"
  $("submitBtn").textContent = "Update Doctor";

  // Show the "Cancel" button, allowing the user to exit 'edit' mode
  $("cancelBtn").style.display = "inline-block";
}
