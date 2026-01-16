import { $ } from "../utils/dom.js";
import { editBill, deleteBillAction } from "../controllers/billingController.js";

// Renders the list of bills into an HTML table
export function renderBillingTable(bills) {
  // Get references to the table body where rows will be inserted and the 'no bills' message
  const body = $("billingsTableBody");
  const noBills = $("noBills");

  // Clear any existing rows from the table body before rendering new data
  body.innerHTML = "";

  // Check if the billing array is empty
  if (bills.length === 0) {
    // If no bills are found, display the 'no bills' message and stop execution
    noBills.style.display = "block";
    return;
  }

  // If bills exist, hide the 'no bills' message
  noBills.style.display = "none";

  // Iterate over each bill object in the provided array
  bills.forEach(bill => {
    // Create a new table row element for the current bill
    const row = document.createElement("tr");
    row.className = "border-b";

    // Populate the row with dynamic HTML content using a template literal
    row.innerHTML = `
      <td class="px-3 py-2">${bill.patient_id}</td>
      <td class="px-3 py-2">${bill.doctor_attended}</td>
      <td class="px-3 py-2">${bill.amount}</td>
      <td class="px-3 py-2">${bill.bill_date}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${bill.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${bill.id}">Delete</button>
      </td>
    `;

    // Attach event listeners to the newly created buttons
    row.querySelector("[data-edit]").onclick = () => editBill(bill.id);
    row.querySelector("[data-delete]").onclick = () => deleteBillAction(bill.id);

    // Append the fully constructed row to the table body
    body.appendChild(row);
  });
}
