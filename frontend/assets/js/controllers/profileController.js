import { apiGetAll as getPatients } from "../services/patientService.js";
import { apiGetAll as getBillings } from "../services/billingService.js";

export async function loadPatientProfile(patientId) {
  const container = document.getElementById("profileContainer");

  try {
    const patients = await getPatients();

    const patient = patients.find(p => p.id == patientId);

    if (!patient) {
      container.innerHTML = "<p>Patient not found</p>";
      return;
    }

    const bills = await getBillings();
    const patientBills = bills.filter(b => b.patient_id == patientId);

    container.innerHTML = `
      <div class="bg-white p-6 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-3">Basic Details</h2>
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Age:</strong> ${patient.age}</p>
        <p><strong>Gender:</strong> ${patient.gender}</p>
        <p><strong>Contact:</strong> ${patient.contact}</p>
      </div>

      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-3">Billing History</h2>

        ${patientBills.length === 0
        ? "<p>No bills found</p>"
        : `
              <table class="min-w-full border text-sm">
                <thead class="bg-gray-200">
                  <tr>
                    <th class="px-3 py-2">Doctor</th>
                    <th class="px-3 py-2">Amount</th>
                    <th class="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${patientBills.map(b => `
                    <tr class="border-t">
                      <td class="px-3 py-2">${b.doctor_attended}</td>
                      <td class="px-3 py-2">₹${b.amount}</td>
                      <td class="px-3 py-2">${b.bill_date}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            `
      }
      </div>
    `;

    setupExports(patient, "patient_profile");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load patient profile</p>";
  }
}

import { apiGetAll as getDoctors } from "../services/doctorService.js";

export async function loadDoctorProfile(doctorId) {
  const container = document.getElementById("profileContainer");

  try {
    const doctors = await getDoctors();
    const doctor = doctors.find(d => d.id == doctorId);

    if (!doctor) {
      container.innerHTML = "<p>Doctor not found</p>";
      return;
    }

    container.innerHTML = `
      <div class="bg-white p-6 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-3">Doctor Details</h2>
        <p><strong>Name:</strong> ${doctor.name}</p>
        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        <p><strong>Contact:</strong> ${doctor.contact || 'N/A'}</p>
        <p><strong>Schedule:</strong> ${doctor.schedule || 'N/A'}</p>
      </div>
    `;

    setupExports(doctor, "doctor_profile");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load doctor profile</p>";
  }
}

export async function loadBillProfile(billId) {
  const container = document.getElementById("profileContainer");

  try {
    const bills = await getBillings();
    const bill = bills.find(b => b.id == billId);

    if (!bill) {
      container.innerHTML = "<p>Bill not found</p>";
      return;
    }

    container.innerHTML = `
      <div class="bg-white p-6 rounded shadow mb-6">
        <h2 class="text-xl font-semibold mb-3">Bill Details</h2>
        <p><strong>Bill ID:</strong> ${bill.id}</p>
        <p><strong>Patient ID:</strong> ${bill.patient_id}</p>
        <p><strong>Doctor:</strong> ${bill.doctor_attended}</p>
        <p><strong>Amount:</strong> ₹${bill.amount}</p>
        <p><strong>Date:</strong> ${bill.bill_date}</p>
      </div>
    `;
    setupExports(bill, "bill_profile");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load bill profile</p>";
  }
}

function setupExports(data, filename) {
  const csvBtn = document.getElementById("exportCsvBtn");
  const pdfBtn = document.getElementById("exportPdfBtn");

  if (csvBtn) {
    // Clone to remove old listeners if any (though usually DOM is fresh)
    const newCsvBtn = csvBtn.cloneNode(true);
    csvBtn.parentNode.replaceChild(newCsvBtn, csvBtn);

    newCsvBtn.addEventListener("click", () => {
      const headers = Object.keys(data).join(",");
      const values = Object.values(data).map(v => `"${v}"`).join(",");
      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + values;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (pdfBtn) {
    const newPdfBtn = pdfBtn.cloneNode(true);
    pdfBtn.parentNode.replaceChild(newPdfBtn, pdfBtn);

    newPdfBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
